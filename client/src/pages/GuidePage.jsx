import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { GUIDE_ITEMS } from "../data/recyclingGuide.js";
import { useAuth } from "../context/AuthContext.jsx";

function GuidePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GUIDE_ITEMS;
    return GUIDE_ITEMS.filter((item) => {
      const hay = `${item.name} ${item.bin} ${item.tip} ${item.keywords}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">Recycling Guide</h1>
          <p className="interior-page__copy">
            Find where plastics, e-waste, glass, and organics belong under local
            sorting norms.
          </p>

          <div className="rf-group">
            <label className="rf-label" htmlFor="guide-search">
              Search materials
            </label>
            <input
              className="rf-input"
              id="guide-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. battery, cardboard, polythene"
            />
          </div>

          <div className="guide-list">
            {results.length === 0 && (
              <p className="empty-inline">No matches — try another material.</p>
            )}
            {results.map((item) => (
              <article className="guide-item" key={item.id}>
                <div className="guide-item__top">
                  <h2 className="guide-item__name">{item.name}</h2>
                  <span className="guide-item__bin">{item.bin}</span>
                </div>
                <p className="guide-item__tip">{item.tip}</p>
              </article>
            ))}
          </div>

          {user?.role === "citizen" && (
            <p className="feature-footnote">
              Need a scrap or e-waste pickup?{" "}
              <Link to="/recycler">Request a recycler pickup</Link>
            </p>
          )}
          {!user && (
            <p className="feature-footnote">
              <Link to="/login">Sign in</Link> as a citizen to request recycler
              pickup.
            </p>
          )}
        </div>
      </main>
    </>
  );
}

export default GuidePage;
