import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import MunicipalityAdminSubnav from "../../components/MunicipalityAdminSubnav.jsx";
import {
  adminListCenterReports,
  adminPatchCenterReport,
} from "../../services/centerReportService.js";
import { useAuth } from "../../context/AuthContext.jsx";

function AdminCenterReportsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState(null);

  const load = () => {
    if (!token) return;
    adminListCenterReports({ status: status || undefined }, token)
      .then((res) => setReports(res.data || []))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, status]);

  if (authLoading) return null;
  if (!user || user.role !== "municipality") return <Navigate to="/login" replace />;

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">Center Reports</h1>
          <MunicipalityAdminSubnav />
          {error && <p className="form-error">{error}</p>}
          <select
            className="rf-input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Center</th>
                  <th>Reason</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id}>
                    <td>{r.centerId?.name || "—"}</td>
                    <td>
                      {r.reason}
                      {r.description ? ` — ${r.description}` : ""}
                    </td>
                    <td>{r.userId?.email || "—"}</td>
                    <td>{r.status}</td>
                    <td className="admin-actions">
                      <button
                        type="button"
                        onClick={() =>
                          adminPatchCenterReport(r._id, "Reviewed", token).then(load)
                        }
                      >
                        Reviewed
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          adminPatchCenterReport(r._id, "Resolved", token).then(load)
                        }
                      >
                        Resolve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          adminPatchCenterReport(r._id, "Rejected", token).then(load)
                        }
                      >
                        Reject
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

export default AdminCenterReportsPage;
