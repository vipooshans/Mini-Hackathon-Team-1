import { get, post, patch } from "./api.js";

export function createCenterReport(data, token) {
  return post("/center-reports", data, token);
}

export function adminListCenterReports(params = {}, token) {
  const qs = new URLSearchParams(params).toString();
  return get(`/admin/center-reports${qs ? `?${qs}` : ""}`, token);
}

export function adminPatchCenterReport(id, status, token) {
  return patch(`/admin/center-reports/${id}`, { status }, token);
}
