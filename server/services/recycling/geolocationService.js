/**
 * Convert km to metres for MongoDB $near maxDistance.
 */
export function kmToMeters(km) {
  const n = Number(km);
  if (!Number.isFinite(n) || n <= 0) return 10000; // default 10 km
  return n * 1000;
}

/**
 * Haversine distance in km between two WGS84 points.
 */
export function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Build citizen-visible center filter (exclude suspended; optionally verified-only).
 */
export function buildPublicCenterFilter({
  wasteType,
  district,
  municipality,
  type,
  verifiedOnly,
  openNowIgnored,
} = {}) {
  const filter = {
    verificationStatus: { $ne: "Suspended" },
  };

  // Citizens normally see Approved; also show Pending demo listings clearly marked
  // but exclude Rejected and Suspended from default browse
  if (verifiedOnly === "true" || verifiedOnly === true) {
    filter.verificationStatus = "Approved";
    filter.verified = true;
  } else {
    filter.verificationStatus = { $in: ["Approved", "Pending Verification"] };
  }

  if (wasteType) filter.acceptedWaste = wasteType;
  if (district) filter.district = new RegExp(`^${escape(district)}$`, "i");
  if (municipality) filter.municipality = new RegExp(escape(municipality), "i");
  if (type) filter.type = type;

  void openNowIgnored; // open-now filtered client-side from openingHours
  return filter;
}

function escape(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Attach rounded distance (km) to a center document from user coords.
 */
export function withDistance(center, latitude, longitude) {
  const obj = center.toObject ? center.toObject() : { ...center };
  if (
    latitude != null &&
    longitude != null &&
    obj.location?.coordinates?.length === 2
  ) {
    const [lng, lat] = obj.location.coordinates;
    obj.distance = Math.round(distanceKm(latitude, longitude, lat, lng) * 10) / 10;
  }
  return obj;
}
