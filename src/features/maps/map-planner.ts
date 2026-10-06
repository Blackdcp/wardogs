import {z} from "zod";
import {calculateAzimuth, calculateDistanceMeters, calculateFiringSolution, formatGridCoordinate, WEAPON_REGISTRY, type FiringSolution, type TrajectoryMode, type WeaponId} from "@/features/artillery/ballistics-data";
import {encodeCalculatorSearch} from "@/features/artillery/artillery-mission";
import {MAP_DATA_VERSION, mapIds, type MapId, type Point} from "@/features/maps/map-state";

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
const weaponIdSchema = z.custom<WeaponId>((value) => typeof value === "string" && value in WEAPON_REGISTRY);
const trajectoryModeSchema = z.custom<TrajectoryMode>((value) => typeof value === "string" && ["single", "high", "low"].includes(value));
export const tacticalPlanSchema = z.object({
  schema: z.literal(1),
  dataVersion: z.literal(MAP_DATA_VERSION),
  map: z.enum(mapIds),
  layers: z.array(tacticalLayerSchema).length(DEFAULT_TACTICAL_LAYERS.length).refine((layers) => new Set(layers.map(({id}) => id)).size === layers.length),
  route: z.object({points: z.array(pointSchema).max(MAX_ROUTE_POINTS), label: z.string().trim().min(1).max(80)}).strict(),
  fireSupport: z.object({points: z.array(pointSchema).max(2), weaponId: weaponIdSchema, mode: trajectoryModeSchema}).strict(),
}).strict();
export type TacticalPlan = z.infer<typeof tacticalPlanSchema>;

export type TacticalRange = {
  gun: Point;
  target: Point;
  gunGrid: string;
  targetGrid: string;
  distanceMeters: number;
  azimuthDegrees: number;
  azimuthMil: number;
  solution: FiringSolution;
};

function validPoint(point: Point) {
  return pointSchema.safeParse(point).success;
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
  if (!validPoint(point)) return plan;
  const points = plan.route.points.length >= MAX_ROUTE_POINTS ? [point] : [...plan.route.points, point];
  return {...plan, route: {...plan.route, points}};
}

export function placeRangePoint(plan: TacticalPlan, point: Point): TacticalPlan {
  if (!validPoint(point)) return plan;
  const points = plan.fireSupport.points.length === 2 ? [point] : [...plan.fireSupport.points, point];
  return {...plan, fireSupport: {...plan.fireSupport, points}};
}

export function calculateRouteDistanceMeters(points: readonly Point[], map: MapId) {
  return Math.round(points.slice(1).reduce((total, point, index) => total + calculateDistanceMeters(points[index], point, map), 0) * 10) / 10;
}

export function calculateTacticalRange(plan: TacticalPlan, map: MapId): TacticalRange | undefined {
  const [gun, target] = plan.fireSupport.points;
  if (!gun || !target) return undefined;
  const distanceMeters = calculateDistanceMeters(gun, target, map);
  const azimuth = calculateAzimuth(gun, target);
  const mode = modeForWeapon(plan.fireSupport.weaponId, plan.fireSupport.mode);
  const solution = calculateFiringSolution({weaponId: plan.fireSupport.weaponId, mode, distanceMeters, azimuthDegrees: azimuth.degrees, azimuthMil: azimuth.mils});
  return {gun, target, gunGrid: formatGridCoordinate(gun, map), targetGrid: formatGridCoordinate(target, map), distanceMeters, azimuthDegrees: azimuth.degrees, azimuthMil: azimuth.mils, solution};
}

export function buildCalculatorSearch(plan: TacticalPlan, map: MapId) {
  const range = calculateTacticalRange(plan, map);
  if (!range) return "";
  return encodeCalculatorSearch({map, weaponId: plan.fireSupport.weaponId, mode: modeForWeapon(plan.fireSupport.weaponId, plan.fireSupport.mode), distanceMeters: range.distanceMeters, azimuthDegrees: range.azimuthDegrees, source: "map"});
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
