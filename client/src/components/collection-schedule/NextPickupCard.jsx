function NextPickupCard({ schedule, nextPickup }) {
  const value = (field) => schedule[field] || "Not specified";
  const date = nextPickup instanceof Date && !Number.isNaN(nextPickup.getTime())
    ? new Intl.DateTimeFormat("en-LK", {
    weekday: "long",
    month: "short",
    day: "numeric",
      }).format(nextPickup)
    : "Collection date unavailable";

  return (
    <section className="pickup-card" aria-live="polite">
      <div className="pickup-card-top">
        <span className="eyebrow">Next collection</span>
        <span className="status-pill">{value("status")}</span>
      </div>
      <h2>{date}</h2>
      <p className="pickup-time">{value("collectionTime")}</p>
      <div className="pickup-details">
        <div><span>Area</span><strong>{value("area")}</strong></div>
        <div><span>Municipality</span><strong>{value("municipality")}</strong></div>
        <div><span>District</span><strong>{value("district")}</strong></div>
        <div><span>Collection day</span><strong>{value("collectionDay")}</strong></div>
        <div><span>Next collection date</span><strong>{date}</strong></div>
        <div><span>Pickup time</span><strong>{value("collectionTime")}</strong></div>
        <div><span>Waste type</span><strong>{value("wasteType")}</strong></div>
        <div><span>Status</span><strong>{value("status")}</strong></div>
      </div>
      <p className="collection-note">Please place waste outside before the scheduled pickup time.</p>
    </section>
  );
}

export default NextPickupCard;
