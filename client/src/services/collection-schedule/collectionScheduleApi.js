const API_BASE = import.meta.env?.VITE_API_URL || "/api";

export async function lookupCollectionSchedule({ municipality, district, area }) {
  const params = new URLSearchParams({ municipality, district, area });
  const response = await fetch(`${API_BASE}/collection-schedules/lookup?${params.toString()}`);
  const payload = await response.json().catch(() => ({}));

  if (response.status === 404) {
    const error = new Error(payload.message);
    error.code = "NOT_FOUND";
    throw error;
  }
  if (!response.ok) throw new Error("Collection schedule lookup failed");

  return payload.data;
}
