import type {ItemTypeId} from "@/features/items/item-library";
import {
  getCatalogueCategoryMediaSource,
  type CatalogueCategoryMediaKey,
  type CatalogueMediaSource,
} from "./catalogue-media-sources";

export type CatalogueCategoryMedia = Pick<
  CatalogueMediaSource,
  "image" | "sourceUrl" | "sourceLabel" | "retrievedAt" | "usageNote"
> & {
  imageAlt: string;
  imageFit: "cover";
};

const imageAltByCategory: Record<CatalogueCategoryMediaKey, string> = {
  hub: "WARDOGS combined-arms battlefield context",
  weapons: "WARDOGS street combat used as weapons category context",
  vehicles: "WARDOGS combined-arms battle used as vehicle category context",
  ammo: "WARDOGS street combat used as ammunition category context",
  attachments: "WARDOGS street combat used as attachment category context",
  gear: "WARDOGS combined-arms battle used as gear category context",
  equipment: "WARDOGS indoor combat used as equipment category context",
  medical: "WARDOGS downed-player interaction used as medical category context",
  supplies: "WARDOGS indoor combat used as supply category context",
  deployables: "WARDOGS indoor combat used as deployables category context",
  mechanics: "WARDOGS combined-arms battle used as mechanics category context",
  loadouts: "WARDOGS street combat used as loadout category context",
};

export function getCatalogueCategoryMedia(category: ItemTypeId | "hub"): CatalogueCategoryMedia | undefined {
  const source = getCatalogueCategoryMediaSource(category);
  if (!source) return undefined;
  return {
    image: source.image,
    imageAlt: imageAltByCategory[category],
    imageFit: "cover",
    sourceUrl: source.sourceUrl,
    sourceLabel: source.sourceLabel,
    retrievedAt: source.retrievedAt,
    usageNote: source.usageNote,
  };
}
