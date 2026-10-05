import {describe, expect, it} from "vitest";
import {HOME_FACT_KEYS, HOME_UPDATED_AT, getHomeFacts} from "../../src/features/home/home-data";

describe("homepage data", () => {
  it("keeps the stable homepage facts and release freshness date", () => {
    const copy = {
      earlyAccess: "Early Access Sep 10, 2026",
      players: "Up to 100 Players",
      teams: "3 Teams",
      controlZone: "2 x 2 km Control Zone"
    } as const;

    expect(HOME_FACT_KEYS).toEqual(["earlyAccess", "players", "teams", "controlZone"]);
    expect(getHomeFacts((key) => copy[key])).toEqual([
      "Early Access Sep 10, 2026",
      "Up to 100 Players",
      "3 Teams",
      "2 x 2 km Control Zone"
    ]);
    expect(HOME_UPDATED_AT).toBe("2026-10-05");
  });
});
