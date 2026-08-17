import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {CatalogueCard} from "../../src/components/catalogue/catalogue-card";
import {
  CatalogueExplorer,
  filterCatalogueRecords
} from "../../src/components/catalogue/catalogue-explorer";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";

const labels = {
  heading: "Explore Weapons",
  searchLabel: "Search Weapons",
  searchPlaceholder: "Search by name or fact",
  allFilterLabel: "All",
  resultLabel: "records shown"
};

describe("CatalogueCard", () => {
  it("renders inline ammunition facts at a stable record anchor without inventing a detail link", () => {
    const ammo = getCatalogueRecords("ammo").find((record) => record.slug === "5-56x45mm");
    expect(ammo).toBeDefined();

    const html = renderToStaticMarkup(<CatalogueCard locale="en" record={ammo!} />);

    expect(html).toContain('id="record-ammo-5-56x45mm"');
    expect(html).toContain("Base damage");
    expect(html).toContain("28");
    expect(html).not.toContain("href=");
  });

  it("keeps planned vehicles addressable without linking to a missing detail route", () => {
    const bobcat = getCatalogueRecords("vehicles").find((record) => record.slug === "bobcat");
    expect(bobcat).toBeDefined();

    const html = renderToStaticMarkup(<CatalogueCard locale="en" record={bobcat!} />);

    expect(html).toContain('id="record-vehicles-bobcat"');
    expect(html).not.toContain("href=");
  });

  it("links only published records that supply an exact detail URL", () => {
    const planned = getCatalogueRecords("weapons")[0];
    const published = {
      ...planned,
      slug: "mortar",
      name: "Mortar",
      detailStatus: "published" as const,
      detailHref: "/items/weapons/mortar" as const
    };

    const html = renderToStaticMarkup(<CatalogueCard locale="en" record={published} />);

    expect(html).toContain('href="/en/items/weapons/mortar"');
    expect(html).not.toContain('href="/items/weapons/mortar"');
  });

  it("uses the English model route from every non-English category card", () => {
    const ak74 = getCatalogueRecords("weapons").find((record) => record.slug === "ak74");
    expect(ak74).toBeDefined();

    for (const locale of ["ru", "de", "pt-br"] as const) {
      const html = renderToStaticMarkup(<CatalogueCard locale={locale} record={ak74!} />);

      expect(html).toContain('href="/en/items/weapons/ak74"');
      expect(html).not.toContain(`href="/${locale}/items/weapons/ak74"`);
    }
  });

  it("can eagerly load a card image reused by the category hero", () => {
    const ammo = getCatalogueRecords("ammo").find((record) => record.slug === "5-56x45mm");

    const html = renderToStaticMarkup(<CatalogueCard eagerImage locale="en" record={ammo!} />);

    expect(html).toContain('loading="eager"');
  });
});

describe("CatalogueExplorer", () => {
  it("renders every record into initial server markup", () => {
    const records = getCatalogueRecords("weapons");
    const html = renderToStaticMarkup(
      <CatalogueExplorer locale="en" records={records} filters={[{label: "Assault rifle", value: "assault-rifle"}]} labels={labels} />
    );

    expect(html.match(/data-catalogue-record=/g)).toHaveLength(14);
    expect(html).toContain('id="record-weapons-ak74"');
    expect(html).toContain('aria-label="Search Weapons"');
    expect(html).toContain(">All</button>");
    expect(html).not.toContain("?filter=");
    expect(html).not.toContain("?search=");
  });

  it("filters by approved category value and accessible text without mutating the supplied records", () => {
    const records = getCatalogueRecords("weapons");

    expect(filterCatalogueRecords(records, "", "assault-rifle")).toHaveLength(6);
    expect(filterCatalogueRecords(records, "AK74", "all").map((record) => record.slug)).toEqual(["ak74"]);
    expect(filterCatalogueRecords(records, "5.45x39mm", "assault-rifle").map((record) => record.slug)).toEqual(["ak74"]);
    expect(records).toHaveLength(14);
  });
});
