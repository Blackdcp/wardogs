import {describe, expect, it} from "vitest";
import {guideManifest} from "../../src/content/manifest";
import {locales} from "../../src/config/site";
import {GUIDE_COLLECTIONS, getGuideHubCopy, groupGuideCollections} from "../../src/features/guides/guide-collections";

 describe("guide collections", () => {
  it("preserves every existing route exactly once", () => {
    const grouped = groupGuideCollections(guideManifest);
    const slugs = grouped.flatMap((collection) => collection.guides.map((guide) => guide.slug));
    expect(slugs.length).toBe(guideManifest.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(slugs)).toEqual(new Set(guideManifest.map((guide) => guide.slug)));
    for (const group of GUIDE_COLLECTIONS) for (const slug of group.slugs) expect(guideManifest.some((guide) => guide.slug === slug), slug).toBe(true);
  });
  it("preserves the established collection fragment destinations", () => {
    expect(groupGuideCollections(guideManifest).map(({key}) => `#collection-${key}`)).toEqual([
      "#collection-start", "#collection-combat", "#collection-logistics", "#collection-progression", "#collection-fixes", "#collection-reference"
    ]);
  });
  it("does not invent cards for missing content", () => {
    expect(groupGuideCollections([])).toEqual([]);
    expect(groupGuideCollections([{slug: "future-guide"}])).toEqual([{key: "reference", guides: [{slug: "future-guide"}]}]);
  });
  it("provides localized labels for every supported locale", () => {
    for (const locale of locales) {
      const copy = getGuideHubCopy(locale);
      expect(copy.title).toBeTruthy();
      for (const collection of GUIDE_COLLECTIONS) expect(copy.collections[collection.key]).toBeTruthy();
    }
  });
});
