import Card from "../common/Card";

const CompletedTodayList = ({ logs }) => (
  <Card className="p-6">
    <p className="text-sm uppercase tracking-[0.22em] text-muted">Completed Today</p>
    <h3 className="mt-2 font-display text-2xl text-ink">Your finished blocks</h3>
    <div className="mt-6 space-y-3">
      {logs.length ? (
        logs.map((log) => (
          <div
            key={log._id}
            className="flex items-center justify-between rounded-2xl border border-line bg-plate px-4 py-3"
          >
            <div>
              <p className="font-medium text-ink">{log.taskName}</p>
              <p className="text-xs text-muted">
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
          Nothing logged yet today. One completed session is enough to start momentum.
        </div>
      )}
    </div>
  </Card>
);

export default CompletedTodayList;
