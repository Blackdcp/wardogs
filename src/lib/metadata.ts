import type {Metadata} from "next";
import type {GuideDocument} from "@/content/guides";
import type {Locale} from "@/config/site";
import {assetPath} from "@/lib/assets";
import {getGuideDiscoveryImage} from "@/features/guides/guide-discovery-images";
import {getPublicSiteBase, publicAssetUrl, publicRoutePath, publicRouteUrl} from "@/lib/public-url";

const languageTags: Record<Locale, string> = {
  en: "en",
  ru: "ru",
  de: "de",
  "pt-br": "pt-BR",
  ja: "ja",
  "zh-cn": "zh-CN"
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
      ja: buildLocalizedUrl("ja", pathname),
      "zh-CN": buildLocalizedUrl("zh-cn", pathname),
      "x-default": buildLocalizedUrl("en", pathname)
    }
  };
}

export function buildPageMetadata(locale: Locale, pathname: string, title: string, description: string): Metadata {
  return buildPageMetadataWithImage(locale, pathname, title, description);
}

type SocialImage = {url: string; width: number; height: number; alt: string};

export function buildPageMetadataWithImage(
  locale: Locale,
  pathname: string,
  title: string,
  description: string,
  image?: SocialImage
): Metadata {
  const canonical = buildLocalizedUrl(locale, pathname);
  const socialImage = image ?? {
    url: publicAssetUrl("/images/og-wardogs.jpg"),
    width: 1200,
    height: 630,
    alt: "WARDOGS Wiki"
  };
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
      images: [socialImage]
    },
    twitter: {card: "summary_large_image", title, description, images: [socialImage.url]}
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
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1
      }
    }
  };
}

export function buildArticleMetadata(locale: Locale, guide: GuideDocument): Metadata {
  const discoveryImage = getGuideDiscoveryImage(guide.frontmatter.slug);
  return buildPageMetadataWithImage(
    locale,
    `/guides/${guide.frontmatter.slug}`,
    guide.frontmatter.title,
    guide.frontmatter.description,
    discoveryImage ? {...discoveryImage, url: publicAssetUrl(discoveryImage.url)} : undefined
  );
}

export {languageTags};
