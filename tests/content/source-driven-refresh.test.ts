import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const targetSlugs = [
  "wardogs-beginner-guide",
  "wardogs-towers-guide",
  "wardogs-mortar-guide",
  "wardogs-fob-guide",
  "wardogs-controls",
  "wardogs-helicopter-guide",
  "wardogs-playtest",
  "wardogs-beta",
] as const;

describe("source-driven 2026-08-26 content refresh", () => {
  it("publishes a current, source-backed version in every supported locale", async () => {
    for (const locale of locales) {
      for (const slug of targetSlugs) {
        const guide = await loadGuideDocument(locale, slug);

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        const expectedDate = ["wardogs-fob-guide", "wardogs-helicopter-guide"].includes(slug)
          ? "2026-08-29"
          : slug === "wardogs-beginner-guide"
            ? "2026-08-28"
            : "2026-08-26";
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe(expectedDate);
        expect(guide?.frontmatter.sources.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(3);
        expect(guide?.frontmatter.sources.some(({kind}) => kind === "official"), `${locale}/${slug}`).toBe(true);
        expect(guide?.frontmatter.faq.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(3);
        expect(guide?.frontmatter.faq.length, `${locale}/${slug}`).toBeLessThanOrEqual(5);
        expect(guide?.body.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(locale === "ja" ? 1_800 : locale === "zh-cn" ? 2_200 : 3_000);
      }
    }
  });

  it("answers the newly researched field questions without presenting test values as final", async () => {
    for (const locale of locales) {
      const beginner = await loadGuideDocument(locale, "wardogs-beginner-guide");
      const towers = await loadGuideDocument(locale, "wardogs-towers-guide");
      const mortar = await loadGuideDocument(locale, "wardogs-mortar-guide");
      const fob = await loadGuideDocument(locale, "wardogs-fob-guide");
      const controls = await loadGuideDocument(locale, "wardogs-controls");
      const helicopter = await loadGuideDocument(locale, "wardogs-helicopter-guide");
      const playtest = await loadGuideDocument(locale, "wardogs-playtest");
      const beta = await loadGuideDocument(locale, "wardogs-beta");

      expect(beginner?.body).toMatch(/first deployment|erste[nr]? Einsatz|перв.*выход|primeira mobilização|初出撃|首次部署/i);
      expect(towers?.body).toMatch(/digits|Ziffern|цифр|dígitos|数字/i);
      expect(towers?.body).toMatch(/Hot Zone|热区/);
      expect(mortar?.body).toMatch(/azimuth|Azimut|азимут|azimute|方位/i);
      expect(mortar?.body).toMatch(/100\s?[mм米]/i);
      expect(fob?.body).toContain("2x3");
      expect(fob?.body).toMatch(/pallet|Palette|паллет|palete|パレット|托盘/i);
      expect(controls?.body).toMatch(/free.?look|Freelook|свободн.*обзор|visão livre|フリールック|自由观察|免费看法|自由看|免费视觉/i);
      expect(helicopter?.body).toMatch(/go-around|durchstart|уход.*втор|arremet|ゴーアラウンド|复飞|绕行/i);
      expect(playtest?.body).toMatch(/500[, .]?000|50万/i);
      expect(beta?.body).toMatch(/100[, .]?000|10万/i);

      const playtestFaq = playtest?.frontmatter.faq.map(({answer}) => answer).join(" ") ?? "";
      expect(playtestFaq).toMatch(/ended|beendet|заверш|encerrad|終了|结束/i);

      for (const guide of [towers, mortar, fob, controls, helicopter]) {
        expect(guide?.body).toMatch(/build-sensitive|buildabhängig|версии сборки|dependentes? da build|ビルド依存|版本相关|构建敏感/i);
      }
    }
  });

  it("keeps the beta metrics attributed and separate from current player counts", async () => {
    for (const locale of locales) {
      for (const slug of ["wardogs-playtest", "wardogs-beta"] as const) {
        const guide = await loadGuideDocument(locale, slug);
        const sourceUrls = guide?.frontmatter.sources.map(({url}) => url) ?? [];

        expect(sourceUrls).toContain(
          "https://www.pcgamer.com/games/fps/nearly-500k-players-showed-up-for-the-wardogs-beta-the-reaction-from-the-fps-community-has-been-insane/",
        );
        expect(guide?.body).toMatch(/reported|bericht|сообщ|relat|報じ|报道|报告/i);
        expect(guide?.body).toMatch(/not.*current|nicht.*aktuell|не.*текущ|não.*atual|現在.*では(?:ない|ありません)|不是当前|并非当前/i);
      }
    }
  });
});
