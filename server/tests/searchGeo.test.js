import { distanceKm, kmToMeters } from "../services/recycling/geolocationService.js";
import { escapeRegex, buildGuideSearchFilter } from "../services/recycling/searchService.js";

describe("geolocationService", () => {
  test("kmToMeters converts kilometres", () => {
    expect(kmToMeters(10)).toBe(10000);
    expect(kmToMeters(0)).toBe(10000); // default
  });

  test("distanceKm roughly matches Colombo–nearby", () => {
    const d = distanceKm(6.9271, 79.8612, 6.891, 79.865);
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThan(10);
  });
});

describe("searchService", () => {
  test("escapeRegex escapes special chars", () => {
    expect(escapeRegex("a+b")).toBe("a\\+b");
  });

  test("buildGuideSearchFilter includes partial match", () => {
    const f = buildGuideSearchFilter("batt");
    expect(f.status).toBe("published");
    expect(f.$or).toBeTruthy();
  });
});
