import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {ItemImageInspection} from "../../src/components/catalogue/item-image-inspection";
import {catalogueMediaSources} from "../../src/features/catalogue/catalogue-media-sources";
import {catalogueRecords} from "../../src/features/catalogue/catalogue-records";

describe("catalogue image inspection audit", () => {
  it("records provenance gaps without changing object matching or acquiring assets", () => {
    expect(catalogueRecords.filter(({mediaState}) => mediaState === "verified")).toHaveLength(124);
    expect(catalogueRecords.filter(({mediaState}) => mediaState === "context-only")).toHaveLength(88);
    expect(catalogueRecords.filter(({mediaState}) => mediaState === "pending")).toHaveLength(22);
    expect(Object.keys(catalogueMediaSources)).toHaveLength(216);
    for (const source of Object.values(catalogueMediaSources)) {
      expect(source.inspection, source.image).toBeDefined();
      expect(source.inspection?.recordReviewedAt).toBe("2026-09-30");
      expect(source.inspection?.captureDate).toBeNull();
      expect(source.inspection?.gameBuild).toBeNull();
      expect(source.inspection?.currentBuildVerified).toBe(false);
      expect(Object.values(source.inspection!.rights).every((value) => value === null)).toBe(true);
      expect(source.inspection?.processing).toEqual({historyComplete: false, aiReconstruction: "not-recorded"});
      expect(source.retrievedAt).not.toBe(source.inspection?.recordReviewedAt);
    }
  });

  it("keeps the original press-kit source instead of relabeling old bytes with the new kit", () => {
    const source = catalogueMediaSources["/images/catalogue/weapons/m4.webp"];
    expect(decodeURIComponent(source.sourceUrl!)).toContain("(Aug 26)");
    expect(source.retrievedAt).toBe("2026-08-30");
    expect(source.capturedAt).toBe("WD_Screenshot_Destruction_1_WD2.jpg");
    expect(source.inspection?.recordedOrigin).toBe("publisher-press-kit");
    expect(source.usageNote).toContain("M4");
    expect(source.approvedState).toBe("verified");
    expect(source.inspection?.rights.adSupportedHosting).toBeNull();
  });

  it("distinguishes owner-provided art, supplied community art and third-party sources", () => {
    const origins = Object.values(catalogueMediaSources).reduce<Record<string, number>>((counts, source) => {
      const origin = source.inspection!.recordedOrigin;
      counts[origin] = (counts[origin] ?? 0) + 1;
      return counts;
    }, {});
    expect(origins).toEqual({
      "publisher-press-kit": 6, "third-party-media": 57,
      "owner-provided-artwork": 65, "supplied-community-artwork": 88,
    });
    expect(catalogueMediaSources["/images/catalogue/ammo/45-acp.webp"].sourceUrl).toBeUndefined();
  });

  const locales = [
    ["en", "Capture, build and rights record"],
    ["zh-cn", "拍摄、版本与许可记录"],
    ["ja", "撮影・ゲーム版・許諾の記録"],
    ["de", "Aufnahme, Spielversion und Rechte"],
    ["ru", "Съёмка, версия и права"],
    ["pt-br", "Captura, versão e direitos"],
  ];

  it.each(locales)("keeps %s inspection concise and collapsed by default", (locale, summary) => {
    const inspection = catalogueMediaSources["/images/catalogue/weapons/m4.webp"].inspection;
    const html = renderToStaticMarkup(<ItemImageInspection locale={locale} inspection={inspection} />);
    expect(html).toContain("<details");
    expect(html).not.toMatch(/<details[^>]*\bopen(?:=|\s|>)/);
    expect(html).toContain(`${summary}</summary>`);
    expect(html.match(/<dt\b/g)).toHaveLength(6);
    expect(html).toContain("2026-09-30");
    if (locale !== "en") {
      expect(html).not.toMatch(/Recorded origin|Not recorded|Permission evidence|not our capture|Record reviewed/);
    }
  });

  it("does not fabricate provenance when the inspection record is absent", () => {
    const html = renderToStaticMarkup(<ItemImageInspection locale="en" />);
    expect(html).toContain("Not recorded");
    expect(html).not.toContain("Official press-kit attribution");
    expect(html).not.toContain("2026-09-30");
  });
});
