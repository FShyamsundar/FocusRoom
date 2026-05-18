import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api } from "../../lib/axios";
import { disconnectSocket } from "../../lib/socket";

const token = localStorage.getItem("focusroom-token");

export const registerUser = createAsyncThunk("auth/register", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const fetchCurrentUser = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to load account");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.initialized = true;
      state.error = null;
      localStorage.removeItem("focusroom-token");
      disconnectSocket();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          streakCount: action.payload.streakCount,
          totalFocusHours: action.payload.totalFocusHours,
          lastSessionDate: action.payload.lastSessionDate,
        };
        state.token = action.payload.token;
        state.initialized = true;
        localStorage.setItem("focusroom-token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          streakCount: action.payload.streakCount,
          totalFocusHours: action.payload.totalFocusHours,
          lastSessionDate: action.payload.lastSessionDate,
        };
        state.token = action.payload.token;
        state.initialized = true;
        localStorage.setItem("focusroom-token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload;
        if (state.token) {
          state.token = null;
          localStorage.removeItem("focusroom-token");
        }
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

