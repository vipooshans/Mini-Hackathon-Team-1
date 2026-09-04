import { Router } from "express";
import {
  addFavoriteCenter,
  removeFavoriteCenter,
  listFavoriteCenters,
  addFavoriteGuide,
  removeFavoriteGuide,
  listFavoriteGuides,
  listAllFavorites,
} from "../../controllers/recycling/favoriteController.js";
import { protect } from "../../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", listAllFavorites);
router.get("/centers", listFavoriteCenters);
router.post("/centers/:centerId", addFavoriteCenter);
router.delete("/centers/:centerId", removeFavoriteCenter);
router.get("/guides", listFavoriteGuides);
router.post("/guides/:guideId", addFavoriteGuide);
router.delete("/guides/:guideId", removeFavoriteGuide);

export default router;
