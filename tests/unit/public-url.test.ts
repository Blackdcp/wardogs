import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {publicAssetPath, publicAssetUrl, publicRoutePath, publicRouteUrl} from "../../src/lib/public-url";

describe("public URL contract", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("emits root-deployment routes and assets without changing suffix placement", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.wardogswiki.com");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    vi.stubEnv("GITHUB_PAGES", "false");

    expect(publicRoutePath("/en/items/weapons/amp-9?view=cards#facts")).toBe("/en/items/weapons/amp-9?view=cards#facts");
    expect(publicRouteUrl("/en/items/weapons/amp-9?view=cards#facts")).toBe("https://www.wardogswiki.com/en/items/weapons/amp-9?view=cards#facts");
    expect(publicAssetPath("/images/catalogue/weapons/amp-9.webp?v=1#preview")).toBe("/images/catalogue/weapons/amp-9.webp?v=1#preview");
    expect(publicAssetUrl("/images/catalogue/weapons/amp-9.webp?v=1#preview")).toBe("https://www.wardogswiki.com/images/catalogue/weapons/amp-9.webp?v=1#preview");
    expect(publicRoutePath("en/items/weapons/amp-9")).toBe("/en/items/weapons/amp-9");
    expect(publicRouteUrl("en/items/weapons/amp-9")).toBe("https://www.wardogswiki.com/en/items/weapons/amp-9");
    expect(publicAssetPath("images/catalogue/weapons/amp-9.webp")).toBe("/images/catalogue/weapons/amp-9.webp");
    expect(publicAssetUrl("images/catalogue/weapons/amp-9.webp")).toBe("https://www.wardogswiki.com/images/catalogue/weapons/amp-9.webp");
  });

  it("resolves protocol-relative references with the configured site protocol", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://blackdcp.github.io/wardogs");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("GITHUB_PAGES", "true");

    const reference = "//cdn.example/images/model.webp?v=1#preview";
    expect(publicRoutePath(reference)).toBe(reference);
    expect(publicAssetPath(reference)).toBe(reference);
    expect(publicRouteUrl(reference)).toBe("https://cdn.example/images/model.webp?v=1#preview");
    expect(publicAssetUrl(reference)).toBe("https://cdn.example/images/model.webp?v=1#preview");

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000/wardogs");
    expect(publicRouteUrl(reference)).toBe("http://cdn.example/images/model.webp?v=1#preview");
    expect(publicAssetUrl(reference)).toBe("http://cdn.example/images/model.webp?v=1#preview");
  });

  it("preserves HTTP, HTTPS, and non-HTTP absolute references", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.wardogswiki.com");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("GITHUB_PAGES", "true");

    const references = [
      "http://cdn.example/model.webp?size=large#preview",
      "https://cdn.example/model.webp?size=large#preview",
      "data:image/webp;base64,UklGRg==",
      "mailto:editor@example.com?subject=WARDOGS"
    ];
    for (const reference of references) {
      expect(publicRoutePath(reference), reference).toBe(reference);
      expect(publicAssetPath(reference), reference).toBe(reference);
      expect(publicRouteUrl(reference), reference).toBe(reference);
      expect(publicAssetUrl(reference), reference).toBe(reference);
    }
  });

  it("adds a nonempty Pages base path and route slash but never an asset slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://blackdcp.github.io");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("GITHUB_PAGES", "true");

    expect(publicRoutePath("/en/items/vehicles/bobcat?view=cards#facts")).toBe("/wardogs/en/items/vehicles/bobcat/?view=cards#facts");
    expect(publicRouteUrl("/en/items/vehicles/bobcat?view=cards#facts")).toBe("https://blackdcp.github.io/wardogs/en/items/vehicles/bobcat/?view=cards#facts");
    expect(publicAssetPath("/images/catalogue/vehicles/bobcat.webp?v=1#preview")).toBe("/wardogs/images/catalogue/vehicles/bobcat.webp?v=1#preview");
    expect(publicAssetUrl("/images/catalogue/vehicles/bobcat.webp?v=1#preview")).toBe("https://blackdcp.github.io/wardogs/images/catalogue/vehicles/bobcat.webp?v=1#preview");
  });

  it("keeps directory-route slashes when the client bundle only exposes the public base path", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://blackdcp.github.io/wardogs");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("GITHUB_PAGES", "");

    expect(publicRoutePath("/de/guides/wardogs-gameplay")).toBe("/wardogs/de/guides/wardogs-gameplay/");
    expect(publicRoutePath("/api/search-index/en")).toBe("/wardogs/api/search-index/en");
    expect(publicRoutePath("/api/revision")).toBe("/wardogs/api/revision");
    expect(publicRoutePath("/sitemap.xml")).toBe("/wardogs/sitemap.xml");
    expect(publicAssetPath("/images/catalogue/vehicles/bobcat.webp")).toBe("/wardogs/images/catalogue/vehicles/bobcat.webp");
  });

  it("keeps root-domain Pages client routes canonical using the public export flag alone", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.wardogswiki.com");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    vi.stubEnv("GITHUB_PAGES", undefined);
    vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", "true");

    expect(publicRoutePath("/ja/guides/wardogs-solo-guide?t=91#related-title")).toBe("/ja/guides/wardogs-solo-guide/?t=91#related-title");
    expect(publicRouteUrl("/ja/guides/wardogs-solo-guide")).toBe("https://www.wardogswiki.com/ja/guides/wardogs-solo-guide/");
    expect(publicRoutePath("/")).toBe("/");
    for (const file of ["/sitemap.xml", "/robots.txt", "/api/search-index/ja.json", "/api/search-index/ja", "/images/catalogue/vehicles/bobcat.webp?v=1#preview"]) {
      expect(publicRoutePath(file), file).toBe(file);
      expect(publicAssetPath(file), file).toBe(file);
    }
  });

  it.each(["", "/wardogs"])("uses non-export Vercel routes without directory slashes at base path '%s'", (basePath) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.wardogswiki.com");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", basePath);
    vi.stubEnv("GITHUB_PAGES", undefined);
    vi.stubEnv("NEXT_PUBLIC_STATIC_EXPORT", "false");

    expect(publicRoutePath("/ja/guides/wardogs-solo-guide/?t=91#related-title")).toBe(`${basePath}/ja/guides/wardogs-solo-guide?t=91#related-title`);
    expect(publicRouteUrl("/ja/guides/wardogs-solo-guide")).toBe(`https://www.wardogswiki.com${basePath}/ja/guides/wardogs-solo-guide`);
    expect(publicRoutePath("/sitemap.xml")).toBe(`${basePath}/sitemap.xml`);
    expect(publicAssetPath("/images/catalogue/vehicles/bobcat.webp")).toBe(`${basePath}/images/catalogue/vehicles/bobcat.webp`);
  });

  it("includes the configured base path exactly once when the site URL already embeds it", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://blackdcp.github.io/wardogs/");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("GITHUB_PAGES", "true");

    expect(publicRoutePath("/wardogs/en/items/weapons/a-91/")).toBe("/wardogs/en/items/weapons/a-91/");
    expect(publicRouteUrl("/en/items/weapons/a-91")).toBe("https://blackdcp.github.io/wardogs/en/items/weapons/a-91/");
    expect(publicAssetUrl("/images/catalogue/weapons/a-91.webp")).toBe("https://blackdcp.github.io/wardogs/images/catalogue/weapons/a-91.webp");
  });

  it("keeps the Pages deployment root stable", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.wardogswiki.com/");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    vi.stubEnv("GITHUB_PAGES", "true");

    expect(publicRoutePath("/")).toBe("/");
    expect(publicRouteUrl("/")).toBe("https://www.wardogswiki.com/");
    expect(publicRoutePath("#catalogue")).toBe("#catalogue");
  });
});
