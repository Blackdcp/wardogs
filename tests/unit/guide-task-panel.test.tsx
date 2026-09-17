import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {GuideTaskPanel} from "../../src/components/guides/guide-task-panel";
import {
  getGuideTaskData,
  getGuideTaskUi,
  guideTaskSlugs
} from "../../src/features/guides/guide-task-data";
import {locales, type Locale} from "../../src/config/site";

const expectedSlugs = [
  "wardogs-ammo-reload-guide",
  "wardogs-beginner-guide",
  "wardogs-money-guide",
  "wardogs-best-settings",
  "wardogs-community-servers-guide",
  "wardogs-controls",
  "wardogs-fob-guide",
  "wardogs-cargo-guide",
  "wardogs-mortar-guide",
  "wardogs-helicopter-guide",
  "wardogs-ps5",
  "wardogs-progression-wipes-guide",
  "wardogs-best-weapons-loadouts",
  "wardogs-equipment-tools-guide",
  "wardogs-crash-fix",
  "wardogs-map"
] as const;

const ps5UnconfirmedPatterns: Record<Locale, RegExp> = {
  en: /not officially confirmed/i,
  de: /nicht offiziell best.tigt/i,
  ru: /.фициально не подтвержд/i,
  "pt-br": /n.o .*oficialmente confirmada/i,
  ja: /公式.*確認されていません/,
  "zh-cn": /尚未得到官方确认/
};

const controlsVerificationPatterns: Record<Locale, RegExp> = {
  en: /current in-game binding/i,
  de: /aktuelle.*Belegung.*Spiel/i,
  ru: /текущ.*назнач.*игр/i,
  "pt-br": /vincula..o atual.*jogo/i,
  ja: /現在のゲーム内.*割り当て/,
  "zh-cn": /当前游戏内绑定/
};

describe("guide task data", () => {
  it("covers exactly the sixteen approved high-intent guides", () => {
    expect(guideTaskSlugs).toEqual(expectedSlugs);
    expect(new Set(guideTaskSlugs).size).toBe(expectedSlugs.length);
  });

  it("returns a direct answer, caution, and three to eight actionable steps in every locale", () => {
    for (const locale of locales) {
      for (const slug of expectedSlugs) {
        const task = getGuideTaskData(slug, locale);

        expect(task, `${locale}/${slug}`).toBeDefined();
        expect(task?.eyebrow.trim().length, `${locale}/${slug} eyebrow`).toBeGreaterThan(0);
        expect(task?.title.trim().length, `${locale}/${slug} title`).toBeGreaterThan(0);
        expect(task?.directAnswer.trim().length, `${locale}/${slug} answer`).toBeGreaterThan(0);
        expect(task?.steps.length, `${locale}/${slug} steps`).toBeGreaterThanOrEqual(3);
        expect(task?.steps.length, `${locale}/${slug} steps`).toBeLessThanOrEqual(8);
        expect(task?.steps.every((step) => step.trim().length > 0), `${locale}/${slug} step copy`).toBe(true);
        expect(task?.caution?.trim().length, `${locale}/${slug} caution`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps platform timing and control bindings explicitly unconfirmed until checked", () => {
    for (const locale of locales) {
      const ps5 = getGuideTaskData("wardogs-ps5", locale)!;
      const controls = getGuideTaskData("wardogs-controls", locale)!;

      expect(`${ps5.directAnswer} ${ps5.caution}`, locale).toMatch(ps5UnconfirmedPatterns[locale]);
      expect(`${controls.directAnswer} ${controls.steps.join(" ")}`, locale).toMatch(controlsVerificationPatterns[locale]);
    }
  });

  it("provides complete checklist interface copy in every locale", () => {
    for (const locale of locales) {
      const ui = getGuideTaskUi(locale);
      expect(Object.values(ui).every((value) => value.trim().length > 0), locale).toBe(true);
    }
  });

  it("does not create task data for an unrelated guide", () => {
    expect(getGuideTaskData("wardogs-release-date", "en")).toBeUndefined();
  });
});

describe("GuideTaskPanel", () => {
  it("renders an accessible interactive checklist with a stable progress region", () => {
    const task = getGuideTaskData("wardogs-beginner-guide", "en")!;
    const html = renderToStaticMarkup(<GuideTaskPanel data={task} locale="en" />);

    expect(html).toContain('data-guide-task-panel="wardogs-beginner-guide"');
    expect(html.match(/type="checkbox"/g)).toHaveLength(task.steps.length);
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('<progress');
    expect(html).toContain('min-h-');
    expect(html).toContain("0 of 5 steps complete");
  });

  it("uses unique ids and one task heading per rendered route", () => {
    for (const locale of locales) {
      for (const slug of expectedSlugs) {
        const html = renderToStaticMarkup(<GuideTaskPanel data={getGuideTaskData(slug, locale)!} locale={locale} />);
        const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);

        expect(new Set(ids).size, `${locale}/${slug}`).toBe(ids.length);
        expect(html.match(/data-guide-task-heading/g), `${locale}/${slug}`).toHaveLength(1);
      }
    }
  });
});
