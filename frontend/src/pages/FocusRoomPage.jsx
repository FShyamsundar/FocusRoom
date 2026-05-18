import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppShell from "../components/layout/AppShell";
import CompletedTodayList from "../components/focus/CompletedTodayList";
import PresenceSidebar from "../components/focus/PresenceSidebar";
import PublicActivityFeed from "../components/focus/PublicActivityFeed";
import SessionControls from "../components/focus/SessionControls";
import TimerDisplay from "../components/focus/TimerDisplay";
import StatsGrid from "../components/dashboard/StatsGrid";
import { fetchDashboardOverview } from "../features/dashboard/dashboardSlice";
import {
  beginSessionCompletion,
  hydrateSessionFromPresence,
  pauseLocalSession,
  resumeLocalSession,
  setFocusError,
  setDraftDuration,
  setDraftTaskName,
  startLocalSession,
} from "../features/focus/focusSlice";
import { useBrowserNotification } from "../hooks/useBrowserNotification";
import { usePomodoro } from "../hooks/usePomodoro";
import { getSocket } from "../lib/socket";

const FocusRoomPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.dashboard);
  const {
    activeSession,
    completedToday,
    draftDuration,
    draftTaskName,
    error,
    presence,
    presenceCount,
    publicFeed,
    socketConnected,
  } = useSelector((state) => state.focus);
  const { permission, notify, requestPermission } = useBrowserNotification();
  const [customDuration, setCustomDuration] = useState("");

  useEffect(() => {
    dispatch(fetchDashboardOverview());
  }, [dispatch]);

  useEffect(() => {
    if (!activeSession && user) {
      const currentPresence = presence.find((session) => session.userId === user._id);

      if (currentPresence) {
        dispatch(hydrateSessionFromPresence(currentPresence));
      }
    }
  }, [activeSession, dispatch, presence, user]);

  const handleElapsed = useCallback(
    (session) => {
      notify({
        title: "FocusRoom timer complete",
        body: `"${session.taskName}" reached its ${session.duration}-minute finish line.`,
      });
    },
    [notify]
  );

  usePomodoro({ onElapsed: handleElapsed });

  const handleStart = () => {
    if (!draftTaskName.trim()) {
      dispatch(setFocusError("Please enter a task before starting."));
      return;
    }

    if (!Number.isFinite(Number(draftDuration)) || Number(draftDuration) < 5 || Number(draftDuration) > 180) {
      dispatch(setFocusError("Choose a duration between 5 and 180 minutes."));
      return;
    }

    if (!getSocket()?.connected) {
      dispatch(setFocusError("Socket connection is still warming up. Please try again."));
      return;
    }

    const startedAt = new Date().toISOString();
    dispatch(startLocalSession({ taskName: draftTaskName.trim(), duration: draftDuration, startedAt }));
    getSocket()?.emit("focus:start", {
      taskName: draftTaskName.trim(),
      duration: draftDuration,
      startedAt,
    });
  };

  const handlePause = () => {
    dispatch(pauseLocalSession());
    getSocket()?.emit("focus:pause");
  };

  const handleResume = () => {
    dispatch(resumeLocalSession());
    getSocket()?.emit("focus:resume");
  };

  const handleDone = () => {
    dispatch(beginSessionCompletion());
    getSocket()?.emit("focus:end", {
      sessionId: activeSession?.sessionId,
      completed: true,
    });
  };

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.5fr,0.8fr]">
        <div className="space-y-6">
          <TimerDisplay session={activeSession} />
          <SessionControls
            activeSession={activeSession}
            customDuration={customDuration}
            draftDuration={draftDuration}
            draftTaskName={draftTaskName}
            notificationsEnabled={permission === "granted"}
            onEnableNotifications={requestPermission}
            onCustomDurationChange={(value) => {
              setCustomDuration(value);
              if (value && Number.isFinite(Number(value))) {
                dispatch(setDraftDuration(Number(value)));
              }
            }}
            onDurationChange={(value) => {
              setCustomDuration("");
              dispatch(setDraftDuration(value));
            }}
            onTaskChange={(value) => dispatch(setDraftTaskName(value))}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onDone={handleDone}
          />
          {error && <p className="px-2 text-sm text-[#9b4d4d]">{error}</p>}
          <StatsGrid
            stats={{
              totalSessions: stats?.totalSessions,
              completedTasks: stats?.completedTasks,
              currentStreak: user?.streakCount,
              totalFocusHours: user?.totalFocusHours,
            }}
          />
        </div>
        <div className="space-y-6">
          <div className="rounded-[28px] border border-line bg-plateBlue px-5 py-4 text-sm text-ink">
            Socket status:{" "}
            <span className={socketConnected ? "text-accent" : "text-[#8a6d2f]"}>
              {socketConnected ? "Connected to live room" : "Reconnecting..."}
            </span>
          </div>
          <PresenceSidebar sessions={presence} count={presenceCount} currentUserId={user?._id} />
          <CompletedTodayList logs={completedToday} />
          <PublicActivityFeed feed={publicFeed} />
        </div>
      </div>
    </AppShell>
  );
};

export default FocusRoomPage;
