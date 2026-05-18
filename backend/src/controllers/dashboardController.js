import { CompletionLog } from "../models/CompletionLog.js";
import { FocusSession } from "../models/FocusSession.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getLast7DayBuckets, getStartOfDay } from "../utils/date.js";

const formatBucketLabel = (date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(date);

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const [totalSessions, completedTasks, activeSession, recentLogs] = await Promise.all([
    FocusSession.countDocuments({ userId: req.user._id, status: "completed" }),
    CompletionLog.countDocuments({ userId: req.user._id }),
    FocusSession.findOne({ userId: req.user._id, status: "active" }).lean(),
    CompletionLog.find({ userId: req.user._id }).sort({ completedAt: -1 }).limit(20).lean(),
  ]);

  const today = getStartOfDay();
  const todaysLogs = recentLogs.filter((log) => new Date(log.completedAt) >= today);
  const averageSessionMinutes = recentLogs.length
    ? recentLogs.reduce((sum, log) => sum + log.focusDuration, 0) / recentLogs.length
    : 0;

  res.json({
    stats: {
      totalSessions,
      completedTasks,
      currentStreak: req.user.streakCount,
      totalFocusHours: req.user.totalFocusHours,
      activeToday: todaysLogs.length,
      averageSessionMinutes: Number(averageSessionMinutes.toFixed(1)),
    },
    activeSession,
    recentLogs,
    insights: [
      `You completed ${todaysLogs.length} focused block${todaysLogs.length === 1 ? "" : "s"} today.`,
      `Your average completed sprint is ${Math.round(averageSessionMinutes || 0)} minutes.`,
      req.user.streakCount > 1
        ? `You are on a ${req.user.streakCount}-day streak. Keep the chain alive.`
        : "Complete one session tomorrow to start building a streak.",
    ],
  });
});

export const getWeeklyAnalytics = asyncHandler(async (req, res) => {
  const buckets = getLast7DayBuckets();
  const startDate = buckets[0];

  const logs = await CompletionLog.find({
    userId: req.user._id,
    completedAt: { $gte: startDate },
  }).lean();

  const chart = buckets.map((date) => ({
    label: formatBucketLabel(date),
    date: date.toISOString(),
    minutes: 0,
    sessions: 0,
  }));

  logs.forEach((log) => {
    const bucketIndex = chart.findIndex((bucket) => {
      const bucketDate = getStartOfDay(bucket.date).getTime();
      return bucketDate === getStartOfDay(log.completedAt).getTime();
    });

    if (bucketIndex >= 0) {
      chart[bucketIndex].minutes += log.focusDuration;
      chart[bucketIndex].sessions += 1;
    }
  });

  res.json({
    chart: chart.map((bucket) => ({
      ...bucket,
      hours: Number((bucket.minutes / 60).toFixed(2)),
    })),
  });
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const leaders = await User.find({}, "name totalFocusHours streakCount")
    .sort({ totalFocusHours: -1, streakCount: -1, updatedAt: 1 })
    .limit(10)
    .lean();

  const currentUserRank =
    (await User.countDocuments({
      $or: [
        { totalFocusHours: { $gt: req.user.totalFocusHours } },
        {
          totalFocusHours: req.user.totalFocusHours,
          streakCount: { $gt: req.user.streakCount },
        },
      ],
    })) + 1;

  res.json({
    leaders: leaders.map((leader, index) => ({
      _id: leader._id,
      rank: index + 1,
      name: leader.name,
      totalFocusHours: leader.totalFocusHours,
      streakCount: leader.streakCount,
      isCurrentUser: leader._id.toString() === req.user._id.toString(),
    })),
    currentUserRank,
  });
});
