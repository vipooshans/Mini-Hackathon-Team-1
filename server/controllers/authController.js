import User, { ROLES } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const authResponse = (user, res, status = 200) => {
  const token = generateToken(user._id);
  res.status(status).json({
    token,
    user: user.toSafeObject(),
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, district } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    const error = new Error("Name, email, and password are required.");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters.");
    error.statusCode = 400;
    throw error;
  }

  if (role && !ROLES.includes(role)) {
    const error = new Error("Invalid role selected.");
    error.statusCode = 400;
    throw error;
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: role || "citizen",
    phone: phone?.trim() || "",
    district: district?.trim() || "",
  });

  authResponse(user, res, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    const error = new Error("Email and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password"
  );

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  authResponse(user, res);
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});
