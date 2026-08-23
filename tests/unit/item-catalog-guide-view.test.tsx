import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it, vi} from "vitest";
import {
  CatalogueCategoryView,
  matchCatalogueGuideRecords
} from "../../src/components/catalogue/catalogue-category-view";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {ItemCatalogGuide} from "../../src/features/items/item-catalog-guide";
import {getCatalogGuide} from "../../src/features/items/item-catalog-guides";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("ItemCatalogGuide", () => {
  it("normalizes the category hero return link for a subpath Pages export", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("GITHUB_PAGES", "true");
    const guide = getCatalogGuide("weapons");

    const html = renderToStaticMarkup(<CatalogueCategoryView guide={guide!} locale="de" />);

    expect(html).toContain('href="/wardogs/de/items/"');
    expect(html).not.toContain('href="/de/items"');
  });

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

  it("uses the matching locale route from every localized category table", () => {
    const guide = getCatalogGuide("weapons");
    const matchedGuide = matchCatalogueGuideRecords(guide!, getCatalogueRecords("weapons"));

    for (const locale of ["ru", "de", "pt-br", "ja"] as const) {
      const html = renderToStaticMarkup(<ItemCatalogGuide guide={matchedGuide} locale={locale} />);

      expect(html).toContain(`href="/${locale}/items/weapons/ak74"`);
      expect(html).not.toContain('href="/en/items/weapons/ak74"');
    }
  });

  it("includes the configured base path in a published English model table href", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("GITHUB_PAGES", "true");
    const guide = getCatalogGuide("weapons");
    const records = getCatalogueRecords("weapons").map((record) => record.slug === "ak74"
      ? {...record, detailStatus: "planned" as const, detailHref: undefined}
      : record);
    const matchedGuide = matchCatalogueGuideRecords(guide!, records);

    const html = renderToStaticMarkup(<ItemCatalogGuide guide={matchedGuide} locale="de" />);

    expect(html).toContain('href="/wardogs/de/items/weapons/galil/"');
    expect(html).not.toContain('href="/en/items/weapons/galil"');
    expect(html).toContain('href="#record-weapons-ak74"');
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
