import { asyncHandler } from "../../utils/asyncHandler.js";
import { findActiveCollectionSchedule } from "../../services/collection-schedule/collectionScheduleService.js";
import { validateScheduleLookup } from "../../validators/collection-schedule/collectionScheduleValidator.js";

export const lookupCollectionSchedule = asyncHandler(async (req, res) => {
  const validation = validateScheduleLookup(req.query);
  if (!validation.valid) return res.status(400).json({ message: validation.message });

  const schedule = await findActiveCollectionSchedule(validation.value);
  if (!schedule) {
    return res.status(404).json({ message: "No collection schedule is currently available for this area." });
  }

  return res.json({ schedule });
});
