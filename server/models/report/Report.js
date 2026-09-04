import { Schema, model } from "mongoose";

/**
 * Report schema — data contract for the "Report a Waste Issue" feature.
 *
 * Teammates: do NOT modify this schema without coordinating with the team.
 * The frontend form, validation middleware, and controller all depend on
 * these exact field names and enum values.
 */
const reportSchema = new Schema({
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
