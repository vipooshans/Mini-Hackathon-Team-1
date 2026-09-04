import { get, postForm, patch } from "./api.js";

/**
 * Create a new waste report with optional images.
 *
 * @param {FormData} formData — multipart form data with text fields + images
 * @param {string|null} token - optional JWT token for authenticated users
 * @returns {Promise<object>} the created report document
 */
export async function createReport(formData, token = null) {
  return postForm("/reports", formData, token);
}

/**
 * Fetch all reports (newest first).
 * @returns {Promise<object[]>} array of report documents
 */
export async function getReports() {
  return get("/reports");
}

/**
 * Fetch only the authenticated user's reports.
 * @param {string} token - JWT token
 * @returns {Promise<object[]>} array of user's report documents
 */
export async function getMyReports(token) {
  return get("/reports/mine", token);
}

/**
 * Update a report's status (municipality only).
 * @param {string} id - report id
 * @param {string} status - "Pending" | "Acknowledged" | "Resolved"
 * @param {string} token - JWT token
 * @returns {Promise<object>} updated report
 */
export async function updateReportStatus(id, status, token) {
  return patch(`/reports/${id}/status`, { status }, token);
}
