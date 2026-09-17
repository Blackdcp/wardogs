import type {Locale} from "@/config/site";
import {
  seasonOneChanges,
  seasonOneSourceUrl,
  seasonOneVerifiedAt,
  type SeasonOneChange,
} from "@/features/catalogue/catalogue-evidence";
import {getToolCopy} from "./tool-copy";
import {localizeSeasonOneChange} from "@/features/catalogue/catalogue-change-localization";

export const logisticsStageIds = ["spawn", "construction", "supply", "transport", "defense", "recovery"] as const;

export type LogisticsStageId = (typeof logisticsStageIds)[number];
type LogisticsStageBase = {
  id: LogisticsStageId;
  title: string;
  action: string;
  evidenceNote: string;
};

export type LogisticsStageWithOfficialChanges = LogisticsStageBase & {
  evidenceState: "current";
  changes: readonly [SeasonOneChange, ...SeasonOneChange[]];
  sourceUrl: string;
  checkedAt: string;
  build: string;
  sourceClass: "official";
  confidence: "confirmed";
};

export type UnknownLogisticsStage = LogisticsStageBase & {
  evidenceState: "unknown";
  changes: readonly [];
  sourceUrl: null;
  checkedAt: null;
  build: null;
  sourceClass: null;
  confidence: null;
};

export type LogisticsStage = LogisticsStageWithOfficialChanges | UnknownLogisticsStage;
export type LogisticsEvidenceState = LogisticsStage["evidenceState"];

const changeIdsByStage: Record<LogisticsStageId, readonly string[]> = {
  spawn: ["fob-vendor-price"],
  construction: ["large-hammer-vendor-price", "large-hammer-support-unlock", "large-hammer-support-level"],
  supply: ["small-armored-crate-pilot-unlock", "large-supply-crate-level"],
  transport: [
    "ural-unlock",
    "dune-buggy-unlock",
    "kodiak-flatbed-unlock",
    "music-tape-h-driver-unlock",
    "ural-level",
    "kodiak-assault-level",
    "dune-buggy-level",
    "kodiak-flatbed-level",
    "ural-covered-level",
    "music-tape-h-track",
    "ural-attack-level",
    "humvee-minigun-level",
    "heavy-tank-track",
  ],
  defense: [],
  recovery: [],
};

export function isLogisticsStageId(value: string): value is LogisticsStageId {
  return logisticsStageIds.includes(value as LogisticsStageId);
}

function hasSeasonOneChanges(changes: SeasonOneChange[]): changes is [SeasonOneChange, ...SeasonOneChange[]] {
  return changes.length > 0;
}

export function getLogisticsStages(locale: Locale = "en"): LogisticsStage[] {
  const copy = getToolCopy(locale);

  return logisticsStageIds.map((id): LogisticsStage => {
    const localized = copy.logisticsStages[id];
    const changeIds = new Set(changeIdsByStage[id]);
    const changes = seasonOneChanges
      .filter((change) => changeIds.has(change.id))
      .map((change) => localizeSeasonOneChange(change, locale));

    if (!hasSeasonOneChanges(changes)) {
      return {
        id,
        title: localized.title,
        action: localized.action,
        evidenceNote: localized.evidenceNote,
        evidenceState: "unknown",
        changes: [],
        sourceUrl: null,
        checkedAt: null,
        build: null,
        sourceClass: null,
        confidence: null,
      };
    }

    return {
      id,
      title: localized.title,
      action: localized.action,
      evidenceNote: localized.evidenceNote,
      evidenceState: "current",
      changes,
      sourceUrl: seasonOneSourceUrl,
      checkedAt: seasonOneVerifiedAt,
      build: "Season 1",
      sourceClass: "official",
      confidence: "confirmed",
    };
  });
}

export function buildLogisticsPlan(order: readonly string[], locale: Locale = "en"): LogisticsStage[] {
  const stages = new Map(getLogisticsStages(locale).map((stage) => [stage.id, stage]));
  const seen = new Set<LogisticsStageId>();
  const plan: LogisticsStage[] = [];

  for (const value of order) {
    if (!isLogisticsStageId(value) || seen.has(value)) continue;
    const stage = stages.get(value);
    if (!stage) continue;
    seen.add(value);
    plan.push(stage);
  }
  return plan;
}
