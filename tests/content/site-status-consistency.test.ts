import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {guideManifest} from "../../src/content/manifest";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const beta02Url = "https://steamcommunity.com/ogg/1867240/announcements/detail/671752657526850807";
const revisedScheduleUrl = "https://x.com/BULKHEAD/status/2095447401725153576";

const statusSensitiveSlugs = [
  "wardogs-alpha",
  "wardogs-alpha-key",
  "wardogs-discord",
  "wardogs-discord-account-verification",
  "wardogs-price",
  "wardogs-release-date",
  "wardogs-steam",
  "wardogs-twitter",
] as const;

const staleCurrentClaims = {
  en: /no later beta or playtest|no new session (?:was|has been) announced|next official information checkpoint is .*september 3|test starts september 2|show is announced for september 3|what that show will reveal is not yet confirmed/i,
  de: /keine neue (?:beta|playtest|testsitzung).*angekündigt|nächste offizielle informationspunkt ist .*3\. september|test beginnt am 2\. september|show.*3\. september.*angekündigt.*noch nicht bestätigt/i,
  ru: /новая дата (?:беты|playtest).*не объявлена|новая тестовая сессия.*не объявлена|следующ(?:ая|ий).*точк.*3 сентября|тест начн[её]тся 2 сентября|шоу.*3 сентября.*ещ[её] не подтвержден/i,
  "pt-br": /nenhuma nova sessão.*(?:foi )?anunciada|nenhuma nova data (?:de teste|do playtest).*(?:foi )?anunciada|próximo ponto oficial.*3 de setembro|teste começa em 2 de setembro|show.*3 de setembro.*ainda não foi confirmado/i,
  ja: /新しい(?:Beta|ベータ|Playtest|テスト).*(?:発表|確認)されていません|次の公式.*9月3日|9月2日に開始します|9月3日.*発表予定.*未確認/,
  "zh-cn": /没有(?:公布|确认).*新的(?: Beta| Playtest|测试)|下一(?:个|次)官方.*9 月 3 日|9 月 2 日.*开始|9 月 3 日.*将公布.*尚未确认/,
} as const;

const currentPurchasePhrases = {
  en: /buy|purchase|Supporter Edition/i,
  de: /kaufen|Kauf|Supporter Edition/i,
  ru: /купить|покупк|Supporter Edition/i,
  "pt-br": /comprar|compra|Supporter Edition/i,
  ja: /購入|Supporter Edition/,
  "zh-cn": /购买|购入|Supporter Edition/,
} as const;

describe("site-wide live status consistency", () => {
  it("removes stale pre-reveal and no-test claims from every guide", async () => {
    for (const locale of locales) {
      for (const {slug} of guideManifest) {
        const guide = await loadGuideDocument(locale, slug);
        const searchable = [
          guide?.frontmatter.description,
          ...(guide?.frontmatter.faq.flatMap(({question, answer}) => [question, answer]) ?? []),
          guide?.body,
        ].join("\n");

        expect(searchable, `${locale}/${slug}`).not.toMatch(staleCurrentClaims[locale]);
      }
    }
  });

  it("puts the ended Beta 02 checkpoint and primary sources on high-intent status pages", async () => {
    for (const locale of locales) {
      for (const slug of statusSensitiveSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        const sourceUrls = guide?.frontmatter.sources.map(({url}) => url) ?? [];

        const expectedDate = ["wardogs-price", "wardogs-release-date", "wardogs-steam"].includes(slug)
          || (slug === "wardogs-twitter" && ["en", "zh-cn"].includes(locale))
          || (locale === "zh-cn" && [
            "wardogs-alpha",
            "wardogs-alpha-key",
            "wardogs-discord",
            "wardogs-discord-account-verification",
          ].includes(slug))
          ? "2026-09-17"
          : "2026-09-13";
        expect((guide?.frontmatter.updatedAt ?? "") >= expectedDate, `${locale}/${slug}`).toBe(true);
        expect(guide?.body, `${locale}/${slug}`).toContain("Beta 02");
        expect(sourceUrls, `${locale}/${slug}`).toContain(beta02Url);
        expect(sourceUrls, `${locale}/${slug}`).toContain(revisedScheduleUrl);
      }
    }
  });

  it("keeps the storefront on the current Early Access purchase and edition prices", async () => {
    for (const locale of locales) {
      const steam = await loadGuideDocument(locale, "wardogs-steam");
      const price = await loadGuideDocument(locale, "wardogs-price");
      const searchable = `${steam?.frontmatter.description}\n${steam?.body}\n${price?.frontmatter.description}\n${price?.body}`;

      expect((steam?.frontmatter.updatedAt ?? "") >= "2026-09-17", `${locale}/wardogs-steam`).toBe(true);
      expect((price?.frontmatter.updatedAt ?? "") >= "2026-09-17", `${locale}/wardogs-price`).toBe(true);
      expect(searchable, `${locale}/commerce`).toContain("$39.99");
      expect(searchable, `${locale}/commerce`).toContain("$49.99");
      expect(searchable, `${locale}/commerce`).toMatch(currentPurchasePhrases[locale]);
    }
  });
});
