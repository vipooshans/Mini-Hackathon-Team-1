import FavoriteCenter from "../../models/recycling/FavoriteCenter.js";
import FavoriteGuide from "../../models/recycling/FavoriteGuide.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addFavoriteCenter = asyncHandler(async (req, res) => {
  const { centerId } = req.params;
  const fav = await FavoriteCenter.findOneAndUpdate(
    { userId: req.user.id, centerId },
    { userId: req.user.id, centerId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ success: true, data: fav });
});

export const removeFavoriteCenter = asyncHandler(async (req, res) => {
  await FavoriteCenter.findOneAndDelete({
    userId: req.user.id,
    centerId: req.params.centerId,
  });
  res.json({ success: true, data: { centerId: req.params.centerId } });
});

export const listFavoriteCenters = asyncHandler(async (req, res) => {
  const favs = await FavoriteCenter.find({ userId: req.user.id })
    .populate("centerId")
    .sort({ createdAt: -1 })
    .lean();
  const data = favs.map((f) => f.centerId).filter(Boolean);
  res.json({ success: true, data });
});

export const addFavoriteGuide = asyncHandler(async (req, res) => {
  const { guideId } = req.params;
  const fav = await FavoriteGuide.findOneAndUpdate(
    { userId: req.user.id, guideId },
    { userId: req.user.id, guideId },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ success: true, data: fav });
});

export const removeFavoriteGuide = asyncHandler(async (req, res) => {
  await FavoriteGuide.findOneAndDelete({
    userId: req.user.id,
    guideId: req.params.guideId,
  });
  res.json({ success: true, data: { guideId: req.params.guideId } });
});

export const listFavoriteGuides = asyncHandler(async (req, res) => {
  const favs = await FavoriteGuide.find({ userId: req.user.id })
    .populate("guideId")
    .sort({ createdAt: -1 })
    .lean();
  const data = favs.map((f) => f.guideId).filter(Boolean);
  res.json({ success: true, data });
});

export const listAllFavorites = asyncHandler(async (req, res) => {
  const [centers, guides] = await Promise.all([
    FavoriteCenter.find({ userId: req.user.id }).populate("centerId").lean(),
    FavoriteGuide.find({ userId: req.user.id }).populate("guideId").lean(),
  ]);
  res.json({
    success: true,
    data: {
      centers: centers.map((f) => f.centerId).filter(Boolean),
      guides: guides.map((f) => f.guideId).filter(Boolean),
      centerIds: centers.map((f) => String(f.centerId?._id || f.centerId)),
      guideIds: guides.map((f) => String(f.guideId?._id || f.guideId)),
    },
  });
});
