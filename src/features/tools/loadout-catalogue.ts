import type {Locale} from "@/config/site";
import {catalogueRecords} from "@/features/catalogue/catalogue-records";
import {getLocalizedCatalogueRecords} from "@/features/catalogue/catalogue-localization";
import type {CatalogueEvidence} from "@/features/catalogue/catalogue-types";
import {getAmmoMatcherDataset} from "./ammo-matcher-data";
import {dataFingerprint} from "./workflow-state";
import {resolveToolLocale} from "./tool-copy";
import {getCreatorAttachmentRecords, type AttachmentKind} from "./attachment-recipes";

export type LoadoutCatalogueItem = {
  id: string;
  name: string;
  type: string;
  image?: string;
  imageAlt?: string;
  priceReference: string | null;
  weightReference: string | null;
  calibreKey?: string | null;
  attachmentKind?: AttachmentKind;
  evidence: CatalogueEvidence;
};

export function getLoadoutCatalogue(locale: Locale) {
  const records = catalogueRecords.filter((record) => !["maps", "mechanics"].includes(record.type));
  const localized = getLocalizedCatalogueRecords(records, resolveToolLocale(locale));
  const calibreKeys = new Map(records.filter((record) => record.type === "ammo" && record.subtype === "Calibre").map((record) => [record.name, record.slug]));
  const items: LoadoutCatalogueItem[] = records.map((record, index) => ({
    id: `${record.type}/${record.slug}`,
    name: localized[index]?.name ?? record.name,
    type: record.type,
    ...(record.mediaState === "verified" && record.image && record.imageAlt ? {image: record.image, imageAlt: record.imageAlt} : {}),
    // A displayed historical price is a reference, never an automatic purchase price.
    priceReference: record.facts.find(({label, value}) => /^(Alpha price|Closed Beta price|Season 1 vendor price)$/.test(label) && /^\$[\d,.]+$/.test(value))?.value ?? null,
    weightReference: record.facts.find(({label, value}) => /^(Weight|Weight or calibre)$/.test(label) && /^\d+(\.\d+)? kg$/.test(value))?.value ?? null,
    // Explicit calibre identity, never inferred from an attachment/load name or missing match.
    calibreKey: record.type === "ammo" && record.subtype === "Calibre" ? record.slug : calibreKeys.get(record.facts.find(({label}) => label === (record.type === "weapons" ? "Ammunition" : "Calibre"))?.value ?? "") ?? null,
    evidence: record.evidence,
  }));
  const relationships = getAmmoMatcherDataset(resolveToolLocale(locale)).relationships;
  const creatorAttachments = getCreatorAttachmentRecords(locale);
  items.push(...creatorAttachments.map((record) => ({id: `attachments/${record.slug}`, name: record.name, type: "attachments", attachmentKind: record.kind, priceReference: null, weightReference: null, evidence: record.evidence})));
  return {items, relationships, dataVersion: dataFingerprint({records, relationships, creatorAttachments: getCreatorAttachmentRecords("en")})};
}

export type LoadoutCatalogue = ReturnType<typeof getLoadoutCatalogue>;
