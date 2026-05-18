import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import communityReducer from "../features/community/communitySlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import focusReducer from "../features/focus/focusSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    focus: focusReducer,
    dashboard: dashboardReducer,
    community: communityReducer,
  },
});
