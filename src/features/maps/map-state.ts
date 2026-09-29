import {z} from "zod";

export const MAP_DATA_VERSION = "2026-09-27-v1";
export const mapIds = ["bakurani", "ozeti", "zestafona"] as const;
export type MapId = (typeof mapIds)[number];
export const mapNames: Record<MapId, string> = {bakurani: "Bakurani", ozeti: "Ozeti", zestafona: "Zestafona"};
export const MAX_MARKERS = 16;
const unit = z.number().finite().min(0).max(1);
const markerSchema = z.object({
  id: z.string().regex(/^m[0-9a-z-]{1,40}$/), x: unit, y: unit,
  label: z.string().trim().min(1).max(60),
}).strict();
export const mapStateSchema = z.object({
  schema: z.literal(1),
  dataVersion: z.literal(MAP_DATA_VERSION),
  map: z.enum(mapIds),
  view: z.object({zoom: z.number().finite().min(1).max(6), x: unit, y: unit}).strict(),
  markers: z.array(markerSchema).max(MAX_MARKERS).refine((markers) => new Set(markers.map(({id}) => id)).size === markers.length),
}).strict();
export type MapState = z.infer<typeof mapStateSchema>;
export type MapView = MapState["view"];
export type MapMarker = MapState["markers"][number];
export type Point = {x: number; y: number};
export const defaultView: MapView = {zoom: 1, x: 0.5, y: 0.5};

export function initialMapState(map: MapId = "bakurani"): MapState {
  return {schema: 1, dataVersion: MAP_DATA_VERSION, map, view: {...defaultView}, markers: []};
}

export function readMapHash(hash: string): {state?: MapState; invalid: boolean} {
  if (hash.length > 16_000) return {invalid: true};
  const value = new URLSearchParams(hash.replace(/^#/, "")).get("map");
  if (!value) return {invalid: false};
  try {
    const parsed = mapStateSchema.safeParse(JSON.parse(value));
    return parsed.success ? {state: parsed.data, invalid: false} : {invalid: true};
  } catch { return {invalid: true}; }
}

export function mapHash(state: MapState) {
  return `#${new URLSearchParams({map: JSON.stringify(mapStateSchema.parse(state))})}`;
}

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function boundView(view: MapView, width: number, height: number): MapView {
  const zoom = clamp(view.zoom, 1, 6);
  const size = Math.max(1, Math.min(width, height)) * zoom;
  const marginX = Math.min(0.5, width / (2 * size));
  const marginY = Math.min(0.5, height / (2 * size));
  return {zoom, x: clamp(view.x, marginX, 1 - marginX), y: clamp(view.y, marginY, 1 - marginY)};
}

export function imagePoint(point: Point, view: MapView, width: number, height: number): Point {
  const size = Math.max(1, Math.min(width, height)) * view.zoom;
  return {x: view.x + (point.x - width / 2) / size, y: view.y + (point.y - height / 2) / size};
}

export function viewportPoint(point: Point, view: MapView, width: number, height: number): Point {
  const size = Math.max(1, Math.min(width, height)) * view.zoom;
  return {x: width / 2 + (point.x - view.x) * size, y: height / 2 + (point.y - view.y) * size};
}

// Keep the same image point under the moving pinch midpoint or wheel cursor.
export function transformView(view: MapView, from: Point, to: Point, zoom: number, width: number, height: number): MapView {
  const anchor = imagePoint(from, view, width, height);
  const nextZoom = clamp(zoom, 1, 6);
  const size = Math.max(1, Math.min(width, height)) * nextZoom;
  return boundView({zoom: nextZoom, x: anchor.x - (to.x - width / 2) / size, y: anchor.y - (to.y - height / 2) / size}, width, height);
}

function measurePinch(first: Point, second: Point) {
  return {
    midpoint: {x: (first.x + second.x) / 2, y: (first.y + second.y) / 2},
    distance: Math.max(1, Math.hypot(first.x - second.x, first.y - second.y)),
  };
}

export function beginMapPinch(view: MapView, first: Point, second: Point, width: number, height: number) {
  return {view: boundView(view, width, height), ...measurePinch(first, second)};
}

export type MapPinch = ReturnType<typeof beginMapPinch>;

export function mapPinchView(start: MapPinch, first: Point, second: Point, width: number, height: number): MapView {
  const current = measurePinch(first, second);
  // Always scale from the gesture start, never from a previously clamped event.
  return transformView(start.view, start.midpoint, current.midpoint, start.view.zoom * current.distance / start.distance, width, height);
}
