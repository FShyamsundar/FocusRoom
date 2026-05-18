import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api } from "../../lib/axios";

export const fetchActivePresence = createAsyncThunk("focus/active", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/focus/active");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to load presence");
  }
});

export const fetchTodayCompletions = createAsyncThunk("focus/today", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/focus/today");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to load today list");
  }
});

export const fetchPublicFeed = createAsyncThunk("focus/feed", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/logs/feed");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to load feed");
  }
});

const initialState = {
  draftTaskName: "",
  draftDuration: 25,
  activeSession: null,
  presence: [],
  presenceCount: 0,
  completedToday: [],
  publicFeed: [],
  loading: false,
  error: null,
  socketConnected: false,
};

const stampPresence = (sessions = []) =>
  sessions.map((session) => ({
    ...session,
    syncedAt: Date.now(),
  }));

const focusSlice = createSlice({
  name: "focus",
  initialState,
  reducers: {
    setDraftTaskName: (state, action) => {
      state.draftTaskName = action.payload;
    },
    setDraftDuration: (state, action) => {
      state.draftDuration = action.payload;
    },
    startLocalSession: (state, action) => {
      const { taskName, duration, startedAt } = action.payload;
      state.activeSession = {
        sessionId: null,
        taskName,
        duration,
        startedAt,
        remainingSeconds: duration * 60,
        isPaused: false,
        isFinished: false,
        isCompleting: false,
      };
      state.error = null;
    },
    linkSocketSession: (state, action) => {
      if (!state.activeSession) {
        return;
      }

      state.activeSession.sessionId = action.payload.sessionId;
      state.activeSession.startedAt = action.payload.startedAt;
    },
    pauseLocalSession: (state) => {
      if (state.activeSession) {
        state.activeSession.isPaused = true;
      }
    },
    resumeLocalSession: (state) => {
      if (state.activeSession) {
        state.activeSession.isPaused = false;
      }
    },
    tickTimer: (state) => {
      if (!state.activeSession || state.activeSession.isPaused || state.activeSession.isFinished) {
        return;
      }

      if (state.activeSession.remainingSeconds > 0) {
        state.activeSession.remainingSeconds -= 1;
      }

      if (state.activeSession.remainingSeconds === 0) {
        state.activeSession.isFinished = true;
      }
    },
    completeSession: (state) => {
      state.activeSession = null;
      state.draftTaskName = "";
      state.error = null;
    },
    beginSessionCompletion: (state) => {
      if (state.activeSession) {
        state.activeSession.isPaused = true;
        state.activeSession.isCompleting = true;
      }
    },
    syncPresence: (state, action) => {
      state.presence = stampPresence(action.payload.sessions);
      state.presenceCount = action.payload.count;
    },
    hydrateSessionFromPresence: (state, action) => {
      state.activeSession = {
        sessionId: action.payload.sessionId,
        taskName: action.payload.taskName,
        duration: action.payload.duration,
        startedAt: action.payload.startedAt,
        remainingSeconds: Math.max(action.payload.duration * 60 - action.payload.elapsedSeconds, 0),
        isPaused: action.payload.isPaused,
        isFinished: action.payload.duration * 60 - action.payload.elapsedSeconds <= 0,
        isCompleting: false,
      };
    },
    setPublicFeed: (state, action) => {
      state.publicFeed = action.payload;
    },
    setFocusError: (state, action) => {
      state.error = action.payload;
      if (state.activeSession?.isCompleting) {
        state.activeSession.isCompleting = false;
      }
    },
    clearFocusError: (state) => {
      state.error = null;
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivePresence.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivePresence.fulfilled, (state, action) => {
        state.loading = false;
        state.presence = stampPresence(action.payload.sessions);
        state.presenceCount = action.payload.count;
      })
      .addCase(fetchActivePresence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTodayCompletions.fulfilled, (state, action) => {
        state.completedToday = action.payload;
      })
      .addCase(fetchPublicFeed.fulfilled, (state, action) => {
        state.publicFeed = action.payload;
      });
  },
});

export const {
  beginSessionCompletion,
  clearFocusError,
  completeSession,
  hydrateSessionFromPresence,
  linkSocketSession,
  pauseLocalSession,
  resumeLocalSession,
  setDraftDuration,
  setDraftTaskName,
  setFocusError,
  setPublicFeed,
  setSocketConnected,
  startLocalSession,
  syncPresence,
  tickTimer,
} = focusSlice.actions;

export default focusSlice.reducer;
