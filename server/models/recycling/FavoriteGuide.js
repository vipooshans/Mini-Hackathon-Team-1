import { Schema, model } from "mongoose";

const favoriteGuideSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guideId: {
      type: Schema.Types.ObjectId,
      ref: "WasteGuide",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

favoriteGuideSchema.index({ userId: 1, guideId: 1 }, { unique: true });
favoriteGuideSchema.index({ userId: 1 });

export default model("FavoriteGuide", favoriteGuideSchema);
