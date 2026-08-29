import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

describe("English guide library", () => {
  it("contains 39 substantial, unique, manifest-matched guides", async () => {
    await expect(assertCompleteContentMatrix(["en"])).resolves.toBeUndefined();
    const summaries = await listGuideSummaries("en");
    expect(summaries).toHaveLength(39);
    expect(new Set(summaries.map(({title}) => title)).size).toBe(39);
    expect(new Set(summaries.map(({description}) => description)).size).toBe(39);
    for (const summary of summaries) {
      const guide = await loadGuideDocument("en", summary.slug);
      expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
      expect(guide?.frontmatter.faq.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("preserves verified faction lore and direct official Alpha sourcing", async () => {
    const factions = await loadGuideDocument("en", "wardogs-factions");
    const alpha = await loadGuideDocument("en", "wardogs-alpha");

    expect(factions?.body).toContain("Western paramilitary");
    expect(factions?.body).toContain("Soviet People's Republic");
    expect(factions?.body).toContain("Kingdom of Persia");
    expect(factions?.body).toContain("Kolchia");
    expect(factions?.body).toContain("PV-1");
    expect(
      factions?.frontmatter.sources.some(({url}) => url.includes("1825093633182385")),
    ).toBe(true);
    expect(
      alpha?.frontmatter.sources.some(({url}) => url.includes("1840310314354505")),
    ).toBe(true);
  });

  it("keeps required headings, videos, and creator sources in their approved guides", async () => {
    const verification = await loadGuideDocument("en", "wardogs-discord-account-verification");
    const firstLook = await loadGuideDocument("en", "wardogs-first-look");
    const trailer = await loadGuideDocument("en", "wardogs-trailer");
    const summaries = await listGuideSummaries("en");

    expect(verification?.body).toContain("## Steam/Discord");
    for (const id of ["-k6IV0ITLDo", "eAE9LOV-p3s", "83AVH6FtemY"]) {
      expect(firstLook?.body).toContain(`id="${id}"`);
    }
    expect(firstLook?.body).toContain('title="WARDOGS Gameplay and Impressions..."');
    expect(firstLook?.body).toContain('title="WARDOGS Alpha - Gameplay and Impressions!"');
    expect(firstLook?.frontmatter.sources.some(({label}) => label.includes("jackfrags"))).toBe(true);
    expect(firstLook?.frontmatter.sources.some(({label}) => label.includes("FRANKIEonPC"))).toBe(true);
    expect(trailer?.body).toContain('id="hVtmnaUCpuQ"');

    const creatorVideoIds = ["-k6IV0ITLDo", "eAE9LOV-p3s", "83AVH6FtemY"];
    const approvedGuideSources = new Map([
      ["-k6IV0ITLDo", new Set(["wardogs-first-look", "wardogs-fob-guide", "wardogs-best-settings"])],
      ["eAE9LOV-p3s", new Set(["wardogs-first-look"])],
      ["83AVH6FtemY", new Set(["wardogs-first-look"])],
    ]);
    for (const summary of summaries) {
      const guide = await loadGuideDocument("en", summary.slug);
      for (const id of creatorVideoIds) {
        if (approvedGuideSources.get(id)?.has(summary.slug)) continue;
        expect(guide?.body).not.toContain(id);
        expect(guide?.frontmatter.sources.some(({url}) => url.includes(id))).toBe(false);
      }
    }
  });
});
