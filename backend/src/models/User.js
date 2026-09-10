const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    role: {
      type: String,
      enum: ["donor", "recipient", "admin"],
      default: "donor",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVerified:{
    type: Boolean,
    default: false,
  },
  },
    

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);