import type {Metadata} from "next";
import type {GuideDocument} from "@/content/guides";
import type {Locale} from "@/config/site";
import {assetPath} from "@/lib/assets";
import {getPublicSiteBase, publicAssetUrl, publicRoutePath, publicRouteUrl} from "@/lib/public-url";

const languageTags: Record<Locale, string> = {
  en: "en",
  ru: "ru",
  de: "de",
  "pt-br": "pt-BR"
};

export function getSiteOrigin() {
  const origin = getPublicSiteBase();
  if (process.env.NODE_ENV === "production" && !origin.startsWith("https://")) {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production");
  }
  return origin;
}

export function localizedPath(locale: Locale, pathname: string) {
  const cleanPath = pathname === "/" ? "" : `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  return publicRoutePath(`/${locale}${cleanPath}`);
}

export function buildLocalizedUrl(locale: Locale, pathname: string) {
  const cleanPath = pathname === "/" ? "" : `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  return publicRouteUrl(`/${locale}${cleanPath}`);
}

export function buildAlternates(locale: Locale, pathname: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: buildLocalizedUrl(locale, pathname),
    languages: {
      en: buildLocalizedUrl("en", pathname),
      ru: buildLocalizedUrl("ru", pathname),
      de: buildLocalizedUrl("de", pathname),
      "pt-BR": buildLocalizedUrl("pt-br", pathname),
      "x-default": buildLocalizedUrl("en", pathname)
    }
  };
}

export function buildPageMetadata(locale: Locale, pathname: string, title: string, description: string): Metadata {
  const canonical = buildLocalizedUrl(locale, pathname);
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
      images: [{url: publicAssetUrl("/images/og-wardogs.jpg"), width: 1200, height: 630, alt: "WARDOGS Wiki"}]
    },
    twitter: {card: "summary_large_image", title, description, images: [publicAssetUrl("/images/og-wardogs.jpg")]}
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
