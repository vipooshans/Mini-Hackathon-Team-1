import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken, verifyToken } from "../utils/generateToken.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    const error = new Error("Not authorized. Please log in.");
    error.statusCode = 401;
    throw error;
  }

  const token = header.slice(7);
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    const error = new Error("Session expired or invalid. Please log in again.");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    const error = new Error("User no longer exists.");
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});
