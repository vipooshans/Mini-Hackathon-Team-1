export function RecyclabilityBadge({ type }) {
  const map = {
    Recyclable: { cls: "recyc-badge--green", text: "Recyclable" },
    "Non-Recyclable": { cls: "recyc-badge--red", text: "Non-Recyclable" },
    "Conditionally Recyclable": {
      cls: "recyc-badge--yellow",
      text: "Conditionally Recyclable",
    },
    Compostable: { cls: "recyc-badge--brown", text: "Compostable" },
    Reusable: { cls: "recyc-badge--blue", text: "Reusable" },
    Hazardous: { cls: "recyc-badge--warn", text: "Hazardous" },
  };
  const item = map[type] || { cls: "recyc-badge--yellow", text: type || "Unknown" };
  return (
    <span className={`recyc-badge ${item.cls}`} role="status">
      {item.text}
    </span>
  );
}

export function VerificationBadge({ verified, verificationStatus, isDemo }) {
  if (verified && verificationStatus === "Approved" && !isDemo) {
    return (
      <span className="verify-badge verify-badge--ok" role="status">
        Verified
      </span>
    );
  }
  if (verified && verificationStatus === "Approved" && isDemo) {
    return (
      <span className="verify-badge verify-badge--demo" role="status">
        Demo sample — not officially certified
      </span>
    );
  }
  if (verificationStatus === "Pending Verification") {
    return (
      <span className="verify-badge verify-badge--pending" role="status">
        Pending verification
      </span>
    );
  }
  return (
    <span className="verify-badge verify-badge--unverified" role="status">
      Unverified
    </span>
  );
}

export function DistanceBadge({ distance }) {
  if (distance == null || Number.isNaN(Number(distance))) return null;
  return (
    <span className="distance-badge" aria-label={`${distance} kilometres away`}>
      {distance} km away
    </span>
  );
}
