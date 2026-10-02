import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {CatalogueHomeBand} from "@/components/catalogue/catalogue-home-band";
import {AboutGame} from "@/components/home/about-game";
import {BeginnerTips} from "@/components/home/beginner-tips";
import {CategoryGrid} from "@/components/home/category-grid";
import {CurrentBuildChanges} from "@/components/home/current-build-changes";
import {FinalCta} from "@/components/home/final-cta";
import {HomeFaq} from "@/components/home/home-faq";
import {HomeActionHub} from "@/components/home/home-action-hub";
import {HomeHero} from "@/components/home/home-hero";
import {OfficialMedia} from "@/components/home/official-media";
import {PriorityGuides} from "@/components/home/priority-guides";
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
  return buildPageMetadata(locale, "/", t("metaTitle"), t("metaDescription"));
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
      <HomeHero facts={facts} />
      <LiveBetaBanner compact />
      <HomeActionHub />
      <section className="site-container py-4" data-page-ad-inventory="home">
        <AdsterraDisplayBanner label={t("ads.label")} placement="rectangle" />
        <AdsterraNativeBanner label={t("ads.label")} />
        <AdsterraSmartlink cta={t("ads.smartlinkCta")} description={t("ads.smartlinkDescription")} label={t("ads.sponsored")} />
      </section>
      <CatalogueHomeBand locale={locale} />
      <PriorityGuides guides={guides} locale={locale} />
      <SiteSearch copy={searchCopy} index={searchIndex} locale={locale} />
      <CurrentBuildChanges locale={locale} />
      <VideoIntelligence locale={locale} />
      <CategoryGrid guideCount={guides.length} />
      <AboutGame />
      <OfficialMedia />
      <BeginnerTips />
      <HomeFaq />
      <FinalCta />
    </main>
  );
}
