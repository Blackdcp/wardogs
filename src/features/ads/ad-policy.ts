export const ADSTERRA_SOCIAL_BAR_SCRIPT_SRC =
  "https://arkgleamfox.com/ff/48/ce/ff48ce7ab0b6833443b9f5bb64ec5e3c.js";
export const ADSTERRA_POPUNDER_SCRIPT_SRC =
  "https://arkgleamfox.com/9c/cb/05/9ccb058d9d56da7b7f2e39d95a819b02.js";
export const ADSTERRA_SMARTLINK_URLS = [
  {
    id: "smartlink-1",
    url: "https://arkgleamfox.com/sfg4tmdn?key=88f0d659df423718bd107ca16b5284cd"
  }
] as const;
// Monetize with isolated native/display inventory; keep unrestricted ad scripts off.
export const ADSTERRA_ENABLED = true;
export const ADSTERRA_NATIVE_ENABLED = true;
export const ADSTERRA_MOBILE_STICKY_ENABLED = true;
export const ADSTERRA_SOCIAL_BAR_ENABLED = false;
export const ADSTERRA_SMARTLINK_ENABLED = false;
export const ADSTERRA_LEADERBOARD_ENABLED = true;
export const ADSTERRA_RIGHT_RAIL_ENABLED = true;
export const POPUNDER_COOLDOWN_MS = 6 * 60 * 60 * 1000;
export const POPUNDER_STORAGE_KEY = "wardogs-adsterra-popunder-loaded-at";
export const BEHAVIORAL_POPUNDER_ENABLED = false;

const LOCALIZED_PUBLIC_PATH = /^\/(?:en|de|pt-br|ru|ja|zh-cn|zh-tw|pl)(?:\/.*)?$/;

export function isBehavioralAdPath(pathname: string) {
  return LOCALIZED_PUBLIC_PATH.test(pathname);
}

export function getSocialBarScriptForPath(pathname: string): string | null {
  return ADSTERRA_ENABLED && ADSTERRA_SOCIAL_BAR_ENABLED && isBehavioralAdPath(pathname)
    ? ADSTERRA_SOCIAL_BAR_SCRIPT_SRC
    : null;
}

export function canLoadPopunder(lastLoadedAt: string | null, now = Date.now()) {
  if (!lastLoadedAt) return true;
  const timestamp = Number(lastLoadedAt);
  return !Number.isFinite(timestamp) || now - timestamp >= POPUNDER_COOLDOWN_MS;
}
