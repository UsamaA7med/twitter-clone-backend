import JsonWebToken from "jsonwebtoken";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import { User, validateCreateUser } from "../models/userModel.js";
import generateError from "../utils/generateError.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

const signup = asyncMiddleware(async (req, res, next) => {
  const { error } = validateCreateUser(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, 400, "error");
    return next(Eerror);
  }
  const EmailExists = await User.findOne({ email: req.body.email });
  if (EmailExists) {
    const Eerror = generateError("Email already exists", 400, "error");
    return next(Eerror);
  }
  const userNameExists = await User.findOne({ userName: req.body.userName });
  if (userNameExists) {
    const Eerror = generateError("Username already exists", 400, "error");
    return next(Eerror);
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 11);
  const user = await User.create({ ...req.body, password: hashedPassword });
  generateTokenAndSetCookie(
    user.userName,
    user.email,
    user.fullName,
    user._id,
    res
  );
  res.status(201).json({
    status: "success",
    data: {
      _id: user._id,
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
    },
  });
});

const login = asyncMiddleware(async (req, res, next) => {
  const user = await User.findOne({ userName: req.body.userName });
  if (!user) {
    const Eerror = generateError("Invalid username or password", 400, "error");
    return next(Eerror);
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    const Eerror = generateError("Invalid username or password", 400, "error");
    return next(Eerror);
  }
  generateTokenAndSetCookie(
    user.userName,
    user.email,
    user.fullName,
    user._id,
    res
  );
  res.json({
    status: "success",
    data: {
      _id: user._id,
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
    },
  });
});

const logout = asyncMiddleware(async (req, res, next) => {
  res.clearCookie("jwt");
  res.json({ status: "success", message: "Logged out successfully" });
});

const checkAuth = asyncMiddleware(async (req, res, next) => {
  res.json({ status: "success", data: req.user });
});

export { signup, login, logout, checkAuth };
