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
  "weapon-compare", "loadout-budget", "cash-xp-calculator", "artillery-calculator", "map"
]);

const legacyGuideSlugAliases = new Map([
  ["wardogs-squad-invite", "wardogs-squad-guide"]
]);

function getLocalizedGuideAliasRedirectPath(segments: readonly string[]): string | null {
  const [locale, section, slug, ...rest] = segments;
  if (!locale || !isLocale(locale) || section !== "guides" || !slug || rest.length > 0) return null;
  const canonicalSlug = legacyGuideSlugAliases.get(slug);
  return canonicalSlug ? `/${locale}/guides/${canonicalSlug}` : null;
}

function getEnglishGuideAliasRedirectPath(segments: readonly string[]): string | null {
  const [section, slug, ...rest] = segments;
  if (section !== "guides" || !slug || rest.length > 0) return null;
  const canonicalSlug = legacyGuideSlugAliases.get(slug);
  return canonicalSlug ? `/en/guides/${canonicalSlug}` : null;
}

export function getLegacyEnglishRedirectPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment === "wardogs") {
    const locale = segments[1];
    if (!locale || !isLocale(locale)) return null;
    const localizedSegments = [locale, ...segments.slice(2)];
    const guideAliasPath = getLocalizedGuideAliasRedirectPath(localizedSegments);
    if (guideAliasPath) return guideAliasPath;
    const suffix = localizedSegments.slice(1).join("/");
    return `/${locale}${suffix ? `/${suffix}` : ""}`;
  }
  if (firstSegment && isLocale(firstSegment) && segments[1] === firstSegment) {
    const collapsedSegments = segments.slice(1);
    const guideAliasPath = getLocalizedGuideAliasRedirectPath(collapsedSegments);
    return guideAliasPath ?? `/${collapsedSegments.join("/")}`;
  }
  const localizedGuideAliasPath = getLocalizedGuideAliasRedirectPath(segments);
  if (localizedGuideAliasPath) return localizedGuideAliasPath;
  if (!firstSegment || isLocale(firstSegment)) return null;
  const englishGuideAliasPath = getEnglishGuideAliasRedirectPath(segments);
  if (englishGuideAliasPath) return englishGuideAliasPath;
  if (legacyEnglishSegments.has(firstSegment)) return `/en${pathname}`;
  if (segments.length === 1 && legacyEnglishPages.has(firstSegment)) return `/en${pathname}`;
  if (segments.length === 2 && firstSegment === "tools" && legacyEnglishTools.has(segments[1])) return `/en${pathname}`;
  return null;
}
