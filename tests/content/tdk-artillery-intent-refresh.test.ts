import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {getItemBySlug} from "../../src/features/items/item-library";
import {buildItemMetadata} from "../../src/lib/item-metadata";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const;

describe("artillery search-intent separation", () => {
  it("distinguishes the English operating guide without renaming the model record", async () => {
    const guide = await loadGuideDocument("en", "wardogs-artillery-guide");
    const item = getItemBySlug("sph-2")!;
    const metadata = buildItemMetadata("en", item);
    expect(guide?.frontmatter.title).toBe("WARDOGS SPH-2 Artillery Guide: Crew, Aiming & Reloading");
    expect(metadata.title).toBe("WARDOGS SPH-2: Season 1 Unlock & Artillery Guide");
    expect(guide?.frontmatter.title).not.toBe(metadata.title);
    expect(guide?.frontmatter.keyword).toBe("wardogs artillery guide");
    expect(guide?.frontmatter.description).toBe("Operate SPH-2 artillery with crew roles, map ranging and the manual reload sequence. Check Season 1 unlocks, reported costs and counter-battery risks.");
    expect(item.relatedGuides).toContain("wardogs-artillery-guide");
    expect(metadata.alternates?.canonical).toContain("/en/items/vehicles/sph-2");
  });

  it.each(locales)("connects model, progression and observed-cost planning in %s", async (locale) => {
    const guide = await loadGuideDocument(locale, "wardogs-artillery-guide");
    expect(guide).not.toBeNull();
    expect(guide?.body).toContain(`/${locale}/items/vehicles/sph-2`);
    expect(guide?.body).toContain(`/${locale}/guides/wardogs-progression-wipes-guide`);
    expect(guide?.body).toContain(`/${locale}/tools/loadout-budget?pick=vehicles%2Fsph-2`);
    expect(guide?.body).toContain("Career");
    expect(guide?.body).toContain("Driver");
    expect(guide?.frontmatter.title).toContain("SPH-2");
    expect(guide?.frontmatter.sources).toContainEqual(expect.objectContaining({
      kind: "official",
      url: "https://store.steampowered.com/app/1867240/WARDOGS/"
    }));
  });

  it.each(locales)("routes joined squads to the existing voice diagnosis in %s", async (locale) => {
    const guide = await loadGuideDocument(locale, "wardogs-squad-guide");
    expect(guide?.frontmatter.keyword).toBe("wardogs squad guide");
    expect(guide?.body).toContain(`/${locale}/guides/wardogs-known-issues`);
  });
});
