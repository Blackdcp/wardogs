import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {WeaponCompare} from "@/components/tools/weapon-compare";
import {isLocale, locales} from "@/config/site";
import {getComparableWeapons} from "@/features/tools/weapon-compare-data";
import {decodeWeaponCompareState} from "@/features/tools/share-state";
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
  return buildPageMetadata(locale, "/tools/weapon-compare", copy.weaponCompareTitle, copy.weaponCompareDescription);
}

export default async function WeaponComparePage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const copy = getToolCopy(locale);
  const weapons = getComparableWeapons(locale);
  const initialState = decodeWeaponCompareState("", weapons.map(({slug}) => slug));

  return (
    <main className="site-container py-10 md:py-16">
      <header className="mb-8 max-w-3xl">
        <p className="font-mono text-xs uppercase text-[#69c78f]">{copy.weaponCompareEyebrow}</p>
        <h1 className="display-font mt-3 text-balance text-3xl leading-tight text-white sm:text-4xl md:text-5xl">{copy.weaponCompareTitle}</h1>
        <p className="mt-4 text-base leading-7 text-[#a8b4ae]">{copy.weaponCompareDescription}</p>
      </header>
      <WeaponCompare copy={copy} initialState={initialState} weapons={weapons} />
    </main>
  );
}
