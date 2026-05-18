const connections = new Map();
const presenceMap = new Map();

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const getElapsedSeconds = (entry) => {
  const startedAt = new Date(entry.startedAt).getTime();
  const pausedUntil = entry.isPaused ? new Date(entry.pausedAt).getTime() : Date.now();
  const effectiveMs = pausedUntil - startedAt - entry.totalPausedMs;
  return Math.max(0, Math.floor(effectiveMs / 1000));
};

export const registerConnection = (userId, socketId) => {
  const nextConnections = connections.get(userId) || new Set();
  nextConnections.add(socketId);
  connections.set(userId, nextConnections);
};

export const unregisterConnection = (userId, socketId) => {
  const nextConnections = connections.get(userId);

  if (!nextConnections) {
    return 0;
  }

  nextConnections.delete(socketId);

  if (!nextConnections.size) {
    connections.delete(userId);
    return 0;
  }

  connections.set(userId, nextConnections);
  return nextConnections.size;
};

export const setPresence = (entry) => {
  presenceMap.set(entry.userId, {
    ...entry,
    initials: getInitials(entry.name),
    isPaused: entry.isPaused || false,
    pausedAt: entry.pausedAt || null,
    totalPausedMs: entry.totalPausedMs || 0,
  });
};

export const getPresence = (userId) => presenceMap.get(userId);

export const removePresence = (userId) => {
  presenceMap.delete(userId);
};

export const pausePresence = (userId) => {
  const entry = presenceMap.get(userId);

  if (!entry || entry.isPaused) {
    return null;
  }

  const pausedAt = new Date();
  const nextEntry = {
    ...entry,
    isPaused: true,
    pausedAt,
  };
  presenceMap.set(userId, nextEntry);
  return nextEntry;
};

export const resumePresence = (userId) => {
  const entry = presenceMap.get(userId);

  if (!entry || !entry.isPaused) {
    return null;
  }

  const pausedAt = new Date(entry.pausedAt).getTime();
  const now = Date.now();
  const nextEntry = {
    ...entry,
    isPaused: false,
    pausedAt: null,
    totalPausedMs: entry.totalPausedMs + (now - pausedAt),
  };
  presenceMap.set(userId, nextEntry);
  return nextEntry;
};

export const getPresenceList = () =>
  Array.from(presenceMap.values())
    .map((entry) => ({
      sessionId: entry.sessionId,
      userId: entry.userId,
      name: entry.name,
      initials: entry.initials,
      taskName: entry.taskName,
      duration: entry.duration,
      startedAt: entry.startedAt,
      isPaused: entry.isPaused,
      elapsedSeconds: getElapsedSeconds(entry),
    }))
    .sort((left, right) => new Date(left.startedAt) - new Date(right.startedAt));

export const getActiveConnectionCount = (userId) => (connections.get(userId) || new Set()).size;

