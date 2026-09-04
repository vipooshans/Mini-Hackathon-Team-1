function cleanQueryValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateScheduleLookup(query) {
  const municipality = cleanQueryValue(query.municipality);
  const district = cleanQueryValue(query.district);
  const area = cleanQueryValue(query.area);

  if (!municipality) return { valid: false, message: "Please select your municipal council." };
  if (!district) return { valid: false, message: "Please select your district." };
  if (!area) return { valid: false, message: "Please select your area." };

  return { valid: true, value: { municipality, district, area } };
}
