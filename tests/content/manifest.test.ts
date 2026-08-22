import {describe, expect, it} from "vitest";
import {guideManifest} from "../../src/content/manifest";

const expected = [
  ["access", "wardogs playtest", "wardogs-playtest"],
  ["access", "wardogs beta", "wardogs-beta"],
  ["access", "wardogs alpha", "wardogs-alpha"],
  ["access", "wardogs alpha key", "wardogs-alpha-key"],
  ["release", "wardogs release date", "wardogs-release-date"],
  ["release", "wardogs early access", "wardogs-early-access"],
  ["store", "wardogs steam", "wardogs-steam"],
  ["store", "wardogs price", "wardogs-price"],
  ["store", "wardogs download", "wardogs-download"],
  ["store", "wardogs preload", "wardogs-preload"],
  ["platform", "wardogs ps5", "wardogs-ps5"],
  ["video", "wardogs trailer", "wardogs-trailer"],
  ["video", "wardogs first look", "wardogs-first-look"],
  ["video", "wardogs livestream", "wardogs-livestream"],
  ["community", "wardogs discord", "wardogs-discord"],
  ["community", "wardogs reddit", "wardogs-reddit"],
  ["community", "wardogs twitter", "wardogs-twitter"],
  ["community", "wardogs discord account verification", "wardogs-discord-account-verification"],
  ["community", "wardogs twitch drops", "wardogs-twitch-drops"],
  ["developer", "wardogs game developers", "wardogs-game-developers"],
  ["guide", "wardogs gameplay", "wardogs-gameplay"],
  ["guide", "wardogs factions", "wardogs-factions"],
  ["guide", "wardogs beginner guide", "wardogs-beginner-guide"],
  ["guide", "wardogs fob guide", "wardogs-fob-guide"],
  ["guide", "wardogs crash fix", "wardogs-crash-fix"],
  ["guide", "wardogs towers guide", "wardogs-towers-guide"],
  ["guide", "wardogs money guide", "wardogs-money-guide"],
  ["guide", "wardogs helicopter guide", "wardogs-helicopter-guide"],
  ["guide", "wardogs mortar guide", "wardogs-mortar-guide"]
] as const;

describe("guideManifest", () => {
  it("maps every approved keyword exactly once and in traffic order", () => {
    expect(guideManifest.map(({category, keyword, slug}) => [category, keyword, slug])).toEqual(expected);
    expect(new Set(guideManifest.map(({slug}) => slug)).size).toBe(29);
    expect(guideManifest.map(({order}) => order)).toEqual(Array.from({length: 29}, (_, index) => index + 1));
  });
});
