import type {MetadataRoute} from "next";
import {guideManifest} from "@/content/manifest";
import {locales, type Locale} from "@/config/site";
import {getIndexableItemPaths, getItemByTypeAndSlug, itemTypes} from "@/features/items/item-library";
import {getItemLatestVerifiedAt, type ItemFreshnessSource} from "@/features/items/item-freshness";
import {videoArticles} from "@/features/videos/video-library";
import {buildAlternates} from "@/lib/metadata";
import {getPilotSitemapEntries} from "@/i18n/pilot-guides";
import {editorialHubSources, getHomeLastModified, itemHubDate, latestDate, mapHubDate, resolveEditorialHubLastModified, resolveGuideUpdatedAt} from "@/lib/editorial-freshness";

export {resolveEditorialHubLastModified, resolveMapHubLastModified} from "@/lib/editorial-freshness";

const staticPaths = [
  "",
  "/guides",
  "/news",
  "/maps",
  "/vehicles/helicopters",
  "/skins",
  "/black-market",
  "/gold-market",
  "/tools",
  "/tools/system-check",
  "/tools/loadout-budget",
  "/tools/cash-xp-calculator",
  "/tools/weapon-compare",
  "/tools/ammo-matcher",
  "/tools/progression-route",
  "/tools/logistics-planner",
  "/tools/map",
  "/tools/artillery-calculator",
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
  "/tools",
  "/tools/weapon-compare",
  "/tools/loadout-budget",
  "/tools/cash-xp-calculator",
  "/tools/system-check",
  "/tools/map",
  "/tools/artillery-calculator",
  "/tools/ammo-matcher",
  "/tools/progression-route",
  "/tools/logistics-planner",
]);

function resolvePageLastModified(locale: Locale, pathname: string) {
  if (pathname === "") return getHomeLastModified(locale);
  if (pathname === "/guides" || pathname === "/news") {
    return resolveEditorialHubLastModified(pathname, editorialHubSources(locale));
  }
  if (pathname === "/videos") {
    return new Date(`${latestDate(editorialHubSources(locale).videos)}T00:00:00.000Z`);
  }
  if (pathname === "/maps") {
    return mapHubDate(locale);
  }
  if (pathname === "/items" || /^\/items\/[^/]+$/.test(pathname)) {
    return new Date(`${itemHubDate(pathname === "/items" ? undefined : pathname.slice("/items/".length))}T00:00:00.000Z`);
  }
  if (pathname === "/tools") return new Date("2026-10-05T00:00:00.000Z");
  if (freshHubPaths.has(pathname)) {
    return new Date("2026-10-03T00:00:00.000Z");
  }
  return new Date("2026-08-16T00:00:00.000Z");
}

export function resolveItemLastModified(item: ItemFreshnessSource | undefined) {
  return new Date(`${getItemLatestVerifiedAt(item)}T00:00:00.000Z`);
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

  const fullSiteEntries = localizedPaths.map(({locale, pathname}) => {
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
  return [...fullSiteEntries, ...getPilotSitemapEntries()];
}
