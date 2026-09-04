/**
 * Opening hours helpers for Asia/Colombo.
 */

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function getColomboParts(date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Colombo",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value])
  );
  return {
    weekday: (parts.weekday || "").toLowerCase(),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

function toMinutes(hhmm) {
  if (!hhmm || !String(hhmm).includes(":")) return null;
  const [h, m] = String(hhmm).split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

/**
 * @returns {{ isOpen: boolean, label: string, nextOpenLabel: string|null }}
 */
export function getOpeningStatus(openingHours) {
  if (!openingHours) {
    return { isOpen: false, label: "Hours unavailable", nextOpenLabel: null };
  }

  const { weekday, hour, minute } = getColomboParts();
  const today = openingHours[weekday];
  const nowMins = hour * 60 + minute;

  if (today && !today.closed) {
    const openM = toMinutes(today.open);
    const closeM = toMinutes(today.close);
    if (openM != null && closeM != null && nowMins >= openM && nowMins < closeM) {
      return { isOpen: true, label: "Open now", nextOpenLabel: null };
    }
  }

  // Find next open day
  const startIdx = DAY_KEYS.indexOf(weekday);
  for (let i = 1; i <= 7; i++) {
    const key = DAY_KEYS[(startIdx + i) % 7];
    const day = openingHours[key];
    if (day && !day.closed && day.open) {
      const when = i === 1 ? "tomorrow" : key.charAt(0).toUpperCase() + key.slice(1);
      const timeLabel = formatTime(day.open);
      return {
        isOpen: false,
        label: "Closed",
        nextOpenLabel: `Opens ${when} at ${timeLabel}`,
      };
    }
  }

  return { isOpen: false, label: "Closed", nextOpenLabel: null };
}

export function formatTime(hhmm) {
  const mins = toMinutes(hhmm);
  if (mins == null) return hhmm || "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function buildDirectionsUrl(center, userCoords) {
  const coords = center?.location?.coordinates;
  if (!coords || coords.length !== 2) return null;
  const [lng, lat] = coords;
  if (userCoords?.lat != null && userCoords?.lng != null) {
    return `https://www.openstreetmap.org/directions?engine=fossaris_osrm_car&route=${userCoords.lat}%2C${userCoords.lng}%3B${lat}%2C${lng}`;
  }
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}

export const WASTE_CATEGORIES = [
  "General Waste",
  "Plastic",
  "Paper",
  "Cardboard",
  "Glass",
  "Metal",
  "Organic Waste",
  "E-Waste",
  "Batteries",
  "Textiles",
  "Construction Waste",
  "Bulky Waste",
  "Hazardous Household Waste",
];

export const CENTER_TYPES = [
  "Recycling Center",
  "E-Waste Center",
  "Compost Facility",
  "Collection Point",
  "Donation Center",
  "Scrap Collector",
];

export const POPULAR_CATEGORIES = [
  { key: "Plastic", label: "Plastic", icon: "♻️" },
  { key: "Paper", label: "Paper", icon: "📄" },
  { key: "Glass", label: "Glass", icon: "🍾" },
  { key: "Metal", label: "Metal", icon: "🔩" },
  { key: "Batteries", label: "Batteries", icon: "🔋" },
  { key: "E-Waste", label: "E-Waste", icon: "💻" },
  { key: "Organic Waste", label: "Organic", icon: "🍂" },
  { key: "Textiles", label: "Textile", icon: "👕" },
  { key: "Bulky Waste", label: "Bulky Waste", icon: "🛋️" },
];
