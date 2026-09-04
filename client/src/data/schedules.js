/**
 * Sample municipal collection schedules by district (hackathon MVP).
 * Pattern rotates by district index so each area gets a plausible week.
 */
import { DISTRICTS } from "./districts.js";

const PATTERNS = [
  [
    { day: "Monday", streams: ["Organic / food waste", "Residual"] },
    { day: "Wednesday", streams: ["Plastic & metal"] },
    { day: "Friday", streams: ["Paper & cardboard"] },
    { day: "Saturday", streams: ["Organic / food waste"] },
  ],
  [
    { day: "Tuesday", streams: ["Organic / food waste", "Residual"] },
    { day: "Thursday", streams: ["Plastic & metal", "Glass"] },
    { day: "Saturday", streams: ["Paper & cardboard", "Organic / food waste"] },
  ],
  [
    { day: "Monday", streams: ["Residual"] },
    { day: "Wednesday", streams: ["Organic / food waste"] },
    { day: "Friday", streams: ["Recyclables (mixed)"] },
    { day: "Sunday", streams: ["Garden waste (by request)"] },
  ],
];

export function getScheduleForDistrict(district) {
  const idx = DISTRICTS.indexOf(district);
  if (idx < 0) return PATTERNS[0];
  return PATTERNS[idx % PATTERNS.length];
}
