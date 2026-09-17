import type {Locale} from "@/config/site";
import {
  seasonOneChanges,
  seasonOneSourceUrl,
  seasonOneVerifiedAt,
  type SeasonOneChange,
} from "@/features/catalogue/catalogue-evidence";
import {getToolCopy} from "./tool-copy";
import {localizeSeasonOneChange} from "@/features/catalogue/catalogue-change-localization";

export const progressionRoleIds = ["assault", "medic", "recon", "support", "driver", "pilot"] as const;

export type ProgressionRoleId = (typeof progressionRoleIds)[number];

export type ProgressionRoleRoute = {
  id: ProgressionRoleId;
  roleLabel: string;
  goal: string;
  duty: string;
  nextAction: string;
  changes: readonly SeasonOneChange[];
  duration: null;
  durationLabel: string;
  sourceUrl: string;
  checkedAt: string;
  sourceClass: "official";
  confidence: "confirmed";
  build: string;
};

export type ProgressionRouteResult = ProgressionRoleRoute & {
  currentLevel: number | null;
};

export function isProgressionRoleId(value: string): value is ProgressionRoleId {
  return progressionRoleIds.includes(value as ProgressionRoleId);
}

export function getProgressionRoutes(locale: Locale = "en"): ProgressionRoleRoute[] {
  const copy = getToolCopy(locale);

  return progressionRoleIds.map((id) => {
    const localized = copy.roles[id];
    return {
      id,
      roleLabel: localized.label,
      goal: localized.goal,
      duty: localized.duty,
      nextAction: localized.nextAction,
      changes: seasonOneChanges
        .filter((change) => change.progressionTrack === id)
        .map((change) => localizeSeasonOneChange(change, locale)),
      duration: null,
      durationLabel: copy.unknownDuration,
      sourceUrl: seasonOneSourceUrl,
      checkedAt: seasonOneVerifiedAt,
      sourceClass: "official",
      confidence: "confirmed",
      build: "Season 1",
    };
  });
}

export function buildProgressionRoute(
  role: ProgressionRoleId,
  currentLevel: number | null,
  locale: Locale = "en",
): ProgressionRouteResult {
  const route = getProgressionRoutes(locale).find(({id}) => id === role) ?? getProgressionRoutes(locale)[0];
  return {...route, currentLevel};
}
