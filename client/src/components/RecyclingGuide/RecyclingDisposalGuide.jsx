import { useState } from "react";
import DisposalResult from "./DisposalResult.jsx";
import DisposalSearch from "./DisposalSearch.jsx";
import { findDisposalItems } from "./recyclingData.js";
import "./RecyclingDisposalGuide.css";

function RecyclingDisposalGuide() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const results = hasSearched ? findDisposalItems(query) : [];

  function search() {
    setHasSearched(true);
  }

  return (
    <section className="recycling-guide" aria-labelledby="recycling-guide-title">
      <div className="recycling-guide__intro">
        <p className="recycling-guide__eyebrow">Recycling & Disposal Guide</p>
        <h2 id="recycling-guide-title">Dispose of waste the right way</h2>
        <p>Search for an item to find the appropriate disposal guidance.</p>
      </div>

      <DisposalSearch query={query} onQueryChange={setQuery} onSearch={search} />

      {hasSearched && (
        <div className="disposal-results" aria-live="polite">
          {results.length > 0 ? (
            results.map((item) => <DisposalResult key={item.id} item={item} />)
          ) : (
            <p className="disposal-results__empty">
              No guidance found for “{query}”. Try batteries, e-waste, plastic, or glass.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default RecyclingDisposalGuide;
