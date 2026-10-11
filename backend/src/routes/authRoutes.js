const express = require("express");
const { registerUser,loginUser,createAdmin} = require("../controllers/authController");

const router = express.Router();
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/create-admin", protect, admin, createAdmin);

module.exports = router;