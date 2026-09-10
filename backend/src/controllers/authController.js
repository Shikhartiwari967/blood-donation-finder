const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const createActivityLog = require("../utils/activityLogger");

//register
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      bloodGroup,
      phone,
      city,
      role,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !password ||
      !bloodGroup ||
      !phone ||
      !city
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }
    //password length minimun 6
      if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
      const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      bloodGroup,
      phone: phone.trim(),
      city: city.trim(),
      role: role === "recipient" ? "recipient" : "donor",
    })

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodGroup: user.bloodGroup,
        city: user.city,
        role: user.role,
        isVerified: user.isVerified,
        isAvailable: user.isAvailable,
      },
    });
  } catch (error) {
  console.error("Registration error:", error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((err) => err.message),
    });
  }

  return res.status(500).json({
    message: "Server error",
  });
}
};


// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodGroup: user.bloodGroup,
        city: user.city,
        role: user.role,
        isVerified: user.isVerified,
        isAvailable: user.isAvailable,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// create admin account
const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      isAvailable: false,
    });

    await createActivityLog({
      user: req.user.userId,
      action: "ADMIN_CREATED",
      details: `Admin account created for ${admin.email}`,
    });

    return res.status(201).json({
      message: "Admin account created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);

    return res.status(500).json({
      message: "Server error while creating admin",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  createAdmin,
};

