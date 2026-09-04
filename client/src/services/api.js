const API_BASE = "/api";

export async function getHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) {
    throw new Error("Health check failed");
  }
  return response.json();
}

export async function getDisposalGuides({ query = "", category = "All" } = {}) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (category && category !== "All") params.set("category", category);

  const response = await fetch(`${API_BASE}/disposal-guides?${params.toString()}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to load disposal guidance.");
  return data;
}
