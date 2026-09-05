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
  return buildPageMetadata(locale, "/tools/system-check", copy.systemTitle, copy.systemDescription);
}

export default async function SystemCheckPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const copy = getToolCopy(requestedLocale as Locale);
  return <main className="site-container py-10 md:py-16"><header className="mb-8 max-w-3xl"><p className="font-mono text-xs uppercase text-[#69c78f]">{copy.officialBasis}</p><h1 id="system-check-form" className="display-font mt-3 text-balance text-3xl leading-tight text-white sm:text-4xl md:text-5xl">{copy.systemTitle}</h1><p className="mt-4 text-base leading-7 text-[#a8b4ae]">{copy.systemDescription}</p></header><SystemChecker copy={copy} /></main>;
}
