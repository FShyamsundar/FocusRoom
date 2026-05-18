import { CompletionLog } from "../models/CompletionLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getStartOfDay } from "../utils/date.js";
import { getPresenceList } from "../services/presenceService.js";

export const getActivePresence = asyncHandler(async (req, res) => {
  res.json({
    count: getPresenceList().length,
    sessions: getPresenceList(),
  });
});

export const getTodayCompletions = asyncHandler(async (req, res) => {
  const startOfDay = getStartOfDay();
  const logs = await CompletionLog.find({
    userId: req.user._id,
    completedAt: { $gte: startOfDay },
  })
    .sort({ completedAt: -1 })
    .lean();

  res.json(logs);
});

