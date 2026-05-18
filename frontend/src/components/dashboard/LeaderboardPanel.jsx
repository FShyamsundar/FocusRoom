import Card from "../common/Card";

const LeaderboardPanel = ({ leaders, currentUserRank }) => (
  <Card className="p-6">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-muted">Leaderboard</p>
        <h3 className="mt-2 font-display text-2xl text-ink">Most focused this season</h3>
      </div>
      <div className="rounded-2xl border border-line bg-plateMint px-4 py-3 text-sm text-ink">
        Your rank: <span className="font-semibold">#{currentUserRank || "-"}</span>
      </div>
    </div>
    <div className="mt-6 space-y-3">
      {leaders.length ? (
        leaders.map((leader) => (
          <div
            key={leader._id}
            className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${
              leader.isCurrentUser ? "border-accent bg-accentSoft" : "border-line bg-plate"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-platePeach font-display text-lg text-ink">
                {leader.rank}
              </div>
              <div>
                <p className="font-semibold text-ink">{leader.name}</p>
                <p className="text-xs text-muted">{leader.streakCount} day streak</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-ink">{leader.totalFocusHours} hrs</p>
              <p className="text-xs text-muted">total focus</p>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-line px-4 py-6 text-sm text-muted">
          Leaderboard will populate after users complete sessions.
        </div>
      )}
    </div>
  </Card>
);

export default LeaderboardPanel;
