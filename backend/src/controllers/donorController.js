const User = require("../models/User");

const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, city , availability } = req.query;

    // Base filter: only verified donor accounts
    const filter = {
      role: "donor",
      isVerified: true,
    };

     // Filter by availability if provided
    if (availability !== undefined && availability !== "") {
      filter.isAvailable = availability === "true";
    }

    // Filter by blood group if provided
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    // Filter by city if provided
    if (city) {
      filter.city = {
        $regex: city,
        $options: "i",
      };
    }

    const donors = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: donors.length,
      donors,
    });
  } catch (error) {
    console.error("Donor search error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message: "isAvailable must be true or false",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { isAvailable },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Availability updated successfully",
      user,
    });
  } catch (error) {
    console.error("Availability update error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  searchDonors,
  updateAvailability,
};