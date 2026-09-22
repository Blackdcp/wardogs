import {describe, expect, it} from "vitest";
import {NEWS_UPDATES} from "../../src/features/news/news-data";
import {loadGuideDocument} from "../../src/content/guides";
import {guideManifest} from "../../src/content/manifest";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const coreGuides = [
  "wardogs-beginner-guide",
  "wardogs-money-guide",
  "wardogs-progression-wipes-guide",
  "wardogs-best-weapons-loadouts",
  "wardogs-community-servers-guide",
  "wardogs-map"
] as const;

const currentVideoGuideSources = [
  ["wardogs-beginner-guide", "https://www.youtube.com/watch?v=fUKgHeT0JGY", "Fallout Plays"],
  ["wardogs-money-guide", "https://www.youtube.com/watch?v=mYXhZnJ8Eus", "Espresso"],
  ["wardogs-best-weapons-loadouts", "https://www.youtube.com/watch?v=VrtwXz94dQg", "Nova Gaming"],
  ["wardogs-fob-guide", "https://www.youtube.com/watch?v=XUyP1GLUF5o", "Gamers Heroes"],
  ["wardogs-best-settings", "https://www.youtube.com/watch?v=v0V69ZYMlgY", "IceManIsaac"],
  ["wardogs-progression-wipes-guide", "https://www.youtube.com/watch?v=smOE0063KOE", "DrybearGamers"]
] as const;

const staleMaintenanceSignals = {
  en: /Patch 0\.11 maintenance is scheduled|developer scheduled.*Patch 0\.11|servers are expected to be offline|next confirmed interruption|scheduled to go offline|scheduled Patch 0\.11/i,
  de: /Patch 0\.11.*(?:ist|am).*geplant|Wartung.*ist.*geplant|nächste bestätigte Unterbrechung|Server.*(?:sollen|gehen).*offline/i,
  ru: /Patch 0\.11.*назначен|обслуживание.*назначено|следующее подтвержденное отключение|серверы отключат/i,
  "pt-br": /Patch 0\.11.*está marcad|manutenção.*está marcad|próxima interrupção|servidores.*(?:devem ficar offline|sairão do ar)/i,
  ja: /Patch 0\.11.*予定|メンテナンス.*予定|次の停止|サーバー停止.*予定/i,
  "zh-cn": /Patch 0\.11.*(?:定于|计划|安排)|维护定于|下一次确认中断|服务器.*(?:预计暂停|计划.*暂停)/i
} as const;

describe("September 17 Season 1 weekend refresh", () => {
  it("leads the news feed with the official two-million-copy milestone", () => {
    expect(NEWS_UPDATES[0]).toEqual({
      date: "2026-09-15",
      status: "Confirmed",
      titleKey: "twoMillionCopies",
      guideSlug: "wardogs-early-access"
    });
  });

  it("refreshes the six weekend guides in every locale with a Season 1 checkpoint", async () => {
    for (const locale of locales) {
      for (const slug of coreGuides) {
        const guide = await loadGuideDocument(locale, slug);
        const sourceUrls = guide?.frontmatter.sources.map(({url}) => url) ?? [];

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe(
          ["wardogs-progression-wipes-guide", "wardogs-best-weapons-loadouts"].includes(slug)
            ? "2026-09-23"
            : "2026-09-17",
        );
        expect(guide?.body, `${locale}/${slug}`).toContain("Season 1");
        expect(guide?.body, `${locale}/${slug}`).toContain("Patch 0.11");
        expect(sourceUrls, `${locale}/${slug}`).toContain("https://steamcommunity.com/app/1867240/announcements/");
      }
    }
  });

  it("names all three approved community-server hosts without the old two-provider claim", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-community-servers-guide");
      const searchable = `${guide?.frontmatter.description}\n${guide?.frontmatter.faq.map(({answer}) => answer).join("\n")}\n${guide?.body}`;

      for (const provider of ["QONZER", "BisectHosting", "xREALM"]) {
        expect(searchable, `${locale}/${provider}`).toContain(provider);
      }
      expect(searchable, locale).not.toMatch(/two approved|two hosting|two-provider|zwei (?:geprüfte|genehmigte)|два (?:проверенных|одобренных)|dois (?:hosts|provedores)|承認(?:済み|された)2社|两家(?:获批|经过审核|首发托管)/i);
    }
  });

  it("cross-checks each high-intent guide against a current external video source", async () => {
    for (const locale of locales) {
      for (const [slug, url, channel] of currentVideoGuideSources) {
        const guide = await loadGuideDocument(locale, slug);
        const sourceUrls = guide?.frontmatter.sources.map((source) => source.url) ?? [];

        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe(
          ["wardogs-progression-wipes-guide", "wardogs-best-weapons-loadouts"].includes(slug)
            ? "2026-09-23"
            : "2026-09-17",
        );
        expect(sourceUrls, `${locale}/${slug}`).toContain(url);
        expect(guide?.body, `${locale}/${slug}`).toContain(channel);
      }
    }
  });

  it("removes future-tense September 14 maintenance claims from every localized guide", async () => {
    for (const locale of locales) {
      for (const {slug} of guideManifest) {
        const guide = await loadGuideDocument(locale, slug);
        if (!guide) continue;
        const searchable = `${guide.frontmatter.description}\n${guide.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${guide.body}`;

        expect(searchable, `${locale}/${slug}`).not.toMatch(staleMaintenanceSignals[locale]);
      }
    }
  });
});
