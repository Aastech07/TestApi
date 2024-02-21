const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notificationController");

router.post("/notifications", notificationController.addNotification);
router.get(
  "/notifications/count/:userId",
  notificationController.getUnreadNotificationCount
);

router.get(
  "/notifications/:userId",
  notificationController.getAllNotifications
);

router.put(
  "/notifications/:notificationId",
  notificationController.markNotificationAsRead
);

router.delete(
  "/notifications/:notificationId",
  notificationController.deleteNotification
);

module.exports = router;
