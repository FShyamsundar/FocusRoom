import Card from "../common/Card";
import { formatRelativeTime } from "../../utils/formatters";

const PublicActivityFeed = ({ feed }) => (
  <Card className="p-6">
    <p className="text-sm uppercase tracking-[0.22em] text-muted">Public Activity Feed</p>
    <h3 className="mt-2 font-display text-2xl text-ink">Quiet wins from the room</h3>
    <div className="mt-6 space-y-3">
      {feed.length ? (
        feed.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl border border-line bg-platePeach px-4 py-3 text-sm text-ink"
          >
            <span className="font-semibold text-ink">{item.user.name}</span> completed{" "}
            <span className="text-accent">{item.taskName}</span>
            <div className="mt-1 flex items-center justify-between text-xs text-muted">
              <span>{item.focusDuration} min</span>
              <span>{formatRelativeTime(item.completedAt)}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-line px-4 py-6 text-sm text-muted">
          Completed sessions will appear here in real time.
        </div>
      )}
    </div>
  </Card>
);

export default PublicActivityFeed;
