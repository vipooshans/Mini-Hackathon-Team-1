function DisposalSearch({ query, error, isLoading, onQueryChange, onSearch, onBrowseAll }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="disposal-search" onSubmit={handleSubmit} noValidate>
      <label htmlFor="disposal-query">What do you need to dispose of?</label>
      <div className="disposal-search__controls">
        <input
          id="disposal-query"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Try batteries, e-waste, plastic, or glass"
          maxLength="80"
          aria-describedby={error ? "disposal-query-error" : "disposal-query-hint"}
          aria-invalid={Boolean(error)}
        />
        <button type="submit" disabled={isLoading}>{isLoading ? "Searching..." : "Search"}</button>
      </div>
      <p id={error ? "disposal-query-error" : "disposal-query-hint"} className={error ? "disposal-search__error" : "disposal-search__hint"}>
        {error || "Enter at least 2 characters. Search by item, material, or waste type."}
      </p>
      <button className="disposal-search__browse" type="button" onClick={onBrowseAll} disabled={isLoading}>
        Browse all disposal guidance
      </button>
    </form>
  );
}

export default DisposalSearch;
