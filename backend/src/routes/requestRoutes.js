const express = require("express");

const {
  createBloodRequest,
  getMyRequests,
  getActiveRequests,
  updateRequestStatus,
  respondToBloodRequest,
  getRequestResponses,
} = require("../controllers/requestController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create a blood request
router.post("/", protect,  roleMiddleware("recipient"),createBloodRequest);

// Get all active blood requests
router.get("/", protect, roleMiddleware("donor"), getActiveRequests);

// Get my blood requests
router.get("/my", protect,  getMyRequests);

// Get donor responses for my blood request
router.get("/:id/responses", protect, roleMiddleware("recipient"), getRequestResponses);

// Update request status
router.patch("/:id/status", protect, roleMiddleware("recipient"), updateRequestStatus);

// Donor accept / decline request
router.patch("/:id/respond", protect, roleMiddleware("donor"), respondToBloodRequest);

module.exports = router;