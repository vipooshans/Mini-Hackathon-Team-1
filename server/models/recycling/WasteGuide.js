import { Schema, model } from "mongoose";

export const WASTE_CATEGORIES = [
  "General Waste",
  "Plastic",
  "Paper",
  "Cardboard",
  "Glass",
  "Metal",
  "Organic Waste",
  "E-Waste",
  "Batteries",
  "Textiles",
  "Construction Waste",
  "Bulky Waste",
  "Hazardous Household Waste",
];

export const RECYCLABILITY_TYPES = [
  "Recyclable",
  "Non-Recyclable",
  "Conditionally Recyclable",
  "Compostable",
  "Reusable",
  "Hazardous",
];

export const DISPOSAL_METHODS = [
  "Municipal collection",
  "Recycling center",
  "E-waste center",
  "Compost facility",
  "Special collection event",
  "Donation center",
  "Reuse",
  "Hazardous waste facility",
  "Scrap collector",
];

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const wasteGuideSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: WASTE_CATEGORIES,
    },
    description: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    recyclable: { type: Boolean, default: false },
    recyclabilityType: {
      type: String,
      enum: RECYCLABILITY_TYPES,
      default: "Conditionally Recyclable",
    },
    preparationInstructions: [{ type: String, trim: true }],
    dos: [{ type: String, trim: true }],
    donts: [{ type: String, trim: true }],
    acceptedItems: [{ type: String, trim: true }],
    rejectedItems: [{ type: String, trim: true }],
    disposalMethods: [{ type: String, trim: true }],
    environmentalImpact: { type: String, default: "", trim: true },
    keywords: [{ type: String, trim: true, lowercase: true }],
    faqs: [faqSchema],
    language: { type: String, default: "en", enum: ["en", "si", "ta"] },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

wasteGuideSchema.index({ name: "text", description: "text", keywords: "text" });
wasteGuideSchema.index({ category: 1, status: 1 });
wasteGuideSchema.index({ keywords: 1 });
wasteGuideSchema.index({ status: 1, language: 1 });

export default model("WasteGuide", wasteGuideSchema);
