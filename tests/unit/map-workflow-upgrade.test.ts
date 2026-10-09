import {describe, expect, it} from "vitest";
import {initialMapState, mapIds, mapHash, readMapHash} from "../../src/features/maps/map-state";
import {initialMeasurement, measureMap, measurementHash, readMeasurementHash, resolveMapDistance, type MapMeasurement} from "../../src/features/maps/map-measurement";
import {initialTacticalPlan, calculateTacticalRange, calculateRouteDistanceMeters, buildCalculatorSearch, exportMapPlan, importMapPlan, tacticalPlanHash, readTacticalPlanHash} from "../../src/features/maps/map-planner";
import {decodeCalculatorSearch} from "../../src/features/artillery/artillery-mission";
import {communityPois, clusterCommunityPois} from "../../src/features/maps/map-community-pois";
import {getMapPlannerCopy} from "../../src/features/maps/map-planner-copy";
import {getArtilleryMissionCopy} from "../../src/features/artillery/artillery-mission-copy";

describe("one map scale for every workflow", () => {
  it.each(mapIds)("keeps ruler, route, range, exported file and shared calculator aligned on %s", (map) => {
    const points = [{x: .25, y: .25}, {x: .75, y: .25}];
    const ruler: MapMeasurement = {...initialMeasurement(map), points, reference: points,
      calibration: {provenance: "user-supplied", distanceMeters: 500, distanceErrorMeters: 10, pointErrorPixels: 2, source: "Synthetic test", build: "test"}};
    const plan = {...initialTacticalPlan(map), route: {label: "Test", points}, fireSupport: {points, weaponId: "mortar" as const, mode: "single" as const}};
    expect(measureMap(ruler)?.meters).toBe(500);
    expect(resolveMapDistance(points, map, ruler)?.meters).toBe(500);
    expect(calculateRouteDistanceMeters(points, map, ruler)).toBe(500);
    const range = calculateTacticalRange(plan, map, ruler)!;
    expect(range.distanceMeters).toBe(500);
    expect(range.lowerMeters).toBeLessThan(500);
    expect(range.upperMeters).toBeGreaterThan(500);
    const imported = decodeCalculatorSearch(buildCalculatorSearch(plan, map, ruler));
    expect(imported).toMatchObject({distanceMeters: 500, mapScaleMeters: 1000, scaleSource: "user-supplied"});
    const bundle = {format: "wardogs-map-plan" as const, version: 1 as const, map: {...initialMapState(map), markers: [{id: "m1", x: .2, y: .3, label: "Team <A>", kind: "fob" as const}]}, ruler, plan};
    expect(importMapPlan(exportMapPlan(bundle))).toEqual(bundle);
    const hash = tacticalPlanHash(measurementHash(mapHash(bundle.map), ruler), plan);
    expect(readMapHash(hash).state).toEqual(bundle.map);
    expect(readMeasurementHash(hash, map).state).toEqual(ruler);
    expect(readTacticalPlanHash(hash, map).state).toEqual(plan);
  });
  it("uses a named nominal scale until calibrated and never applies another map's calibration", () => {
    const points = [{x: 0, y: 0}, {x: 1, y: 0}];
    for (const map of mapIds) expect(resolveMapDistance(points, map)).toMatchObject({meters: 16384, provenance: "nominal", lowerMeters: undefined});
    expect(resolveMapDistance([{x: -1, y: 0}, points[1]], "bakurani")).toBeUndefined();
  });
});

describe("bounded tactical files and community data", () => {
  it("rejects wrong maps, versions, types, unknown fields, oversized files and invalid modes", () => {
    const file = {format: "wardogs-map-plan", version: 1, map: initialMapState(), ruler: initialMeasurement("bakurani"), plan: initialTacticalPlan("bakurani")};
    expect(importMapPlan(JSON.stringify({...file, ruler: initialMeasurement("ozeti")}))).toBeUndefined();
    expect(importMapPlan(JSON.stringify({...file, version: 9}))).toBeUndefined();
    expect(importMapPlan(JSON.stringify({...file, execute: "alert(1)"}))).toBeUndefined();
    expect(importMapPlan(JSON.stringify({...file, plan: {...file.plan, fireSupport: {points: [], weaponId: "mortar", mode: "low"}}}))).toBeUndefined();
    expect(importMapPlan("x".repeat(64001))).toBeUndefined();
  });
  it("keeps distinct sourced community coordinates within the complete basemap", () => {
    expect(communityPois).toHaveLength(36);
    expect(new Set(communityPois.map(({id}) => id)).size).toBe(36);
    for (const poi of communityPois) {
      expect(poi.x).toBeGreaterThanOrEqual(0); expect(poi.x).toBeLessThanOrEqual(1);
      expect(poi.y).toBeGreaterThanOrEqual(0); expect(poi.y).toBeLessThanOrEqual(1);
    }
    // Source Bakurani Tower 4: 8361/7284 meter coordinates, tileBounds -0.03/-0.01 to 163.81/163.83.
    expect(communityPois.find(({id}) => id === "bakurani-tower-1")?.x).toBeCloseTo((83.61 + .03) / 163.84, 7);
  });
  it("clusters nearby POIs at overview scale and separates towers at tactical zoom", () => {
    const towers = communityPois.filter((poi) => poi.map === "bakurani" && poi.kind === "tower");
    expect(clusterCommunityPois(towers, 300).length).toBeLessThan(towers.length);
    expect(clusterCommunityPois(towers, 3600)).toHaveLength(towers.length);
  });
  it.each(["zh-cn", "zh-tw", "ja", "de", "ru", "pt-br", "pl"])("supplies all map and spotting UI in %s", (locale) => {
    for (const getter of [getMapPlannerCopy, getArtilleryMissionCopy]) {
      const english = getter("en"), translated = getter(locale);
      expect(Object.keys(translated)).toEqual(Object.keys(english));
      for (const [key, text] of Object.entries(translated)) expect(text.trim(), key).not.toBe("");
      expect(translated).not.toEqual(english);
    }
  });
});
