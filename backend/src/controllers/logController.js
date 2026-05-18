import { CompletionLog } from "../models/CompletionLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyLogs = asyncHandler(async (req, res) => {
  const logs = await CompletionLog.find({ userId: req.user._id })
    .sort({ completedAt: -1 })
    .limit(30)
    .lean();

  res.json(logs);
});

export const getPublicFeed = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 10), 20);

  const logs = await CompletionLog.find({})
    .sort({ completedAt: -1 })
    .limit(limit)
    .populate("userId", "name")
    .lean();

  res.json(
    logs.map((log) => ({
      _id: log._id,
      taskName: log.taskName,
      completedAt: log.completedAt,
      focusDuration: log.focusDuration,
      user: {
        _id: log.userId?._id,
        name: log.userId?.name || "Unknown",
      },
    }))
  );
});

