import { Clock3, PauseCircle, PlayCircle } from "lucide-react";

import Card from "../common/Card";
import { formatCountdown } from "../../utils/formatters";

const TimerDisplay = ({ session }) => {
  const durationSeconds = (session?.duration || 25) * 60;
  const progress = session ? ((durationSeconds - session.remainingSeconds) / durationSeconds) * 100 : 0;

  return (
    <Card className="overflow-hidden p-5 sm:p-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Live Focus Timer</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              {session?.taskName || "Choose a task and enter the room"}
            </h2>
          </div>
          <div className="rounded-full border border-line bg-plateMint p-4 text-ink">
            {session?.isPaused ? <PauseCircle size={28} /> : <PlayCircle size={28} />}
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.4fr,0.8fr]">
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[28px] border border-line bg-plateBlue p-8">
            <div className="mb-6 flex items-center gap-3 text-muted">
              <Clock3 size={18} />
              <span>{session ? `${session.duration} minute sprint` : "Ready when you are"}</span>
            </div>
            <div className="font-display text-5xl font-bold tracking-tight text-ink sm:text-7xl lg:text-8xl">
              {formatCountdown(session?.remainingSeconds || 0)}
            </div>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-plate">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          <div className="rounded-[28px] border border-line bg-platePeach p-6">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted">State</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-muted">Status</p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  {!session
                    ? "Idle"
                    : session.isCompleting
                      ? "Saving completion"
                    : session.isFinished
                      ? "Ready to complete"
                      : session.isPaused
                        ? "Paused"
                        : "Deep work in progress"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">Silent rule</p>
                <p className="mt-1 text-sm leading-7 text-ink">
                  No chat, no calls, no noise. Presence is the accountability layer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimerDisplay;
