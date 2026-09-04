import { getOpeningStatus } from "../../utils/recyclingUtils.js";

export default function OpeningStatus({ openingHours }) {
  const status = getOpeningStatus(openingHours);
  return (
    <div className="opening-status" role="status">
      <span
        className={
          status.isOpen ? "opening-status__pill opening-status__pill--open" : "opening-status__pill opening-status__pill--closed"
        }
      >
        {status.label}
      </span>
      {!status.isOpen && status.nextOpenLabel && (
        <span className="opening-status__next">{status.nextOpenLabel}</span>
      )}
    </div>
  );
}
