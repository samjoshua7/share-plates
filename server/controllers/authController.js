const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: generate signed JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      organizationName,
      geoLocation,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !phone || !address) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Organization name required for store and shelter
    if ((role === "store" || role === "shelter") && !organizationName) {
      return res
        .status(400)
        .json({ message: "Organization name is required for stores and shelters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      address,
      organizationName: organizationName || "",
      geoLocation: geoLocation || { lat: null, lng: null },
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        organizationName: user.organizationName,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        organizationName: user.organizationName,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    organizationName: user.organizationName,
  });
};

module.exports = { registerUser, loginUser, getMe };
