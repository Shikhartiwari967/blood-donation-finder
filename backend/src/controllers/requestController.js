const mongoose = require("mongoose");
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
const Notification = require("../models/Notification");

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

    // Create blood request
    const bloodRequest = await BloodRequest.create({
      requester: req.user.userId,
      bloodGroup,
      city,
      hospital,
      units,
      urgency: urgency || "normal",
      message,
    });

    // Find matching available donors
    const matchingDonors = await User.find({
      role: "donor",
      bloodGroup,
      city: { $regex: new RegExp(`^${city}$`, "i") },
      isAvailable: true,
      isVerified: true,
      _id: { $ne: req.user.userId },
    });

    // Create notifications for matching donors
    if (matchingDonors.length > 0) {
      const notifications = matchingDonors.map((donor) => ({
        recipient: donor._id,
        type: "blood_request",
        message: `New ${bloodGroup} blood request in ${city} at ${hospital}`,
        bloodRequest: bloodRequest._id,
      }));

      await Notification.insertMany(notifications);
    }

    // Send response
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

// Notify donors who responded to this request
    if (request.donorResponses.length > 0) {
      const notifications = request.donorResponses.map((response) => ({
        recipient: response.donor,
        type: "request_status",
        message: `The ${request.bloodGroup} blood request in ${request.city} has been ${status}.`,
        bloodRequest: request._id,
      }));

      await Notification.insertMany(notifications);
  }

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

// DONOR ACCEPT / DECLINE BLOOD REQUEST
const respondToBloodRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    const donorId = req.user.userId;
    const donor = await User.findById(donorId);

      if (!donor) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (donor.role !== "donor") {
        return res.status(403).json({
          message: "Only donors can respond to blood requests",
        });
      }

      if (!donor.isVerified) {
        return res.status(403).json({
          message: "Only verified donors can respond to blood requests",
        });
      }

    // Only accepted or declined are allowed
    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or declined",
      });
    }

    // Find the blood request
    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    // Request must still be active
    if (request.status !== "active") {
      return res.status(400).json({
        message: "This blood request is no longer active",
      });
    }

    // Requester cannot respond to their own request
    if (request.requester.toString() === donorId) {
      return res.status(403).json({
        message: "You cannot respond to your own blood request",
      });
    }

    // Check if donor already responded
    const existingResponse = request.donorResponses.find(
      (response) => response.donor.toString() === donorId
    );

    if (existingResponse) {
      return res.status(400).json({
        message: "You have already responded to this request",
      });
    }

    // Add donor response
    request.donorResponses.push({
      donor: donorId,
      status,
    });

    await request.save();

    // Notify the requester
    await Notification.create({
      recipient: request.requester,
      type: "request_response",
      message: `A donor has ${status} your blood request for ${request.bloodGroup} blood in ${request.city}.`,
      bloodRequest: request._id,
    });

    res.status(200).json({
      message: `Request ${status} successfully`,
      request,
    });
  } catch (error) {
    console.error("Respond to blood request error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ALL ACTIVE BLOOD REQUESTS
const getActiveRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      status: "active",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get active requests error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET DONOR RESPONSES FOR A BLOOD REQUEST
const getRequestResponses = async (req, res) => {
  try {
    const request = await BloodRequest.findOne({
      _id: req.params.id,
      requester: req.user.userId,
    }).populate("donorResponses.donor", "name email bloodGroup");

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    res.status(200).json({
      count: request.donorResponses.length,
      responses: request.donorResponses,
    });
  } catch (error) {
    console.error("Get request responses error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};



module.exports = {
  createBloodRequest,
  getMyRequests,
  getActiveRequests,
  updateRequestStatus,
  respondToBloodRequest,
  getRequestResponses
};
