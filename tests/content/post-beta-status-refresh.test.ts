import {describe, expect, it} from "vitest";
import {readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {loadGuideDocument} from "../../src/content/guides";
import {CONFIRMED_RUMOR_ITEMS} from "../../src/features/home/home-data";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const statusSlugs = ["wardogs-beta", "wardogs-playtest", "wardogs-preload", "wardogs-download"] as const;

const endedPhrases = {
  en: /has ended|ended on August 24/i,
  de: /ist beendet|endete am 24\. August|ende der August-Beta am 24\. August/i,
  ru: /завершен|завершилась 24 августа/i,
  "pt-br": /foi encerrado|beta encerrado|terminou em 24 de agosto|encerramento do Closed Beta em 24 de agosto/i,
  ja: /終了しました|8月24日(?:02:00 UTC)?に終了/i,
  "zh-cn": /已经结束|于8月24日结束|8月24日.*结束|截至8月24日|封闭测试.*结束|测试.*已结束|八月份结束.*Beta|已封闭测试/i,
} as const;

const releaseDatePhrases = {
  en: /September 10, 2026/i,
  de: /10\. September 2026/i,
  ru: /10 сентября 2026/i,
  "pt-br": /10 de setembro de 2026/i,
  ja: /2026年9月10日/i,
  "zh-cn": /2026年9月10日/i,
} as const;

const preloadEndedPhrases = {
  en: /preload has ended/i,
  de: /preload ist beendet/i,
  ru: /предзагрузка.*завершилась/i,
  "pt-br": /preload.*terminou/i,
  ja: /プリロードは終了しました/i,
  "zh-cn": /预(?:载|装).*(?:已经|已).*结束/i,
} as const;

const staleActiveBetaFaqPhrases = {
  en: /pre-orders guarantee\b|request access applicants may|can invited players preload/i,
  de: /Vorbesteller erhalten|Request Access.*besteht|Können eingeladene/i,
  ru: /доступ гарантирован|получают лишь шанс|Заявка Request Access.*бесплатная|Можно ли заранее/i,
  "pt-br": /contas convidadas podem instalar|clientes de pré-venda têm acesso|Solicitar acesso.*oferece/i,
  ja: /現在のBetaアクセス|Betaに参加できます|Request Access.*できます/i,
  "zh-cn": /当前.*测试资格|可以参加.*测试|Request Access.*可以/i,
} as const;

const staleActiveDropsFaqPhrases = {
  en: /How do I activate|Confirm that the stream is live|Where do I claim/i,
  de: /Wie aktiviere|Prüfe, ob der Stream live|Wo löse ich/i,
  ru: /Как включить|Проверьте, что эфир|Где забрать/i,
  "pt-br": /Como ativar|Confirme que a live|Onde resgato/i,
  ja: /有効にする方法|ライブか、Drops対象|どこで受け取りますか/i,
  "zh-cn": /如何激活|直播.*Drops|在哪里领取/i,
} as const;

describe("WARDOGS post-beta status refresh", () => {
  it("marks the August Closed Beta as ended in every access guide and locale", async () => {
    for (const locale of locales) {
      for (const slug of statusSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        const searchable = `${guide?.frontmatter.description}\n${guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${guide?.body}`;

        expect(guide, `${locale}/${slug} should exist`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt).toBe("2026-09-01");
        expect(searchable, `${locale}/${slug} should say the beta ended`).toMatch(endedPhrases[locale]);
        expect(guide?.frontmatter.sources, `${locale}/${slug} should cite the current limited test`).toContainEqual(expect.objectContaining({
          url: "https://x.com/WARDOGS/status/2094076336134308024",
          checkedAt: "2026-09-01",
        }));
        expect(searchable).toMatch(releaseDatePhrases[locale]);
      }
    }
  });

  it("keeps beta FAQ schema historical instead of advertising ended access", async () => {
    for (const locale of locales) {
      const beta = await loadGuideDocument(locale, "wardogs-beta");
      const faqText = beta?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n") ?? "";

      expect(faqText, `${locale}/wardogs-beta FAQ should identify the current limited test`).toContain("17:00 UTC");
      expect(faqText, `${locale}/wardogs-beta FAQ should not describe ended access as current`).not.toMatch(staleActiveBetaFaqPhrases[locale]);
    }
  });

  it("removes obsolete beta access routes from alpha and download guidance", async () => {
    for (const locale of locales) {
      for (const slug of ["wardogs-alpha", "wardogs-alpha-key"] as const) {
        const guide = await loadGuideDocument(locale, slug);
        const searchable = `${guide?.frontmatter.description}\n${guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${guide?.body}`;

        expect(guide, `${locale}/${slug} should exist`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt).toBe("2026-08-24");
        expect(searchable, `${locale}/${slug} should say the beta ended`).toMatch(endedPhrases[locale]);
        expect(searchable).toMatch(releaseDatePhrases[locale]);
      }

      const download = await loadGuideDocument(locale, "wardogs-download");
      const preloadAnswer = download?.frontmatter.faq[2]?.answer;

      expect(preloadAnswer, `${locale}/wardogs-download should have a preload FAQ`).toMatch(preloadEndedPhrases[locale]);
    }
  });

  it("keeps official access and social guides on the post-beta timeline", async () => {
    const supportSlugs = [
      "wardogs-steam",
      "wardogs-discord",
      "wardogs-discord-account-verification",
      "wardogs-twitter",
    ] as const;

    for (const locale of locales) {
      for (const slug of supportSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        const searchable = `${guide?.frontmatter.description}\n${guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${guide?.body}`;

        expect(guide, `${locale}/${slug} should exist`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt).toBe("2026-08-24");
        expect(searchable, `${locale}/${slug} should say the beta ended`).toMatch(endedPhrases[locale]);
        expect(searchable, `${locale}/${slug} should point to Early Access`).toMatch(releaseDatePhrases[locale]);
      }
    }
  });

  it("documents the wishlist milestone and Supporter Edition policy in every locale", async () => {
    for (const locale of locales) {
      const steam = await loadGuideDocument(locale, "wardogs-steam");
      const price = await loadGuideDocument(locale, "wardogs-price");
      const earlyAccess = await loadGuideDocument(locale, "wardogs-early-access");
      const commercialText = `${price?.body}\n${earlyAccess?.body}`;

      expect(steam?.frontmatter.updatedAt).toBe("2026-08-24");
      expect(steam?.body).toContain("1,000,000");
      expect(price?.frontmatter.updatedAt).toBe("2026-08-28");
      expect(earlyAccess?.frontmatter.updatedAt).toBe("2026-08-24");
      expect(commercialText).toContain("$39.99");
      expect(commercialText).toContain("$49.99");
      expect(commercialText).toContain("Valkyra");
      expect(commercialText).toContain("Lonestar");
      expect(commercialText).toContain("Manticore");
      expect(commercialText).toMatch(/monetization|Monetarisierung|монетизац|monetização|収益化|变现|商业化|商业界限/i);
    }
  });

  it("marks the Closed Beta Twitch Drops campaign as ended in every locale", async () => {
    const noActiveCampaign = {
      en: /no active.*campaign.*confirmed/i,
      de: /keine aktive.*kampagne.*bestätigt/i,
      ru: /активная.*кампания.*не подтверждена/i,
      "pt-br": /nenhuma campanha.*(?:ativa|confirmada)/i,
      ja: /有効な.*キャンペーン.*確認されていません/i,
      "zh-cn": /没有.*活跃.*活动.*确认|尚未确认.*新的.*活动|没有确认.*活动|没有活动.*WARDOGS/i,
    } as const;

    for (const locale of locales) {
      const drops = await loadGuideDocument(locale, "wardogs-twitch-drops");
      const faqText = drops?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n") ?? "";
      const searchable = `${drops?.frontmatter.description}\n${faqText}\n${drops?.body}`;

      expect(drops?.frontmatter.updatedAt).toBe("2026-08-24");
      expect(searchable).toMatch(endedPhrases[locale]);
      expect(searchable).toMatch(noActiveCampaign[locale]);
      expect(faqText).toMatch(noActiveCampaign[locale]);
      expect(faqText, `${locale}/wardogs-twitch-drops FAQ should not read like a live campaign`).not.toMatch(staleActiveDropsFaqPhrases[locale]);
    }
  });

  it("does not send localized guide links through the English legacy redirect", () => {
    for (const locale of ["de", "ru", "pt-br", "ja"] as const) {
      const guideDir = join(process.cwd(), "content", locale, "guides");

      for (const filename of readdirSync(guideDir).filter((name) => name.endsWith(".mdx"))) {
        const source = readFileSync(join(guideDir, filename), "utf8");
        expect(source, `${locale}/${filename} should use locale-preserving guide links`).not.toContain("](/guides/");
      }
    }
  });

  it("replaces live-weekend homepage cards with durable post-beta facts", () => {
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({
      status: "confirmed",
      titleKey: "betaEnded",
      slug: "wardogs-beta",
    }));
    expect(CONFIRMED_RUMOR_ITEMS).toContainEqual(expect.objectContaining({
      status: "confirmed",
      titleKey: "oneMillionWishlists",
      slug: "wardogs-steam",
    }));
    expect(CONFIRMED_RUMOR_ITEMS).not.toContainEqual(expect.objectContaining({titleKey: "closedBeta"}));
    expect(CONFIRMED_RUMOR_ITEMS).not.toContainEqual(expect.objectContaining({titleKey: "betaPreload"}));
    expect(CONFIRMED_RUMOR_ITEMS).not.toContainEqual(expect.objectContaining({titleKey: "twitchDrops"}));
  });
});
