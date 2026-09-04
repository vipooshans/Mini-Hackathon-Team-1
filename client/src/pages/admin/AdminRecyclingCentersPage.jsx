import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import MunicipalityAdminSubnav from "../../components/MunicipalityAdminSubnav.jsx";
import {
  adminListCenters,
  adminDeleteCenter,
  adminVerifyCenter,
} from "../../services/recyclingCenterService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { isMunicipalityAdmin } from "../../utils/roles.js";

function AdminRecyclingCentersPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [centers, setCenters] = useState([]);
  const [q, setQ] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [error, setError] = useState(null);

  const load = () => {
    if (!token) return;
    adminListCenters(
      {
        q: q || undefined,
        verificationStatus: verificationStatus || undefined,
      },
      token
    )
      .then((res) => setCenters(res.data || []))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isMunicipalityAdmin(user)) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">Recycling Centers</h1>
          <MunicipalityAdminSubnav>
            <Link className="btn btn-primary" to="/admin/recycling-centers/new">
              + Add Center
            </Link>
          </MunicipalityAdminSubnav>
          {error && <p className="form-error">{error}</p>}
          <div className="admin-filters">
            <input
              className="rf-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name"
            />
            <select
              className="rf-input"
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Suspended">Suspended</option>
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
                  <th>District</th>
                  <th>Status</th>
                  <th>Demo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {centers.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.district}</td>
                    <td>{c.verificationStatus}</td>
                    <td>{c.isDemo ? "Yes" : "No"}</td>
                    <td className="admin-actions">
                      <Link to={`/admin/recycling-centers/${c._id}/edit`}>Edit</Link>
                      <button
                        type="button"
                        onClick={() => adminVerifyCenter(c._id, "Approved", token).then(load)}
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => adminVerifyCenter(c._id, "Rejected", token).then(load)}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => adminVerifyCenter(c._id, "Suspended", token).then(load)}
                      >
                        Suspend
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm("Delete center?")) {
                            await adminDeleteCenter(c._id, token);
                            load();
                          }
                        }}
                      >
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

export default AdminRecyclingCentersPage;
