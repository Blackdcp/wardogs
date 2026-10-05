import {afterEach, describe, expect, it, vi} from "vitest";
import {buildAlternates, buildArticleMetadata, buildPageMetadata, buildSiteMetadata, getSiteOrigin} from "../../src/lib/metadata";
import {loadGuideDocument} from "../../src/content/guides";

type TestSocialImage = {url: string | URL; width?: number; height?: number};

describe("localized metadata", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("stays within limits and emits every language alternate", async () => {
    const guide = await loadGuideDocument("en", "wardogs-gameplay");
    const metadata = buildArticleMetadata("en", guide!);
    expect(String(metadata.title).length).toBeLessThanOrEqual(60);
    expect(String(metadata.description).length).toBeGreaterThanOrEqual(140);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    const alternates = buildAlternates("en", "/guides/wardogs-gameplay");
    expect(Object.keys(alternates.languages!)).toEqual(["en", "ru", "de", "pt-BR", "ja", "zh-CN", "zh-TW", "pl", "x-default"]);
    expect(alternates.languages?.["zh-CN"]).toBe("http://localhost:3000/zh-cn/guides/wardogs-gameplay");
  });

  it.each([
    ["ja", "wardogs-squad-guide", "フレンドと遊ぶ"],
    ["zh-cn", "wardogs-crash-fix", "启动报错"],
    ["de", "wardogs-best-settings", "FPS erhöhen"]
  ] as const)("keeps the primary keyword and localized search intent for %s/%s", async (locale, slug, intent) => {
    const guide = await loadGuideDocument(locale, slug);
    const metadata = buildArticleMetadata(locale, guide!);
    expect(metadata.keywords).toContain(guide!.frontmatter.keyword);
    expect(metadata.keywords).toContain(intent);
    expect(metadata.title).toBe(guide!.frontmatter.title);
    expect(metadata.description).toBe(guide!.frontmatter.description);
  });

  it("prefixes favicon and manifest metadata for a GitHub Pages deployment", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/wardogs";
    process.env.NEXT_PUBLIC_SITE_URL = "https://blackdcp.github.io/wardogs";
    process.env.GITHUB_PAGES = "true";
    const metadata = buildSiteMetadata();
    const alternates = buildAlternates("en", "/guides/wardogs-gameplay");

    expect(metadata.manifest).toBe("/wardogs/site.webmanifest");
    expect(metadata.icons).toMatchObject({
      icon: expect.arrayContaining([expect.objectContaining({url: "/wardogs/icons/favicon.ico"})]),
      apple: expect.arrayContaining([expect.objectContaining({url: "/wardogs/icons/apple-touch-icon.png"})])
    });
    expect(metadata.alternates?.types).toEqual({"application/rss+xml": "/wardogs/feed.xml"});
    expect(alternates.canonical).toBe("https://blackdcp.github.io/wardogs/en/guides/wardogs-gameplay/");
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.GITHUB_PAGES;
  });

  it("uses the canonical www domain in production even when Vercel exposes a project host", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "wardogswiki.com");
    delete process.env.NEXT_PUBLIC_SITE_URL;

    expect(getSiteOrigin()).toBe("https://www.wardogswiki.com");
  });

  it("allows large image previews and gives priority guides distinct 1280px discovery images", async () => {
    const siteMetadata = buildSiteMetadata();
    const googleBot = (siteMetadata.robots as {googleBot: Record<string, unknown>}).googleBot;
    expect(googleBot["max-image-preview"]).toBe("large");
    expect((siteMetadata.robots as Record<string, unknown>).index).toBeUndefined();
    expect(googleBot.index).toBeUndefined();

    const crashGuide = await loadGuideDocument("en", "wardogs-crash-fix");
    const helicopterGuide = await loadGuideDocument("en", "wardogs-helicopter-guide");
    const crashMetadata = buildArticleMetadata("en", crashGuide!);
    const helicopterMetadata = buildArticleMetadata("en", helicopterGuide!);
    const crashImage = (crashMetadata.openGraph?.images as TestSocialImage[])[0];
    const helicopterImage = (helicopterMetadata.openGraph?.images as TestSocialImage[])[0];

    expect(crashImage).toMatchObject({width: 1280, height: 720});
    expect(helicopterImage).toMatchObject({width: 1280, height: 720});
    expect(String(crashImage.url)).toContain("fupZGU7LJaU/hqdefault.jpg");
    expect(String(helicopterImage.url)).toContain("wcsY2EeIlyc/hqdefault.jpg");
    expect(String(crashImage.url)).not.toBe(String(helicopterImage.url));
  });

  it("advertises the RSS feed for browser and feed-reader discovery", () => {
    expect(buildSiteMetadata().alternates?.types).toEqual({"application/rss+xml": "/feed.xml"});
  });

  it("gives the Tools hub a localized canonical and complete reciprocal hreflang set", () => {
    const metadata = buildPageMetadata("ja", "/tools", "WARDOGS ツール", "WARDOGS のツール一覧と使い方を確認できます。");
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/ja/tools");
    expect(metadata.alternates?.languages).toEqual({
      en: "http://localhost:3000/en/tools",
      ru: "http://localhost:3000/ru/tools",
      de: "http://localhost:3000/de/tools",
      "pt-BR": "http://localhost:3000/pt-br/tools",
      ja: "http://localhost:3000/ja/tools",
      "zh-CN": "http://localhost:3000/zh-cn/tools",
      "zh-TW": "http://localhost:3000/zh-tw/tools",
      pl: "http://localhost:3000/pl/tools",
      "x-default": "http://localhost:3000/en/tools"
    });
  });

  it("publishes local Team17 discovery assets as absolute social URLs", async () => {
    const guide = await loadGuideDocument("ja", "wardogs-best-weapons-loadouts");
    const metadata = buildArticleMetadata("ja", guide!);
    const image = (metadata.openGraph?.images as TestSocialImage[])[0];

    expect(String(image.url)).toBe("http://localhost:3000/images/guide-discovery/best-weapons-loadouts.webp");
    expect(metadata.twitter?.images).toEqual(["http://localhost:3000/images/guide-discovery/best-weapons-loadouts.webp"]);
  });
});
