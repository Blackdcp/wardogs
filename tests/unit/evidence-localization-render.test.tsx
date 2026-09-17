import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {EvidencePanel} from "../../src/components/catalogue/evidence-panel";
import {ItemChangeHistory} from "../../src/components/catalogue/item-change-history";
import {LogisticsPlanner} from "../../src/components/tools/logistics-planner";
import {ProgressionRoute} from "../../src/components/tools/progression-route";
import type {Locale} from "../../src/config/site";
import {seasonOneChanges} from "../../src/features/catalogue/catalogue-evidence";
import {getCatalogueRecord} from "../../src/features/catalogue/catalogue-records";
import {getLogisticsStages, logisticsStageIds} from "../../src/features/tools/logistics-plan";
import {getProgressionRoutes} from "../../src/features/tools/progression-routes";
import {getToolCopy} from "../../src/features/tools/tool-copy";

const translatedLocales = ["de", "ru", "pt-br", "ja", "zh-cn"] as const satisfies readonly Locale[];
const baseLeakedEvidenceTokens = "Season 1|Required level|FOB vendor|Vendor price|Pilot level|Driver level|Progression track|2026-09-09";
const leakedEvidenceTokens: Record<(typeof translatedLocales)[number], RegExp> = {
  de: new RegExp(`${baseLeakedEvidenceTokens}|\\b(?:Driver|Support|Recon)\\b`),
  ru: new RegExp(`${baseLeakedEvidenceTokens}|\\b(?:Pilot|Driver|Support|Recon)\\b`),
  "pt-br": new RegExp(`${baseLeakedEvidenceTokens}|\\b(?:Pilot|Driver|Support|Recon)\\b`),
  ja: new RegExp(`${baseLeakedEvidenceTokens}|\\b(?:Pilot|Driver|Support|Recon)\\b`),
  "zh-cn": new RegExp(`${baseLeakedEvidenceTokens}|\\b(?:Pilot|Driver|Support|Recon)\\b`),
};

describe("localized evidence rendering", () => {
  it("assigns one stable ID to every normalized Season 1 change", () => {
    expect(seasonOneChanges.every((change) => change.id.trim().length > 0)).toBe(true);
    expect(new Set(seasonOneChanges.map(({id}) => id)).size).toBe(seasonOneChanges.length);
  });

  it("renders build, field, entity, note/value text, and dates without English evidence leaks", () => {
    const fob = getCatalogueRecord("deployables", "fob-vendor")!;
    const deagle = getCatalogueRecord("weapons", "deagle")!;

    for (const locale of translatedLocales) {
      const copy = getToolCopy(locale);
      const evidenceHtml = renderToStaticMarkup(
        <EvidencePanel dataAsOf={fob.dataAsOf} evidence={fob.evidence} locale={locale} />,
      );
      const historyHtml = renderToStaticMarkup(
        <ItemChangeHistory changes={deagle.changeHistory} locale={locale} />,
      );
      const progressionHtml = renderToStaticMarkup(
        <ProgressionRoute
          copy={copy}
          initialState={{role: "driver", currentLevel: 12}}
          routes={getProgressionRoutes(locale)}
        />,
      );
      const logisticsHtml = renderToStaticMarkup(
        <LogisticsPlanner
          copy={copy}
          initialState={{stages: [...logisticsStageIds]}}
          stages={getLogisticsStages(locale)}
        />,
      );
      const html = [evidenceHtml, historyHtml, progressionHtml, logisticsHtml].join(" ");

      expect(html, locale).not.toMatch(leakedEvidenceTokens[locale]);
      expect(html, `${locale} source URL`).toContain("store.steampowered.com/news/app/1867240/view/701027323413004455");
    }
  });
});
