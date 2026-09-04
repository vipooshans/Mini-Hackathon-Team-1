import { Router } from "express";
import { lookupCollectionSchedule } from "../../controllers/collection-schedule/collectionScheduleController.js";

const router = Router();
router.get("/lookup", lookupCollectionSchedule);

export default router;
