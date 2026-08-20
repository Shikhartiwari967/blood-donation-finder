const mongoose = require("mongoose");
const BloodRequest = require("../models/BloodRequest");

// CREATE BLOOD REQUEST
const createBloodRequest = async (req, res) => {
  try {
    const {
      bloodGroup,
      city,
      hospital,
      units,
      urgency,
      message,
    } = req.body;

    // Validate required fields
    if (!bloodGroup || !city || !hospital || !units) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Create request
    const bloodRequest = await BloodRequest.create({
      requester: req.user.userId,
      bloodGroup,
      city,
      hospital,
      units,
      urgency: urgency || "normal",
      message,
    });

    res.status(201).json({
      message: "Blood request created successfully",
      request: bloodRequest,
    });
  } catch (error) {
    console.error("Create blood request error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET MY REQUESTS
const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const requests = await BloodRequest.find({
      requester: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get requests error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE REQUEST STATUS
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["active", "fulfilled", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const request = await BloodRequest.findOne({
      _id: req.params.id,
      requester: req.user.userId,
    });

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    request.status = status;

    await request.save();

    res.status(200).json({
      message: "Request status updated successfully",
      request,
    });
  } catch (error) {
    console.error("Update request error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};



module.exports = {
  createBloodRequest,
  getMyRequests,
  updateRequestStatus,
};