export const ADSTERRA_SOCIAL_BAR_SCRIPT_SRC =
  "https://bauval.org/14/ff48ce7ab0b6833443b9f5bb64ec5e3c";
export const ADSTERRA_POPUNDER_SCRIPT_SRC =
  "https://abscloud.org/1/9ccb058d9d56da7b7f2e39d95a819b02";
export const ADSTERRA_SMARTLINK_URLS = [
  {
    id: "smartlink-1",
    url: "https://araplhn.org/4/88f0d659df423718bd107ca16b5284cd"
  },
  {
    id: "smartlink-2",
    url: "https://arkgleamfox.com/jvxhi4z3ts?key=678e9aeab41077b9e6a3e5626292c434"
  }
] as const;
// Current dashboard codes verified on 2026-10-08. Vendor serving-frequency
// confirmation is a separate gate from our first script-load eligibility.
export const ADSTERRA_ENABLED = true;
export const ADSTERRA_NATIVE_ENABLED = true;
export const ADSTERRA_MOBILE_STICKY_ENABLED = true;
export const ADSTERRA_SOCIAL_BAR_ENABLED = true;
export const ADSTERRA_SOCIAL_BAR_VERIFIED = false;
export const ADSTERRA_POPUNDER_VERIFIED = false;
export const ADSTERRA_SMARTLINK_ENABLED = true;
export const ADSTERRA_LEADERBOARD_ENABLED = true;
export const ADSTERRA_RIGHT_RAIL_ENABLED = true;
export const POPUNDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;
export const POPUNDER_STORAGE_KEY = "wardogs-adsterra-popunder-loaded-at";
export const BEHAVIORAL_POPUNDER_ENABLED = true;

const LOCALIZED_CONTENT_DETAIL = /^\/(?:en|de|pt-br|ru|ja|zh-cn|zh-tw|pl)\/(?:guides\/[^/]+|videos\/[^/]+|items\/[^/]+\/[^/]+)\/?$/;

export function isBehavioralAdPath(pathname: string) {
  return LOCALIZED_CONTENT_DETAIL.test(pathname);
}

export function getSocialBarScriptForPath(pathname: string): string | null {
  return ADSTERRA_ENABLED && ADSTERRA_SOCIAL_BAR_ENABLED && ADSTERRA_SOCIAL_BAR_VERIFIED && isBehavioralAdPath(pathname)
    ? ADSTERRA_SOCIAL_BAR_SCRIPT_SRC
    : null;
}

export function canLoadPopunder(lastLoadedAt: string | null, now = Date.now()) {
  if (lastLoadedAt === null) return true;
  if (!/^\d+$/.test(lastLoadedAt)) return false;
  const timestamp = Number(lastLoadedAt);
  return Number.isSafeInteger(timestamp) && timestamp > 0 && timestamp <= now && now - timestamp >= POPUNDER_COOLDOWN_MS;
}
