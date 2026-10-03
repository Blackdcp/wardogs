import {describe, expect, it} from "vitest";
import {
  calculateAzimuth,
  calculateDistanceMeters,
  calculateFiringSolution,
  formatGridCoordinate,
  getWeaponRangeEnvelope,
  interpolateMil,
  toGridColumnLabel
} from "../../src/features/artillery/ballistics-data";
import {
  MORTAR_81MM_BALLISTICS,
  ARTILLERY_155MM_BALLISTICS
} from "../../src/features/maps/map-tactical-data";

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

  it("wraps a near-north map bearing when mil rounding crosses a full turn", () => {
    const bearing = calculateAzimuth({x: 0.5, y: 0.5}, {x: 0.499999, y: 0.2});
    expect(bearing.degrees).toBeLessThan(360);
    expect(bearing.mils).toBe(0);
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
    const tooFar = calculateFiringSolution({
      weaponId: "mortar",
      distanceMeters: 750
    });
    expect(tooFar.valid).toBe(false);
    expect(tooFar.reason).toBe("out_of_range");

    // Valid flat ground solution
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

  it("formats 32-column maps beyond column 26 without collision on Z", () => {
    expect(toGridColumnLabel(0)).toBe("A");
    expect(toGridColumnLabel(25)).toBe("Z");
    expect(toGridColumnLabel(26)).toBe("AA");
    expect(toGridColumnLabel(27)).toBe("AB");
    expect(toGridColumnLabel(31)).toBe("AF");

    // Ozeti has 32 columns; check coordinates on cols 25, 26, 31
    const pZ = {x: 25.1 / 32, y: 0.1};
    const pAA = {x: 26.1 / 32, y: 0.1};
    const pAF = {x: 31.1 / 32, y: 0.1};

    expect(formatGridCoordinate(pZ, "ozeti")).toMatch(/^Z[0-9]{1,2}-[1-9]$/);
    expect(formatGridCoordinate(pAA, "ozeti")).toMatch(/^AA[0-9]{1,2}-[1-9]$/);
    expect(formatGridCoordinate(pAF, "ozeti")).toMatch(/^AF[0-9]{1,2}-[1-9]$/);
  });

  it("provides correct physical range envelopes for all weapon modes", () => {
    expect(getWeaponRangeEnvelope("mortar", "single")).toEqual({
      minRangeMeters: 80,
      maxRangeMeters: 697
    });
    expect(getWeaponRangeEnvelope("sph2", "high")).toEqual({
      minRangeMeters: 735,
      maxRangeMeters: 2629
    });
    expect(getWeaponRangeEnvelope("sph2", "low")).toEqual({
      minRangeMeters: 1181,
      maxRangeMeters: 2629
    });
  });

  it("guarantees 100% parity between map tactical table and calculator ballistics engine", () => {
    // Mortar table verification
    for (const entry of MORTAR_81MM_BALLISTICS) {
      const sol = calculateFiringSolution({
        weaponId: "mortar",
        mode: "single",
        distanceMeters: entry.range,
        heightDeltaMeters: 0
      });
      expect(sol.valid).toBe(true);
      expect(entry.mils).toBe(sol.elevationMil);
      expect(entry.tof).toBe(sol.timeOfFlightSeconds);
    }

    // SPH-2 table verification (2500m must be 811 mils, 48.5s)
    const sph2_2500 = ARTILLERY_155MM_BALLISTICS.find((r) => r.range === 2500);
    expect(sph2_2500).toBeDefined();
    expect(sph2_2500?.mils).toBe(811);
    expect(sph2_2500?.tof).toBe(48.5);

    for (const entry of ARTILLERY_155MM_BALLISTICS) {
      const sol = calculateFiringSolution({
        weaponId: "sph2",
        mode: "high",
        distanceMeters: entry.range,
        heightDeltaMeters: 0
      });
      expect(sol.valid).toBe(true);
      expect(entry.mils).toBe(sol.elevationMil);
      expect(entry.tof).toBe(sol.timeOfFlightSeconds);
    }
  });

  it("verifies SPH-2 steep ballistic drop in extreme range and radius scaling", () => {
    // 2500m to 2600m delta check (must be exactly 103 mils)
    const sol2500 = calculateFiringSolution({weaponId: "sph2", mode: "high", distanceMeters: 2500, heightDeltaMeters: 0});
    const sol2600 = calculateFiringSolution({weaponId: "sph2", mode: "high", distanceMeters: 2600, heightDeltaMeters: 0});
    expect(sol2500.elevationMil - sol2600.elevationMil).toBe(103);

    // Map circle radius scaling (Bakurani 16km size = 16000m)
    const bakuraniSize = 16000;
    const lowEnvelope = getWeaponRangeEnvelope("sph2", "low");
    const highEnvelope = getWeaponRangeEnvelope("sph2", "high");

    const lowMinRadius = (lowEnvelope.minRangeMeters / bakuraniSize) * 100;
    const highMinRadius = (highEnvelope.minRangeMeters / bakuraniSize) * 100;

    expect(lowMinRadius).toBeCloseTo(7.38125, 4);
    expect(highMinRadius).toBeCloseTo(4.59375, 4);
  });
});
