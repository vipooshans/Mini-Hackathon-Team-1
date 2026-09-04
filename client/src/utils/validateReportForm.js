/**
 * Client-side validation for the Report form.
 *
 * Mirrors server-side rules in server/middleware/validateReport.js.
 * Returns a per-field error object — empty object {} means no errors.
 *
 * @param {{ district: string, wasteType: string, description: string, location?: { lat?: number, lng?: number } }} values
 * @returns {{ district?: string, wasteType?: string, description?: string, lat?: string, lng?: string }}
 */

const VALID_WASTE_TYPES = [
  "Illegal Dumping",
  "Overflowing Bin",
  "Uncollected Garbage",
];

export function validateReportForm(values) {
  const errors = {};

  // District — required, non-empty
  if (!values.district || !values.district.trim()) {
    errors.district = "District is required.";
  }

  // Waste type — required, must match enum
  if (!values.wasteType) {
    errors.wasteType = "Please select a waste type.";
  } else if (!VALID_WASTE_TYPES.includes(values.wasteType)) {
    errors.wasteType = "Invalid waste type selected.";
  }

  // Description — required, non-empty
  if (!values.description || !values.description.trim()) {
    errors.description = "Please describe the waste issue.";
  }

  // Location — optional, but validate if provided
  if (values.location) {
    const { lat, lng } = values.location;

    if (lat !== undefined && lat !== null && lat !== "") {
      const latNum = Number(lat);
      if (isNaN(latNum)) {
        errors.lat = "Latitude must be a valid number.";
      } else if (latNum < -90 || latNum > 90) {
        errors.lat = "Latitude must be between -90 and 90.";
      }
    }

    if (lng !== undefined && lng !== null && lng !== "") {
      const lngNum = Number(lng);
      if (isNaN(lngNum)) {
        errors.lng = "Longitude must be a valid number.";
      } else if (lngNum < -180 || lngNum > 180) {
        errors.lng = "Longitude must be between -180 and 180.";
      }
    }
  }

  return errors;
}
