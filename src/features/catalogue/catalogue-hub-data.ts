import type {Locale} from "@/config/site";
import type {DiscoveryDestination} from "@/features/discovery/discovery-types";
import {catalogueGroups} from "./catalogue-groups";
import {getCatalogueRecords} from "./catalogue-records";
import type {CatalogueRecord, CatalogueRecordType} from "./catalogue-types";
import {getLocalizedCatalogGuide, getLocalizedCatalogueRecords} from "./catalogue-localization";
import {getCatalogGuide} from "@/features/items/item-catalog-guides";
import {itemHubPreviewSlugs} from "@/features/items/item-hub-data";
import {getFeaturedItems, itemTypes, type ItemTypeId} from "@/features/items/item-library";
import {getLocalizedItem, getLocalizedItemType} from "@/features/items/item-localization";
import {getItemUi} from "@/features/items/item-ui";
import {localizedItemRoutePath, resolveItemRouteTarget} from "@/features/items/item-route-availability";

type CategoryMedia = {image: string; imageAlt: string; imageFit?: "cover" | "contain"};
export type PublishedPreviewRecord = CatalogueRecord & {
  detailStatus: "published";
  detailHref: NonNullable<CatalogueRecord["detailHref"]>;
  image: string;
  imageAlt: string;
  href: string;
};
const categoryMedia: Record<ItemTypeId, CategoryMedia> = {
  weapons: {image: "/images/catalogue/banners/weapons-1280.webp", imageAlt: "WARDOGS weapons catalogue banner"},
  vehicles: {image: "/images/catalogue/banners/vehicles-1280.webp", imageAlt: "WARDOGS vehicles catalogue banner"},
  ammo: {image: "/images/catalogue/ammo/556x45mm.webp", imageAlt: "5.56x45mm WARDOGS ammunition", imageFit: "contain"},
  attachments: {image: "/images/catalogue/banners/attachments-1280.webp", imageAlt: "WARDOGS attachments catalogue banner"},
  gear: {image: "/images/catalogue/gear/heavy-armor.webp", imageAlt: "WARDOGS heavy armor", imageFit: "contain"},
  equipment: {image: "/images/catalogue/banners/meta-1280.webp", imageAlt: "WARDOGS tactical equipment catalogue banner"},
  medical: {image: "/images/guide-discovery/medic-revive.webp", imageAlt: "WARDOGS field medical support"},
  supplies: {image: "/images/catalogue/banners/vehicles-1280.webp", imageAlt: "WARDOGS field logistics and supplies"},
  deployables: {image: "/images/guide-discovery/equipment-tools.webp", imageAlt: "WARDOGS deployable field equipment"},
  mechanics: {image: "/images/catalogue/banners/thegame-1280.webp", imageAlt: "WARDOGS objective and support systems"},
  loadouts: {image: "/images/catalogue/banners/loadouts-1280.webp", imageAlt: "WARDOGS loadout planning catalogue banner"}
};


function getPreviewRecords(type: "weapons" | "vehicles", locale: Locale): PublishedPreviewRecord[] {
  const records = getLocalizedCatalogueRecords(getCatalogueRecords(type), locale);
  return itemHubPreviewSlugs[type].map((slug) => {
    const record = records.find((candidate) => candidate.slug === slug);
    if (!record || record.detailStatus !== "published" || !record.detailHref || !record.image || !record.imageAlt) {
      throw new Error(`Missing published ${type} catalogue preview: ${slug}`);
    }
    return {...record, href: localizedItemRoutePath(resolveItemRouteTarget(locale, record.detailHref))} as PublishedPreviewRecord;
  });
}

function catalogueCategories(locale: Locale) {
  const groupedTypes = new Set<CatalogueRecordType>(catalogueGroups.map((group) => group.type));
  return itemTypes.map((itemType) => {
    if (itemType.id !== "loadouts" && !groupedTypes.has(itemType.id)) throw new Error(`Missing catalogue group for ${itemType.id}`);
    const guide = getCatalogGuide(itemType.id);
    if (!guide) throw new Error(`Missing catalogue guide for ${itemType.id}`);
    const localizedType = getLocalizedItemType(itemType, locale);
    const localizedGuide = getLocalizedCatalogGuide(guide, locale);
    return {...localizedType, ...categoryMedia[itemType.id], imageAlt: localizedType.imageAlt ?? categoryMedia[itemType.id].imageAlt, count: localizedGuide.countLabel};
  });
}

export function buildCatalogueHubModel(locale: Locale) {
  return {
    href: "/items" as const,
    categories: catalogueCategories(locale),
    previews: {weapons: getPreviewRecords("weapons", locale), vehicles: getPreviewRecords("vehicles", locale)},
    featured: getFeaturedItems(6).map((item) => ({...getLocalizedItem(item, locale), target: resolveItemRouteTarget(locale, `/items/${item.type}/${item.slug}`)}))
  };
}

export function buildCatalogueHomeModel(locale: Locale) {
  const ui = getItemUi(locale);
  const categories = catalogueCategories(locale).filter((category) => category.id === "weapons" || category.id === "vehicles");
  const destinations = [
    {id: "catalogue", href: "/items", labelKey: "nav.catalogueHome", task: "catalogue"},
    {id: "weapons", href: "/items/weapons", labelKey: "nav.weapons", task: "weapons"},
    {id: "vehicles", href: "/items/vehicles", labelKey: "nav.vehicles", task: "vehicles"}
  ] as const satisfies readonly DiscoveryDestination[];
  const previews = [getPreviewRecords("weapons", locale)[0], getPreviewRecords("weapons", locale)[1], getPreviewRecords("vehicles", locale)[0], getPreviewRecords("vehicles", locale)[1]];
  return {destinations, categories, previews, hubLabel: ui.allItems};
}

export type CatalogueHubModel = ReturnType<typeof buildCatalogueHubModel>;
export type CatalogueHomeModel = ReturnType<typeof buildCatalogueHomeModel>;
