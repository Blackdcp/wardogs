import {describe, expect, it} from "vitest";
import {beginMapPinch, boundView, defaultView, imagePoint, initialMapState, mapHash, mapPinchView, MAP_DATA_VERSION, readMapHash, transformView} from "../../src/features/maps/map-state";
import {getMapViewerCopy} from "../../src/features/maps/map-viewer-copy";

describe("versioned map annotations", () => {
  it("round trips the map, viewport and plain-text markers", () => {
    const state = {...initialMapState("ozeti"), view: {zoom: 3, x: 0.4, y: 0.65}, markers: [{id: "mtest-1", x: 0.3, y: 0.6, label: "集结 & <FOB>"}]};
    expect(readMapHash(mapHash(state))).toEqual({state, invalid: false});
    expect(state.dataVersion).toBe(MAP_DATA_VERSION);
  });
  it.each([
    {schema: 2}, {dataVersion: "old-data"}, {map: "invented-map"},
    {view: {zoom: 20, x: 0.5, y: 0.5}}, {view: {zoom: 2, x: -1, y: 0.5}},
    {markers: [{id: "m1", x: 1.1, y: 0.5, label: "Bad point"}]},
    {markers: [{id: "m1", x: 0.5, y: 0.5, label: " "}]},
    {markers: [{id: "m1", x: 0.5, y: 0.5, label: "a"}, {id: "m1", x: 0.5, y: 0.5, label: "b"}]},
    {markers: Array.from({length: 17}, (_, i) => ({id: `m${i}`, x: 0.5, y: 0.5, label: "a"}))},
    {unexpected: true},
  ])("rejects incompatible or malformed state %j", (override) => {
    const hash = `#${new URLSearchParams({map: JSON.stringify({...initialMapState(), ...override})})}`;
    expect(readMapHash(hash)).toEqual({invalid: true});
  });
  it("ignores unrelated anchors and rejects invalid or oversized JSON", () => {
    expect(readMapHash("#main-content")).toEqual({invalid: false});
    expect(readMapHash("#map=%7Bno")).toEqual({invalid: true});
    expect(readMapHash(`#map=${"x".repeat(16_000)}`)).toEqual({invalid: true});
  });
});

describe("map viewport geometry", () => {
  it("fits the full square in desktop and portrait viewports", () => {
    expect(boundView({...defaultView, x: 0, y: 1}, 1200, 600)).toEqual(defaultView);
    expect(boundView({...defaultView, x: 0, y: 1}, 375, 600)).toEqual(defaultView);
  });
  it("keeps a pinch anchor under the moving midpoint", () => {
    const view = {zoom: 2, x: 0.5, y: 0.5};
    const from = {x: 180, y: 260}, to = {x: 190, y: 245};
    const after = transformView(view, from, to, 3, 375, 500);
    const a = imagePoint(from, view, 375, 500), b = imagePoint(to, after, 375, 500);
    expect(b.x).toBeCloseTo(a.x); expect(b.y).toBeCloseTo(a.y);
  });
  it("bounds zoom and pan, including zero-size initial layouts", () => {
    expect(boundView({zoom: 100, x: -10, y: 10}, 600, 600)).toEqual({zoom: 6, x: 1 / 12, y: 1 - 1 / 12});
    const view = boundView(defaultView, 0, 0);
    expect(Object.values(view).every(Number.isFinite)).toBe(true);
  });
  it.each([1, 6].flatMap((zoom) => [-10, 10].flatMap((delta) => [0, 1].map((first) => ({zoom, delta, first})))))
  ("does not ratchet boundary zoom during sequential two-finger translation %j", ({zoom, delta, first}) => {
    const points = [{x: 145, y: 250}, {x: 245, y: 250}];
    const start = beginMapPinch({...defaultView, zoom}, points[0], points[1], 390, 500);
    for (let step = 0; step < 10; step++) {
      points[first] = {...points[first], x: points[first].x + delta};
      const intermediate = mapPinchView(start, points[0], points[1], 390, 500);
      expect(intermediate.zoom).toBeGreaterThanOrEqual(1);
      expect(intermediate.zoom).toBeLessThanOrEqual(6);
      const second = 1 - first;
      points[second] = {...points[second], x: points[second].x + delta};
      expect(mapPinchView(start, points[0], points[1], 390, 500).zoom).toBeCloseTo(zoom);
    }
  });
  it.each([{distance: 20, limit: 1}, {distance: 300, limit: 6}])
  ("returns to the start view after zoom overshoots $limit", ({distance, limit}) => {
    const view = {...defaultView, zoom: 3};
    const first = {x: 145, y: 250}, second = {x: 245, y: 250};
    const start = beginMapPinch(view, first, second, 390, 500);
    expect(mapPinchView(start, {x: 195 - distance / 2, y: 250}, {x: 195 + distance / 2, y: 250}, 390, 500).zoom).toBe(limit);
    expect(mapPinchView(start, first, second, 390, 500)).toEqual(view);
  });
  it("rebases a new pinch after continuing with one finger", () => {
    const first = {x: 145, y: 250}, second = {x: 245, y: 250};
    const start = beginMapPinch({...defaultView, zoom: 2}, first, second, 390, 500);
    const pinched = mapPinchView(start, {x: 120, y: 250}, {x: 270, y: 250}, 390, 500);
    const dragged = transformView(pinched, {x: 120, y: 250}, {x: 130, y: 260}, pinched.zoom, 390, 500);
    const renewed = beginMapPinch(dragged, {x: 130, y: 260}, second, 390, 500);
    expect(mapPinchView(renewed, {x: 130, y: 260}, second, 390, 500)).toEqual(dragged);
    expect(mapPinchView(renewed, {x: 140, y: 260}, {x: 255, y: 250}, 390, 500).zoom).toBeCloseTo(dragged.zoom);
  });
  it("keeps coincident touches finite without changing the starting zoom", () => {
    const point = {x: 195, y: 250};
    const start = beginMapPinch({...defaultView, zoom: 3}, point, point, 390, 500);
    expect(mapPinchView(start, point, point, 390, 500)).toEqual(start.view);
    expect(Object.values(mapPinchView(start, point, {x: 195.1, y: 250}, 390, 500)).every(Number.isFinite)).toBe(true);
  });
  it("offers explicit copy fallbacks without extending global locales", () => {
    for (const locale of ["en", "ja", "zh-cn", "zh-tw", "pl", "unknown"]) {
      const copy = getMapViewerCopy(locale);
      expect(copy.measurement.length).toBeGreaterThan(10);
      expect(copy.invalid.length).toBeGreaterThan(10);
    }
  });
});
