import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import FilterPanel from "../components/recycling/FilterPanel.jsx";
import RecyclingCenterCard from "../components/recycling/RecyclingCenterCard.jsx";
import LoadingSkeleton from "../components/recycling/LoadingSkeleton.jsx";
import {
  listRecyclingCenters,
  nearbyRecyclingCenters,
} from "../services/recyclingCenterService.js";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { getOpeningStatus } from "../utils/recyclingUtils.js";
import { DISTRICTS } from "../data/districts.js";

function RecyclingCentersPage() {
  const [searchParams] = useSearchParams();
  const { coords, status, error: geoError, requestLocation } = useGeolocation();
  const [filters, setFilters] = useState({
    radius: "10",
    wasteType: searchParams.get("wasteType") || "",
    district: "",
    type: "",
    verifiedOnly: false,
    openNow: false,
  });
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = {
          wasteType: filters.wasteType || undefined,
          district: filters.district || undefined,
          type: filters.type || undefined,
          verifiedOnly: filters.verifiedOnly || undefined,
          radius: filters.radius,
        };
        let res;
        if (coords) {
          res = await nearbyRecyclingCenters({
            ...params,
            latitude: coords.lat,
            longitude: coords.lng,
          });
        } else {
          res = await listRecyclingCenters(params);
        }
        if (!cancelled) setCenters(res.data || []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load centres");
          setCenters([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [filters, coords]);

  const filtered = useMemo(() => {
    if (!filters.openNow) return centers;
    return centers.filter((c) => getOpeningStatus(c.openingHours).isOpen);
  }, [centers, filters.openNow]);

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">Nearby Recycling Centers</h1>
          <p className="interior-page__copy">
            Filter by waste type and distance. Location is optional — the guide works without it.
          </p>

          <div className="rg-location-bar">
            <button type="button" className="btn btn-primary" onClick={requestLocation}>
              Use My Location
            </button>
            {status === "loading" && <span>Getting location…</span>}
            {status === "success" && coords && (
              <span>
                Location set ({coords.lat.toFixed(3)}, {coords.lng.toFixed(3)})
              </span>
            )}
            {geoError && <span className="form-error">{geoError}</span>}
            <Link className="btn" to="/recycling-centers/map">
              Map view
            </Link>
          </div>

          <FilterPanel
            filters={filters}
            onChange={setFilters}
            districts={DISTRICTS || []}
          />

          {loading && <LoadingSkeleton count={3} />}
          {error && <p className="form-error" role="alert">{error}</p>}
          {!loading && filtered.length === 0 && (
            <p className="empty-state">No centres match these filters.</p>
          )}
          <div className="center-list">
            {filtered.map((c) => (
              <RecyclingCenterCard key={c._id} center={c} userCoords={coords} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default RecyclingCentersPage;
