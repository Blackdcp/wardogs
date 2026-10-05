import {buildToolRelatedLinks, ToolRelatedGuides} from "@/components/tools/tool-related-guides";
import {ToolPageHeader} from "@/components/tools/tool-page-header";
import {getTranslations} from "next-intl/server";
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
  return buildPageMetadata(locale, "/tools/weapon-compare", copy.weaponCompareTitle, copy.weaponCompareDescription, "WARDOGS weapon comparison, damage stats, DPS calculator, best weapons, WARDOGS gun stats, weapon tier list");
}

export default async function WeaponComparePage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const relatedLinks = await buildToolRelatedLinks("weapon-compare", locale);
  const headerT = await getTranslations({locale: locale, namespace: "nav"});
  const copy = getToolCopy(locale);
  const weapons = getComparableWeapons(locale);
  const initialState = decodeWeaponCompareState("", weapons.map(({slug}) => slug));

  return (
    <main className="site-container py-10 md:py-16">
      <ToolPageHeader toolId="weapon-compare" eyebrow={copy.weaponCompareEyebrow} title={copy.weaponCompareTitle} description={copy.weaponCompareDescription} actions={[{href: `/${locale}/tools`, label: headerT("toolsHome")}]} />
      <WeaponCompare copy={copy} initialState={initialState} weapons={weapons} />
      <ToolRelatedGuides model={relatedLinks} locale={locale} />
    </main>
  );
}
