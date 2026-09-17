import type {Locale} from "@/config/site";

const quickAnswerHeadings: Record<Locale, ReadonlySet<string>> = {
  en: new Set(["Quick Answer", "Season 1 Quick Answer"]),
  de: new Set(["Kurzantwort", "Direkte Antwort"]),
  ru: new Set(["Краткий ответ", "Короткий ответ"]),
  "pt-br": new Set(["Resposta rápida", "Resposta direta"]),
  ja: new Set(["まず覚えること", "先に結論", "最初の結論", "結論", "現在の結論"]),
  "zh-cn": new Set(["快速结论", "直接结论"])
};

export function prepareGuideBodyForTaskPanel(body: string, locale: Locale, hasTaskData: boolean) {
  if (!hasTaskData) return body;

  const levelTwoHeading = /^##[ \t]+(.+?)[ \t]*\r?$/gm;
  let quickAnswerMatch: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;

  while ((match = levelTwoHeading.exec(body)) !== null) {
    if (quickAnswerHeadings[locale].has(match[1])) {
      quickAnswerMatch = match;
      break;
    }
  }

  if (!quickAnswerMatch) return body;

  levelTwoHeading.lastIndex = quickAnswerMatch.index + quickAnswerMatch[0].length;
  const nextSection = levelTwoHeading.exec(body);
  const sectionEnd = nextSection?.index ?? body.length;

  return body.slice(0, quickAnswerMatch.index) + body.slice(sectionEnd);
}
