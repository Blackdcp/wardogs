import {describe, expect, it} from "vitest";
import {catalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {
  getCatalogueFreshness,
  getIndexableCatalogueItems,
  isCurrentDecisionSafe,
  seasonOneChanges
} from "../../src/features/catalogue/catalogue-evidence";
import {getItemBySlug, getIndexableItemPaths, itemLibrary} from "../../src/features/items/item-library";
import {vehicleItems} from "../../src/features/items/vehicle-items";
import {weaponItems} from "../../src/features/items/weapon-items";

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

describe("catalogue evidence", () => {
  it("normalizes evidence for every catalogue record without promoting Alpha or Closed Beta observations", () => {
    expect(catalogueRecords).toHaveLength(131);

    for (const record of catalogueRecords) {
      expect(record.evidence.verifiedAt, record.slug).toMatch(isoDate);
      expect(record.evidence.build, record.slug).toBe(record.dataAsOf);
      expect(record.evidence.current, record.slug).toBe(false);
      expect(getCatalogueFreshness(record), record.slug).toBe("historical");
      expect(isCurrentDecisionSafe(record), record.slug).toBe(false);
    }
  });

  it("keeps official Season 1 changes alongside historical observations", () => {
    const ural = catalogueRecords.find((record) => record.slug === "ural");
    const duneBuggy = catalogueRecords.find((record) => record.slug === "dune-buggy");
    const kodiakPickup = catalogueRecords.find((record) => record.slug === "kodiak-pickup");
    const deagle = catalogueRecords.find((record) => record.slug === "deagle");

    expect(ural?.changeHistory).toContainEqual(expect.objectContaining({field: "Unlock", previousValue: "$50,000", currentValue: "$35,000"}));
    expect(duneBuggy?.changeHistory).toContainEqual(expect.objectContaining({field: "Unlock", previousValue: "$35,000", currentValue: "$25,000"}));
    expect(kodiakPickup?.changeHistory).toContainEqual(expect.objectContaining({field: "Required level", previousValue: "2", currentValue: "10"}));
    expect(deagle?.changeHistory).toContainEqual(expect.objectContaining({field: "Required level", previousValue: "90", currentValue: "85"}));
    expect(ural?.facts).toContainEqual({label: "Alpha price", value: "$5,000"});

    expect(seasonOneChanges.map(({entity, previousValue, currentValue}) => ({entity, previousValue, currentValue}))).toEqual([
      {entity: "FOB vendor", previousValue: "$2,500", currentValue: "$7,500"},
      {entity: "Large Hammer vendor", previousValue: "$1,600", currentValue: "$2,400"},
      {entity: "Large Hammer Support unlock", previousValue: "$25,000", currentValue: "$75,000"},
      {entity: "Artillery Tank career unlock", previousValue: "$400,000", currentValue: "$500,000"},
      {entity: "Artillery Tank required career level", previousValue: "55", currentValue: "90"},
      {entity: "Z20 Lakota Pilot unlock", previousValue: "$50,000", currentValue: "$35,000"},
      {entity: "URAL unlock", previousValue: "$50,000", currentValue: "$35,000"},
      {entity: "URAL required level", previousValue: "4", currentValue: "3"},
      {entity: "Dune Buggy unlock", previousValue: "$35,000", currentValue: "$25,000"},
      {entity: "Dune Buggy required level", previousValue: "10", currentValue: "8"},
      {entity: "Kodiak Flatbed unlock", previousValue: "$15,000", currentValue: "$35,000"},
      {entity: "Kodiak Flatbed required level", previousValue: "2", currentValue: "10"},
      {entity: "Sports Parachute required level", previousValue: "36", currentValue: "35"},
      {entity: "Large Backpack required level", previousValue: "56", currentValue: "55"},
      {entity: "Deagle required level", previousValue: "90", currentValue: "85"},
    ]);
    expect(seasonOneChanges.some((change) => change.entity === "Artillery Tank career unlock" && change.catalogueKey === undefined)).toBe(true);
  });

  it("indexes only authored weapon and vehicle detail pages", () => {
    const indexableRecords = getIndexableCatalogueItems();
    const indexableKeys = new Set(indexableRecords.map((record) => `${record.type}/${record.slug}`));

    expect(indexableKeys).toContain("weapons/a-91");
    expect(indexableKeys).toContain("vehicles/ural");
    expect(indexableKeys).not.toContain("weapons/m4");
    expect(indexableKeys).not.toContain("weapons/m12g");
    expect(indexableKeys).not.toContain("vehicles/m113-apc-sv-variant-1");

    expect(getItemBySlug("a-91")?.indexable).toBe(true);
    expect(getItemBySlug("ural")?.indexable).toBe(true);
    expect(getItemBySlug("m4")?.indexable).toBe(false);
    expect(getItemBySlug("mortar")?.indexable).toBe(true);
    expect(getIndexableItemPaths()).toHaveLength(itemLibrary.filter((item) => item.indexable).length * 6);

    for (const authoredItem of [...weaponItems, ...vehicleItems]) {
      const item = getItemBySlug(authoredItem.slug);
      expect(item?.indexable, authoredItem.slug).toBe(true);
      expect(item?.indexLocales, authoredItem.slug).toEqual(["en", "ru", "de", "pt-br", "ja", "zh-cn"]);
    }
  });
});
