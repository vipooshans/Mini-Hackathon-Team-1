import { Schema, model } from "mongoose";

const collectionScheduleSchema = new Schema(
  {
    municipality: { type: String, required: true, trim: true, maxlength: 100 },
    district: { type: String, required: true, trim: true, maxlength: 100 },
    area: { type: String, required: true, trim: true, maxlength: 100 },
    collectionDay: {
      type: String,
      required: true,
      enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    collectionTime: { type: String, required: true, trim: true, maxlength: 100 },
    wasteType: { type: String, required: true, trim: true, maxlength: 100 },
    status: { type: String, enum: ["Scheduled", "Delayed", "Cancelled"], default: "Scheduled" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

collectionScheduleSchema.index({ municipality: 1, district: 1, area: 1 }, { unique: true });

export default model("CollectionSchedule", collectionScheduleSchema);
