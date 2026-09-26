import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {CURRENT_EVENT} from "../../src/features/live-ops/current-event";
import {getPublicStatus} from "../../src/features/live-ops/public-status";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const statusGuides = [
  "wardogs-beta",
  "wardogs-playtest",
  "wardogs-download",
  "wardogs-preload",
  "wardogs-launch-checklist",
  "wardogs-known-issues",
  "wardogs-release-date",
] as const;

const endedSignals = {
  en: /beta 02 (?:has )?ended|beta 02 ended/i,
  de: /beta 02 (?:ist )?beendet/i,
  ru: /beta 02 заверш/i,
  "pt-br": /beta 02 (?:foi )?encerrad/i,
  ja: /beta 02.*終了/i,
  "zh-cn": /beta 02.*(?:已经|已)结束/i,
} as const;

const liveSignals = {
  en: /Early Access (?:is live|launched)|live in (?:Steam )?Early Access/i,
  de: /Early Access (?:ist live|startete)|im Steam Early Access live/i,
  ru: /Early Access.*(?:запущен|начал|вышла|доступна)|доступна в Steam Early Access/i,
  "pt-br": /Acesso Antecipado (?:disponível|começou|entrou)|disponível no Acesso Antecipado/i,
  ja: /Early Access.*(?:配信中|開始)/,
  "zh-cn": /(?:已在 Steam 抢先体验上线|抢先体验.*(?:已上线|已经上线|开启))/,
} as const;

const staleBetaSignals = {
  en: /Beta 02 is live/i,
  de: /Beta 02 läuft jetzt/i,
  ru: /Beta 02 ид[её]т сейчас/i,
  "pt-br": /Beta 02 está ao vivo/i,
  ja: /Beta 02.*実施中/,
  "zh-cn": /Beta 02.*正在进行/,
} as const;

describe("September 17 Early Access operations", () => {
  it("publishes Early Access as live while preserving ended Beta 02 history", () => {
    expect(CURRENT_EVENT.status).toBe("live");

    const status = getPublicStatus();
    expect(status.schemaVersion).toBe(2);
    expect(status.dataAsOf).toBe("2026-09-26");
    expect(status.currentEvent).toMatchObject({
      id: "early-access-patch-0-11",
      name: "Early Access - Patch 0.11",
      status: "live",
      launchedOn: "2026-09-10",
    });
    expect(status.historicalEvents).toContainEqual(expect.objectContaining({
      id: "closed-beta-02",
      status: "ended",
      endsAt: "2026-09-06T08:00:00Z",
    }));
    expect(status.sources).toContainEqual(expect.objectContaining({
      kind: "official",
      url: "https://steamcommunity.com/app/1867240/homecontent/",
    }));
    expect(status.earlyAccess).toMatchObject({
      date: "2026-09-10",
      datePrecision: "date",
      status: "live",
      launched: true,
    });
    expect(status.maintenance).toMatchObject({
      status: "window-passed",
      patchVersion: "0.11",
      startsAt: "2026-09-14T08:00:00Z",
      expectedDurationMinutes: 60,
    });
  });

  it("removes the live-beta claim from homepage copy in every locale", () => {
    for (const locale of locales) {
      const messages = JSON.parse(readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8"));
      const copy = [
        messages.liveOps.title,
        messages.liveOps.description,
        messages.home.status,
        messages.home.primaryCta,
        messages.home.start.description,
        messages.home.start.cards.beginner.title,
        messages.home.start.cards.beginner.description,
        messages.home.priority.status.items.closedBeta02.title,
        messages.home.priority.status.items.closedBeta02.description,
      ].join("\n");

      expect(copy, locale).toMatch(/Steam/);
      expect(copy, locale).toMatch(/Beta 02/i);
      expect(copy, locale).toMatch(liveSignals[locale]);
      expect(copy, locale).toMatch(endedSignals[locale]);
      expect(copy, locale).not.toMatch(staleBetaSignals[locale]);
    }
  });

  it("updates every high-intent access guide for the live Early Access state", async () => {
    for (const locale of locales) {
      for (const slug of statusGuides) {
        const guide = await loadGuideDocument(locale, slug);
        const searchable = `${guide?.frontmatter.description}\n${guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${guide?.body}`;

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect((guide?.frontmatter.updatedAt ?? "") >= (
          locale === "en" && ["wardogs-beta", "wardogs-playtest"].includes(slug) ? "2026-09-24" : "2026-09-17"
        ), `${locale}/${slug}`).toBe(true);
        expect(searchable, `${locale}/${slug}`).toContain("Beta 02");
        expect(searchable, `${locale}/${slug}`).toMatch(liveSignals[locale]);
      }
    }
  });

  it("turns the launch checklist and issue guide into practical pre-launch pages", async () => {
    for (const locale of locales) {
      const checklist = await loadGuideDocument(locale, "wardogs-launch-checklist");
      const issues = await loadGuideDocument(locale, "wardogs-known-issues");

      expect(`${checklist?.frontmatter.title}\n${checklist?.frontmatter.description}\n${checklist?.body}`, `${locale}/checklist`).toMatch(
        /launch.day|launch-tag|день запуска|dia de lançamento|発売日|发售日/i,
      );
      expect(`${issues?.frontmatter.description}\n${issues?.body}`, `${locale}/issues`).toMatch(
        /community|community-gemeldet|сообществ|comunidade|コミュニティ|社区/i,
      );
    }
  });
});
