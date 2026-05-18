import { useState } from "react";
import { Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";

import Button from "../common/Button";
import Card from "../common/Card";
import InputField from "../common/InputField";

const CommunityPostCard = ({
  post,
  currentUserId,
  onLike,
  onDelete,
  onUpdate,
  onComment,
  onDeleteComment,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    caption: post.caption,
    taskName: post.taskName,
    focusDuration: post.focusDuration,
  });
  const [comment, setComment] = useState("");

  const isOwner = post.user._id === currentUserId;

  const handleSave = () => {
    onUpdate(post._id, draft);
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold text-ink">{post.user.name}</p>
            <p className="text-xs text-muted">
              {new Date(post.createdAt).toLocaleDateString()} at{" "}
              {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="ghost" className="flex items-center gap-2" onClick={() => setIsEditing((value) => !value)}>
                <Pencil size={16} />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <Button variant="danger" className="flex items-center gap-2" onClick={() => onDelete(post._id)}>
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <InputField
              label="Task"
              value={draft.taskName}
              onChange={(event) => setDraft((prev) => ({ ...prev, taskName: event.target.value }))}
            />
            <InputField
              label="Focus Duration"
              type="number"
              min="0"
              max="180"
              value={draft.focusDuration}
              onChange={(event) => setDraft((prev) => ({ ...prev, focusDuration: event.target.value }))}
            />
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink">Caption</span>
              <textarea
                rows={4}
                value={draft.caption}
                onChange={(event) => setDraft((prev) => ({ ...prev, caption: event.target.value }))}
                className="rounded-3xl border border-line bg-plate px-4 py-4 text-ink outline-none transition focus:border-accent focus:bg-white"
              />
            </label>
            <Button onClick={handleSave}>Save changes</Button>
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-line bg-plateBlue p-5">
              {post.taskName && (
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {post.taskName} {post.focusDuration ? `• ${post.focusDuration} min` : ""}
                </p>
              )}
              <p className="mt-3 text-sm leading-7 text-ink">{post.caption}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={post.likedByViewer ? "primary" : "ghost"}
                pressed={post.likedByViewer}
                className="flex items-center gap-2"
                onClick={() => onLike(post._id)}
              >
                <Heart size={16} />
                {post.likeCount}
              </Button>
              <div className="flex items-center gap-2 rounded-2xl border border-line bg-plate px-4 py-3 text-sm text-muted">
                <MessageCircle size={16} />
                {post.comments.length} comments
              </div>
            </div>
          </>
        )}

        <div className="space-y-3 rounded-3xl border border-line bg-platePeach p-4">
          <p className="text-sm font-semibold text-ink">Discussion</p>
          <div className="space-y-3">
            {post.comments.length ? (
              post.comments.map((entry) => (
                <div key={entry._id} className="rounded-2xl border border-line bg-plate px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{entry.user.name}</p>
                      <p className="mt-1 text-sm text-muted">{entry.content}</p>
                    </div>
                    {(entry.user._id === currentUserId || isOwner) && (
                      <button
                        type="button"
                        onClick={() => onDeleteComment(post._id, entry._id)}
                        className="text-xs font-medium text-muted transition hover:text-ink"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-line px-4 py-4 text-sm text-muted">
                Be the first person to react to this focus win.
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <InputField
              label="Comment"
              className="flex-1"
              placeholder="Add a supportive comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <div className="sm:self-end">
              <Button
                onClick={() => {
                  if (!comment.trim()) {
                    return;
                  }
                  onComment(post._id, comment.trim());
                  setComment("");
                }}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CommunityPostCard;
