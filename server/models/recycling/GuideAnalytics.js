import { Schema, model } from "mongoose";

const guideAnalyticsSchema = new Schema(
  {
    wasteGuideId: {
      type: Schema.Types.ObjectId,
      ref: "WasteGuide",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    searchedKeyword: { type: String, trim: true, lowercase: true },
    type: {
      type: String,
      enum: ["view", "search"],
      required: true,
    },
    district: { type: String, trim: true, default: "" },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "RecyclingCenter",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

guideAnalyticsSchema.index({ type: 1, createdAt: -1 });
guideAnalyticsSchema.index({ wasteGuideId: 1 });
guideAnalyticsSchema.index({ searchedKeyword: 1 });

export default model("GuideAnalytics", guideAnalyticsSchema);
