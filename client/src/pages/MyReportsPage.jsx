import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getMyReports } from "../services/reportService.js";

function MyReportsPage() {
  const { user, token, loading } = useAuth();
  const [reports, setReports] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    if (!token) return;

    async function loadReports() {
      try {
        const data = await getMyReports(token);
        setReports(data);
        setFetchStatus("success");
      } catch (err) {
        setFetchStatus("error");
      }
    }

    loadReports();
  }, [token]);

  if (loading) return null; // Wait for AuthContext to check localStorage

  // Protect route
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Resolved": return "badge--resolved";
      case "Acknowledged": return "badge--acknowledged";
      default: return "badge--pending";
    }
  };

  return (
    <main className="interior-page my-reports-page">
      <div className="interior-page__inner">
        <div className="my-reports-header">
          <h1 className="interior-page__title">My Reports</h1>
          <Link to="/report" className="btn btn-primary btn-sm">
            + New Report
          </Link>
        </div>

        {fetchStatus === "loading" && <p className="loading-text">Loading your reports…</p>}
        
        {fetchStatus === "error" && (
          <div className="rf-alert rf-alert--error">
            <span>!</span>
            <span>Failed to load your reports. Please try again later.</span>
          </div>
        )}

        {fetchStatus === "success" && reports.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">📝</div>
            <h3>No reports yet</h3>
            <p>You haven't submitted any waste reports. Help keep your community clean by reporting issues you see.</p>
            <Link to="/report" className="btn btn-primary">Start a report</Link>
          </div>
        )}

        {fetchStatus === "success" && reports.length > 0 && (
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report._id} className="report-list-card">
                <div className="report-list-card__header">
                  <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                    {report.status}
                  </span>
                  <span className="report-list-card__date">
                    {new Date(report.date).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="report-list-card__type">{report.wasteType}</h3>
                <p className="report-list-card__district">📍 {report.district}</p>
                <p className="report-list-card__desc">{report.description}</p>
                
                {report.images && report.images.length > 0 && (
                  <div className="report-list-card__images">
                    {report.images.map((img, i) => (
                      <div key={i} className="report-list-card__thumb">
                        <img src={`http://localhost:5000${img}`} alt="Report" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyReportsPage;
