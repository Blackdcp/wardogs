import {buildToolRelatedLinks, ToolRelatedGuides} from "@/components/tools/tool-related-guides";
import {ToolPageHeader} from "@/components/tools/tool-page-header";
import {getTranslations} from "next-intl/server";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {LoadoutBudget} from "@/components/tools/loadout-budget";
import {isLocale, locales, type Locale} from "@/config/site";
import {getToolCopy} from "@/features/tools/tool-copy";
import {buildPageMetadata} from "@/lib/metadata";
import {ReleaseImpactPanel} from "@/components/releases/release-impact-panel";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() { return locales.map((locale) => ({locale})); }

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const copy = getToolCopy(locale);
  return buildPageMetadata(locale, "/tools/loadout-budget", copy.budgetTitle, copy.budgetDescription, "WARDOGS loadout, WARDOGS budget calculator, gear cost, loadout planner, WARDOGS equipment, cheapest loadout");
}

export default async function LoadoutBudgetPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const relatedLinks = await buildToolRelatedLinks("loadout-budget", requestedLocale);
  const headerT = await getTranslations({locale: requestedLocale, namespace: "nav"});
  const copy = getToolCopy(requestedLocale as Locale);
  return (
    <main className="site-container py-10 md:py-16">
      <ToolPageHeader toolId="loadout-budget" titleId="loadout-budget-form" eyebrow={copy.buildWarning} title={copy.budgetTitle} description={copy.budgetDescription} actions={[{href: `/${requestedLocale}/tools`, label: headerT("toolsHome")}]} />
      <LoadoutBudget copy={copy} />
      <ReleaseImpactPanel locale={requestedLocale} path="/tools/loadout-budget" />
      <ToolRelatedGuides model={relatedLinks} locale={requestedLocale} />
    </main>
  );
}
