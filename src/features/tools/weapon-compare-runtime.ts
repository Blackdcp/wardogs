import type {
  ComparableWeapon,
  WeaponComparison,
  WeaponComparisonValue,
} from "./weapon-compare-data";

function unknownValue(build: string, verifiedAt: string): WeaponComparisonValue {
  return {value: null, state: "unknown", build, verifiedAt, sourceClass: null};
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
      left: leftField ?? unknownValue(rightField?.build ?? "Unknown", rightField?.verifiedAt ?? "Unknown"),
      right: rightField ?? unknownValue(leftField?.build ?? "Unknown", leftField?.verifiedAt ?? "Unknown"),
    };
  });

  return {left, right, rows};
}
