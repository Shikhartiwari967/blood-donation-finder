const express = require("express");

const {
  createBloodRequest,
  getMyRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a blood donation request
router.post("/", protect, createBloodRequest);

router.get("/my", protect, getMyRequests);

router.patch("/:id/status", protect, updateRequestStatus);

module.exports = router;