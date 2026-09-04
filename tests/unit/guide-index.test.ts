import {describe, expect, it} from "vitest";
import {buildGuideIndex} from "../../src/features/guides/guide-index";
import {guideManifest} from "../../src/content/manifest";

describe("guide index", () => {
  it("returns every card in manifest order with valid targets", async () => {
    const cards = await buildGuideIndex("en");
    expect(cards).toHaveLength(guideManifest.length);
    expect(cards.map(({slug}) => slug)).toEqual(guideManifest.map(({slug}) => slug));
    expect(cards.every(({title, description, slug}) => Boolean(title && description && slug))).toBe(true);
  });
});
