import type {MetadataRoute} from "next";
import {guideManifest} from "@/content/manifest";
import {locales, type Locale} from "@/config/site";
import {buildAlternates} from "@/lib/metadata";

const staticPaths = ["", "/guides", "/privacy", "/terms"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...staticPaths, ...guideManifest.map(({slug}) => `/guides/${slug}`)];
  return locales.flatMap((locale: Locale) => paths.map((pathname) => {
    const alternates = buildAlternates(locale, pathname || "/");
    return {
      url: String(alternates.canonical),
      lastModified: new Date("2026-08-13T00:00:00.000Z"),
      changeFrequency: pathname.startsWith("/guides/") ? "weekly" as const : "daily" as const,
      priority: pathname === "" ? 1 : pathname === "/guides" ? 0.9 : pathname.startsWith("/guides/") ? 0.8 : 0.3,
      alternates: {languages: alternates.languages as Record<string, string>}
    };
  }));
}
