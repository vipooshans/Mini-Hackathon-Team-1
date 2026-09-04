import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import MunicipalityAdminSubnav from "../../components/MunicipalityAdminSubnav.jsx";
import {
  adminListWasteGuides,
  adminDeleteWasteGuide,
  adminPatchWasteGuideStatus,
} from "../../services/wasteGuideService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { isMunicipalityAdmin } from "../../utils/roles.js";
import { WASTE_CATEGORIES } from "../../utils/recyclingUtils.js";

function AdminWasteGuidesPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [guides, setGuides] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);

  const load = () => {
    if (!token) return;
    adminListWasteGuides(
      {
        q: q || undefined,
        category: category || undefined,
        status: status || undefined,
      },
      token
    )
      .then((res) => setGuides(res.data || []))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isMunicipalityAdmin(user)) return <Navigate to="/dashboard" replace />;

  const onDelete = async (id) => {
    if (!window.confirm("Delete this guide?")) return;
    await adminDeleteWasteGuide(id, token);
    load();
  };

  const onStatus = async (id, next) => {
    await adminPatchWasteGuideStatus(id, next, token);
    load();
  };

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">Waste Guides</h1>
          <MunicipalityAdminSubnav>
            <Link className="btn btn-primary" to="/admin/waste-guides/new">
              + Add Waste Guide
            </Link>
          </MunicipalityAdminSubnav>
          {error && <p className="form-error">{error}</p>}
          <div className="admin-filters">
            <input
              className="rf-input"
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="rf-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {WASTE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="rf-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
            <button type="button" className="btn" onClick={load}>
              Filter
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {guides.map((g) => (
                  <tr key={g._id}>
                    <td>{g.name}</td>
                    <td>{g.category}</td>
                    <td>{g.status}</td>
                    <td className="admin-actions">
                      <Link to={`/admin/waste-guides/${g._id}/edit`}>Edit</Link>
                      {g.status !== "published" ? (
                        <button type="button" onClick={() => onStatus(g._id, "published")}>
                          Publish
                        </button>
                      ) : (
                        <button type="button" onClick={() => onStatus(g._id, "draft")}>
                          Unpublish
                        </button>
                      )}
                      <button type="button" onClick={() => onDelete(g._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminWasteGuidesPage;
