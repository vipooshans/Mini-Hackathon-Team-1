import CollectionSchedule from "../../models/CollectionSchedule.js";

export function findActiveCollectionSchedule({ municipality, district, area }) {
  return CollectionSchedule.findOne({ municipality, district, area, active: true }).lean();
}
