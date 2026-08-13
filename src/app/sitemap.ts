import type {MetadataRoute} from "next";
import {guideManifest} from "@/content/manifest";
import {locales, type Locale} from "@/config/site";
import {buildAlternates, getSiteOrigin} from "@/lib/metadata";

const staticPaths = ["", "/guides", "/privacy", "/terms"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const paths = [...staticPaths, ...guideManifest.map(({slug}) => `/guides/${slug}`)];
  return locales.flatMap((locale: Locale) => paths.map((pathname) => ({
    url: `${origin}/${locale}${pathname}`,
    lastModified: new Date("2026-08-13T00:00:00.000Z"),
    changeFrequency: pathname.startsWith("/guides/") ? "weekly" as const : "daily" as const,
    priority: pathname === "" ? 1 : pathname === "/guides" ? 0.9 : pathname.startsWith("/guides/") ? 0.8 : 0.3,
    alternates: {languages: buildAlternates(locale, pathname || "/").languages as Record<string, string>}
  })));
}
