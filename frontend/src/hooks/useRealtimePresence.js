import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCurrentUser } from "../features/auth/authSlice";
import { fetchCommunityPosts } from "../features/community/communitySlice";
import {
  fetchTodayCompletions,
  fetchPublicFeed,
  fetchActivePresence,
  linkSocketSession,
  setFocusError,
  setPublicFeed,
  syncPresence,
  completeSession,
  setSocketConnected,
} from "../features/focus/focusSlice";
import {
  fetchDashboardOverview,
  fetchLeaderboard,
  fetchWeeklyAnalytics,
} from "../features/dashboard/dashboardSlice";
import { connectSocket, disconnectSocket } from "../lib/socket";

export const useRealtimePresence = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return undefined;
    }

    const socket = connectSocket(token);

    const handleConnect = () => dispatch(setSocketConnected(true));
    const handleDisconnect = () => dispatch(setSocketConnected(false));
    const handlePresenceUpdate = (payload) => dispatch(syncPresence(payload));
    const handleFeedUpdate = (payload) => dispatch(setPublicFeed(payload));
    const handleStarted = (payload) => dispatch(linkSocketSession(payload));
    const handleCompleted = (payload) => {
      dispatch(completeSession(payload));
      dispatch(fetchCurrentUser());
      dispatch(fetchTodayCompletions());
      dispatch(fetchDashboardOverview());
      dispatch(fetchWeeklyAnalytics());
      dispatch(fetchLeaderboard());
    };
    const handleError = (payload) => dispatch(setFocusError(payload.message));
    const handleCommunityUpdate = () => dispatch(fetchCommunityPosts());

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("presence:update", handlePresenceUpdate);
    socket.on("feed:update", handleFeedUpdate);
    socket.on("focus:started", handleStarted);
    socket.on("focus:completed", handleCompleted);
    socket.on("presence:error", handleError);
    socket.on("community:update", handleCommunityUpdate);

    dispatch(fetchActivePresence());
    dispatch(fetchTodayCompletions());
    dispatch(fetchPublicFeed());
    dispatch(fetchCommunityPosts());
    dispatch(fetchLeaderboard());

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("presence:update", handlePresenceUpdate);
      socket.off("feed:update", handleFeedUpdate);
      socket.off("focus:started", handleStarted);
      socket.off("focus:completed", handleCompleted);
      socket.off("presence:error", handleError);
      socket.off("community:update", handleCommunityUpdate);
    };
  }, [dispatch, token]);
};
