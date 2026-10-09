import {mapIds, type MapId} from "@/features/maps/map-state";
import {calculateFiringSolution, WEAPON_REGISTRY, type TrajectoryMode, type WeaponId} from "@/features/artillery/ballistics-data";

export const ARTILLERY_HISTORY_LIMIT = 6;

export type CalculatorSource = "map" | "direct";
export type CalculatorMissionInput = {
  map: MapId;
  weaponId: WeaponId;
  mode: TrajectoryMode;
  distanceMeters: number;
  azimuthDegrees: number;
  source?: CalculatorSource;
  mapScaleMeters?: number;
  scaleSource?: "user-supplied" | "nominal";
};

export type RangeObservation = "short" | "long" | "on";
export type LateralObservation = "left" | "right" | "on";
export type ObservedCorrectionInput = {
  weaponId?: WeaponId;
  mode?: TrajectoryMode;
  heightDeltaMeters?: number;
  range: RangeObservation;
  lateral: LateralObservation;
  distanceMeters: number;
  azimuthDegrees: number;
};
export type ObservedCorrection = {
  nextDistanceMeters: number;
  nextAzimuthDegrees: number;
  elevationHint: "increase_mil" | "decrease_mil" | "hold_mil" | "unavailable";
  valid: boolean;
  nextElevationMil?: number;
  lateralHint: "left" | "right" | "hold";
  rangeDeltaMeters: number;
  azimuthDeltaDegrees: number;
};

export type ShotHistoryEntry = {
  weaponName: string;
  mapName: string;
  distanceMeters: number;
  azimuthDegrees: number;
  elevationMil: number;
  timeOfFlightSeconds: number;
};

function isMapId(value: string): value is MapId {
  return (mapIds as readonly string[]).includes(value);
}

function isWeaponId(value: string): value is WeaponId {
  return value in WEAPON_REGISTRY;
}

function isModeForWeapon(weaponId: WeaponId, value: string): value is TrajectoryMode {
  return WEAPON_REGISTRY[weaponId].availableModes.includes(value as TrajectoryMode);
}

function normalizeBearing(value: number) {
  return ((value % 360) + 360) % 360;
}

function formatDecimal(value: number, digits = 1) {
  return Number.isInteger(value) ? String(value) : value.toFixed(digits).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

export function encodeCalculatorSearch(input: CalculatorMissionInput) {
  const params = new URLSearchParams();
  params.set("map", input.map);
  params.set("weapon", input.weaponId);
  params.set("mode", input.mode);
  params.set("distance", formatDecimal(input.distanceMeters));
  params.set("azimuth", formatDecimal(normalizeBearing(input.azimuthDegrees)));
  if (input.source) params.set("source", input.source);
  if (input.mapScaleMeters) params.set("mapScale", formatDecimal(input.mapScaleMeters, 6));
  if (input.scaleSource) params.set("scaleSource", input.scaleSource);
  return `?${params.toString()}`;
}

export function decodeCalculatorSearch(search: string): CalculatorMissionInput | undefined {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const map = params.get("map") ?? "";
  const weapon = params.get("weapon") ?? "";
  const mode = params.get("mode") ?? "";
  const distance = Number(params.get("distance"));
  const azimuth = Number(params.get("azimuth"));
  const source = params.get("source") ?? undefined;
  const scale = params.has("mapScale") ? Number(params.get("mapScale")) : undefined;
  const scaleSource = params.get("scaleSource") ?? undefined;

  if (!isMapId(map) || !isWeaponId(weapon) || !isModeForWeapon(weapon, mode)) return undefined;
  if (!Number.isFinite(distance) || distance <= 0) return undefined;
  if (!Number.isFinite(azimuth) || azimuth < 0 || azimuth >= 360) return undefined;
  if (source !== undefined && source !== "map" && source !== "direct") return undefined;

  if (scale !== undefined && (!Number.isFinite(scale) || scale <= 0 || scale > 1e12)) return undefined;
  if (scaleSource !== undefined && scaleSource !== "user-supplied" && scaleSource !== "nominal") return undefined;
  if (scaleSource && scale === undefined) return undefined;
  return {map, weaponId: weapon, mode, distanceMeters: distance, azimuthDegrees: azimuth, source, ...(scale === undefined ? {} : {mapScaleMeters: scale, scaleSource})};
}

export function recommendObservedCorrection(input: ObservedCorrectionInput): ObservedCorrection {
  const rangeDeltaMeters = input.range === "short" ? Math.max(5, Math.round(input.distanceMeters * 0.05)) : input.range === "long" ? -Math.max(5, Math.round(input.distanceMeters * 0.05)) : 0;
  const azimuthDeltaDegrees = input.lateral === "right" ? -2 : input.lateral === "left" ? 2 : 0;
  const nextDistanceMeters = Math.max(1, input.distanceMeters + rangeDeltaMeters);
  const parameters = {weaponId: input.weaponId ?? "mortar" as WeaponId, mode: input.mode, heightDeltaMeters: input.heightDeltaMeters};
  const current = calculateFiringSolution({...parameters, distanceMeters: input.distanceMeters});
  const next = calculateFiringSolution({...parameters, distanceMeters: nextDistanceMeters});
  const valid = current.valid && next.valid;
  const deltaMil = next.elevationMil - current.elevationMil;
  return {
    nextDistanceMeters,
    valid,
    nextElevationMil: valid ? next.elevationMil : undefined,
    nextAzimuthDegrees: normalizeBearing(input.azimuthDegrees + azimuthDeltaDegrees),
    elevationHint: !valid ? "unavailable" : deltaMil > 0 ? "increase_mil" : deltaMil < 0 ? "decrease_mil" : "hold_mil",
    lateralHint: input.lateral === "right" ? "left" : input.lateral === "left" ? "right" : "hold",
    rangeDeltaMeters,
    azimuthDeltaDegrees,
  };
}

export function pushShotHistory(history: readonly ShotHistoryEntry[], entry: ShotHistoryEntry): ShotHistoryEntry[] {
  return [entry, ...history].slice(0, ARTILLERY_HISTORY_LIMIT);
}

export function summarizeShot(entry: ShotHistoryEntry) {
  return `${entry.weaponName} · ${entry.mapName} · ${Math.round(entry.distanceMeters)}m · ${entry.azimuthDegrees.toFixed(1)}° · ${Math.round(entry.elevationMil)} mil · ${entry.timeOfFlightSeconds.toFixed(1)}s`;
}


export function readShotHistory(value: unknown): ShotHistoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is ShotHistoryEntry => {
    if (!entry || typeof entry !== "object") return false;
    return ["weaponName", "mapName"].every((key) => typeof entry[key] === "string" && entry[key].length > 0 && entry[key].length <= 80)
      && ["distanceMeters", "azimuthDegrees", "elevationMil", "timeOfFlightSeconds"].every((key) => typeof entry[key] === "number" && Number.isFinite(entry[key]))
      && entry.distanceMeters > 0 && entry.distanceMeters <= 1e9 && entry.azimuthDegrees >= 0 && entry.azimuthDegrees < 360 && entry.elevationMil >= 0 && entry.timeOfFlightSeconds >= 0;
  }).slice(0, ARTILLERY_HISTORY_LIMIT);
}
