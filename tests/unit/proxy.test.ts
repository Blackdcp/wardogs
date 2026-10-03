import {describe, expect, test, vi} from "vitest";
import {unstable_doesMiddlewareMatch} from "next/experimental/testing/server";
import {NextRequest} from "next/server";
import * as publicUrl from "@/lib/public-url";
import proxy, {config} from "@/proxy";

vi.mock("next-intl/middleware", () => ({default: () => () => ({})}));

type CanonicalHostRedirect = (requestUrl: URL) => URL | undefined;

function canonicalHostRedirect() {
  return (publicUrl as typeof publicUrl & {
    getCanonicalHostRedirect?: CanonicalHostRedirect;
  }).getCanonicalHostRedirect;
}

describe("canonical host redirects", () => {
  test("redirects the apex domain to www while preserving path and query", () => {
    const resolveRedirect = canonicalHostRedirect();

    expect(resolveRedirect).toBeTypeOf("function");
    if (!resolveRedirect) return;

    expect(resolveRedirect(new URL("https://wardogswiki.com/en/guides/wardogs-playtest?source=bing"))?.toString()).toBe(
      "https://www.wardogswiki.com/en/guides/wardogs-playtest?source=bing"
    );
  });

  test("does not redirect the canonical www host", () => {
    const resolveRedirect = canonicalHostRedirect();

    expect(resolveRedirect).toBeTypeOf("function");
    if (!resolveRedirect) return;

    expect(resolveRedirect(new URL("https://www.wardogswiki.com/en"))).toBeUndefined();
  });
});

describe("Proxy request scope", () => {
  const matches = (url: string) => unstable_doesMiddlewareMatch({config, nextConfig: {}, url});

  test("keeps apex host redirects on all extensionless paths, including 404s", () => {
    expect(matches("https://wardogswiki.com/")).toBe(true);
    expect(matches("https://wardogswiki.com/en/guides/wardogs-playtest")).toBe(true);
    expect(matches("https://wardogswiki.com/not-a-real-page")).toBe(true);
  });

  test("keeps all six localized routes and root on the canonical host", () => {
    for (const locale of ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"]) {
      expect(matches(`https://www.wardogswiki.com/${locale}`)).toBe(true);
      expect(matches(`https://www.wardogswiki.com/${locale}/guides/not-a-real-page`)).toBe(true);
    }
    expect(matches("https://www.wardogswiki.com/")).toBe(true);
  });

  test("keeps canonical-host legacy redirects", () => {
    for (const path of [
      "/wardogs/en/guides/wardogs-playtest",
      "/guides/wardogs-playtest",
      "/videos/example", "/items/weapons/example", "/news/example",
      "/privacy", "/terms", "/maps", "/about", "/contact", "/editorial-policy",
      "/tools/system-check", "/tools/ammo-matcher", "/tools/logistics-planner",
      "/tools/progression-route", "/tools/weapon-compare", "/tools/loadout-budget",
      "/tools/artillery-calculator", "/tools/map"
    ]) {
      expect(matches(`https://www.wardogswiki.com${path}`)).toBe(true);
    }
  });

  test("skips irrelevant canonical-host paths and assets", () => {
    for (const path of [
      "/not-a-real-page", "/api/status", "/_next/static/app.js",
      "/_vercel/insights/script.js", "/robots.txt", "/sitemap.xml",
      "/images/maps/bakurani/map.webp", "/en/image.webp"
    ]) {
      expect(matches(`https://www.wardogswiki.com${path}`)).toBe(false);
    }
    expect(matches("https://wardogswiki.com/robots.txt")).toBe(false);
  });

  test("preserves actual apex, root, and legacy redirect responses", () => {
    const cases = [
      ["https://wardogswiki.com/not-a-real-page?source=bing", "https://www.wardogswiki.com/not-a-real-page?source=bing"],
      ["https://www.wardogswiki.com/", "https://www.wardogswiki.com/en"],
      ["https://www.wardogswiki.com/?utm_source=twitter&utm_medium=cpc", "https://www.wardogswiki.com/en?utm_source=twitter&utm_medium=cpc"],
      ["https://www.wardogswiki.com/guides/wardogs-playtest", "https://www.wardogswiki.com/en/guides/wardogs-playtest"],
      ["https://www.wardogswiki.com/tools/loadout-budget?cash=8000&loadout=2000", "https://www.wardogswiki.com/en/tools/loadout-budget?cash=8000&loadout=2000"]
    ];
    for (const [source, destination] of cases) {
      const response = proxy(new NextRequest(source));
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(destination);
    }
  });
});
