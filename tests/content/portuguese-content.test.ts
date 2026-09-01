import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

describe("localized guide library", () => {
  it("completes all 270 localized guide documents", async () => {
    await expect(assertCompleteContentMatrix(["en", "ru", "de", "pt-br", "ja"])).resolves.toBeUndefined();
    const summaries = await listGuideSummaries("pt-br");
    expect(summaries).toHaveLength(45);
    for (const summary of summaries) {
      expect(summary.title).toMatch(/WARDOGS/);
      const guide = await loadGuideDocument("pt-br", summary.slug);
      expect(guide?.body).toMatch(/\b(não|acesso|jogo|equipe|guia)\b/i);
      expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
    }
  });

  it("publishes a substantial Japanese translation for every guide", async () => {
    const summaries = await listGuideSummaries("ja");
    expect(summaries).toHaveLength(45);
    for (const summary of summaries) {
      const guide = await loadGuideDocument("ja", summary.slug);
      expect(guide?.body).toMatch(/[ぁ-んァ-ン一-龯]/);
      expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
    }
  });
});
