import CenterReport from "../../models/recycling/CenterReport.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createReport = asyncHandler(async (req, res) => {
  const { centerId, reason, description } = req.body;
  if (!centerId || !reason) {
    return res.status(400).json({
      success: false,
      message: "centerId and reason are required",
    });
  }
  const report = await CenterReport.create({
    userId: req.user.id,
    centerId,
    reason,
    description: description || "",
    status: "Pending",
  });
  res.status(201).json({ success: true, data: report });
});

export const adminListReports = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const limitNum = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * limitNum;

  const [data, total] = await Promise.all([
    CenterReport.find(filter)
      .populate("centerId", "name district address")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    CenterReport.countDocuments(filter),
  ]);

  res.json({ success: true, data, total, page: Number(page) || 1, limit: limitNum });
});

export const adminPatchReport = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Reviewed", "Resolved", "Rejected"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }
  const updates = { status };
  if (status === "Resolved" || status === "Rejected") {
    updates.resolvedAt = new Date();
  }
  const report = await CenterReport.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  });
  if (!report) {
    return res.status(404).json({ success: false, message: "Report not found" });
  }
  res.json({ success: true, data: report });
});
