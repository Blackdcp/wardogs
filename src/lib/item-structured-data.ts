import type {Locale} from "@/config/site";
import {itemLibrary, itemTypes, type ItemTypeId, type WardogsItem} from "@/features/items/item-library";
import {getSiteOrigin} from "./metadata";

type JsonLd = Record<string, unknown>;

function pageUrl(locale: Locale, pathname = "") {
  return `${getSiteOrigin()}/${locale}${pathname}`;
}

function typeLabel(type: ItemTypeId) {
  return itemTypes.find((itemType) => itemType.id === type)?.label ?? "Items";
}

export function buildItemIndexJsonLd(locale: Locale): JsonLd[] {
  const url = pageUrl(locale, "/items");
  return [
    {"@context": "https://schema.org", "@type": "CollectionPage", name: "WARDOGS Items", url},
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: itemTypes.map((itemType, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `WARDOGS ${itemType.label}`,
        url: pageUrl(locale, itemType.href)
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "WARDOGS Wiki", item: pageUrl(locale)},
        {"@type": "ListItem", position: 2, name: "Items", item: url}
      ]
    }
  ];
}

export function buildItemTypeJsonLd(locale: Locale, type: ItemTypeId): JsonLd[] {
  const label = typeLabel(type);
  const items = itemLibrary.filter((item) => item.type === type);
  const url = pageUrl(locale, `/items/${type}`);
  return [
    {"@context": "https://schema.org", "@type": "CollectionPage", name: `WARDOGS ${label}`, url},
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: pageUrl(locale, `/items/${item.type}/${item.slug}`)
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {"@type": "ListItem", position: 1, name: "WARDOGS Wiki", item: pageUrl(locale)},
        {"@type": "ListItem", position: 2, name: "Items", item: pageUrl(locale, "/items")},
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
        {"@type": "ListItem", position: 2, name: "Items", item: pageUrl(locale, "/items")},
        {"@type": "ListItem", position: 3, name: label, item: pageUrl(locale, `/items/${item.type}`)},
        {"@type": "ListItem", position: 4, name: item.name, item: url}
      ]
    }
  ];
}
