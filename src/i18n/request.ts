import {getRequestConfig} from "next-intl/server";
import {isSiteLocale, siteConfig} from "@/config/site";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = requested && isSiteLocale(requested) ? requested : siteConfig.defaultLocale;
  return {locale, messages: (await import(`../../messages/${locale}.json`)).default};
});
