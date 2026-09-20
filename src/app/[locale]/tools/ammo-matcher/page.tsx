import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {AmmoMatcher} from "@/components/tools/ammo-matcher";
import {isLocale, locales} from "@/config/site";
import {getAmmoMatcherDataset} from "@/features/tools/ammo-matcher-data";
import {decodeAmmoMatcherState} from "@/features/tools/share-state";
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
  return buildPageMetadata(locale, "/tools/ammo-matcher", copy.ammoMatcherTitle, copy.ammoMatcherDescription);
}

export default async function AmmoMatcherPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const copy = getToolCopy(locale);
  const dataset = getAmmoMatcherDataset(locale);
  const initialState = decodeAmmoMatcherState(
    "",
    dataset.weapons.map(({slug}) => slug),
    dataset.ammo.map(({slug}) => slug),
  );

  return (
    <main className="site-container py-10 md:py-16">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-xs uppercase text-[#69c78f]">{copy.ammoMatcherEyebrow}</p>
        <h1 className="display-font mt-3 text-balance text-3xl leading-tight text-white sm:text-4xl md:text-5xl">{copy.ammoMatcherTitle}</h1>
        <p className="mt-4 text-base leading-7 text-[#a8b4ae]">{copy.ammoMatcherDescription}</p>
      </header>
      <AmmoMatcher copy={copy} dataset={dataset} initialState={initialState} />
    </main>
  );
}
