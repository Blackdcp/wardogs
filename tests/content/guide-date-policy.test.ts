import {readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import matter from "gray-matter";
import {describe, expect, it, vi} from "vitest";
import {SourceList} from "../../src/components/guides/source-list";

const translation = vi.hoisted(() => ({article: {} as Record<string, string>}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => translation.article[key]
}));

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const;
const excluded = new Set(["wardogs-progression-wipes-guide.mdx", "wardogs-season-2.mdx"]);
const substantiveUpdates = ["wardogs-cargo-guide", "wardogs-fob-guide", "wardogs-medic-revive-guide", "wardogs-controls", "wardogs-best-weapons-loadouts", "wardogs-money-guide", "wardogs-ammo-reload-guide"];
const policy = {
  en: {updated: "Content updated", source: "Source checked", sourceScope: /Check dates apply separately/, historical: "Historical checkpoint"},
  ru: {updated: "Контент обновлён", source: "Источник проверен", sourceScope: /Даты проверки относятся к отдельным источникам/, historical: "Историческая контрольная точка"},
  de: {updated: "Inhalt aktualisiert", source: "Quelle geprüft", sourceScope: /Prüfdaten gelten einzeln/, historical: "Historischer Prüfpunkt"},
  "pt-br": {updated: "Conteúdo atualizado", source: "Fonte verificada", sourceScope: /As datas se aplicam separadamente/, historical: "Registro histórico"},
  ja: {updated: "内容更新", source: "情報源の確認日", sourceScope: /確認日は下記の各情報源に個別に適用/, historical: "過去の確認記録"},
  "zh-cn": {updated: "内容更新", source: "该来源核查于", sourceScope: /核查日期按下方每条来源分别记录/, historical: "历史 checkpoint"},
  "zh-tw": {updated: "內容更新", source: "該來源核查於", sourceScope: /核查日期按下方每條來源分別記錄/, historical: "歷史 checkpoint"},
  pl: {updated: "Treść zaktualizowana", source: "Źródło sprawdzono", sourceScope: /Daty sprawdzenia dotyczą osobno źródeł/, historical: "Historyczny punkt kontrolny"}
};
const sourceHeading = /^## (?:Sources and Last Checked|Источники и (?:последняя проверка|дата проверки)|Quellen und (?:letzte Prüfung|letzter Check|Prüfdatum)|Fontes e (?:última verificação|data da verificação)|情報源と(?:最終確認|確認日)|来源[和与](?:最后检查|核查说明|核查日期)|來源[和與](?:最後檢查|核查說明|核查日期)|Źródła i (?:data weryfikacji|ostatnia weryfikacja|ostatnie sprawdzenie))$/;
const blanketClaim = /This page was (?:last )?checked|Stronę (?:ostatnio )?sprawdzono|最后(?:人工)?核查日期为|最後(?:人工)?核查日期為|were last checked on September 9|ostatnio sprawdzono je 9 września/;
const unboundedLatestPatch = /(?:Patch 0\.11[^.\n]{0,70}(?:latest|neueste|последн|mais recente|最新|najnowsz))|(?:(?:latest|neueste|последн|mais recente|最新|najnowsz)[^.\n]{0,60}Patch 0\.11)/i;

function guides(locale: (typeof locales)[number]) {
  const directory = join(process.cwd(), "content", locale, "guides");
  return readdirSync(directory)
    .filter((name) => name.endsWith(".mdx") && !excluded.has(name))
    .map((name) => ({name, ...matter(readFileSync(join(directory, name), "utf8"))}));
}

describe("guide content and source date policy", () => {
  it.each(locales)("separates article updates from individual source checks in %s", (locale) => {
    const messages = JSON.parse(readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"));
    expect(messages.article.contentUpdated).toBe(policy[locale].updated);
    expect(messages.article.sourceChecked).toBe(policy[locale].source);
    expect(messages.article.contentUpdated).not.toBe(messages.article.sourceChecked);
    expect(messages.article.sourceDateNote.length).toBeGreaterThan(60);
    expect(messages.article.sourceDateNote).not.toMatch(/2026-09-30|September 30|30 сентября/);

    translation.article = messages.article;
    const html = renderToStaticMarkup(createElement(SourceList, {
      title: messages.article.sources,
      checkedLabel: messages.article.sourceChecked,
      sources: [
        {label: "Older source", url: "https://example.com/older", kind: "official", checkedAt: "2026-08-23"},
        {label: "Later source", url: "https://example.com/later", kind: "creator", checkedAt: "2026-09-17"}
      ]
    }));
    expect(html).toContain(messages.article.sourceChecked);
    expect(html).toContain(messages.article.sourceDateNote);
    expect(html).toContain('<time dateTime="2026-08-23">2026-08-23</time>');
    expect(html).toContain('<time dateTime="2026-09-17">2026-09-17</time>');
    const dateRows = html.match(/<p class="mt-1 text-xs uppercase[^>]*>.*?<\/p>/g) ?? [];
    expect(dateRows).toHaveLength(2);
    for (const row of dateRows) expect(row).not.toContain(messages.article.contentUpdated);
    expect(html).not.toContain("2026-09-30");
    expect(html).toContain('href="https://example.com/older"');
  });

  it.each(locales)("uses per-source footer dates without blanket checks in %s", (locale) => {
    let sourceSections = 0;
    for (const guide of guides(locale)) {
      for (const section of guide.content.split(/(?=^## )/m)) {
        if (!sourceHeading.test(section.split(/\r?\n/)[0])) continue;
        sourceSections += 1;
        expect(section, `${locale}/${guide.name}`).toMatch(policy[locale].sourceScope);
        expect(section, `${locale}/${guide.name}`).not.toMatch(blanketClaim);
      }
    }
    expect(sourceSections).toBeGreaterThan(0);
  });

  it.each(locales)("labels retained dated checkpoints as history in %s", (locale) => {
    let historicalSections = 0;
    for (const guide of guides(locale)) {
      let coveredByNotice = false;
      for (const section of guide.content.split(/(?=^## )/m)) {
        if (!section.startsWith(`## ${policy[locale].historical}:`)) {
          coveredByNotice = false;
          continue;
        }
        historicalSections += 1;
        const firstParagraph = section.trim().split(/\r?\n\r?\n/)[1];
        const hasScopeNotice = /not a new check|не к новой проверке|keine neue Prüfung|não uma nova verificação|新たに検証したものではありません|不代表今天重新核验|不代表今天重新核驗|nie nową weryfikację/.test(firstParagraph ?? "");
        if (hasScopeNotice) {
          expect(coveredByNotice, `${locale}/${guide.name}: duplicate adjacent notice`).toBe(false);
          coveredByNotice = true;
        } else {
          expect(coveredByNotice, `${locale}/${guide.name}: missing historical scope`).toBe(true);
        }
        expect(section).not.toMatch(/\*\*(?:Current build note|Текущая сборка|Hinweis zum aktuellen Build|Nota da build atual|現行ビルド|当前版本说明|當前版本說明|Uwaga o aktualn)[^*]*\*\*/);
      }
    }
    expect(historicalSections).toBeGreaterThan(0);
  });

  it.each(locales)("dates the seven substantive guide updates without refreshing their source checkpoints in %s", (locale) => {
    for (const slug of substantiveUpdates) {
      const guide = guides(locale).find(({data}) => data.slug === slug)!;
      expect(guide.data.updatedAt >= "2026-09-30", `${locale}/${slug}`).toBe(true);
      expect(guide.data.sources.some(({checkedAt}: {checkedAt: string}) => checkedAt < guide.data.updatedAt), `${locale}/${slug}`).toBe(true);
    }
  });

  it.each(locales)("does not turn a dated Patch 0.11 note into an undated latest-build claim in %s", (locale) => {
    for (const guide of guides(locale)) {
      const text = `${guide.content}\n${guide.data.faq.map(({answer}: {answer: string}) => answer).join("\n")}`;
      expect(text, `${locale}/${guide.name}`).not.toMatch(unboundedLatestPatch);
    }
  });

  it("retains distinct historical source dates rather than refreshing them with the article", () => {
    for (const locale of locales) {
      const guide = guides(locale).find(({name}) => name === "wardogs-best-weapons-loadouts.mdx")!;
      const dates = guide.data.sources.map(({checkedAt}: {checkedAt: string}) => checkedAt);
      expect(dates, locale).toContain(locale.startsWith("zh-") ? "2026-09-01" : "2026-08-30");
      expect(dates, locale).toContain("2026-09-23");
      expect(dates, locale).not.toContain("2026-09-30");
    }
  });
});
