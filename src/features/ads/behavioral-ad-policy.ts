import {isBehavioralAdPath, POPUNDER_COOLDOWN_MS} from "./ad-policy";

export const BEHAVIORAL_COHORT_KEY = "wardogs-behavioral-cohort-v1";
export const BEHAVIORAL_VISITS_KEY = "wardogs-behavioral-content-visits-v1";
export const SOCIAL_BAR_LOAD_KEY = "wardogs-adsterra-social-bar-loaded-at";
export const BEHAVIORAL_MIN_FOREGROUND_MS = 30_000;
export type BehavioralVariant = "social-bar" | "popunder" | "control";
type Store = Pick<Storage, "getItem" | "setItem">;

export function variantForBucket(bucket: number): BehavioralVariant {
  return bucket < 1_000 ? "social-bar" : bucket < 1_500 ? "popunder" : "control";
}

/** Assignment is persistent; malformed or unavailable storage blocks serving. */
export function getBehavioralVariant(storage: Store | null, random: () => number): BehavioralVariant | null {
  if (!storage) return null;
  try {
    const previous = storage.getItem(BEHAVIORAL_COHORT_KEY);
    if (previous !== null && !/^(?:0|[1-9]\d{0,3})$/.test(previous)) return null;
    const sample = previous === null ? random() : 0;
    if (previous === null && (!Number.isFinite(sample) || sample < 0 || sample >= 1)) return null;
    const bucket = previous === null ? Math.floor(sample * 10_000) : Number(previous);
    storage.setItem(BEHAVIORAL_COHORT_KEY, String(bucket));
    if (storage.getItem(BEHAVIORAL_COHORT_KEY) !== String(bucket)) return null;
    return variantForBucket(bucket);
  } catch { return null; }
}

/** Only two distinct, canonical content paths are needed; reloads are not visits. */
export function recordBehavioralContentVisit(storage: Store | null, pathname: string): number | null {
  if (!storage || !isBehavioralAdPath(pathname)) return null;
  try {
    const previous = storage.getItem(BEHAVIORAL_VISITS_KEY);
    const values: unknown = previous === null ? [] : JSON.parse(previous);
    if (!Array.isArray(values) || values.length > 2 || values.some((value) => typeof value !== "string" || !isBehavioralAdPath(value))) return null;
    const paths = [...new Set<string>([...values, pathname.replace(/\/$/, "")])].slice(0, 2);
    const value = JSON.stringify(paths);
    storage.setItem(BEHAVIORAL_VISITS_KEY, value);
    return storage.getItem(BEHAVIORAL_VISITS_KEY) === value ? paths.length : null;
  } catch { return null; }
}

export function canAttemptBehavioralLoad(lastLoadedAt: string | null, now: number) {
  if (!Number.isSafeInteger(now) || now <= 0) return false;
  if (lastLoadedAt === null) return true;
  if (!/^\d+$/.test(lastLoadedAt)) return false;
  const timestamp = Number(lastLoadedAt);
  return Number.isSafeInteger(timestamp) && timestamp > 0 && timestamp <= now && now - timestamp >= POPUNDER_COOLDOWN_MS;
}

/** This lease limits our script insertions. It is not a vendor impression cap. */
export function claimBehavioralLoad(storage: Store | null, key: string, now: number) {
  if (!storage) return false;
  try {
    if (!canAttemptBehavioralLoad(storage.getItem(key), now)) return false;
    storage.setItem(key, String(now));
    return storage.getItem(key) === String(now);
  } catch { return false; }
}

export function behavioralEligibility(context: {
  production: boolean; pathname: string; variant: BehavioralVariant | null;
  enabled: boolean; verified: boolean; contentVisits: number | null;
  viewportWidth: number; foregroundMs: number; scrollDepth: number;
  pageHidden: boolean; modalOpen: boolean; protectedTool: boolean;
}) {
  if (!context.production || !isBehavioralAdPath(context.pathname)) return "page_excluded";
  if (!context.enabled) return "disabled";
  if (!context.verified) return "vendor_unverified";
  if (context.variant === null || context.contentVisits === null) return "storage_unavailable";
  if (context.variant === "control") return "control";
  if (![context.viewportWidth, context.foregroundMs, context.scrollDepth, context.contentVisits].every(Number.isFinite)) return "engagement_pending";
  if (context.viewportWidth < 1024 || context.protectedTool) return "page_excluded";
  if (context.pageHidden || context.modalOpen) return "interaction_active";
  if (context.contentVisits < 2 || context.foregroundMs < BEHAVIORAL_MIN_FOREGROUND_MS || context.scrollDepth < 0.5) return "engagement_pending";
  return null;
}

/** A real document navigation is needed to discard vendor global side effects. */
export function behavioralNavigationTarget(current: string, target: string | URL | null | undefined) {
  if (target == null) return null;
  try {
    const before = new URL(current);
    const after = new URL(String(target), before);
    return after.origin === before.origin && after.pathname !== before.pathname ? after.href : null;
  } catch { return null; }
}
