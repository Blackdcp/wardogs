import {afterEach, describe, expect, it, vi} from "vitest";
import {buildAlternates, buildArticleMetadata, buildSiteMetadata, getSiteOrigin} from "../../src/lib/metadata";
import {loadGuideDocument} from "../../src/content/guides";

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
    expect(Object.keys(alternates.languages!)).toEqual(["en", "ru", "de", "pt-BR", "x-default"]);
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
});
