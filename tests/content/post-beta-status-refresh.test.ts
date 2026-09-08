import {describe, expect, it} from "vitest";
import {readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {loadGuideDocument} from "../../src/content/guides";
import {CONFIRMED_RUMOR_ITEMS} from "../../src/features/home/home-data";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const currentSlugs = ["wardogs-beta", "wardogs-playtest", "wardogs-preload", "wardogs-download"] as const;
const beta02Url = "https://steamcommunity.com/ogg/1867240/announcements/detail/671752657526850807";
const revisedScheduleUrl = "https://x.com/BULKHEAD/status/2095447401725153576";

const releaseDatePhrases = {
  en: /September 10, 2026/i,
  de: /10\. September 2026/i,
  ru: /10 сентября 2026/i,
  "pt-br": /10 de setembro de 2026/i,
  ja: /2026年9月10日/i,
  "zh-cn": /2026\s*年\s*9\s*月\s*10\s*日/i,
} as const;

describe("WARDOGS current and historical status boundaries", () => {
  it("publishes the revised Closed Beta 02 window in every current access guide", async () => {
    for (const locale of locales) {
      for (const slug of currentSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        const sourceUrls = guide?.frontmatter.sources.map(({url}) => url) ?? [];
        const searchable = `${guide?.frontmatter.description}\n${guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${guide?.body}`;

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe("2026-09-09");
        expect(sourceUrls, `${locale}/${slug}`).toContain(beta02Url);
        expect(sourceUrls, `${locale}/${slug}`).toContain(revisedScheduleUrl);
        expect(searchable, `${locale}/${slug}`).toContain("19:00 UTC");
        expect(searchable, `${locale}/${slug}`).toContain("08:00 UTC");
        expect(searchable, `${locale}/${slug}`).toMatch(releaseDatePhrases[locale]);
      }
    }
  });

  it("keeps the show time separate from the corrected server time", async () => {
    for (const locale of locales) {
      for (const slug of ["wardogs-beta", "wardogs-playtest"] as const) {
        const guide = await loadGuideDocument(locale, slug);
        const currentSection = guide?.body.split(/^##\s+/m).slice(1, 3).join("\n") ?? "";

        expect(currentSection, `${locale}/${slug}`).toContain("18:00 UTC");
        expect(currentSection, `${locale}/${slug}`).toContain("19:00 UTC");
        expect(currentSection, `${locale}/${slug}`).toContain("08:00 UTC");
      }
    }
  });

  it("records the initial closed access rules and the September 5 Open Beta transition", async () => {
    for (const locale of locales) {
      const beta = await loadGuideDocument(locale, "wardogs-beta");
      const sourceUrls = beta?.frontmatter.sources.map(({url}) => url) ?? [];
      const searchable = `${beta?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join(" ")}\n${beta?.body}`;

      expect(sourceUrls, `${locale}/wardogs-beta`).toContain("https://steamcommunity.com/app/1867240/homecontent/");
      expect(searchable, `${locale}/wardogs-beta`).toMatch(/free|kostenlos|бесплат|gratuit|無料|免费/i);
      expect(searchable, `${locale}/wardogs-beta`).toMatch(/guarantee|garantiert|гарант|garanti|保証|保证/i);
      expect(searchable, `${locale}/wardogs-beta`).toMatch(/opened to everyone|für alle geöffnet|откры.*для всех|abert.*para todos|全員へ開放|向所有(?:人|玩家)开放/i);
    }
  });

  it("keeps the August test explicitly historical", async () => {
    for (const locale of locales) {
      for (const slug of ["wardogs-alpha", "wardogs-alpha-key"] as const) {
        const guide = await loadGuideDocument(locale, slug);
        const searchable = `${guide?.frontmatter.description}\n${guide?.body}`;

        expect(searchable, `${locale}/${slug}`).toMatch(/ended|completed|beendet|abgeschlossen|заверш|encerrad|terminou|終了|结束/i);
        expect(searchable, `${locale}/${slug}`).toMatch(releaseDatePhrases[locale]);
      }
    }
  });

  it("documents the wishlist milestone and Supporter Edition policy in every locale", async () => {
    for (const locale of locales) {
      const steam = await loadGuideDocument(locale, "wardogs-steam");
      const price = await loadGuideDocument(locale, "wardogs-price");
      const earlyAccess = await loadGuideDocument(locale, "wardogs-early-access");
      const commercialText = `${price?.body}\n${earlyAccess?.body}`;

      expect(steam?.body).toContain("1,000,000");
      expect(commercialText).toContain("$39.99");
      expect(commercialText).toContain("$49.99");
      expect(commercialText).toContain("Valkyra");
      expect(commercialText).toContain("Lonestar");
      expect(commercialText).toContain("Manticore");
      expect(commercialText).toMatch(/monetization|Monetarisierung|монетизац|monetização|収益化|变现|商业化|商业界限/i);
    }
  });

  it("keeps Twitch Drops integration separate from unverified reward rules", async () => {
    for (const locale of locales) {
      const drops = await loadGuideDocument(locale, "wardogs-twitch-drops");
      const searchable = `${drops?.frontmatter.description}\n${drops?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${drops?.body}`;

      expect(drops?.frontmatter.updatedAt, locale).toBe("2026-09-09");
      expect(searchable, locale).toContain("Beta 02");
      expect(searchable, locale).toContain("Twitch Inventory");
      expect(searchable, locale).toMatch(/(?:no|not) .*?(?:confirmed|verified)|nicht.*bestätigt|не.*подтверж|não.*confirm|未確認|未确认|尚未确认/i);
    }
  });

  it("does not send localized guide links through the English legacy redirect", () => {
    for (const locale of ["de", "ru", "pt-br", "ja"] as const) {
      const guideDir = join(process.cwd(), "content", locale, "guides");
      for (const filename of readdirSync(guideDir).filter((name) => name.endsWith(".mdx"))) {
        const source = readFileSync(join(guideDir, filename), "utf8");
        expect(source, `${locale}/${filename}`).not.toContain("](/guides/");
      }
    }
  });

  it("keeps Beta 02 history and the clip contest on the homepage", () => {
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({status: "confirmed", titleKey: "closedBeta02", slug: "wardogs-beta"}));
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({status: "confirmed", titleKey: "clipContest", slug: "wardogs-100k-clip-contest"}));
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({status: "confirmed", titleKey: "steamEarlyAccess", slug: "wardogs-early-access"}));
  });
});
