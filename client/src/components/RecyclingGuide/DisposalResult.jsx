function DisposalResult({ item }) {
  return (
    <article className="disposal-result">
      <span className="disposal-result__category">{item.category}</span>
      <h3>{item.name}</h3>
      <p>{item.guidance}</p>
      <button className="disposal-result__action" type="button">
        {item.action}
      </button>
    </article>
  );
}

export default DisposalResult;
