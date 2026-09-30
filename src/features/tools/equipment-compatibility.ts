import type {Locale} from "@/config/site";
import {getLocalizedCatalogueRecords} from "@/features/catalogue/catalogue-localization";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import type {CatalogueEvidence} from "@/features/catalogue/catalogue-types";

export type CompatibilityItem = {
  slug: string;
  name: string;
  image?: string;
  imageAlt?: string;
};

export type AttachmentCompatibility = CompatibilityItem & {
  kind: "magazine" | "optic";
  historicalSpecification: string | null;
  namedWeapons: readonly string[];
  currentFit: "unknown";
  purchaseUnit: "unknown";
  suppliedRounds: null;
  evidence: CatalogueEvidence;
};

export type CompatibilityDataset = {
  weapons: readonly CompatibilityItem[];
  attachments: readonly AttachmentCompatibility[];
};

// Explicit model names in the historical catalogue, not an installation test.
// Generic STANAG and GGX names deliberately have no inferred weapon mapping.
const namedMagazineWeapons: Readonly<Record<string, readonly string[]>> = {
  "amp-9-15-rnd-magazine": ["amp-9"],
  "amp-9-20-rnd-magazine": ["amp-9"],
  "amp-9-30-rnd-magazine": ["amp-9"],
  "amp-9-50-rnd-magazine": ["amp-9"],
  "amr-50-10-rnd-magazine": ["amr-50"],
  "deagle-7-rnd-magazine": ["deagle"],
  "fal-bmr-308-20-rnd-magazine": ["fal", "bmr-308"],
  "fal-30-rnd-magazine": ["fal"],
  "galil-35-rnd-magazine": ["galil"],
  "galil-50-rnd-magazine": ["galil"],
  "m1911-7-rnd-magazine": ["m1911"],
  "m1911-10-rnd-magazine": ["m1911"],
  "m249-100-rnd-fabric-magazine": ["m249-saw"],
  "mk22-5-rnd-magazine": ["mk22"],
  "mp5-20-rnd-magazine": ["mp5"],
  "mp5-30-rnd-magazine": ["mp5"],
  "mp5-50-rnd-magazine": ["mp5"],
  "pp-19-vityaz-10-rnd-magazine": ["pp-19-vityaz"],
  "pp-19-vityaz-30-rnd-magazine": ["pp-19-vityaz"],
  "super-45-13-rnd-magazine": ["super-45"],
  "super-45-30-rnd-magazine": ["super-45"],
  "super-45-40-rnd-drum-magazine": ["super-45"],
  "svd-5-rnd-magazine": ["svd"],
  "ak74-75-rnd-drum-magazine": ["ak74"],
  "ak74-30-rnd-magazine": ["ak74"],
  "ak74-60-rnd-magazine": ["ak74"],
  "mp43-internal-mag": ["mp43"],
  "amr-50-5-rnd-magazine": ["amr-50"],
  "sv98-10-rnd-magazine": ["sv98"],
  "svd-10-rnd-magazine": ["svd"],
  "mk22-10-rnd-magazine": ["mk22"],
  "fal-10-rnd-magazine": ["fal"],
  "pkm-100-rnd-box": ["pkm"],
  "m249-200-rnd-box": ["m249-saw"],
};

export function getCompatibilityDataset(locale: Locale): CompatibilityDataset {
  const weapons = getCatalogueRecords("weapons").filter(({evidenceTier}) => evidenceTier !== "identifier-only");
  const attachments = getCatalogueRecords("attachments");
  const translatedWeapons = new Map(getLocalizedCatalogueRecords(weapons, locale).map((item) => [item.slug, item]));
  const translatedAttachments = new Map(getLocalizedCatalogueRecords(attachments, locale).map((item) => [item.slug, item]));
  const weaponIds = new Set(weapons.map(({slug}) => slug));
  return {
    weapons: weapons.map((item) => ({slug: item.slug, name: translatedWeapons.get(item.slug)?.name ?? item.name})),
    attachments: attachments.map((item) => {
      const translated = translatedAttachments.get(item.slug) ?? item;
      return {
        slug: item.slug,
        name: translated.name,
        ...(item.mediaState !== "pending" && item.image ? {image: item.image, imageAlt: translated.imageAlt ?? translated.name} : {}),
        kind: item.subtype === "Magazine" ? "magazine" : "optic",
        historicalSpecification: item.facts.find(({label}) => label === "Zoom or capacity")?.value ?? null,
        namedWeapons: (namedMagazineWeapons[item.slug] ?? []).filter((slug) => weaponIds.has(slug)),
        currentFit: "unknown",
        purchaseUnit: "unknown",
        suppliedRounds: null,
        evidence: item.evidence,
      };
    }),
  };
}
