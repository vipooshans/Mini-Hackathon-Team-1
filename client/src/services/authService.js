import { get, post, patch } from "./api.js";

/**
 * Register a new user.
 * @param {string|object} nameOrPayload
 * @param {string} [email]
 * @param {string} [password]
 */
export async function register(nameOrPayload, email, password) {
  const body =
    typeof nameOrPayload === "object"
      ? nameOrPayload
      : { name: nameOrPayload, email, password };
  return post("/auth/register", body);
}

/**
 * Log in an existing user.
 */
export async function login(email, password) {
  return post("/auth/login", { email, password });
}

/**
 * Fetch the authenticated user's profile.
 */
export async function getProfile(token) {
  return get("/auth/profile", token);
}

/**
 * Update profile and reminder preferences.
 */
export async function updateProfile(data, token) {
  return patch("/auth/profile", data, token);
}
