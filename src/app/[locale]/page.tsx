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
import {OfficialMedia} from "@/components/home/official-media";
import {PriorityGuides} from "@/components/home/priority-guides";
import {SiteSearch, type SiteSearchCopy} from "@/components/home/site-search";
import {VideoIntelligence} from "@/components/home/video-intelligence";
import {isLocale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";
import {buildSiteSearchIndex, getSiteSearchCounts} from "@/features/search/site-search-index";
import {buildPageMetadata} from "@/lib/metadata";
import {buildHomeJsonLd} from "@/lib/structured-data";
import {JsonLd} from "@/components/seo/json-ld";
import {LiveBetaBanner} from "@/components/live-ops/live-beta-banner";

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
  const searchCounts = getSiteSearchCounts(searchIndex);
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
      tool: t("home.search.types.tool")
    },
    counts: {
      guides: t("home.search.counts.guides"),
      items: t("home.search.counts.items"),
      videos: t("home.search.counts.videos"),
      tools: t("home.search.counts.tools")
    }
  };

  return (
    <main>
      <JsonLd data={buildHomeJsonLd(locale)} />
      <LiveBetaBanner />
      <SiteSearch copy={searchCopy} counts={searchCounts} index={searchIndex} locale={locale} />
      <HomeActionHub />
      <CurrentBuildChanges locale={locale} />
      <CatalogueHomeBand locale={locale} />
      <PriorityGuides guides={guides} locale={locale} />
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
