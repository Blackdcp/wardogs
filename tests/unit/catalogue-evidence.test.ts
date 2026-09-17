import {describe, expect, it, vi} from "vitest";
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
import {isApprovedSourceUrl} from "../../src/content/source-policy";

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

const sourceClasses = new Set(["official", "live-client", "creator-current", "creator-historical", "community-report"]);
const confidenceLevels = new Set(["confirmed", "observed", "corroborated", "unverified"]);

const expectedSeasonOneChanges = [
  {entity: "FOB vendor", field: "Vendor price", previousValue: "$2,500", currentValue: "$7,500", progressionTrack: null, catalogueKey: "deployables/fob-vendor"},
  {entity: "Large Hammer vendor", field: "Vendor price", previousValue: "$1,600", currentValue: "$2,400", progressionTrack: null, catalogueKey: null},
  {entity: "Large Hammer Support unlock", field: "Support unlock", previousValue: "$25,000", currentValue: "$75,000", progressionTrack: "support", catalogueKey: null},
  {entity: "Artillery Tank career unlock", field: "Career unlock", previousValue: "$400,000", currentValue: "$500,000", progressionTrack: "career", catalogueKey: null},
  {entity: "Artillery Tank required career level", field: "Required career level", previousValue: "55", currentValue: "90", progressionTrack: "career", catalogueKey: null},
  {entity: "Recon 6-10x MRAD scope unlock", field: "Recon unlock", previousValue: "$25,000", currentValue: "$40,000", progressionTrack: "recon", catalogueKey: null},
  {entity: "Recon 6-10x MOA scope unlock", field: "Recon unlock", previousValue: "$30,000", currentValue: "$45,000", progressionTrack: "recon", catalogueKey: null},
  {entity: "Medium Hammer Support unlock", field: "Support unlock", previousValue: "$10,000", currentValue: "$25,000", progressionTrack: "support", catalogueKey: null},
  {entity: "Small Armored Supply Crate Pilot unlock", field: "Pilot unlock", previousValue: "$5,000", currentValue: "$10,000", progressionTrack: "pilot", catalogueKey: null},
  {entity: "Little Bird with miniguns Pilot unlock", field: "Pilot unlock", previousValue: "$25,000", currentValue: "$50,000", progressionTrack: "pilot", catalogueKey: null},
  {entity: "Z20 Lakota Pilot unlock", field: "Pilot unlock", previousValue: "$50,000", currentValue: "$35,000", progressionTrack: "pilot", catalogueKey: null},
  {entity: "URAL unlock", field: "Unlock", previousValue: "$50,000", currentValue: "$35,000", progressionTrack: "driver", catalogueKey: "vehicles/ural"},
  {entity: "Dune Buggy unlock", field: "Unlock", previousValue: "$35,000", currentValue: "$25,000", progressionTrack: "driver", catalogueKey: "vehicles/dune-buggy"},
  {entity: "Kodiak Flatbed unlock", field: "Unlock", previousValue: "$15,000", currentValue: "$35,000", progressionTrack: "driver", catalogueKey: "vehicles/kodiak-pickup"},
  {entity: "Music Tape H Driver unlock", field: "Driver unlock", previousValue: "$5,000", currentValue: "$2,500", progressionTrack: "driver", catalogueKey: null},
  {entity: "Sports Parachute required level", field: "Required level", previousValue: "36", currentValue: "35", progressionTrack: "career", catalogueKey: null},
  {entity: "Large Backpack required level", field: "Required level", previousValue: "56", currentValue: "55", progressionTrack: "career", catalogueKey: null},
  {entity: "Deagle required level", field: "Required level", previousValue: "90", currentValue: "85", progressionTrack: "career", catalogueKey: "weapons/deagle"},
  {entity: "762x54mm AP career level", field: "AP career level", previousValue: "83", currentValue: "82", progressionTrack: "career", catalogueKey: "ammo/7-62x54mmr"},
  {entity: "556mm AP career level", field: "AP career level", previousValue: "85", currentValue: "83", progressionTrack: "career", catalogueKey: "ammo/5-56x45mm"},
  {entity: "PP-19 50 round drum magazine required level", field: "Required level", previousValue: "33", currentValue: "29", progressionTrack: "medic", catalogueKey: null},
  {entity: "Large Hammer Support required level", field: "Required level", previousValue: "7", currentValue: "8", progressionTrack: "support", catalogueKey: null},
  {entity: "URAL required level", field: "Required level", previousValue: "4", currentValue: "3", progressionTrack: "driver", catalogueKey: "vehicles/ural"},
  {entity: "Kodiak Assault required level", field: "Required level", previousValue: "8", currentValue: "6", progressionTrack: "driver", catalogueKey: null},
  {entity: "Dune Buggy required level", field: "Required level", previousValue: "10", currentValue: "8", progressionTrack: "driver", catalogueKey: "vehicles/dune-buggy"},
  {entity: "Kodiak Flatbed required level", field: "Required level", previousValue: "2", currentValue: "10", progressionTrack: "driver", catalogueKey: "vehicles/kodiak-pickup"},
  {entity: "Large Supply Crate required level", field: "Required level", previousValue: "20", currentValue: "16", progressionTrack: "driver", catalogueKey: null},
  {entity: "URAL Covered required level", field: "Required level", previousValue: "30", currentValue: "18", progressionTrack: "driver", catalogueKey: null},
  {entity: "Music Tape H progression track", field: "Progression track", previousValue: "Pilot level 28", currentValue: "Driver level 23", progressionTrack: "driver", catalogueKey: null},
  {entity: "URAL Attack required level", field: "Required level", previousValue: "40", currentValue: "25", progressionTrack: "driver", catalogueKey: null},
  {entity: "Humvee with minigun required level", field: "Required level", previousValue: "35", currentValue: "30", progressionTrack: "driver", catalogueKey: null},
  {entity: "Heavy Tank progression track", field: "Progression track", previousValue: "Career level 35", currentValue: "Driver level 35", progressionTrack: "driver", catalogueKey: null},
] as const;

describe("catalogue evidence", () => {
  it("normalizes evidence for every catalogue record without promoting Alpha or Closed Beta observations", () => {
    expect(catalogueRecords).toHaveLength(160);

    for (const record of catalogueRecords) {
      expect(isCalendarDate(record.evidence.verifiedAt), record.slug).toBe(true);
      expect(record.evidence.build, record.slug).toBe(record.dataAsOf);
      expect(sourceClasses.has(record.evidence.sourceClass), record.slug).toBe(true);
      expect(confidenceLevels.has(record.evidence.confidence), record.slug).toBe(true);
      expect(record.evidence.sourceUrl === undefined || isApprovedSourceUrl(record.evidence.sourceUrl), record.slug).toBe(true);
      if (/Alpha|Beta|pre-release/i.test(`${record.dataAsOf} ${record.evidence.build}`)) {
        expect(record.evidence.current, record.slug).toBe(false);
        expect(getCatalogueFreshness(record), record.slug).toBe("historical");
        expect(isCurrentDecisionSafe(record), record.slug).toBe(false);
      } else if (record.evidence.current) {
        expect(getCatalogueFreshness(record), record.slug).toBe("current");
        expect(["official", "live-client"], record.slug).toContain(record.evidence.sourceClass);
      }
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

    expect(seasonOneChanges.map(({entity, previousValue, currentValue}) => ({entity, previousValue, currentValue}))).toEqual(expect.arrayContaining([
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
      {entity: "762x54mm AP career level", previousValue: "83", currentValue: "82"},
      {entity: "556mm AP career level", previousValue: "85", currentValue: "83"},
    ]));
    expect(seasonOneChanges).toHaveLength(32);
    expect(seasonOneChanges.some((change) => change.entity === "Artillery Tank career unlock" && change.catalogueKey === undefined)).toBe(true);
    expect(seasonOneChanges).toContainEqual(expect.objectContaining({entity: "762x54mm AP career level", previousValue: "83", currentValue: "82", catalogueKey: "ammo/7-62x54mmr"}));
    expect(seasonOneChanges).toContainEqual(expect.objectContaining({entity: "556mm AP career level", previousValue: "85", currentValue: "83", catalogueKey: "ammo/5-56x45mm"}));
    expect(catalogueRecords.find((record) => record.slug === "7-62x54mmr")?.changeHistory).toContainEqual(expect.objectContaining({previousValue: "83", currentValue: "82"}));
    expect(catalogueRecords.find((record) => record.slug === "5-56x45mm")?.changeHistory).toContainEqual(expect.objectContaining({previousValue: "85", currentValue: "83"}));
    expect(seasonOneChanges.every((change) => isCalendarDate(change.verifiedAt) && isApprovedSourceUrl(change.sourceUrl))).toBe(true);
  });

  it("matches the independently transcribed official Season 1 change table", () => {
    expect(seasonOneChanges.map((change) => ({
      entity: change.entity,
      field: change.field,
      previousValue: change.previousValue,
      currentValue: change.currentValue,
      progressionTrack: change.progressionTrack ?? null,
      catalogueKey: change.catalogueKey ?? null,
    }))).toEqual(expectedSeasonOneChanges);
  });

  it("keeps Alpha and Beta builds historical when evidence is incorrectly marked current", () => {
    const alphaRecord = catalogueRecords.find((record) => record.slug === "a-91");
    const betaRecord = catalogueRecords.find((record) => record.slug === "m4");

    expect(getCatalogueFreshness({...alphaRecord!, evidence: {...alphaRecord!.evidence, current: true}})).toBe("historical");
    expect(getCatalogueFreshness({...betaRecord!, evidence: {...betaRecord!.evidence, current: true}})).toBe("historical");
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

  it("returns the full indexable catalogue from an isolated evidence module", async () => {
    vi.resetModules();

    const {getIndexableCatalogueItems: getIsolatedIndexableCatalogueItems} = await import("../../src/features/catalogue/catalogue-evidence");

    expect(getIsolatedIndexableCatalogueItems().map((record) => `${record.type}/${record.slug}`)).toContain("weapons/a-91");
    expect(getIsolatedIndexableCatalogueItems()).toHaveLength(34);
  });
});
