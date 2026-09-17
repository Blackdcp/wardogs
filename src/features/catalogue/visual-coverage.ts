import {itemLibrary} from "@/features/items/item-library";
import {operationsAtlasRecords} from "@/features/maps/operations-atlas";
import {catalogueMediaSources} from "./catalogue-media-sources";
import {catalogueRecords} from "./catalogue-records";

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

function catalogueCoverageEntries(): VisualCoverageEntry[] {
  return catalogueRecords.map((record) => {
    const hasApprovedAsset = Boolean(
      record.image
      && record.imageAlt?.trim()
      && !record.image.includes("/banners/")
      && catalogueMediaSources[record.image],
    );

    return {
      scope: "catalogue",
      group: record.type,
      id: record.slug,
      state: hasApprovedAsset ? "verified" : "pending",
      ...(hasApprovedAsset ? {image: record.image, alt: record.imageAlt} : {}),
    };
  });
}

function atlasCoverageEntries(): VisualCoverageEntry[] {
  return operationsAtlasRecords.map((record) => ({
    scope: "operations-atlas",
    group: "operations-atlas",
    id: record.id,
    state: record.visual.state,
    image: record.visual.image,
  }));
}

export function getVisualCoverageEntries(): VisualCoverageEntry[] {
  return [...catalogueCoverageEntries(), ...atlasCoverageEntries()];
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
  const imageOwners = new Map<string, string[]>();
  const violations: string[] = [];

  for (const item of itemLibrary.filter((candidate) => candidate.indexable)) {
    const key = `${item.type}/${item.slug}`;
    if (!item.detailImage || !item.detailImageAlt?.trim()) {
      violations.push(`${key}: missing object image or alt text`);
      continue;
    }
    if (item.detailImage.includes("/banners/")) {
      violations.push(`${key}: generic banner used as detail evidence`);
    }
    if (!catalogueMediaSources[item.detailImage]) {
      violations.push(`${key}: image has no approved provenance`);
    }
    imageOwners.set(item.detailImage, [...(imageOwners.get(item.detailImage) ?? []), key]);
  }

  for (const [image, owners] of imageOwners) {
    if (owners.length > 1) violations.push(`${image}: duplicate detail image for ${owners.join(", ")}`);
  }

  return violations.sort();
}
