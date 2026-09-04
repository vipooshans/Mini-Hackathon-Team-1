import { Link } from "react-router-dom";

export default function WasteCategoryCard({ category, icon, onClick }) {
  const content = (
    <>
      <span className="cat-card__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="cat-card__label">{category}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="cat-card" onClick={() => onClick(category)}>
        {content}
      </button>
    );
  }

  return (
    <Link
      className="cat-card"
      to={`/recycling-guide?category=${encodeURIComponent(category)}`}
    >
      {content}
    </Link>
  );
}
