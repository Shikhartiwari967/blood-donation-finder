const User = require("../models/User");

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

module.exports = {
  updateDonorVerification,
};