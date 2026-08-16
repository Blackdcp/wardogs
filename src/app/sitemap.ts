import type {MetadataRoute} from "next";
import {guideManifest} from "@/content/manifest";
import {locales} from "@/config/site";
import {getIndexableItemPaths, itemTypes} from "@/features/items/item-library";
import {videoArticles} from "@/features/videos/video-library";
import {buildAlternates} from "@/lib/metadata";

const staticPaths = ["", "/guides", "/news", "/privacy", "/terms", "/items"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedPaths = locales.flatMap((locale) => [
    ...staticPaths,
    "/videos",
    ...itemTypes.map(({id}) => `/items/${id}`),
    ...guideManifest.map(({slug}) => `/guides/${slug}`),
    ...videoArticles.map(({slug}) => `/videos/${slug}`),
    ...getIndexableItemPaths()
      .filter((path) => path.locale === locale)
      .map(({type, slug}) => `/items/${type}/${slug}`)
  ].map((pathname) => ({locale, pathname})));

  return localizedPaths.map(({locale, pathname}) => {
    const alternates = buildAlternates(locale, pathname || "/");
    return {
      url: String(alternates.canonical),
      lastModified: new Date("2026-08-16T00:00:00.000Z"),
      changeFrequency: pathname.startsWith("/guides/") || pathname.startsWith("/videos/") || pathname.startsWith("/items/") ? "weekly" as const : "daily" as const,
      priority: pathname === "" ? 1 : pathname === "/guides" || pathname === "/videos" || pathname === "/items" ? 0.9 : pathname === "/news" ? 0.85 : pathname.startsWith("/guides/") || pathname.startsWith("/videos/") || pathname.startsWith("/items/") ? 0.8 : 0.3,
      alternates: {languages: alternates.languages as Record<string, string>}
    };
  });
}
