import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../../components/Header.jsx";
import { getDashboardStats } from "../../services/recyclingCenterService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function RecyclingDashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    getDashboardStats(token)
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message));
  }, [token]);

  if (authLoading) return null;
  if (!user || user.role !== "municipality") return <Navigate to="/login" replace />;

  const catData = (stats?.guidesByCategory || []).map((d) => ({
    name: d._id,
    count: d.count,
  }));
  const typeData = (stats?.centersByType || []).map((d) => ({
    name: d._id,
    count: d.count,
  }));
  const districtData = (stats?.centersByDistrict || []).map((d) => ({
    name: d._id,
    count: d.count,
  }));

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">Recycling Dashboard</h1>
          <nav className="admin-subnav">
            <Link to="/admin/waste-guides">Waste Guides</Link>
            <Link to="/admin/recycling-centers">Recycling Centers</Link>
            <Link to="/admin/center-reports">Center Reports</Link>
            <Link to="/dashboard">Issue Reports</Link>
          </nav>
          {error && <p className="form-error">{error}</p>}
          {stats && (
            <>
              <div className="stat-cards">
                <div className="stat-card">
                  <span className="stat-card__n">{stats.totalGuides}</span>
                  <span>Total Waste Guides</span>
                </div>
                <div className="stat-card">
                  <span className="stat-card__n">{stats.publishedGuides}</span>
                  <span>Published Guides</span>
                </div>
                <div className="stat-card">
                  <span className="stat-card__n">{stats.totalCenters}</span>
                  <span>Total Centers</span>
                </div>
                <div className="stat-card">
                  <span className="stat-card__n">{stats.verifiedCenters}</span>
                  <span>Verified Centers</span>
                </div>
                <div className="stat-card">
                  <span className="stat-card__n">{stats.pendingVerification}</span>
                  <span>Pending Verification</span>
                </div>
                <div className="stat-card">
                  <span className="stat-card__n">{stats.citizenReports}</span>
                  <span>Citizen Reports</span>
                </div>
              </div>

              <section className="rg-section">
                <h2 className="section-heading">Waste categories</h2>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={catData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" hide />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0c4a3e" name="Guides" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rg-section">
                <h2 className="section-heading">Center types</h2>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={typeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" hide />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1a7a5c" name="Centers" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rg-section">
                <h2 className="section-heading">Centers by district</h2>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={districtData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#c45c26" name="Centers" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {stats.topSearches?.length > 0 && (
                <section className="rg-section">
                  <h2 className="section-heading">Top searches</h2>
                  <ul>
                    {stats.topSearches.map((s) => (
                      <li key={s._id}>
                        {s._id}: {s.count}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default RecyclingDashboardPage;
