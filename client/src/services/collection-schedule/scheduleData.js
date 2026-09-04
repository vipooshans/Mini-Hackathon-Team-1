const scheduleData = [
  {
    municipality: "Colombo Municipal Council",
    districts: ["Colombo 01", "Colombo 03", "Colombo 05", "Colombo 07"],
    days: ["Monday", "Thursday"],
    time: "6:30 AM – 9:00 AM",
    waste: "Household & separated recyclables",
    status: "On schedule",
  },
  {
    municipality: "Kandy Municipal Council",
    districts: ["Kandy Central", "Katugastota", "Peradeniya"],
    days: ["Tuesday", "Friday"],
    time: "7:00 AM – 10:00 AM",
    waste: "Household waste",
    status: "On schedule",
  },
  {
    municipality: "Galle Municipal Council",
    districts: ["Galle Fort", "Richmond Hill", "Kaluwella"],
    days: ["Wednesday", "Saturday"],
    time: "6:00 AM – 8:30 AM",
    waste: "Household & garden waste",
    status: "Updated today",
  },
];

export const municipalities = scheduleData.map(({ municipality }) => municipality);

export function getDistricts(municipality) {
  return scheduleData.find((item) => item.municipality === municipality)?.districts ?? [];
}

export function getSchedule(municipality, district) {
  const schedule = scheduleData.find(
    (item) => item.municipality === municipality && item.districts.includes(district)
  );

  return schedule ? { ...schedule, district } : null;
}
