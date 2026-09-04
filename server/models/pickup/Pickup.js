import { Schema, model } from "mongoose";

/**
 * Pickup request — citizen → recycler marketplace.
 */
const pickupSchema = new Schema({
  citizen: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recycler: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  material: {
    type: String,
    required: true,
    enum: ["Plastic", "Paper", "Metal", "Glass", "E-waste", "Mixed"],
  },
  quantity: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
    default: "",
  },
  preferredDate: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ["Open", "Accepted", "Completed", "Cancelled"],
    default: "Open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Pickup", pickupSchema);
