import { CENTER_TYPES, WASTE_CATEGORIES } from "../../utils/recyclingUtils.js";

export default function FilterPanel({ filters, onChange, districts = [] }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filter-panel" role="group" aria-label="Filter recycling centers">
      <div className="rf-group">
        <label className="rf-label" htmlFor="f-radius">
          Radius
        </label>
        <select
          id="f-radius"
          className="rf-input"
          value={filters.radius || "10"}
          onChange={(e) => set("radius", e.target.value)}
        >
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="20">20 km</option>
          <option value="50">50 km</option>
        </select>
      </div>
      <div className="rf-group">
        <label className="rf-label" htmlFor="f-waste">
          Waste type
        </label>
        <select
          id="f-waste"
          className="rf-input"
          value={filters.wasteType || ""}
          onChange={(e) => set("wasteType", e.target.value)}
        >
          <option value="">All</option>
          {WASTE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="rf-group">
        <label className="rf-label" htmlFor="f-district">
          District
        </label>
        <select
          id="f-district"
          className="rf-input"
          value={filters.district || ""}
          onChange={(e) => set("district", e.target.value)}
        >
          <option value="">All</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div className="rf-group">
        <label className="rf-label" htmlFor="f-type">
          Center type
        </label>
        <select
          id="f-type"
          className="rf-input"
          value={filters.type || ""}
          onChange={(e) => set("type", e.target.value)}
        >
          <option value="">All</option>
          {CENTER_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <label className="filter-check">
        <input
          type="checkbox"
          checked={!!filters.verifiedOnly}
          onChange={(e) => set("verifiedOnly", e.target.checked)}
        />
        Verified only
      </label>
      <label className="filter-check">
        <input
          type="checkbox"
          checked={!!filters.openNow}
          onChange={(e) => set("openNow", e.target.checked)}
        />
        Open now
      </label>
    </div>
  );
}
