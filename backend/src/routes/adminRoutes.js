const express = require("express");

const {
  updateDonorVerification,
  getAllDonors,
  getAllBloodRequests,
  updateBloodRequestStatus,
  getAllRequesters,
  updateRequesterVerification,
  getAdminStats,
  getActivityLogs,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all blood requests
router.get(
  "/requests",
  protect,
  adminMiddleware,
  getAllBloodRequests
);

// Get all donors
router.get(
  "/donors",
  protect,
  adminMiddleware,
  getAllDonors
);


// Verify / unverify donor
router.patch(
  "/donors/:userId/verification",
  protect,
  adminMiddleware,
  updateDonorVerification
);

// Update blood request status
router.patch(
  "/requests/:id/status",
  protect,
  adminMiddleware,
  updateBloodRequestStatus
);

// Get all requesters
router.get(
  "/requesters",
  protect,
  adminMiddleware,
  getAllRequesters
);

// Verify / unverify requester
router.patch(
  "/requesters/:userId/verification",
  protect,
  adminMiddleware,
  updateRequesterVerification
);

// GET ADMIN DASHBOARD STATISTICS
router.get(
  "/stats",
  protect,
  adminMiddleware,
  getAdminStats
);

// GET ACTIVITY LOGS
router.get(
  "/activity-logs",
  protect,
  adminMiddleware,
  getActivityLogs
);

module.exports = router;