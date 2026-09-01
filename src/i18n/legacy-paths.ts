import {isLocale} from "@/config/site";

const legacyEnglishSegments = new Set(["guides", "videos", "news", "privacy", "terms"]);

export function getLegacyEnglishRedirectPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment === "wardogs") {
    const locale = segments[1];
    if (!locale || !isLocale(locale)) return null;
    const suffix = segments.slice(2).join("/");
    return `/${locale}${suffix ? `/${suffix}` : ""}`;
  }
  if (!firstSegment || isLocale(firstSegment) || !legacyEnglishSegments.has(firstSegment)) return null;
  return `/en${pathname}`;
}
