<<<<<<< HEAD
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
export async function get(path, token = null) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `GET ${path} failed (${response.status})`);
  }
  return response.json();
=======
const API_BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "cleanlanka_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function getHealth() {
  return request("/health");
}

export async function registerUser(payload) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setToken(data.token);
  return data;
}

export async function loginUser(payload) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setToken(data.token);
  return data;
}

export async function fetchMe() {
  return request("/auth/me");
}

export function logoutUser() {
  setToken(null);
>>>>>>> origin/vipooshan
}

/**
 * Generic POST request (JSON body).
 * @param {string} path — e.g. "/reports"
 * @param {object} data — JSON body
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
 * POST request with FormData (for file uploads).
 * Do NOT set Content-Type — the browser adds the correct multipart boundary.
 * @param {string} path — e.g. "/reports"
 * @param {FormData} formData
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
