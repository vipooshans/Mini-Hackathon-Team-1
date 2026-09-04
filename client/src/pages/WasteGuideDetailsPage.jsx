import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { RecyclabilityBadge } from "../components/recycling/Badges.jsx";
import FAQAccordion from "../components/recycling/FAQAccordion.jsx";
import LoadingSkeleton from "../components/recycling/LoadingSkeleton.jsx";
import { getWasteGuide } from "../services/wasteGuideService.js";
import { saveFavoriteGuide, removeFavoriteGuide, listFavorites } from "../services/favoriteService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLowData } from "../context/LowDataContext.jsx";

function WasteGuideDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { lowData } = useLowData();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [favBusy, setFavBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getWasteGuide(id, token)
      .then((res) => {
        if (!cancelled) setGuide(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Guide not found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  useEffect(() => {
    if (!token || !guide?._id) return;
    listFavorites(token)
      .then((res) => {
        const ids = res.data?.guideIds || [];
        setSaved(ids.includes(String(guide._id)));
      })
      .catch(() => {});
  }, [token, guide?._id]);

  const toggleSave = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setFavBusy(true);
    try {
      if (saved) {
        await removeFavoriteGuide(guide._id, token);
        setSaved(false);
      } else {
        await saveFavoriteGuide(guide._id, token);
        setSaved(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setFavBusy(false);
    }
  };

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          {loading && <LoadingSkeleton variant="detail" />}
          {error && <p className="form-error" role="alert">{error}</p>}
          {guide && (
            <>
              <div className="guide-detail__header">
                <h1 className="interior-page__title">{guide.name}</h1>
                <RecyclabilityBadge type={guide.recyclabilityType} />
              </div>
              <p className="interior-page__copy">Category: {guide.category}</p>
              {!lowData && guide.image && (
                <img
                  className="guide-detail__img"
                  src={guide.image}
                  alt=""
                  loading="lazy"
                />
              )}
              <p>{guide.description}</p>

              <p>
                <strong>Can it be recycled?</strong>{" "}
                {guide.recyclable ? "YES" : "See status badge"} — {guide.recyclabilityType}
              </p>

              {user && (
                <button
                  type="button"
                  className="btn"
                  onClick={toggleSave}
                  disabled={favBusy}
                  aria-pressed={saved}
                >
                  {saved ? "Saved guide" : "Save guide"}
                </button>
              )}

              <section className="rg-section">
                <h2 className="section-heading">How to prepare</h2>
                <ol className="instruction-list">
                  {(guide.preparationInstructions || []).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </section>

              <section className="rg-section do-dont">
                <div>
                  <h2 className="section-heading">Do</h2>
                  <ul>
                    {(guide.dos || []).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="section-heading">Don&apos;t</h2>
                  <ul>
                    {(guide.donts || []).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="rg-section">
                <h2 className="section-heading">Accepted items</h2>
                <ul>
                  {(guide.acceptedItems || []).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
                <h2 className="section-heading">Rejected items</h2>
                <ul>
                  {(guide.rejectedItems || []).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </section>

              <section className="rg-section">
                <h2 className="section-heading">Disposal methods</h2>
                <ul>
                  {(guide.disposalMethods || []).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </section>

              {guide.environmentalImpact && (
                <section className="rg-section">
                  <h2 className="section-heading">Environmental impact</h2>
                  <p>{guide.environmentalImpact}</p>
                </section>
              )}

              <FAQAccordion faqs={guide.faqs} />

              <div className="rg-cta">
                <Link
                  className="btn btn-primary"
                  to={`/recycling-centers?wasteType=${encodeURIComponent(guide.category)}`}
                >
                  View nearby collection centers
                </Link>
                <Link className="btn" to="/recycling-guide">
                  Back to guide
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default WasteGuideDetailsPage;
