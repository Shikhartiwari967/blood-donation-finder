const express = require("express");

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get my notifications
router.get("/", protect, getMyNotifications);

// Get unread notification count
router.get("/unread-count", protect, getUnreadNotificationCount);

// Mark all notifications as read
router.patch("/read-all", protect, markAllNotificationsAsRead);

// Mark one notification as read
router.patch("/:id/read", protect, markNotificationAsRead);

module.exports = router;