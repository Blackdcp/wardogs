import {describe, expect, it} from "vitest";
import {locales, type Locale} from "../../src/config/site";
import {prepareGuideBodyForTaskPanel} from "../../src/features/guides/guide-task-body";

const headings: Record<Locale, readonly string[]> = {
  en: ["Quick Answer", "Season 1 Quick Answer"],
  de: ["Kurzantwort"],
  ru: ["Краткий ответ"],
  "pt-br": ["Resposta rápida"],
  ja: ["まず覚えること"],
  "zh-cn": ["快速结论"]
};

describe("prepareGuideBodyForTaskPanel", () => {
  it("removes only the localized level-two quick-answer section when task data exists", () => {
    for (const locale of locales) {
      for (const heading of headings[locale]) {
        const body = [
          "Opening paragraph.",
          "",
          `## ${heading}`,
          "",
          "Duplicate direct answer.",
          "",
          "### Detail inside the answer",
          "",
          "Still part of the duplicate answer.",
          "",
          "## Preserved workflow",
          "",
          "Keep this section and its body."
        ].join("\n");

        const result = prepareGuideBodyForTaskPanel(body, locale, true);

        expect(result, `${locale}/${heading}`).not.toContain(`## ${heading}`);
        expect(result, `${locale}/${heading}`).not.toContain("Duplicate direct answer.");
        expect(result, `${locale}/${heading}`).not.toContain("### Detail inside the answer");
        expect(result, `${locale}/${heading}`).toContain("Opening paragraph.");
        expect(result, `${locale}/${heading}`).toContain("## Preserved workflow");
        expect(result, `${locale}/${heading}`).toContain("Keep this section and its body.");
      }
    }
  });

  it("returns the untouched body when task data does not exist", () => {
    const body = "Intro\r\n\r\n## Quick Answer\r\n\r\nKeep this on an unrelated guide.\r\n\r\n## Details\r\n\r\nUnchanged.";

    expect(prepareGuideBodyForTaskPanel(body, "en", false)).toBe(body);
  });

  it("does not remove a similarly named non-level-two section", () => {
    const body = "### Quick Answer\n\nKeep this subsection.\n\n## Details\n\nKeep details.";

    expect(prepareGuideBodyForTaskPanel(body, "en", true)).toBe(body);
  });
});
