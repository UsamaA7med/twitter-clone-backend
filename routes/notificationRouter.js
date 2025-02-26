import express from "express";
import verifyToken from "../utils/verifyToken.js";
import {
  deleteAllNotifications,
  deleteNotification,
  getUserNotifications,
} from "../controllers/notificationControllers.js";

const notificationRouter = express.Router();

notificationRouter.get("/", verifyToken, getUserNotifications);
notificationRouter.delete("/:id", verifyToken, deleteNotification);
notificationRouter.delete("/", verifyToken, deleteAllNotifications);

export { notificationRouter };
