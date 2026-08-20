const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    hospital: {
      type: String,
      required: true,
      trim: true,
    },

    units: {
      type: Number,
      required: true,
      min: 1,
    },

    urgency: {
      type: String,
      enum: ["normal", "urgent", "critical"],
      default: "normal",
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["active", "fulfilled", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);