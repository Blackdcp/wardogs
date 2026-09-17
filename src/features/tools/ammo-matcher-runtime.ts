import type {AmmoMatchResult, AmmoMatcherDataset} from "./ammo-matcher-data";

export function matchAmmoDataset(
  dataset: AmmoMatcherDataset,
  query: {weapon?: string | null; ammo?: string | null},
): AmmoMatchResult {
  const selectedWeapon = dataset.weapons.find(({slug}) => slug === query.weapon) ?? null;
  const selectedAmmo = dataset.ammo.find(({slug}) => slug === query.ammo) ?? null;
  const ammoMatches = selectedWeapon
    ? dataset.relationships
      .filter(({weaponSlug}) => weaponSlug === selectedWeapon.slug)
      .flatMap((relationship) => {
        const ammunition = dataset.ammo.find(({slug}) => slug === relationship.ammoSlug);
        return ammunition ? [{...ammunition, ...relationship}] : [];
      })
    : [];
  const weaponMatches = selectedAmmo
    ? dataset.relationships
      .filter(({ammoSlug}) => ammoSlug === selectedAmmo.slug)
      .flatMap((relationship) => {
        const weapon = dataset.weapons.find(({slug}) => slug === relationship.weaponSlug);
        return weapon ? [{...weapon, ...relationship}] : [];
      })
    : [];

  return {selectedWeapon, selectedAmmo, ammoMatches, weaponMatches};
}
