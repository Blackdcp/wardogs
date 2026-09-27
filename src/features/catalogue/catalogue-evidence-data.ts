import type {CatalogueChangeHistory, CatalogueEvidence, CatalogueRecord} from "./catalogue-types";

export const seasonOneSourceUrl = "https://store.steampowered.com/news/app/1867240/view/701027323413004455";
export const seasonOneVerifiedAt = "2026-09-09";

export type ProgressionTrack = "career" | "assault" | "medic" | "recon" | "support" | "driver" | "pilot";

export type SeasonOneChange = CatalogueChangeHistory & {
  entity: string;
  catalogueKey?: `${CatalogueRecord["type"]}/${string}`;
  progressionTrack?: ProgressionTrack;
};

export const seasonOneChanges: readonly SeasonOneChange[] = [
  {id: "fob-vendor-price", entity: "FOB vendor", field: "Vendor price", previousValue: "$2,500", currentValue: "$7,500", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "deployables/fob-vendor"},
  {id: "large-hammer-vendor-price", entity: "Large Hammer vendor", field: "Vendor price", previousValue: "$1,600", currentValue: "$2,400", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl},
  {id: "large-hammer-support-unlock", entity: "Large Hammer Support unlock", field: "Support unlock", previousValue: "$25,000", currentValue: "$75,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "support"},
  {id: "artillery-tank-career-unlock", entity: "Artillery Tank career unlock", field: "Career unlock", previousValue: "$400,000", currentValue: "$500,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/sph-2", progressionTrack: "career"},
  {id: "artillery-tank-career-level", entity: "Artillery Tank required career level", field: "Required career level", previousValue: "55", currentValue: "90", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/sph-2", progressionTrack: "career"},
  {id: "recon-mrad-scope-unlock", entity: "Recon 6-10x MRAD scope unlock", field: "Recon unlock", previousValue: "$25,000", currentValue: "$40,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "recon"},
  {id: "recon-moa-scope-unlock", entity: "Recon 6-10x MOA scope unlock", field: "Recon unlock", previousValue: "$30,000", currentValue: "$45,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "recon"},
  {id: "medium-hammer-support-unlock", entity: "Medium Hammer Support unlock", field: "Support unlock", previousValue: "$10,000", currentValue: "$25,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "support"},
  {id: "small-armored-crate-pilot-unlock", entity: "Small Armored Supply Crate Pilot unlock", field: "Pilot unlock", previousValue: "$5,000", currentValue: "$10,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "pilot"},
  {id: "little-bird-miniguns-pilot-unlock", entity: "Little Bird with miniguns Pilot unlock", field: "Pilot unlock", previousValue: "$25,000", currentValue: "$50,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "pilot"},
  {id: "z20-lakota-pilot-unlock", entity: "Z20 Lakota Pilot unlock", field: "Pilot unlock", previousValue: "$50,000", currentValue: "$35,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "pilot"},
  {id: "ural-unlock", entity: "URAL unlock", field: "Unlock", previousValue: "$50,000", currentValue: "$35,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/ural", progressionTrack: "driver"},
  {id: "dune-buggy-unlock", entity: "Dune Buggy unlock", field: "Unlock", previousValue: "$35,000", currentValue: "$25,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/dune-buggy", progressionTrack: "driver"},
  {id: "kodiak-flatbed-unlock", entity: "Kodiak Flatbed unlock", field: "Unlock", previousValue: "$15,000", currentValue: "$35,000", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/kodiak-pickup", progressionTrack: "driver"},
  {id: "music-tape-h-driver-unlock", entity: "Music Tape H Driver unlock", field: "Driver unlock", previousValue: "$5,000", currentValue: "$2,500", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "driver"},
  {id: "sports-parachute-level", entity: "Sports Parachute required level", field: "Required level", previousValue: "36", currentValue: "35", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "career"},
  {id: "large-backpack-level", entity: "Large Backpack required level", field: "Required level", previousValue: "56", currentValue: "55", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "career"},
  {id: "deagle-level", entity: "Deagle required level", field: "Required level", previousValue: "90", currentValue: "85", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "weapons/deagle", progressionTrack: "career"},
  {id: "762-ap-career-level", entity: "762x54mm AP career level", field: "AP career level", previousValue: "83", currentValue: "82", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "ammo/7-62x54mmr", progressionTrack: "career"},
  {id: "556-ap-career-level", entity: "556mm AP career level", field: "AP career level", previousValue: "85", currentValue: "83", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "ammo/5-56x45mm", progressionTrack: "career"},
  {id: "pp19-drum-level", entity: "PP-19 50 round drum magazine required level", field: "Required level", previousValue: "33", currentValue: "29", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "medic"},
  {id: "large-hammer-support-level", entity: "Large Hammer Support required level", field: "Required level", previousValue: "7", currentValue: "8", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "support"},
  {id: "ural-level", entity: "URAL required level", field: "Required level", previousValue: "4", currentValue: "3", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/ural", progressionTrack: "driver"},
  {id: "kodiak-assault-level", entity: "Kodiak Assault required level", field: "Required level", previousValue: "8", currentValue: "6", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "driver"},
  {id: "dune-buggy-level", entity: "Dune Buggy required level", field: "Required level", previousValue: "10", currentValue: "8", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/dune-buggy", progressionTrack: "driver"},
  {id: "kodiak-flatbed-level", entity: "Kodiak Flatbed required level", field: "Required level", previousValue: "2", currentValue: "10", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, catalogueKey: "vehicles/kodiak-pickup", progressionTrack: "driver"},
  {id: "large-supply-crate-level", entity: "Large Supply Crate required level", field: "Required level", previousValue: "20", currentValue: "16", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "driver"},
  {id: "ural-covered-level", entity: "URAL Covered required level", field: "Required level", previousValue: "30", currentValue: "18", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "driver"},
  {id: "music-tape-h-track", entity: "Music Tape H progression track", field: "Progression track", previousValue: "Pilot level 28", currentValue: "Driver level 23", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "driver"},
  {id: "ural-attack-level", entity: "URAL Attack required level", field: "Required level", previousValue: "40", currentValue: "25", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "driver"},
  {id: "humvee-minigun-level", entity: "Humvee with minigun required level", field: "Required level", previousValue: "35", currentValue: "30", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "driver"},
  {id: "heavy-tank-track", entity: "Heavy Tank progression track", field: "Progression track", previousValue: "Career level 35", currentValue: "Driver level 35", effectiveBuild: "Season 1", verifiedAt: seasonOneVerifiedAt, sourceUrl: seasonOneSourceUrl, progressionTrack: "driver"},
];

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
    .map(({id, field, previousValue, currentValue, effectiveBuild, verifiedAt, sourceUrl}) => ({
      id,
      field,
      previousValue,
      currentValue,
      effectiveBuild,
      verifiedAt,
      sourceUrl,
    }));
}
