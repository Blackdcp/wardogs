import {buildToolRelatedLinks, ToolRelatedGuides} from "@/components/tools/tool-related-guides";
import {ToolPageHeader} from "@/components/tools/tool-page-header";
import {getTranslations} from "next-intl/server";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {AmmoMatcher} from "@/components/tools/ammo-matcher";
import {EquipmentCompatibility} from "@/components/tools/equipment-compatibility";
import {isLocale, locales} from "@/config/site";
import {getAmmoMatcherDataset} from "@/features/tools/ammo-matcher-data";
import {getCompatibilityDataset} from "@/features/tools/equipment-compatibility";
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
  return buildPageMetadata(locale, "/tools/ammo-matcher", copy.ammoMatcherTitle, copy.ammoMatcherDescription, "WARDOGS ammo, WARDOGS ammunition, ammo matcher, bullet types, WARDOGS caliber, weapon ammo compatibility");
}

export default async function AmmoMatcherPage({params}: PageProps) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const relatedLinks = await buildToolRelatedLinks("ammo-matcher", locale);
  const headerT = await getTranslations({locale: locale, namespace: "nav"});
  const copy = getToolCopy(locale);
  const dataset = getAmmoMatcherDataset(locale);
  const initialState = decodeAmmoMatcherState(
    "",
    dataset.weapons.map(({slug}) => slug),
    dataset.ammo.map(({slug}) => slug),
  );

  return (
    <main className="site-container py-10 md:py-16">
      <ToolPageHeader toolId="ammo-matcher" eyebrow={copy.ammoMatcherEyebrow} title={copy.ammoMatcherTitle} description={copy.ammoMatcherDescription} actions={[{href: `/${locale}/tools`, label: headerT("toolsHome")}]} />
      <AmmoMatcher copy={copy} dataset={dataset} initialState={initialState} />
      <EquipmentCompatibility dataset={getCompatibilityDataset(locale)} locale={locale} />
      <ToolRelatedGuides model={relatedLinks} locale={locale} />
    </main>
  );
}
