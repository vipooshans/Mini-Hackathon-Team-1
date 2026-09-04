function DisposalSearch({ query, onQueryChange, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="disposal-search" onSubmit={handleSubmit}>
      <label htmlFor="disposal-query">What do you need to dispose of?</label>
      <div className="disposal-search__controls">
        <input
          id="disposal-query"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Try batteries, e-waste, plastic, or glass"
        />
        <button type="submit">Search</button>
      </div>
    </form>
  );
}

export default DisposalSearch;
