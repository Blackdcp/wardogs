import {describe, expect, it} from "vitest";
import {catalogueRecords, getCatalogueRecord} from "../../src/features/catalogue/catalogue-records";
import {auditCatalogueVisualCoverage} from "../../src/features/catalogue/visual-coverage";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {CatalogueCard} from "../../src/components/catalogue/catalogue-card";
import {getCatalogueGroup} from "../../src/features/catalogue/catalogue-groups";
import {CatalogueBuildNotice} from "../../src/components/catalogue/catalogue-build-notice";

describe("catalogue coverage from supplied item art", () => {
  it("lists the previously missing catalogue families with object images", () => {
    const required = [
      ["vehicles", "z20-lakota"],
      ["vehicles", "z20-lakota-miniguns"],
      ["gear", "large-tac-vest"],
      ["gear", "sport-parachute"],
      ["attachments", "ak74-75-rnd-drum-magazine"],
      ["attachments", "m249-200-rnd-box"],
      ["equipment", "m18-signal-grenade-alert"],
      ["equipment", "halligan-bar"],
    ] as const;
    for (const [type, slug] of required) {
      const record = getCatalogueRecord(type, slug);
      expect(record, `${type}/${slug}`).toBeDefined();
      expect(record?.image, `${type}/${slug}`).toMatch(/^\/images\/catalogue\/.+\.webp$/);
      expect(record?.mediaState, `${type}/${slug}`).not.toBe("pending");
    }
  });

  it("keeps approved object provenance and no repeated image ownership", () => {
    expect(auditCatalogueVisualCoverage()).toEqual([]);
    expect(new Set(catalogueRecords.map(({type, slug}) => `${type}/${slug}`)).size).toBe(catalogueRecords.length);
  });

  it("fills the previously blank matching equipment, medical, supply and deployable objects", () => {
    const existing = [
      ["equipment", "binoculars"], ["equipment", "rangefinder"], ["equipment", "fuel-can"], ["equipment", "battery"],
      ["medical", "stimpen"], ["medical", "enox"], ["medical", "defibrillator"],
      ["supplies", "build-supply-pallet"], ["supplies", "ammo-supply-pallet"], ["supplies", "fuel-supply-pallet"], ["supplies", "mechanical-supply-pallet"],
      ["deployables", "improvised-explosive-device"], ["deployables", "at-mine"], ["deployables", "claymore"],
    ] as const;
    for (const [type, slug] of existing) {
      expect(getCatalogueRecord(type, slug)?.image, `${type}/${slug}`).toMatch(/\.webp$/);
    }
  });

  it("renders dark transparent imported objects on a contrasting card surface", () => {
    const vest = getCatalogueRecord("gear", "large-tac-vest")!;
    const html = renderToStaticMarkup(React.createElement(CatalogueCard, {locale: "en", record: vest}));
    expect(html).toContain('data-media-surface="contrast"');
  });

  it("exposes filters for the new gear and field-equipment families", () => {
    expect(getCatalogueGroup("gear")?.filters.map(({value}) => value)).toEqual(expect.arrayContaining(["vest", "parachute"]));
    expect(getCatalogueGroup("equipment")?.filters.map(({value}) => value)).toEqual(expect.arrayContaining(["tactical", "medical", "recon", "vehicle-tool", "building", "misc"]));
  });

  it("describes the mixed-source catalogue honestly in every language", () => {
    for (const locale of ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const) {
      const html = renderToStaticMarkup(React.createElement(CatalogueBuildNotice, {locale}));
      expect(html, locale).not.toMatch(/rather than competitor|statt unpassender oder fremder|не чужое|sem usar arte incorreta|他サイトの画像|竞争对手素材/i);
    }
    const binoculars = getCatalogueRecord("equipment", "binoculars")!;
    expect(binoculars.sourceNotes.join(" ")).toMatch(/community catalogue image/i);
  });
});
