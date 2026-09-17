import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {OperationsAtlas} from "@/components/maps/operations-atlas";
import {JsonLd} from "@/components/seo/json-ld";
import {listGuideSummaries} from "@/content/guides";
import {isLocale, locales, type Locale} from "@/config/site";
import {getOperationsAtlasCopy, operationsAtlasRecords} from "@/features/maps/operations-atlas";
import {buildLocalizedUrl, buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const copy = getOperationsAtlasCopy(locale);
  return buildPageMetadata(locale, "/maps", copy.metaTitle, copy.metaDescription);
}

function buildAtlasJsonLd(locale: Locale) {
  const copy = getOperationsAtlasCopy(locale);
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: copy.title,
      description: copy.metaDescription,
      url: buildLocalizedUrl(locale, "/maps"),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: operationsAtlasRecords.map((record, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: copy.entries[record.id].title,
        url: buildLocalizedUrl(locale, `/guides/${record.guideSlug}`),
      })),
    },
  ];
}

export default async function MapsPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const [guides, t] = await Promise.all([
    listGuideSummaries(locale),
    getTranslations({locale, namespace: "nav"}),
  ]);
  const copy = getOperationsAtlasCopy(locale);
  const guideTitles = Object.fromEntries(guides.map((guide) => [guide.slug, guide.title]));

  return (
    <main>
      <JsonLd data={buildAtlasJsonLd(locale)} />
      <OperationsAtlas
        copy={copy}
        guideTitles={guideTitles}
        toolLabels={{"/tools/logistics-planner": t("logisticsPlanner")}}
      />
    </main>
  );
}
