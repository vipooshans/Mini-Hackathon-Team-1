import jwt from "jsonwebtoken";

/**
 * JWT authentication middleware.
 *
 * Extracts token from "Authorization: Bearer <token>" header.
 * On success: attaches req.user = { id, email } and calls next().
 * On failure: returns 401 with { message }.
 *
 * Usage in routes:
 *   import { protect } from "../middleware/auth.js";
 *   router.get("/protected", protect, handler);
 */
export const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authenticated. Please log in.",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
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
 *
 * Use this for routes where auth is optional (e.g., creating a report
 * that can be anonymous or linked to a user).
 */
export const optionalAuth = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next();
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
  } catch {
    // Token invalid — treat as anonymous, don't reject
  }

  next();
};
