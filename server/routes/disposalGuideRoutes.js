import { Router } from "express";
import { getDisposalGuides } from "../controllers/disposalGuideController.js";

const router = Router();

router.get("/", getDisposalGuides);

export default router;
