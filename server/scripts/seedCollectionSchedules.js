import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import CollectionSchedule from "../models/CollectionSchedule.js";

dotenv.config();

const sampleSchedules = [
  { municipality: "Jaffna Municipal Council", district: "Jaffna", area: "Nallur", collectionDay: "Monday", collectionTime: "7:00 AM", wasteType: "Household waste", status: "On schedule", active: true },
  { municipality: "Jaffna Municipal Council", district: "Jaffna", area: "Jaffna Town", collectionDay: "Thursday", collectionTime: "7:00 AM", wasteType: "Household waste and recyclables", status: "On schedule", active: true },
  { municipality: "Colombo Municipal Council", district: "Colombo", area: "Colombo 06", collectionDay: "Tuesday", collectionTime: "6:30 AM", wasteType: "Household waste and separated recyclables", status: "On schedule", active: true },
  { municipality: "Dehiwala-Mount Lavinia Municipal Council", district: "Colombo", area: "Dehiwala", collectionDay: "Wednesday", collectionTime: "6:45 AM", wasteType: "Household waste", status: "On schedule", active: true },
  { municipality: "Kandy Municipal Council", district: "Kandy", area: "Kandy", collectionDay: "Friday", collectionTime: "7:00 AM", wasteType: "Household waste and garden waste", status: "On schedule", active: true },
  { municipality: "Galle Municipal Council", district: "Galle", area: "Galle", collectionDay: "Saturday", collectionTime: "6:30 AM", wasteType: "Household waste and separated recyclables", status: "On schedule", active: true },
];

async function seedCollectionSchedules() {
  await connectDB();
  for (const schedule of sampleSchedules) {
    await CollectionSchedule.updateOne(
      { municipality: schedule.municipality, district: schedule.district, area: schedule.area },
      { $set: schedule },
      { upsert: true }
    );
  }
  console.log(`Seeded ${sampleSchedules.length} sample collection schedules.`);
  console.log("Existing schedules with other locations were not removed.");
  process.exit(0);
}

seedCollectionSchedules().catch((error) => {
  console.error("Could not seed collection schedules:", error.message);
  process.exit(1);
});
