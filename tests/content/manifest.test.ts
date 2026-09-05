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
  ["guide", "wardogs mortar guide", "wardogs-mortar-guide"],
  ["guide", "wardogs map", "wardogs-map"],
  ["guide", "wardogs best settings", "wardogs-best-settings"],
  ["guide", "wardogs system requirements", "wardogs-system-requirements"],
  ["guide", "wardogs controls", "wardogs-controls"],
  ["guide", "wardogs artillery guide", "wardogs-artillery-guide"],
  ["guide", "wardogs launch checklist", "wardogs-launch-checklist"],
  ["guide", "wardogs cargo guide", "wardogs-cargo-guide"],
  ["guide", "wardogs ammo reload guide", "wardogs-ammo-reload-guide"],
  ["guide", "wardogs squad guide", "wardogs-squad-guide"],
  ["guide", "wardogs oil rig guide", "wardogs-oil-rig-guide"],
  ["guide", "wardogs best weapons loadouts", "wardogs-best-weapons-loadouts"],
  ["guide", "wardogs armor damage ttk guide", "wardogs-armor-damage-ttk-guide"],
  ["guide", "wardogs medic revive guide", "wardogs-medic-revive-guide"],
  ["guide", "wardogs equipment tools guide", "wardogs-equipment-tools-guide"],
  ["guide", "wardogs progression wipes guide", "wardogs-progression-wipes-guide"],
  ["guide", "wardogs community servers guide", "wardogs-community-servers-guide"],
  ["guide", "wardogs 100k clip contest", "wardogs-100k-clip-contest"],
  ["guide", "wardogs known issues", "wardogs-known-issues"],
  ["guide", "wardogs linux proton", "wardogs-linux-proton"]
] as const;

describe("guideManifest", () => {
  it("maps every approved keyword exactly once and in traffic order", () => {
    expect(guideManifest.map(({category, keyword, slug}) => [category, keyword, slug])).toEqual(expected);
    expect(new Set(guideManifest.map(({slug}) => slug)).size).toBe(48);
    expect(guideManifest.map(({order}) => order)).toEqual(Array.from({length: 48}, (_, index) => index + 1));
  });
});
