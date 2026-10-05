import {buildToolRelatedLinks, ToolRelatedGuides} from "@/components/tools/tool-related-guides";
import {ToolPageHeader} from "@/components/tools/tool-page-header";
import {getTranslations} from "next-intl/server";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {LogisticsPlanner} from "@/components/tools/logistics-planner";
import {isLocale, locales} from "@/config/site";
import {getLogisticsStages, logisticsStageIds} from "@/features/tools/logistics-plan";
import {
  decodeLogisticsPlanState,
} from "@/features/tools/share-state";
import {getToolCopy} from "@/features/tools/tool-copy";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Pick<PageProps, "params">): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const copy = getToolCopy(locale);
  return buildPageMetadata(locale, "/tools/logistics-planner", copy.logisticsPlannerTitle, copy.logisticsPlannerDescription, "WARDOGS logistics, supply route, cargo delivery, WARDOGS Ural truck, FOB supply, logistics planner tool");
}

export default async function LogisticsPlannerPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const relatedLinks = await buildToolRelatedLinks("logistics-planner", locale);
  const headerT = await getTranslations({locale: locale, namespace: "nav"});
  const copy = getToolCopy(locale);
  const stages = getLogisticsStages(locale);
  const initialState = decodeLogisticsPlanState("", logisticsStageIds);

  return (
    <main className="site-container py-10 md:py-16">
      <ToolPageHeader toolId="logistics-planner" eyebrow={copy.logisticsPlannerEyebrow} title={copy.logisticsPlannerTitle} description={copy.logisticsPlannerDescription} actions={[{href: `/${locale}/tools`, label: headerT("toolsHome")}]} />
      <LogisticsPlanner copy={copy} initialState={initialState} stages={stages} />
      <ToolRelatedGuides model={relatedLinks} locale={locale} />
    </main>
  );
}
