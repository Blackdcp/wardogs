export const ADSTERRA_SOCIAL_BAR_SCRIPT_SRC =
  "https://arkgleamfox.com/ff/48/ce/ff48ce7ab0b6833443b9f5bb64ec5e3c.js";
export const ADSTERRA_POPUNDER_SCRIPT_SRC =
  "https://arkgleamfox.com/9c/cb/05/9ccb058d9d56da7b7f2e39d95a819b02.js";
export const ADSTERRA_SMARTLINK_URLS = [
  {
    id: "smartlink-2",
    url: "https://arkgleamfox.com/jvxhi4z3ts?key=678e9aeab41077b9e6a3e5626292c434"
  },
  {
    id: "smartlink-1",
    url: "https://arkgleamfox.com/j7way0p0?key=a9590c5cd64a0d11f4aa2ecf617130bc"
  }
] as const;
export const POPUNDER_COOLDOWN_MS = 6 * 60 * 60 * 1000;
export const POPUNDER_STORAGE_KEY = "wardogs-adsterra-popunder-loaded-at";
export const BEHAVIORAL_POPUNDER_ENABLED =
  process.env.NEXT_PUBLIC_WARDOGS_ENABLE_POPUNDER !== "false";

const LOCALIZED_PUBLIC_PATH = /^\/(?:en|de|pt-br|ru|ja|zh-cn)(?:\/.*)?$/;

export function isBehavioralAdPath(pathname: string) {
  return LOCALIZED_PUBLIC_PATH.test(pathname);
}

export function canLoadPopunder(lastLoadedAt: string | null, now = Date.now()) {
  if (!lastLoadedAt) return true;
  const timestamp = Number(lastLoadedAt);
  return !Number.isFinite(timestamp) || now - timestamp >= POPUNDER_COOLDOWN_MS;
}
