import {describe, expect, it} from "vitest";
import {
  calculateAzimuth,
  calculateDistanceMeters,
  calculateFiringSolution,
  formatGridCoordinate,
  interpolateMil,
  WEAPON_REGISTRY
} from "../../src/features/artillery/ballistics-data";

describe("Artillery & Mortar Ballistics Engine", () => {
  it("interpolates L81 Mortar elevation mils accurately", () => {
    // Exact table points
    const table: [number, number][] = [
      [80, 950],
      [200, 800],
      [400, 550],
      [684, 150]
    ];

    expect(interpolateMil(table, 80)).toBe(950);
    expect(interpolateMil(table, 200)).toBe(800);
    expect(interpolateMil(table, 400)).toBe(550);
    expect(interpolateMil(table, 684)).toBe(150);

    // Intermediate point: 300m halfway between 200m(800) and 400m(550) = 675
    expect(interpolateMil(table, 300)).toBe(675);
    // Intermediate point: 140m (ratio 0.5 between 80m and 200m: 950 + 0.5 * -150 = 875)
    expect(interpolateMil(table, 140)).toBe(875);
  });

  it("calculates azimuth bearing in degrees and NATO mils correctly", () => {
    const origin = {x: 0.5, y: 0.5};

    // Directly North (dy < 0, dx = 0)
    const north = calculateAzimuth(origin, {x: 0.5, y: 0.2});
    expect(north.degrees).toBe(0);
    expect(north.mils).toBe(0);

    // Directly East (dx > 0, dy = 0)
    const east = calculateAzimuth(origin, {x: 0.8, y: 0.5});
    expect(east.degrees).toBe(90);
    expect(east.mils).toBe(1600); // 90/360 * 6400 = 1600

    // Directly South (dy > 0, dx = 0)
    const south = calculateAzimuth(origin, {x: 0.5, y: 0.8});
    expect(south.degrees).toBe(180);
    expect(south.mils).toBe(3200); // 180/360 * 6400 = 3200

    // Directly West (dx < 0, dy = 0)
    const west = calculateAzimuth(origin, {x: 0.2, y: 0.5});
    expect(west.degrees).toBe(270);
    expect(west.mils).toBe(4800); // 270/360 * 6400 = 4800
  });

  it("validates physical range boundaries and height delta compensation", () => {
    // Too close (<80m for mortar)
    const tooClose = calculateFiringSolution({
      weaponId: "mortar",
      distanceMeters: 50
    });
    expect(tooClose.valid).toBe(false);
    expect(tooClose.reason).toBe("too_close");

    // Out of range (>697m for mortar)
    const outOfRange = calculateFiringSolution({
      weaponId: "mortar",
      distanceMeters: 800
    });
    expect(outOfRange.valid).toBe(false);
    expect(outOfRange.reason).toBe("out_of_range");

    // Valid firing solution at 400m flat
    const flat = calculateFiringSolution({
      weaponId: "mortar",
      distanceMeters: 400,
      heightDeltaMeters: 0
    });
    expect(flat.valid).toBe(true);
    expect(flat.elevationMil).toBe(550);
    expect(flat.timeOfFlightSeconds).toBeGreaterThan(15);

    // Uphill target (+20m height delta) requires lowering elevation mil
    const uphill = calculateFiringSolution({
      weaponId: "mortar",
      distanceMeters: 400,
      heightDeltaMeters: 20
    });
    expect(uphill.valid).toBe(true);
    expect(uphill.elevationMil).toBeLessThan(flat.elevationMil);
  });

  it("calculates real distances from map coordinates", () => {
    // 16km x 16km map
    // 0.1 of map = 1600 meters
    const p1 = {x: 0.4, y: 0.5};
    const p2 = {x: 0.5, y: 0.5};
    const dist = calculateDistanceMeters(p1, p2, "bakurani");
    expect(dist).toBe(1600);
  });

  it("formats military grid coordinates with keypad notation", () => {
    const center = {x: 0.5, y: 0.5};
    const grid = formatGridCoordinate(center, "bakurani");
    expect(grid).toMatch(/^[A-P][0-9]{1,2}-[1-9]$/);
  });
});
