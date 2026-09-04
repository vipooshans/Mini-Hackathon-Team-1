import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import {
  createPickup,
  listPickups,
  updatePickupStatus,
} from "../../controllers/pickup/pickupController.js";

const router = Router();

router.post("/", protect, createPickup);
router.get("/", protect, listPickups);
router.patch("/:id/status", protect, updatePickupStatus);

export default router;
