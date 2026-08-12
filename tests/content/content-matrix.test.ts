import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

describe("English guide library", () => {
  it("contains 20 substantial, unique, manifest-matched guides", async () => {
    await expect(assertCompleteContentMatrix(["en"])).resolves.toBeUndefined();
    const summaries = await listGuideSummaries("en");
    expect(summaries).toHaveLength(20);
    expect(new Set(summaries.map(({title}) => title)).size).toBe(20);
    expect(new Set(summaries.map(({description}) => description)).size).toBe(20);
    for (const summary of summaries) {
      const guide = await loadGuideDocument("en", summary.slug);
      expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
      expect(guide?.frontmatter.faq.length).toBeGreaterThanOrEqual(2);
    }
  });
});
