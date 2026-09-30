import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {ProgressionMatrix} from "../../src/components/guides/progression-matrix";
import {getProgressionMatrix} from "../../src/features/guides/progression-matrix";
import {seasonOneChanges} from "../../src/features/catalogue/catalogue-evidence-data";
import {getProgressionRoutes} from "../../src/features/tools/progression-routes";
import {isApprovedSourceUrl} from "../../src/content/source-policy";

describe("cross-season progression matrix", () => {
  it("renders only on its two assigned guides", () => {
    for (const slug of ["wardogs-season-2", "wardogs-progression-wipes-guide"]) {
      expect(getProgressionMatrix(slug, "en")).not.toBeNull();
      expect(renderToStaticMarkup(<ProgressionMatrix slug={slug} locale="en" />)).toContain("data-progression-matrix");
    }
    for (const slug of ["wardogs-fob-guide", "wardogs-cargo-guide", "other"]) {
      expect(getProgressionMatrix(slug, "en")).toBeNull();
      expect(renderToStaticMarkup(<ProgressionMatrix slug={slug} locale="en" />)).toBe("");
    }
  });

  it.each(locales)("reuses all recorded role changes and a separate Career group in %s", (locale) => {
    const matrix = getProgressionMatrix("wardogs-season-2", locale)!;
    expect(matrix.groups.map(({id}) => id)).toEqual(["career", "assault", "medic", "recon", "support", "driver", "pilot"]);
    for (const route of getProgressionRoutes(locale)) {
      const group = matrix.groups.find(({id}) => id === route.id)!;
      expect(group.rows).toEqual(route.changes.map((change) => ({...change, seasonTwoState: "unknown", seasonTwoValue: null})));
    }
    expect(matrix.groups.find(({id}) => id === "assault")!.rows).toEqual([]);
    const rows = matrix.groups.flatMap(({rows}) => rows);
    expect(rows.map(({id}) => id).sort()).toEqual(seasonOneChanges.filter(({progressionTrack}) => progressionTrack).map(({id}) => id).sort());
    expect(rows.find(({id}) => id === "heavy-tank-track")).toMatchObject({progressionTrack: "driver"});
    expect(rows.find(({id}) => id === "artillery-tank-career-level")).toMatchObject({progressionTrack: "career", currentValue: "90"});
    expect(rows.find(({id}) => id === "large-hammer-support-unlock")).toMatchObject({currentValue: "$75,000"});
    expect(rows.some(({id}) => id === "large-hammer-vendor-price")).toBe(false);
    expect(matrix.ui.purchaseNote.length).toBeGreaterThan(30);
  });

  it.each(locales)("keeps every unannounced S2 field null and dates historical in %s", (locale) => {
    const data = getProgressionMatrix("wardogs-season-2", locale)!;
    expect(data.checkedAt).toBe("2026-09-09");
    expect(data.seasonTwoCheckedAt).toBe("2026-09-23");
    expect(isApprovedSourceUrl(data.sourceUrl)).toBe(true);
    expect(isApprovedSourceUrl(data.seasonTwoSourceUrl)).toBe(true);
    for (const row of data.groups.flatMap(({rows}) => rows)) {
      expect(row).toMatchObject({seasonTwoState: "unknown", seasonTwoValue: null, verifiedAt: "2026-09-09", sourceUrl: data.sourceUrl});
    }
    const html = renderToStaticMarkup(<ProgressionMatrix slug="wardogs-season-2" locale={locale} />);
    expect(html.match(/data-season-two-state="unknown"/g)).toHaveLength(data.groups.flatMap(({rows}) => rows).length);
    expect(html).toContain(`href="/${locale}/tools/progression-route"`);
    expect(html).toContain('scope="row"');
    expect(html).toContain('overflow-x-auto');
    for (const anchor of html.matchAll(/<a\b[^>]*>/g)) expect(anchor[0]).toMatch(/\btitle="[^"]+"/);
    const english = getProgressionMatrix("wardogs-season-2", "en")!.ui;
    for (const [key, value] of Object.entries(data.ui)) {
      expect(value.trim(), key).not.toBe("");
      if (locale !== "en") expect(value, `${locale}/${key}`).not.toBe(english[key as keyof typeof english]);
    }
  });
});
