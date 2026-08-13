import {describe, expect, it} from "vitest";
import {getHomeFacts, START_GUIDES} from "../../src/features/home/home-data";

describe("homepage data", () => {
  it("uses four intuitive facts and four working start routes", () => {
    const copy = {
      earlyAccess: "Early Access Sep 10, 2026",
      players: "Up to 100 Players",
      teams: "3 Teams",
      controlZone: "2 x 2 km Control Zone"
    } as const;

    const facts = getHomeFacts((key) => copy[key]);

    expect(facts).toEqual([
      "Early Access Sep 10, 2026",
      "Up to 100 Players",
      "3 Teams",
      "2 x 2 km Control Zone"
    ]);
    expect(START_GUIDES).toEqual([
      {number: "1", slug: "wardogs-gameplay", anchor: "beginner-guide", titleKey: "beginner"},
      {number: "2", slug: "wardogs-playtest", titleKey: "playtest"},
      {number: "3", slug: "wardogs-gameplay", titleKey: "gameplay"},
      {number: "4", slug: "wardogs-factions", titleKey: "factions"}
    ]);
    expect(facts.every((fact) => typeof fact === "string")).toBe(true);
  });
});
