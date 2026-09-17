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
export type LogisticsEvidenceState = "current" | "historical" | "unknown";

export type LogisticsStage = {
  id: LogisticsStageId;
  title: string;
  action: string;
  evidenceNote: string;
  evidenceState: LogisticsEvidenceState;
  changes: readonly SeasonOneChange[];
  sourceUrl: string;
  checkedAt: string;
  build: "Season 1" | null;
  sourceClass: "official";
  confidence: "confirmed";
};

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

export function getLogisticsStages(locale: Locale = "en"): LogisticsStage[] {
  const copy = getToolCopy(locale);

  return logisticsStageIds.map((id) => {
    const localized = copy.logisticsStages[id];
    const entities = new Set(changesByStage[id]);
    const changes = seasonOneChanges.filter((change) => entities.has(change.entity));
    const evidenceState: LogisticsEvidenceState = changes.length > 0 ? "current" : "unknown";
    return {
      id,
      title: localized.title,
      action: localized.action,
      evidenceNote: localized.evidenceNote,
      evidenceState,
      changes,
      sourceUrl: seasonOneSourceUrl,
      checkedAt: seasonOneVerifiedAt,
      build: evidenceState === "current" ? "Season 1" : null,
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
