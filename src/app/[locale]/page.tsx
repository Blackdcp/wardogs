import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {CatalogueHomeBand} from "@/components/catalogue/catalogue-home-band";
import {AboutGame} from "@/components/home/about-game";
import {BeginnerTips} from "@/components/home/beginner-tips";
import {CategoryGrid} from "@/components/home/category-grid";
import {FinalCta} from "@/components/home/final-cta";
import {HomeFaq} from "@/components/home/home-faq";
import {HomeHero} from "@/components/home/home-hero";
import {OfficialMedia} from "@/components/home/official-media";
import {PriorityGuides} from "@/components/home/priority-guides";
import {StartHere} from "@/components/home/start-here";
import {VideoIntelligence} from "@/components/home/video-intelligence";
import {isLocale} from "@/config/site";
import {listGuideSummaries} from "@/content/guides";
import {getHomeFacts} from "@/features/home/home-data";
import {buildPageMetadata} from "@/lib/metadata";
import {buildHomeJsonLd} from "@/lib/structured-data";
import {JsonLd} from "@/components/seo/json-ld";

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
  const facts = getHomeFacts((key) => t(`home.stats.${key}`));
  const guides = await listGuideSummaries(locale);

  return (
    <main>
      <JsonLd data={buildHomeJsonLd(locale)} />
      <HomeHero facts={facts} />
      <StartHere />
      <PriorityGuides guides={guides} />
      <CatalogueHomeBand />
      <VideoIntelligence locale={locale} />
      <CategoryGrid />
      <AboutGame />
      <OfficialMedia />
      <BeginnerTips />
      <HomeFaq />
      <FinalCta />
    </main>
  );
}
