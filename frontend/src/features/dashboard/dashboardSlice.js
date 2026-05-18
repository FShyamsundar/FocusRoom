import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api } from "../../lib/axios";

export const fetchDashboardOverview = createAsyncThunk(
  "dashboard/overview",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/dashboard/overview");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to load dashboard overview"
      );
    }
  }
);

export const fetchWeeklyAnalytics = createAsyncThunk(
  "dashboard/weekly",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/dashboard/weekly");
      return data.chart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to load weekly analytics"
      );
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  "dashboard/leaderboard",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/dashboard/leaderboard");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to load leaderboard");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    activeSession: null,
    insights: [],
    recentLogs: [],
    weeklyChart: [],
    leaderboard: [],
    currentUserRank: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.activeSession = action.payload.activeSession;
        state.insights = action.payload.insights;
        state.recentLogs = action.payload.recentLogs;
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWeeklyAnalytics.fulfilled, (state, action) => {
        state.weeklyChart = action.payload;
      })
      .addCase(fetchWeeklyAnalytics.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload.leaders;
        state.currentUserRank = action.payload.currentUserRank;
      });
  },
});

export default dashboardSlice.reducer;
