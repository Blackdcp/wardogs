export const ADSTERRA_SOCIAL_BAR_SCRIPT_SRC =
  "https://arkgleamfox.com/ff/48/ce/ff48ce7ab0b6833443b9f5bb64ec5e3c.js";
export const ADSTERRA_POPUNDER_SCRIPT_SRC =
  "https://arkgleamfox.com/9c/cb/05/9ccb058d9d56da7b7f2e39d95a819b02.js";
export const ADSTERRA_SMARTLINK_URL =
  "https://arkgleamfox.com/sfg4tmdn?key=88f0d659df423718bd107ca16b5284cd";
export const POPUNDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;
export const POPUNDER_STORAGE_KEY = "wardogs-adsterra-popunder-loaded-at";
export const BEHAVIORAL_POPUNDER_ENABLED = process.env.NEXT_PUBLIC_WARDOGS_ENABLE_POPUNDER === "true";

const CONTENT_DETAIL_PATH = /^\/(?:en|de|pt-br|ru)\/(?:guides|videos)\/[^/]+\/?$/;
const ITEM_DETAIL_PATH = /^\/(?:en|de|pt-br|ru)\/items\/[^/]+\/[^/]+\/?$/;

export function isBehavioralAdPath(pathname: string) {
  return CONTENT_DETAIL_PATH.test(pathname) || ITEM_DETAIL_PATH.test(pathname);
}

export function canLoadPopunder(lastLoadedAt: string | null, now = Date.now()) {
  if (!lastLoadedAt) return true;
  const timestamp = Number(lastLoadedAt);
  return !Number.isFinite(timestamp) || now - timestamp >= POPUNDER_COOLDOWN_MS;
}
