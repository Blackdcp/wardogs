import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {getCatalogGuide} from "../../src/features/items/item-catalog-guides";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn"] as const;

describe("Search Console growth pages", () => {
  it("publishes a substantial WARDOGS preload guide in every locale", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-preload");

      expect(guide, `${locale}/wardogs-preload should exist`).not.toBeNull();
      expect(guide?.frontmatter.updatedAt).toBe("2026-09-01");
      expect(guide?.frontmatter.faq.length).toBeGreaterThanOrEqual(3);
      expect(guide?.frontmatter.faq.length).toBeLessThanOrEqual(5);
      expect(guide?.frontmatter.sources.every(({kind}) => kind === "official")).toBe(true);
      expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
      expect(guide?.body).toContain(`/${locale}/items/weapons`);
      expect(guide?.body).not.toContain("](/items/");
    }
  });

  it("uses query-matched metadata for the three high-impression English pages", async () => {
    const beta = await loadGuideDocument("en", "wardogs-beta");
    const ps5 = await loadGuideDocument("en", "wardogs-ps5");
    const release = await loadGuideDocument("en", "wardogs-release-date");
    const earlyAccess = await loadGuideDocument("en", "wardogs-early-access");
    const weapons = getCatalogGuide("weapons");

    expect(beta?.frontmatter.title).toBe("WARDOGS Beta Status: Next Test Date & Access");
    expect(beta?.frontmatter.description).toBe("Check the September 2 WARDOGS Firing Range test time, why it is not an open beta, Steam Playtest access, August beta history, and Early Access.");
    expect(ps5?.frontmatter.title).toBe("Is WARDOGS Coming to PS5 or Xbox? Console Status");
    expect(ps5?.frontmatter.description).toContain("remain unconfirmed");
    expect(release?.frontmatter.title).toBe("WARDOGS Release Date: September 10 Early Access Launch");
    expect(earlyAccess?.frontmatter.title).toBe("WARDOGS Early Access: September 10, Price & Roadmap");
    expect(earlyAccess?.frontmatter.description).toContain("$39.99");
    expect(weapons).toEqual(expect.objectContaining({
        title: "WARDOGS Weapons List: All 38 Documented Weapons",
        description: "Browse all 38 documented WARDOGS pre-release weapon records, including rifles, SMGs, shotguns, launchers, sidearms, and incomplete identifiers with explicit evidence notes."
    }));
  });

  it("connects Russian beta demand to preload, PS5 and catalogue routes", async () => {
    const beta = await loadGuideDocument("ru", "wardogs-beta");
    const preload = await loadGuideDocument("ru", "wardogs-preload");
    const playtest = await loadGuideDocument("ru", "wardogs-playtest");
    const ps5 = await loadGuideDocument("ru", "wardogs-ps5");
    const factions = await loadGuideDocument("ru", "wardogs-factions");
    const steam = await loadGuideDocument("ru", "wardogs-steam");

    expect(beta?.body).toContain("/guides/wardogs-preload");
    expect(beta?.body).toContain("/guides/wardogs-ps5");
    expect(preload?.body).toContain("/ru/items/weapons");
    expect(playtest?.body).toContain("/guides/wardogs-preload");
    expect(playtest?.body).toContain("/guides/wardogs-beta");
    expect(ps5?.body).toContain("/guides/wardogs-early-access");
    expect(ps5?.body).toContain("/guides/wardogs-steam");
    expect(factions?.body).toContain("/guides/wardogs-gameplay");
    expect(factions?.body).toContain("/ru/items/weapons");
    expect(steam?.body).toContain("/guides/wardogs-preload");
    expect(steam?.body).toContain("/guides/wardogs-price");
  });
});
