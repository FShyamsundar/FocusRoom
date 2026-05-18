import jwt from "jsonwebtoken";

import { CompletionLog } from "../models/CompletionLog.js";
import { FocusSession } from "../models/FocusSession.js";
import { User } from "../models/User.js";
import {
  getActiveConnectionCount,
  getPresence,
  getPresenceList,
  pausePresence,
  registerConnection,
  removePresence,
  resumePresence,
  setPresence,
  unregisterConnection,
} from "../services/presenceService.js";
import { getDayDifference, getStartOfDay } from "../utils/date.js";

const MIN_DURATION = 5;
const MAX_DURATION = 180;

const updateUserStreak = async (user, completedAt, focusDuration) => {
  if (!user.lastSessionDate) {
    user.streakCount = 1;
  } else {
    const gap = getDayDifference(completedAt, user.lastSessionDate);

    if (gap === 1) {
      user.streakCount += 1;
    } else if (gap > 1) {
      user.streakCount = 1;
    }
  }

  user.lastSessionDate = completedAt;
  user.totalFocusHours = Number((user.totalFocusHours + focusDuration / 60).toFixed(2));
  await user.save();
};

const getRecentFeed = async () => {
  const logs = await CompletionLog.find({})
    .sort({ completedAt: -1 })
    .limit(8)
    .populate("userId", "name")
    .lean();

  return logs.map((log) => ({
    _id: log._id,
    taskName: log.taskName,
    completedAt: log.completedAt,
    focusDuration: log.focusDuration,
    user: {
      _id: log.userId?._id,
      name: log.userId?.name || "Unknown",
    },
  }));
};

const getCurrentPresenceSnapshot = (userId) =>
  getPresenceList().find((entry) => entry.userId === userId) || null;

const broadcastPresence = (io) => {
  io.emit("presence:update", {
    count: getPresenceList().length,
    sessions: getPresenceList(),
  });
};

const emitSocketError = (socket, message) => {
  socket.emit("presence:error", { message });
};

const getHandshakeToken = (socket) => {
  const authToken = socket.handshake.auth?.token;
  const headerToken = socket.handshake.headers?.authorization?.split(" ")[1];
  return authToken || headerToken;
};

const authenticateSocket = async (socket, next) => {
  try {
    const token = getHandshakeToken(socket);

    if (!token) {
      return next(new Error("Not authorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error("Authentication failed"));
  }
};

export const registerFocusSocketHandlers = (io) => {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    registerConnection(userId, socket.id);

    socket.emit("presence:update", {
      count: getPresenceList().length,
      sessions: getPresenceList(),
    });

    socket.on("focus:start", async (payload = {}) => {
      try {
        const { taskName, duration, startedAt } = payload;

        if (!taskName?.trim()) {
          emitSocketError(socket, "Task name is required");
          return;
        }

        if (
          !Number.isFinite(Number(duration)) ||
          !Number.isInteger(Number(duration)) ||
          Number(duration) < MIN_DURATION ||
          Number(duration) > MAX_DURATION
        ) {
          emitSocketError(
            socket,
            `Duration must be between ${MIN_DURATION} and ${MAX_DURATION} minutes`
          );
          return;
        }

        await FocusSession.deleteMany({ userId, status: "active" });
        removePresence(userId);

        const session = await FocusSession.create({
          userId,
          taskName: taskName.trim(),
          duration: Number(duration),
          startedAt: startedAt ? new Date(startedAt) : new Date(),
          status: "active",
        });

        setPresence({
          sessionId: session._id.toString(),
          userId,
          name: socket.user.name,
          taskName: session.taskName,
          duration: session.duration,
          startedAt: session.startedAt,
          socketId: socket.id,
        });

        socket.emit("focus:started", {
          sessionId: session._id,
          startedAt: session.startedAt,
        });
        broadcastPresence(io);
      } catch (error) {
        emitSocketError(socket, error.message);
      }
    });

    socket.on("focus:pause", async () => {
      const paused = pausePresence(userId);

      if (!paused) {
        emitSocketError(socket, "No active session to pause");
        return;
      }

      broadcastPresence(io);
    });

    socket.on("focus:resume", async () => {
      const resumed = resumePresence(userId);

      if (!resumed) {
        emitSocketError(socket, "No paused session to resume");
        return;
      }

      broadcastPresence(io);
    });

    socket.on("focus:end", async (payload = {}) => {
      try {
        const activePresence = getPresence(userId);
        const activeSnapshot = getCurrentPresenceSnapshot(userId);
        const sessionId = payload.sessionId || activePresence?.sessionId;

        if (!sessionId) {
          emitSocketError(socket, "Session not found");
          return;
        }

        const session = await FocusSession.findOne({
          _id: sessionId,
          userId,
          status: "active",
        });

        if (!session) {
          emitSocketError(socket, "Active session not found");
          return;
        }

        const completedAt = new Date();
        const elapsedSeconds = activeSnapshot?.elapsedSeconds
          ? activeSnapshot.elapsedSeconds
          : Math.floor((completedAt.getTime() - new Date(session.startedAt).getTime()) / 1000);
        const focusDuration = Math.max(1, Math.round(elapsedSeconds / 60));

        session.endedAt = completedAt;
        session.status = "completed";
        await session.save();

        await CompletionLog.create({
          userId,
          taskName: session.taskName,
          completedAt,
          focusDuration,
        });

        const user = await User.findById(userId);
        await updateUserStreak(user, completedAt, focusDuration);

        removePresence(userId);
        const recentFeed = await getRecentFeed();

        socket.emit("focus:completed", {
          sessionId,
          completedAt,
          focusDuration,
          dateKey: getStartOfDay(completedAt).toISOString(),
        });
        broadcastPresence(io);
        io.emit("feed:update", recentFeed);
      } catch (error) {
        emitSocketError(socket, error.message);
      }
    });

    socket.on("disconnect", async () => {
      const remainingConnections = unregisterConnection(userId, socket.id);

      if (remainingConnections > 0 || getActiveConnectionCount(userId) > 0) {
        return;
      }

      await FocusSession.deleteMany({ userId, status: "active" });
      removePresence(userId);
      broadcastPresence(io);
    });
  });
};
