import type {MetadataRoute} from "next";
import {readFileSync} from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {guideManifest} from "@/content/manifest";
import {locales} from "@/config/site";
import {getIndexableItemPaths, getItemByTypeAndSlug, itemTypes} from "@/features/items/item-library";
import {videoArticles} from "@/features/videos/video-library";
import {buildAlternates} from "@/lib/metadata";

const staticPaths = ["", "/guides", "/news", "/privacy", "/terms"];

export const dynamic = "force-static";

export function resolveItemLastModified(item: {detailUpdatedAt?: string} | undefined) {
  return new Date(item?.detailUpdatedAt ?? "2026-08-16T00:00:00.000Z");
}

function resolveGuideLastModified(locale: string, slug: string) {
  const source = readFileSync(path.join(process.cwd(), "content", locale, "guides", `${slug}.mdx`), "utf8");
  const {updatedAt} = matter(source).data as {updatedAt: string};
  return new Date(`${updatedAt}T00:00:00.000Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const indexableItemPaths = getIndexableItemPaths();
  const localizedPaths = locales.flatMap((locale) => [
    ...staticPaths,
    "/videos",
    ...(locale === "en" ? ["/items", ...itemTypes.map(({id}) => `/items/${id}`)] : []),
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
    const itemCatalogMatch = pathname === "/items" || /^\/items\/[^\/]+$/.test(pathname);
    const item = itemDetailMatch ? getItemByTypeAndSlug(itemDetailMatch[1], itemDetailMatch[2]) : undefined;
    const languages = itemDetailMatch
      ? Object.fromEntries(
        indexableItemPaths
          .filter(({type, slug}) => type === itemDetailMatch[1] && slug === itemDetailMatch[2])
          .map((path) => [path.locale, String(buildAlternates(path.locale, pathname).canonical)])
      ) as Record<string, string>
      : itemCatalogMatch
        ? {en: String(alternates.canonical), "x-default": String(alternates.canonical)}
      : alternates.languages as Record<string, string>;
    if (itemDetailMatch && languages.en) languages["x-default"] = languages.en;
    return {
      url: String(alternates.canonical),
      lastModified: guideDetailMatch
        ? resolveGuideLastModified(locale, guideDetailMatch[1])
        : resolveItemLastModified(item),
      changeFrequency: pathname.startsWith("/guides/") || pathname.startsWith("/videos/") || pathname.startsWith("/items/") ? "weekly" as const : "daily" as const,
      priority: pathname === "" ? 1 : pathname === "/guides" || pathname === "/videos" || pathname === "/items" ? 0.9 : pathname === "/news" ? 0.85 : pathname.startsWith("/guides/") || pathname.startsWith("/videos/") || pathname.startsWith("/items/") ? 0.8 : 0.3,
      alternates: {languages}
    };
  });
}
