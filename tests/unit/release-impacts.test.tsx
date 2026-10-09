import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it, vi} from "vitest";
import contract from "../../config/traffic-protected-routes.json";
import {locales} from "../../src/config/site";
import {ReleaseImpactPanel} from "../../src/components/releases/release-impact-panel";
import {getReleaseImpactCopy, getReleaseImpacts, releaseImpacts} from "../../src/features/releases/release-impacts";

describe("release impact evidence", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("preserves the deployment prefix for the auxiliary Pages export", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    const html = renderToStaticMarkup(<ReleaseImpactPanel locale="ja" path="/videos" />);
    expect(html).toContain('href="/wardogs/ja/tools/weapon-compare/"');
    expect(html).not.toContain('href="/ja/');
  });
  it("connects only existing protected localized routes and never substitutes planned weapon stats", () => {
    const routes = new Set(contract.canonical.map(({path}) => path));
    for (const impact of releaseImpacts) {
      expect(["announced", "explained"]).toContain(impact.status);
      const source = new URL(impact.sourceUrl);
      expect(source.hostname).toBe("www.youtube.com");
      expect(source.searchParams.get("v")).toBe("liRK9si1Ubo");
      expect(source.searchParams.get("t")).toMatch(/^\d+s$/);
      for (const locale of locales) {
        for (const path of [...impact.paths, ...impact.relatedPaths]) {
          expect(routes.has(`/${locale}${path}`), `${locale}${path}`).toBe(true);
        }
      }
    }
    expect(getReleaseImpacts("/tools/weapon-compare").map(({id}) => id)).toEqual(["weapons", "armor"]);
    expect(getReleaseImpacts("/guides/wardogs-cargo-guide")).toEqual([]);
    expect(getReleaseImpacts("/")).toEqual([]);
  });

  it("renders translated evidence and language-preserving next steps in all eight locales", () => {
    for (const locale of locales) {
      const copy = getReleaseImpactCopy(locale);
      const html = renderToStaticMarkup(<ReleaseImpactPanel locale={locale} path="/videos" />);
      expect(html).toContain(`href="/${locale}/gold-market"`);
      expect(html).toContain(`href="/${locale}/tools/weapon-compare"`);
      expect(html).not.toContain("undefined");
      expect(html).not.toContain('data-release-status="live"');
      for (const impact of releaseImpacts) {
        expect(copy.impacts[impact.id].action.length).toBeGreaterThan(20);
        expect(html).toContain(`data-release-impact="${impact.id}"`);
        for (const path of impact.relatedPaths) expect(copy.links[path]).toBeTruthy();
      }
      if (locale !== "en") expect(copy.title).not.toBe(getReleaseImpactCopy("en").title);
    }
    expect(renderToStaticMarkup(<ReleaseImpactPanel locale="en" path="/tools/system-check" />)).toBe("");
  });
});
