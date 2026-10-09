import type {MapId, Point} from "@/features/maps/map-state";

export type WeaponId = "mortar" | "sph2";
export type TrajectoryMode = "single" | "high" | "low";

export interface WeaponSpec {
  id: WeaponId;
  name: string;
  caliber: string;
  minRangeMeters: number;
  maxRangeMeters: number;
  minElevationMil: number;
  maxElevationMil: number;
  availableModes: TrajectoryMode[];
  defaultMode: TrajectoryMode;
  ammoTypes: readonly string[];
  wikiSlug: string;
}

export interface FiringSolution {
  valid: boolean;
  reason?: "too_close" | "out_of_range" | "unsupported_mode";
  distanceMeters: number;
  elevationMil: number;
  azimuthDegrees: number;
  azimuthMil: number;
  timeOfFlightSeconds: number;
  heightDeltaMeters: number;
  effectiveDistanceMeters: number;
  weapon: WeaponSpec;
  mode: TrajectoryMode;
}

// Nominal full-image span from community maps/*.json tileBounds × coordinateMetersPerUnit.
// All three local basemaps stitch the complete pyramid; playable bounds are not the image scale.
// Source: https://github.com/apollyon-sys/wardogs-calculator/tree/main/maps (2026-10-09).
export const MAP_DIMENSIONS: Record<MapId, {name: string; sizeMeters: number; gridCols: number}> = {
  bakurani: {name: "Bakurani", sizeMeters: 16384, gridCols: 16},
  ozeti: {name: "Ozeti", sizeMeters: 16384, gridCols: 32},
  zestafona: {name: "Zestafona", sizeMeters: 16384, gridCols: 32},
};

// Empirical Community Measured Ballistics: [distanceMeters, elevationMil]
const L81_MORTAR_TABLE: [number, number][] = [
  [80, 950],
  [90, 938],
  [100, 925],
  [110, 912],
  [120, 900],
  [132, 885],
  [140, 875],
  [150, 862],
  [160, 850],
  [170, 838],
  [180, 825],
  [190, 812],
  [200, 800],
  [220, 775],
  [240, 750],
  [260, 725],
  [280, 700],
  [300, 675],
  [320, 650],
  [340, 625],
  [360, 600],
  [380, 575],
  [400, 550],
  [420, 525],
  [440, 500],
  [460, 475],
  [480, 450],
  [500, 425],
  [520, 400],
  [540, 375],
  [560, 350],
  [580, 325],
  [600, 295],
  [620, 260],
  [640, 225],
  [660, 190],
  [684, 150],
  [697, 120]
];

const SPH2_HIGH_ARC_TABLE: [number, number][] = [
  [735, 1400],
  [780, 1390],
  [825, 1380],
  [869, 1370],
  [913, 1360],
  [956, 1350],
  [999, 1340],
  [1041, 1330],
  [1083, 1320],
  [1124, 1310],
  [1165, 1300],
  [1205, 1290],
  [1245, 1280],
  [1285, 1270],
  [1324, 1260],
  [1363, 1250],
  [1401, 1240],
  [1438, 1230],
  [1475, 1220],
  [1512, 1210],
  [1547, 1200],
  [1582, 1190],
  [1616, 1180],
  [1650, 1170],
  [1684, 1160],
  [1717, 1150],
  [1750, 1140],
  [1782, 1130],
  [1813, 1120],
  [1844, 1110],
  [1875, 1100],
  [1905, 1090],
  [1934, 1080],
  [1963, 1070],
  [1991, 1060],
  [2019, 1050],
  [2046, 1040],
  [2072, 1030],
  [2098, 1020],
  [2123, 1010],
  [2147, 1000],
  [2171, 990],
  [2194, 980],
  [2217, 970],
  [2239, 960],
  [2261, 950],
  [2282, 940],
  [2303, 930],
  [2323, 920],
  [2342, 910],
  [2360, 900],
  [2378, 890],
  [2395, 880],
  [2412, 870],
  [2429, 860],
  [2444, 850],
  [2460, 840],
  [2474, 830],
  [2488, 820],
  [2501, 810],
  [2513, 800],
  [2524, 790],
  [2536, 780],
  [2546, 770],
  [2557, 760],
  [2567, 750],
  [2576, 740],
  [2584, 730],
  [2592, 720],
  [2599, 710],
  [2604, 700],
  [2609, 690],
  [2613, 680],
  [2617, 670],
  [2621, 660],
  [2624, 650],
  [2626, 640],
  [2628, 630],
  [2629, 620],
  [2629, 610]
];

const SPH2_LOW_ARC_TABLE: [number, number][] = [
  [1181, 20],
  [1299, 30],
  [1401, 40],
  [1492, 50],
  [1574, 60],
  [1649, 70],
  [1718, 80],
  [1781, 90],
  [1839, 100],
  [1894, 110],
  [1945, 120],
  [1993, 130],
  [2037, 140],
  [2079, 150],
  [2118, 160],
  [2154, 170],
  [2189, 180],
  [2221, 190],
  [2251, 200],
  [2279, 210],
  [2305, 220],
  [2330, 230],
  [2354, 240],
  [2376, 250],
  [2397, 260],
  [2417, 270],
  [2435, 280],
  [2452, 290],
  [2469, 300],
  [2484, 310],
  [2499, 320],
  [2513, 330],
  [2526, 340],
  [2538, 350],
  [2550, 360],
  [2561, 370],
  [2570, 380],
  [2579, 390],
  [2586, 400],
  [2593, 410],
  [2599, 420],
  [2605, 430],
  [2610, 440],
  [2615, 450],
  [2620, 460],
  [2623, 470],
  [2626, 480],
  [2628, 490],
  [2629, 500],
  [2629, 600]
];

export const WEAPON_REGISTRY: Record<WeaponId, WeaponSpec> = {
  mortar: {
    id: "mortar",
    name: "L81 Mortar",
    caliber: "81mm",
    minRangeMeters: 80,
    maxRangeMeters: 697,
    minElevationMil: 120,
    maxElevationMil: 950,
    availableModes: ["single"],
    defaultMode: "single",
    ammoTypes: ["81mm HE", "81mm Smoke", "81mm Illum"],
    wikiSlug: "mortar-l81"
  },
  sph2: {
    id: "sph2",
    name: "SPH-2 Artillery",
    caliber: "155mm",
    minRangeMeters: 735,
    maxRangeMeters: 2629,
    minElevationMil: 20,
    maxElevationMil: 1400,
    availableModes: ["high", "low"],
    defaultMode: "high",
    ammoTypes: ["155mm High Explosive", "155mm Smoke", "155mm Cluster"],
    wikiSlug: "sph-2"
  }
};

export function getWeaponRangeEnvelope(weaponId: WeaponId, mode?: TrajectoryMode): {minRangeMeters: number; maxRangeMeters: number} {
  if (weaponId === "mortar") {
    return {minRangeMeters: 80, maxRangeMeters: 697};
  }
  if (mode === "low") {
    return {minRangeMeters: 1181, maxRangeMeters: 2629};
  }
  return {minRangeMeters: 735, maxRangeMeters: 2629};
}

export function interpolateMil(table: [number, number][], distance: number): number | null {
  if (!table.length || distance < table[0][0] || distance > table[table.length - 1][0]) {
    return null;
  }
  for (let i = 0; i < table.length - 1; i++) {
    const [d0, m0] = table[i];
    const [d1, m1] = table[i + 1];
    if (distance >= d0 && distance <= d1) {
      if (d1 === d0) return m0;
      const ratio = (distance - d0) / (d1 - d0);
      return Math.round((m0 + ratio * (m1 - m0)) * 10) / 10;
    }
  }
  return null;
}

export function calculateDistanceMeters(p1: Point, p2: Point, mapId: MapId): number {
  const spec = MAP_DIMENSIONS[mapId] ?? MAP_DIMENSIONS.bakurani;
  const dx = (p2.x - p1.x) * spec.sizeMeters;
  const dy = (p2.y - p1.y) * spec.sizeMeters;
  return Math.round(Math.hypot(dx, dy) * 10) / 10;
}

export function calculateAzimuth(p1: Point, p2: Point): {degrees: number; mils: number} {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y; // note: y goes downwards on maps
  // Standard navigation bearing: 0 deg North, 90 deg East, 180 deg South, 270 deg West
  const rad = Math.atan2(dx, -dy);
  let deg = (rad * 180) / Math.PI;
  if (deg < 0) deg += 360;
  deg = (Math.round(deg * 10) / 10) % 360;
  // NATO 6400 mils in 360 degrees
  const mils = Math.round((deg / 360) * 6400) % 6400;
  return {degrees: deg, mils};
}

export function calculateFiringSolution(params: {
  weaponId: WeaponId;
  mode?: TrajectoryMode;
  distanceMeters: number;
  heightDeltaMeters?: number;
  azimuthDegrees?: number;
  azimuthMil?: number;
}): FiringSolution {
  const {weaponId, distanceMeters} = params;
  const heightDelta = params.heightDeltaMeters ?? 0;
  const weapon = WEAPON_REGISTRY[weaponId];
  const mode = params.mode ?? weapon.defaultMode;

  let table: [number, number][];
  if (weaponId === "mortar") {
    table = L81_MORTAR_TABLE;
  } else if (mode === "low") {
    table = SPH2_LOW_ARC_TABLE;
  } else {
    table = SPH2_HIGH_ARC_TABLE;
  }

  const minRange = table[0][0];
  const maxRange = table[table.length - 1][0];

  if (distanceMeters < minRange) {
    return {
      valid: false,
      reason: "too_close",
      distanceMeters,
      elevationMil: 0,
      azimuthDegrees: params.azimuthDegrees ?? 0,
      azimuthMil: params.azimuthMil ?? 0,
      timeOfFlightSeconds: 0,
      heightDeltaMeters: heightDelta,
      effectiveDistanceMeters: distanceMeters,
      weapon,
      mode
    };
  }

  if (distanceMeters > maxRange) {
    return {
      valid: false,
      reason: "out_of_range",
      distanceMeters,
      elevationMil: 0,
      azimuthDegrees: params.azimuthDegrees ?? 0,
      azimuthMil: params.azimuthMil ?? 0,
      timeOfFlightSeconds: 0,
      heightDeltaMeters: heightDelta,
      effectiveDistanceMeters: distanceMeters,
      weapon,
      mode
    };
  }

  // Height delta compensation:
  // For high-arc artillery/mortar, target altitude above gun (heightDelta > 0) requires firing at lower mil (higher equivalent range).
  // Formula: Delta mil correction based on distance ratio.
  const heightCorrectionMilFactor = weaponId === "mortar" ? 1.05 : 0.45;
  const baseMil = interpolateMil(table, distanceMeters);

  if (baseMil === null) {
    return {
      valid: false,
      reason: "out_of_range",
      distanceMeters,
      elevationMil: 0,
      azimuthDegrees: params.azimuthDegrees ?? 0,
      azimuthMil: params.azimuthMil ?? 0,
      timeOfFlightSeconds: 0,
      heightDeltaMeters: heightDelta,
      effectiveDistanceMeters: distanceMeters,
      weapon,
      mode
    };
  }

  // Apply height delta adjustment (clamped within physical limits)
  const adjustedMil = Math.round(
    Math.max(
      weapon.minElevationMil,
      Math.min(weapon.maxElevationMil, baseMil - heightDelta * heightCorrectionMilFactor)
    )
  );

  // Time of Flight Estimation:
  let timeOfFlight = 0;
  if (weaponId === "mortar") {
    // L81 high arc flight time: ~14.5s at 100m, ~22.8s at 680m
    timeOfFlight = Math.round((13.5 + 0.014 * distanceMeters) * 10) / 10;
  } else if (mode === "low") {
    // SPH-2 low arc: ~4.5s at 1200m, ~18.5s at 2600m
    timeOfFlight = Math.round((3.2 + 0.006 * distanceMeters) * 10) / 10;
  } else {
    // SPH-2 high arc: ~24s at 800m, ~48s at 2600m
    timeOfFlight = Math.round((21.0 + 0.011 * distanceMeters) * 10) / 10;
  }

  return {
    valid: true,
    distanceMeters,
    elevationMil: adjustedMil,
    azimuthDegrees: params.azimuthDegrees ?? 0,
    azimuthMil: params.azimuthMil ?? 0,
    timeOfFlightSeconds: timeOfFlight,
    heightDeltaMeters: heightDelta,
    effectiveDistanceMeters: Math.round(distanceMeters + heightDelta * 0.8),
    weapon,
    mode
  };
}

export function toGridColumnLabel(colIndex: number): string {
  const safeIndex = Math.max(0, colIndex);
  if (safeIndex < 26) {
    return String.fromCharCode(65 + safeIndex);
  }
  const first = String.fromCharCode(65 + Math.floor(safeIndex / 26) - 1);
  const second = String.fromCharCode(65 + (safeIndex % 26));
  return `${first}${second}`;
}

export function formatGridCoordinate(point: Point, mapId: MapId): string {
  const spec = MAP_DIMENSIONS[mapId] ?? MAP_DIMENSIONS.bakurani;
  const cols = spec.gridCols;
  const colIndex = Math.max(0, Math.min(cols - 1, Math.floor(point.x * cols)));
  const rowIndex = Math.max(0, Math.min(cols - 1, Math.floor(point.y * cols)));

  const colLetter = toGridColumnLabel(colIndex);
  const rowNumber = rowIndex + 1;

  // Keypad 1-9 subgrid
  const subX = Math.max(0, Math.min(0.9999, (point.x * cols) - colIndex));
  const subY = Math.max(0, Math.min(0.9999, (point.y * cols) - rowIndex));
  const kpCol = Math.min(2, Math.floor(subX * 3));
  const kpRow = Math.min(2, Math.floor(subY * 3));
  // Numpad: 7 8 9 (row 0), 4 5 6 (row 1), 1 2 3 (row 2)
  const keypad = [7, 8, 9, 4, 5, 6, 1, 2, 3][kpRow * 3 + kpCol];

  return `${colLetter}${rowNumber}-${keypad}`;
}
