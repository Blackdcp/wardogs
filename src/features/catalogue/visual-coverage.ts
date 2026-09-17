import {existsSync} from "node:fs";
import {join} from "node:path";
import {locales} from "@/config/site";
import {itemLibrary} from "@/features/items/item-library";
import {
  getOperationsAtlasCopy,
  operationsAtlasRecords,
  type OperationsAtlasCopy,
  type OperationsAtlasRecord,
} from "@/features/maps/operations-atlas";
import {
  operationsAtlasMediaSources,
  type OperationsAtlasMediaSource,
} from "@/features/maps/operations-atlas-media";
import {
  catalogueMediaSources,
  type CatalogueMediaSource,
} from "./catalogue-media-sources";
import {catalogueRecords} from "./catalogue-records";
import type {CatalogueRecord} from "./catalogue-types";

export type VisualCoverageState = "verified" | "contextual" | "pending";

export type VisualCoverageEntry = {
  scope: "catalogue" | "operations-atlas";
  group: string;
  id: string;
  state: VisualCoverageState;
  image?: string;
  alt?: string;
};

export type VisualCoverageSummary = {
  group: string;
  total: number;
  verified: number;
  contextual: number;
  pending: number;
};

export type AtlasCopyAuditInput = {
  locale: string;
  copy: OperationsAtlasCopy;
};

type AssetExists = (image: string) => boolean;

const groupOrder = [
  "weapons",
  "vehicles",
  "ammo",
  "attachments",
  "gear",
  "equipment",
  "medical",
  "supplies",
  "deployables",
  "mechanics",
  "maps",
  "operations-atlas",
] as const;

const publicAssetExists: AssetExists = (image) => existsSync(join(process.cwd(), "public", image));

function meaningfulAlt(value: string | undefined): boolean {
  return Boolean(value?.trim() && value.trim().length >= 5);
}

function sourceApprovesRecord(source: CatalogueMediaSource | undefined, recordKey: string): boolean {
  return source?.recordKey === recordKey || Boolean(source?.additionalRecordKeys?.includes(recordKey));
}

function catalogueCoverageEntries(records: readonly CatalogueRecord[]): VisualCoverageEntry[] {
  return records.map((record) => ({
    scope: "catalogue",
    group: record.type,
    id: record.slug,
    state: record.mediaState === "context-only" ? "contextual" : record.mediaState,
    ...(record.mediaState === "pending" ? {} : {image: record.image, alt: record.imageAlt}),
  }));
}

function atlasCoverageEntries(records: readonly OperationsAtlasRecord[], copy: OperationsAtlasCopy): VisualCoverageEntry[] {
  return records.map((record) => ({
    scope: "operations-atlas",
    group: "operations-atlas",
    id: record.id,
    state: record.visual.state,
    ...(record.visual.state === "pending" ? {} : {
      image: record.visual.image,
      alt: copy.entries[record.id]?.imageAlt,
    }),
  }));
}

export function auditCatalogueVisualCoverage(
  records: readonly CatalogueRecord[] = catalogueRecords,
  mediaSources: Readonly<Record<string, CatalogueMediaSource>> = catalogueMediaSources,
  assetExists: AssetExists = publicAssetExists,
): string[] {
  const violations: string[] = [];
  const imageOwners = new Map<string, string[]>();

  for (const record of records) {
    const recordKey = `${record.type}/${record.slug}`;
    if (record.mediaState === "pending") {
      if (record.image || record.imageAlt) violations.push(`${recordKey}: pending media must not expose an image or alt`);
      continue;
    }

    if (!record.image) {
      violations.push(`${recordKey}: missing object image`);
      continue;
    }
    if (!meaningfulAlt(record.imageAlt)) violations.push(`${recordKey}: missing meaningful alt`);
    if (record.mediaState === "verified" && record.image.includes("/banners/")) {
      violations.push(`${recordKey}: generic banner used as verified object evidence`);
    }
    if (!assetExists(record.image)) violations.push(`${recordKey}: asset file is missing`);

    const source = mediaSources[record.image];
    if (!source || !sourceApprovesRecord(source, recordKey) || source.assetKind !== "object") {
      violations.push(`${recordKey}: image has no approved provenance`);
    } else {
      if (source.image !== record.image) violations.push(`${recordKey}: provenance image does not match record image`);
      if (source.approvedState !== record.mediaState) {
        violations.push(`${recordKey}: record media state does not match approved provenance`);
      }
      if (!source.sourceUrl.startsWith("https://") || source.usageNote.trim().length < 20) {
        violations.push(`${recordKey}: provenance source or scope is incomplete`);
      }
    }

    imageOwners.set(record.image, [...(imageOwners.get(record.image) ?? []), recordKey]);
  }

  for (const [image, owners] of imageOwners) {
    if (owners.length > 1) violations.push(`${image}: duplicate object image for ${owners.join(", ")}`);
  }

  return violations.sort();
}

export function auditOperationsAtlasVisualCoverage(
  records: readonly OperationsAtlasRecord[] = operationsAtlasRecords,
  mediaSources: Readonly<Record<string, OperationsAtlasMediaSource>> = operationsAtlasMediaSources,
  copies: readonly AtlasCopyAuditInput[] = locales.map((locale) => ({locale, copy: getOperationsAtlasCopy(locale)})),
  assetExists: AssetExists = publicAssetExists,
): string[] {
  const violations: string[] = [];
  const imageOwners = new Map<string, string[]>();

  for (const record of records) {
    const source = mediaSources[record.id];
    if (record.visual.state === "pending") {
      if (record.visual.image) violations.push(`${record.id}: pending atlas visual must not expose an image`);
      if (source) violations.push(`${record.id}: pending atlas visual unexpectedly has approved provenance`);
      continue;
    }

    if (!record.visual.image) {
      violations.push(`${record.id}: missing atlas image`);
      continue;
    }
    if (!source || source.recordId !== record.id || source.image !== record.visual.image) {
      violations.push(`${record.id}: atlas image has no approved provenance`);
    } else {
      if (source.state !== record.visual.state) {
        violations.push(`${record.id}: visual state does not match approved provenance`);
      }
      if (!source.sourceUrl.startsWith("https://") || source.usageNote.trim().length < 20) {
        violations.push(`${record.id}: atlas provenance source or scope is incomplete`);
      }
    }
    if (record.visual.state === "verified" && record.visual.image.includes("/banners/")) {
      violations.push(`${record.id}: generic banner used as verified atlas evidence`);
    }
    if (!assetExists(record.visual.image)) violations.push(`${record.id}: atlas asset file is missing`);

    for (const {locale, copy} of copies) {
      if (!meaningfulAlt(copy.entries[record.id]?.imageAlt)) {
        violations.push(`${record.id}/${locale}: missing meaningful alt`);
      }
    }
    imageOwners.set(record.visual.image, [...(imageOwners.get(record.visual.image) ?? []), record.id]);
  }

  for (const [image, owners] of imageOwners) {
    if (owners.length > 1) violations.push(`${image}: duplicate atlas image for ${owners.join(", ")}`);
  }

  return violations.sort();
}

export function getVisualCoverageEntries(): VisualCoverageEntry[] {
  return [
    ...catalogueCoverageEntries(catalogueRecords),
    ...atlasCoverageEntries(operationsAtlasRecords, getOperationsAtlasCopy("en")),
  ];
}

export function getVisualCoverageSummary(): VisualCoverageSummary[] {
  const entries = getVisualCoverageEntries();
  return groupOrder.map((group) => {
    const matching = entries.filter((entry) => entry.group === group);
    return {
      group,
      total: matching.length,
      verified: matching.filter((entry) => entry.state === "verified").length,
      contextual: matching.filter((entry) => entry.state === "contextual").length,
      pending: matching.filter((entry) => entry.state === "pending").length,
    };
  });
}

export function getIndexableVisualViolations(): string[] {
  const violations: string[] = [];
  const imageOwners = new Map<string, string[]>();

  for (const item of itemLibrary.filter((candidate) => candidate.indexable)) {
    const recordKey = `${item.type}/${item.slug}`;
    if (!item.detailImage || !meaningfulAlt(item.detailImageAlt)) {
      violations.push(`${recordKey}: missing object image or alt text`);
      continue;
    }
    if (item.detailImage.includes("/banners/")) violations.push(`${recordKey}: generic banner used as detail evidence`);
    if (!publicAssetExists(item.detailImage)) violations.push(`${recordKey}: detail asset file is missing`);
    const source = catalogueMediaSources[item.detailImage];
    if (!sourceApprovesRecord(source, recordKey) || source?.assetKind !== "object" || source.approvedState !== "verified") {
      violations.push(`${recordKey}: image has no approved object-matching provenance`);
    }
    imageOwners.set(item.detailImage, [...(imageOwners.get(item.detailImage) ?? []), recordKey]);
  }

  for (const [image, owners] of imageOwners) {
    if (owners.length > 1) violations.push(`${image}: duplicate detail image for ${owners.join(", ")}`);
  }

  return violations.sort();
}
