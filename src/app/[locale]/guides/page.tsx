import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {isLocale, locales, type Locale} from "@/config/site";
import {GuideGrid} from "@/components/guides/guide-grid";
import {PriorityGuides} from "@/components/home/priority-guides";
import {VideoGuideStrip} from "@/components/guides/video-guide-strip";
import {buildGuideIndex} from "@/features/guides/guide-index";
import type {GuideCategory} from "@/content/manifest";
import {buildPageMetadata} from "@/lib/metadata";
import {buildGuideIndexJsonLd} from "@/lib/structured-data";
import {JsonLd} from "@/components/seo/json-ld";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({locale, namespace: "guides"});
  return buildPageMetadata(locale, "/guides", t("metaTitle"), t("description"));
}

export default async function GuidesPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  setRequestLocale(locale);
  const [t, categories, guides] = await Promise.all([
    getTranslations({locale, namespace: "guides"}),
    getTranslations({locale, namespace: "categories"}),
    buildGuideIndex(locale)
  ]);
  const categoryLabels = Object.fromEntries(
    (["access", "release", "store", "platform", "video", "community", "developer", "guide"] as GuideCategory[])
      .map((category) => [category, categories(category)])
  ) as Record<GuideCategory, string>;

  return (
    <main>
      <JsonLd data={buildGuideIndexJsonLd(locale, guides)} />
      <section className="border-b border-[#2c3631] bg-[#111512] py-16 md:py-24">
        <div className="site-container">
          <p className="font-mono text-xs uppercase text-[#68bd8d]">{t("count")}</p>
          <h1 className="display-font mt-4 max-w-4xl text-5xl leading-none text-white md:text-7xl">{t("title")}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#a8b4ae] md:text-lg">{t("description")}</p>
        </div>
      </section>
      <section className="site-container py-10 md:py-12">
        <PriorityGuides guides={guides} locale={locale} />
      </section>
      <VideoGuideStrip locale={locale} />
      <section className="site-container py-12 md:py-16">
        <GuideGrid guides={guides} readLabel={t("read")} categoryLabels={categoryLabels} />
      </section>
    </main>
  );
}
