import express from "express";

import {
  getDashboardOverview,
  getLeaderboard,
  getWeeklyAnalytics,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, getDashboardOverview);
router.get("/weekly", protect, getWeeklyAnalytics);
router.get("/leaderboard", protect, getLeaderboard);

export default router;
