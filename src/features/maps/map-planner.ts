import {z} from "zod";
import {calculateAzimuth, calculateFiringSolution, formatGridCoordinate, WEAPON_REGISTRY, type FiringSolution, type TrajectoryMode, type WeaponId} from "@/features/artillery/ballistics-data";
import {encodeCalculatorSearch} from "@/features/artillery/artillery-mission";
import {resolveMapDistance, resolveMapScale, mapMeasurementSchema, type MapMeasurement} from "@/features/maps/map-measurement";
import {MAP_DATA_VERSION, mapIds, mapStateSchema, type MapId, type Point} from "@/features/maps/map-state";

export type TacticalLayerId = "objectives" | "fob" | "supply" | "routes" | "fire-support" | "air" | "intel";
export type TacticalLayer = {id: TacticalLayerId; enabled: boolean};
export const DEFAULT_TACTICAL_LAYERS: TacticalLayer[] = [
  {id: "objectives", enabled: true},
  {id: "fob", enabled: true},
  {id: "supply", enabled: true},
  {id: "routes", enabled: true},
  {id: "fire-support", enabled: true},
  {id: "air", enabled: false},
  {id: "intel", enabled: true},
];
export const MAX_ROUTE_POINTS = 17;

const unit = z.number().finite().min(0).max(1);
const pointSchema = z.object({x: unit, y: unit}).strict();
const tacticalLayerSchema = z.object({id: z.enum(DEFAULT_TACTICAL_LAYERS.map(({id}) => id) as [TacticalLayerId, ...TacticalLayerId[]]), enabled: z.boolean()}).strict();
const weaponIdSchema = z.enum(Object.keys(WEAPON_REGISTRY) as [WeaponId, ...WeaponId[]]);
const trajectoryModeSchema = z.custom<TrajectoryMode>((value) => typeof value === "string" && ["single", "high", "low"].includes(value));
export const tacticalPlanSchema = z.object({
  schema: z.literal(1),
  dataVersion: z.literal(MAP_DATA_VERSION),
  map: z.enum(mapIds),
  communityPois: z.boolean().optional(),
  layers: z.array(tacticalLayerSchema).length(DEFAULT_TACTICAL_LAYERS.length).refine((layers) => new Set(layers.map(({id}) => id)).size === layers.length),
  route: z.object({points: z.array(pointSchema).max(MAX_ROUTE_POINTS), label: z.string().trim().min(1).max(80)}).strict(),
  fireSupport: z.object({points: z.array(pointSchema).max(2), weaponId: weaponIdSchema, mode: trajectoryModeSchema}).strict().refine((fire) => WEAPON_REGISTRY[fire.weaponId].availableModes.includes(fire.mode)),
}).strict();
export type TacticalPlan = z.infer<typeof tacticalPlanSchema>;

export type TacticalRange = {
  gun: Point;
  target: Point;
  gunGrid: string;
  targetGrid: string;
  distanceMeters: number;
  lowerMeters?: number;
  upperMeters?: number;
  scaleSource: "nominal" | "user-supplied";
  azimuthDegrees: number;
  azimuthMil: number;
  solution: FiringSolution;
};

function coordinates(point: Point): Point | undefined {
  // UI actions may receive a marker/POI record. Store only its coordinates;
  // file import still validates complete point objects with the strict schema.
  const parsed = pointSchema.safeParse({x: point.x, y: point.y});
  return parsed.success ? parsed.data : undefined;
}

function modeForWeapon(weaponId: WeaponId, mode: TrajectoryMode): TrajectoryMode {
  return WEAPON_REGISTRY[weaponId].availableModes.includes(mode) ? mode : WEAPON_REGISTRY[weaponId].defaultMode;
}

export function initialTacticalPlan(map: MapId): TacticalPlan {
  return {schema: 1, dataVersion: MAP_DATA_VERSION, map, layers: DEFAULT_TACTICAL_LAYERS.map((layer) => ({...layer})), route: {points: [], label: "Mission route"}, fireSupport: {points: [], weaponId: "mortar", mode: "single"}};
}

export function toggleTacticalLayer(plan: TacticalPlan, id: TacticalLayerId, enabled = !plan.layers.find((layer) => layer.id === id)?.enabled): TacticalPlan {
  return {...plan, layers: plan.layers.map((layer) => layer.id === id ? {...layer, enabled} : layer)};
}

export function placeRoutePoint(plan: TacticalPlan, point: Point): TacticalPlan {
  const position = coordinates(point);
  if (!position || plan.route.points.length >= MAX_ROUTE_POINTS) return plan;
  return {...toggleTacticalLayer(plan, "routes", true), route: {...plan.route, points: [...plan.route.points, position]}};
}

export function placeRangePoint(plan: TacticalPlan, point: Point): TacticalPlan {
  const position = coordinates(point);
  if (!position) return plan;
  const points = plan.fireSupport.points.length === 2 ? [position] : [...plan.fireSupport.points, position];
  return {...toggleTacticalLayer(plan, "fire-support", true), fireSupport: {...plan.fireSupport, points}};
}

export function setTacticalMissionPoint(plan: TacticalPlan, point: Point, role: "gun" | "target"): TacticalPlan {
  const position = coordinates(point);
  if (!position) return plan;
  const [gun, target] = plan.fireSupport.points;
  // A target cannot imply a gun at the current viewport center or any other point.
  if (role === "target" && !gun) return plan;
  const points = role === "target" ? [gun!, position] : [position, ...(target ? [target] : [])];
  return {...toggleTacticalLayer(plan, "fire-support", true), fireSupport: {...plan.fireSupport, points}};
}

export function calculateRouteDistanceMeters(points: readonly Point[], map: MapId, measurement?: MapMeasurement) {
  return Math.round(points.slice(1).reduce((total, point, index) => total + (resolveMapDistance([points[index], point], map, measurement)?.meters ?? 0), 0) * 10) / 10;
}

export function calculateTacticalRange(plan: TacticalPlan, map: MapId, measurement?: MapMeasurement): TacticalRange | undefined {
  const [gun, target] = plan.fireSupport.points;
  if (!gun || !target) return undefined;
  const distance = resolveMapDistance([gun, target], map, measurement)!;
  const distanceMeters = Math.round(distance.meters * 10) / 10;
  const azimuth = calculateAzimuth(gun, target);
  const mode = modeForWeapon(plan.fireSupport.weaponId, plan.fireSupport.mode);
  const solution = calculateFiringSolution({weaponId: plan.fireSupport.weaponId, mode, distanceMeters, azimuthDegrees: azimuth.degrees, azimuthMil: azimuth.mils});
  return {gun, target, gunGrid: formatGridCoordinate(gun, map), targetGrid: formatGridCoordinate(target, map), distanceMeters, lowerMeters: distance.lowerMeters, upperMeters: distance.upperMeters, scaleSource: distance.provenance, azimuthDegrees: azimuth.degrees, azimuthMil: azimuth.mils, solution};
}

export function buildCalculatorSearch(plan: TacticalPlan, map: MapId, measurement?: MapMeasurement) {
  const range = calculateTacticalRange(plan, map, measurement);
  if (!range) return "";
  return encodeCalculatorSearch({map, weaponId: plan.fireSupport.weaponId, mode: modeForWeapon(plan.fireSupport.weaponId, plan.fireSupport.mode), distanceMeters: range.distanceMeters, azimuthDegrees: range.azimuthDegrees, source: "map", mapScaleMeters: resolveMapScale(map, measurement).metersPerMapSide, scaleSource: range.scaleSource});
}

export function tacticalPlanHash(mapFragment: string, plan: TacticalPlan) {
  const params = new URLSearchParams(mapFragment.replace(/^#/, ""));
  params.set("plan", JSON.stringify(tacticalPlanSchema.parse(plan)));
  return `#${params}`;
}

export function readTacticalPlanHash(hash: string, map: MapId): {state?: TacticalPlan; invalid: boolean} {
  if (hash.length > 16_000) return {invalid: true};
  const value = new URLSearchParams(hash.replace(/^#/, "")).get("plan");
  if (!value) return {invalid: false};
  try {
    const parsed = tacticalPlanSchema.safeParse(JSON.parse(value));
    return parsed.success && parsed.data.map === map ? {state: parsed.data, invalid: false} : {invalid: true};
  } catch {
    return {invalid: true};
  }
}

export const mapPlanFileSchema = z.object({
  format: z.literal("wardogs-map-plan"),
  version: z.literal(1),
  map: mapStateSchema,
  ruler: mapMeasurementSchema,
  plan: tacticalPlanSchema,
}).strict().refine((file) => file.map.map === file.ruler.map && file.map.map === file.plan.map);
export type MapPlanFile = z.infer<typeof mapPlanFileSchema>;
export function exportMapPlan(file: MapPlanFile) {
  return JSON.stringify(mapPlanFileSchema.parse(file), null, 2);
}
export function importMapPlan(text: string): MapPlanFile | undefined {
  if (text.length > 64_000) return undefined;
  try {
    const parsed = mapPlanFileSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : undefined;
  } catch { return undefined; }
}
