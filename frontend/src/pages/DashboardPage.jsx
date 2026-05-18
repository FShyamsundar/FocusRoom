import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import InsightPanel from "../components/dashboard/InsightPanel";
import LeaderboardPanel from "../components/dashboard/LeaderboardPanel";
import StatsGrid from "../components/dashboard/StatsGrid";
import WeeklyFocusChart from "../components/dashboard/WeeklyFocusChart";
import AppShell from "../components/layout/AppShell";
import {
  fetchDashboardOverview,
  fetchLeaderboard,
  fetchWeeklyAnalytics,
} from "../features/dashboard/dashboardSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { insights, recentLogs, stats, weeklyChart, leaderboard, currentUserRank } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardOverview());
    dispatch(fetchWeeklyAnalytics());
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Dashboard</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Measure the shape of your focus</h1>
          <p className="mt-3 max-w-3xl text-muted">
            FocusRoom turns silent accountability into clean analytics, streaks, and a weekly view of your work rhythm.
          </p>
        </div>
        <StatsGrid stats={stats} />
        <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          <WeeklyFocusChart data={weeklyChart} />
          <LeaderboardPanel leaders={leaderboard} currentUserRank={currentUserRank} />
        </div>
        <InsightPanel insights={insights} logs={recentLogs} />
      </div>
    </AppShell>
  );
};

export default DashboardPage;
