const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.userId).select("role");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};



module.exports = adminMiddleware;