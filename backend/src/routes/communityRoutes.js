import express from "express";

import {
  addPostComment,
  createCommunityPost,
  deleteCommunityPost,
  deletePostComment,
  getCommunityPosts,
  togglePostLike,
  updateCommunityPost,
} from "../controllers/communityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/posts", getCommunityPosts);
router.post("/posts", createCommunityPost);
router.put("/posts/:postId", updateCommunityPost);
router.delete("/posts/:postId", deleteCommunityPost);
router.post("/posts/:postId/like", togglePostLike);
router.post("/posts/:postId/comments", addPostComment);
router.delete("/posts/:postId/comments/:commentId", deletePostComment);

export default router;
