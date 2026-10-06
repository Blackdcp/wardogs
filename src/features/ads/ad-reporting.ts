import {isSiteLocale} from "@/config/site";
import {normalizeAnalyticsPathname} from "@/lib/analytics-events";

// Bump when placement or serving configuration changes; see the experiment ledger.
export const AD_REPORTING_VERSION = "native-first-v1";

export function getAdReportingMetadata(pathname: string, adUnit: string) {
  const pagePath = normalizeAnalyticsPathname(pathname, process.env.NEXT_PUBLIC_BASE_PATH);
  const [locale, section, ...rest] = pagePath.split("/").filter(Boolean);
  let pageType = "other";
  if (isSiteLocale(locale)) {
    if (!section) pageType = "home";
    else if (section === "guides") pageType = rest.length ? "guide" : "guide_hub";
    else if (section === "items") pageType = rest.length > 1 ? "item" : rest.length ? "catalogue_category" : "catalogue_hub";
    else if (section === "videos") pageType = rest.length ? "video" : "video_hub";
    else if (section === "tools") pageType = "tool";
    else if (section === "maps") pageType = "map_hub";
  }
  return {ad_unit: adUnit, page_path: pagePath, page_type: pageType, config_version: AD_REPORTING_VERSION};
}
