import {z} from "zod";
import {MAP_DATA_VERSION, mapIds, type MapId, type Point} from "./map-state";

// Intrinsic dimensions of the versioned square basemaps, not a game-world scale.
export const BASEMAP_SIDE_PX = 2048;
const unit = z.number().finite().min(0).max(1);
const pointSchema = z.object({x: unit, y: unit}).strict();
const pointsSchema = z.array(pointSchema).max(2);
const magnitude = z.number().finite().min(0).max(1e9);
export const userCalibrationSchema = z.object({
  provenance: z.literal("user-supplied"),
  distanceMeters: magnitude.positive(),
  distanceErrorMeters: magnitude,
  pointErrorPixels: z.number().finite().min(0).max(BASEMAP_SIDE_PX),
  source: z.string().trim().min(1).max(240),
  build: z.string().trim().min(1).max(80),
}).strict().refine((value) => value.distanceErrorMeters < value.distanceMeters);

export function imageDistance(points: readonly Point[]): number | undefined {
  if (points.length !== 2) return undefined;
  return Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y) * BASEMAP_SIDE_PX;
}

export const mapMeasurementSchema = z.object({
  schema: z.literal(1),
  dataVersion: z.literal(MAP_DATA_VERSION),
  map: z.enum(mapIds),
  points: pointsSchema,
  reference: pointsSchema,
  calibration: userCalibrationSchema.optional(),
}).strict().refine((value) => !value.calibration || (
  value.reference.length === 2 &&
  (imageDistance(value.reference) ?? 0) > Math.max(1e-9, 2 * value.calibration.pointErrorPixels)
));
export type MapMeasurement = z.infer<typeof mapMeasurementSchema>;
export type UserCalibration = z.infer<typeof userCalibrationSchema>;
export type MeasurementMode = "measure" | "calibrate";

export function initialMeasurement(map: MapId): MapMeasurement {
  return {schema: 1, dataVersion: MAP_DATA_VERSION, map, points: [], reference: []};
}

export function placeMeasurementPoint(state: MapMeasurement, mode: MeasurementMode, point: Point): MapMeasurement {
  if (!pointSchema.safeParse(point).success) return state;
  const key = mode === "calibrate" ? "reference" : "points";
  const points = state[key].length === 2 ? [point] : [...state[key], point];
  return {...state, [key]: points, ...(mode === "calibrate" ? {calibration: undefined} : {})};
}

export function measureMap(state: MapMeasurement) {
  const parsed = mapMeasurementSchema.safeParse(state);
  if (!parsed.success) return undefined;
  const pixels = imageDistance(parsed.data.points);
  if (pixels === undefined) return undefined;
  const calibration = parsed.data.calibration;
  if (!calibration) return {pixels};
  const reference = imageDistance(parsed.data.reference)!;
  const {distanceMeters: distance, distanceErrorMeters: error, pointErrorPixels} = calibration;
  const pairError = 2 * pointErrorPixels;
  // Triangle-inequality bounds for both endpoint pairs; not a confidence interval.
  return {
    pixels,
    meters: pixels / reference * distance,
    lowerMeters: Math.max(0, pixels - pairError) / (reference + pairError) * (distance - error),
    upperMeters: (pixels + pairError) / (reference - pairError) * (distance + error),
  };
}

// A separate fragment preserves the original map= payload for older viewers.
export function measurementHash(mapFragment: string, measurement: MapMeasurement): string {
  const params = new URLSearchParams(mapFragment.replace(/^#/, ""));
  params.set("ruler", JSON.stringify(mapMeasurementSchema.parse(measurement)));
  return `#${params}`;
}

export function readMeasurementHash(hash: string, map: MapId): {state?: MapMeasurement; invalid: boolean} {
  if (hash.length > 16_000) return {invalid: true};
  const value = new URLSearchParams(hash.replace(/^#/, "")).get("ruler");
  if (!value) return {invalid: false};
  try {
    const parsed = mapMeasurementSchema.safeParse(JSON.parse(value));
    return parsed.success && parsed.data.map === map ? {state: parsed.data, invalid: false} : {invalid: true};
  } catch { return {invalid: true}; }
}
