import { Link } from "react-router-dom";
import { DistanceBadge, VerificationBadge } from "./Badges.jsx";
import OpeningStatus from "./OpeningStatus.jsx";
import { buildDirectionsUrl } from "../../utils/recyclingUtils.js";

export default function RecyclingCenterCard({ center, userCoords }) {
  if (!center) return null;
  const directions = buildDirectionsUrl(center, userCoords);

  return (
    <article className="center-card">
      <div className="center-card__top">
        <h2 className="center-card__name">{center.name}</h2>
        <VerificationBadge
          verified={center.verified}
          verificationStatus={center.verificationStatus}
          isDemo={center.isDemo}
        />
      </div>
      <p className="center-card__addr">{center.address}</p>
      <div className="center-card__meta">
        <DistanceBadge distance={center.distance} />
        <OpeningStatus openingHours={center.openingHours} />
      </div>
      <p className="center-card__accepts">
        <strong>Accepts:</strong> {(center.acceptedWaste || []).join(", ")}
      </p>
      <div className="center-card__actions">
        <Link className="btn btn-primary" to={`/recycling-centers/${center._id}`}>
          Details
        </Link>
        {directions && (
          <a
            className="btn"
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions
          </a>
        )}
      </div>
    </article>
  );
}
