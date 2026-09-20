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
  return buildPageMetadata(locale, "/tools/progression-route", copy.progressionRouteTitle, copy.progressionRouteDescription);
}

export default async function ProgressionRoutePage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const copy = getToolCopy(locale);
  const routes = getProgressionRoutes(locale);
  const initialState = decodeProgressionRouteState("", progressionRoleIds);

  return (
    <main className="site-container py-10 md:py-16">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-xs uppercase text-[#69c78f]">{copy.progressionRouteEyebrow}</p>
        <h1 className="display-font mt-3 text-balance text-3xl leading-tight text-white sm:text-4xl md:text-5xl">{copy.progressionRouteTitle}</h1>
        <p className="mt-4 text-base leading-7 text-[#a8b4ae]">{copy.progressionRouteDescription}</p>
      </header>
      <ProgressionRoute copy={copy} initialState={initialState} routes={routes} />
    </main>
  );
}
