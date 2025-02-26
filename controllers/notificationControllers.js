import asyncMiddleware from "../middlewares/asyncMiddleware.js";
import notificationModel from "../models/notificationModel.js";

const getUserNotifications = asyncMiddleware(async (req, res, next) => {
  const notifications = await notificationModel
    .find({ to: req.user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: "from",
      select: "userName profileImage",
    });
  await notificationModel.updateMany({ to: req.user._id }, { read: true });
  res.json({ status: "success", data: notifications });
});

const deleteNotification = asyncMiddleware(async (req, res, next) => {
  await notificationModel.findByIdAndDelete(req.params.id);
  res.json({ status: "success", message: "Notification deleted successfully" });
});

const deleteAllNotifications = asyncMiddleware(async (req, res, next) => {
  await notificationModel.deleteMany({ to: req.user._id });
  res.json({
    status: "success",
    message: "All notifications deleted successfully",
  });
});

export { getUserNotifications, deleteNotification, deleteAllNotifications };
