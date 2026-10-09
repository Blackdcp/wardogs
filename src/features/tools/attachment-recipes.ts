import type {Locale} from "@/config/site";
import type {CatalogueEvidence} from "@/features/catalogue/catalogue-types";
import type {LoadoutCatalogue} from "./loadout-catalogue";
import {encodeBudgetState, type BudgetState} from "./share-state";
import {isToolShareWithinLimit, maximumPlanLines, type PurchaseLine} from "./workflow-state";
import {emptyAttachmentObservation, type AttachmentRecipeId} from "./attachment-observation";
import {getAttachmentRecipeCopy} from "./attachment-recipe-copy";

export const attachmentCreatorSource = {youtubeId: "kC3P-klWNxk", creator: "Evo4Fun", reviewedAt: "2026-10-09", url: "https://www.youtube.com/watch?v=kC3P-klWNxk"} as const;
export type AttachmentKind = "magazine" | "optic" | "grip" | "muzzle";
const records = [
  {slug: "creator-rvg", name: "RVG", kind: "grip", seconds: 91, weapons: ["m4", "ak74", "galil", "tar-21", "fal", "amp-9", "pp-19-vityaz", "mp5", "bmr-308"]},
  {slug: "creator-tdg", name: "TDG", kind: "grip", seconds: 91, weapons: ["m249-saw"]},
  {slug: "creator-afg", name: "AFG", kind: "grip", seconds: 476, weapons: ["ak74", "super-45", "bmr-308", "m500"]},
  {slug: "creator-top-comp", name: "Top Comp", kind: "muzzle", seconds: 419, weapons: ["m4", "galil", "tar-21", "m249-saw"]},
  {slug: "creator-cqb74", name: "CQB74", kind: "muzzle", seconds: 470, weapons: ["ak74"]},
  {slug: "creator-pbs4", name: "PBS4", kind: "muzzle", seconds: 488, weapons: ["ak74"]},
  {slug: "creator-hexagon-brake", name: "Hexagon", kind: "muzzle", seconds: 348, weapons: ["tar-21"]},
  {slug: "creator-dual-port", name: "Dual Port", kind: "muzzle", seconds: 596, weapons: ["amp-9", "pp-19-vityaz", "mp5", "ggx-18"]}
] as const;

export function getCreatorAttachmentRecords(locale: Locale) {
  const copy = getAttachmentRecipeCopy(locale);
  return records.map((record) => ({...record, name: `${record.name} · ${copy[record.kind]}`, evidence: {
    build: copy.buildUnknown, verifiedAt: attachmentCreatorSource.reviewedAt,
    sourceClass: "creator-current", confidence: "unverified", current: false,
    sourceUrl: `${attachmentCreatorSource.url}&t=${record.seconds}s`
  } satisfies CatalogueEvidence}));
}

export const attachmentRecipes: readonly {id: AttachmentRecipeId; weapon: string; seconds: number; attachments: readonly string[]; magazine: number}[] = [
  {id: "evo-m4-control", weapon: "m4", seconds: 452, attachments: ["creator-rvg", "creator-top-comp"], magazine: 30},
  {id: "evo-ak74-control", weapon: "ak74", seconds: 470, attachments: ["creator-rvg", "creator-cqb74", "ak74-30-rnd-magazine"], magazine: 30},
  {id: "evo-ak74-suppressed", weapon: "ak74", seconds: 488, attachments: ["creator-afg", "creator-pbs4", "ak74-30-rnd-magazine"], magazine: 30}
];

export function applyAttachmentRecipe(state: BudgetState, id: AttachmentRecipeId, catalogue: LoadoutCatalogue): {status: "applied" | "limit" | "unavailable" | "conflict"; state: BudgetState} {
  const recipe = attachmentRecipes.find((recipe) => recipe.id === id);
  if (!recipe) return {status: "unavailable", state};
  const weaponId = `weapons/${recipe.weapon}`;
  const requested: PurchaseLine[] = [weaponId, ...recipe.attachments.map((slug) => `attachments/${slug}`)].map((itemId) => ({
    id: itemId, quantity: 1, unit: "unknown", unitPrice: null, unitWeight: null, frequency: "repeat",
    ...(itemId !== weaponId ? {pairedWeapon: weaponId, fit: "unknown" as const} : {})
  }));
  if (requested.some(({id}) => !catalogue.items.some((item) => item.id === id))) return {status: "unavailable", state};
  const previous = state.lines ?? [];
  if (previous.some((line) => line.pairedWeapon && line.pairedWeapon !== weaponId && requested.some(({id}) => id === line.id && id !== weaponId))) return {status: "conflict", state};
  const lines = [...previous.map((line) => !line.pairedWeapon && requested.some(({id}) => id === line.id && id !== weaponId)
    ? {...line, pairedWeapon: weaponId, fit: "unknown" as const} : line), ...requested.filter(({id}) => !previous.some((line) => line.id === id))];
  const attachmentTest = state.attachmentTest?.recipeId === id ? state.attachmentTest : emptyAttachmentObservation(id);
  const next: BudgetState = {...state, mode: "items", lines, attachmentTest};
  if (lines.length > maximumPlanLines || !isToolShareWithinLimit(encodeBudgetState(next, catalogue.dataVersion))) return {status: "limit", state};
  return {status: "applied", state: next};
}
