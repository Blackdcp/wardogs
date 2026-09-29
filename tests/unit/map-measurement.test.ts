import {describe, expect, it} from "vitest";
import {BASEMAP_SIDE_PX, imageDistance, initialMeasurement, mapMeasurementSchema, measureMap, measurementHash, placeMeasurementPoint, readMeasurementHash, type MapMeasurement} from "../../src/features/maps/map-measurement";
import {boundView, imagePoint, initialMapState, mapHash, readMapHash, viewportPoint} from "../../src/features/maps/map-state";
import {getMapMeasurementCopy} from "../../src/features/maps/map-measurement-copy";

it.each(["zh-cn", "de", "ru", "pt-br", "ja"])("fully localizes new map controls and statuses for %s", (locale) => {
  const english = getMapMeasurementCopy("en");
  const copy = getMapMeasurementCopy(locale);
  expect(Object.keys(copy).sort()).toEqual(Object.keys(english).sort());
  for (const key of Object.keys(english) as (keyof typeof english)[]) {
    expect(copy[key].trim().length, key).toBeGreaterThan(0);
    expect(copy[key], key).not.toBe(english[key]);
  }
});

function calibrated(): MapMeasurement {
  return {...initialMeasurement("bakurani"), reference: [{x: 0, y: 0}, {x: 0.5, y: 0}], points: [{x: 0.1, y: 0.1}, {x: 0.4, y: 0.5}],
    calibration: {provenance: "user-supplied", distanceMeters: 100, distanceErrorMeters: 2, pointErrorPixels: 1, source: "Synthetic unit test, not game data", build: "test-only"}};
}

describe("image-space distance and user calibration", () => {
  it("has no default scale, points, north or game coordinates", () => {
    const state = initialMeasurement("ozeti");
    expect(measureMap(state)).toBeUndefined();
    state.points = [{x: 0, y: 0}, {x: 0.3, y: 0.4}];
    expect(measureMap(state)).toEqual({pixels: BASEMAP_SIDE_PX / 2});
    expect(state.calibration).toBeUndefined();
  });
  it("uses Euclidean image distances in any direction", () => {
    expect(imageDistance([{x: 0, y: 0}, {x: 1, y: 1}])).toBeCloseTo(Math.SQRT2 * BASEMAP_SIDE_PX);
    const points = calibrated().points;
    expect(imageDistance(points)).toBe(imageDistance([...points].reverse()));
    expect(imageDistance([points[0], points[0]])).toBe(0);
  });
  it("derives a scale only from supplied reference data and conservative endpoint bounds", () => {
    const result = measureMap(calibrated())!;
    expect(result.meters).toBeCloseTo(100);
    expect(result.lowerMeters).toBeCloseTo(1022 / 1026 * 98);
    expect(result.upperMeters).toBeCloseTo(1026 / 1022 * 102);
  });
  it("allows explicit zero error without assuming omitted errors are zero", () => {
    const state = calibrated();
    state.calibration!.distanceErrorMeters = 0;
    state.calibration!.pointErrorPixels = 0;
    expect(measureMap(state)?.lowerMeters).toBeCloseTo(100);
    expect(measureMap(state)?.upperMeters).toBeCloseTo(100);
    expect(mapMeasurementSchema.safeParse({...state, calibration: {...state.calibration, pointErrorPixels: undefined}}).success).toBe(false);
  });
  it("does not create negative lower bounds at overlapping endpoints", () => {
    const state = calibrated();
    state.points = [state.points[0], state.points[0]];
    const result = measureMap(state)!;
    expect(result.meters).toBe(0);
    expect(result.lowerMeters).toBe(0);
    expect(result.upperMeters).toBeGreaterThan(0);
  });
  it.each([
    {distanceMeters: 0}, {distanceMeters: -1}, {distanceMeters: Infinity}, {distanceMeters: 1e100},
    {distanceErrorMeters: -1}, {distanceErrorMeters: 100}, {pointErrorPixels: NaN}, {pointErrorPixels: 512},
    {source: " "}, {build: ""}, {source: "x".repeat(241)}, {build: "x".repeat(81)}, {provenance: "official"}, {gravity: 9.81},
  ])("rejects invalid or falsely verified calibration %j", (override) => {
    const state = calibrated();
    expect(mapMeasurementSchema.safeParse({...state, calibration: {...state.calibration, ...override}}).success).toBe(false);
  });
  it.each([{reference: []}, {reference: [{x: 0, y: 0}]}, {reference: [{x: 0, y: 0}, {x: 0, y: 0}]}])("rejects degenerate reference segments %j", ({reference}) => {
    expect(measureMap({...calibrated(), reference})).toBeUndefined();
  });
  it("keeps measurement and reference endpoints independent, restarting on a third point", () => {
    let state = calibrated();
    state = placeMeasurementPoint(state, "measure", {x: 0.7, y: 0.8});
    expect(state.points).toEqual([{x: 0.7, y: 0.8}]);
    expect(state.calibration).toBeDefined();
    state = placeMeasurementPoint(state, "calibrate", {x: 0.2, y: 0.3});
    expect(state.reference).toEqual([{x: 0.2, y: 0.3}]);
    expect(state.calibration).toBeUndefined();
    expect(placeMeasurementPoint(state, "measure", {x: -0.01, y: 0.5})).toBe(state);
    expect(placeMeasurementPoint(state, "measure", {x: NaN, y: 0.5})).toBe(state);
  });
  it.each([{width: 1200, height: 600}, {width: 375, height: 600}, {width: 0, height: 0}])
  ("is invariant under viewport, zoom and pan %j", ({width, height}) => {
    const points = calibrated().points;
    for (const zoom of [1, 1.35, 3, 6]) {
      const view = boundView({zoom, x: 0.4, y: 0.6}, width, height);
      const restored = points.map((point) => imagePoint(viewportPoint(point, view, width, height), view, width, height));
      expect(imageDistance(restored)).toBeCloseTo(imageDistance(points)!);
    }
  });
});

describe("backward-compatible ruler sharing", () => {
  it("preserves the original map fragment including manual markers", () => {
    const map = {...initialMapState(), markers: [{id: "m1", x: 0.2, y: 0.4, label: "Rally"}]};
    const measurement = calibrated();
    measurement.calibration!.source = "用户测量 & <not HTML>";
    const hash = measurementHash(mapHash(map), measurement);
    expect(readMapHash(hash)).toEqual({state: map, invalid: false});
    expect(readMeasurementHash(hash, map.map)).toEqual({state: measurement, invalid: false});
    expect(readMeasurementHash(mapHash(map), map.map)).toEqual({invalid: false});
  });
  it.each([{map: "ozeti"}, {dataVersion: "old"}, {schema: 2}, {points: [{x: 1.01, y: 0}]}])("rejects mismatched or corrupt ruler state %j", (change) => {
    const hash = `#${new URLSearchParams({ruler: JSON.stringify({...calibrated(), ...change})})}`;
    expect(readMeasurementHash(hash, "bakurani")).toEqual({invalid: true});
  });
  it("rejects malformed/oversized links and ignores unrelated anchors", () => {
    expect(readMeasurementHash("#ruler=%7Bno", "bakurani")).toEqual({invalid: true});
    expect(readMeasurementHash(`#ruler=${"a".repeat(16000)}`, "bakurani")).toEqual({invalid: true});
    expect(readMeasurementHash("#main-content", "bakurani")).toEqual({invalid: false});
  });
});
