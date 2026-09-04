import { get, post, put, patch, del } from "./api.js";

export function listRecyclingCenters(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
  ).toString();
  return get(`/recycling-centers${qs ? `?${qs}` : ""}`);
}

export function nearbyRecyclingCenters(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
  ).toString();
  return get(`/recycling-centers/nearby?${qs}`);
}

export function searchRecyclingCenters(q, params = {}) {
  const qs = new URLSearchParams({ q, ...params }).toString();
  return get(`/recycling-centers/search?${qs}`);
}

export function getRecyclingCenter(id, params = {}, token = null) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
  ).toString();
  return get(`/recycling-centers/${id}${qs ? `?${qs}` : ""}`, token);
}

export function getMyRecyclingCenters(token) {
  return get("/recycling-centers/mine", token);
}

export function createRecyclerCenter(data, token) {
  return post("/recycling-centers", data, token);
}

export function updateRecyclerCenter(id, data, token) {
  return put(`/recycling-centers/${id}`, data, token);
}

export function adminListCenters(params = {}, token) {
  const qs = new URLSearchParams(params).toString();
  return get(`/admin/recycling-centers${qs ? `?${qs}` : ""}`, token);
}

export function adminCreateCenter(data, token) {
  return post("/admin/recycling-centers", data, token);
}

export function adminUpdateCenter(id, data, token) {
  return put(`/admin/recycling-centers/${id}`, data, token);
}

export function adminDeleteCenter(id, token) {
  return del(`/admin/recycling-centers/${id}`, token);
}

export function adminVerifyCenter(id, verificationStatus, token) {
  return patch(`/admin/recycling-centers/${id}/verify`, { verificationStatus }, token);
}

export function getDashboardStats(token) {
  return get("/admin/dashboard", token);
}
