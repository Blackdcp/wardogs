import type {Metadata} from "next";
import type {Locale} from "@/config/site";
import {catalogueMetadataImages} from "@/features/catalogue/catalogue-media";
import type {CatalogGuide} from "@/features/items/item-catalog-guides";
import type {WardogsItem} from "@/features/items/item-library";
import {buildLocalizedUrl, buildPageMetadata, getSiteOrigin, languageTags} from "./metadata";

function itemPath(item: WardogsItem) {
  return `/items/${item.type}/${item.slug}`;
}

export function buildItemMetadata(locale: Locale, item: WardogsItem): Metadata {
  const origin = getSiteOrigin();
  const canonical = buildLocalizedUrl(locale, itemPath(item));
  const languages = Object.fromEntries(
    item.indexLocales.map((itemLocale) => [itemLocale, buildLocalizedUrl(itemLocale, itemPath(item))])
  ) as Record<string, string>;
  languages["x-default"] = languages.en ?? canonical;

  const title = `WARDOGS ${item.name} - Item Guide & Evidence`;
  const description = `${item.summary} Includes source notes, evidence labels, role advice, strengths, counters, and pre-release caveats.`;

  return {
    title,
    description,
    alternates: {canonical, languages},
    keywords: `WARDOGS ${item.name}, WARDOGS items, WARDOGS ${item.type}, WARDOGS guide`,
    openGraph: {
      type: "article",
      locale: languageTags[locale],
      url: canonical,
      siteName: "WARDOGS Wiki",
      title,
      description,
      images: [{url: `${origin}/images/og-wardogs.jpg`, width: 1200, height: 630, alt: `WARDOGS ${item.name}`}]
    },
    twitter: {card: "summary_large_image", title, description, images: [`${origin}/images/og-wardogs.jpg`]}
  };
}

export function buildCatalogGuideMetadata(locale: Locale, guide: CatalogGuide): Metadata {
  return buildEnglishOnlyItemPageMetadata(
    locale,
    `/items/${guide.id}`,
    guide.title,
    guide.description,
    catalogueMetadataImages[guide.id]
  );
}

export function buildItemHubMetadata(locale: Locale): Metadata {
  return buildEnglishOnlyItemPageMetadata(
    locale,
    "/items",
    "WARDOGS Catalogue - Weapons, Vehicles & Equipment",
    "Browse the WARDOGS Catalogue for weapons, vehicles, ammunition, attachments, gear, equipment, loadouts, evidence labels, and pre-release caveats.",
    catalogueMetadataImages.hub
  );
}

function buildEnglishOnlyItemPageMetadata(locale: Locale, pathname: string, title: string, description: string, imagePath: string): Metadata {
  const origin = getSiteOrigin();
  const canonical = buildLocalizedUrl("en", pathname);
  const metadata = buildPageMetadata("en", pathname, title, description);
  const image = `${origin}${imagePath}`;

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{url: image, alt: title}]
    },
    twitter: {
      ...metadata.twitter,
      images: [image]
    },
    robots: locale === "en" ? undefined : {index: false, follow: true},
    alternates: {
      canonical,
      languages: {en: canonical, "x-default": canonical}
    }
  };
}
