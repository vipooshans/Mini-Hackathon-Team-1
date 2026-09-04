import { Schema, model } from "mongoose";

export const REPORT_REASONS = [
  "Center closed",
  "Wrong address",
  "Wrong phone number",
  "Wrong accepted waste",
  "Wrong opening hours",
  "Duplicate center",
  "Other",
];

export const REPORT_STATUSES = ["Pending", "Reviewed", "Resolved", "Rejected"];

const centerReportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "RecyclingCenter",
      required: true,
    },
    reason: {
      type: String,
      enum: REPORT_REASONS,
      required: true,
    },
    description: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: REPORT_STATUSES,
      default: "Pending",
    },
    resolvedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

centerReportSchema.index({ centerId: 1, status: 1 });
centerReportSchema.index({ status: 1, createdAt: -1 });

export default model("CenterReport", centerReportSchema);
