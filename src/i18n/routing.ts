import {defineRouting} from "next-intl/routing";
import {siteLocales, siteConfig} from "@/config/site";

export const routing = defineRouting({
  locales: siteLocales,
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: "always",
  localeDetection: false,
  // HTML metadata uses the actual per-route translation inventory.
  alternateLinks: false
});
