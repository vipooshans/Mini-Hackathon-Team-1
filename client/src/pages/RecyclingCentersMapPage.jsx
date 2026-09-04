import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import FilterPanel from "../components/recycling/FilterPanel.jsx";
import LoadingSkeleton from "../components/recycling/LoadingSkeleton.jsx";
import {
  listRecyclingCenters,
  nearbyRecyclingCenters,
} from "../services/recyclingCenterService.js";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { useLowData } from "../context/LowDataContext.jsx";
import { DISTRICTS } from "../data/districts.js";

const RecyclingCenterMap = lazy(() =>
  import("../components/recycling/RecyclingCenterMap.jsx")
);

function RecyclingCentersMapPage() {
  const { coords, requestLocation, status } = useGeolocation();
  const { lowData } = useLowData();
  const [filters, setFilters] = useState({
    radius: "10",
    wasteType: "",
    district: "",
    type: "",
    verifiedOnly: false,
    openNow: false,
  });
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(!lowData);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = {
          wasteType: filters.wasteType || undefined,
          district: filters.district || undefined,
          type: filters.type || undefined,
          verifiedOnly: filters.verifiedOnly || undefined,
          radius: filters.radius,
        };
        const res = coords
          ? await nearbyRecyclingCenters({
              ...params,
              latitude: coords.lat,
              longitude: coords.lng,
            })
          : await listRecyclingCenters(params);
        if (!cancelled) setCenters(res.data || []);
      } catch {
        if (!cancelled) setCenters([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [filters, coords]);

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          <h1 className="interior-page__title">Recycling Centers Map</h1>
          <div className="rg-location-bar">
            <button type="button" className="btn btn-primary" onClick={requestLocation}>
              Use My Location
            </button>
            {status === "loading" && <span>Getting location…</span>}
            <Link className="btn" to="/recycling-centers">
              List view
            </Link>
            {lowData && !showMap && (
              <button type="button" className="btn" onClick={() => setShowMap(true)}>
                Load map
              </button>
            )}
          </div>
          <FilterPanel filters={filters} onChange={setFilters} districts={DISTRICTS} />
          {loading && <LoadingSkeleton count={1} />}
          {showMap && (
            <Suspense fallback={<div className="map-placeholder">Loading map…</div>}>
              <RecyclingCenterMap centers={centers} userCoords={coords} />
            </Suspense>
          )}
        </div>
      </main>
    </>
  );
}

export default RecyclingCentersMapPage;
