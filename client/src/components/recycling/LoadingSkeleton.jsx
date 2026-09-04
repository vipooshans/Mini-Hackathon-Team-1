export default function LoadingSkeleton({ variant = "card", count = 3 }) {
  const items = Array.from({ length: count });
  if (variant === "detail") {
    return (
      <div className="skel skel--detail" aria-busy="true" aria-label="Loading">
        <div className="skel-line skel-line--lg" />
        <div className="skel-line" />
        <div className="skel-line" />
        <div className="skel-block" />
      </div>
    );
  }
  return (
    <div className="skel-grid" aria-busy="true" aria-label="Loading">
      {items.map((_, i) => (
        <div className="skel skel--card" key={i}>
          <div className="skel-line skel-line--lg" />
          <div className="skel-line" />
          <div className="skel-line" />
        </div>
      ))}
    </div>
  );
}
