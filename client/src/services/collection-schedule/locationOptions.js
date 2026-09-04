export const locationOptions = [
  { municipality: "Jaffna Municipal Council", district: "Jaffna", areas: ["Nallur", "Jaffna Town", "Other area (demo no result)"] },
  { municipality: "Colombo Municipal Council", district: "Colombo", areas: ["Colombo 06", "Other area (demo no result)"] },
  { municipality: "Dehiwala-Mount Lavinia Municipal Council", district: "Colombo", areas: ["Dehiwala", "Other area (demo no result)"] },
  { municipality: "Kandy Municipal Council", district: "Kandy", areas: ["Kandy", "Other area (demo no result)"] },
  { municipality: "Galle Municipal Council", district: "Galle", areas: ["Galle", "Other area (demo no result)"] },
];

export const municipalities = locationOptions.map(({ municipality }) => municipality);

export function getDistricts(municipality) {
  return [...new Set(locationOptions.filter((item) => item.municipality === municipality).map((item) => item.district))];
}

export function getAreas(municipality, district) {
  return locationOptions.find((item) => item.municipality === municipality && item.district === district)?.areas ?? [];
}
