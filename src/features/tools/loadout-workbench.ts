import type {LoadoutCatalogue} from "./loadout-catalogue";
import {decodeBudgetState, type BudgetState} from "./share-state";
import {findPurchaseAmmoRelationship, isToolShareWithinLimit, purchaseLineSchema, type PurchaseLine} from "./workflow-state";

export function totalLoadoutWeight(lines: readonly PurchaseLine[], knownIds: readonly string[]) {
  const known = new Set(knownIds);
  let grams = 0;
  let unknown = 0;
  for (const line of lines) {
    if (!known.has(line.id) || line.unitWeight == null || line.unit === "unknown" || !purchaseLineSchema.safeParse(line).success) { unknown++; continue; }
    grams += Math.round(line.unitWeight * 1_000) * line.quantity;
  }
  return {kilograms: grams / 1_000, unknown, complete: lines.length > 0 && unknown === 0};
}

export type FitStatus = "unpaired" | "missing-weapon" | "current-match" | "historical-match" | "historical-mismatch" | "unknown" | "user-confirmed" | "user-incompatible";
export function checkLoadoutFit(line: PurchaseLine, lines: readonly PurchaseLine[], catalogue: LoadoutCatalogue): FitStatus {
  if (!line.pairedWeapon) return "unpaired";
  if (!lines.some(({id}) => id === line.pairedWeapon && id.startsWith("weapons/")) || !catalogue.items.some(({id, type}) => id === line.pairedWeapon && type === "weapons")) return "missing-weapon";
  if (line.id.startsWith("attachments/")) return line.fit === "confirmed" ? "user-confirmed" : line.fit === "incompatible" ? "user-incompatible" : "unknown";
  if (!line.id.startsWith("ammo/")) return "unknown";
  const match = findPurchaseAmmoRelationship(catalogue.relationships, line.pairedWeapon, line.id);
  if (match) return match.state === "current" ? "current-match" : match.state === "historical" ? "historical-match" : "unknown";
  // Only explicit calibre records can establish a historical mismatch. Absence is not incompatibility.
  const ammoCalibre = catalogue.items.find(({id, type}) => id === line.id && type === "ammo")?.calibreKey;
  const weaponCalibre = catalogue.items.find(({id, type}) => id === line.pairedWeapon && type === "weapons")?.calibreKey;
  return ammoCalibre && weaponCalibre && ammoCalibre !== weaponCalibre ? "historical-mismatch" : "unknown";
}

export const loadoutStorageKey = "wardogs-loadout-workbench-v1";
export type SavedLoadout = {id: string; name: string; query: string; savedAt: string};
export function readSavedLoadouts(value: string | null): SavedLoadout[] {
  if (!value || value.length > 120_000) return [];
  try {
    const data: unknown = JSON.parse(value);
    if (!Array.isArray(data)) return [];
    return data.slice(0, 12).filter((entry): entry is SavedLoadout => Boolean(entry && typeof entry === "object"
      && typeof entry.id === "string" && entry.id.length <= 100
      && typeof entry.name === "string" && entry.name.trim().length > 0 && entry.name.length <= 60
      && typeof entry.savedAt === "string" && Number.isFinite(Date.parse(entry.savedAt))
      && typeof entry.query === "string" && isToolShareWithinLimit(entry.query) && decodeBudgetState(entry.query)));
  } catch { return []; }
}

export function restoreSavedLoadout(entry: SavedLoadout): BudgetState | null {
  return decodeBudgetState(entry.query);
}
