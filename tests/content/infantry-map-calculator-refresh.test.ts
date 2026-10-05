import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {loadGuideDocument} from "../../src/content/guides";
import {getHomePriorityGuideEntries, TOP_GUIDE_SLUGS} from "../../src/features/home/home-traffic-assets";

describe("Infantry mode, map and calculator growth refresh", () => {
  it.each(locales)("publishes the Infantry Mode hub in %s with current official change context", async (locale) => {
    const guide = await loadGuideDocument(locale, "wardogs-infantry-mode");
    expect(guide).not.toBeNull();
    expect(guide?.frontmatter.keyword).toBe("wardogs infantry mode");
    expect(guide?.frontmatter.updatedAt).toBe("2026-10-04");
    expect(guide?.frontmatter.sources).toContainEqual(expect.objectContaining({
      url: "https://store.steampowered.com/news/app/1867240/view/712287592723252267",
      kind: "official"
    }));
    expect(guide?.body).toContain(`/${locale}/tools/map`);
    expect(guide?.body).toContain(`/${locale}/tools/artillery-calculator`);
    expect(guide?.body).toMatch(/IR Rangefinder|IR\/CWIS|CWIS|CIWS/);
  });

  it("promotes Infantry Mode before evergreen guides on the homepage", () => {
    expect(TOP_GUIDE_SLUGS[0]).toBe("wardogs-infantry-mode");
    const guides = TOP_GUIDE_SLUGS.map((slug) => ({slug, updatedAt: "2026-10-04"}));
    expect(getHomePriorityGuideEntries(guides, "en")[0]?.slug).toBe("wardogs-infantry-mode");
  });
});
