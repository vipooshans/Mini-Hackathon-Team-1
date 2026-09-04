import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import SearchBar from "../components/recycling/SearchBar.jsx";
import WasteGuideCard from "../components/recycling/WasteGuideCard.jsx";
import WasteCategoryCard from "../components/recycling/WasteCategoryCard.jsx";
import LoadingSkeleton from "../components/recycling/LoadingSkeleton.jsx";
import { searchWasteGuides, listWasteGuides } from "../services/wasteGuideService.js";
import { listEducationArticles } from "../services/educationService.js";
import { POPULAR_CATEGORIES } from "../utils/recyclingUtils.js";
import { useTranslation } from "react-i18next";
import { useLowData } from "../context/LowDataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function RecyclingGuidePage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lowData } = useLowData();
  const { user } = useAuth();
  const initialQ = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQ);
  const [guides, setGuides] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(!!initialQ || !!category);

  const load = async (q, cat) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (q) {
        res = await searchWasteGuides(q);
        setSearched(true);
      } else if (cat) {
        res = await listWasteGuides({ category: cat });
        setSearched(true);
      } else {
        res = await listWasteGuides({ limit: 12 });
        setSearched(false);
      }
      setGuides(res.data || []);
    } catch (err) {
      setError(err.message || "Could not load guides");
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(initialQ, category);
    listEducationArticles()
      .then((r) => setArticles(r.data || []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQ, category]);

  const onSearch = (q) => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    setSearchParams(next);
    setQuery(q);
    load(q, "");
  };

  const onCategory = (cat) => {
    setSearchParams({ category: cat });
    setQuery("");
    load("", cat);
  };

  return (
    <>
      <Header />
      <main className="interior-page feature-page rg-home">
        <div className="interior-page__inner">
          <header className="rg-hero">
            <p className="rg-hero__eyebrow">CleanLanka</p>
            <h1 className="interior-page__title">{t("guideTitle")}</h1>
            <p className="interior-page__copy">{t("guideSubtitle")}</p>
            <p className="rg-hero__tagline">
              Don&apos;t know where your waste belongs? Search CleanLanka&apos;s recycling and
              disposal guide.
            </p>
          </header>

          <SearchBar value={query} onChange={setQuery} onSearch={onSearch} />

          <section className="rg-section" aria-labelledby="popular-cats">
            <h2 id="popular-cats" className="section-heading">
              Popular waste categories
            </h2>
            <div className="cat-grid">
              {POPULAR_CATEGORIES.map((c) => (
                <WasteCategoryCard
                  key={c.key}
                  category={c.key}
                  icon={c.icon}
                  onClick={onCategory}
                />
              ))}
            </div>
          </section>

          <section className="rg-section" aria-labelledby="results-heading">
            <h2 id="results-heading" className="section-heading">
              {searched ? "Search results" : "Browse guides"}
            </h2>
            {loading && <LoadingSkeleton count={4} />}
            {error && <p className="form-error" role="alert">{error}</p>}
            {!loading && !error && guides.length === 0 && (
              <div className="empty-state">
                <p>
                  We couldn&apos;t find a guide for &quot;{query || category || "your search"}&quot;.
                </p>
                <p>Try: Plastic, Battery, E-Waste, Glass, Paper</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchParams({});
                    setQuery("");
                    load("", "");
                  }}
                >
                  Browse Waste Categories
                </button>
              </div>
            )}
            <div className="guide-list">
              {guides.map((g) => (
                <WasteGuideCard key={g._id} guide={g} lowData={lowData} />
              ))}
            </div>
          </section>

          <section className="rg-section rg-separation" aria-labelledby="sep-heading">
            <h2 id="sep-heading" className="section-heading">
              Household waste separation
            </h2>
            <div className="sep-grid">
              <div className="sep-card">
                <h3>Recyclables</h3>
                <p>Plastic, Paper, Glass, Metal</p>
              </div>
              <div className="sep-card">
                <h3>Organic</h3>
                <p>Food scraps, Garden waste</p>
              </div>
              <div className="sep-card">
                <h3>Hazardous</h3>
                <p>Batteries, Chemicals, Certain electronic waste</p>
              </div>
            </div>
          </section>

          <section className="rg-section rg-cta">
            <h2 className="section-heading">Find a recycling center near you</h2>
            <p className="interior-page__copy">
              Location is optional for guides — use it only when you want nearby centres.
            </p>
            <Link className="btn btn-primary" to="/recycling-centers">
              Find Nearby Centers
            </Link>
            <Link className="btn" to="/recycling-centers/map" style={{ marginLeft: "0.5rem" }}>
              Map view
            </Link>
          </section>

          {articles.length > 0 && (
            <section className="rg-section" aria-labelledby="learn-heading">
              <h2 id="learn-heading" className="section-heading">
                Learn more
              </h2>
              <div className="edu-grid">
                {articles.slice(0, 6).map((a) => (
                  <article className="edu-card" key={a._id}>
                    <h3>{a.title}</h3>
                    <p>{a.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {user?.role === "citizen" && (
            <p className="feature-footnote">
              Need a scrap or e-waste pickup?{" "}
              <Link to="/recycler">Request a recycler pickup</Link>
              {" · "}
              <Link to="/schedule">Collection schedule</Link>
            </p>
          )}
          {!user && (
            <p className="feature-footnote">
              <Link to="/login">Sign in</Link> to save centres and guides.
            </p>
          )}
        </div>
      </main>
    </>
  );
}

export default RecyclingGuidePage;
