import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {matchCatalogueGuideRecords} from "../../src/components/catalogue/catalogue-category-view";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {ItemCatalogGuide} from "../../src/features/items/item-catalog-guide";
import {getCatalogGuide} from "../../src/features/items/item-catalog-guides";

describe("ItemCatalogGuide", () => {
  it("renders a complete weapons catalogue with version and evidence context", () => {
    const guide = getCatalogGuide("weapons");
    expect(guide).toBeDefined();

    const html = renderToStaticMarkup(<ItemCatalogGuide guide={guide!} locale="en" />);

    expect(html).toContain("33 weapons");
    expect(html).toContain("Alpha 1 - 7 Aug 2026");
    expect(html).toContain("Bushmaster M17S");
    expect(html).toContain("What the catalogue means");
    expect(html).toContain("What is not confirmed");
    expect(html).toContain("tabindex=\"0\"");
    expect(html).toContain("<caption");
    expect(html).toContain("scope=\"row\"");
  });

  it("links matched published rows to localized details and leaves unmatched rows plain", () => {
    const guide = getCatalogGuide("weapons");
    expect(guide).toBeDefined();
    const guideWithUnknown = {
      ...guide!,
      sections: guide!.sections.map((section, index) => index === 0
        ? {...section, rows: [...section.rows, {cells: ["Unknown Prototype", "-", "-", "-", "-", "-"]}]}
        : section)
    };

    const matchedGuide = matchCatalogueGuideRecords(guideWithUnknown, getCatalogueRecords("weapons"));
    const ak74 = matchedGuide.sections.flatMap((section) => section.rows).find((row) => row.cells[0] === "AK74");
    const html = renderToStaticMarkup(<ItemCatalogGuide guide={matchedGuide} locale="en" />);

    expect(ak74?.recordSlug).toBe("ak74");
    expect(ak74?.detailStatus).toBe("published");
    expect(html).toContain('href="/en/items/weapons/ak74"');
    expect(html).not.toContain('href="/items/weapons/ak74"');
    expect(html).not.toContain('href="#record-weapons-ak74"');
    expect(html).toContain("Unknown Prototype");
    expect(html).not.toContain('href="#record-weapons-unknown-prototype"');
  });

  it("uses an exact detail URL when a future matched row is published", () => {
    const guide = getCatalogGuide("weapons");
    const records = getCatalogueRecords("weapons").map((record) => record.slug === "ak74"
      ? {...record, detailStatus: "published" as const, detailHref: "/items/weapons/ak74" as const}
      : record);
    const matchedGuide = matchCatalogueGuideRecords(guide!, records);

    const html = renderToStaticMarkup(<ItemCatalogGuide guide={matchedGuide} locale="en" />);

    expect(html).toContain('href="/en/items/weapons/ak74"');
    expect(html).not.toContain('href="/items/weapons/ak74"');
    expect(html).not.toContain('href="#record-weapons-ak74"');
  });

  it("does not link a published row whose detail URL is missing", () => {
    const guide = getCatalogGuide("weapons");
    const records = getCatalogueRecords("weapons").map((record) => record.slug === "ak74"
      ? {...record, detailStatus: "published" as const, detailHref: undefined}
      : record);
    const matchedGuide = matchCatalogueGuideRecords(guide!, records);

    const html = renderToStaticMarkup(<ItemCatalogGuide guide={matchedGuide} locale="en" />);

    expect(html).not.toContain('href="/items/weapons/ak74"');
    expect(html).not.toContain('href="#record-weapons-ak74"');
  });
});
