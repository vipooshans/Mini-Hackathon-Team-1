import { get, post, patch } from "./api.js";

export async function createPickup(data, token) {
  return post("/pickups", data, token);
}

export async function getPickups(token) {
  return get("/pickups", token);
}

export async function updatePickupStatus(id, status, token) {
  return patch(`/pickups/${id}/status`, { status }, token);
}
