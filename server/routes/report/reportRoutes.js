import { Router } from "express";
import { upload } from "../../middleware/report/upload.js";
import { validateReport } from "../../middleware/report/validateReport.js";
import { optionalAuth, protect } from "../../middleware/auth.js";
import {
  createReport,
  getReports,
  getMyReports,
} from "../../controllers/report/reportController.js";

const router = Router();

// GET /api/reports/mine — get logged-in user's reports
router.get("/mine", protect, getMyReports);

// POST /api/reports — create report (optionalAuth allows linking to user if logged in)
router.post(
  "/",
  optionalAuth,
  upload.array("images", 3),
  validateReport,
  createReport
);

// GET /api/reports — public list
router.get("/", getReports);

export default router;
