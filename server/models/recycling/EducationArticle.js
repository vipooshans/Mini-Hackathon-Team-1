import { Schema, model } from "mongoose";

const educationArticleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, default: "", trim: true },
    content: { type: String, default: "", trim: true },
    category: { type: String, default: "General", trim: true },
    image: { type: String, default: "", trim: true },
    language: { type: String, default: "en", enum: ["en", "si", "ta"] },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

educationArticleSchema.index({ status: 1, language: 1 });
educationArticleSchema.index({ category: 1 });

export default model("EducationArticle", educationArticleSchema);
