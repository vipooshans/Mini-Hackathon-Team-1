import Header from "../../components/Header.jsx";
import NextPickupCard from "../../components/collection-schedule/NextPickupCard.jsx";
import ReminderToggle from "../../components/collection-schedule/ReminderToggle.jsx";
import ScheduleLookupForm from "../../components/collection-schedule/ScheduleLookupForm.jsx";
import { useCollectionSchedule } from "../../hooks/collection-schedule/useCollectionSchedule.js";

function CollectionScheduleLookup() {
  const { schedule, nextPickup, remindersEnabled, lookupSchedule, setRemindersEnabled } = useCollectionSchedule();

  return (
    <div className="app-shell">
      <Header />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Waste collection made simple</span>
            <h1>Never miss a collection day.</h1>
            <p>Choose your local council and area to see your next waste pickup time.</p>
          </div>
          <div className="hero-art" aria-hidden="true"><span>♻</span><i /><b /></div>
        </section>

        <section className="lookup-panel" aria-labelledby="lookup-heading">
          <div>
            <h2 id="lookup-heading">Find your collection schedule</h2>
            <p>Schedule information is provided by your municipal council.</p>
          </div>
          <ScheduleLookupForm onLookup={lookupSchedule} />
        </section>

        {schedule && (
          <section className="results-section" aria-label="Collection schedule result">
            <NextPickupCard schedule={schedule} nextPickup={nextPickup} />
            <ReminderToggle enabled={remindersEnabled} onChange={setRemindersEnabled} />
          </section>
        )}
      </main>
      <footer>CleanLanka · Helping communities keep Sri Lanka clean.</footer>
    </div>
  );
}

export default CollectionScheduleLookup;
