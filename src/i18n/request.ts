import {getRequestConfig} from "next-intl/server";
import {isLocale, siteConfig} from "@/config/site";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : siteConfig.defaultLocale;
  return {locale, messages: (await import(`../../messages/${locale}.json`)).default};
});
