function DisposalResult({ item, isSaved, onToggleSaved }) {
  return (
    <article className="disposal-result">
      <div className="disposal-result__heading">
        <span className="disposal-result__icon" aria-hidden="true">{item.icon}</span>
        <div>
          <span className="disposal-result__category">{item.category}</span>
          <h3>{item.name}</h3>
        </div>
      </div>
      <p>{item.guidance}</p>
      <p className="disposal-result__preparation"><strong>Before you go:</strong> {item.preparation}</p>
      <button className="disposal-result__action" type="button" onClick={() => onToggleSaved(item.id)} aria-pressed={isSaved}>
        {isSaved ? "Saved" : "Save guidance"}
      </button>
    </article>
  );
}

export default DisposalResult;
