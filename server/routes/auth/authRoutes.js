import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../../controllers/auth/authController.js";

const router = Router();

// POST /api/auth/register — create a new account
router.post("/register", register);

// POST /api/auth/login — sign in
router.post("/login", login);

// GET /api/auth/profile — get current user info (protected)
router.get("/profile", protect, getProfile);

// PATCH /api/auth/profile — update profile + reminders
router.patch("/profile", protect, updateProfile);

export default router;
