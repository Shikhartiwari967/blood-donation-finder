const express = require("express");

const { searchDonors, updateAvailability,} = require("../controllers/donorController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/search", searchDonors);
router.patch("/availability", protect,  roleMiddleware("donor"),updateAvailability);

module.exports = router;