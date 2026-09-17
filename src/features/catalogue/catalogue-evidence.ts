import {catalogueRecords} from "./catalogue-records";
import type {CatalogueRecord} from "./catalogue-types";
import {vehicleItems} from "../items/vehicle-items";
import {weaponItems} from "../items/weapon-items";
export {
  getCatalogueChangeHistory,
  normalizeCatalogueEvidence,
  seasonOneChanges,
  seasonOneSourceUrl,
  seasonOneVerifiedAt,
  type ProgressionTrack,
  type SeasonOneChange,
} from "./catalogue-evidence-data";

const richDetailKeys = new Set([...weaponItems, ...vehicleItems].map((item) => `${item.type}/${item.slug}`));

export function getCatalogueFreshness(record: Pick<CatalogueRecord, "dataAsOf" | "evidence">): "current" | "historical" | "unknown" {
  if (record.evidence.confidence === "unverified" || record.evidence.sourceClass === "unverified") return "unknown";
  if (/Alpha|Beta/.test(`${record.dataAsOf} ${record.evidence.build}`)) return "historical";
  if (record.evidence.current) return "current";
  return "historical";
}

export function isCurrentDecisionSafe(record: Pick<CatalogueRecord, "dataAsOf" | "evidence">): boolean {
  return getCatalogueFreshness(record) === "current"
    && (record.evidence.confidence === "confirmed" || record.evidence.confidence === "observed")
    && (record.evidence.sourceClass === "official" || record.evidence.sourceClass === "live-client");
}

export function getIndexableCatalogueItems(records: readonly CatalogueRecord[] = catalogueRecords): CatalogueRecord[] {
  return records.filter((record) =>
    record.detailStatus === "published"
    && record.evidenceTier !== "identifier-only"
    && record.mediaState === "verified"
    && Boolean(record.image)
    && Boolean(record.imageAlt?.trim())
    && !record.image?.includes("/banners/")
    && richDetailKeys.has(`${record.type}/${record.slug}`)
  );
}
