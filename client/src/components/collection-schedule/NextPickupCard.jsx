function NextPickupCard({ schedule, nextPickup }) {
  const date = new Intl.DateTimeFormat("en-LK", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(nextPickup);

  return (
    <section className="pickup-card" aria-live="polite">
      <div className="pickup-card-top">
        <span className="eyebrow">Next collection</span>
        <span className="status-pill">{schedule.status}</span>
      </div>
      <h2>{date}</h2>
      <p className="pickup-time">{schedule.collectionTime}</p>
      <div className="pickup-details">
        <div><span>Area</span><strong>{schedule.area}</strong></div>
        <div><span>Municipality</span><strong>{schedule.municipality}</strong></div>
        <div><span>Collection day</span><strong>{schedule.collectionDay}</strong></div>
        <div><span>Waste type</span><strong>{schedule.wasteType}</strong></div>
      </div>
      <p className="collection-note">Please place waste outside before the scheduled pickup time.</p>
    </section>
  );
}

export default NextPickupCard;
