import type {Metadata} from "next";
import type {Locale} from "@/config/site";
import {catalogueMetadataImages} from "@/features/catalogue/catalogue-media";
import type {CatalogGuide} from "@/features/items/item-catalog-guides";
import type {WardogsItem} from "@/features/items/item-library";
import {getItemUi} from "@/features/items/item-ui";
import {resolveItemRouteTarget} from "@/features/items/item-route-availability";
import {buildLocalizedUrl, buildPageMetadata, languageTags} from "./metadata";
import {publicAssetUrl} from "./public-url";

function itemPath(item: WardogsItem) {
  return `/items/${item.type}/${item.slug}`;
}

export function getItemCanonicalLocale(locale: Locale, item: WardogsItem): Locale {
  return resolveItemRouteTarget(locale, itemPath(item)).locale;
}

export function buildItemMetadata(locale: Locale, item: WardogsItem): Metadata {
  const canonicalLocale = getItemCanonicalLocale(locale, item);
  const canonical = buildLocalizedUrl(canonicalLocale, itemPath(item));
  const languages = Object.fromEntries(
    item.indexLocales.map((itemLocale) => [itemLocale, buildLocalizedUrl(itemLocale, itemPath(item))])
  ) as Record<string, string>;
  languages["x-default"] = languages.en ?? canonical;

  const title = `WARDOGS ${item.name} - ${item.subtype}`;
  const description = item.summary;
  const image = publicAssetUrl(item.detailImage ?? "/images/og-wardogs.jpg");
  const imageAlt = item.detailImageAlt ?? `WARDOGS ${item.name}`;

  return {
    title,
    description,
    alternates: {canonical, languages},
    keywords: `WARDOGS ${item.name}, WARDOGS items, WARDOGS ${item.type}, WARDOGS guide`,
    openGraph: {
      type: "article",
      locale: languageTags[canonicalLocale],
      url: canonical,
      siteName: "WARDOGS Wiki",
      title,
      description,
      images: [{url: image, width: 1200, height: 630, alt: imageAlt}]
    },
    twitter: {card: "summary_large_image", title, description, images: [image]}
  };
}

export function buildCatalogGuideMetadata(locale: Locale, guide: CatalogGuide): Metadata {
  return buildLocalizedItemPageMetadata(
    locale,
    `/items/${guide.id}`,
    guide.title,
    guide.description,
    catalogueMetadataImages[guide.id]
  );
}

export function buildItemHubMetadata(locale: Locale): Metadata {
  const ui = getItemUi(locale);
  return buildLocalizedItemPageMetadata(
    locale,
    "/items",
    ui.hubMetaTitle,
    ui.hubMetaDescription,
    catalogueMetadataImages.hub
  );
}

function buildLocalizedItemPageMetadata(locale: Locale, pathname: string, title: string, description: string, imagePath: string): Metadata {
  const metadata = buildPageMetadata(locale, pathname, title, description);
  const image = publicAssetUrl(imagePath);

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
    robots: undefined
  };
}
