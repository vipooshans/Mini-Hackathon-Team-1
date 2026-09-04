import { useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import { DISTRICTS } from "../data/districts.js";
import { getScheduleForDistrict } from "../data/schedules.js";
import { useAuth } from "../context/AuthContext.jsx";

function SchedulePage() {
  const { user } = useAuth();
  const [district, setDistrict] = useState(user?.district || "Colombo");

  const schedule = useMemo(() => getScheduleForDistrict(district), [district]);

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">Collection Schedule</h1>
          <p className="interior-page__copy">
            Check your district&apos;s weekly waste streams. Set a reminder from
            your profile so you don&apos;t miss pickup day.
          </p>

          <div className="rf-group schedule-filter">
            <label className="rf-label" htmlFor="schedule-district">
              District
            </label>
            <select
              className="rf-select"
              id="schedule-district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="schedule-list" role="list">
            {schedule.map((row) => (
              <article className="schedule-row" key={row.day} role="listitem">
                <h2 className="schedule-row__day">{row.day}</h2>
                <ul className="schedule-row__streams">
                  {row.streams.map((stream) => (
                    <li key={stream}>{stream}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default SchedulePage;
