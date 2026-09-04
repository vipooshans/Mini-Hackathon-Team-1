import { Router } from "express";
import {
  listCenters,
  searchCenters,
  nearbyCenters,
  getCenterById,
  recyclerCreateCenter,
  recyclerUpdateCenter,
  recyclerMyCenters,
} from "../../controllers/recycling/recyclingCenterController.js";
import { protect, authorize, optionalAuth } from "../../middleware/auth.js";

const router = Router();

router.get("/", listCenters);
router.get("/search", searchCenters);
router.get("/nearby", nearbyCenters);
router.get("/mine", protect, authorize("recycler", "municipality"), recyclerMyCenters);
router.post("/", protect, authorize("recycler"), recyclerCreateCenter);
router.put("/:id", protect, authorize("recycler", "municipality"), recyclerUpdateCenter);
router.get("/:id", optionalAuth, getCenterById);

export default router;
