import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

describe("German guide library", () => {
  it("contains 20 localized guides without copying English bodies", async () => {
    await expect(assertCompleteContentMatrix(["en", "de"])).resolves.toBeUndefined();
    const summaries = await listGuideSummaries("de");
    const english = await listGuideSummaries("en");
    expect(summaries).toHaveLength(20);
    const englishBySlug = new Map(english.map((guide) => [guide.slug, guide]));
    for (const summary of summaries) {
      expect(summary.description).not.toBe(englishBySlug.get(summary.slug)?.description);
      const deGuide = await loadGuideDocument("de", summary.slug);
      const enGuide = await loadGuideDocument("en", summary.slug);
      expect(deGuide?.body).not.toBe(enGuide?.body);
      expect(deGuide?.body.length).toBeGreaterThanOrEqual(1_200);
    }
  });
});
