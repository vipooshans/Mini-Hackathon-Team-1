import { Router } from "express";
import { upload } from "../../middleware/report/upload.js";
import { validateReport } from "../../middleware/report/validateReport.js";
import {
  createReport,
  getReports,
} from "../../controllers/report/reportController.js";

const router = Router();

// POST /api/reports — create a new waste report
// 1. multer parses multipart/form-data (up to 3 images)
// 2. validateReport checks required fields
// 3. createReport saves to MongoDB
router.post("/", upload.array("images", 3), validateReport, createReport);

// GET /api/reports — list all waste reports (newest first)
router.get("/", getReports);

export default router;
