import {beforeAll, describe, expect, it} from "vitest";
import {locales, type Locale} from "@/config/site";
import {compileLocalizedGuideBody, loadGuideDocument} from "@/content/guides";
import {mdxComponents} from "@/components/mdx/mdx-components";
import {getGuideIntentKeywords} from "@/features/guides/guide-search-intents";
import {buildSiteSearchIndex, searchSiteIndex, type SiteSearchEntry} from "@/features/search/site-search-index";
import {buildArticleMetadata} from "@/lib/metadata";

const primaryKeywords = {
  "wardogs-solo-guide": "wardogs solo guide",
  "wardogs-report-player": "wardogs report player"
} as const;

// Real user tasks must reach the authored guide in both metadata and site search.
// These queries deliberately differ from the titles and legacy English keywords.
const queries: Record<Locale, readonly [string, string]> = {
  en: ["play without a mic", "report a renamed player"],
  ru: ["играть без микрофона", "жалоба на игрока после смены ника"],
  de: ["ohne Mikrofon spielen", "Spieler nach Namensänderung melden"],
  "pt-br": ["jogar sem microfone", "denunciar jogador que mudou de nome"],
  ja: ["マイクなしで遊ぶ", "名前を変えたプレイヤーの通報"],
  "zh-cn": ["不开麦怎么玩", "玩家改名后怎么举报"],
  "zh-tw": ["不開麥怎麼玩", "玩家改名後怎麼檢舉"],
  pl: ["gra bez mikrofonu", "zgłosić gracza po zmianie nicku"]
};

describe("localized solo and player-report intent discovery", () => {
  const indices = new Map<Locale, SiteSearchEntry[]>();
  beforeAll(async () => {
    await Promise.all(locales.map(async locale => indices.set(locale, await buildSiteSearchIndex(locale))));
  });

  it.each(locales)("keeps stable primary keywords and concrete native intents in %s metadata", async locale => {
    for (const [slug, keyword] of Object.entries(primaryKeywords)) {
      const guide = await loadGuideDocument(locale, slug);
      expect(guide?.frontmatter.keyword).toBe(keyword);
      const metadata = buildArticleMetadata(locale, guide!);
      const terms = getGuideIntentKeywords(locale, slug);
      expect(terms.length).toBeGreaterThanOrEqual(4);
      expect(new Set(terms).size).toBe(terms.length);
      expect(metadata.keywords).toContain(keyword);
      for (const term of terms) expect(metadata.keywords).toContain(term);
      expect(String(metadata.alternates?.canonical)).toContain(`/${locale}/guides/${slug}`);
      if (locale !== "en") expect(terms).not.toEqual(getGuideIntentKeywords("en", slug));
    }
  });

  it.each(locales)("routes specific %s no-mic and renamed-player queries to the correct existing URLs", locale => {
    const index = indices.get(locale)!;
    for (const [position, slug] of Object.keys(primaryKeywords).entries()) {
      expect(searchSiteIndex(index, queries[locale][position])[0]?.href).toBe(`/guides/${slug}`);
      // Preserve the old English keyword lookup while adding native tasks.
      expect(searchSiteIndex(index, primaryKeywords[slug as keyof typeof primaryKeywords])[0]?.href).toBe(`/guides/${slug}`);
    }
  });

  it.each(Object.keys(primaryKeywords))("uses Taiwan terminology throughout %s without breaking its MDX or official routes", async slug => {
    const guide = await loadGuideDocument("zh-tw", slug);
    const prose = [guide!.frontmatter.title, guide!.frontmatter.description, guide!.frontmatter.directAnswer,
      ...guide!.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`), guide!.body].join("\n");
    expect(prose).not.toMatch(/服務器|社區|舉報|賬號|封禁|渠道|信息|視頻|錄像|登錄|客戶端|模板/);
    expect(prose).toContain("伺服器");
    expect(prose).toContain("社群");
    expect(guide!.body).toContain(`/zh-tw/guides/${slug === "wardogs-solo-guide" ? "wardogs-report-player" : "wardogs-solo-guide"}`);
    if (slug === "wardogs-report-player") {
      expect(guide!.frontmatter.title).toContain("檢舉與停權申訴");
      expect(prose).toContain("帳號");
      for (const url of ["https://www.wardogs.com/safety", "https://www.wardogs.com/enforcement", "https://support.team17.com/en"]) {
        expect(guide!.frontmatter.sources).toContainEqual(expect.objectContaining({url, kind: "official"}));
      }
      expect(guide!.body).toContain("appeal@bulkhead.com");
      expect(guide!.body).toContain("@WARDOGS Support bot");
    }
    await expect(compileLocalizedGuideBody(guide!.body, mdxComponents, "zh-tw")).resolves.toHaveProperty("content");
  });
});
