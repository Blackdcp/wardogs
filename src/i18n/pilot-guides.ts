import {readFileSync, statSync} from "node:fs";
import {readFile} from "node:fs/promises";
import path from "node:path";
import type {Metadata, MetadataRoute} from "next";
import matter from "gray-matter";
import {z} from "zod";
import {isLocale, isPilotLocale, locales, pilotLocales, siteLocales, type PilotLocale, type SiteLocale} from "@/config/site";
import {getManifestEntry} from "@/content/manifest";
import {guideFrontmatterSchema, type GuideFrontmatter} from "@/content/schema";
import {publicAssetUrl, publicRouteUrl} from "@/lib/public-url";
import {isPilotGuideSlug, pilotGuideSlugs, siteLanguageTags} from "./pilot-locales";

export type PilotGuideDocument = {locale: PilotLocale; frontmatter: GuideFrontmatter; body: string};
const contentRoot = () => path.resolve("content");

export function hasGuideTranslation(locale: SiteLocale, slug: string, root = contentRoot()): boolean {
  if (!getManifestEntry(slug) || (isPilotLocale(locale) && !isPilotGuideSlug(locale, slug))) return false;
  try {
    return statSync(path.join(root, locale, "guides", `${slug}.mdx`)).isFile();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

export async function loadPilotGuide(locale: PilotLocale, slug: string, root = contentRoot()): Promise<PilotGuideDocument | null> {
  if (!isPilotGuideSlug(locale, slug)) return null;
  const entry = getManifestEntry(slug);
  if (!entry) return null;
  let source: string;
  try {
    source = await readFile(path.join(root, locale, "guides", `${slug}.mdx`), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
  return parsePilotGuideSource(locale, slug, source);
}

function parsePilotGuideSource(locale: PilotLocale, slug: string, source: string): PilotGuideDocument {
  const entry = getManifestEntry(slug);
  if (!entry) throw new Error(`Unknown pilot guide: ${slug}`);
  const parsed = matter(source);
  // CJK descriptions need a language-appropriate length, not English-length padding.
  const schema = guideFrontmatterSchema.extend({
    description: z.string().trim().min(locale === "zh-tw" ? 40 : 100).max(160)
  });
  const frontmatter = schema.parse(parsed.data);
  for (const field of ["keyword", "category", "slug", "order"] as const) {
    if (frontmatter[field] !== entry[field]) throw new Error(`Pilot ${locale}/${slug}: ${field} must match the guide manifest`);
  }
  if (!parsed.content.trim()) throw new Error(`Empty pilot guide: ${locale}/${slug}`);
  return {locale, frontmatter, body: parsed.content.trim()};
}

export async function listPilotGuides(locale: PilotLocale, root = contentRoot()): Promise<PilotGuideDocument[]> {
  const guides = await Promise.all(pilotGuideSlugs[locale].map((slug) => loadPilotGuide(locale, slug, root)));
  return guides.filter((guide): guide is PilotGuideDocument => guide !== null);
}

export function getPilotGuideStaticParams(root = contentRoot()) {
  return pilotLocales.flatMap((locale) => pilotGuideSlugs[locale]
    .filter((slug) => hasGuideTranslation(locale, slug, root))
    .map((slug) => ({locale, slug})));
}

export function buildAvailableGuideAlternates(locale: SiteLocale, slug: string, root = contentRoot()): NonNullable<Metadata["alternates"]> | undefined {
  if (!hasGuideTranslation(locale, slug, root)) return undefined;
  const languages: Record<string, string> = {};
  for (const language of siteLocales) {
    if (hasGuideTranslation(language, slug, root)) {
      languages[siteLanguageTags[language]] = publicRouteUrl(`/${language}/guides/${slug}`);
    }
  }
  if (languages.en) languages["x-default"] = languages.en;
  return {canonical: publicRouteUrl(`/${locale}/guides/${slug}`), languages};
}

export function buildGuideIndexAlternates(locale: SiteLocale): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const language of siteLocales) {
    if (isLocale(language)) {
      languages[siteLanguageTags[language]] = publicRouteUrl(`/${language}/guides`);
    }
  }
  if (languages.en) languages["x-default"] = languages.en;
  return {canonical: publicRouteUrl(`/${locale}/guides`), languages};
}

export async function buildPilotGuideMetadata(locale: PilotLocale, slug: string): Promise<Metadata> {
  const guide = await loadPilotGuide(locale, slug);
  if (!guide) return {robots: {index: false, follow: false}};
  const {title, description} = guide.frontmatter;
  const alternates = buildAvailableGuideAlternates(locale, slug);
  return {
    title, description, alternates, robots: {index: true, follow: true},
    openGraph: {
      type: "article", title, description, locale: siteLanguageTags[locale].replace("-", "_"),
      url: String(alternates?.canonical), siteName: "WARDOGS Wiki",
      images: [{url: publicAssetUrl("/images/og-wardogs.jpg"), width: 1200, height: 630, alt: "WARDOGS"}]
    },
    twitter: {card: "summary_large_image", title, description, images: [publicAssetUrl("/images/og-wardogs.jpg")]}
  };
}

export function getPilotSitemapEntries(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of pilotLocales) {
    const guides = pilotGuideSlugs[locale]
      .filter((slug) => hasGuideTranslation(locale, slug))
      .map((slug) => parsePilotGuideSource(locale, slug, readFileSync(path.join(contentRoot(), locale, "guides", `${slug}.mdx`), "utf8")));
    if (!guides.length) continue;
    entries.push({
      url: publicRouteUrl(`/${locale}/guides`),
      lastModified: guides.map(({frontmatter}) => frontmatter.updatedAt).sort().at(-1),
      changeFrequency: "weekly", priority: 0.7,
      alternates: {languages: buildGuideIndexAlternates(locale).languages as Record<string, string>}
    });
    for (const {frontmatter} of guides) {
      entries.push({
        url: publicRouteUrl(`/${locale}/guides/${frontmatter.slug}`),
        lastModified: frontmatter.updatedAt, changeFrequency: "weekly", priority: 0.6,
        alternates: {languages: buildAvailableGuideAlternates(locale, frontmatter.slug)?.languages as Record<string, string>}
      });
    }
  }
  return entries;
}

export const fullSiteLocales = locales;
