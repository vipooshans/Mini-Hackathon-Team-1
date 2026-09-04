import { Link } from "react-router-dom";
import { RecyclabilityBadge } from "./Badges.jsx";

export default function WasteGuideCard({ guide, lowData = false }) {
  if (!guide) return null;
  return (
    <article className="guide-item waste-guide-card">
      <div className="guide-item__top">
        <h2 className="guide-item__name">{guide.name}</h2>
        <RecyclabilityBadge type={guide.recyclabilityType} />
      </div>
      <p className="waste-guide-card__meta">
        <span>Category: {guide.category}</span>
      </p>
      {!lowData && guide.image && (
        <img
          className="waste-guide-card__img"
          src={guide.image}
          alt=""
          loading="lazy"
          width={320}
          height={180}
        />
      )}
      <p className="guide-item__tip">
        {guide.disposalMethods?.[0]
          ? `Disposal: ${guide.disposalMethods[0]}`
          : guide.description?.slice(0, 120)}
      </p>
      {guide.preparationInstructions?.[0] && (
        <p className="waste-guide-card__prep">
          Preparation: {guide.preparationInstructions[0]}
        </p>
      )}
      <div className="waste-guide-card__actions">
        <Link className="btn btn-primary" to={`/recycling-guide/${guide.slug || guide._id}`}>
          View Guide
        </Link>
        <Link
          className="btn"
          to={`/recycling-centers?wasteType=${encodeURIComponent(guide.category)}`}
        >
          Find Nearby Centers
        </Link>
      </div>
    </article>
  );
}
