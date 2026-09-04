import EducationArticle from "../../models/recycling/EducationArticle.js";
import WasteGuide from "../../models/recycling/WasteGuide.js";
import RecyclingCenter from "../../models/recycling/RecyclingCenter.js";
import CenterReport from "../../models/recycling/CenterReport.js";
import GuideAnalytics from "../../models/recycling/GuideAnalytics.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const listArticles = asyncHandler(async (req, res) => {
  const { language = "en", category } = req.query;
  const filter = { status: "published", language };
  if (category) filter.category = category;
  const data = await EducationArticle.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data });
});

export const getArticleBySlug = asyncHandler(async (req, res) => {
  const article = await EducationArticle.findOne({
    $or: [{ slug: req.params.slug }, { _id: req.params.slug }],
    status: "published",
  }).lean();
  if (!article) {
    return res.status(404).json({ success: false, message: "Article not found" });
  }
  res.json({ success: true, data: article });
});

export const dashboardStats = asyncHandler(async (_req, res) => {
  const [
    totalGuides,
    publishedGuides,
    totalCenters,
    verifiedCenters,
    pendingVerification,
    citizenReports,
    guidesByCategory,
    centersByType,
    centersByDistrict,
    topSearches,
    topViews,
  ] = await Promise.all([
    WasteGuide.countDocuments(),
    WasteGuide.countDocuments({ status: "published" }),
    RecyclingCenter.countDocuments(),
    RecyclingCenter.countDocuments({ verificationStatus: "Approved", verified: true }),
    RecyclingCenter.countDocuments({ verificationStatus: "Pending Verification" }),
    CenterReport.countDocuments({ status: "Pending" }),
    WasteGuide.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    RecyclingCenter.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    RecyclingCenter.aggregate([
      { $group: { _id: "$district", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    GuideAnalytics.aggregate([
      { $match: { type: "search", searchedKeyword: { $nin: [null, ""] } } },
      { $group: { _id: "$searchedKeyword", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    GuideAnalytics.aggregate([
      { $match: { type: "view", wasteGuideId: { $ne: null } } },
      { $group: { _id: "$wasteGuideId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "wasteguides",
          localField: "_id",
          foreignField: "_id",
          as: "guide",
        },
      },
      { $unwind: { path: "$guide", preserveNullAndEmptyArrays: true } },
      { $project: { count: 1, name: "$guide.name" } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalGuides,
      publishedGuides,
      totalCenters,
      verifiedCenters,
      pendingVerification,
      citizenReports,
      guidesByCategory,
      centersByType,
      centersByDistrict,
      topSearches,
      topViews,
    },
  });
});
