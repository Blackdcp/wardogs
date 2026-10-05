import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {locales} from "../../src/config/site";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";

// The real next-intl navigation package requires a Next runtime; keep the hub and cards real.
vi.mock("@/i18n/navigation", () => ({Link: ({children, ...props}: {children: React.ReactNode}) => React.createElement("a", props, children)}));

const modulePath = "../../src/features/catalogue/catalogue-hub-data";
describe("catalogue hub and home models", () => {
  it.each(locales)("keeps the full categories and published evidence-backed previews in %s", async (locale) => {
    const modelModule = await import(modulePath).catch(() => undefined);
    expect(modelModule, "Catalogue model builder must exist").toBeDefined();
    const hub = modelModule!.buildCatalogueHubModel(locale);
    expect(hub.href).toBe("/items");
    expect(hub.categories.map((category: {id: string}) => category.id)).toEqual(["weapons", "vehicles", "ammo", "attachments", "gear", "equipment", "medical", "supplies", "deployables", "mechanics", "loadouts"]);
    expect(hub.previews.weapons.map((record: {slug: string}) => record.slug)).toEqual(["a-91", "amp-9", "compound-bow"]);
    expect(hub.previews.vehicles.map((record: {slug: string}) => record.slug)).toEqual(["bobcat", "l2a6", "uh-1y"]);
    expect(hub.featured).toHaveLength(6);
    for (const record of [...hub.previews.weapons, ...hub.previews.vehicles]) {
      expect(record.detailStatus).toBe("published");
      expect(record.detailHref).toBeTruthy();
      expect(record.image).toBeTruthy();
      expect(record.imageAlt).toBeTruthy();
      expect(record.href).toBe(`/${locale}${record.detailHref}`);
      const original = getCatalogueRecords(record.type).find((entry) => entry.slug === record.slug)!;
      expect(record.evidence).toEqual(original.evidence);
      expect(record.changeHistory).toEqual(original.changeHistory);
    }
  });
  it("keeps all category and published entity links visible and tracked in the full hub", async () => {
    const componentPath = "../../src/components/catalogue/catalogue-hub";
    const {CatalogueHub} = await import(componentPath);
    const html = renderToStaticMarkup(React.createElement(CatalogueHub, {locale: "ja"}));
    expect(html.match(/data-catalogue-category=/g)).toHaveLength(11);
    expect(html.match(/data-catalogue-preview=/g)).toHaveLength(6);
    for (const href of ["/items/weapons", "/items/vehicles", "/items/ammo", "/items/attachments", "/items/gear", "/items/equipment", "/items/medical", "/items/supplies", "/items/deployables", "/items/mechanics", "/items/loadouts"]) {
      expect(html).toContain(`data-discovery-target="${href}"`);
    }
  });
  it.each(locales)("provides the exact hub, weapons and vehicles destinations with at most four previews in %s", async (locale) => {
    const modelModule = await import(modulePath).catch(() => undefined);
    expect(modelModule, "Catalogue home model builder must exist").toBeDefined();
    const home = modelModule!.buildCatalogueHomeModel(locale);
    expect(home.destinations.map((entry: {href: string}) => entry.href)).toEqual(["/items", "/items/weapons", "/items/vehicles"]);
    expect(home.categories.map((category: {id: string}) => category.id)).toEqual(["weapons", "vehicles"]);
    expect(home.previews).toHaveLength(4);
    expect(home.previews.every((record: {detailStatus: string}) => record.detailStatus === "published")).toBe(true);
    expect(home.previews.some((record: {slug: string}) => record.slug === "vanguard-ciws")).toBe(false);
  });
});
