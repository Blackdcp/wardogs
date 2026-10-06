import {mapIds, type MapId} from "@/features/maps/map-state";
import {WEAPON_REGISTRY, type TrajectoryMode, type WeaponId} from "@/features/artillery/ballistics-data";

export const ARTILLERY_HISTORY_LIMIT = 6;

export type CalculatorSource = "map" | "direct";
export type CalculatorMissionInput = {
  map: MapId;
  weaponId: WeaponId;
  mode: TrajectoryMode;
  distanceMeters: number;
  azimuthDegrees: number;
  source?: CalculatorSource;
};

export type RangeObservation = "short" | "long" | "on";
export type LateralObservation = "left" | "right" | "on";
export type ObservedCorrectionInput = {
  range: RangeObservation;
  lateral: LateralObservation;
  distanceMeters: number;
  azimuthDegrees: number;
};
export type ObservedCorrection = {
  nextDistanceMeters: number;
  nextAzimuthDegrees: number;
  elevationHint: "increase_mil" | "decrease_mil" | "hold_mil";
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

  if (!isMapId(map) || !isWeaponId(weapon) || !isModeForWeapon(weapon, mode)) return undefined;
  if (!Number.isFinite(distance) || distance <= 0) return undefined;
  if (!Number.isFinite(azimuth) || azimuth < 0 || azimuth >= 360) return undefined;
  if (source !== undefined && source !== "map" && source !== "direct") return undefined;

  return {map, weaponId: weapon, mode, distanceMeters: distance, azimuthDegrees: azimuth, source};
}

export function recommendObservedCorrection(input: ObservedCorrectionInput): ObservedCorrection {
  const rangeDeltaMeters = input.range === "short" ? Math.max(5, Math.round(input.distanceMeters * 0.05)) : input.range === "long" ? -Math.max(5, Math.round(input.distanceMeters * 0.05)) : 0;
  const azimuthDeltaDegrees = input.lateral === "right" ? -2 : input.lateral === "left" ? 2 : 0;
  return {
    nextDistanceMeters: Math.max(1, input.distanceMeters + rangeDeltaMeters),
    nextAzimuthDegrees: normalizeBearing(input.azimuthDegrees + azimuthDeltaDegrees),
    elevationHint: input.range === "short" ? "decrease_mil" : input.range === "long" ? "increase_mil" : "hold_mil",
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
