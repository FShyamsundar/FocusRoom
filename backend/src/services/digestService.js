import cron from "node-cron";

import { CompletionLog } from "../models/CompletionLog.js";
import { User } from "../models/User.js";
import { getStartOfDay } from "../utils/date.js";
import { sendEmail } from "../utils/sendEmail.js";

const buildDigestMarkup = ({ name, totalMinutes, completedTasks, streakCount }) => `
  <div style="font-family: Arial, sans-serif; color: #111827;">
    <h2>FocusRoom weekly digest</h2>
    <p>Hi ${name}, here is your quiet productivity recap for the past 7 days.</p>
    <ul>
      <li>Total focus time: ${(totalMinutes / 60).toFixed(1)} hours</li>
      <li>Completed tasks: ${completedTasks}</li>
      <li>Current streak: ${streakCount} day${streakCount === 1 ? "" : "s"}</li>
    </ul>
    <p>Show up, hit start, and let the room help you stay honest.</p>
  </div>
`;

export const scheduleWeeklyDigest = () => {
  cron.schedule("0 18 * * 0", async () => {
    try {
      const sevenDaysAgo = getStartOfDay(new Date());
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      const users = await User.find({}, "name email streakCount");

      await Promise.all(
        users.map(async (user) => {
          const logs = await CompletionLog.find({
            userId: user._id,
            completedAt: { $gte: sevenDaysAgo },
          }).lean();

          if (!logs.length) {
            return;
          }

          const totalMinutes = logs.reduce((sum, log) => sum + log.focusDuration, 0);

          await sendEmail({
            to: user.email,
            subject: "Your FocusRoom weekly digest",
            html: buildDigestMarkup({
              name: user.name,
              totalMinutes,
              completedTasks: logs.length,
              streakCount: user.streakCount,
            }),
          });
        })
      );
    } catch (error) {
      console.error("Weekly digest job failed", error.message);
    }
  });
};

