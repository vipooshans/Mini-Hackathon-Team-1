import { get, post, del } from "./api.js";

export function listFavorites(token) {
  return get("/favorites", token);
}

export function saveFavoriteCenter(centerId, token) {
  return post(`/favorites/centers/${centerId}`, {}, token);
}

export function removeFavoriteCenter(centerId, token) {
  return del(`/favorites/centers/${centerId}`, token);
}

export function saveFavoriteGuide(guideId, token) {
  return post(`/favorites/guides/${guideId}`, {}, token);
}

export function removeFavoriteGuide(guideId, token) {
  return del(`/favorites/guides/${guideId}`, token);
}
