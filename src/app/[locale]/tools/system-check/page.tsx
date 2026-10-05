import {buildToolRelatedLinks, ToolRelatedGuides} from "@/components/tools/tool-related-guides";
import {ToolPageHeader} from "@/components/tools/tool-page-header";
import {getTranslations} from "next-intl/server";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {SystemChecker} from "@/components/tools/system-checker";
import {isLocale, locales, type Locale} from "@/config/site";
import {getToolCopy} from "@/features/tools/tool-copy";
import {buildPageMetadata} from "@/lib/metadata";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() { return locales.map((locale) => ({locale})); }

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const copy = getToolCopy(locale);
  return buildPageMetadata(locale, "/tools/system-check", copy.systemTitle, copy.systemDescription, "WARDOGS system requirements, can I run WARDOGS, PC specs, minimum requirements, recommended specs, FPS performance");
}

export default async function SystemCheckPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const relatedLinks = await buildToolRelatedLinks("system-check", requestedLocale);
  const headerT = await getTranslations({locale: requestedLocale, namespace: "nav"});
  const copy = getToolCopy(requestedLocale as Locale);
  return (
    <main className="site-container py-10 md:py-16">
      <ToolPageHeader toolId="system-check" titleId="system-check-form" eyebrow={copy.officialBasis} title={copy.systemTitle} description={copy.systemDescription} actions={[{href: `/${requestedLocale}/tools`, label: headerT("toolsHome")}]} />
      <SystemChecker copy={copy} />
      <ToolRelatedGuides model={relatedLinks} locale={requestedLocale} />
    </main>
  );
}
