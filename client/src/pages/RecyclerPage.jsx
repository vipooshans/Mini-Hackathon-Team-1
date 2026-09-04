import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import MunicipalityAdminSubnav from "../components/MunicipalityAdminSubnav.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isMunicipalityAdmin } from "../utils/roles.js";
import { DISTRICTS } from "../data/districts.js";
import {
  createPickup,
  getPickups,
  updatePickupStatus,
} from "../services/pickupService.js";

const MATERIALS = ["Plastic", "Paper", "Metal", "Glass", "E-waste", "Mixed"];

function statusBadge(status) {
  switch (status) {
    case "Completed":
      return "badge--resolved";
    case "Accepted":
      return "badge--acknowledged";
    case "Cancelled":
      return "badge--pending";
    default:
      return "badge--pending";
  }
}

function RecyclerPage() {
  const { user, token, loading } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  const [actionError, setActionError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [form, setForm] = useState({
    district: "",
    material: "Plastic",
    quantity: "",
    address: "",
    notes: "",
    preferredDate: "",
  });
  const [formStatus, setFormStatus] = useState("idle");
  const [formMsg, setFormMsg] = useState("");

  const load = async () => {
    try {
      const data = await getPickups(token);
      setPickups(Array.isArray(data) ? data : []);
      setFetchStatus("success");
    } catch {
      setFetchStatus("error");
    }
  };

  useEffect(() => {
    if (!token || !user) return;
    if (user.role !== "citizen" && user.role !== "recycler") return;
    setForm((prev) => ({
      ...prev,
      district: user.district || prev.district || "Colombo",
    }));
    load();
  }, [token, user]);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isMunicipalityAdmin(user)) {
    return (
      <>
        <Header />
        <main className="interior-page dashboard-page">
          <div className="interior-page__inner">
            <h1 className="interior-page__title">Municipal Dashboard</h1>
            <p className="dashboard-subtitle">
              Pickup marketplace is for citizens and recyclers. Use your
              municipality tools below to manage issues and recycling centres.
            </p>
            <MunicipalityAdminSubnav />
            <div className="dashboard-card-actions">
              <Link className="btn btn-primary btn-sm" to="/dashboard">
                Open Issue Dashboard
              </Link>
              <Link
                className="btn btn-ghost btn-sm"
                to="/admin/recycling-dashboard"
              >
                Open Recycling Dashboard
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const isRecycler = user.role === "recycler";

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormStatus("idle");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormStatus("loading");
    setActionError("");
    try {
      await createPickup(
        {
          ...form,
          preferredDate: form.preferredDate || undefined,
        },
        token
      );
      setForm((prev) => ({
        ...prev,
        quantity: "",
        address: "",
        notes: "",
        preferredDate: "",
      }));
      setFormStatus("success");
      setFormMsg("Pickup requested.");
      await load();
    } catch (err) {
      setFormStatus("error");
      setFormMsg(err.message || "Could not create pickup.");
    }
  };

  const handleStatus = async (id, status) => {
    setUpdatingId(id);
    setActionError("");
    try {
      const updated = await updatePickupStatus(id, status, token);
      setPickups((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
    } catch (err) {
      setActionError(err.message || "Update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <div className="my-reports-header">
            <div>
              <h1 className="interior-page__title">
                {isRecycler ? "Recycling Center / Pickup" : "Request a Pickup"}
              </h1>
              <p className="dashboard-subtitle">
                {isRecycler
                  ? "Accept open household requests and complete pickups in your area."
                  : "Link with scrap collectors for plastics, metal, glass, and e-waste."}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={load}
              disabled={fetchStatus === "loading"}
            >
              Refresh
            </button>
          </div>

          {!isRecycler && (
            <form className="pickup-form" onSubmit={handleCreate} noValidate>
              <h2 className="feature-section-title">New pickup request</h2>

              {formStatus === "error" && (
                <div className="rf-alert rf-alert--error">
                  <span>!</span>
                  <span>{formMsg}</span>
                </div>
              )}
              {formStatus === "success" && (
                <div className="rf-alert rf-alert--success">
                  <span>✓</span>
                  <span>{formMsg}</span>
                </div>
              )}

              <div className="pickup-form__grid">
                <div className="rf-group">
                  <label className="rf-label" htmlFor="district">
                    District
                  </label>
                  <select
                    className="rf-select"
                    id="district"
                    name="district"
                    value={form.district}
                    onChange={handleFormChange}
                    required
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rf-group">
                  <label className="rf-label" htmlFor="material">
                    Material
                  </label>
                  <select
                    className="rf-select"
                    id="material"
                    name="material"
                    value={form.material}
                    onChange={handleFormChange}
                  >
                    {MATERIALS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rf-group">
                  <label className="rf-label" htmlFor="quantity">
                    Quantity
                  </label>
                  <input
                    className="rf-input"
                    id="quantity"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleFormChange}
                    placeholder="e.g. 2 bags, 5 kg"
                    required
                  />
                </div>

                <div className="rf-group">
                  <label className="rf-label" htmlFor="preferredDate">
                    Preferred date
                  </label>
                  <input
                    className="rf-input"
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={form.preferredDate}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="rf-group">
                <label className="rf-label" htmlFor="address">
                  Pickup address
                </label>
                <input
                  className="rf-input"
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  placeholder="Street, landmark, city"
                  required
                />
              </div>

              <div className="rf-group">
                <label className="rf-label" htmlFor="notes">
                  Notes <span className="rf-optional">(optional)</span>
                </label>
                <textarea
                  className="rf-textarea"
                  id="notes"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleFormChange}
                />
              </div>

              <button
                type="submit"
                className="rf-btn rf-btn--primary"
                disabled={formStatus === "loading"}
              >
                {formStatus === "loading" ? "Submitting…" : "Request pickup"}
              </button>
            </form>
          )}

          {actionError && (
            <div className="rf-alert rf-alert--error">
              <span>!</span>
              <span>{actionError}</span>
            </div>
          )}

          <h2 className="feature-section-title">
            {isRecycler ? "Available & assigned pickups" : "Your requests"}
          </h2>

          {fetchStatus === "loading" && (
            <p className="loading-text">Loading pickups…</p>
          )}
          {fetchStatus === "error" && (
            <div className="rf-alert rf-alert--error">
              <span>!</span>
              <span>Failed to load pickups.</span>
            </div>
          )}
          {fetchStatus === "success" && pickups.length === 0 && (
            <div className="empty-state">
              <h3>No pickups yet</h3>
              <p>
                {isRecycler
                  ? "When citizens request scrap or e-waste collection, they will show up here."
                  : "Submit a request above to connect with a recycler."}
              </p>
            </div>
          )}

          {fetchStatus === "success" && pickups.length > 0 && (
            <div className="reports-grid">
              {pickups.map((p) => (
                <article key={p._id} className="report-list-card">
                  <div className="report-list-card__header">
                    <span className={`badge ${statusBadge(p.status)}`}>
                      {p.status}
                    </span>
                    <span className="report-list-card__date">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="report-list-card__district">
                    {p.district} · {p.material}
                  </p>
                  <p>
                    <strong>{p.quantity}</strong> — {p.address}
                  </p>
                  {p.notes && <p className="pickup-notes">{p.notes}</p>}
                  {isRecycler && p.citizen && (
                    <p className="pickup-meta">
                      From {p.citizen.name}
                      {p.citizen.phone ? ` · ${p.citizen.phone}` : ""}
                    </p>
                  )}
                  {!isRecycler && p.recycler && (
                    <p className="pickup-meta">
                      Recycler: {p.recycler.name}
                      {p.recycler.phone ? ` · ${p.recycler.phone}` : ""}
                    </p>
                  )}

                  <div className="dashboard-card-actions">
                    {isRecycler && p.status === "Open" && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={updatingId === p._id}
                        onClick={() => handleStatus(p._id, "Accepted")}
                      >
                        Accept
                      </button>
                    )}
                    {isRecycler && p.status === "Accepted" && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={updatingId === p._id}
                        onClick={() => handleStatus(p._id, "Completed")}
                      >
                        Mark completed
                      </button>
                    )}
                    {!isRecycler && p.status === "Open" && (
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        disabled={updatingId === p._id}
                        onClick={() => handleStatus(p._id, "Cancelled")}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default RecyclerPage;
