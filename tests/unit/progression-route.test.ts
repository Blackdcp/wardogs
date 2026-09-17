import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {seasonOneChanges} from "../../src/features/catalogue/catalogue-evidence";
import {isApprovedSourceUrl} from "../../src/content/source-policy";
import {
  buildProgressionRoute,
  getProgressionRoutes,
  progressionRoleIds,
} from "../../src/features/tools/progression-routes";

describe("progression route tool", () => {
  it("publishes all six recognized role routes with approved official sources", () => {
    expect(progressionRoleIds).toEqual(["assault", "medic", "recon", "support", "driver", "pilot"]);

    const routes = getProgressionRoutes("en");
    expect(routes.map(({id}) => id)).toEqual(progressionRoleIds);
    for (const route of routes) {
      expect(route.roleLabel.trim(), route.id).not.toBe("");
      expect(route.goal.trim(), route.id).not.toBe("");
      expect(route.duty.trim(), route.id).not.toBe("");
      expect(route.nextAction.trim(), route.id).not.toBe("");
      expect(route.sourceClass, route.id).toBe("official");
      expect(route.checkedAt, route.id).toBe("2026-09-09");
      expect(isApprovedSourceUrl(route.sourceUrl), route.id).toBe(true);
    }
  });

  it("derives every role-specific Season 1 change from the normalized evidence layer", () => {
    const routes = getProgressionRoutes("en");

    for (const route of routes) {
      const normalized = seasonOneChanges.filter((change) => change.progressionTrack === route.id);
      expect(route.changes, route.id).toEqual(normalized);
      for (const change of route.changes) {
        expect(change.effectiveBuild).toBe("Season 1");
        expect(change.sourceUrl).toBe(route.sourceUrl);
        expect(change.verifiedAt).toBe(route.checkedAt);
      }
    }

    expect(routes.find(({id}) => id === "medic")?.changes.map(({entity}) => entity))
      .toContain("PP-19 50 round drum magazine required level");
    expect(routes.find(({id}) => id === "recon")?.changes.map(({entity}) => entity))
      .toEqual(expect.arrayContaining(["Recon 6-10x MRAD scope unlock", "Recon 6-10x MOA scope unlock"]));
    expect(routes.find(({id}) => id === "driver")?.changes.map(({entity}) => entity))
      .toEqual(expect.arrayContaining(["URAL required level", "Heavy Tank progression track"]));
  });

  it("keeps duration unknown and never manufactures XP, hours, or a best route", () => {
    for (const locale of locales) {
      for (const role of progressionRoleIds) {
        const route = buildProgressionRoute(role, 17, locale);
        expect(route.currentLevel).toBe(17);
        expect(route.duration).toBeNull();
        expect(route.durationLabel.trim()).not.toBe("");
        expect(`${route.goal} ${route.duty} ${route.nextAction} ${route.durationLabel}`)
          .not.toMatch(/\b\d+(?:\.\d+)?\s*(?:hours?|matches?|xp)\b|fastest|best route/i);
      }
    }
  });

  it("localizes every route without moving evidence into locale copy", () => {
    for (const locale of locales) {
      const routes = getProgressionRoutes(locale);
      expect(routes).toHaveLength(6);
      expect(routes.every((route) => route.roleLabel.trim() && route.goal.trim() && route.nextAction.trim()), locale)
        .toBe(true);
      const localizedChanges = routes.flatMap(({changes}) => changes);
      const englishChanges = getProgressionRoutes("en").flatMap(({changes}) => changes);
      expect(localizedChanges.map(({id, sourceUrl, verifiedAt}) => ({id, sourceUrl, verifiedAt})))
        .toEqual(englishChanges.map(({id, sourceUrl, verifiedAt}) => ({id, sourceUrl, verifiedAt})));
      for (const change of englishChanges.filter(({previousValue, currentValue}) => /^[$\d,]+$/.test(previousValue) && /^[$\d,]+$/.test(currentValue))) {
        expect(localizedChanges.find(({id}) => id === change.id)).toMatchObject({
          previousValue: change.previousValue,
          currentValue: change.currentValue,
        });
      }
    }
  });
});
