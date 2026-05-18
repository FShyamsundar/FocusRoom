import express from "express";

import { getMyLogs, getPublicFeed } from "../controllers/logController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyLogs);
router.get("/feed", getPublicFeed);

export default router;

