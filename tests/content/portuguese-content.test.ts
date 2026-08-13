import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

describe("Brazilian Portuguese guide library", () => {
  it("completes all 80 localized guide documents", async () => {
    await expect(assertCompleteContentMatrix(["en", "ru", "de", "pt-br"])).resolves.toBeUndefined();
    const summaries = await listGuideSummaries("pt-br");
    expect(summaries).toHaveLength(20);
    for (const summary of summaries) {
      expect(summary.title).toMatch(/WARDOGS/);
      const guide = await loadGuideDocument("pt-br", summary.slug);
      expect(guide?.body).toMatch(/\b(não|acesso|jogo|equipe|guia)\b/i);
      expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
    }
  });
});
