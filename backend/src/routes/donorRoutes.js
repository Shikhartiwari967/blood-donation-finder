const express = require("express");

const { searchDonors } = require("../controllers/donorController");

const router = express.Router();

router.get("/search", searchDonors);

module.exports = router;