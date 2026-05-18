import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import Card from "../common/Card";
import { formatElapsed } from "../../utils/formatters";

const PresenceSidebar = ({ sessions, count, currentUserId }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const getDisplayElapsed = (session) => {
    if (session.isPaused) {
      return session.elapsedSeconds;
    }

    const syncedAt = session.syncedAt || Date.now();
    return session.elapsedSeconds + Math.max(0, Math.floor((now - syncedAt) / 1000));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Live Presence</p>
          <h3 className="mt-2 font-display text-2xl text-ink">Room is alive</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line bg-plateMint px-3 py-2 text-sm text-ink">
          <Users size={16} />
          {count}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {sessions.length ? (
          sessions.map((session) => (
            <div
              key={session.sessionId}
              className="rounded-3xl border border-line bg-plateBlue p-4 transition hover:bg-[#ddeaf9]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-plate font-semibold text-ink">
                  {session.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">
                      {session.name}
                      {session.userId === currentUserId ? " (You)" : ""}
                    </p>
                    <p className="text-sm text-muted">
                      {formatElapsed(getDisplayElapsed(session))}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted">{session.taskName}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full border border-line bg-plate px-2 py-1 text-xs text-muted">
                      {session.duration} min
                    </span>
                    {session.isPaused && (
                      <span className="rounded-full border border-line bg-plateLemon px-2 py-1 text-xs text-ink">
                        Paused
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
        ))
      ) : (
          <div className="rounded-3xl border border-dashed border-line p-6 text-sm text-muted">
            No active sessions right now. Start one and become the room.
          </div>
        )}
      </div>
    </Card>
  );
};

export default PresenceSidebar;
