import {describe, expect, it} from "vitest";
import {guideManifest} from "../../src/content/manifest";
import {validateGuideFrontmatter} from "../../src/content/schema";

const entry = guideManifest[18];
const valid = {
  title: "WARDOGS Gameplay Explained",
  description: "Learn how WARDOGS matches work, from Control Zone scoring and persistent cash to vehicles, building, team roles, objectives, and match-winning tactics.",
  keyword: "wardogs gameplay",
  category: "guide",
  slug: "wardogs-gameplay",
  order: 19,
  updatedAt: "2026-08-13",
  badges: [{label: "Guide", tone: "accent"}],
  faq: [
    {question: "How many players are in WARDOGS?", answer: "Up to 100 players are split across three teams."},
    {question: "Is WARDOGS a battle royale?", answer: "No. Its main mode is a three-team Control Zone contest."}
  ],
  sources: [{label: "WARDOGS on Steam", url: "https://store.steampowered.com/app/1867240/WARDOGS/", kind: "official", checkedAt: "2026-08-13"}]
};

describe("validateGuideFrontmatter", () => {
  it("accepts a matching record and rejects mismatches or competitor URLs", () => {
    expect(validateGuideFrontmatter(valid, entry).slug).toBe(entry.slug);
    expect(() => validateGuideFrontmatter({...valid, order: 20}, entry)).toThrow(/order/i);
    expect(() => validateGuideFrontmatter({...valid, sources: [{...valid.sources[0], url: "https://wardogshub.gg/"}]}, entry)).toThrow(/source/i);
  });
});
