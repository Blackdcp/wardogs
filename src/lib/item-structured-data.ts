import type {Locale} from "@/config/site";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import type {CatalogueRecordType} from "@/features/catalogue/catalogue-types";
import {getItemsByType, itemTypes, type ItemTypeId, type WardogsItem} from "@/features/items/item-library";
import {getCatalogGuide} from "@/features/items/item-catalog-guides";
import {getSiteOrigin} from "./metadata";

type JsonLd = Record<string, unknown>;

function pageUrl(locale: Locale, pathname = "") {
  return `${getSiteOrigin()}/${locale}${pathname}`;
}

function typeLabel(type: ItemTypeId) {
  return itemTypes.find((itemType) => itemType.id === type)?.label ?? "Catalogue";
}

const catalogueImages: Record<ItemTypeId | "hub", string> = {
  hub: "/images/catalogue/banners/thegame-1280.webp",
  weapons: "/images/catalogue/banners/weapons-1280.webp",
  vehicles: "/images/catalogue/banners/vehicles-1280.webp",
  ammo: "/images/catalogue/ammo/556x45mm.webp",
  attachments: "/images/catalogue/banners/attachments-1280.webp",
  gear: "/images/catalogue/gear/heavy-armor.webp",
  equipment: "/images/catalogue/banners/meta-1280.webp",
  loadouts: "/images/catalogue/banners/loadouts-1280.webp"
};

function absoluteImageUrl(pathname: string) {
  return `${getSiteOrigin()}${pathname}`;
}

function hasImageExplorer(type: ItemTypeId): type is CatalogueRecordType {
  return type === "weapons" || type === "vehicles" || type === "ammo" || type === "attachments" || type === "gear";
}

function buildItemListEntries(locale: Locale, type: ItemTypeId, url: string) {
  const legacyItems = getItemsByType(type);

  if (hasImageExplorer(type)) {
    const recordEntries = getCatalogueRecords(type).map((record) => ({
      name: record.name,
      url: record.detailStatus === "published" && record.detailHref
        ? pageUrl(locale, record.detailHref)
        : `${url}#record-${type}-${record.slug}`,
      image: absoluteImageUrl(record.image)
    }));
    return [...recordEntries, ...legacyItems.map((item) => ({
      name: item.name,
      url: pageUrl(locale, `/items/${item.type}/${item.slug}`)
    }))];
  }

  const catalogueRows = getCatalogGuide(type)?.sections.flatMap((section) => section.rows) ?? [];
  return [
    ...catalogueRows.map((catalogueRow, index) => ({name: catalogueRow.cells[0], url: `${url}#catalog-${index + 1}`})),
    ...legacyItems.map((item) => ({name: item.name, url: pageUrl(locale, `/items/${item.type}/${item.slug}`)}))
  ];
}

export function buildItemIndexJsonLd(locale: Locale): JsonLd[] {
  const canonicalLocale: Locale = locale === "en" ? locale : "en";
  const url = pageUrl(canonicalLocale, "/items");
  return [
    {"@context": "https://schema.org", "@type": "CollectionPage", name: "WARDOGS Catalogue", url, image: absoluteImageUrl(catalogueImages.hub)},
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: itemTypes.map((itemType, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `WARDOGS ${itemType.label}`,
        url: pageUrl(canonicalLocale, itemType.href),
        image: absoluteImageUrl(catalogueImages[itemType.id])
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
    {"@context": "https://schema.org", "@type": "CollectionPage", name: `WARDOGS ${label}`, url, image: absoluteImageUrl(catalogueImages[type])},
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
      dateModified: "2026-08-16",
      mainEntityOfPage: url,
      author: {"@type": "Organization", name: "WARDOGS Wiki"},
      image: `${getSiteOrigin()}/images/og-wardogs.jpg`,
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
