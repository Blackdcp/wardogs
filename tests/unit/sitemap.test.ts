import {describe, expect, it} from "vitest";
import sitemap, {resolveItemLastModified} from "../../src/app/sitemap";
import {guideManifest} from "../../src/content/manifest";
import {locales} from "../../src/config/site";
import {itemLibrary, itemTypes} from "../../src/features/items/item-library";
import {videoArticles} from "../../src/features/videos/video-library";

const origin = "http://localhost:3000";

function itemAlternates(pathname: string) {
  return {
    en: `${origin}/en${pathname}`,
    ru: `${origin}/ru${pathname}`,
    de: `${origin}/de${pathname}`,
    "pt-br": `${origin}/pt-br${pathname}`,
    ja: `${origin}/ja${pathname}`,
    "x-default": `${origin}/en${pathname}`
  };
}

function pageAlternates(pathname: string) {
  return {
    en: `${origin}/en${pathname}`,
    ru: `${origin}/ru${pathname}`,
    de: `${origin}/de${pathname}`,
    "pt-BR": `${origin}/pt-br${pathname}`,
    ja: `${origin}/ja${pathname}`,
    "x-default": `${origin}/en${pathname}`
  };
}

describe("sitemap", () => {
  it("publishes every guide in all five locales with reciprocal hreflang", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const locale of locales) {
      for (const {slug} of guideManifest) {
        const pathname = `/guides/${slug}`;
        const url = `${origin}/${locale}${pathname}`;
        const entry = entriesByUrl.get(url);
        expect(entry, url).toBeDefined();
        expect(entry?.alternates?.languages, url).toEqual(pageAlternates(pathname));
        expect(entry?.changeFrequency, url).toBe("weekly");
      }
    }
  });

  it("uses each localized guide's editorial date", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    expect(new Date(entriesByUrl.get(`${origin}/en/guides/wardogs-fob-guide`)!.lastModified!).toISOString())
      .toBe("2026-08-26T00:00:00.000Z");
    expect(new Date(entriesByUrl.get(`${origin}/ja/guides/wardogs-money-guide`)!.lastModified!).toISOString())
      .toBe("2026-08-23T00:00:00.000Z");
  });

  it("includes the video hub and every standalone video article in all five locales", () => {
    const urls = new Set(sitemap().map((entry) => entry.url));

    for (const locale of locales) {
      expect(urls.has(`${origin}/${locale}/videos`)).toBe(true);
      for (const {slug} of videoArticles) {
        expect(urls.has(`${origin}/${locale}/videos/${slug}`), `${locale}/${slug}`).toBe(true);
      }
    }
  });

  it("includes item hubs, all seven categories, and all 40 details in every locale", () => {
    const urls = new Set(sitemap().map((entry) => entry.url));

    for (const locale of locales) {
      expect(urls.has(`${origin}/${locale}/items`)).toBe(true);
      for (const {id} of itemTypes) {
        expect(urls.has(`${origin}/${locale}/items/${id}`), `${locale}/${id}`).toBe(true);
      }
      for (const item of itemLibrary) {
        expect(urls.has(`${origin}/${locale}/items/${item.type}/${item.slug}`), `${locale}/${item.slug}`).toBe(true);
      }
    }
  });

  it("gives every item detail five localized alternates plus English x-default", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const locale of locales) {
      for (const item of itemLibrary) {
        const pathname = `/items/${item.type}/${item.slug}`;
        const url = `${origin}/${locale}${pathname}`;
        expect(entriesByUrl.get(url)?.alternates?.languages, url).toEqual(itemAlternates(pathname));
      }
    }
  });

  it("gives catalogue hubs and categories all five language alternates", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const pathname of ["/items", ...itemTypes.map(({id}) => `/items/${id}`)]) {
      for (const locale of locales) {
        expect(entriesByUrl.get(`${origin}/${locale}${pathname}`)?.alternates?.languages).toEqual(pageAlternates(pathname));
      }
    }
  });

  it("uses each item's editorial publication date instead of the Alpha observation date", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const locale of locales) {
      for (const item of itemLibrary) {
        const url = `${origin}/${locale}/items/${item.type}/${item.slug}`;
        expect(new Date(entriesByUrl.get(url)!.lastModified!).toISOString(), url)
          .toBe(new Date(`${item.detailUpdatedAt ?? "2026-08-16"}T00:00:00.000Z`).toISOString());
        expect(entriesByUrl.get(url)?.changeFrequency, url).toBe("weekly");
      }
    }
  });

  it("resolves distinct supplied detail dates", () => {
    expect(resolveItemLastModified({detailUpdatedAt: "2026-01-02"}).toISOString()).toBe("2026-01-02T00:00:00.000Z");
    expect(resolveItemLastModified({detailUpdatedAt: "2026-05-19"}).toISOString()).toBe("2026-05-19T00:00:00.000Z");
    expect(resolveItemLastModified(undefined).toISOString()).toBe("2026-08-16T00:00:00.000Z");
  });

  it("contains no fragments, queries, filter routes, or duplicate URLs", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls.some((url) => url.includes("#") || url.includes("?") || /\/(?:items\/)?(?:weapons|vehicles)\/(?:filter|search)\//.test(url))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("uses the same trailing-slash form in a Pages export", () => {
    const previous = process.env.GITHUB_PAGES;
    process.env.GITHUB_PAGES = "true";
    try {
      expect(sitemap().map((entry) => entry.url)).toContain(`${origin}/ja/items/weapons/ak74/`);
    } finally {
      if (previous === undefined) delete process.env.GITHUB_PAGES;
      else process.env.GITHUB_PAGES = previous;
    }
  });

  it("uses a host-only Pages URL plus the configured base exactly once", () => {
    const previous = {
      basePath: process.env.NEXT_PUBLIC_BASE_PATH,
      githubPages: process.env.GITHUB_PAGES,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    };
    process.env.NEXT_PUBLIC_BASE_PATH = "/wardogs";
    process.env.GITHUB_PAGES = "true";
    process.env.NEXT_PUBLIC_SITE_URL = "https://blackdcp.github.io";
    try {
      const pathname = "/items/vehicles/bobcat";
      const bobcat = sitemap().find((entry) => entry.url.includes(`/ja${pathname}`));
      expect(bobcat?.url).toBe(`https://blackdcp.github.io/wardogs/ja${pathname}/`);
      expect(bobcat?.alternates?.languages).toEqual({
        en: `https://blackdcp.github.io/wardogs/en${pathname}/`,
        ru: `https://blackdcp.github.io/wardogs/ru${pathname}/`,
        de: `https://blackdcp.github.io/wardogs/de${pathname}/`,
        "pt-br": `https://blackdcp.github.io/wardogs/pt-br${pathname}/`,
        ja: `https://blackdcp.github.io/wardogs/ja${pathname}/`,
        "x-default": `https://blackdcp.github.io/wardogs/en${pathname}/`
      });
    } finally {
      for (const [key, value] of Object.entries(previous)) {
        const envKey = key === "basePath" ? "NEXT_PUBLIC_BASE_PATH" : key === "githubPages" ? "GITHUB_PAGES" : "NEXT_PUBLIC_SITE_URL";
        if (value === undefined) delete process.env[envKey];
        else process.env[envKey] = value;
      }
    }
  });
});
