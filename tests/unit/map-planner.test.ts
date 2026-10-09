import {describe, expect, it} from "vitest";
import {initialMapState, mapHash, readMapHash} from "../../src/features/maps/map-state";
import {
  DEFAULT_TACTICAL_LAYERS,
  buildCalculatorSearch,
  calculateRouteDistanceMeters,
  calculateTacticalRange,
  initialTacticalPlan,
  placeRangePoint,
  placeRoutePoint,
  readTacticalPlanHash,
  tacticalPlanHash,
  toggleTacticalLayer,
} from "../../src/features/maps/map-planner";

describe("map tactical planner", () => {
  it("keeps competitor-grade layers explicit, bounded and shareable without losing the original map hash", () => {
    const plan = toggleTacticalLayer(initialTacticalPlan("bakurani"), "fob", false);
    expect(DEFAULT_TACTICAL_LAYERS.map(({id}) => id)).toEqual([
      "objectives", "fob", "supply", "routes", "fire-support", "air", "intel",
    ]);
    expect(plan.layers.find(({id}) => id === "fob")?.enabled).toBe(false);

    const map = {...initialMapState("bakurani"), markers: [{id: "m1", x: 0.2, y: 0.4, label: "FOB Alpha"}]};
    const hash = tacticalPlanHash(mapHash(map), plan);

    expect(readMapHash(hash)).toEqual({state: map, invalid: false});
    expect(readTacticalPlanHash(hash, "bakurani")).toEqual({state: plan, invalid: false});
  });

  it("builds a multi-point route with total distance and restarts when the route is full", () => {
    let plan = initialTacticalPlan("bakurani");
    for (const point of [{x: 0.1, y: 0.1}, {x: 0.2, y: 0.1}, {x: 0.2, y: 0.2}]) {
      plan = placeRoutePoint(plan, point);
    }

    expect(plan.route.points).toHaveLength(3);
    expect(calculateRouteDistanceMeters(plan.route.points, "bakurani")).toBe(3276.8);

    for (const point of Array.from({length: 15}, (_, index) => ({x: index / 20, y: 0.5}))) {
      plan = placeRoutePoint(plan, point);
    }
    expect(plan.route.points).toHaveLength(1);
    expect(plan.route.points[0]).toEqual({x: 0.7, y: 0.5});
  });

  it("turns two map clicks into a calculator-ready firing solution and URL query", () => {
    let plan = initialTacticalPlan("bakurani");
    plan = {...plan, fireSupport: {...plan.fireSupport, weaponId: "mortar", mode: "single"}};
    plan = placeRangePoint(plan, {x: 0.5, y: 0.5});
    plan = placeRangePoint(plan, {x: 0.52, y: 0.5});

    const range = calculateTacticalRange(plan, "bakurani");
    expect(range?.solution.valid).toBe(true);
    expect(range?.distanceMeters).toBe(327.7);
    expect(range?.azimuthDegrees).toBe(90);
    expect(range?.gunGrid).toMatch(/^I9-/);
    expect(range?.targetGrid).toMatch(/^I9-/);

    const query = buildCalculatorSearch(plan, "bakurani");
    expect(query).toContain("map=bakurani");
    expect(query).toContain("weapon=mortar");
    expect(query).toContain("distance=327.7");
    expect(query).toContain("azimuth=90");
  });

  it("rejects corrupt or mismatched tactical plan fragments", () => {
    expect(readTacticalPlanHash("#plan=%7Bbroken", "bakurani")).toEqual({invalid: true});
    const hash = tacticalPlanHash("#", initialTacticalPlan("ozeti"));
    expect(readTacticalPlanHash(hash, "bakurani")).toEqual({invalid: true});
    expect(readTacticalPlanHash("#main-content", "bakurani")).toEqual({invalid: false});
  });
});
