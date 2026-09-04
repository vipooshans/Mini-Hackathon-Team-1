import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import WasteGuideCard from "../components/recycling/WasteGuideCard.jsx";
import RecyclingCenterCard from "../components/recycling/RecyclingCenterCard.jsx";
import LoadingSkeleton from "../components/recycling/LoadingSkeleton.jsx";
import { listFavorites } from "../services/favoriteService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLowData } from "../context/LowDataContext.jsx";

function SavedPage() {
  const { user, token, loading: authLoading } = useAuth();
  const { lowData } = useLowData();
  const [guides, setGuides] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    listFavorites(token)
      .then((res) => {
        setGuides(res.data?.guides || []);
        setCenters(res.data?.centers || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">Saved</h1>
          <p className="interior-page__copy">Your saved waste guides and recycling centres.</p>
          {loading && <LoadingSkeleton count={2} />}
          {error && <p className="form-error">{error}</p>}

          <section className="rg-section">
            <h2 className="section-heading">Saved waste guides</h2>
            {!loading && guides.length === 0 && (
              <p className="empty-inline">
                No saved guides yet.{" "}
                <Link to="/recycling-guide">Browse the guide</Link>
              </p>
            )}
            <div className="guide-list">
              {guides.map((g) => (
                <WasteGuideCard key={g._id} guide={g} lowData={lowData} />
              ))}
            </div>
          </section>

          <section className="rg-section">
            <h2 className="section-heading">Saved recycling centres</h2>
            {!loading && centers.length === 0 && (
              <p className="empty-inline">
                No saved centres yet.{" "}
                <Link to="/recycling-centers">Find centres</Link>
              </p>
            )}
            <div className="center-list">
              {centers.map((c) => (
                <RecyclingCenterCard key={c._id} center={c} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default SavedPage;
