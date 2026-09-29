import type {Locale} from "@/config/site";
import {catalogueRecords} from "@/features/catalogue/catalogue-records";
import {getLocalizedCatalogueRecords} from "@/features/catalogue/catalogue-localization";
import type {CatalogueEvidence} from "@/features/catalogue/catalogue-types";
import {getAmmoMatcherDataset} from "./ammo-matcher-data";
import {dataFingerprint} from "./workflow-state";
import {resolveToolLocale} from "./tool-copy";

export type LoadoutCatalogueItem = {
  id: string;
  name: string;
  type: string;
  image?: string;
  imageAlt?: string;
  priceReference: string | null;
  evidence: CatalogueEvidence;
};

export function getLoadoutCatalogue(locale: Locale) {
  const records = catalogueRecords.filter((record) => !["maps", "mechanics"].includes(record.type));
  const localized = getLocalizedCatalogueRecords(records, resolveToolLocale(locale));
  const items: LoadoutCatalogueItem[] = records.map((record, index) => ({
    id: `${record.type}/${record.slug}`,
    name: localized[index]?.name ?? record.name,
    type: record.type,
    ...(record.mediaState === "verified" && record.image && record.imageAlt ? {image: record.image, imageAlt: record.imageAlt} : {}),
    // A displayed historical price is a reference, never an automatic purchase price.
    priceReference: record.facts.find(({label, value}) => /^(Alpha price|Closed Beta price|Season 1 vendor price)$/.test(label) && /^\$[\d,.]+$/.test(value))?.value ?? null,
    evidence: record.evidence,
  }));
  const relationships = getAmmoMatcherDataset(resolveToolLocale(locale)).relationships;
  return {items, relationships, dataVersion: dataFingerprint({records, relationships})};
}

export type LoadoutCatalogue = ReturnType<typeof getLoadoutCatalogue>;
