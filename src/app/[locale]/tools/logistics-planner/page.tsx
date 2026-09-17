import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {LogisticsPlanner} from "@/components/tools/logistics-planner";
import {isLocale, locales} from "@/config/site";
import {getLogisticsStages, logisticsStageIds} from "@/features/tools/logistics-plan";
import {
  decodeLogisticsPlanState,
  serializeToolSearchParams,
  type ToolSearchParams,
} from "@/features/tools/share-state";
import {getToolCopy} from "@/features/tools/tool-copy";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {
  params: Promise<{locale: string}>;
  searchParams?: Promise<ToolSearchParams>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Pick<PageProps, "params">): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const copy = getToolCopy(locale);
  return buildPageMetadata(locale, "/tools/logistics-planner", copy.logisticsPlannerTitle, copy.logisticsPlannerDescription);
}

export default async function LogisticsPlannerPage({params, searchParams}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const copy = getToolCopy(locale);
  const stages = getLogisticsStages(locale);
  const query = serializeToolSearchParams(await (searchParams ?? Promise.resolve({})));
  const initialState = decodeLogisticsPlanState(query, logisticsStageIds);

  return (
    <main className="site-container py-10 md:py-16">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-xs uppercase text-[#69c78f]">{copy.logisticsPlannerEyebrow}</p>
        <h1 className="display-font mt-3 text-balance text-3xl leading-tight text-white sm:text-4xl md:text-5xl">{copy.logisticsPlannerTitle}</h1>
        <p className="mt-4 text-base leading-7 text-[#a8b4ae]">{copy.logisticsPlannerDescription}</p>
      </header>
      <LogisticsPlanner copy={copy} initialState={initialState} stages={stages} />
    </main>
  );
}
