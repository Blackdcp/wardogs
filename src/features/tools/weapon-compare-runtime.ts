import type {
  ComparableWeapon,
  WeaponComparison,
  WeaponComparisonValue,
  WeaponComparisonRow,
} from "./weapon-compare-data";

export function comparisonRowDiffers(row: WeaponComparisonRow): boolean {
  return row.left.value !== row.right.value || row.left.state !== row.right.state || row.left.build !== row.right.build;
}

export function searchComparableWeapons(weapons: readonly ComparableWeapon[], query: string, subtype = "") {
  const text = query.trim().toLocaleLowerCase();
  return weapons.filter((weapon) => (!subtype || weapon.subtype === subtype) && `${weapon.name} ${weapon.slug} ${weapon.subtype}`.toLocaleLowerCase().includes(text));
}

function unknownValue(): WeaponComparisonValue {
  return {
    value: null,
    state: "unknown",
    build: null,
    verifiedAt: null,
    sourceClass: null,
    confidence: null,
  };
}

export function compareWeaponOptions(
  weapons: readonly ComparableWeapon[],
  leftSlug: string,
  rightSlug: string,
): WeaponComparison | null {
  if (leftSlug === rightSlug) return null;
  const left = weapons.find(({slug}) => slug === leftSlug);
  const right = weapons.find(({slug}) => slug === rightSlug);
  if (!left || !right) return null;

  const keys = [...new Set([...left.fields, ...right.fields].map(({key}) => key))];
  const rows = keys.map((key) => {
    const leftField = left.fields.find((field) => field.key === key);
    const rightField = right.fields.find((field) => field.key === key);
    return {
      key,
      label: leftField?.label ?? rightField?.label ?? key,
      left: leftField ?? unknownValue(),
      right: rightField ?? unknownValue(),
    };
  });

  return {left, right, rows};
}
