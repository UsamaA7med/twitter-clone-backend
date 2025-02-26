import express from "express";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  toggleLike,
} from "../controllers/postControllers.js";
import verifyToken from "../utils/verifyToken.js";

const postRouter = express.Router();
postRouter.get("/liked-posts", verifyToken, getLikedPosts);
postRouter.get("/user-posts/:id", verifyToken, getUserPosts);
postRouter.get("/following-posts", verifyToken, getFollowingPosts);
postRouter.get("/all", verifyToken, getAllPosts);
postRouter.post("/create", verifyToken, createPost);
postRouter.post("/like/:id", verifyToken, toggleLike);
postRouter.post("/comment/:id", verifyToken, createComment);
postRouter.delete("/delete/:id", verifyToken, deletePost);
postRouter.delete("/delete-comment/:id/:commentId", verifyToken, deleteComment);

export default postRouter;
