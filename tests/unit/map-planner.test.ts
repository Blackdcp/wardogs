import {describe, expect, it} from "vitest";
import {initialMapState, mapHash, readMapHash} from "../../src/features/maps/map-state";
import {
  DEFAULT_TACTICAL_LAYERS,
  buildCalculatorSearch,
  calculateRouteDistanceMeters,
  calculateTacticalRange,
  initialTacticalPlan,
  MAX_ROUTE_POINTS,
  placeRangePoint,
  placeRoutePoint,
  setTacticalMissionPoint,
  tacticalPlanSchema,
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

  it("builds a multi-point route and preserves every point when another click exceeds the limit", () => {
    let plan = initialTacticalPlan("bakurani");
    for (const point of [{x: 0.1, y: 0.1}, {x: 0.2, y: 0.1}, {x: 0.2, y: 0.2}]) {
      plan = placeRoutePoint(plan, point);
    }

    expect(plan.route.points).toHaveLength(3);
    expect(calculateRouteDistanceMeters(plan.route.points, "bakurani")).toBe(3276.8);

    for (const point of Array.from({length: 14}, (_, index) => ({x: index / 20, y: 0.5}))) {
      plan = placeRoutePoint(plan, point);
    }
    expect(plan.route.points).toHaveLength(MAX_ROUTE_POINTS);
    const saved = structuredClone(plan);
    expect(placeRoutePoint(plan, {x: 0.7, y: 0.5})).toBe(plan);
    expect(plan).toEqual(saved);
    // Undo makes room without deleting the rest of the route.
    const shortened = {...plan, route: {...plan.route, points: plan.route.points.slice(0, -1)}};
    expect(placeRoutePoint(shortened, {x: 0.7, y: 0.5}).route.points).toEqual([...saved.route.points.slice(0, -1), {x: 0.7, y: 0.5}]);
  });

  it("requires an explicitly chosen gun before a marker can become the target", () => {
    const empty = initialTacticalPlan("bakurani");
    const gun = {x: .2, y: .3}, target = {x: .21, y: .3};
    expect(setTacticalMissionPoint(empty, target, "target")).toBe(empty);
    expect(calculateTacticalRange(empty, "bakurani")).toBeUndefined();
    const ready = setTacticalMissionPoint(setTacticalMissionPoint(empty, gun, "gun"), target, "target");
    expect(ready.fireSupport.points).toEqual([gun, target]);
    expect(setTacticalMissionPoint(ready, {x: .15, y: .3}, "gun").fireSupport.points).toEqual([{x: .15, y: .3}, target]);
    expect(setTacticalMissionPoint(ready, {x: NaN, y: .3}, "target")).toBe(ready);
  });

  it("makes an edited route or fire mission visible after its layer was hidden", () => {
    const hidden = toggleTacticalLayer(toggleTacticalLayer(initialTacticalPlan("bakurani"), "routes", false), "fire-support", false);
    expect(placeRoutePoint(hidden, {x: .2, y: .3}).layers.find(({id}) => id === "routes")?.enabled).toBe(true);
    expect(placeRangePoint(hidden, {x: .2, y: .3}).layers.find(({id}) => id === "fire-support")?.enabled).toBe(true);
    expect(setTacticalMissionPoint(hidden, {x: .2, y: .3}, "gun").layers.find(({id}) => id === "fire-support")?.enabled).toBe(true);
    expect(hidden.layers.find(({id}) => id === "routes")?.enabled).toBe(false);
  });

  it("accepts marker and community POI actions while keeping shared coordinates free of record metadata", () => {
    const empty = initialTacticalPlan("bakurani");
    const marker = {id: "m1", label: "Chosen gun", kind: "fob", x: .4, y: .5};
    const poi = {id: "bakurani-tower-1", kind: "tower", map: "bakurani", number: 1, x: .42, y: .5};
    const plan = setTacticalMissionPoint(setTacticalMissionPoint(placeRoutePoint(placeRoutePoint(empty, marker), poi), marker, "gun"), poi, "target");
    expect(plan.route.points).toEqual([{x: .4, y: .5}, {x: .42, y: .5}]);
    expect(plan.fireSupport.points).toEqual(plan.route.points);
    expect(readTacticalPlanHash(tacticalPlanHash("#", plan), "bakurani").state).toEqual(plan);
    // An untrusted file must not smuggle arbitrary fields into stored points.
    expect(tacticalPlanSchema.safeParse({...plan, route: {...plan.route, points: [marker]}}).success).toBe(false);
  });

  it.each(["constructor", "__proto__", "toString"])("rejects inherited weapon key %s without throwing on an untrusted plan", weaponId => {
    const plan = initialTacticalPlan("bakurani");
    expect(tacticalPlanSchema.safeParse({...plan, fireSupport: {...plan.fireSupport, weaponId}}).success).toBe(false);
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
