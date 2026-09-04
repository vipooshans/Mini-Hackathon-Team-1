import { Schema, model } from "mongoose";

export const CENTER_TYPES = [
  "Recycling Center",
  "E-Waste Center",
  "Compost Facility",
  "Collection Point",
  "Donation Center",
  "Scrap Collector",
];

export const VERIFICATION_STATUSES = [
  "Pending Verification",
  "Approved",
  "Rejected",
  "Suspended",
];

const dayHoursSchema = new Schema(
  {
    open: { type: String, default: "" },
    close: { type: String, default: "" },
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const recyclingCenterSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    type: {
      type: String,
      enum: CENTER_TYPES,
      default: "Recycling Center",
    },
    district: { type: String, required: true, trim: true },
    municipality: { type: String, default: "", trim: true },
    address: { type: String, required: true, trim: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: (v) => Array.isArray(v) && v.length === 2,
          message: "coordinates must be [longitude, latitude]",
        },
      },
    },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    openingHours: {
      monday: { type: dayHoursSchema, default: () => ({ open: "08:00", close: "17:00" }) },
      tuesday: { type: dayHoursSchema, default: () => ({ open: "08:00", close: "17:00" }) },
      wednesday: { type: dayHoursSchema, default: () => ({ open: "08:00", close: "17:00" }) },
      thursday: { type: dayHoursSchema, default: () => ({ open: "08:00", close: "17:00" }) },
      friday: { type: dayHoursSchema, default: () => ({ open: "08:00", close: "17:00" }) },
      saturday: { type: dayHoursSchema, default: () => ({ open: "08:00", close: "13:00" }) },
      sunday: { type: dayHoursSchema, default: () => ({ closed: true }) },
    },
    acceptedWaste: {
      type: [{ type: String, trim: true }],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one accepted waste type is required",
      },
    },
    rejectedWaste: [{ type: String, trim: true }],
    services: [{ type: String, trim: true }],
    verified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: VERIFICATION_STATUSES,
      default: "Pending Verification",
    },
    isDemo: { type: Boolean, default: false },
    image: { type: String, default: "", trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

recyclingCenterSchema.index({ location: "2dsphere" });
recyclingCenterSchema.index({ district: 1 });
recyclingCenterSchema.index({ municipality: 1 });
recyclingCenterSchema.index({ verificationStatus: 1 });
recyclingCenterSchema.index({ acceptedWaste: 1 });
recyclingCenterSchema.index({ type: 1 });
recyclingCenterSchema.index({ createdBy: 1 });

export default model("RecyclingCenter", recyclingCenterSchema);
