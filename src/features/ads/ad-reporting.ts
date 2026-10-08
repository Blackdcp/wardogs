import {isSiteLocale} from "@/config/site";
import {normalizeAnalyticsPathname} from "@/lib/analytics-events";

// Bump when placement or serving configuration changes; see the experiment ledger.
export const AD_REPORTING_VERSION = "format-expansion-v3";

export function getAdReportingMetadata(pathname: string, adUnit: string, placement?: string) {
  const pagePath = normalizeAnalyticsPathname(pathname, process.env.NEXT_PUBLIC_BASE_PATH);
  const [locale, section, ...rest] = pagePath.split("/").filter(Boolean);
  let pageType = "other";
  if (isSiteLocale(locale)) {
    if (!section) pageType = "home";
    else if (section === "guides") pageType = rest.length ? "guide" : "guide_hub";
    else if (section === "items") pageType = rest.length > 1 ? "item" : rest.length ? "catalogue_category" : "catalogue_hub";
    else if (section === "videos") pageType = rest.length ? "video" : "video_hub";
    else if (section === "tools") pageType = rest[0] === "map" ? "map_tool" : rest[0] === "artillery-calculator" ? "artillery_tool" : "tool";
    else if (section === "maps") pageType = "map_hub";
  }
  // `section` is already registered in GA4. Keep the historical placement
  // dimension intact and add a stable physical-slot grouping. Shared vendor
  // zones still do not provide revenue attribution to this grouping.
  const slot = placement && /^[a-z0-9_-]{1,40}$/.test(placement) ? `${pageType}:${placement}` : undefined;
  return {ad_unit: adUnit, page_path: pagePath, page_type: pageType, config_version: AD_REPORTING_VERSION, ...(slot ? {section: slot} : {})};
}
