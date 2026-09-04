/**
 * Shared API helper for CleanLanka frontend.
 *
 * All service modules (reportService, etc.) should use these helpers
 * instead of calling fetch() directly. This keeps the base URL and
 * error-handling logic in one place.
 *
 * Teammates: import { get, post, postForm } from "../services/api.js" in your
 * own service files to stay consistent.
 */

const API_BASE = "/api";

/**
 * Generic GET request.
 * @param {string} path — e.g. "/reports"
 * @returns {Promise<any>} parsed JSON body
 */
export async function get(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `GET ${path} failed (${response.status})`);
  }
  return response.json();
}

/**
 * Generic POST request (JSON body).
 * @param {string} path — e.g. "/reports"
 * @param {object} data — JSON body
 * @returns {Promise<any>} parsed JSON body
 */
export async function post(path, data) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `POST ${path} failed (${response.status})`);
  }
  return response.json();
}

/**
 * POST request with FormData (for file uploads).
 * Do NOT set Content-Type — the browser adds the correct multipart boundary.
 * @param {string} path — e.g. "/reports"
 * @param {FormData} formData
 * @returns {Promise<any>} parsed JSON body
 */
export async function postForm(path, formData) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `POST ${path} failed (${response.status})`);
  }
  return response.json();
}

/**
 * Legacy health check — kept for backward compatibility with scaffold code.
 */
export async function getHealth() {
  return get("/health");
}
