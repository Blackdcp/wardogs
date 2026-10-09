import {describe, expect, it} from "vitest";
import {readFileSync} from "node:fs";
import matter from "gray-matter";
import sitemap, {resolveEditorialHubLastModified, resolveItemLastModified, resolveMapHubLastModified} from "../../src/app/sitemap";
import {guideManifest} from "../../src/content/manifest";
import {locales} from "../../src/config/site";
import {itemLibrary, itemTypes} from "../../src/features/items/item-library";
import {getFeaturedItems} from "../../src/features/items/item-library";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {getCatalogGuide} from "../../src/features/items/item-catalog-guides";
import {getItemLatestVerifiedAt} from "../../src/features/items/item-freshness";
import {itemHubPreviewSlugs} from "../../src/features/items/item-hub-data";
import {videoArticles} from "../../src/features/videos/video-library";
import {videoCandidates} from "../../src/features/videos/video-candidates";
import {getRecentNews} from "../../src/features/news/recent-news";
import {getServiceUpdates} from "../../src/features/news/service-updates";
import {NEWS_CHECKLIST_SLUGS, NEWS_UPDATES} from "../../src/features/news/news-data";
import {getReleaseImpacts} from "../../src/features/releases/release-impacts";
import {resolvePageContentUpdatedAt} from "../../src/lib/editorial-freshness";

const origin = "http://localhost:3000";

function itemAlternates(pathname: string) {
  return {
    en: `${origin}/en${pathname}`,
    ru: `${origin}/ru${pathname}`,
    de: `${origin}/de${pathname}`,
    "pt-br": `${origin}/pt-br${pathname}`,
    ja: `${origin}/ja${pathname}`,
    "zh-cn": `${origin}/zh-cn${pathname}`,
    "zh-tw": `${origin}/zh-tw${pathname}`,
    pl: `${origin}/pl${pathname}`,
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
    "zh-CN": `${origin}/zh-cn${pathname}`,
    "zh-TW": `${origin}/zh-tw${pathname}`,
    pl: `${origin}/pl${pathname}`,
    "x-default": `${origin}/en${pathname}`
  };
}

describe("sitemap", () => {
  it("advances editorial hub dates when their underlying content gets newer", () => {
    const sources = {
      guides: ["2026-09-20", "2026-10-01"],
      news: ["2026-09-22", "2026-09-28"],
      videos: ["2026-09-25"],
      items: ["2026-09-27"],
      maps: ["2026-09-24"]
    };

    expect(resolveEditorialHubLastModified("/guides", sources).toISOString()).toBe("2026-10-01T00:00:00.000Z");
    expect(resolveEditorialHubLastModified("/news", sources).toISOString()).toBe("2026-09-28T00:00:00.000Z");
    expect(resolveEditorialHubLastModified("", sources).toISOString()).toBe("2026-10-01T00:00:00.000Z");
  });

  it("advances the map hub when a linked guide is refreshed", () => {
    expect(resolveMapHubLastModified(["2026-09-14"], ["2026-09-26"]).toISOString())
      .toBe("2026-09-26T00:00:00.000Z");
  });

  it("marks refreshed hubs with the current editorial date", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));
    const dateOf = (pathname: string) => new Date(entriesByUrl.get(`${origin}/en${pathname}`)!.lastModified!).toISOString().slice(0, 10);
    const guideDate = (slug: string) => String(matter(readFileSync(`content/en/guides/${slug}.mdx`, "utf8")).data.updatedAt);
    const videoDates = [...videoArticles.map(({updatedDate}) => updatedDate), ...videoCandidates.map(({metadataCheckedAt}) => metadataCheckedAt), ...getReleaseImpacts("/videos").map(({reviewedAt}) => reviewedAt)];
    const latestGuide = [...guideManifest.map(({slug}) => guideDate(slug)), ...videoDates].sort().at(-1)!;
    expect(dateOf("/guides")).toBe(latestGuide);
    expect(dateOf("/videos")).toBe(videoDates.sort().at(-1));
    expect(dateOf("/news")).toBe([...NEWS_UPDATES.map(({date}) => date), ...getRecentNews("en").map(({date}) => date), ...getServiceUpdates("en").map(({date}) => date), ...NEWS_CHECKLIST_SLUGS.map(guideDate)].sort().at(-1));
    for (const pathname of ["/tools/logistics-planner", "/tools/progression-route"]) {
      expect(dateOf(pathname)).toBe("2026-10-03");
    }
    for (const pathname of ["/guides", "/videos", "/maps", "/items", "/news"]) {
      expect(dateOf("") >= dateOf(pathname), pathname).toBe(true);
    }
  });

  it("publishes the revised product pages with their actual October 9 revision in every locale", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));
    for (const locale of locales) {
      for (const pathname of ["/tools", "/tools/ammo-matcher", "/tools/map", "/tools/artillery-calculator", "/tools/weapon-compare", "/tools/loadout-budget", "/gold-market", "/videos", "/items/weapons"]) {
        const url = `${origin}/${locale}${pathname}`;
        expect(new Date(entriesByUrl.get(url)!.lastModified!).toISOString(), url).toBe("2026-10-09T00:00:00.000Z");
      }
      for (const pathname of ["/about", "/contact", "/black-market", "/skins"]) {
        const url = `${origin}/${locale}${pathname}`;
        expect(new Date(entriesByUrl.get(url)!.lastModified!).toISOString(), url).toBe("2026-08-16T00:00:00.000Z");
      }
    }
  });

  it("keeps later evidence newer than the feature release and does not revise unrelated pages", () => {
    for (const pathname of ["/tools/map", "/videos", "/gold-market", "/items/weapons"]) {
      expect(resolvePageContentUpdatedAt(pathname, ["2026-10-12"]), pathname).toBe("2026-10-12");
    }
    expect(resolvePageContentUpdatedAt("/tools/logistics-planner", ["2026-10-03"])).toBe("2026-10-03");
    expect(resolvePageContentUpdatedAt("/items/vehicles", ["2026-09-20"])).toBe("2026-09-20");
  });

  it("does not let an unfeatured detail update falsely refresh the item homepage", () => {
    const visible = [
      ...getFeaturedItems(6).map(getItemLatestVerifiedAt),
      ...(["weapons", "vehicles"] as const).flatMap((type) =>
        getCatalogueRecords(type)
          .filter((record) => itemHubPreviewSlugs[type].some((slug) => slug === record.slug))
          .flatMap((record) => [record.evidence.verifiedAt, ...record.changeHistory.map(({verifiedAt}) => verifiedAt)])
      ),
      ...itemTypes.map(({id}) => getCatalogGuide(id)?.lastReviewedAt ?? "2026-08-16")
    ];
    const latestVisible = visible.sort().at(-1);
    const itemHome = sitemap().find((entry) => entry.url === `${origin}/en/items`);

    expect(new Date(itemHome!.lastModified!).toISOString()).toBe(`${latestVisible}T00:00:00.000Z`);
  });

  it("publishes full-site guides with reciprocal hreflang for all eight translations", () => {
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
      .toBe(`${matter(readFileSync("content/en/guides/wardogs-fob-guide.mdx", "utf8")).data.updatedAt}T00:00:00.000Z`);
    expect(new Date(entriesByUrl.get(`${origin}/ja/guides/wardogs-money-guide`)!.lastModified!).toISOString())
      .toBe(`${matter(readFileSync("content/ja/guides/wardogs-money-guide.mdx", "utf8")).data.updatedAt}T00:00:00.000Z`);
  });

  it("includes the video hub and every standalone video article in every locale", () => {
    const urls = new Set(sitemap().map((entry) => entry.url));

    for (const locale of locales) {
      expect(urls.has(`${origin}/${locale}/videos`)).toBe(true);
      for (const {slug} of videoArticles) {
        expect(urls.has(`${origin}/${locale}/videos/${slug}`), `${locale}/${slug}`).toBe(true);
      }
    }
  });

  it("includes the localized Tools hub with reciprocal alternates", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));
    for (const locale of locales) {
      const url = `${origin}/${locale}/tools`;
      expect(entriesByUrl.get(url), url).toBeDefined();
      expect(entriesByUrl.get(url)?.alternates?.languages).toEqual(pageAlternates("/tools"));
    }
  });

  it("uses each video article's actual editorial update date", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const locale of locales) {
      for (const article of videoArticles) {
        const url = `${origin}/${locale}/videos/${article.slug}`;
        expect(new Date(entriesByUrl.get(url)!.lastModified!).toISOString(), url)
          .toBe(`${article.updatedDate}T00:00:00.000Z`);
      }
    }
  });

  it("includes item hubs, all categories, and all indexable details in every locale", () => {
    const urls = new Set(sitemap().map((entry) => entry.url));

    for (const locale of locales) {
      expect(urls.has(`${origin}/${locale}/items`)).toBe(true);
      for (const {id} of itemTypes) {
        expect(urls.has(`${origin}/${locale}/items/${id}`), `${locale}/${id}`).toBe(true);
      }
      for (const item of itemLibrary.filter((item) => item.indexable)) {
        expect(urls.has(`${origin}/${locale}/items/${item.type}/${item.slug}`), `${locale}/${item.slug}`).toBe(true);
      }
    }
  });

  it("gives every item detail eight localized alternates plus English x-default", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const locale of locales) {
      for (const item of itemLibrary.filter((item) => item.indexable)) {
        const pathname = `/items/${item.type}/${item.slug}`;
        const url = `${origin}/${locale}${pathname}`;
        expect(entriesByUrl.get(url)?.alternates?.languages, url).toEqual(itemAlternates(pathname));
      }
    }
  });

  it("gives catalogue hubs and categories all eight language alternates", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const pathname of ["/items", ...itemTypes.map(({id}) => `/items/${id}`)]) {
      for (const locale of locales) {
        expect(entriesByUrl.get(`${origin}/${locale}${pathname}`)?.alternates?.languages).toEqual(pageAlternates(pathname));
      }
    }
  });

  it("uses each item's latest detail, evidence, or change-history verification date", () => {
    const entriesByUrl = new Map(sitemap().map((entry) => [entry.url, entry]));

    for (const locale of locales) {
      for (const item of itemLibrary.filter((item) => item.indexable)) {
        const url = `${origin}/${locale}/items/${item.type}/${item.slug}`;
        expect(new Date(entriesByUrl.get(url)!.lastModified!).toISOString(), url)
          .toBe(resolveItemLastModified(item).toISOString());
        expect(entriesByUrl.get(url)?.changeFrequency, url).toBe("weekly");
      }
    }
  });

  it("locks Deagle freshness to its latest editorial update", () => {
    const deagle = itemLibrary.find((item) => item.slug === "deagle");

    expect(deagle).toBeDefined();
    expect(resolveItemLastModified(deagle).toISOString()).toBe("2026-09-26T00:00:00.000Z");
    expect(new Date(sitemap().find((entry) => entry.url === `${origin}/en/items/weapons/deagle`)!.lastModified!).toISOString())
      .toBe("2026-09-26T00:00:00.000Z");
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

  it("includes the shareable system-check and loadout-budget tools", () => {
    const urls = new Set(sitemap().map((entry) => entry.url));

    for (const locale of locales) {
      expect(urls.has(`${origin}/${locale}/tools/system-check`)).toBe(true);
      expect(urls.has(`${origin}/${locale}/tools/loadout-budget`)).toBe(true);
    }
  });

  it("includes each localized operations atlas exactly once", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const locale of locales) {
      const url = `${origin}/${locale}/maps`;
      expect(urls.filter((candidate) => candidate === url), url).toHaveLength(1);
      expect(entries.find((entry) => entry.url === url)?.alternates?.languages).toEqual(pageAlternates("/maps"));
    }
  });

  it("includes the interactive three-basemap tool in all eight locales", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const locale of locales) {
      const url = `${origin}/${locale}/tools/map`;
      expect(urls.filter((candidate) => candidate === url), url).toHaveLength(1);
      expect(entries.find((entry) => entry.url === url)?.alternates?.languages).toEqual(pageAlternates("/tools/map"));
    }
  });

  it("indexes all newly published catalogue destinations in every locale", () => {
    const urls = new Set(sitemap().map(({url}) => url));
    for (const locale of locales) {
      for (const path of ["/vehicles/helicopters", "/skins", "/black-market", "/gold-market"]) {
        expect(urls.has(`${origin}/${locale}${path}`), `${locale}${path}`).toBe(true);
      }
    }
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
        "zh-cn": `https://blackdcp.github.io/wardogs/zh-cn${pathname}/`,
        "zh-tw": `https://blackdcp.github.io/wardogs/zh-tw${pathname}/`,
        pl: `https://blackdcp.github.io/wardogs/pl${pathname}/`,
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
