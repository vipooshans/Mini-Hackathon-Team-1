import { get, post, put, patch, del } from "./api.js";

export function listWasteGuides(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return get(`/waste-guides${qs ? `?${qs}` : ""}`);
}

export function searchWasteGuides(q, params = {}) {
  const qs = new URLSearchParams({ q, ...params }).toString();
  return get(`/waste-guides/search?${qs}`);
}

export function suggestWasteGuides(q, language = "en") {
  const qs = new URLSearchParams({ q, language }).toString();
  return get(`/waste-guides/suggest?${qs}`);
}

export function getWasteGuidesByCategory(category, language = "en") {
  return get(`/waste-guides/category/${encodeURIComponent(category)}?language=${language}`);
}

export function getWasteGuide(id, token = null) {
  return get(`/waste-guides/${id}`, token);
}

export function adminListWasteGuides(params = {}, token) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
  ).toString();
  return get(`/admin/waste-guides${qs ? `?${qs}` : ""}`, token);
}

export function adminGetWasteGuide(id, token) {
  return get(`/admin/waste-guides/${id}`, token);
}

export function adminCreateWasteGuide(data, token) {
  return post("/admin/waste-guides", data, token);
}

export function adminUpdateWasteGuide(id, data, token) {
  return put(`/admin/waste-guides/${id}`, data, token);
}

export function adminDeleteWasteGuide(id, token) {
  return del(`/admin/waste-guides/${id}`, token);
}

export function adminPatchWasteGuideStatus(id, status, token) {
  return patch(`/admin/waste-guides/${id}/status`, { status }, token);
}
