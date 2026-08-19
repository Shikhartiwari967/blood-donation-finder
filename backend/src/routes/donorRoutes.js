const express = require("express");

const { searchDonors, updateAvailability,} = require("../controllers/donorController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/search", searchDonors);
router.patch("/availability", protect, updateAvailability);

module.exports = router;