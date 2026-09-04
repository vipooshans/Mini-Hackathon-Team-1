import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header.jsx";
import DynamicStringList from "../../components/recycling/DynamicStringList.jsx";
import {
  adminCreateCenter,
  adminUpdateCenter,
  getRecyclingCenter,
} from "../../services/recyclingCenterService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { CENTER_TYPES, WASTE_CATEGORIES } from "../../utils/recyclingUtils.js";
import { DISTRICTS } from "../../data/districts.js";

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
  verificationStatus: "Pending Verification",
  isDemo: false,
  image: "",
};

function AdminRecyclingCenterFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit || !token) return;
    getRecyclingCenter(id, {}, token)
      .then((res) => {
        const found = res.data;
        const [lng, lat] = found.location?.coordinates || [79.8612, 6.9271];
        setForm({
          ...empty,
          ...found,
          latitude: String(lat),
          longitude: String(lng),
          acceptedWaste: found.acceptedWaste?.length ? found.acceptedWaste : [""],
          rejectedWaste: found.rejectedWaste || [],
          services: found.services || [],
        });
      })
      .catch((err) => setError(err.message));
  }, [id, isEdit, token]);

  if (authLoading) return null;
  if (!user || user.role !== "municipality") return <Navigate to="/login" replace />;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        acceptedWaste: (form.acceptedWaste || []).filter(Boolean),
        rejectedWaste: (form.rejectedWaste || []).filter(Boolean),
        services: (form.services || []).filter(Boolean),
        verified: form.verificationStatus === "Approved",
      };
      if (isEdit) await adminUpdateCenter(id, payload, token);
      else await adminCreateCenter(payload, token);
      navigate("/admin/recycling-centers");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">
            {isEdit ? "Edit Recycling Center" : "Add Recycling Center"}
          </h1>
          <Link to="/admin/recycling-centers">Back</Link>
          {error && <p className="form-error">{error}</p>}
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="rf-group">
              <label className="rf-label" htmlFor="cname">
                Name
              </label>
              <input
                id="cname"
                className="rf-input"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="cdesc">
                Description
              </label>
              <textarea
                id="cdesc"
                className="rf-input"
                rows={2}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="ctype">
                Type
              </label>
              <select
                id="ctype"
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
              <label className="rf-label" htmlFor="cdistrict">
                District
              </label>
              <select
                id="cdistrict"
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
              <label className="rf-label" htmlFor="cmun">
                Municipality
              </label>
              <input
                id="cmun"
                className="rf-input"
                value={form.municipality}
                onChange={(e) => set("municipality", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="caddr">
                Address
              </label>
              <input
                id="caddr"
                className="rf-input"
                required
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="clat">
                Latitude
              </label>
              <input
                id="clat"
                className="rf-input"
                required
                value={form.latitude}
                onChange={(e) => set("latitude", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="clng">
                Longitude
              </label>
              <input
                id="clng"
                className="rf-input"
                required
                value={form.longitude}
                onChange={(e) => set("longitude", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="cphone">
                Phone
              </label>
              <input
                id="cphone"
                className="rf-input"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="cemail">
                Email
              </label>
              <input
                id="cemail"
                className="rf-input"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <DynamicStringList
              label="Accepted waste"
              values={form.acceptedWaste}
              onChange={(v) => set("acceptedWaste", v)}
              placeholder={WASTE_CATEGORIES[0]}
            />
            <DynamicStringList
              label="Rejected waste"
              values={form.rejectedWaste}
              onChange={(v) => set("rejectedWaste", v)}
            />
            <DynamicStringList
              label="Services"
              values={form.services}
              onChange={(v) => set("services", v)}
            />
            <div className="rf-group">
              <label className="rf-label" htmlFor="cstatus">
                Verification status
              </label>
              <select
                id="cstatus"
                className="rf-input"
                value={form.verificationStatus}
                onChange={(e) => set("verificationStatus", e.target.value)}
              >
                <option value="Pending Verification">Pending Verification</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <label className="filter-check">
              <input
                type="checkbox"
                checked={!!form.isDemo}
                onChange={(e) => set("isDemo", e.target.checked)}
              />
              Demo / sample data (not officially certified)
            </label>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default AdminRecyclingCenterFormPage;
