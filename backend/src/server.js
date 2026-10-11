const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const donorRoutes = require("./routes/donorRoutes");
const requestRoutes = require("./routes/requestRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "JWT authentication successful",
    user: req.user,
  });
});
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Blood Donation Finder API is running",
  });
});

app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});