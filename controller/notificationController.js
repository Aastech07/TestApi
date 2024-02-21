const Notification = require("../models/notificationModel");

const addNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    const newNotification = new Notification({
      title,
      message,
    });

    const savedNotification = await newNotification.save();

    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllNotifications = async (req, res) => {
  try {
    const targetUserId = req.params.userId;

    if (!targetUserId) {
      return res.status(400).json({ error: "Target user ID is required." });
    }

    const notifications = await Notification.find({ userId: targetUserId });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const deletedNotification = await Notification.findByIdAndDelete(
      notificationId
    );

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUnreadNotificationCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Notification.countDocuments({ userId, isRead: false });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getUnreadNotificationCount,
  addNotification,
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
};
