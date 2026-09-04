// Replace or extend this local list with API data when the backend endpoint is ready.
export const disposalItems = [
  {
    id: "batteries",
    name: "Batteries",
    keywords: ["battery", "batteries", "cell"],
    category: "Hazardous waste",
    guidance: "Take used batteries to an approved battery collection point. Do not put them in household bins.",
    action: "Find a battery drop-off point",
  },
  {
    id: "e-waste",
    name: "E-waste",
    keywords: ["e-waste", "electronic", "electronics", "phone", "computer", "charger"],
    category: "Electronic waste",
    guidance: "Use a certified e-waste collection centre or a retailer take-back programme.",
    action: "Find an e-waste centre",
  },
  {
    id: "plastic",
    name: "Plastic",
    keywords: ["plastic", "bottle", "container", "packaging"],
    category: "Recyclable",
    guidance: "Rinse containers, keep them dry, and place accepted plastic items in the recycling collection.",
    action: "Check accepted plastics",
  },
  {
    id: "glass",
    name: "Glass",
    keywords: ["glass", "jar", "bottle"],
    category: "Recyclable",
    guidance: "Rinse glass bottles and jars. Separate them by the collection guidance for your area.",
    action: "Check glass collection",
  },
];

export function findDisposalItems(query) {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  return disposalItems.filter((item) =>
    [item.name, item.category, item.guidance, ...item.keywords]
      .join(" ")
      .toLowerCase()
      .includes(term),
  );
}
