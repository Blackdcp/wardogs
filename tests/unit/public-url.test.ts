import {afterEach, describe, expect, it, vi} from "vitest";
import {publicAssetPath, publicAssetUrl, publicRoutePath, publicRouteUrl} from "../../src/lib/public-url";

describe("public URL contract", () => {
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
