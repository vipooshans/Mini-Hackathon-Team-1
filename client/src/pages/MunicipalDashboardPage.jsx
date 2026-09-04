import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getReports, updateReportStatus } from "../services/reportService.js";

function computeMetrics(reports) {
  const total = reports.length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;
  const resolvedPercent = total === 0 ? 0 : Math.round((100 * resolved) / total);

  const counts = {};
  for (const r of reports) {
    const key = (r.district || "").trim() || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
  }

  const districts = Object.keys(counts).sort((a, b) => {
    if (counts[b] !== counts[a]) return counts[b] - counts[a];
    return a.localeCompare(b);
  });

  return {
    total,
    resolvedPercent,
    busiestDistrict: districts[0] || "—",
  };
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "Resolved":
      return "badge--resolved";
    case "Acknowledged":
      return "badge--acknowledged";
    default:
      return "badge--pending";
  }
}

function MunicipalDashboardPage() {
  const { user, token, loading } = useAuth();
  const [reports, setReports] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(Array.isArray(data) ? data : []);
      setFetchStatus("success");
    } catch {
      setFetchStatus("error");
    }
  };

  useEffect(() => {
    if (!token) return;
    loadReports();
  }, [token]);

  const metrics = useMemo(() => computeMetrics(reports), [reports]);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "municipality") {
    return (
      <>
        <Header />
        <main className="interior-page">
          <div className="interior-page__inner">
            <h1 className="interior-page__title">Municipal Dashboard</h1>
            <p className="interior-page__copy">
              This panel is for municipality accounts. Sign in with a Municipality
              role, or{" "}
              <Link to="/register">register</Link> as Municipality.
            </p>
            <Link to="/my-reports" className="btn btn-primary">
              Go to My Reports
            </Link>
          </div>
        </main>
      </>
    );
  }

  const handleStatusUpdate = async (id, status) => {
    setActionError("");
    setUpdatingId(id);
    try {
      const updated = await updateReportStatus(id, status, token);
      setReports((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
    } catch (err) {
      setActionError(err.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Header />
      <main className="interior-page dashboard-page">
      <div className="interior-page__inner">
        <div className="my-reports-header">
          <div>
            <h1 className="interior-page__title">Municipal Dashboard</h1>
            <p className="dashboard-subtitle">
              Live waste reports — acknowledge and resolve issues for your council.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={loadReports}
            disabled={fetchStatus === "loading"}
          >
            Refresh
          </button>
        </div>

        <div className="dashboard-metrics" aria-label="Report metrics">
          <div className="dashboard-metric">
            <span className="dashboard-metric__label">Total Reports</span>
            <span className="dashboard-metric__value">{metrics.total}</span>
          </div>
          <div className="dashboard-metric">
            <span className="dashboard-metric__label">% Resolved</span>
            <span className="dashboard-metric__value">
              {metrics.resolvedPercent}%
            </span>
          </div>
          <div className="dashboard-metric">
            <span className="dashboard-metric__label">Busiest District</span>
            <span className="dashboard-metric__value dashboard-metric__value--text">
              {metrics.busiestDistrict}
            </span>
          </div>
        </div>

        {actionError && (
          <div className="rf-alert rf-alert--error">
            <span>!</span>
            <span>{actionError}</span>
          </div>
        )}

        {fetchStatus === "loading" && (
          <p className="loading-text">Loading reports…</p>
        )}

        {fetchStatus === "error" && (
          <div className="rf-alert rf-alert--error">
            <span>!</span>
            <span>Failed to load reports. Please try again.</span>
          </div>
        )}

        {fetchStatus === "success" && reports.length === 0 && (
          <div className="empty-state">
            <h3>No reports yet</h3>
            <p>
              When citizens submit waste issues, they will appear here for your
              team to acknowledge and resolve.
            </p>
          </div>
        )}

        {fetchStatus === "success" && reports.length > 0 && (
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report._id} className="report-list-card">
                <div className="report-list-card__header">
                  <span
                    className={`badge ${getStatusBadgeClass(report.status)}`}
                  >
                    {report.status}
                  </span>
                  <span className="report-list-card__date">
                    {new Date(report.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="report-list-card__type">{report.wasteType}</h3>
                <p className="report-list-card__district">
                  {report.district}
                </p>
                <p className="report-list-card__desc">{report.description}</p>

                {report.images && report.images.length > 0 && (
                  <div className="report-list-card__images">
                    {report.images.map((img, i) => (
                      <div key={i} className="report-list-card__thumb">
                        <img src={img} alt="Report evidence" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="dashboard-card-actions">
                  {report.status === "Pending" && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={updatingId === report._id}
                      onClick={() =>
                        handleStatusUpdate(report._id, "Acknowledged")
                      }
                    >
                      {updatingId === report._id
                        ? "Updating…"
                        : "Acknowledge"}
                    </button>
                  )}
                  {report.status !== "Resolved" && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={updatingId === report._id}
                      onClick={() =>
                        handleStatusUpdate(report._id, "Resolved")
                      }
                    >
                      {updatingId === report._id ? "Updating…" : "Resolve"}
                    </button>
                  )}
                  {report.status === "Resolved" && (
                    <span className="dashboard-resolved-note">Resolved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
    </>
  );
}

export default MunicipalDashboardPage;
