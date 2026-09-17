import {describe, expect, it} from "vitest";
import {buildGuideIndex} from "../../src/features/guides/guide-index";
import {guideManifest} from "../../src/content/manifest";
import {getGuideTaskData, guideTaskSlugs} from "../../src/features/guides/guide-task-data";
import {locales} from "../../src/config/site";

describe("guide index", () => {
  it("returns every card in manifest order with valid targets", async () => {
    const cards = await buildGuideIndex("en");
    expect(cards).toHaveLength(guideManifest.length);
    expect(cards.map(({slug}) => slug)).toEqual(guideManifest.map(({slug}) => slug));
    expect(cards.every(({title, description, slug}) => Boolean(title && description && slug))).toBe(true);
  });

  it("keeps every task-first guide on an existing canonical guide route", () => {
    const manifestSlugs = new Set(guideManifest.map(({slug}) => slug));

    for (const slug of guideTaskSlugs) {
      expect(manifestSlugs.has(slug), slug).toBe(true);
      for (const locale of locales) {
        expect(getGuideTaskData(slug, locale), `${locale}/${slug}`).toBeDefined();
      }
    }
  });
});
