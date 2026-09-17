import type {Locale} from "@/config/site";
import {getCatalogueFreshness, getIndexableCatalogueItems} from "@/features/catalogue/catalogue-evidence";
import {getLocalizedCatalogueRecords} from "@/features/catalogue/catalogue-localization";
import type {CatalogueChangeHistory, CatalogueEvidence, CatalogueRecord} from "@/features/catalogue/catalogue-types";
import {getItemByTypeAndSlug} from "@/features/items/item-library";
import {getLocalizedItem} from "@/features/items/item-localization";
import {compareWeaponOptions} from "./weapon-compare-runtime";

export {compareWeaponOptions} from "./weapon-compare-runtime";

export type ToolEvidenceState = "current" | "historical" | "unknown";

export type WeaponComparisonValue = {
  value: string | null;
  state: ToolEvidenceState;
  build: string | null;
  verifiedAt: string | null;
  sourceClass: CatalogueEvidence["sourceClass"] | null;
  confidence: CatalogueEvidence["confidence"] | null;
  sourceUrl?: string;
};

export type ComparableWeaponField = WeaponComparisonValue & {
  key: string;
  label: string;
};

export type ComparableWeapon = {
  slug: string;
  name: string;
  subtype: string;
  href: string;
  image: string;
  imageAlt: string;
  summary: string;
  strengths: readonly string[];
  cautions: readonly string[];
  evidenceState: ToolEvidenceState;
  fields: readonly ComparableWeaponField[];
};

export type WeaponComparisonRow = {
  key: string;
  label: string;
  left: WeaponComparisonValue;
  right: WeaponComparisonValue;
};

export type WeaponComparison = {
  left: ComparableWeapon;
  right: ComparableWeapon;
  rows: readonly WeaponComparisonRow[];
};

const factFields = [
  {key: "price", labels: ["Alpha price", "Closed Beta price"]},
  {key: "ammunition", labels: ["Ammunition"]},
  {key: "fireModes", labels: ["Fire modes"]},
  {key: "weight", labels: ["Weight"]},
  {key: "progression", labels: ["Progression"]},
] as const;

const unknownPattern = /^(Not captured|Not confirmed|Identifier only)$/;

function evidenceValue(
  value: string | null,
  record: CatalogueRecord,
  evidence = record.evidence,
  isUnknown = value === null || unknownPattern.test(value),
): WeaponComparisonValue {
  return {
    value: isUnknown ? null : value,
    state: isUnknown ? "unknown" : getCatalogueFreshness(record),
    build: evidence.build,
    verifiedAt: evidence.verifiedAt,
    sourceClass: evidence.sourceClass,
    confidence: evidence.confidence,
    sourceUrl: evidence.sourceUrl,
  };
}

function changeValue(change: CatalogueChangeHistory): WeaponComparisonValue {
  return {
    value: change.currentValue,
    state: "current",
    build: change.effectiveBuild,
    verifiedAt: change.verifiedAt,
    sourceClass: "official",
    confidence: "confirmed",
    sourceUrl: change.sourceUrl,
  };
}

function buildComparableWeapon(base: CatalogueRecord, localized: CatalogueRecord, locale: Locale): ComparableWeapon {
  const item = getItemByTypeAndSlug("weapons", base.slug);
  const localizedItem = item ? getLocalizedItem(item, locale) : null;
  const localizedFactByBaseLabel = new Map(
    base.facts.map((fact, index) => [fact.label, localized.facts[index]?.value ?? fact.value]),
  );
  const fields: ComparableWeaponField[] = [
    {
      key: "role",
      label: "Role",
      ...evidenceValue(localized.subtype, base),
    },
    ...factFields.map(({key, labels}) => {
      const fact = base.facts.find((candidate) => labels.some((label) => label === candidate.label));
      return {
        key,
        label: fact?.label ?? labels[0],
        ...evidenceValue(
          fact ? localizedFactByBaseLabel.get(fact.label) ?? fact.value : null,
          base,
          base.evidence,
          !fact || unknownPattern.test(fact.value),
        ),
      };
    }),
    ...base.changeHistory.map((change) => ({
      key: `change:${change.field}`,
      label: change.field,
      ...changeValue(change),
    })),
  ];

  return {
    slug: base.slug,
    name: localized.name,
    subtype: localized.subtype,
    href: base.detailHref ?? `/items/weapons/${base.slug}`,
    image: base.image,
    imageAlt: localized.imageAlt,
    summary: localized.summary,
    strengths: localizedItem?.strengths ?? [],
    cautions: localizedItem?.cautions ?? [],
    evidenceState: getCatalogueFreshness(base),
    fields,
  };
}

export function getComparableWeapons(locale: Locale = "en"): ComparableWeapon[] {
  const records = getIndexableCatalogueItems().filter((record) => record.type === "weapons");
  const localizedBySlug = new Map(
    getLocalizedCatalogueRecords(records, locale).map((record) => [record.slug, record]),
  );

  return records
    .map((record) => buildComparableWeapon(record, localizedBySlug.get(record.slug) ?? record, locale))
    .sort((left, right) => left.name.localeCompare(right.name, locale));
}

export function compareWeapons(leftSlug: string, rightSlug: string, locale: Locale = "en"): WeaponComparison | null {
  return compareWeaponOptions(getComparableWeapons(locale), leftSlug, rightSlug);
}
