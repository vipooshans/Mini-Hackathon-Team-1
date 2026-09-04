import jwt from "jsonwebtoken";
import User, { ROLES } from "../../models/User.js";

/**
 * Generate a JWT token for a user.
 * Expires in 7 days.
 */
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const toUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "citizen",
  phone: user.phone || "",
  district: user.district || "",
  reminderEnabled: Boolean(user.reminderEnabled),
  reminderDay: user.reminderDay || "",
  createdAt: user.createdAt,
});

/**
 * register — POST /api/auth/register
 * Creates a new user and returns JWT + user info.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, district } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const selectedRole = ROLES.includes(role) ? role : "citizen";

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: selectedRole,
      phone: phone || "",
      district: district || "",
    });

    res.status(201).json({
      token: generateToken(user),
      user: toUserPayload(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * login — POST /api/auth/login
 * Verifies credentials and returns JWT + user info.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // +password to include the select:false field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    res.json({
      token: generateToken(user),
      user: toUserPayload(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * getProfile — GET /api/auth/profile
 * Returns the authenticated user's info.
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(toUserPayload(user));
  } catch (error) {
    next(error);
  }
};

/**
 * updateProfile — PATCH /api/auth/profile
 * Updates name, phone, district, and reminder preferences.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { name, phone, district, reminderEnabled, reminderDay } = req.body;

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }
    if (typeof phone === "string") {
      user.phone = phone.trim();
    }
    if (typeof district === "string") {
      user.district = district.trim();
    }
    if (typeof reminderEnabled === "boolean") {
      user.reminderEnabled = reminderEnabled;
    }
    if (typeof reminderDay === "string") {
      user.reminderDay = reminderDay.trim();
    }

    await user.save();
    res.json(toUserPayload(user));
  } catch (error) {
    next(error);
  }
};
