import { get, postForm } from "./api.js";

/**
 * Create a new waste report with optional images.
 *
 * @param {FormData} formData — multipart form data with text fields + images
 * @returns {Promise<object>} the created report document
 */
export async function createReport(formData) {
  return postForm("/reports", formData);
}

/**
 * Fetch all reports (newest first).
 * @returns {Promise<object[]>} array of report documents
 */
export async function getReports() {
  return get("/reports");
}
