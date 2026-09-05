import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {LoadoutBudget} from "@/components/tools/loadout-budget";
import {isLocale, locales, type Locale} from "@/config/site";
import {getToolCopy} from "@/features/tools/tool-copy";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() { return locales.map((locale) => ({locale})); }

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const copy = getToolCopy(locale);
  return buildPageMetadata(locale, "/tools/loadout-budget", copy.budgetTitle, copy.budgetDescription);
}

export default async function LoadoutBudgetPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const copy = getToolCopy(requestedLocale as Locale);
  return <main className="site-container py-10 md:py-16"><header className="mb-8 max-w-3xl"><p className="font-mono text-xs uppercase text-[#69c78f]">{copy.buildWarning}</p><h1 id="loadout-budget-form" className="display-font mt-3 text-balance text-3xl leading-tight text-white sm:text-4xl md:text-5xl">{copy.budgetTitle}</h1><p className="mt-4 text-base leading-7 text-[#a8b4ae]">{copy.budgetDescription}</p></header><LoadoutBudget copy={copy} /></main>;
}
