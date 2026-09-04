/**
 * Shared API helper for CleanLanka frontend.
 *
 * All service modules (reportService, etc.) should use these helpers
 * instead of calling fetch() directly. This keeps the base URL and
 * error-handling logic in one place.
 */

const API_BASE = "/api";

/**
 * Generic GET request.
 * @param {string} path — e.g. "/reports"
 * @param {string|null} token — optional JWT
 * @returns {Promise<any>} parsed JSON body
 */
export async function get(path, token = null) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { headers });
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
 * @param {string|null} token — optional JWT
 * @returns {Promise<any>} parsed JSON body
 */
export async function post(path, data, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `POST ${path} failed (${response.status})`);
  }
  return response.json();
}

/**
 * Generic PATCH request (JSON body).
 * @param {string} path — e.g. "/reports/:id/status"
 * @param {object} data — JSON body
 * @param {string|null} token — optional JWT
 * @returns {Promise<any>} parsed JSON body
 */
export async function patch(path, data, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `PATCH ${path} failed (${response.status})`);
  }
  return response.json();
}

/**
 * Generic PUT request (JSON body).
 */
export async function put(path, data, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `PUT ${path} failed (${response.status})`);
  }
  return response.json();
}

/**
 * Generic DELETE request.
 */
export async function del(path, token = null) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `DELETE ${path} failed (${response.status})`);
  }
  return response.json();
}

/**
 * POST request with FormData (for file uploads).
 * Do NOT set Content-Type — the browser adds the correct multipart boundary.
 * @param {string} path — e.g. "/reports"
 * @param {FormData} formData
 * @param {string|null} token — optional JWT
 * @returns {Promise<any>} parsed JSON body
 */
export async function postForm(path, formData, token = null) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
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
