import Report from "../../models/report/Report.js";

/**
 * createReport — POST /api/reports
 *
 * Handles multipart/form-data (via multer).
 * If the user is authenticated (req.user exists), links the report to their account.
 */
export const createReport = async (req, res, next) => {
  try {
    const { district, wasteType, description, address } = req.body;

    const lat = req.body.lat ? parseFloat(req.body.lat) : undefined;
    const lng = req.body.lng ? parseFloat(req.body.lng) : undefined;

    let location;
    if (lat !== undefined || lng !== undefined || address) {
      location = {};
      if (lat !== undefined && !isNaN(lat)) location.lat = lat;
      if (lng !== undefined && !isNaN(lng)) location.lng = lng;
      if (address) location.address = address;
    }

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const reportData = {
      district,
      wasteType,
      description,
      ...(location && { location }),
      ...(images.length > 0 && { images }),
    };

    // Link to authenticated user if present
    if (req.user) {
      reportData.user = req.user.id;
    }

    const report = await Report.create(reportData);
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

/**
 * getReports — GET /api/reports
 * Returns all reports (public).
 */
export const getReports = async (_req, res, next) => {
  try {
    const reports = await Report.find().sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

/**
 * getMyReports — GET /api/reports/mine
 * Returns only the authenticated user's reports.
 */
export const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};
