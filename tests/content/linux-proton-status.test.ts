import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {guideManifest} from "../../src/content/manifest";
import {TOP_GUIDE_SLUGS} from "../../src/features/home/home-data";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const slug = "wardogs-linux-proton";
const officialLinuxStatusUrl = "https://steamcommunity.com/app/1867240/homecontent/";

describe("WARDOGS Linux and Proton status", () => {
  it("publishes the current official support status in every supported locale", async () => {
    expect(guideManifest).toContainEqual(expect.objectContaining({
      category: "guide",
      keyword: "wardogs linux proton",
      slug
    }));
    expect(TOP_GUIDE_SLUGS).toContain(slug);

    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, slug);

      expect(guide, `${locale}/${slug}`).not.toBeNull();
      expect(guide?.frontmatter.updatedAt, locale).toBe("2026-09-05");
      expect(guide?.frontmatter.sources).toContainEqual(expect.objectContaining({
        url: officialLinuxStatusUrl,
        kind: "official",
        checkedAt: "2026-09-05"
      }));
      expect(guide?.frontmatter.faq.length, locale).toBeGreaterThanOrEqual(3);
      expect(guide?.body.length, locale).toBeGreaterThanOrEqual(1_200);
    }
  });

  it("keeps the Linux answer separate from the confirmed Windows requirements", async () => {
    for (const locale of locales) {
      const requirements = await loadGuideDocument(locale, "wardogs-system-requirements");

      expect(requirements?.frontmatter.updatedAt, locale).toBe("2026-09-05");
      expect(requirements?.frontmatter.sources).toContainEqual(expect.objectContaining({
        url: officialLinuxStatusUrl,
        kind: "official",
        checkedAt: "2026-09-05"
      }));
      expect(requirements?.body, locale).toContain("/guides/wardogs-linux-proton");
    }
  });
});
