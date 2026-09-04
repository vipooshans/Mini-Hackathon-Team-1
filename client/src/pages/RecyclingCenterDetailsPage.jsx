import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { VerificationBadge } from "../components/recycling/Badges.jsx";
import OpeningStatus from "../components/recycling/OpeningStatus.jsx";
import LoadingSkeleton from "../components/recycling/LoadingSkeleton.jsx";
import { getRecyclingCenter } from "../services/recyclingCenterService.js";
import {
  saveFavoriteCenter,
  removeFavoriteCenter,
  listFavorites,
} from "../services/favoriteService.js";
import { createCenterReport } from "../services/centerReportService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { useLowData } from "../context/LowDataContext.jsx";
import {
  buildDirectionsUrl,
  formatTime,
} from "../utils/recyclingUtils.js";

const REPORT_REASONS = [
  "Center closed",
  "Wrong address",
  "Wrong phone number",
  "Wrong accepted waste",
  "Wrong opening hours",
  "Duplicate center",
  "Other",
];

function RecyclingCenterDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { coords, requestLocation } = useGeolocation();
  const { lowData } = useLowData();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState("");
  const [reportMsg, setReportMsg] = useState("");
  const [MapComp, setMapComp] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getRecyclingCenter(
      id,
      coords ? { latitude: coords.lat, longitude: coords.lng } : {},
      token
    )
      .then((res) => {
        if (!cancelled) setCenter(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Center not found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, coords, token]);

  useEffect(() => {
    if (!token || !center?._id) return;
    listFavorites(token)
      .then((res) => {
        setSaved((res.data?.centerIds || []).includes(String(center._id)));
      })
      .catch(() => {});
  }, [token, center?._id]);

  useEffect(() => {
    if (lowData || !center) return;
    import("../components/recycling/RecyclingCenterMap.jsx").then((m) =>
      setMapComp(() => m.default)
    );
  }, [lowData, center]);

  const toggleSave = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      if (saved) {
        await removeFavoriteCenter(center._id, token);
        setSaved(false);
      } else {
        await saveFavoriteCenter(center._id, token);
        setSaved(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await createCenterReport(
        { centerId: center._id, reason, description },
        token
      );
      setReportMsg("Report submitted. Thank you.");
      setShowReport(false);
    } catch (err) {
      setReportMsg(err.message || "Could not submit report");
    }
  };

  const directions = buildDirectionsUrl(center, coords);
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <>
      <Header />
      <main className="interior-page feature-page">
        <div className="interior-page__inner">
          {loading && <LoadingSkeleton variant="detail" />}
          {error && <p className="form-error" role="alert">{error}</p>}
          {center && (
            <>
              <h1 className="interior-page__title">{center.name}</h1>
              <VerificationBadge
                verified={center.verified}
                verificationStatus={center.verificationStatus}
                isDemo={center.isDemo}
              />
              <p>{center.description}</p>
              <p>
                <strong>Address:</strong> {center.address}
                {center.district ? `, ${center.district}` : ""}
              </p>
              {center.phone && (
                <p>
                  <strong>Phone:</strong>{" "}
                  <a href={`tel:${center.phone}`}>{center.phone}</a>
                </p>
              )}
              {center.email && (
                <p>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${center.email}`}>{center.email}</a>
                </p>
              )}
              {center.distance != null && (
                <p>
                  <strong>Distance:</strong> {center.distance} km
                </p>
              )}

              <OpeningStatus openingHours={center.openingHours} />

              <section className="rg-section">
                <h2 className="section-heading">Opening hours</h2>
                <ul className="hours-list">
                  {days.map((d) => {
                    const h = center.openingHours?.[d];
                    return (
                      <li key={d}>
                        <strong>{d.charAt(0).toUpperCase() + d.slice(1)}:</strong>{" "}
                        {h?.closed
                          ? "Closed"
                          : `${formatTime(h?.open)} – ${formatTime(h?.close)}`}
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="rg-section do-dont">
                <div>
                  <h2 className="section-heading">Accepts</h2>
                  <ul>
                    {(center.acceptedWaste || []).map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="section-heading">Does not accept</h2>
                  <ul>
                    {(center.rejectedWaste || []).map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <div className="center-card__actions">
                <button type="button" className="btn" onClick={requestLocation}>
                  Use My Location
                </button>
                {directions && (
                  <a
                    className="btn btn-primary"
                    href={directions}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                )}
                {user && (
                  <button type="button" className="btn" onClick={toggleSave}>
                    {saved ? "Saved" : "Save"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowReport((v) => !v)}
                >
                  Report Incorrect Information
                </button>
              </div>

              {reportMsg && <p role="status">{reportMsg}</p>}

              {showReport && (
                <form className="report-form-inline" onSubmit={submitReport}>
                  <div className="rf-group">
                    <label className="rf-label" htmlFor="report-reason">
                      Reason
                    </label>
                    <select
                      id="report-reason"
                      className="rf-input"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    >
                      {REPORT_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="rf-group">
                    <label className="rf-label" htmlFor="report-desc">
                      Description
                    </label>
                    <textarea
                      id="report-desc"
                      className="rf-input"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit report
                  </button>
                </form>
              )}

              {MapComp && center.location?.coordinates && (
                <section className="rg-section">
                  <h2 className="section-heading">Map</h2>
                  <MapComp centers={[center]} userCoords={coords} height={300} />
                </section>
              )}

              <Link className="btn" to="/recycling-centers">
                Back to centres
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default RecyclingCenterDetailsPage;
