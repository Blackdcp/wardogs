import type {Metadata} from "next";
import type {GuideDocument} from "@/content/guides";
import type {Locale} from "@/config/site";
import {assetPath} from "@/lib/assets";

const languageTags: Record<Locale, string> = {
  en: "en",
  ru: "ru",
  de: "de",
  "pt-br": "pt-BR"
};

export function getSiteOrigin() {
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const value = process.env.NEXT_PUBLIC_SITE_URL ?? (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
  const origin = value.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production" && !origin.startsWith("https://")) {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production");
  }
  return origin;
}

function localizedPath(locale: Locale, pathname: string) {
  const cleanPath = pathname === "/" ? "" : `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  const localized = `/${locale}${cleanPath}`;
  return process.env.GITHUB_PAGES === "true" ? `${localized}/` : localized;
}

export function buildAlternates(locale: Locale, pathname: string): NonNullable<Metadata["alternates"]> {
  const origin = getSiteOrigin();
  return {
    canonical: `${origin}${localizedPath(locale, pathname)}`,
    languages: {
      en: `${origin}${localizedPath("en", pathname)}`,
      ru: `${origin}${localizedPath("ru", pathname)}`,
      de: `${origin}${localizedPath("de", pathname)}`,
      "pt-BR": `${origin}${localizedPath("pt-br", pathname)}`,
      "x-default": `${origin}${localizedPath("en", pathname)}`
    }
  };
}

export function buildPageMetadata(locale: Locale, pathname: string, title: string, description: string): Metadata {
  const canonical = `${getSiteOrigin()}${localizedPath(locale, pathname)}`;
  return {
    title,
    description,
    alternates: buildAlternates(locale, pathname),
    keywords: "WARDOGS, Steam, playtest, gameplay, factions, release date, guides",
    openGraph: {
      type: "website",
      locale: languageTags[locale],
      url: canonical,
      siteName: "WARDOGS Wiki",
      title,
      description,
      images: [{url: `${getSiteOrigin()}/images/og-wardogs.jpg`, width: 1200, height: 630, alt: "WARDOGS Wiki"}]
    },
    twitter: {card: "summary_large_image", title, description, images: [`${getSiteOrigin()}/images/og-wardogs.jpg`]}
  };
}

export function buildSiteMetadata(): Metadata {
  return {
    manifest: assetPath("/site.webmanifest"),
    icons: {
      icon: [
        {url: assetPath("/icons/favicon.ico"), sizes: "any"},
        {url: assetPath("/icons/favicon-32x32.png"), sizes: "32x32", type: "image/png"},
        {url: assetPath("/icons/favicon-16x16.png"), sizes: "16x16", type: "image/png"}
      ],
      apple: [{url: assetPath("/icons/apple-touch-icon.png"), sizes: "180x180", type: "image/png"}]
    }
  };
}

export function buildArticleMetadata(locale: Locale, guide: GuideDocument): Metadata {
  return buildPageMetadata(
    locale,
    `/guides/${guide.frontmatter.slug}`,
    guide.frontmatter.title,
    guide.frontmatter.description
  );
}

export {languageTags};
