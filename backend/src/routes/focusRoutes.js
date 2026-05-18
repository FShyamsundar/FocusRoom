import express from "express";

import { getActivePresence, getTodayCompletions } from "../controllers/focusController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/active", protect, getActivePresence);
router.get("/today", protect, getTodayCompletions);

export default router;

