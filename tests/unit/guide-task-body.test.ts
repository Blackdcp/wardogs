import {describe, expect, it} from "vitest";
import {locales, type Locale} from "../../src/config/site";
import {loadGuideDocument} from "../../src/content/guides";
import {prepareGuideBodyForTaskPanel} from "../../src/features/guides/guide-task-body";
import {guideTaskSlugs} from "../../src/features/guides/guide-task-data";

const headings: Record<Locale, readonly string[]> = {
  en: ["Quick Answer", "Season 1 Quick Answer"],
  de: ["Kurzantwort", "Direkte Antwort"],
  ru: ["Краткий ответ", "Короткий ответ"],
  "pt-br": ["Resposta rápida", "Resposta direta"],
  ja: ["まず覚えること", "先に結論", "最初の結論", "結論", "現在の結論"],
  "zh-cn": ["快速结论", "直接结论"]
};

function levelTwoSections(body: string) {
  return [...body.matchAll(/^##[ \t]+(.+?)[ \t]*\r?$/gm)].map((match) => ({
    heading: match[1],
    rawHeading: match[0],
    start: match.index
  }));
}

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

  it("removes the real localized answer section across the complete target matrix", async () => {
    const seenVariants = new Set<string>();
    let loadedBodies = 0;

    for (const locale of locales) {
      for (const slug of guideTaskSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        expect(guide, `${locale}/${slug} source`).not.toBeNull();

        const body = guide!.body;
        const sections = levelTwoSections(body);
        const quickAnswerIndex = sections.findIndex(({heading}) => headings[locale].includes(heading));
        const result = prepareGuideBodyForTaskPanel(body, locale, true);
        loadedBodies += 1;

        if (quickAnswerIndex === -1) {
          expect(result, `${locale}/${slug} without a dedicated answer section`).toBe(body);
          continue;
        }

        const quickAnswer = sections[quickAnswerIndex];
        const nextSection = sections[quickAnswerIndex + 1];
        expect(nextSection, `${locale}/${slug} next level-two section`).toBeDefined();

        const expectedBody = body.slice(0, quickAnswer.start) + body.slice(nextSection.start);
        const followingSection = sections[quickAnswerIndex + 2];
        const preservedNextSection = body.slice(nextSection.start, followingSection?.start ?? body.length).trim();

        seenVariants.add(`${locale}:${quickAnswer.heading}`);
        expect(result, `${locale}/${slug} transformed body`).toBe(expectedBody);
        expect(result, `${locale}/${slug} removed heading`).not.toContain(quickAnswer.rawHeading);
        expect(result, `${locale}/${slug} next heading`).toContain(nextSection.rawHeading);
        expect(result, `${locale}/${slug} next section content`).toContain(preservedNextSection);
      }
    }

    expect(loadedBodies).toBe(guideTaskSlugs.length * locales.length);
    for (const locale of locales) {
      for (const heading of headings[locale]) {
        expect(seenVariants, `${locale}:${heading} appears in real target content`).toContain(`${locale}:${heading}`);
      }
    }
  });
});
