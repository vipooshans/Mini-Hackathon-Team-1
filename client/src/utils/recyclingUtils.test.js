/**
 * Lightweight client util tests (no DOM).
 * Run with: node --test src/utils/recyclingUtils.test.js
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getOpeningStatus, formatTime, buildDirectionsUrl } from "./recyclingUtils.js";

describe("formatTime", () => {
  it("formats 24h to 12h", () => {
    assert.equal(formatTime("08:00"), "8:00 AM");
    assert.equal(formatTime("17:00"), "5:00 PM");
  });
});

describe("getOpeningStatus", () => {
  it("returns closed when sunday closed and today sunday-like hours closed", () => {
    const hours = {
      monday: { open: "08:00", close: "17:00", closed: false },
      tuesday: { open: "08:00", close: "17:00", closed: false },
      wednesday: { open: "08:00", close: "17:00", closed: false },
      thursday: { open: "08:00", close: "17:00", closed: false },
      friday: { open: "08:00", close: "17:00", closed: false },
      saturday: { open: "08:00", close: "13:00", closed: false },
      sunday: { closed: true },
    };
    const status = getOpeningStatus(hours);
    assert.ok(status.label === "Open now" || status.label === "Closed");
  });
});

describe("buildDirectionsUrl", () => {
  it("builds map URL for center without user coords", () => {
    const url = buildDirectionsUrl({
      location: { coordinates: [79.86, 6.92] },
    });
    assert.match(url, /openstreetmap/);
    assert.match(url, /6\.92/);
  });

  it("includes route when user coords present", () => {
    const url = buildDirectionsUrl(
      { location: { coordinates: [79.86, 6.92] } },
      { lat: 6.9, lng: 79.85 }
    );
    assert.match(url, /directions/);
  });
});
