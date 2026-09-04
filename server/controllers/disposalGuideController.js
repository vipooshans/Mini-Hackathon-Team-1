import { disposalGuides } from "../data/disposalGuides.js";

const MAX_QUERY_LENGTH = 80;

export const getDisposalGuides = (req, res) => {
  const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
  const category = typeof req.query.category === "string" ? req.query.category.trim() : "All";

  if (query.length > MAX_QUERY_LENGTH) {
    return res.status(400).json({ message: `Search terms must be ${MAX_QUERY_LENGTH} characters or fewer.` });
  }

  const normalizedQuery = query.toLowerCase();
  const results = disposalGuides.filter((guide) => {
    const matchesCategory = category === "All" || guide.category === category;
    const searchable = [guide.name, guide.category, guide.guidance, ...guide.keywords].join(" ").toLowerCase();
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
  });

  return res.json({
    results,
    total: results.length,
    categories: ["All", ...new Set(disposalGuides.map((guide) => guide.category))],
  });
};
