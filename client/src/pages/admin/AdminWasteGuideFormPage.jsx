import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header.jsx";
import DynamicStringList from "../../components/recycling/DynamicStringList.jsx";
import {
  adminCreateWasteGuide,
  adminGetWasteGuide,
  adminUpdateWasteGuide,
} from "../../services/wasteGuideService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { isMunicipalityAdmin } from "../../utils/roles.js";
import {
  WASTE_CATEGORIES,
} from "../../utils/recyclingUtils.js";

const empty = {
  name: "",
  slug: "",
  category: "Plastic",
  description: "",
  image: "",
  recyclable: true,
  recyclabilityType: "Recyclable",
  preparationInstructions: [""],
  dos: [""],
  donts: [""],
  acceptedItems: [""],
  rejectedItems: [""],
  disposalMethods: ["Recycling center"],
  environmentalImpact: "",
  keywords: [""],
  faqs: [],
  language: "en",
  status: "draft",
};

function AdminWasteGuideFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit || !token) return;
    adminGetWasteGuide(id, token)
      .then((res) => setForm({ ...empty, ...res.data }))
      .catch((err) => setError(err.message));
  }, [id, isEdit, token]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isMunicipalityAdmin(user)) return <Navigate to="/dashboard" replace />;

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        preparationInstructions: (form.preparationInstructions || []).filter(Boolean),
        dos: (form.dos || []).filter(Boolean),
        donts: (form.donts || []).filter(Boolean),
        acceptedItems: (form.acceptedItems || []).filter(Boolean),
        rejectedItems: (form.rejectedItems || []).filter(Boolean),
        disposalMethods: (form.disposalMethods || []).filter(Boolean),
        keywords: (form.keywords || []).filter(Boolean).map((k) => k.toLowerCase()),
      };
      if (isEdit) await adminUpdateWasteGuide(id, payload, token);
      else await adminCreateWasteGuide(payload, token);
      navigate("/admin/waste-guides");
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
            {isEdit ? "Edit Waste Guide" : "Add Waste Guide"}
          </h1>
          <Link to="/admin/waste-guides">Back</Link>
          {error && <p className="form-error">{error}</p>}
          <form className="admin-form" onSubmit={onSubmit}>
            <div className="rf-group">
              <label className="rf-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="rf-input"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="rf-input"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {WASTE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="rf-input"
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="image">
                Image URL
              </label>
              <input
                id="image"
                className="rf-input"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="recyclabilityType">
                Recyclability
              </label>
              <select
                id="recyclabilityType"
                className="rf-input"
                value={form.recyclabilityType}
                onChange={(e) => set("recyclabilityType", e.target.value)}
              >
                {[
                  "Recyclable",
                  "Non-Recyclable",
                  "Conditionally Recyclable",
                  "Compostable",
                  "Reusable",
                  "Hazardous",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <label className="filter-check">
              <input
                type="checkbox"
                checked={!!form.recyclable}
                onChange={(e) => set("recyclable", e.target.checked)}
              />
              Recyclable
            </label>
            <DynamicStringList
              label="Preparation instructions"
              values={form.preparationInstructions}
              onChange={(v) => set("preparationInstructions", v)}
            />
            <DynamicStringList label="Do" values={form.dos} onChange={(v) => set("dos", v)} />
            <DynamicStringList
              label="Don't"
              values={form.donts}
              onChange={(v) => set("donts", v)}
            />
            <DynamicStringList
              label="Accepted items"
              values={form.acceptedItems}
              onChange={(v) => set("acceptedItems", v)}
            />
            <DynamicStringList
              label="Rejected items"
              values={form.rejectedItems}
              onChange={(v) => set("rejectedItems", v)}
            />
            <DynamicStringList
              label="Disposal methods"
              values={form.disposalMethods}
              onChange={(v) => set("disposalMethods", v)}
            />
            <DynamicStringList
              label="Keywords"
              values={form.keywords}
              onChange={(v) => set("keywords", v)}
            />
            <div className="rf-group">
              <label className="rf-label" htmlFor="impact">
                Environmental impact
              </label>
              <textarea
                id="impact"
                className="rf-input"
                rows={2}
                value={form.environmentalImpact}
                onChange={(e) => set("environmentalImpact", e.target.value)}
              />
            </div>
            <div className="rf-group">
              <label className="rf-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="rf-input"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default AdminWasteGuideFormPage;
