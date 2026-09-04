import { Schema, model } from "mongoose";

const favoriteCenterSchema = new Schema(
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
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

favoriteCenterSchema.index({ userId: 1, centerId: 1 }, { unique: true });
favoriteCenterSchema.index({ userId: 1 });

export default model("FavoriteCenter", favoriteCenterSchema);
