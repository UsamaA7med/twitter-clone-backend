import {
  cloudinaryDeleteImage,
  cloudinaryUpdateImage,
} from "../config/cloudinary.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import notificationModel from "../models/notificationModel.js";
import { User, validateUpdateUser } from "../models/userModel.js";
import generateError from "../utils/generateError.js";
import bcrypt from "bcryptjs";

const getUserProfile = asyncMiddleware(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    const Eerror = generateError("User not found", 404, "error");
    return next(Eerror);
  }
  res.json({ status: "success", data: user });
});

const followOrUnFollow = asyncMiddleware(async (req, res, next) => {
  const currentUser = req.user;
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    const Eerror = generateError("User not found", 404, "error");
    return next(Eerror);
  }
  if (currentUser._id.toString() === targetUser._id.toString()) {
    const Eerror = generateError("Cannot follow yourself", 400, "error");
    return next(Eerror);
  }
  if (currentUser.following.includes(targetUser._id)) {
    currentUser.following.remove(targetUser._id);
    targetUser.followers.remove(currentUser._id);
    await notificationModel.create({
      type: "follow",
      from: targetUser._id,
      to: currentUser._id,
    });
  } else {
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);
    await notificationModel.create({
      type: "follow",
      from: targetUser._id,
      to: currentUser._id,
    });
  }
  await currentUser.save();
  await targetUser.save();
  res.json({ status: "success", message: "Following user" });
});

const getSuggestedUsers = asyncMiddleware(async (req, res, next) => {
  const currentUser = req.user;
  const followedUsers = currentUser.following;
  const users = await User.find({
    _id: { $nin: followedUsers, $ne: currentUser._id },
  }).select("-password");
  res.json({ status: "success", data: users });
});

const updateUser = asyncMiddleware(async (req, res, next) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, 400, "error");
    return next(Eerror);
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    const Eerror = generateError("User not found", 404, "error");
    return next(Eerror);
  }
  if (
    (!req.body.currentPassword && req.body.newPassword) ||
    (req.body.currentPassword && !req.body.newPassword)
  ) {
    const Eerror = generateError("Invalid password", 400, "error");
    return next(Eerror);
  }
  if (req.body.currentPassword && req.body.newPassword) {
    const validPassword = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!validPassword) {
      const Eerror = generateError("Invalid current password", 400, "error");
      return next(Eerror);
    }
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 11);
    user.password = hashedPassword;
  }
  if (req.body.profileImage) {
    if (user.profileImage.publicId) {
      cloudinaryDeleteImage(publicId);
    }
    const data = cloudinaryUpdateImage(profileImage);
    user.profileImage.url = data.secure_url;
    user.profileImage.publicId = data.publicId;
    await user.save();
  }
  if (req.body.coverImage) {
    if (user.coverImage.publicId) {
      cloudinaryDeleteImage(publicId);
    }
    const data = cloudinaryUpdateImage(coverImage);
    user.coverImage.url = data.secure_url;
    user.coverImage.publicId = data.publicId;
  }
  if (req.body.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      const Eerror = generateError("Email already exists", 400, "error");
      return next(Eerror);
    }
    user.email = req.body.email;
  }
  if (req.body.userName) {
    const userNameExists = await User.findOne({ userName: req.body.userName });
    if (
      userNameExists &&
      userNameExists._id.toString() !== user._id.toString()
    ) {
      const Eerror = generateError("Username already exists", 400, "error");
      return next(Eerror);
    }
    user.userName = req.body.userName;
  }
  user.fullName = req.body.fullName || user.fullName;
  user.bio = req.body.bio || user.bio;
  user.link = req.body.link || user.link;
  await user.save();
  console.log(user);
  res.json({ status: "success", data: user });
});

export { getUserProfile, followOrUnFollow, getSuggestedUsers, updateUser };
