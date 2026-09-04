import RecyclingCenter from "../../models/recycling/RecyclingCenter.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  buildPublicCenterFilter,
  kmToMeters,
  withDistance,
} from "../../services/recycling/geolocationService.js";

export const listCenters = asyncHandler(async (req, res) => {
  const {
    wasteType,
    district,
    municipality,
    type,
    verifiedOnly,
    page = 1,
    limit = 20,
    latitude,
    longitude,
  } = req.query;

  const filter = buildPublicCenterFilter({
    wasteType,
    district,
    municipality,
    type,
    verifiedOnly,
  });

  const limitNum = Math.min(Number(limit) || 20, 50);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * limitNum;

  const [rows, total] = await Promise.all([
    RecyclingCenter.find(filter).sort({ name: 1 }).skip(skip).limit(limitNum),
    RecyclingCenter.countDocuments(filter),
  ]);

  const lat = latitude != null ? Number(latitude) : null;
  const lng = longitude != null ? Number(longitude) : null;
  let data = rows.map((c) => withDistance(c, lat, lng));
  if (lat != null && lng != null) {
    data = data.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
  }

  res.json({ success: true, data, total, page: Number(page) || 1, limit: limitNum });
});

export const searchCenters = asyncHandler(async (req, res) => {
  const { q = "", ...rest } = req.query;
  req.query = rest;
  // Reuse list with name regex
  const filter = buildPublicCenterFilter(rest);
  if (q.trim()) {
    filter.name = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  }
  const data = await RecyclingCenter.find(filter).sort({ name: 1 }).limit(30).lean();
  res.json({ success: true, data });
});

export const nearbyCenters = asyncHandler(async (req, res) => {
  const {
    latitude,
    longitude,
    radius = 10,
    wasteType,
    district,
    type,
    verifiedOnly,
    limit = 30,
  } = req.query;

  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({
      success: false,
      message: "latitude and longitude are required for nearby search",
    });
  }

  const filter = buildPublicCenterFilter({
    wasteType,
    district,
    type,
    verifiedOnly,
  });

  filter.location = {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: kmToMeters(radius),
    },
  };

  const rows = await RecyclingCenter.find(filter).limit(Math.min(Number(limit) || 30, 50));
  const data = rows.map((c) => withDistance(c, lat, lng));

  res.json({ success: true, data });
});

export const getCenterById = asyncHandler(async (req, res) => {
  const center = await RecyclingCenter.findById(req.params.id);
  if (!center) {
    return res.status(404).json({ success: false, message: "Recycling center not found" });
  }

  const isAdmin = req.user?.role === "municipality";
  if (!isAdmin) {
    if (center.verificationStatus === "Suspended" || center.verificationStatus === "Rejected") {
      return res.status(404).json({ success: false, message: "Recycling center not found" });
    }
  }

  const lat = req.query.latitude != null ? Number(req.query.latitude) : null;
  const lng = req.query.longitude != null ? Number(req.query.longitude) : null;
  res.json({ success: true, data: withDistance(center, lat, lng) });
});

/** Recycler: create own center */
export const recyclerCreateCenter = asyncHandler(async (req, res) => {
  const body = {
    ...req.body,
    createdBy: req.user.id,
    verified: false,
    verificationStatus: "Pending Verification",
    isDemo: false,
  };
  if (body.latitude != null && body.longitude != null) {
    body.location = {
      type: "Point",
      coordinates: [Number(body.longitude), Number(body.latitude)],
    };
    delete body.latitude;
    delete body.longitude;
  }
  const center = await RecyclingCenter.create(body);
  res.status(201).json({ success: true, data: center });
});

/** Recycler: update own center */
export const recyclerUpdateCenter = asyncHandler(async (req, res) => {
  const center = await RecyclingCenter.findById(req.params.id);
  if (!center) {
    return res.status(404).json({ success: false, message: "Recycling center not found" });
  }
  if (center.createdBy?.toString() !== req.user.id && req.user.role !== "municipality") {
    return res.status(403).json({ success: false, message: "Not authorized to update this center" });
  }

  const updates = { ...req.body };
  if (updates.latitude != null && updates.longitude != null) {
    updates.location = {
      type: "Point",
      coordinates: [Number(updates.longitude), Number(updates.latitude)],
    };
    delete updates.latitude;
    delete updates.longitude;
  }
  if (req.user.role === "recycler") {
    updates.verified = false;
    updates.verificationStatus = "Pending Verification";
  }

  Object.assign(center, updates);
  await center.save();
  res.json({ success: true, data: center });
});

export const recyclerMyCenters = asyncHandler(async (req, res) => {
  const data = await RecyclingCenter.find({ createdBy: req.user.id }).sort({ updatedAt: -1 });
  res.json({ success: true, data });
});

/** Admin */
export const adminListCenters = asyncHandler(async (req, res) => {
  const { q = "", district, verificationStatus, type, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (district) filter.district = district;
  if (verificationStatus) filter.verificationStatus = verificationStatus;
  if (type) filter.type = type;
  if (q.trim()) {
    filter.name = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  }

  const limitNum = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * limitNum;

  const [data, total] = await Promise.all([
    RecyclingCenter.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limitNum).lean(),
    RecyclingCenter.countDocuments(filter),
  ]);

  res.json({ success: true, data, total, page: Number(page) || 1, limit: limitNum });
});

export const adminCreateCenter = asyncHandler(async (req, res) => {
  const body = { ...req.body, createdBy: req.user.id };
  if (body.latitude != null && body.longitude != null) {
    body.location = {
      type: "Point",
      coordinates: [Number(body.longitude), Number(body.latitude)],
    };
    delete body.latitude;
    delete body.longitude;
  }
  if (body.verificationStatus === "Approved") {
    body.verified = true;
  }
  const center = await RecyclingCenter.create(body);
  res.status(201).json({ success: true, data: center });
});

export const adminUpdateCenter = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (updates.latitude != null && updates.longitude != null) {
    updates.location = {
      type: "Point",
      coordinates: [Number(updates.longitude), Number(updates.latitude)],
    };
    delete updates.latitude;
    delete updates.longitude;
  }
  const center = await RecyclingCenter.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!center) {
    return res.status(404).json({ success: false, message: "Recycling center not found" });
  }
  res.json({ success: true, data: center });
});

export const adminDeleteCenter = asyncHandler(async (req, res) => {
  const center = await RecyclingCenter.findByIdAndDelete(req.params.id);
  if (!center) {
    return res.status(404).json({ success: false, message: "Recycling center not found" });
  }
  res.json({ success: true, data: { id: req.params.id } });
});

export const adminVerifyCenter = asyncHandler(async (req, res) => {
  const { verificationStatus } = req.body;
  const allowed = ["Pending Verification", "Approved", "Rejected", "Suspended"];
  if (!allowed.includes(verificationStatus)) {
    return res.status(400).json({ success: false, message: "Invalid verification status" });
  }
  const center = await RecyclingCenter.findByIdAndUpdate(
    req.params.id,
    {
      verificationStatus,
      verified: verificationStatus === "Approved",
    },
    { new: true }
  );
  if (!center) {
    return res.status(404).json({ success: false, message: "Recycling center not found" });
  }
  res.json({ success: true, data: center });
});
