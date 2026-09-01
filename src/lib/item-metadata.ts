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

function searchTitle(item: WardogsItem): string {
  let candidates: string[];
  if (item.type === "weapons") {
    candidates = [
      `WARDOGS ${item.name} Guide: ${item.subtype} Price, Ammo & Unlocks`,
      `WARDOGS ${item.name} Guide: Price, Ammo & Unlocks`,
      `WARDOGS ${item.name} Weapon Guide`
    ];
  } else if (item.type === "vehicles") {
    candidates = [
      `WARDOGS ${item.name} Vehicle Guide: Price, Role & Unlocks`,
      `WARDOGS ${item.name} Vehicle Guide: Price & Unlocks`,
      `WARDOGS ${item.name} Vehicle Guide`
    ];
  } else {
    candidates = [
      `WARDOGS ${item.name} Guide: ${item.subtype}, Price & Unlocks`,
      `WARDOGS ${item.name} Guide: Price & Unlocks`,
      `WARDOGS ${item.name} Guide`
    ];
  }
  return candidates.find((candidate) => candidate.length <= 60) ?? candidates.at(-1)!;
}

function clampSearchDescription(value: string): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  const complete = normalized.length >= 140
    ? normalized
    : `${normalized} Review the source-checked role, costs, and pre-release limits.`;
  if (complete.length <= 160) return complete;

  const boundary = complete.lastIndexOf(" ", 159);
  return `${complete.slice(0, boundary).replace(/[,:;.-]+$/, "")}.`;
}

function searchDescription(item: WardogsItem): string {
  const price = item.observedPrice ?? "an unconfirmed price";
  const gate = item.observedProgressionOrGate ?? "an unconfirmed unlock";
  const classOrAmmo = item.observedAmmoOrVehicleClass ?? item.subtype;

  if (item.type === "weapons") {
    return clampSearchDescription(
      `WARDOGS ${item.name} guide: ${item.subtype} observed at ${price} using ${classOrAmmo}, with ${gate} progression. Check its role, strengths, cautions, source evidence, and pre-release limits.`
    );
  }
  if (item.type === "vehicles") {
    return clampSearchDescription(
      `WARDOGS ${item.name} vehicle guide: ${classOrAmmo} at ${price} with ${gate} in Alpha 1. Check its role, strengths, cautions, evidence, and pre-release limits.`
    );
  }
  return clampSearchDescription(
    `WARDOGS ${item.name} guide: ${item.subtype} observed at ${price} with ${gate}. Check its role, strengths, cautions, source evidence, and pre-release limits.`
  );
}

export function buildItemMetadata(locale: Locale, item: WardogsItem): Metadata {
  const canonicalLocale = getItemCanonicalLocale(locale, item);
  const canonical = buildLocalizedUrl(canonicalLocale, itemPath(item));
  const languages = Object.fromEntries(
    item.indexLocales.map((itemLocale) => [itemLocale, buildLocalizedUrl(itemLocale, itemPath(item))])
  ) as Record<string, string>;
  languages["x-default"] = languages.en ?? canonical;

  const title = searchTitle(item);
  const description = searchDescription(item);
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
