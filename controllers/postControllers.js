import {
  cloudinaryDeleteImage,
  cloudinaryUpdateImage,
} from "../config/cloudinary.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import notificationModel from "../models/notificationModel.js";
import {
  Post,
  validateCreateComment,
  validateCreatePost,
} from "../models/postModel.js";
import { User } from "../models/userModel.js";
import generateError from "../utils/generateError.js";

const getAllPosts = asyncMiddleware(async (req, res, next) => {
  const posts = await Post.find()
    .populate({
      path: "author",
      select: "-password",
    })
    .populate({
      path: "comments.user",
      select: "-password",
    })
    .sort({ createdAt: -1 });
  res.json({ status: "success", data: posts });
});

const createPost = asyncMiddleware(async (req, res, next) => {
  const { error } = validateCreatePost(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, 400, "error");
    return next(Eerror);
  }
  const post = new Post({
    content: req.body.content,
    author: req.user._id,
  });
  if (req.body.postImage) {
    const result = await cloudinaryUpdateImage(req.body.postImage);
    post.postImage.url = result.secure_url;
    post.postImage.publicId = result.publicId;
  }
  await post.save();
  res.json({ status: "success", data: post });
});

const toggleLike = asyncMiddleware(async (req, res, next) => {
  const post = await Post.findById(req.params.id).select("likes");
  if (!post) {
    const Eerror = generateError("Post not found", 404, "error");
    return next(Eerror);
  }
  const user = await User.findById(req.user._id);
  const index = post.likes.indexOf(user._id);
  if (index === -1) {
    post.likes.push(user._id);
    user.likedPosts.push(post._id);
    await notificationModel.create({
      from: user._id,
      to: post.author,
      type: "like",
    });
  } else {
    post.likes.splice(index, 1);
    user.likedPosts.splice(user.likedPosts.indexOf(post._id), 1);
  }
  await post.save();
  await user.save();
  res.json({ status: "success", data: post });
});

const createComment = asyncMiddleware(async (req, res, next) => {
  const { error } = validateCreateComment(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, 400, "error");
    return next(Eerror);
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    const Eerror = generateError("Post not found", 404, "error");
    return next(Eerror);
  }
  const myPost = await Post.findById(req.params.id);
  myPost.comments.push({
    content: req.body.content,
    user: req.user._id,
  });
  await myPost.save();
  if (myPost.author.toString() !== req.user._id.toString()) {
    await notificationModel.create({
      from: req.user._id,
      to: myPost.author,
      type: "comment",
    });
  }
  res.json({ status: "success", data: myPost });
});

const deletePost = asyncMiddleware(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    const Eerror = generateError("Post not found", 404, "error");
    return next(Eerror);
  }
  if (post.postImage.publicId) {
    await cloudinaryDeleteImage(post.postImage.publicId);
  }
  await Post.findByIdAndDelete(post._id);
  res.json({ status: "success", message: "Post deleted successfully" });
});

const deleteComment = asyncMiddleware(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    const Eerror = generateError("Post not found", 404, "error");
    return next(Eerror);
  }
  const commentIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === req.params.commentId
  );
  if (commentIndex === -1) {
    const Eerror = generateError("Comment not found", 404, "error");
    return next(Eerror);
  }
  post.comments.splice(commentIndex, 1);
  await post.save();
  res.json({ status: "success", data: post });
});

const getLikedPosts = asyncMiddleware(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    const Eerror = generateError("User not found", 404, "error");
    return next(Eerror);
  }
  const likedPosts = await User.findById(req.user._id)
    .populate("likedPosts")
    .select("likedPosts");
  res.json({ status: "success", data: likedPosts });
});

const getFollowingPosts = asyncMiddleware(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    const Eerror = generateError("User not found", 404, "error");
    return next(Eerror);
  }
  const followingPosts = await Post.find({ author: { $in: user.following } })
    .populate({
      path: "author",
      select: "-password",
    })
    .populate({
      path: "comments.user",
      select: "-password",
    });
  res.json({ status: "success", data: followingPosts });
});

const getUserPosts = asyncMiddleware(async (req, res, next) => {
  const posts = await Post.find({ author: req.params.id })
    .sort({ createdAt: -1 })
    .populate({
      path: "comments.user",
      select: "-password",
    });
  res.json({ status: "success", data: posts });
});

export {
  createPost,
  toggleLike,
  createComment,
  deletePost,
  deleteComment,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
};
