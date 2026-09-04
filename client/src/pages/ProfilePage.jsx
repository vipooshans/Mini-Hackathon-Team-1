import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile } from "../services/authService.js";
import { DISTRICTS, WEEKDAYS } from "../data/districts.js";
import { getScheduleForDistrict } from "../data/schedules.js";

function ProfilePage() {
  const { user, token, loading, setUserProfile } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    district: "",
    reminderEnabled: false,
    reminderDay: "Monday",
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      district: user.district || "",
      reminderEnabled: Boolean(user.reminderEnabled),
      reminderDay: user.reminderDay || "Monday",
    });
  }, [user]);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "citizen") {
    return (
      <>
        <Header />
        <main className="interior-page">
          <div className="interior-page__inner">
            <h1 className="interior-page__title">Profile</h1>
            <p className="interior-page__copy">
              Collection reminders are for citizen accounts.{" "}
              <Link to="/">Go home</Link>
            </p>
          </div>
        </main>
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const updated = await updateProfile(
        {
          name: form.name,
          phone: form.phone,
          district: form.district,
          reminderEnabled: form.reminderEnabled,
          reminderDay: form.reminderEnabled ? form.reminderDay : "",
        },
        token
      );
      setUserProfile(updated);
      setStatus("success");
      setMessage("Profile saved.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Could not save profile.");
    }
  };

  const preview =
    form.district && form.reminderEnabled
      ? getScheduleForDistrict(form.district).find(
          (row) => row.day === form.reminderDay
        )
      : null;

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner interior-page__inner--narrow">
          <h1 className="interior-page__title">Profile / Reminders</h1>
          <p className="interior-page__copy">
            Keep your contact details current and get an evening-before nudge
            for collection day.
          </p>

          {status === "error" && (
            <div className="rf-alert rf-alert--error">
              <span>!</span>
              <span>{message}</span>
            </div>
          )}
          {status === "success" && (
            <div className="rf-alert rf-alert--success">
              <span>✓</span>
              <span>{message}</span>
            </div>
          )}

          <form className="profile-form" onSubmit={handleSubmit} noValidate>
            <div className="rf-group">
              <label className="rf-label" htmlFor="name">
                Name
              </label>
              <input
                className="rf-input"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="rf-group">
              <label className="rf-label" htmlFor="email">
                Email
              </label>
              <input
                className="rf-input"
                id="email"
                value={user.email}
                disabled
              />
            </div>

            <div className="rf-group">
              <label className="rf-label" htmlFor="phone">
                Phone
              </label>
              <input
                className="rf-input"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="07X XXX XXXX"
              />
            </div>

            <div className="rf-group">
              <label className="rf-label" htmlFor="district">
                District
              </label>
              <select
                className="rf-select"
                id="district"
                name="district"
                value={form.district}
                onChange={handleChange}
              >
                <option value="">Select district</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="reminder-fieldset">
              <legend className="rf-label">Collection reminder</legend>
              <label className="reminder-toggle">
                <input
                  type="checkbox"
                  name="reminderEnabled"
                  checked={form.reminderEnabled}
                  onChange={handleChange}
                />
                Remind me the evening before my collection day
              </label>

              {form.reminderEnabled && (
                <div className="rf-group">
                  <label className="rf-label" htmlFor="reminderDay">
                    Collection day
                  </label>
                  <select
                    className="rf-select"
                    id="reminderDay"
                    name="reminderDay"
                    value={form.reminderDay}
                    onChange={handleChange}
                  >
                    {WEEKDAYS.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {preview && (
                <p className="reminder-preview">
                  Next alert covers: {preview.streams.join(", ")}.
                </p>
              )}
            </fieldset>

            <button
              type="submit"
              className="rf-btn rf-btn--primary"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Saving…" : "Save profile"}
            </button>
          </form>

          <p className="feature-footnote">
            <Link to="/schedule">View full collection schedule</Link>
            {" · "}
            <Link to="/my-reports">My reports</Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default ProfilePage;
