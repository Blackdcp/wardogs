import {defineRouting} from "next-intl/routing";
import {locales, siteConfig} from "@/config/site";

export const routing = defineRouting({
  locales,
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: "always",
  localeDetection: false
});
