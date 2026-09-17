import type {CatalogueChangeHistory, CatalogueEvidence, CatalogueRecord} from "./catalogue-types";
import {catalogueRecords} from "./catalogue-records";
import {vehicleItems} from "../items/vehicle-items";
import {weaponItems} from "../items/weapon-items";

const seasonOneSourceUrl = "https://store.steampowered.com/news/app/1867240/view/701027323413004455";
const seasonOneVerifiedAt = "2026-09-09";

export type SeasonOneChange = CatalogueChangeHistory & {
  entity: string;
  catalogueKey?: `${"weapons" | "vehicles"}/${string}`;
};

export const seasonOneChanges: readonly SeasonOneChange[] = [
  {entity: "FOB vendor", field: "Vendor price", previousValue: "$2,500", currentValue: "$7,500", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl},
  {entity: "Large Hammer vendor", field: "Vendor price", previousValue: "$1,600", currentValue: "$2,400", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl},
  {entity: "Large Hammer Support unlock", field: "Support unlock", previousValue: "$25,000", currentValue: "$75,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl},
  {entity: "Artillery Tank career unlock", field: "Career unlock", previousValue: "$400,000", currentValue: "$500,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl},
  {entity: "Artillery Tank required career level", field: "Required career level", previousValue: "55", currentValue: "90", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl},
  {entity: "Z20 Lakota Pilot unlock", field: "Pilot unlock", previousValue: "$50,000", currentValue: "$35,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl},
  {entity: "URAL unlock", field: "Unlock", previousValue: "$50,000", currentValue: "$35,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/ural"},
  {entity: "URAL required level", field: "Required level", previousValue: "4", currentValue: "3", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/ural"},
  {entity: "Dune Buggy unlock", field: "Unlock", previousValue: "$35,000", currentValue: "$25,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/dune-buggy"},
  {entity: "Dune Buggy required level", field: "Required level", previousValue: "10", currentValue: "8", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/dune-buggy"},
  {entity: "Kodiak Flatbed unlock", field: "Unlock", previousValue: "$15,000", currentValue: "$35,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/kodiak-pickup"},
  {entity: "Kodiak Flatbed required level", field: "Required level", previousValue: "2", currentValue: "10", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/kodiak-pickup"},
  {entity: "Sports Parachute required level", field: "Required level", previousValue: "36", currentValue: "35", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl},
  {entity: "Large Backpack required level", field: "Required level", previousValue: "56", currentValue: "55", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl},
  {entity: "Deagle required level", field: "Required level", previousValue: "90", currentValue: "85", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "weapons/deagle"},
];

const richDetailKeys = new Set([...weaponItems, ...vehicleItems].map((item) => `${item.type}/${item.slug}`));

export function normalizeCatalogueEvidence(record: Pick<CatalogueRecord, "dataAsOf" | "evidenceTier">): CatalogueEvidence {
  const verifiedAt = record.dataAsOf.includes("Closed Beta") ? "2026-08-23" : "2026-08-07";
  const evidenceByTier: Record<CatalogueRecord["evidenceTier"], Omit<CatalogueEvidence, "build" | "verifiedAt" | "current">> = {
    official: {sourceClass: "official", confidence: "confirmed"},
    "build-capture": {sourceClass: "live-client", confidence: "observed"},
    "corroborated-community": {sourceClass: "creator-historical", confidence: "corroborated"},
    "identifier-only": {sourceClass: "community-report", confidence: "unverified"},
  };

  return {build: record.dataAsOf, verifiedAt, current: false, ...evidenceByTier[record.evidenceTier]};
}

export function getCatalogueChangeHistory(record: Pick<CatalogueRecord, "type" | "slug">): readonly CatalogueChangeHistory[] {
  return seasonOneChanges
    .filter((change) => change.catalogueKey === `${record.type}/${record.slug}`)
    .map(({entity: _entity, catalogueKey: _catalogueKey, ...change}) => change);
}

export function getCatalogueFreshness(record: Pick<CatalogueRecord, "dataAsOf" | "evidence">): "current" | "historical" | "unknown" {
  if (record.evidence.current) return "current";
  if (/Alpha|Beta/.test(record.dataAsOf) || record.evidence.build === record.dataAsOf) return "historical";
  return "unknown";
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
    && record.mediaState !== "pending"
    && richDetailKeys.has(`${record.type}/${record.slug}`)
  );
}
