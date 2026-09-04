import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * JWT authentication middleware.
 *
 * Extracts token from "Authorization: Bearer <token>" header.
 * On success: attaches req.user = { id, email, role } and calls next().
 * On failure: returns 401 with { message }.
 */
export const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authenticated. Please log in.",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("email role");

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please log in again.",
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role || decoded.role || "citizen",
    };
    next();
  } catch {
    return res.status(401).json({
      message: "Token expired or invalid. Please log in again.",
    });
  }
};

/**
 * Optional auth middleware — attaches req.user if token is present,
 * but does NOT reject the request if missing.
 */
export const optionalAuth = async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next();
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("email role");
    if (user) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role || decoded.role || "citizen",
      };
    }
  } catch {
    // Token invalid — treat as anonymous, don't reject
  }

  next();
};

/**
 * Restrict route to one or more roles.
 * Usage: protect, authorize("municipality")
 */
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized to perform this action.",
      });
    }
    next();
  };
