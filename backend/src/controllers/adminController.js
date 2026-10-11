const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");
const Notification = require("../models/Notification");
const createActivityLog = require("../utils/activityLogger");
const ActivityLog = require("../models/ActivityLog");


// VERIFY / UNVERIFY DONOR
const updateDonorVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        message: "isVerified must be true or false",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "donor") {
      return res.status(400).json({
        message: "Only donor accounts can be verified",
      });
    }

    user.isVerified = isVerified;
    await user.save();

      await createActivityLog({
        actor: req.user.userId,
        action: isVerified ? "VERIFY_DONOR" : "UNVERIFY_DONOR",
        targetType: "User",
        targetId: user._id,
        details: isVerified
          ? "Admin verified donor profile"
          : "Admin removed donor verification",
      });

    res.status(200).json({
      message: isVerified
        ? "Donor verified successfully"
        : "Donor verification removed successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Update donor verification error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ALL DONORS
const getAllDonors = async (req, res) => {
  try {
    const { bloodGroup, city, isVerified, isAvailable } = req.query;

    const filter = {
      role: "donor",
    };

    // Filter by blood group
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    // Filter by city
    if (city) {
      filter.city = {
        $regex: city,
        $options: "i",
      };
    }

    // Filter by verification status
    if (isVerified !== undefined) {
      filter.isVerified = isVerified === "true";
    }

    // Filter by availability
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === "true";
    }

    const donors = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: donors.length,
      donors,
    });
  } catch (error) {
    console.error("Get all donors error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ALL BLOOD REQUESTS
const getAllBloodRequests = async (req, res) => {
  try {
    const {
      bloodGroup,
      city,
      status,
      urgency,
    } = req.query;

    const filter = {};

    // Filter by blood group
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    // Filter by city
    if (city) {
      filter.city = {
        $regex: city,
        $options: "i",
      };
    }

    // Filter by request status
    if (status) {
      filter.status = status;
    }

    // Filter by urgency
    if (urgency) {
      filter.urgency = urgency;
    }

    const requests = await BloodRequest.find(filter)
      .populate("requester", "name email bloodGroup city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get all blood requests error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE BLOOD REQUEST STATUS - ADMIN
const updateBloodRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["active", "fulfilled", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    request.status = status;

    await request.save();
    
    await createActivityLog({
    actor: req.user.userId,
    action: "UPDATE_REQUEST_STATUS",
    targetType: "BloodRequest",
    targetId: request._id,
    details: `Admin changed blood request status to ${status}`,
  });
    res.status(200).json({
      message: "Blood request status updated successfully",
      request,
    });
  } catch (error) {
    console.error("Admin update request status error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ALL REQUESTERS
const getAllRequesters = async (req, res) => {
  try {
    const requesters = await User.find({ role: "recipient" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requesters.length,
      requesters,
    });
  } catch (error) {
    console.error("Get all requesters error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// VERIFY / UNVERIFY REQUESTER
const updateRequesterVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        message: "isVerified must be true or false",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "recipient") {
      return res.status(400).json({
        message: "Only recipient accounts can be verified",
      });
    }

    user.isVerified = isVerified;

    await user.save();

  await createActivityLog({
    actor: req.user.userId,
    action: isVerified
      ? "VERIFY_REQUESTER"
      : "UNVERIFY_REQUESTER",
    targetType: "User",
    targetId: user._id,
    details: isVerified
      ? "Admin verified recipient profile"
      : "Admin removed recipient verification",
  });

    res.status(200).json({
      message: isVerified
        ? "Recipient verified successfully"
        : "Recipient verification removed successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Update recipient verification error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ADMIN DASHBOARD STATISTICS
const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalRequesters,
      totalAdmins,
      verifiedDonors,
      availableDonors,
      totalRequests,
      activeRequests,
      fulfilledRequests,
      cancelledRequests,
      totalNotifications,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({ role: "donor" }),

      User.countDocuments({ role: "recipient" }),

      User.countDocuments({ role: "admin" }),

      User.countDocuments({
        role: "donor",
        isVerified: true,
      }),

      User.countDocuments({
        role: "donor",
        isAvailable: true,
      }),

      BloodRequest.countDocuments(),

      BloodRequest.countDocuments({
        status: "active",
      }),

      BloodRequest.countDocuments({
        status: "fulfilled",
      }),

      BloodRequest.countDocuments({
        status: "cancelled",
      }),

      Notification.countDocuments(),
    ]);

    res.status(200).json({
      users: {
        total: totalUsers,
        donors: totalDonors,
        requesters: totalRequesters,
        admins: totalAdmins,
      },

      donors: {
        verified: verifiedDonors,
        available: availableDonors,
      },

      requests: {
        total: totalRequests,
        active: activeRequests,
        fulfilled: fulfilledRequests,
        cancelled: cancelledRequests,
      },

      notifications: {
        total: totalNotifications,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// GET ACTIVITY LOGS - ADMIN
const getActivityLogs = async (req, res) => {
  try {
    const { action, targetType } = req.query;

    const filter = {};

    if (action) {
      filter.action = action;
    }

    if (targetType) {
      filter.targetType = targetType;
    }

    const logs = await ActivityLog.find(filter)
      .populate("actor", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error("Get activity logs error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  updateDonorVerification,
  getAllDonors,
  getAllBloodRequests,
  updateBloodRequestStatus,
  getAllRequesters,
  updateRequesterVerification,
  getAdminStats,
  getActivityLogs,
};


