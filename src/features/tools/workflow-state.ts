import {z} from "zod";
import type {AmmoRelationship} from "./ammo-matcher-data";

export const toolSchemaVersion = 2;
export const toolDataVersion = "tools-2026-09-30-v2";
export const maximumPlanLines = 50;
export const maximumToolShareLength = 8_000;

export function isToolShareWithinLimit(value: string) {
  return value.replace(/^\?/, "").length <= maximumToolShareLength;
}
const amount = z.number().finite().min(0).max(1_000_000).refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.00001);
const quantity = z.number().int().min(1).max(10_000);

export const purchaseLineSchema = z.object({
  id: z.string().min(1).max(160),
  quantity,
  unit: z.enum(["unknown", "item", "pack", "round"]),
  unitPrice: amount.nullable(),
  frequency: z.enum(["repeat", "once"]),
  unitWeight: amount.nullable().optional(),
  pairedWeapon: z.string().max(160).optional(),
  fit: z.enum(["unknown", "confirmed", "incompatible"]).optional(),
});
export type PurchaseLine = z.infer<typeof purchaseLineSchema>;

export const supplyLineSchema = z.object({
  name: z.string().trim().min(1).max(100),
  quantity,
  supplies: amount.nullable(),
  stage: z.string().min(1).max(50),
});
export type SupplyLine = z.infer<typeof supplyLineSchema>;

export const supplyPlanSchema = z.object({
  demand: amount.nullable(),
  stock: amount,
  capacity: amount.nullable(),
  resource: z.string().trim().max(60),
  lines: z.array(supplyLineSchema).max(maximumPlanLines),
});
export type SupplyPlan = z.infer<typeof supplyPlanSchema>;
export const emptySupplyPlan: SupplyPlan = {demand: null, stock: 0, capacity: null, resource: "", lines: []};

export function readJsonParam<T>(params: URLSearchParams, key: string, schema: z.ZodType<T>): T | null {
  const values = params.getAll(key);
  if (values.length !== 1 || values[0].length > 24_000) return null;
  try {
    const result = schema.safeParse(JSON.parse(values[0]));
    return result.success ? result.data : null;
  } catch { return null; }
}

export const purchaseLinesSchema = z.array(purchaseLineSchema).max(maximumPlanLines).refine((lines) => new Set(lines.map(({id}) => id)).size === lines.length);

export function dataFingerprint(data: unknown): string {
  const text = JSON.stringify(data);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
  return `${toolDataVersion}-${(hash >>> 0).toString(16)}`;
}

export function stampToolState(params: URLSearchParams, dataVersion = toolDataVersion) {
  params.set("schema", String(toolSchemaVersion));
  params.set("dataVersion", dataVersion);
  params.set("createdAt", new Date().toISOString());
  return params.toString();
}

export function inspectToolState(value: string, currentVersion = toolDataVersion) {
  const params = new URLSearchParams(value.replace(/^\?/, ""));
  if (!value) return {status: "new" as const, dataVersion: null};
  if (!params.has("schema")) return {status: "legacy" as const, dataVersion: null};
  if (params.getAll("schema").length !== 1 || params.get("schema") !== String(toolSchemaVersion)) return {status: "unsupported" as const, dataVersion: null};
  if (params.getAll("dataVersion").length !== 1 || !params.get("dataVersion")) return {status: "unsupported" as const, dataVersion: null};
  return {status: params.get("dataVersion") === currentVersion ? "current" as const : "changed" as const, dataVersion: params.get("dataVersion")};
}

export function hasInvalidSelection(search: string, key: string, allowed: readonly string[]) {
  const values = new URLSearchParams(search).getAll(key);
  return values.length > 1 || (values.length === 1 && !allowed.includes(values[0]));
}

export function totalPurchases(lines: readonly PurchaseLine[], knownIds: readonly string[]) {
  const known = new Set(knownIds);
  let repeatCents = 0;
  let onceCents = 0;
  let unknown = 0;
  for (const line of lines) {
    if (!known.has(line.id) || line.unitPrice === null || line.unit === "unknown" || !purchaseLineSchema.safeParse(line).success) {
      unknown++;
      continue;
    }
    const cents = Math.round(line.unitPrice * 100) * line.quantity;
    if (line.frequency === "once") onceCents += cents;
    else repeatCents += cents;
  }
  return {repeat: repeatCents / 100, once: onceCents / 100, unknown, complete: unknown === 0};
}

export function findPurchaseAmmoRelationship(relationships: readonly AmmoRelationship[], weaponId: string, ammoId: string) {
  return relationships.find((relationship) => `weapons/${relationship.weaponSlug}` === weaponId && `ammo/${relationship.ammoSlug}` === ammoId) ?? null;
}

export function calculatePurchases(cash: number, reserve: number, repeat: number | null, once: number) {
  if (repeat === null || [cash, reserve, repeat, once].some((value) => !Number.isFinite(value) || value < 0)) return null;
  const [cashCents, reserveCents, repeatCents, onceCents] = [cash, reserve, repeat, once].map((value) => Math.round(value * 100));
  const available = cashCents - reserveCents - onceCents;
  const purchases = available < 0 ? 0 : repeatCents === 0 ? null : Math.floor(available / repeatCents);
  const remaining = (cashCents - onceCents - repeatCents) / 100;
  return {spent: (onceCents + repeatCents) / 100, remaining, reserveMet: remaining >= reserve, purchases, replacements: purchases === null ? null : Math.max(0, purchases - 1)};
}

export function calculateSupplyPlan(plan: SupplyPlan) {
  const valid = supplyPlanSchema.safeParse(plan).success;
  const unknown = plan.lines.filter(({supplies}) => supplies === null).length;
  const manifest = plan.lines.reduce((sum, line) => sum + Math.round((line.supplies ?? 0) * 100) * line.quantity, 0) / 100;
  const complete = valid && !unknown && (plan.lines.length > 0 || plan.demand !== null) && plan.resource.trim().length > 0;
  const demand = complete ? manifest + (plan.demand ?? 0) : null;
  const remaining = demand === null ? null : Math.max(0, Math.round((demand - plan.stock) * 100) / 100);
  const trips = remaining === 0 ? 0 : remaining === null || plan.capacity === null || plan.capacity <= 0 ? null : Math.ceil(Math.round(remaining * 100) / Math.round(plan.capacity * 100));
  return {manifest, unknown, demand, remaining, trips};
}
