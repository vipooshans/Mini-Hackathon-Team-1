import { get } from "./api.js";

export function listEducationArticles(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return get(`/education-articles${qs ? `?${qs}` : ""}`);
}

export function getEducationArticle(slug) {
  return get(`/education-articles/${slug}`);
}
