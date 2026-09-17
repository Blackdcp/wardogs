import type {Locale} from "@/config/site";
import {getCatalogueFreshness, getIndexableCatalogueItems} from "@/features/catalogue/catalogue-evidence";
import {getLocalizedCatalogueRecords} from "@/features/catalogue/catalogue-localization";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import type {CatalogueEvidence, CatalogueRecord} from "@/features/catalogue/catalogue-types";
import {matchAmmoDataset} from "./ammo-matcher-runtime";

export {matchAmmoDataset} from "./ammo-matcher-runtime";

export type AmmoMatcherOption = {
  slug: string;
  name: string;
  subtype: string;
  image: string;
  imageAlt: string;
  summary: string;
  href?: string;
  state: "current" | "historical" | "unknown";
  build: string;
  verifiedAt: string;
  sourceClass: CatalogueEvidence["sourceClass"];
  confidence: CatalogueEvidence["confidence"];
};

export type AmmoRelationship = {
  weaponSlug: string;
  ammoSlug: string;
  relationshipValue: string;
  state: "current" | "historical" | "unknown";
  build: string;
  verifiedAt: string;
  sourceClass: CatalogueEvidence["sourceClass"];
  confidence: CatalogueEvidence["confidence"];
};

export type AmmoMatcherDataset = {
  weapons: readonly AmmoMatcherOption[];
  ammo: readonly AmmoMatcherOption[];
  relationships: readonly AmmoRelationship[];
};

export type AmmoMatch = AmmoMatcherOption & AmmoRelationship;

export type AmmoMatchResult = {
  selectedWeapon: AmmoMatcherOption | null;
  selectedAmmo: AmmoMatcherOption | null;
  ammoMatches: readonly AmmoMatch[];
  weaponMatches: readonly AmmoMatch[];
};

function explicitAmmoValue(record: CatalogueRecord) {
  const value = record.facts.find(({label}) => label === "Ammunition")?.value;
  if (!value || /Not captured|Not confirmed|Identifier only/.test(value)) return null;
  return value;
}

function toOption(base: CatalogueRecord, localized: CatalogueRecord, href?: string): AmmoMatcherOption {
  if (!base.image || !localized.imageAlt) {
    throw new Error(`Ammo matcher requires verified media: ${base.type}/${base.slug}`);
  }
  return {
    slug: base.slug,
    name: localized.name,
    subtype: localized.subtype,
    image: base.image,
    imageAlt: localized.imageAlt,
    summary: localized.summary,
    href,
    state: getCatalogueFreshness(base),
    build: base.evidence.build,
    verifiedAt: base.evidence.verifiedAt,
    sourceClass: base.evidence.sourceClass,
    confidence: base.evidence.confidence,
  };
}

export function getAmmoMatcherDataset(locale: Locale = "en"): AmmoMatcherDataset {
  const weaponRecords = getCatalogueRecords("weapons").filter((record) =>
    record.evidenceTier !== "identifier-only" && explicitAmmoValue(record) !== null
  );
  const ammoRecords = getCatalogueRecords("ammo").filter((record) => record.evidenceTier !== "identifier-only");
  const localizedWeapons = new Map(getLocalizedCatalogueRecords(weaponRecords, locale).map((record) => [record.slug, record]));
  const localizedAmmo = new Map(getLocalizedCatalogueRecords(ammoRecords, locale).map((record) => [record.slug, record]));
  const ammoByName = new Map(ammoRecords.map((record) => [record.name, record]));
  const indexableKeys = new Set(getIndexableCatalogueItems().map((record) => `${record.type}/${record.slug}`));
  const weapons = weaponRecords.map((record) => toOption(
    record,
    localizedWeapons.get(record.slug) ?? record,
    indexableKeys.has(`weapons/${record.slug}`) ? `/items/weapons/${record.slug}` : undefined,
  ));
  const ammo = ammoRecords.map((record) => toOption(record, localizedAmmo.get(record.slug) ?? record));
  const relationships = weaponRecords.flatMap((weapon): AmmoRelationship[] => {
    const relationshipValue = explicitAmmoValue(weapon);
    const ammunition = relationshipValue ? ammoByName.get(relationshipValue) : undefined;
    if (!relationshipValue || !ammunition) return [];
    return [{
      weaponSlug: weapon.slug,
      ammoSlug: ammunition.slug,
      relationshipValue,
      state: getCatalogueFreshness(weapon),
      build: weapon.evidence.build,
      verifiedAt: weapon.evidence.verifiedAt,
      sourceClass: weapon.evidence.sourceClass,
      confidence: weapon.evidence.confidence,
    }];
  });

  return {
    weapons: weapons.sort((left, right) => left.name.localeCompare(right.name, locale)),
    ammo: ammo.sort((left, right) => left.name.localeCompare(right.name, locale)),
    relationships,
  };
}

export function getAmmoMatches(
  query: {weapon?: string | null; ammo?: string | null},
  locale: Locale = "en",
): AmmoMatchResult {
  return matchAmmoDataset(getAmmoMatcherDataset(locale), query);
}
