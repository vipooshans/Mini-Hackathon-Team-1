/**
 * Escape special regex characters for safe partial matching.
 */
export function escapeRegex(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Build a case-insensitive partial-match query across name, category, keywords, description.
 */
export function buildGuideSearchFilter(q, { language, status = "published" } = {}) {
  const filter = {};
  if (status) filter.status = status;
  if (language) filter.language = language;

  const term = (q || "").trim();
  if (!term) return filter;

  const regex = new RegExp(escapeRegex(term), "i");
  filter.$or = [
    { name: regex },
    { category: regex },
    { description: regex },
    { keywords: regex },
  ];
  return filter;
}

/**
 * Suggest guides from a short prefix query.
 */
export function buildSuggestFilter(q, { language, status = "published" } = {}) {
  const filter = buildGuideSearchFilter(q, { language, status });
  return filter;
}
