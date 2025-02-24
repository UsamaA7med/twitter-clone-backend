import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../controllers/authControllers.js";
import verifyToken from "../utils/verifyToken.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.get("/logout", logout);

authRouter.get("/checkAuth", verifyToken, checkAuth);

export default authRouter;
