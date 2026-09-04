import { Schema, model } from "mongoose";

const collectionScheduleSchema = new Schema(
  {
    municipality: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    collectionDay: {
      type: String,
      required: true,
      enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    collectionTime: { type: String, required: true, trim: true },
    wasteType: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ["On schedule", "Delayed", "Rescheduled"], default: "On schedule" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

collectionScheduleSchema.index({ municipality: 1, district: 1, area: 1 }, { unique: true });

export default model("CollectionSchedule", collectionScheduleSchema);
