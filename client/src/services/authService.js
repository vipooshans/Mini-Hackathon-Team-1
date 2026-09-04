import { get, post } from "./api.js";

/**
 * Register a new user.
 */
export async function register(name, email, password) {
  return post("/auth/register", { name, email, password });
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
