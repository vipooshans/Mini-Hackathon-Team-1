function NextPickupCard({ schedule, nextPickup }) {
  const date = new Intl.DateTimeFormat("en-LK", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(nextPickup);

  return (
    <section className="pickup-card" aria-live="polite">
      <div className="pickup-card-top">
        <span className="eyebrow">Your next collection</span>
        <span className="status-pill"><span aria-hidden="true">●</span> {schedule.status}</span>
      </div>
      <h2>{date}</h2>
      <p className="pickup-time">{schedule.time}</p>
      <div className="pickup-details">
        <div><span>Collection area</span><strong>{schedule.district}</strong></div>
        <div><span>Accepted waste</span><strong>{schedule.waste}</strong></div>
      </div>
      <p className="collection-note">Please place waste outside before 6:00 AM. Keep recyclables clean and separated.</p>
    </section>
  );
}

export default NextPickupCard;
