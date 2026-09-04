function validateValue(value, fieldName) {
  if (typeof value !== "string") {
    return `${fieldName} is required.`;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) return `${fieldName} is required.`;
  if (trimmedValue.length > 100) return `${fieldName} must be 100 characters or fewer.`;

  return null;
}

export function validateScheduleLookup(query) {
  const fields = [
    ["municipality", "Municipality"],
    ["district", "District"],
    ["area", "Area"],
  ];

  for (const [key, label] of fields) {
    const message = validateValue(query[key], label);
    if (message) return { valid: false, message };
  }

  return {
    valid: true,
    value: {
      municipality: query.municipality.trim(),
      district: query.district.trim(),
      area: query.area.trim(),
    },
  };
}
