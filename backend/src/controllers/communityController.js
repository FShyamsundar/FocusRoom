import mongoose from "mongoose";

import { Post } from "../models/Post.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const shapePost = (post, viewerId) => ({
  _id: post._id,
  caption: post.caption,
  taskName: post.taskName,
  focusDuration: post.focusDuration,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  user: {
    _id: post.userId?._id || post.userId,
    name: post.userId?.name || "Unknown",
  },
  likeCount: post.likes?.length || 0,
  likedByViewer: (post.likes || []).some((like) => like.toString() === viewerId),
  comments: (post.comments || []).map((comment) => ({
    _id: comment._id,
    content: comment.content,
    createdAt: comment.createdAt,
    user: {
      _id: comment.userId,
      name: comment.name,
    },
  })),
});

const emitCommunityUpdate = (req) => {
  req.app.get("io")?.emit("community:update");
};

export const getCommunityPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(30)
    .populate("userId", "name")
    .lean();

  res.json(posts.map((post) => shapePost(post, req.user._id.toString())));
});

export const createCommunityPost = asyncHandler(async (req, res) => {
  const { caption, taskName = "", focusDuration = 0 } = req.body;

  if (!caption?.trim()) {
    res.status(400);
    throw new Error("Caption is required");
  }

  const post = await Post.create({
    userId: req.user._id,
    caption: caption.trim(),
    taskName: taskName.trim(),
    focusDuration: Number(focusDuration) || 0,
  });

  const populated = await Post.findById(post._id).populate("userId", "name").lean();
  emitCommunityUpdate(req);
  res.status(201).json(shapePost(populated, req.user._id.toString()));
});

export const updateCommunityPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { caption, taskName = "", focusDuration = 0 } = req.body;
  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only edit your own posts");
  }

  post.caption = caption?.trim() || post.caption;
  post.taskName = taskName.trim();
  post.focusDuration = Number(focusDuration) || 0;
  await post.save();

  const populated = await Post.findById(post._id).populate("userId", "name").lean();
  emitCommunityUpdate(req);
  res.json(shapePost(populated, req.user._id.toString()));
});

export const deleteCommunityPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only delete your own posts");
  }

  await post.deleteOne();
  emitCommunityUpdate(req);
  res.json({ message: "Post deleted" });
});

export const togglePostLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const viewerId = req.user._id.toString();
  const existingLike = post.likes.find((like) => like.toString() === viewerId);

  if (existingLike) {
    post.likes = post.likes.filter((like) => like.toString() !== viewerId);
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
  const populated = await Post.findById(post._id).populate("userId", "name").lean();
  emitCommunityUpdate(req);
  res.json(shapePost(populated, viewerId));
});

export const addPostComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (!content?.trim()) {
    res.status(400);
    throw new Error("Comment content is required");
  }

  post.comments.unshift({
    _id: new mongoose.Types.ObjectId(),
    userId: req.user._id,
    name: req.user.name,
    content: content.trim(),
  });
  await post.save();

  const populated = await Post.findById(post._id).populate("userId", "name").lean();
  emitCommunityUpdate(req);
  res.status(201).json(shapePost(populated, req.user._id.toString()));
});

export const deletePostComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const isCommentOwner = comment.userId.toString() === req.user._id.toString();
  const isPostOwner = post.userId.toString() === req.user._id.toString();

  if (!isCommentOwner && !isPostOwner) {
    res.status(403);
    throw new Error("You can only delete your own comment");
  }

  post.comments.pull(commentId);
  await post.save();

  const populated = await Post.findById(post._id).populate("userId", "name").lean();
  emitCommunityUpdate(req);
  res.json(shapePost(populated, req.user._id.toString()));
});
