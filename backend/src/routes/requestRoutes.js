const express = require("express");

const {
  createBloodRequest,
  getMyRequests,
  getActiveRequests,
  updateRequestStatus,
  respondToBloodRequest,
  getRequestResponses
} = require("../controllers/requestController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a blood donation request
router.post("/", protect, createBloodRequest);

// Get all active blood requests
router.get("/", protect, getActiveRequests);

// Get my blood requests
router.get("/my", protect, getMyRequests);

// Get donor responses for my blood request
router.get("/:id/responses", protect, getRequestResponses);

// Update request status
router.patch("/:id/status", protect, updateRequestStatus);

// Donor accept / decline request
router.patch("/:id/respond", protect, respondToBloodRequest);

module.exports = router;