import JsonWebToken from "jsonwebtoken";
import { User } from "../models/userModel.js";
import generateError from "./generateError.js";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";

export default asyncMiddleware(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    const Eerror = generateError("Not authenticated", 401, "error");
    return next(Eerror);
  }
  const validToken = JsonWebToken.verify(token, process.env.JWT_SECRET_KEY);
  if (!validToken) {
    const Eerror = generateError("Not authenticated", 401, "error");
    return next(Eerror);
  }
  const user = await User.findOne({ email: validToken.email }).select(
    "-password"
  );
  if (!user) {
    const Eerror = generateError("Not authenticated", 401, "error");
    return next(Eerror);
  }
  req.user = user;
  next();
});
