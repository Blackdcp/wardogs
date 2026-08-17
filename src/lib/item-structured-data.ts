import type {Locale} from "@/config/site";
import {catalogueMetadataImages} from "@/features/catalogue/catalogue-media";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import type {CatalogueRecordType} from "@/features/catalogue/catalogue-types";
import {getItemsByType, itemTypes, type ItemTypeId, type WardogsItem} from "@/features/items/item-library";
import {getCatalogGuide} from "@/features/items/item-catalog-guides";
import {buildLocalizedUrl, getSiteOrigin} from "./metadata";

type JsonLd = Record<string, unknown>;

function pageUrl(locale: Locale, pathname = "") {
  return buildLocalizedUrl(locale, pathname || "/");
}

function typeLabel(type: ItemTypeId) {
  return itemTypes.find((itemType) => itemType.id === type)?.label ?? "Catalogue";
}

function absoluteImageUrl(pathname: string) {
  return `${getSiteOrigin()}${pathname}`;
}

function hasImageExplorer(type: ItemTypeId): type is CatalogueRecordType {
  return type === "weapons" || type === "vehicles" || type === "ammo" || type === "attachments" || type === "gear";
}

function buildItemListEntries(locale: Locale, type: ItemTypeId, url: string) {
  const indexableItems = getItemsByType(type);

  if (hasImageExplorer(type)) {
    const records = getCatalogueRecords(type);
    const recordSlugs = new Set(records.map((record) => record.slug));
    const recordEntries = records.map((record) => ({
      name: record.name,
      url: record.detailStatus === "published" && record.detailHref
        ? pageUrl(locale, record.detailHref)
        : `${url}#record-${type}-${record.slug}`,
      image: absoluteImageUrl(record.image)
    }));
    return [...recordEntries, ...indexableItems.filter((item) => !recordSlugs.has(item.slug)).map((item) => ({
      name: item.name,
      url: pageUrl(locale, `/items/${item.type}/${item.slug}`)
    }))];
  }

  const catalogueRows = getCatalogGuide(type)?.sections.flatMap((section) => section.rows) ?? [];
  return [
    ...catalogueRows.map((catalogueRow, index) => ({name: catalogueRow.cells[0], url: `${url}#catalog-${index + 1}`})),
    ...indexableItems.map((item) => ({name: item.name, url: pageUrl(locale, `/items/${item.type}/${item.slug}`)}))
  ];
}

export function buildItemIndexJsonLd(locale: Locale): JsonLd[] {
  const canonicalLocale: Locale = locale === "en" ? locale : "en";
  const url = pageUrl(canonicalLocale, "/items");
  return [
    {"@context": "https://schema.org", "@type": "CollectionPage", name: "WARDOGS Catalogue", url, image: absoluteImageUrl(catalogueMetadataImages.hub)},
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: itemTypes.map((itemType, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `WARDOGS ${itemType.label}`,
        url: pageUrl(canonicalLocale, itemType.href),
        image: absoluteImageUrl(catalogueMetadataImages[itemType.id])
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "WARDOGS Wiki", item: pageUrl(canonicalLocale)},
        {"@type": "ListItem", position: 2, name: "Catalogue", item: url}
      ]
    }
  ];
}

export function buildItemTypeJsonLd(locale: Locale, type: ItemTypeId): JsonLd[] {
  const label = typeLabel(type);
  const canonicalLocale: Locale = locale === "en" ? locale : "en";
  const url = pageUrl(canonicalLocale, `/items/${type}`);
  const itemListEntries = buildItemListEntries(canonicalLocale, type, url);
  return [
    {"@context": "https://schema.org", "@type": "CollectionPage", name: `WARDOGS ${label}`, url, image: absoluteImageUrl(catalogueMetadataImages[type])},
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: itemListEntries.map((item, index) => ({"@type": "ListItem", position: index + 1, ...item}))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "WARDOGS Wiki", item: pageUrl(canonicalLocale)},
        {"@type": "ListItem", position: 2, name: "Catalogue", item: pageUrl(canonicalLocale, "/items")},
        {"@type": "ListItem", position: 3, name: label, item: url}
      ]
    }
  ];
}

export function buildItemArticleJsonLd(locale: Locale, item: WardogsItem): JsonLd[] {
  const url = pageUrl(locale, `/items/${item.type}/${item.slug}`);
  const label = typeLabel(item.type);
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `WARDOGS ${item.name}`,
      description: item.summary,
      dateModified: item.detailUpdatedAt ?? "2026-08-16",
      mainEntityOfPage: url,
      author: {"@type": "Organization", name: "WARDOGS Wiki"},
      image: `${getSiteOrigin()}${item.detailImage ?? "/images/og-wardogs.jpg"}`,
      about: {
        "@type": "Thing",
        name: item.name,
        description: item.description
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "WARDOGS Wiki", item: pageUrl(locale)},
        {"@type": "ListItem", position: 2, name: "Catalogue", item: pageUrl(locale, "/items")},
        {"@type": "ListItem", position: 3, name: label, item: pageUrl(locale, `/items/${item.type}`)},
        {"@type": "ListItem", position: 4, name: item.name, item: url}
      ]
    }
  ];
}
