import Report from "../../models/report/Report.js";

/**
 * createReport — POST /api/reports
 *
 * Handles multipart/form-data (via multer).
 * Text fields come from req.body, uploaded files from req.files.
 * Location fields (lat, lng) are sent as strings in FormData and
 * need to be parsed to numbers.
 */
export const createReport = async (req, res, next) => {
  try {
    const { district, wasteType, description, address } = req.body;

    // Parse location from FormData string values
    const lat = req.body.lat ? parseFloat(req.body.lat) : undefined;
    const lng = req.body.lng ? parseFloat(req.body.lng) : undefined;

    // Build location object only if at least one field is present
    let location;
    if (lat !== undefined || lng !== undefined || address) {
      location = {};
      if (lat !== undefined && !isNaN(lat)) location.lat = lat;
      if (lng !== undefined && !isNaN(lng)) location.lng = lng;
      if (address) location.address = address;
    }

    // Collect uploaded image paths
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const report = await Report.create({
      district,
      wasteType,
      description,
      ...(location && { location }),
      ...(images.length > 0 && { images }),
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

/**
 * getReports — GET /api/reports
 * Returns all reports sorted by date descending (newest first).
 */
export const getReports = async (_req, res, next) => {
  try {
    const reports = await Report.find().sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};
