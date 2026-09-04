import { findActiveCollectionSchedule } from "../../services/collection-schedule/collectionScheduleService.js";
import { validateScheduleLookup } from "../../validators/collection-schedule/collectionScheduleValidator.js";

export const lookupCollectionSchedule = async (req, res) => {
  const validation = validateScheduleLookup(req.query);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  try {
    const schedule = await findActiveCollectionSchedule(validation.value);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "No collection schedule is currently available for this area.",
      });
    }

    return res.status(200).json({ success: true, data: schedule });
  } catch {
    return res.status(500).json({
      success: false,
      message: "We couldn't load the collection schedule. Please try again.",
    });
  }
};
