import {isProductionHostname} from "@/lib/analytics-events";

export const CLARITY_PROJECT_ID = "yuie63egqv";
export const CLARITY_SCRIPT_ID = "wardogs-microsoft-clarity";
export const CLARITY_SCRIPT_SRC = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}?ref=bwt`;
export const CLARITY_CONSENT_KEY = "wardogs-clarity-consent-v1";
export const CLARITY_CONSENT_TTL = 180 * 24 * 60 * 60 * 1000;
export const CLARITY_SETTINGS_EVENT = "wardogs:clarity-settings";
export type ClarityChoice = "allowed" | "denied";
export type ClarityPreference = {version: 1; choice: ClarityChoice; savedAt: number; expiresAt: number};
type Store = Pick<Storage, "getItem" | "setItem"> & Partial<Pick<Storage, "removeItem">>;

export function makeClarityPreference(choice: ClarityChoice, now = Date.now()): ClarityPreference {
  return {version: 1, choice, savedAt: now, expiresAt: now + CLARITY_CONSENT_TTL};
}

export function parseClarityPreference(value: string | null, now = Date.now()): ClarityPreference | null {
  try {
    if (!value) return null;
    const item = JSON.parse(value) as Partial<ClarityPreference>;
    if (item.version !== 1 || !["allowed", "denied"].includes(item.choice ?? "")
      || !Number.isSafeInteger(item.savedAt) || !Number.isSafeInteger(item.expiresAt)
      || item.savedAt! > now || item.savedAt! < 0 || item.expiresAt! <= now
      || item.expiresAt! - item.savedAt! !== CLARITY_CONSENT_TTL) return null;
    return item as ClarityPreference;
  } catch { return null; }
}

export function readClarityPreference(stores: Array<Store | null>, now = Date.now()): ClarityPreference | null {
  return stores.flatMap((store) => {
    try { const value = parseClarityPreference(store?.getItem(CLARITY_CONSENT_KEY) ?? null, now); return value ? [value] : []; }
    catch { return []; }
  }).sort((a, b) => b.savedAt - a.savedAt || Number(b.choice === "denied") - Number(a.choice === "denied"))[0] ?? null;
}

export function writeClarityPreference(stores: Array<Store | null>, preference: ClarityPreference) {
  let persisted = false;
  for (const store of stores) {
    try {
      if (!store) continue;
      const value = JSON.stringify(preference);
      store.setItem(CLARITY_CONSENT_KEY, value);
      persisted ||= store.getItem(CLARITY_CONSENT_KEY) === value;
    } catch {
      // A rejected write must not leave an older Allow as the preferred choice.
      try { store?.removeItem?.(CLARITY_CONSENT_KEY); } catch { /* Runtime provides an entry-local denial fallback. */ }
    }
  }
  return persisted;
}

/** Clarity reads URLs itself. Tools that build share URLs stay outside replay. */
export function isClarityProtectedPath(pathname: string) {
  return /\/(?:tools\/[^/]+|guides\/wardogs-map)(?:\/|$)/.test(pathname);
}

export function isClaritySafeUrl(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.search && !url.hash
      && !url.username && !url.password && !isClarityProtectedPath(url.pathname);
  } catch { return false; }
}

export function canStartClarity(context: {href: string; referrer: string; choice: ClarityChoice | null}) {
  try {
    return context.choice === "allowed" && isProductionHostname(new URL(context.href).hostname)
      && isClaritySafeUrl(context.href) && (!context.referrer || isClaritySafeUrl(context.referrer));
  } catch { return false; }
}

export function clarityNeedsDocumentBoundary(current: string, next: string | URL | null | undefined, hasSectionId: (id: string) => boolean = () => false) {
  if (next == null) return false;
  try {
    const target = new URL(String(next), current);
    const source = new URL(current);
    // Public, existing article anchors are not user share state. Keep their
    // normal in-page behavior; arbitrary/encoded payload fragments are excluded.
    if (target.origin === source.origin && target.pathname === source.pathname && !target.search && target.hash) {
      try {
        const id = decodeURIComponent(target.hash.slice(1));
        if (id.length <= 200 && !/[=&?\s]/.test(id) && hasSectionId(id)) return false;
      } catch { return true; }
    }
    return target.origin === source.origin && !isClaritySafeUrl(target.href);
  } catch { return false; }
}
