import type {Locale} from "@/config/site";
import {
  seasonOneChanges,
  seasonOneSourceUrl,
  seasonOneVerifiedAt,
  type SeasonOneChange,
} from "@/features/catalogue/catalogue-evidence";
import {getToolCopy} from "./tool-copy";

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
  build: "Season 1";
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

const changesByStage: Record<LogisticsStageId, readonly string[]> = {
  spawn: ["FOB vendor"],
  construction: ["Large Hammer vendor", "Large Hammer Support unlock", "Large Hammer Support required level"],
  supply: ["Small Armored Supply Crate Pilot unlock", "Large Supply Crate required level"],
  transport: [
    "URAL unlock",
    "Dune Buggy unlock",
    "Kodiak Flatbed unlock",
    "Music Tape H Driver unlock",
    "URAL required level",
    "Kodiak Assault required level",
    "Dune Buggy required level",
    "Kodiak Flatbed required level",
    "URAL Covered required level",
    "Music Tape H progression track",
    "URAL Attack required level",
    "Humvee with minigun required level",
    "Heavy Tank progression track",
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
    const entities = new Set(changesByStage[id]);
    const changes = seasonOneChanges.filter((change) => entities.has(change.entity));

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
