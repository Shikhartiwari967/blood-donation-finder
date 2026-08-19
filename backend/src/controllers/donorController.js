const User = require("../models/User");

const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;

    // Build search filter
    const filter = {
      role: "donor",
      isAvailable: true,
    };

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

module.exports = {
  searchDonors,
};