import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {CatalogueHomeBand} from "@/components/catalogue/catalogue-home-band";
import {CurrentBuildChanges} from "@/components/home/current-build-changes";
import {HomeEditorialBriefing} from "@/components/home/home-editorial-briefing";
import {HomeHero} from "@/components/home/home-hero";
import {PriorityGuides} from "@/components/home/priority-guides";
import {StartHere} from "@/components/home/start-here";
import {SiteSearch, type SiteSearchCopy} from "@/components/home/site-search";
import {isLocale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";
import {getHomeFacts} from "@/features/home/home-data";
import {buildSiteSearchIndex} from "@/features/search/site-search-index";
import {buildPageMetadata} from "@/lib/metadata";
import {buildHomeJsonLd} from "@/lib/structured-data";
import {JsonLd} from "@/components/seo/json-ld";
import {LiveBetaBanner} from "@/components/live-ops/live-beta-banner";
import {AdsterraDisplayBanner} from "@/components/ads/adsterra-display-banner";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "@/components/ads/adsterra-smartlink";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: HomePageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({locale, namespace: "home"});
  return buildPageMetadata(locale, "/", t("metaTitle"), t("metaDescription"), "WARDOGS wiki, WARDOGS database, tactical FPS wiki, WARDOGS guides, WARDOGS weapons, WARDOGS vehicles, WARDOGS map, WARDOGS season 2, WARDOGS server status, Steam early access");
}

export default async function HomePage({params}: HomePageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({locale});
  const [guides, searchIndex] = await Promise.all([
    listGuideSummaries(locale),
    buildSiteSearchIndex(locale)
  ]);
  const facts = getHomeFacts((key) => t(`home.stats.${key}`));
  const searchCopy: SiteSearchCopy = {
    eyebrow: t("home.search.eyebrow"),
    title: t("home.search.title"),
    description: t("home.search.description"),
    label: t("home.search.label"),
    placeholder: t("home.search.placeholder"),
    prompt: t("home.search.prompt"),
    empty: t("home.search.empty"),
    resultCount: t.raw("home.search.resultCount") as string,
    openResult: t("home.search.openResult"),
    types: {
      guide: t("home.search.types.guide"),
      item: t("home.search.types.item"),
      video: t("home.search.types.video"),
      tool: t("home.search.types.tool"),
      map: t("home.search.types.map")
    }
  };

  return (
    <main>
      <JsonLd data={buildHomeJsonLd(locale)} />

      {/* 1. Hero 战术聚焦区 */}
      <HomeHero facts={facts} locale={locale} />
      <LiveBetaBanner compact />

      {/* 2. 编辑优先级 + 广告承接：一个完整任务台，不再拆成两屏 */}
      <HomeEditorialBriefing
        sponsoredSlot={
          <div className="space-y-3" data-page-ad-inventory="home">
            <p className="px-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-[#82938a]">{t("ads.sponsored")}</p>
            <AdsterraDisplayBanner label={t("ads.label")} placement="rectangle" />
            <AdsterraNativeBanner label={t("ads.label")} />
            <AdsterraSmartlink cta={t("ads.smartlinkCta")} description={t("ads.smartlinkDescription")} label={t("ads.sponsored")} />
          </div>
        }
      />

      {/* 3. 新手与回流路径：保留开荒路线，但压成一屏内的扫描列表 */}
      <StartHere />

      {/* 4. 当前版本证据：保留首页可信度和版本敏感信息 */}
      <CurrentBuildChanges locale={locale} />

      {/* 5. 深度入口：只保留核心攻略、资料库和搜索 */}
      <PriorityGuides guides={guides} locale={locale} />
      <CatalogueHomeBand locale={locale} />
      <SiteSearch copy={searchCopy} index={searchIndex} locale={locale} />
    </main>
  );
}
