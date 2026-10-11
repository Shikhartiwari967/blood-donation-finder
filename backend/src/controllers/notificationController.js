const Notification = require("../models/Notification");

// GET MY NOTIFICATIONS
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.userId,
    })
      .populate("bloodRequest", "bloodGroup city hospital urgency status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// MARK NOTIFICATION AS READ
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user.userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark notification error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// MARK ALL NOTIFICATIONS AS READ
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user.userId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET UNREAD NOTIFICATION COUNT
const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.userId,
      isRead: false,
    });

    res.status(200).json({
      count,
    });
  } catch (error) {
    console.error("Unread notification count error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
};