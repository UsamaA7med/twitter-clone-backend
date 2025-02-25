import express from "express";
import {
  followOrUnFollow,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from "../controllers/userControllers.js";
import verifyToken from "../utils/verifyToken.js";

const userRouter = express.Router();

userRouter.get("profile/:id", getUserProfile);
userRouter.put("/update", verifyToken, updateUser);
userRouter.post("/follow/:id", verifyToken, followOrUnFollow);
userRouter.get("/suggested", verifyToken, getSuggestedUsers);

export { userRouter };
