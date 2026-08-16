import {isLocale} from "@/config/site";

const legacyEnglishSegments = new Set(["guides", "videos", "news", "privacy", "terms"]);

export function getLegacyEnglishRedirectPath(pathname: string): string | null {
  const firstSegment = pathname.split("/")[1];
  if (!firstSegment || isLocale(firstSegment) || !legacyEnglishSegments.has(firstSegment)) return null;
  return `/en${pathname}`;
}
