export type CatalogueRecordType =
  | "weapons"
  | "vehicles"
  | "ammo"
  | "attachments"
  | "gear"
  | "equipment"
  | "medical"
  | "supplies"
  | "deployables"
  | "mechanics"
  | "maps";

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

export type CatalogueEvidence = {
  build: string;
  verifiedAt: string;
  sourceClass: "official" | "live-client" | "creator-current" | "creator-historical" | "community-report" | "unverified";
  confidence: "confirmed" | "observed" | "corroborated" | "unverified";
  current: boolean;
  sourceUrl?: string;
};

export type CatalogueChangeHistory = {
  id: string;
  field: string;
  previousValue: string;
  currentValue: string;
  effectiveBuild: string;
  verifiedAt: string;
  sourceUrl: string;
  note?: string;
};

export type CatalogueRecord = {
  slug: string;
  name: string;
  type: CatalogueRecordType;
  subtype: string;
  image?: string;
  imageAlt?: string;
  summary: string;
  facts: readonly CatalogueFact[];
  filterValues: readonly string[];
  detailStatus: "inline" | "planned" | "published";
  detailHref?: `/items/${"weapons" | "vehicles"}/${string}`;
  evidenceStatus: "official" | "verified-in-game" | "pre-release-build" | "community-report" | "unverified";
  evidenceTier: CatalogueEvidenceTier;
  mediaState: CatalogueMediaState;
  sourceNotes: readonly string[];
  dataAsOf: string;
  evidence: CatalogueEvidence;
  changeHistory: readonly CatalogueChangeHistory[];
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
