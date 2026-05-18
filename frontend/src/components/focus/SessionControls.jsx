import { Play, Pause, RotateCcw, SquareCheckBig } from "lucide-react";

import { POMODORO_OPTIONS } from "../../utils/constants";
import Button from "../common/Button";
import Card from "../common/Card";
import InputField from "../common/InputField";

const SessionControls = ({
  draftTaskName,
  draftDuration,
  customDuration,
  activeSession,
  onTaskChange,
  onDurationChange,
  onCustomDurationChange,
  onStart,
  onPause,
  onResume,
  onDone,
  notificationsEnabled,
  onEnableNotifications,
}) => (
  <Card className="p-6">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Session Controls</p>
          <h3 className="mt-2 font-display text-2xl text-ink">Start one clean block of work</h3>
        </div>
        {!notificationsEnabled && (
          <Button variant="secondary" onClick={onEnableNotifications}>
            Enable notifications
          </Button>
        )}
      </div>
      <InputField
        label="Task"
        placeholder="Build Socket.io presence feed"
        value={draftTaskName}
        onChange={(event) => onTaskChange(event.target.value)}
      />
      <div className="space-y-3">
        <p className="text-sm font-medium text-ink">Duration</p>
        <div className="flex flex-wrap gap-3">
          {POMODORO_OPTIONS.map((duration) => (
            <Button
              key={duration}
              variant={draftDuration === duration ? "primary" : "ghost"}
              pressed={draftDuration === duration}
              onClick={() => onDurationChange(duration)}
              className="min-w-[92px]"
            >
              {duration} min
            </Button>
          ))}
        </div>
        <div className="max-w-xs">
          <InputField
            label="Custom Minutes"
            type="number"
            min="5"
            max="180"
            step="1"
            placeholder="45"
            value={customDuration}
            onChange={(event) => onCustomDurationChange(event.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {!activeSession && (
          <Button className="flex items-center gap-2" onClick={onStart}>
            <Play size={16} />
            Start
          </Button>
        )}
        {activeSession && !activeSession.isPaused && (
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={onPause}
            disabled={activeSession.isCompleting}
          >
            <Pause size={16} />
            Pause
          </Button>
        )}
        {activeSession?.isPaused && !activeSession.isCompleting && (
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={onResume}
            disabled={activeSession.isCompleting}
          >
            <RotateCcw size={16} />
            Resume
          </Button>
        )}
        {activeSession && (
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={onDone}
            disabled={activeSession.isCompleting}
          >
            <SquareCheckBig size={16} />
            {activeSession.isCompleting ? "Finishing..." : "Done"}
          </Button>
        )}
      </div>
    </div>
  </Card>
);

export default SessionControls;
