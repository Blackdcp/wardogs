import type {MetadataRoute} from "next";
import {readFileSync} from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {guideManifest} from "@/content/manifest";
import {locales} from "@/config/site";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import {getCatalogGuide} from "@/features/items/item-catalog-guides";
import {itemHubPreviewSlugs} from "@/features/items/item-hub-data";
import {getFeaturedItems, getIndexableItemPaths, getItemByTypeAndSlug, itemLibrary, itemTypes} from "@/features/items/item-library";
import {getItemLatestVerifiedAt, type ItemFreshnessSource} from "@/features/items/item-freshness";
import {operationsAtlasRecords} from "@/features/maps/operations-atlas";
import {NEWS_CHECKLIST_SLUGS, NEWS_UPDATES} from "@/features/news/news-data";
import {videoArticles} from "@/features/videos/video-library";
import {buildAlternates} from "@/lib/metadata";

const staticPaths = [
  "",
  "/guides",
  "/news",
  "/maps",
  "/tools/system-check",
  "/tools/loadout-budget",
  "/tools/weapon-compare",
  "/tools/ammo-matcher",
  "/tools/progression-route",
  "/tools/logistics-planner",
  "/about",
  "/contact",
  "/editorial-policy",
  "/privacy",
  "/terms",
];

export const dynamic = "force-static";

const freshHubPaths = new Set([
  "",
  "/guides",
  "/news",
  "/tools/weapon-compare",
  "/tools/ammo-matcher",
  "/tools/progression-route",
  "/tools/logistics-planner",
]);

function latestDate(dates: string[]) {
  return dates.reduce((latest, candidate) =>
    Date.parse(candidate) > Date.parse(latest) ? candidate : latest, "2026-08-16");
}

function itemHubDate(type?: string) {
  if (!type) {
    const previewDates = (["weapons", "vehicles"] as const).flatMap((previewType) =>
      getCatalogueRecords(previewType)
        .filter(({slug}) => itemHubPreviewSlugs[previewType].some((previewSlug) => previewSlug === slug))
        .flatMap((record) => [record.evidence.verifiedAt, ...record.changeHistory.map(({verifiedAt}) => verifiedAt)])
    );
    const guideDates = itemTypes.map(({id}) => getCatalogGuide(id)?.lastReviewedAt ?? "2026-08-16");
    return latestDate([...getFeaturedItems(6).map(getItemLatestVerifiedAt), ...previewDates, ...guideDates]);
  }
  if (type === "loadouts") return getCatalogGuide("loadouts")?.lastReviewedAt ?? "2026-08-16";
  const items = itemLibrary.filter((item) => item.type === type);
  const types = itemTypes.filter(({id}) => id === type);
  const catalogueDates = types.flatMap(({id}) => id === "loadouts" ? [] : getCatalogueRecords(id).flatMap((record) => [
    record.evidence.verifiedAt,
    ...record.changeHistory.map(({verifiedAt}) => verifiedAt)
  ]));
  return latestDate([...items.map(getItemLatestVerifiedAt), ...catalogueDates, getCatalogGuide(type)?.lastReviewedAt ?? "2026-08-16"]);
}

export function resolveMapHubLastModified(catalogueDates: string[], guideDates: string[]) {
  return new Date(`${latestDate([...catalogueDates, ...guideDates])}T00:00:00.000Z`);
}

function mapHubDate(locale: string) {
  const catalogueDates = getCatalogueRecords("maps").flatMap((record) => [
    record.evidence.verifiedAt,
    ...record.changeHistory.map(({verifiedAt}) => verifiedAt)
  ]);
  const guideDates = operationsAtlasRecords.map(({guideSlug}) => resolveGuideUpdatedAt(locale, guideSlug));
  return resolveMapHubLastModified(catalogueDates, guideDates);
}

type EditorialHubSources = {
  guides: string[];
  news: string[];
  videos: string[];
  items: string[];
  maps: string[];
};

export function resolveEditorialHubLastModified(pathname: "" | "/guides" | "/news", sources: EditorialHubSources) {
  const dates = pathname === "/guides"
    ? [...sources.guides, ...sources.videos]
    : pathname === "/news"
      ? sources.news
      : Object.values(sources).flat();
  return new Date(`${latestDate(dates)}T00:00:00.000Z`);
}

function editorialHubSources(locale: string): EditorialHubSources {
  return {
    guides: guideManifest.map(({slug}) => resolveGuideUpdatedAt(locale, slug)),
    news: [
      ...NEWS_UPDATES.map(({date}) => date),
      ...NEWS_CHECKLIST_SLUGS.map((slug) => resolveGuideUpdatedAt(locale, slug))
    ],
    videos: videoArticles.map(({updatedDate}) => updatedDate),
    items: [itemHubDate()],
    maps: [mapHubDate(locale).toISOString().slice(0, 10)]
  };
}

function resolvePageLastModified(locale: string, pathname: string) {
  if (pathname === "" || pathname === "/guides" || pathname === "/news") {
    return resolveEditorialHubLastModified(pathname, editorialHubSources(locale));
  }
  if (pathname === "/videos") {
    return new Date(`${latestDate(videoArticles.map(({updatedDate}) => updatedDate))}T00:00:00.000Z`);
  }
  if (pathname === "/maps") {
    return mapHubDate(locale);
  }
  if (pathname === "/items" || /^\/items\/[^/]+$/.test(pathname)) {
    return new Date(`${itemHubDate(pathname === "/items" ? undefined : pathname.slice("/items/".length))}T00:00:00.000Z`);
  }
  if (freshHubPaths.has(pathname)) {
    return new Date("2026-09-17T00:00:00.000Z");
  }
  return new Date("2026-08-16T00:00:00.000Z");
}

export function resolveItemLastModified(item: ItemFreshnessSource | undefined) {
  return new Date(`${getItemLatestVerifiedAt(item)}T00:00:00.000Z`);
}

function resolveGuideUpdatedAt(locale: string, slug: string) {
  const source = readFileSync(path.join(process.cwd(), "content", locale, "guides", `${slug}.mdx`), "utf8");
  const {updatedAt} = matter(source).data as {updatedAt: string};
  return updatedAt;
}

function resolveGuideLastModified(locale: string, slug: string) {
  return new Date(`${resolveGuideUpdatedAt(locale, slug)}T00:00:00.000Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const indexableItemPaths = getIndexableItemPaths();
  const localizedPaths = locales.flatMap((locale) => [
    ...staticPaths,
    "/videos",
    "/items",
    ...itemTypes.map(({id}) => `/items/${id}`),
    ...guideManifest.map(({slug}) => `/guides/${slug}`),
    ...videoArticles.map(({slug}) => `/videos/${slug}`),
    ...indexableItemPaths
      .filter((path) => path.locale === locale)
      .map(({type, slug}) => `/items/${type}/${slug}`)
  ].map((pathname) => ({locale, pathname})));

  return localizedPaths.map(({locale, pathname}) => {
    const alternates = buildAlternates(locale, pathname || "/");
    const itemDetailMatch = pathname.match(/^\/items\/([^\/]+)\/([^\/]+)$/);
    const guideDetailMatch = pathname.match(/^\/guides\/([^\/]+)$/);
    const videoDetailMatch = pathname.match(/^\/videos\/([^\/]+)$/);
    const item = itemDetailMatch ? getItemByTypeAndSlug(itemDetailMatch[1], itemDetailMatch[2]) : undefined;
    const videoArticle = videoDetailMatch
      ? videoArticles.find(({slug}) => slug === videoDetailMatch[1])
      : undefined;
    const languages = itemDetailMatch
      ? Object.fromEntries(
        indexableItemPaths
          .filter(({type, slug}) => type === itemDetailMatch[1] && slug === itemDetailMatch[2])
          .map((path) => [path.locale, String(buildAlternates(path.locale, pathname).canonical)])
      ) as Record<string, string>
      : alternates.languages as Record<string, string>;
    if (itemDetailMatch && languages.en) languages["x-default"] = languages.en;
    return {
      url: String(alternates.canonical),
      lastModified: guideDetailMatch
        ? resolveGuideLastModified(locale, guideDetailMatch[1])
        : videoArticle
          ? new Date(`${videoArticle.updatedDate}T00:00:00.000Z`)
        : itemDetailMatch
          ? resolveItemLastModified(item)
          : resolvePageLastModified(locale, pathname),
      changeFrequency: pathname.startsWith("/guides/") || pathname.startsWith("/videos/") || pathname.startsWith("/items/") ? "weekly" as const : "daily" as const,
      priority: pathname === "" ? 1 : pathname === "/guides" || pathname === "/videos" || pathname === "/items" ? 0.9 : pathname === "/news" ? 0.85 : pathname.startsWith("/guides/") || pathname.startsWith("/videos/") || pathname.startsWith("/items/") ? 0.8 : 0.3,
      alternates: {languages}
    };
  });
}
