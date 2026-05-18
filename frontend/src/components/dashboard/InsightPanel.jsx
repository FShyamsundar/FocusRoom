import Card from "../common/Card";

const InsightPanel = ({ insights, logs }) => (
  <div className="grid gap-4 xl:grid-cols-[0.8fr,1.2fr]">
    <Card className="p-6">
      <p className="text-sm uppercase tracking-[0.22em] text-muted">Insights</p>
      <div className="mt-4 space-y-3">
        {insights.map((insight) => (
          <div key={insight} className="rounded-2xl border border-line bg-plateMint px-4 py-3 text-sm text-ink">
            {insight}
          </div>
        ))}
      </div>
    </Card>
    <Card className="p-6">
      <p className="text-sm uppercase tracking-[0.22em] text-muted">Recent Completions</p>
      <div className="mt-4 space-y-3">
        {logs.length ? (
          logs.slice(0, 8).map((log) => (
            <div
              key={log._id}
              className="flex items-center justify-between rounded-2xl border border-line bg-plate px-4 py-3"
            >
              <div>
                <p className="font-medium text-ink">{log.taskName}</p>
                <p className="text-xs text-muted">
                  {new Date(log.completedAt).toLocaleDateString()} at{" "}
                  {new Date(log.completedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="rounded-full border border-line bg-plateLemon px-3 py-1 text-xs text-ink">
                {log.focusDuration} min
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-line px-4 py-6 text-sm text-muted">
            Your completed session history will show up here.
          </div>
        )}
      </div>
    </Card>
  </div>
);

export default InsightPanel;
