import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

describe("Russian guide library", () => {
  it("contains localized Cyrillic content for all 43 slugs", async () => {
    await expect(assertCompleteContentMatrix(["en", "ru"])).resolves.toBeUndefined();
    const summaries = await listGuideSummaries("ru");
    expect(summaries).toHaveLength(43);
    for (const summary of summaries) {
      expect(summary.title).toMatch(/[А-Яа-яЁё]/);
      const guide = await loadGuideDocument("ru", summary.slug);
      expect(guide?.body).toMatch(/[А-Яа-яЁё]{4}/);
      expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
    }
  });
});
