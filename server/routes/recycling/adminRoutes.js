import { Router } from "express";
import {
  adminListGuides,
  adminGetGuide,
  adminCreateGuide,
  adminUpdateGuide,
  adminDeleteGuide,
  adminPatchGuideStatus,
} from "../../controllers/recycling/wasteGuideController.js";
import {
  adminListCenters,
  adminCreateCenter,
  adminUpdateCenter,
  adminDeleteCenter,
  adminVerifyCenter,
} from "../../controllers/recycling/recyclingCenterController.js";
import { dashboardStats } from "../../controllers/recycling/adminController.js";
import {
  adminListReports,
  adminPatchReport,
} from "../../controllers/recycling/reportController.js";
import { protect, authorize } from "../../middleware/auth.js";

const router = Router();

router.use(protect, authorize("municipality"));

router.get("/dashboard", dashboardStats);

router.get("/waste-guides", adminListGuides);
router.get("/waste-guides/:id", adminGetGuide);
router.post("/waste-guides", adminCreateGuide);
router.put("/waste-guides/:id", adminUpdateGuide);
router.delete("/waste-guides/:id", adminDeleteGuide);
router.patch("/waste-guides/:id/status", adminPatchGuideStatus);

router.get("/recycling-centers", adminListCenters);
router.post("/recycling-centers", adminCreateCenter);
router.put("/recycling-centers/:id", adminUpdateCenter);
router.delete("/recycling-centers/:id", adminDeleteCenter);
router.patch("/recycling-centers/:id/verify", adminVerifyCenter);

router.get("/center-reports", adminListReports);
router.patch("/center-reports/:id", adminPatchReport);

export default router;
