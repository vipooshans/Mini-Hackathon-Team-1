import { Router } from "express";
import {
  createReport,
  adminListReports,
  adminPatchReport,
} from "../../controllers/recycling/reportController.js";
import { protect, authorize } from "../../middleware/auth.js";

const router = Router();

router.post("/", protect, createReport);
router.get("/admin", protect, authorize("municipality"), adminListReports);
router.patch("/admin/:id", protect, authorize("municipality"), adminPatchReport);

export default router;
