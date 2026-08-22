import {describe, expect, it} from "vitest";
import {isApprovedSourceUrl} from "../../src/content/source-policy";

describe("source policy", () => {
  it("allows Microsoft's official Windows support pages", () => {
    expect(isApprovedSourceUrl("https://support.microsoft.com/en-us/topic/example")).toBe(true);
  });

  it("allows the official FPS Games Show source and WARDOGS community megathread", () => {
    expect(isApprovedSourceUrl("https://x.com/FPSGamesShow/status/2090076326120300897")).toBe(true);
    expect(isApprovedSourceUrl("https://www.reddit.com/r/WarDogs/comments/1vqvbk7/hotas_mega/")).toBe(true);
  });

  it("rejects both known WARDOGS competitor domains", () => {
    expect(isApprovedSourceUrl("https://wardogshub.gg/weapons/")).toBe(false);
    expect(isApprovedSourceUrl("https://www.wardogshub.gg/weapons/")).toBe(false);
    expect(isApprovedSourceUrl("https://wardogs.wiki/")).toBe(false);
    expect(isApprovedSourceUrl("https://www.wardogs.wiki/")).toBe(false);
  });
});
