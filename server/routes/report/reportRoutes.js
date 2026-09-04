import { Router } from "express";
import { upload } from "../../middleware/report/upload.js";
import { validateReport } from "../../middleware/report/validateReport.js";
import { optionalAuth, protect, authorize } from "../../middleware/auth.js";
import {
  createReport,
  getReports,
  getMyReports,
  updateReportStatus,
} from "../../controllers/report/reportController.js";

const router = Router();

// GET /api/reports/mine — get logged-in user's reports
router.get("/mine", protect, getMyReports);

// PATCH /api/reports/:id/status — municipality updates status
router.patch(
  "/:id/status",
  protect,
  authorize("municipality"),
  updateReportStatus
);

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
