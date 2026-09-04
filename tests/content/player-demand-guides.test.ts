import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const newGuideSlugs = [
  "wardogs-crash-fix",
  "wardogs-towers-guide",
  "wardogs-money-guide",
  "wardogs-helicopter-guide",
  "wardogs-mortar-guide"
] as const;

describe("player-demand guide cluster", () => {
  it("publishes every new guide in all five supported locales", async () => {
    for (const locale of locales) {
      for (const slug of newGuideSlugs) {
        const guide = await loadGuideDocument(locale, slug);

        expect(guide, `${locale}/${slug}`).toBeDefined();
        expect(["2026-08-22", "2026-08-23", "2026-08-24", "2026-08-25", "2026-08-26", "2026-08-28", "2026-08-29", "2026-09-01", "2026-09-04"], `${locale}/${slug}`).toContain(guide?.frontmatter.updatedAt);
        expect(guide?.frontmatter.faq.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(3);
        expect(guide?.frontmatter.faq.length, `${locale}/${slug}`).toBeLessThanOrEqual(5);
        expect(guide?.frontmatter.sources.length, `${locale}/${slug}`).toBeGreaterThan(0);
        expect(guide?.body.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(locale === "ja" ? 1_200 : 1_800);
        expect(guide?.body.match(/^## /gm)?.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it("answers the concrete problems found in player and video research", async () => {
    const crash = await loadGuideDocument("en", "wardogs-crash-fix");
    const towers = await loadGuideDocument("en", "wardogs-towers-guide");
    const money = await loadGuideDocument("en", "wardogs-money-guide");
    const helicopter = await loadGuideDocument("en", "wardogs-helicopter-guide");
    const mortar = await loadGuideDocument("en", "wardogs-mortar-guide");

    expect(crash?.body).toContain("KB5121003");
    expect(crash?.body).toMatch(/community workaround/i);
    expect(towers?.body).toContain("Control Zone");
    expect(towers?.body).toContain("Hot Zone");
    expect(towers?.body).toMatch(/tower terminal/i);
    expect(money?.body).toContain("$10,000");
    expect(money?.body).toMatch(/reviv|transport|suppl/i);
    expect(helicopter?.body).toContain("HOTAS");
    expect(helicopter?.body).toMatch(/landing|transport/i);
    expect(mortar?.body).toMatch(/spotter/i);
    expect(mortar?.body).toContain("FOB");
    expect(mortar?.body).toMatch(/counter/i);
  });
});
