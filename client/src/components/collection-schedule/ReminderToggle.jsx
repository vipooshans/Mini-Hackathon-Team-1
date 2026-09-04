function ReminderToggle({ enabled, onChange }) {
  return (
    <section className="reminder-card">
      <div className="reminder-icon" aria-hidden="true">R</div>
      <div className="reminder-copy">
        <h2>Collection reminders</h2>
        <p>{enabled ? "Reminders are enabled for the evening before pickup." : "Get a reminder the evening before your pickup."}</p>
      </div>
      <label className="switch">
        <input type="checkbox" checked={enabled} onChange={(event) => onChange(event.target.checked)} />
        <span className="slider" />
        <span className="sr-only">Enable collection reminders</span>
      </label>
    </section>
  );
}

export default ReminderToggle;
