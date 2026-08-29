export type CatalogueRecordType = "weapons" | "vehicles" | "ammo" | "attachments" | "gear";

export type CatalogueFact = {
  label: string;
  value: string;
};

export type CatalogueEvidenceTier =
  | "official"
  | "build-capture"
  | "corroborated-community"
  | "identifier-only";

export type CatalogueMediaState = "verified" | "context-only" | "pending";

export type CatalogueRecord = {
  slug: string;
  name: string;
  type: CatalogueRecordType;
  subtype: string;
  image: string;
  imageAlt: string;
  summary: string;
  facts: readonly CatalogueFact[];
  filterValues: readonly string[];
  detailStatus: "inline" | "planned" | "published";
  detailHref?: `/items/${"weapons" | "vehicles"}/${string}`;
  evidenceStatus: "official" | "verified-in-game" | "pre-release-build" | "community-report";
  evidenceTier: CatalogueEvidenceTier;
  mediaState: CatalogueMediaState;
  sourceNotes: readonly string[];
  dataAsOf: string;
};

export type CatalogueFilterOption = {
  label: string;
  value: string;
};

export type CatalogueGroup = {
  type: CatalogueRecordType;
  label: string;
  filters: readonly CatalogueFilterOption[];
};
