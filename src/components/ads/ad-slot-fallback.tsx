import {isSiteLocale, type Locale} from "@/config/site";
import {normalizeAnalyticsPathname} from "@/lib/analytics-events";
import {publicRoutePath} from "@/lib/public-url";

const copy: Record<Locale, {title: string; guides: string; tools: string}> = {
  en: {title: "More from WARDOGS Wiki", guides: "Browse guides", tools: "Maps & tools"},
  ja: {title: "WARDOGS Wiki をもっと見る", guides: "攻略ガイド", tools: "マップとツール"},
  ru: {title: "Ещё на WARDOGS Wiki", guides: "Руководства", tools: "Карты и инструменты"},
  de: {title: "Mehr auf WARDOGS Wiki", guides: "Anleitungen", tools: "Karten & Werkzeuge"},
  "pt-br": {title: "Mais no WARDOGS Wiki", guides: "Ver guias", tools: "Mapas e ferramentas"},
  "zh-cn": {title: "继续探索 WARDOGS Wiki", guides: "浏览攻略", tools: "地图与工具"},
  "zh-tw": {title: "繼續探索 WARDOGS Wiki", guides: "瀏覽攻略", tools: "地圖與工具"},
  pl: {title: "Więcej w WARDOGS Wiki", guides: "Poradniki", tools: "Mapy i narzędzia"}
};

export function getAdFallbackCopy(pathname: string) {
  const segment = normalizeAnalyticsPathname(pathname, process.env.NEXT_PUBLIC_BASE_PATH).split("/")[1];
  const locale = isSiteLocale(segment) ? segment : "en";
  return {locale, ...copy[locale]};
}

// This is first-party navigation, outside the vendor-observed container. It
// occupies already reserved space and is never counted as an ad creative.
export function AdSlotFallback({pathname}: {pathname: string}) {
  const text = getAdFallbackCopy(pathname);
  return (
    <nav
      aria-label={text.title}
      data-ad-fallback="site-navigation"
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded border border-[#2c3631] bg-[#111713] p-2 text-center"
    >
      <p className="text-xs font-semibold text-[#a8b4ae]">{text.title}</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        <a className="text-[#87dbab] underline underline-offset-4 hover:text-white" href={publicRoutePath(`/${text.locale}/guides`)} title={text.guides}>{text.guides}</a>
        <a className="text-[#87dbab] underline underline-offset-4 hover:text-white" href={publicRoutePath(`/${text.locale}/tools`)} title={text.tools}>{text.tools}</a>
      </div>
    </nav>
  );
}
