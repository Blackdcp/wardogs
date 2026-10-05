import {buildToolRelatedLinks, ToolRelatedGuides} from "@/components/tools/tool-related-guides";
import {ToolPageHeader} from "@/components/tools/tool-page-header";
import {getTranslations} from "next-intl/server";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ProgressionRoute} from "@/components/tools/progression-route";
import {isLocale, locales} from "@/config/site";
import {getProgressionRoutes, progressionRoleIds} from "@/features/tools/progression-routes";
import {
  decodeProgressionRouteState,
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
  return buildPageMetadata(locale, "/tools/progression-route", copy.progressionRouteTitle, copy.progressionRouteDescription, "WARDOGS progression, level up, unlock guide, WARDOGS XP, rank rewards, progression planner");
}

export default async function ProgressionRoutePage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const relatedLinks = await buildToolRelatedLinks("progression-route", locale);
  const headerT = await getTranslations({locale: locale, namespace: "nav"});
  const copy = getToolCopy(locale);
  const routes = getProgressionRoutes(locale);
  const initialState = decodeProgressionRouteState("", progressionRoleIds);

  return (
    <main className="site-container py-10 md:py-16">
      <ToolPageHeader toolId="progression-route" eyebrow={copy.progressionRouteEyebrow} title={copy.progressionRouteTitle} description={copy.progressionRouteDescription} actions={[{href: `/${locale}/tools`, label: headerT("toolsHome")}]} />
      <ProgressionRoute copy={copy} initialState={initialState} routes={routes} />
      <ToolRelatedGuides model={relatedLinks} locale={locale} />
    </main>
  );
}
