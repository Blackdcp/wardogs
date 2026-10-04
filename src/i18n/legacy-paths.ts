import {isLocale} from "@/config/site";

const legacyEnglishSegments = new Set(["guides", "videos", "items", "news", "privacy", "terms", "vehicles"]);
const legacyEnglishPages = new Set([
  "maps",
  "about",
  "contact",
  "editorial-policy",
  "skins",
  "black-market",
  "gold-market"
]);
const legacyEnglishTools = new Set([
  "system-check", "ammo-matcher", "logistics-planner", "progression-route",
  "weapon-compare", "loadout-budget", "artillery-calculator", "map"
]);

export function getLegacyEnglishRedirectPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment === "wardogs") {
    const locale = segments[1];
    if (!locale || !isLocale(locale)) return null;
    const suffix = segments.slice(2).join("/");
    return `/${locale}${suffix ? `/${suffix}` : ""}`;
  }
  if (firstSegment && isLocale(firstSegment) && segments[1] === firstSegment) {
    return `/${segments.slice(1).join("/")}`;
  }
  if (!firstSegment || isLocale(firstSegment)) return null;
  if (legacyEnglishSegments.has(firstSegment)) return `/en${pathname}`;
  if (segments.length === 1 && legacyEnglishPages.has(firstSegment)) return `/en${pathname}`;
  if (segments.length === 2 && firstSegment === "tools" && legacyEnglishTools.has(segments[1])) return `/en${pathname}`;
  return null;
}
