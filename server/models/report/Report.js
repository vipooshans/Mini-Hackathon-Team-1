import { Schema, model } from "mongoose";

/**
 * Report schema — data contract for the "Report a Waste Issue" feature.
 *
 * The `user` field is optional — anonymous reports are allowed.
 * When a logged-in user submits a report, their user ID is attached
 * so they can track it in "My Reports".
 *
 * Teammates: do NOT modify this schema without coordinating with the team.
 */
const reportSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false, // Anonymous reports allowed
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  wasteType: {
    type: String,
    required: true,
    enum: ["Illegal Dumping", "Overflowing Bin", "Uncollected Garbage"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Acknowledged", "Resolved"],
    default: "Pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
    address: { type: String, required: false },
  },
  images: [
    {
      type: String, // file path, e.g. "/uploads/1234-photo.jpg"
    },
  ],
});

export default model("Report", reportSchema);
