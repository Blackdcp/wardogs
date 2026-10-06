import {describe, expect, it} from "vitest";
import {
  ARTILLERY_HISTORY_LIMIT,
  decodeCalculatorSearch,
  encodeCalculatorSearch,
  pushShotHistory,
  recommendObservedCorrection,
  summarizeShot,
  type ShotHistoryEntry,
} from "../../src/features/artillery/artillery-mission";

describe("artillery mission workflow", () => {
  it("encodes and restores calculator inputs without coordinates or private share state", () => {
    const search = encodeCalculatorSearch({map: "bakurani", weaponId: "mortar", mode: "single", distanceMeters: 320, azimuthDegrees: 90, source: "map"});
    expect(search).toBe("?map=bakurani&weapon=mortar&mode=single&distance=320&azimuth=90&source=map");
    expect(decodeCalculatorSearch(search)).toEqual({map: "bakurani", weaponId: "mortar", mode: "single", distanceMeters: 320, azimuthDegrees: 90, source: "map"});
    expect(decodeCalculatorSearch("?map=bad&weapon=mortar&distance=NaN&azimuth=999")).toBeUndefined();
  });

  it("gives practical observed-shot corrections for range and lateral misses", () => {
    expect(recommendObservedCorrection({range: "short", lateral: "right", distanceMeters: 500, azimuthDegrees: 90})).toMatchObject({
      nextDistanceMeters: 525,
      nextAzimuthDegrees: 88,
      elevationHint: "decrease_mil",
      lateralHint: "left",
    });
    expect(recommendObservedCorrection({range: "long", lateral: "left", distanceMeters: 500, azimuthDegrees: 2})).toMatchObject({
      nextDistanceMeters: 475,
      nextAzimuthDegrees: 4,
      elevationHint: "increase_mil",
      lateralHint: "right",
    });
  });

  it("keeps a bounded local shot history with readable summaries", () => {
    let history: ShotHistoryEntry[] = [];
    for (let i = 0; i < ARTILLERY_HISTORY_LIMIT + 2; i++) {
      history = pushShotHistory(history, {weaponName: "L81 Mortar", mapName: "Bakurani", distanceMeters: 300 + i, azimuthDegrees: 90, elevationMil: 650 - i, timeOfFlightSeconds: 17 + i / 10});
    }
    expect(history).toHaveLength(ARTILLERY_HISTORY_LIMIT);
    expect(history[0].distanceMeters).toBe(300 + ARTILLERY_HISTORY_LIMIT + 1);
    expect(summarizeShot(history[0])).toContain("L81 Mortar · Bakurani · 307m · 90.0° · 643 mil · 17.7s");
  });
});
