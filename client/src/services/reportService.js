import { get, postForm } from "./api.js";

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
