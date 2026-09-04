import mongoose from "mongoose";
import WasteGuide from "../../models/recycling/WasteGuide.js";
import GuideAnalytics from "../../models/recycling/GuideAnalytics.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { buildGuideSearchFilter, buildSuggestFilter } from "../../services/recycling/searchService.js";

const publicSelect =
  "name slug category description image recyclable recyclabilityType preparationInstructions dos donts acceptedItems rejectedItems disposalMethods environmentalImpact keywords faqs language status";

export const listGuides = asyncHandler(async (req, res) => {
  const { category, language = "en", page = 1, limit = 20 } = req.query;
  const filter = { status: "published", language };
  if (category) filter.category = category;

  const limitNum = Math.min(Number(limit) || 20, 50);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * limitNum;

  const [data, total] = await Promise.all([
    WasteGuide.find(filter).select(publicSelect).sort({ name: 1 }).skip(skip).limit(limitNum).lean(),
    WasteGuide.countDocuments(filter),
  ]);

  res.json({ success: true, data, total, page: Number(page) || 1, limit: limitNum });
});

export const searchGuides = asyncHandler(async (req, res) => {
  const { q = "", language = "en", page = 1, limit = 20 } = req.query;
  const filter = buildGuideSearchFilter(q, { language, status: "published" });
  const limitNum = Math.min(Number(limit) || 20, 50);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * limitNum;

  const [data, total] = await Promise.all([
    WasteGuide.find(filter).select(publicSelect).sort({ name: 1 }).skip(skip).limit(limitNum).lean(),
    WasteGuide.countDocuments(filter),
  ]);

  if (q.trim()) {
    GuideAnalytics.create({
      type: "search",
      searchedKeyword: q.trim().toLowerCase(),
      userId: req.user?.id,
    }).catch(() => {});
  }

  res.json({ success: true, data, total, page: Number(page) || 1, limit: limitNum });
});

export const suggestGuides = asyncHandler(async (req, res) => {
  const { q = "", language = "en" } = req.query;
  if (!q.trim() || q.trim().length < 2) {
    return res.json({ success: true, data: [] });
  }
  const filter = buildSuggestFilter(q, { language, status: "published" });
  const data = await WasteGuide.find(filter)
    .select("name slug category recyclabilityType image")
    .sort({ name: 1 })
    .limit(8)
    .lean();
  res.json({ success: true, data });
});

export const guidesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { language = "en" } = req.query;
  const data = await WasteGuide.find({
    status: "published",
    language,
    category,
  })
    .select(publicSelect)
    .sort({ name: 1 })
    .lean();
  res.json({ success: true, data });
});

export const getGuideById = asyncHandler(async (req, res) => {
  const or = [{ slug: req.params.id }];
  if (mongoose.isValidObjectId(req.params.id)) {
    or.push({ _id: req.params.id });
  }
  const guide = await WasteGuide.findOne({
    $or: or,
    status: "published",
  })
    .select(publicSelect)
    .lean();

  if (!guide) {
    return res.status(404).json({ success: false, message: "Waste guide not found" });
  }

  GuideAnalytics.create({
    type: "view",
    wasteGuideId: guide._id,
    userId: req.user?.id,
  }).catch(() => {});

  res.json({ success: true, data: guide });
});

/** Admin: list all statuses */
export const adminListGuides = asyncHandler(async (req, res) => {
  const { q = "", category, status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (q.trim()) {
    Object.assign(filter, buildGuideSearchFilter(q, { status: status || undefined }));
    if (!status) delete filter.status;
  }

  const limitNum = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * limitNum;

  const [data, total] = await Promise.all([
    WasteGuide.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limitNum).lean(),
    WasteGuide.countDocuments(filter),
  ]);

  res.json({ success: true, data, total, page: Number(page) || 1, limit: limitNum });
});

export const adminGetGuide = asyncHandler(async (req, res) => {
  const guide = await WasteGuide.findById(req.params.id).lean();
  if (!guide) {
    return res.status(404).json({ success: false, message: "Waste guide not found" });
  }
  res.json({ success: true, data: guide });
});

export const adminCreateGuide = asyncHandler(async (req, res) => {
  const body = { ...req.body, createdBy: req.user.id, updatedBy: req.user.id };
  if (!body.slug && body.name) {
    body.slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  const guide = await WasteGuide.create(body);
  res.status(201).json({ success: true, data: guide });
});

export const adminUpdateGuide = asyncHandler(async (req, res) => {
  const guide = await WasteGuide.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user.id },
    { new: true, runValidators: true }
  );
  if (!guide) {
    return res.status(404).json({ success: false, message: "Waste guide not found" });
  }
  res.json({ success: true, data: guide });
});

export const adminDeleteGuide = asyncHandler(async (req, res) => {
  const guide = await WasteGuide.findByIdAndDelete(req.params.id);
  if (!guide) {
    return res.status(404).json({ success: false, message: "Waste guide not found" });
  }
  res.json({ success: true, data: { id: req.params.id } });
});

export const adminPatchGuideStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["draft", "published", "archived"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }
  const guide = await WasteGuide.findByIdAndUpdate(
    req.params.id,
    { status, updatedBy: req.user.id },
    { new: true }
  );
  if (!guide) {
    return res.status(404).json({ success: false, message: "Waste guide not found" });
  }
  res.json({ success: true, data: guide });
});
