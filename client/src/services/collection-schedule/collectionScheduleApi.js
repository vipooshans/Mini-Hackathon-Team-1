const API_BASE = import.meta.env?.VITE_API_URL || "/api";

export async function lookupCollectionSchedule({ municipality, district, area }) {
  const query = new URLSearchParams({ municipality, district, area });
  const response = await fetch(`${API_BASE}/collection-schedules/lookup?${query}`);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Collection schedule lookup failed");

  const data = await response.json();
  return data.schedule;
}
