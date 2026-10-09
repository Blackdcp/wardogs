import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {getGuideTaskData} from "../../src/features/guides/guide-task-data";
import {GuideTaskPanel} from "../../src/components/guides/guide-task-panel";

describe("authored answers reach the visible task panel", () => {
  it("uses the revised answer while retaining workflow steps, tool links and locale", () => {
    for (const locale of locales) {
      const baseline = getGuideTaskData("wardogs-progression-wipes-guide", locale)!;
      const updated = getGuideTaskData(baseline.slug, locale, "Current authored answer after reviewing the developer announcement.")!;
      expect(updated.steps).toEqual(baseline.steps);
      expect(updated.relatedTools).toEqual(baseline.relatedTools);
      const html = renderToStaticMarkup(<GuideTaskPanel locale={locale} data={{...updated, videos: []}} />);
      expect(html).toContain(updated.directAnswer);
      expect(updated.directAnswer).not.toEqual(baseline.directAnswer);
    }
  });
  it("retains existing task copy when no new authored answer exists", () => {
    const baseline = getGuideTaskData("wardogs-money-guide", "ja")!;
    expect(getGuideTaskData(baseline.slug, "ja", " ")?.directAnswer).toBe(baseline.directAnswer);
    expect(getGuideTaskData("wardogs-season-2", "ja", "A new answer")).toBeUndefined();
  });
});
