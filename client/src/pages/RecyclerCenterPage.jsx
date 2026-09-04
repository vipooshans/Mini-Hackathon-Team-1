import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import DynamicStringList from "../components/recycling/DynamicStringList.jsx";
import {
  createRecyclerCenter,
  getMyRecyclingCenters,
  updateRecyclerCenter,
} from "../services/recyclingCenterService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { CENTER_TYPES, WASTE_CATEGORIES } from "../utils/recyclingUtils.js";
import { DISTRICTS } from "../data/districts.js";

const empty = {
  name: "",
  description: "",
  type: "Recycling Center",
  district: "Colombo",
  municipality: "",
  address: "",
  latitude: "6.9271",
  longitude: "79.8612",
  phone: "",
  email: "",
  website: "",
  acceptedWaste: ["Plastic"],
  rejectedWaste: [],
  services: ["Drop-off"],
};

function RecyclerCenterPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [centers, setCenters] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => {
    if (!token) return;
    getMyRecyclingCenters(token)
      .then((res) => setCenters(res.data || []))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (authLoading) return null;
  if (!user || user.role !== "recycler") return <Navigate to="/login" replace />;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const onEdit = (c) => {
    const [lng, lat] = c.location?.coordinates || [79.8612, 6.9271];
    setEditId(c._id);
    setForm({
      ...empty,
      ...c,
      latitude: String(lat),
      longitude: String(lng),
      acceptedWaste: c.acceptedWaste || ["Plastic"],
      rejectedWaste: c.rejectedWaste || [],
      services: c.services || [],
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg("");
    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        acceptedWaste: (form.acceptedWaste || []).filter(Boolean),
        rejectedWaste: (form.rejectedWaste || []).filter(Boolean),
        services: (form.services || []).filter(Boolean),
      };
      if (editId) {
        await updateRecyclerCenter(editId, payload, token);
        setMsg("Center updated — pending verification again.");
      } else {
        await createRecyclerCenter(payload, token);
        setMsg("Center submitted for verification.");
      }
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">My Recycling Center Profile</h1>
          <p className="interior-page__copy">
            Create or update your drop-off centre. New and edited profiles need municipality
            approval before showing as verified.
          </p>
          <p>
            <Link to="/recycler">Back to pickup marketplace</Link>
          </p>
          {error && <p className="form-error">{error}</p>}
          {msg && <p role="status">{msg}</p>}

          <section className="rg-section">
            <h2 className="section-heading">Your centres</h2>
            {centers.length === 0 && <p className="empty-inline">No centre profile yet.</p>}
            <ul>
              {centers.map((c) => (
                <li key={c._id}>
                  <strong>{c.name}</strong> — {c.verificationStatus}{" "}
                  <button type="button" className="btn" onClick={() => onEdit(c)}>
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <form className="admin-form" onSubmit={onSubmit}>
            <h2 className="section-heading">{editId ? "Edit centre" : "Create centre"}</h2>
            <div className="rf-group">
              <label className="rf-label" htmlFor="rc-name">
                Name
              </label>
              <input
                id="rc-name"
                className="rf-input"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="rc-type">
                Type
              </label>
              <select
                id="rc-type"
                className="rf-input"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                {CENTER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="rc-district">
                District
              </label>
              <select
                id="rc-district"
                className="rf-input"
                value={form.district}
                onChange={(e) => set("district", e.target.value)}
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="rc-address">
                Address
              </label>
              <input
                id="rc-address"
                className="rf-input"
                required
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="rc-lat">
                Latitude
              </label>
              <input
                id="rc-lat"
                className="rf-input"
                required
                value={form.latitude}
                onChange={(e) => set("latitude", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="rc-lng">
                Longitude
              </label>
              <input
                id="rc-lng"
                className="rf-input"
                required
                value={form.longitude}
                onChange={(e) => set("longitude", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="rc-phone">
                Phone
              </label>
              <input
                id="rc-phone"
                className="rf-input"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <DynamicStringList
              label="Accepted waste"
              values={form.acceptedWaste}
              onChange={(v) => set("acceptedWaste", v)}
              placeholder={WASTE_CATEGORIES[1]}
            />
            <DynamicStringList
              label="Rejected waste"
              values={form.rejectedWaste}
              onChange={(v) => set("rejectedWaste", v)}
            />
            <button type="submit" className="btn btn-primary">
              {editId ? "Update profile" : "Create profile"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setEditId(null);
                  setForm(empty);
                }}
              >
                Cancel edit
              </button>
            )}
          </form>
        </div>
      </main>
    </>
  );
}

export default RecyclerCenterPage;
