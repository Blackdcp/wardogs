import {afterEach, describe, expect, it, vi} from "vitest";
import {buildAlternates, buildArticleMetadata, buildSiteMetadata, getSiteOrigin} from "../../src/lib/metadata";
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
    expect(Object.keys(alternates.languages!)).toEqual(["en", "ru", "de", "pt-BR", "ja", "zh-CN", "x-default"]);
    expect(alternates.languages?.["zh-CN"]).toBe("http://localhost:3000/zh-cn/guides/wardogs-gameplay");
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

    const crashGuide = await loadGuideDocument("en", "wardogs-crash-fix");
    const helicopterGuide = await loadGuideDocument("en", "wardogs-helicopter-guide");
    const crashMetadata = buildArticleMetadata("en", crashGuide!);
    const helicopterMetadata = buildArticleMetadata("en", helicopterGuide!);
    const crashImage = (crashMetadata.openGraph?.images as TestSocialImage[])[0];
    const helicopterImage = (helicopterMetadata.openGraph?.images as TestSocialImage[])[0];

    expect(crashImage).toMatchObject({width: 1280, height: 720});
    expect(helicopterImage).toMatchObject({width: 1280, height: 720});
    expect(String(crashImage.url)).toContain("fupZGU7LJaU/maxresdefault.jpg");
    expect(String(helicopterImage.url)).toContain("wcsY2EeIlyc/maxresdefault.jpg");
    expect(String(crashImage.url)).not.toBe(String(helicopterImage.url));
  });

  it("publishes local Team17 discovery assets as absolute social URLs", async () => {
    const guide = await loadGuideDocument("ja", "wardogs-best-weapons-loadouts");
    const metadata = buildArticleMetadata("ja", guide!);
    const image = (metadata.openGraph?.images as TestSocialImage[])[0];

    expect(String(image.url)).toBe("http://localhost:3000/images/guide-discovery/best-weapons-loadouts.webp");
    expect(metadata.twitter?.images).toEqual(["http://localhost:3000/images/guide-discovery/best-weapons-loadouts.webp"]);
  });
});
