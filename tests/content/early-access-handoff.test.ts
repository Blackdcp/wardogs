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

const unconfirmedSignals = {
  en: /exact (?:early access )?unlock (?:hour|time).*(?:not confirmed|not been announced)|preload.*(?:not confirmed|not been announced)/i,
  de: /genaue.*(?:freischalt|startzeit).*(?:nicht bestätigt|nicht angekündigt)|preload.*nicht bestätigt/i,
  ru: /точн.*врем.*(?:не подтвержден|не объявлен)|предзагруз.*не подтвержден/i,
  "pt-br": /horário exato.*não (?:foi )?confirmado|pré-carregamento.*não (?:foi )?confirmado/i,
  ja: /正確な.*(?:解禁|解除|開始)時刻.*(?:未確認|発表されていません)|プリロード.*未確認/i,
  "zh-cn": /具体.*(?:解锁|开放)时间.*(?:尚未|未)(?:得到)?确认|预载.*(?:尚未|未)(?:得到)?确认/i,
} as const;

describe("September 9 Early Access handoff", () => {
  it("publishes Beta 02 as ended and keeps launch logistics explicitly unconfirmed", () => {
    expect(CURRENT_EVENT.status).toBe("ended");

    const status = getPublicStatus();
    expect(status.dataAsOf).toBe("2026-09-10");
    expect(status.currentEvent).toMatchObject({
      id: "closed-beta-02",
      name: "Closed Beta 02",
      status: "ended",
      openedToAllAt: "2026-09-05",
      endsAt: "2026-09-06T08:00:00Z",
    });
    expect(status.sources).toContainEqual(expect.objectContaining({
      kind: "official",
      url: "https://steamcommunity.com/app/1867240/homecontent/",
    }));
    expect(status.earlyAccess).toMatchObject({
      date: "2026-09-10",
      datePrecision: "date",
      exactUnlockTimeConfirmed: false,
      preloadConfirmed: false,
    });
    expect(status.earlyAccess).not.toHaveProperty("at");
    expect(status.earlyAccess).not.toHaveProperty("unlockAt");
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
        messages.home.start.cards.playtest.title,
        messages.home.start.cards.playtest.description,
        messages.home.priority.status.items.closedBeta02.title,
        messages.home.priority.status.items.closedBeta02.description,
      ].join("\n");

      expect(copy, locale).toMatch(/Steam/);
      expect(copy, locale).toMatch(/Beta 02/i);
      expect(copy, locale).not.toMatch(/(?:is live|正在进行|läuft jetzt|está ao vivo|ид[её]т сейчас|実施中)/i);
    }
  });

  it("updates every high-intent access guide without inventing an unlock time or preload", async () => {
    for (const locale of locales) {
      for (const slug of statusGuides) {
        const guide = await loadGuideDocument(locale, slug);
        const searchable = `${guide?.frontmatter.description}\n${guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${guide?.body}`;

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe(
          slug === "wardogs-launch-checklist" ? "2026-09-10" : "2026-09-09",
        );
        expect(searchable, `${locale}/${slug}`).toMatch(endedSignals[locale]);
        expect(searchable, `${locale}/${slug}`).toMatch(unconfirmedSignals[locale]);
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
