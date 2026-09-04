import { useCallback, useEffect, useState } from "react";
import { getDisposalGuides } from "../../services/api.js";
import CategoryFilters from "./CategoryFilters.jsx";
import DisposalResult from "./DisposalResult.jsx";
import DisposalSearch from "./DisposalSearch.jsx";
import "./RecyclingDisposalGuide.css";

function RecyclingDisposalGuide() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [results, setResults] = useState([]);
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [error, setError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const loadGuides = useCallback(async (nextQuery, nextCategory, shouldValidate = false) => {
    const cleanQuery = nextQuery.trim();
    if (shouldValidate && cleanQuery.length < 2) {
      setError("Enter at least 2 characters to search, or choose Browse all guidance.");
      return;
    }

    setError("");
    setRequestError("");
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await getDisposalGuides({ query: cleanQuery, category: nextCategory });
      setResults(data.results);
      setCategories(data.categories);
    } catch (requestFailure) {
      setResults([]);
      setRequestError(requestFailure.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuides("", "All");
  }, [loadGuides]);

  function search() { loadGuides(query, category, true); }
  function browseAll() { setQuery(""); loadGuides("", category); }
  function changeCategory(nextCategory) { setCategory(nextCategory); loadGuides(query, nextCategory); }
  function updateQuery(value) { setQuery(value); if (error) setError(""); }
  function toggleSaved(id) {
    setSavedIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(id)) nextIds.delete(id);
      else nextIds.add(id);
      return nextIds;
    });
  }

  return (
    <section className="recycling-guide" aria-labelledby="recycling-guide-title">
      <div className="recycling-guide__intro">
        <p className="recycling-guide__eyebrow">Clean Lanka</p>
        <h1 id="recycling-guide-title">Recycling and disposal guide</h1>
        <p>Find safe, practical guidance for household waste before it reaches a bin or landfill.</p>
      </div>
      <DisposalSearch query={query} error={error} isLoading={isLoading} onQueryChange={updateQuery} onSearch={search} onBrowseAll={browseAll} />
      <CategoryFilters categories={categories} selectedCategory={category} onSelect={changeCategory} />
      <div className="disposal-results" aria-live="polite" aria-busy={isLoading}>
        <div className="disposal-results__summary">
          <p>{isLoading ? "Finding guidance..." : `${results.length} ${results.length === 1 ? "result" : "results"} found`}</p>
          {savedIds.size > 0 && <p>{savedIds.size} saved</p>}
        </div>
        {requestError ? <p className="disposal-results__error">{requestError}</p> : !isLoading && hasSearched && (results.length > 0 ? (
          <div className="disposal-results__grid">
            {results.map((item) => <DisposalResult key={item.id} item={item} isSaved={savedIds.has(item.id)} onToggleSaved={toggleSaved} />)}
          </div>
        ) : <p className="disposal-results__empty">No matching guidance was found. Try a broader term such as plastic, battery, or paper.</p>)}
      </div>
    </section>
  );
}

export default RecyclingDisposalGuide;
