const express = require("express");

const {
  updateDonorVerification,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.patch(
  "/donors/:userId/verification",
  protect,
  adminMiddleware,
  updateDonorVerification
);

module.exports = router;