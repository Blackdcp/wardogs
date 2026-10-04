import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {CatalogueHomeBand} from "@/components/catalogue/catalogue-home-band";
import {AboutGame} from "@/components/home/about-game";
import {BeginnerTips} from "@/components/home/beginner-tips";
import {CategoryGrid} from "@/components/home/category-grid";
import {CurrentBuildChanges} from "@/components/home/current-build-changes";
import {FinalCta} from "@/components/home/final-cta";
import {HomeActionHub} from "@/components/home/home-action-hub";
import {HomeEditorialBriefing} from "@/components/home/home-editorial-briefing";
import {HomeFaq} from "@/components/home/home-faq";
import {HomeHero} from "@/components/home/home-hero";
import {PriorityGuides} from "@/components/home/priority-guides";
import {StartHere} from "@/components/home/start-here";
import {SiteSearch, type SiteSearchCopy} from "@/components/home/site-search";
import {VideoIntelligence} from "@/components/home/video-intelligence";
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

      {/* 2. 编辑优先级：把当前玩家问题组织成攻略站路径 */}
      <HomeEditorialBriefing />

      {/* 3. 问题分流区 + 高曝光赞助位 */}
      <HomeActionHub
        sponsoredSlot={
          <div className="space-y-3" data-page-ad-inventory="home">
            <p className="px-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-[#82938a]">{t("ads.sponsored")}</p>
            <AdsterraDisplayBanner label={t("ads.label")} placement="rectangle" />
            <AdsterraNativeBanner label={t("ads.label")} />
            <AdsterraSmartlink cta={t("ads.smartlinkCta")} description={t("ads.smartlinkDescription")} label={t("ads.sponsored")} />
          </div>
        }
      />

      {/* 4. 新手与回流路径：先教玩家怎么用站内内容 */}
      <StartHere />

      {/* 5. 时效与版本动态区 (随版本迭代更新) */}
      <CurrentBuildChanges locale={locale} />

      {/* 6. 深度内容瀑布流 (沉淀长尾 SEO) */}
      <PriorityGuides guides={guides} locale={locale} />
      <BeginnerTips />
      <VideoIntelligence locale={locale} />
      <CatalogueHomeBand locale={locale} />
      <CategoryGrid guideCount={guides.length} />
      <AboutGame />
      <HomeFaq />
      <SiteSearch copy={searchCopy} index={searchIndex} locale={locale} />
      <FinalCta />
    </main>
  );
}
