import type {AttachmentCompatibility} from "./equipment-compatibility";

export type CompatibilitySelection = {weapon: string; kind: "all" | "magazine" | "optic"; query: string; namedOnly: boolean};
export const defaultCompatibilitySelection: CompatibilitySelection = {weapon: "", kind: "all", query: "", namedOnly: false};

export function decodeCompatibilitySelection(search: string, weaponIds: readonly string[]) {
  const params = new URLSearchParams(search);
  const requestedWeapon = params.get("fitWeapon") ?? "";
  const requestedKind = params.get("fitKind") ?? "all";
  return {
    invalid: Boolean(requestedWeapon && !weaponIds.includes(requestedWeapon)) || !["all", "magazine", "optic"].includes(requestedKind),
    selection: {
      weapon: weaponIds.includes(requestedWeapon) ? requestedWeapon : "",
      kind: requestedKind === "magazine" || requestedKind === "optic" ? requestedKind : "all",
      query: (params.get("fitQuery") ?? "").slice(0, 120),
      namedOnly: params.get("fitNamed") === "1" && weaponIds.includes(requestedWeapon),
    } as CompatibilitySelection,
  };
}

export function writeCompatibilitySelection(url: URL, selection: CompatibilitySelection) {
  for (const key of ["fitWeapon", "fitKind", "fitQuery", "fitNamed"]) url.searchParams.delete(key);
  if (selection.weapon) url.searchParams.set("fitWeapon", selection.weapon);
  if (selection.kind !== "all") url.searchParams.set("fitKind", selection.kind);
  if (selection.query) url.searchParams.set("fitQuery", selection.query.slice(0, 120));
  if (selection.weapon && selection.namedOnly) url.searchParams.set("fitNamed", "1");
  url.hash = "equipment-compatibility";
  return url;
}

export function filterCompatibilityEntries(entries: readonly AttachmentCompatibility[], selection: CompatibilitySelection) {
  const needle = selection.query.trim().toLocaleLowerCase();
  return entries.filter((entry) =>
    (selection.kind === "all" || entry.kind === selection.kind) &&
    (!needle || entry.name.toLocaleLowerCase().includes(needle)) &&
    (!selection.namedOnly || entry.namedWeapons.includes(selection.weapon))
  ).toSorted((left, right) => Number(right.namedWeapons.includes(selection.weapon)) - Number(left.namedWeapons.includes(selection.weapon)));
}
