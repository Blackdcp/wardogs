import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {isLocale, locales, type Locale} from "@/config/site";
import {CatalogueCategoryView} from "@/components/catalogue/catalogue-category-view";
import {getItemType, getStandaloneItemsByType, itemTypes} from "@/features/items/item-library";
import {getCatalogGuide} from "@/features/items/item-catalog-guides";
import {getLocalizedCatalogGuide} from "@/features/catalogue/catalogue-localization";
import {getLocalizedItem, getLocalizedItemType} from "@/features/items/item-localization";
import {getItemUi} from "@/features/items/item-ui";
import {resolveItemRouteTarget} from "@/features/items/item-route-availability";
import {Link} from "@/i18n/navigation";
import {buildCatalogGuideMetadata} from "@/lib/item-metadata";
import {buildItemTypeJsonLd} from "@/lib/item-structured-data";
import {JsonLd} from "@/components/seo/json-ld";
import {StatusBadge} from "@/components/ui/status-badge";

type PageProps = {params: Promise<{locale: string; type: string}>};

export function generateStaticParams() {
  return locales.flatMap((locale) => itemTypes.map((itemType) => ({locale, type: itemType.id})));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, type} = await params;
  if (!isLocale(locale)) return {};
  const itemType = getItemType(type);
  if (!itemType) return {};
  const catalogueGuide = getCatalogGuide(itemType.id);
  if (!catalogueGuide) return {};
  return buildCatalogGuideMetadata(locale, getLocalizedCatalogGuide(catalogueGuide, locale));
}

export default async function ItemTypePage({params}: PageProps) {
  const {locale: requestedLocale, type} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const baseItemType = getItemType(type);
  if (!baseItemType) notFound();
  const itemType = getLocalizedItemType(baseItemType, locale);
  const items = getStandaloneItemsByType(baseItemType.id).map((item) => getLocalizedItem(item, locale));
  const baseCatalogueGuide = getCatalogGuide(baseItemType.id);
  if (!baseCatalogueGuide) notFound();
  const catalogueGuide = getLocalizedCatalogGuide(baseCatalogueGuide, locale);
  const ui = getItemUi(locale);

  return (
    <main>
      <JsonLd data={buildItemTypeJsonLd(locale, itemType.id)} />
      <CatalogueCategoryView guide={catalogueGuide} locale={locale} />

      {items.length > 0 ? (
        <section className="border-t border-[#2c3631] bg-[#101411]">
          <div className="site-container py-12 md:py-16">
            <p className="font-mono text-xs uppercase text-[#68bd8d]">{ui.standaloneArticles}</p>
            <h2 className="display-font mt-2 text-3xl text-white md:text-4xl">{itemType.label}: {ui.detailedGuides}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const target = resolveItemRouteTarget(locale, `/items/${item.type}/${item.slug}`);
                return (
                  <Link
                    href={target.pathname}
                    locale={target.locale}
                    className="border border-[#2c3631] bg-[#151b18] p-5 transition-colors hover:border-[#4d946d]"
                    key={item.slug}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={item.status === "official" ? "accent" : "warning"}>{item.statusLabel}</StatusBadge>
                      <span className="text-xs uppercase text-[#7f8e87]">{item.subtype}</span>
                    </div>
                    <h3 className="display-font mt-4 text-2xl text-white">WARDOGS {item.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{item.summary}</p>
                    <p className="mt-5 text-sm font-semibold text-[#7fd0a1]">{ui.readItemGuide}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
