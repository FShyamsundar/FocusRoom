import Button from "../common/Button";
import Card from "../common/Card";
import InputField from "../common/InputField";

const CommunityComposer = ({
  composer,
  completions,
  onFieldChange,
  onSubmit,
  onHydrateFromCompletion,
}) => (
  <Card className="p-6">
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Community Post</p>
          <h2 className="mt-2 font-display text-3xl text-ink">Share a completed win</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Turn a finished focus block into a public progress update that other builders can like and discuss.
          </p>
        </div>
        {!!completions.length && (
          <div className="w-full max-w-sm rounded-2xl border border-line bg-plateBlue p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Quick share</p>
            <div className="mt-3 space-y-2">
              {completions.slice(0, 2).map((log) => (
                <button
                  key={log._id}
                  type="button"
                  onClick={() =>
                    onHydrateFromCompletion({
                      taskName: log.taskName,
                      focusDuration: log.focusDuration,
                    })
                  }
                  className="w-full rounded-2xl border border-line bg-plate px-4 py-3 text-left text-sm text-ink transition hover:bg-plateMint"
                >
                  <span className="block font-semibold">{log.taskName}</span>
                  <span className="mt-1 block text-xs text-muted">{log.focusDuration} minute session</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr,180px]">
        <InputField
          label="Task Name"
          placeholder="Shipped leaderboard rankings"
          value={composer.taskName}
          onChange={(event) => onFieldChange("taskName", event.target.value)}
        />
        <InputField
          label="Focus Duration"
          type="number"
          min="0"
          max="180"
          placeholder="50"
          value={composer.focusDuration}
          onChange={(event) => onFieldChange("focusDuration", event.target.value)}
        />
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Caption</span>
        <textarea
          rows={5}
          placeholder="What did you finish, what was hard, and what are you proud of?"
          value={composer.caption}
          onChange={(event) => onFieldChange("caption", event.target.value)}
          className="rounded-3xl border border-line bg-plate px-4 py-4 text-ink outline-none transition placeholder:text-muted focus:border-accent focus:bg-white"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <Button className="flex items-center justify-center" onClick={onSubmit}>
          Publish post
        </Button>
      </div>
    </div>
  </Card>
);

export default CommunityComposer;
