import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {MissionCase} from "../../src/components/guides/mission-case";
import {getMissionCase} from "../../src/features/guides/mission-cases";
import {decodeLogisticsPlanState} from "../../src/features/tools/share-state";
import {logisticsStageIds} from "../../src/features/tools/logistics-plan";
import {calculateSupplyPlan, supplyPlanSchema} from "../../src/features/tools/workflow-state";
import {isApprovedSourceUrl} from "../../src/content/source-policy";

describe("complete hypothetical cargo and FOB cases", () => {
  it("returns null outside the two assigned guides", () => {
    for (const slug of ["wardogs-season-2", "wardogs-progression-wipes-guide", "other"]) {
      expect(getMissionCase(slug, "en")).toBeNull();
      expect(renderToStaticMarkup(<MissionCase slug={slug} locale="en" />)).toBe("");
    }
  });

  it.each(locales)("provides six localized stages, owners, evidence and failure branches in %s", (locale) => {
    for (const slug of ["wardogs-cargo-guide", "wardogs-fob-guide"]) {
      const data = getMissionCase(slug, locale)!;
      const english = getMissionCase(slug, "en")!;
      expect(data.stages).toHaveLength(6);
      expect(new Set(data.stages.map(({id}) => id)).size).toBe(6);
      data.stages.forEach((stage, index) => {
        for (const key of ["title", "owner", "action", "pass", "failure"] as const) {
          expect(stage[key].trim(), `${slug}/${index}/${key}`).not.toBe("");
          if (locale !== "en") expect(stage[key], `${locale}/${slug}/${key}`).not.toBe(english.stages[index][key]);
        }
      });
      expect(data.title).not.toBe(getMissionCase(slug === "wardogs-cargo-guide" ? "wardogs-fob-guide" : "wardogs-cargo-guide", locale)!.title);
      for (const [key, value] of Object.entries(data.ui)) {
        if (typeof value !== "string") continue;
        expect(value.trim(), key).not.toBe("");
        if (locale !== "en") expect(value, `${locale}/${key}`).not.toBe(english.ui[key as keyof typeof english.ui]);
      }
      expect(Object.values(data.observations).every((value) => value === null)).toBe(true);
      expect(isApprovedSourceUrl(data.sourceUrl)).toBe(true);
      const html = renderToStaticMarkup(<MissionCase slug={slug} locale={locale} />);
      expect(html.match(/data-mission-stage=/g)).toHaveLength(6);
      expect(html).toContain('data-mission-evidence="hypothetical"');
      expect(html).toContain('data-mission-observations="unknown"');
      expect(html).toContain('data-mission-calculation="assumed"');
      expect(html).not.toContain("rounded");
      for (const anchor of html.matchAll(/<a\b[^>]*>/g)) expect(anchor[0]).toMatch(/\btitle="[^"]+"/);
    }
  });

  it.each(locales)("round-trips explicit assumptions through the existing supply planner in %s", (locale) => {
    for (const slug of ["wardogs-cargo-guide", "wardogs-fob-guide"]) {
      const data = getMissionCase(slug, locale)!;
      const url = new URL(data.plannerHref, "https://example.invalid");
      expect(url.pathname).toBe(`/${locale}/tools/logistics-planner`);
      expect(supplyPlanSchema.safeParse(data.plan).success).toBe(true);
      const decoded = decodeLogisticsPlanState(url.search, logisticsStageIds);
      expect(decoded.supplies).toEqual(data.plan);
      expect(decoded.stages.length).toBeGreaterThan(0);
      expect(calculateSupplyPlan(decoded.supplies!)).toEqual(data.calculation);
      expect(data.calculation).toMatchObject({unknown: 0, remaining: slug === "wardogs-cargo-guide" ? 100 : 70, trips: 3});
      expect(calculateSupplyPlan({...data.plan, capacity: null}).trips).toBeNull();
    }
  });
});
