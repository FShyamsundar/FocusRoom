import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CommunityComposer from "../components/community/CommunityComposer";
import CommunityPostCard from "../components/community/CommunityPostCard";
import LeaderboardPanel from "../components/dashboard/LeaderboardPanel";
import AppShell from "../components/layout/AppShell";
import {
  addCommunityComment,
  createCommunityPost,
  deleteCommunityComment,
  deleteCommunityPost,
  fetchCommunityPosts,
  hydrateComposerFromCompletion,
  setComposerField,
  toggleCommunityPostLike,
  updateCommunityPost,
} from "../features/community/communitySlice";
import { fetchLeaderboard } from "../features/dashboard/dashboardSlice";

const CommunityPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { completedToday } = useSelector((state) => state.focus);
  const { leaderboard, currentUserRank } = useSelector((state) => state.dashboard);
  const { composer, posts } = useSelector((state) => state.community);

  useEffect(() => {
    dispatch(fetchCommunityPosts());
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-muted">Community</p>
          <h1 className="mt-2 font-display text-4xl text-ink">A public wall of completed work</h1>
          <p className="mt-3 max-w-3xl text-muted">
            This tab turns private focus into public proof of progress. Share completions, gather encouragement, and see who is pushing the hardest.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <CommunityComposer
              composer={composer}
              completions={completedToday}
              onFieldChange={(field, value) => dispatch(setComposerField({ field, value }))}
              onHydrateFromCompletion={(payload) => dispatch(hydrateComposerFromCompletion(payload))}
              onSubmit={() =>
                dispatch(
                  createCommunityPost({
                    caption: composer.caption,
                    taskName: composer.taskName,
                    focusDuration: Number(composer.focusDuration) || 0,
                  })
                )
              }
            />
            <div className="space-y-6">
              {posts.map((post) => (
                <CommunityPostCard
                  key={post._id}
                  currentUserId={user?._id}
                  post={post}
                  onLike={(postId) => dispatch(toggleCommunityPostLike(postId))}
                  onDelete={(postId) => dispatch(deleteCommunityPost(postId))}
                  onUpdate={(postId, payload) =>
                    dispatch(
                      updateCommunityPost({
                        postId,
                        payload: {
                          ...payload,
                          focusDuration: Number(payload.focusDuration) || 0,
                        },
                      })
                    )
                  }
                  onComment={(postId, content) => dispatch(addCommunityComment({ postId, content }))}
                  onDeleteComment={(postId, commentId) =>
                    dispatch(deleteCommunityComment({ postId, commentId }))
                  }
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <LeaderboardPanel leaders={leaderboard} currentUserRank={currentUserRank} />
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default CommunityPage;
