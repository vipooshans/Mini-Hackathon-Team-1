import { Router } from "express";
import {
  listGuides,
  searchGuides,
  suggestGuides,
  guidesByCategory,
  getGuideById,
} from "../../controllers/recycling/wasteGuideController.js";
import { optionalAuth } from "../../middleware/auth.js";

const router = Router();

router.get("/", listGuides);
router.get("/search", optionalAuth, searchGuides);
router.get("/suggest", suggestGuides);
router.get("/category/:category", guidesByCategory);
router.get("/:id", optionalAuth, getGuideById);

export default router;
