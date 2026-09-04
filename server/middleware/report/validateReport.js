/**
 * Validation middleware for POST /api/reports.
 *
 * Works with both JSON and multipart/form-data (multer).
 * When using FormData, lat/lng arrive as strings, so we parse them.
 *
 * Validates:
 * - district: required, non-empty string
 * - wasteType: required, must match one of the 3 enum values
 * - description: required, non-empty string
 * - lat/lng: optional, but if provided must be valid numbers in range
 *
 * Location is entirely optional — reports save without geolocation.
 * On failure: responds 400 with { message: "<specific friendly reason>" }
 * On success: calls next()
 */

const VALID_WASTE_TYPES = [
  "Illegal Dumping",
  "Overflowing Bin",
  "Uncollected Garbage",
];

export const validateReport = (req, res, next) => {
  const { district, wasteType, description } = req.body;

  // --- Required fields ---

  if (!district || typeof district !== "string" || !district.trim()) {
    return res.status(400).json({
      message: "District is required. Please select or enter your district.",
    });
  }

  if (!wasteType || typeof wasteType !== "string") {
    return res.status(400).json({
      message:
        "Waste type is required. Please select a waste type (Illegal Dumping, Overflowing Bin, or Uncollected Garbage).",
    });
  }

  if (!VALID_WASTE_TYPES.includes(wasteType)) {
    return res.status(400).json({
      message: `Invalid waste type "${wasteType}". Must be one of: ${VALID_WASTE_TYPES.join(", ")}.`,
    });
  }

  if (
    !description ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return res.status(400).json({
      message:
        "Description is required. Please describe the waste issue you are reporting.",
    });
  }

  // --- Optional location validation ---
  // With FormData, lat/lng come as strings. Parse and validate.
  const rawLat = req.body.lat;
  const rawLng = req.body.lng;

  if (rawLat !== undefined && rawLat !== null && rawLat !== "") {
    const lat = parseFloat(rawLat);
    if (isNaN(lat)) {
      return res.status(400).json({
        message: "Latitude must be a valid number.",
      });
    }
    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        message: "Latitude must be between -90 and 90.",
      });
    }
  }

  if (rawLng !== undefined && rawLng !== null && rawLng !== "") {
    const lng = parseFloat(rawLng);
    if (isNaN(lng)) {
      return res.status(400).json({
        message: "Longitude must be a valid number.",
      });
    }
    if (lng < -180 || lng > 180) {
      return res.status(400).json({
        message: "Longitude must be between -180 and 180.",
      });
    }
  }

  next();
};
