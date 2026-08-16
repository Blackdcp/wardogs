import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowLeft, Boxes} from "lucide-react";
import {isLocale, locales, type Locale} from "@/config/site";
import {getItemType, getItemsByType, itemTypes} from "@/features/items/item-library";
import {getCatalogGuide} from "@/features/items/item-catalog-guides";
import {ItemCatalogGuide} from "@/features/items/item-catalog-guide";
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
  return buildCatalogGuideMetadata(locale, catalogueGuide);
}

export default async function ItemTypePage({params}: PageProps) {
  const {locale: requestedLocale, type} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const itemType = getItemType(type);
  if (!itemType) notFound();
  const items = getItemsByType(itemType.id);
  const catalogueGuide = getCatalogGuide(itemType.id);
  if (!catalogueGuide) notFound();

  return (
    <main>
      <JsonLd data={buildItemTypeJsonLd(locale, itemType.id)} />
      <section className="border-b border-[#2c3631] bg-[#111512] py-14 md:py-20">
        <div className="site-container">
          <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-[#8bb59d] hover:text-white" href="/items">
            <ArrowLeft aria-hidden="true" size={16} />All Items
          </Link>
          <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
            <Boxes aria-hidden="true" className="size-4" />
            WARDOGS Item Category
          </p>
          <h1 className="display-font mt-4 max-w-4xl text-5xl leading-none text-white md:text-7xl">{catalogueGuide.title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#a8b4ae] md:text-lg">{catalogueGuide.description}</p>
        </div>
      </section>

      <ItemCatalogGuide guide={catalogueGuide} />

      {items.length > 0 ? (
        <section className="border-t border-[#2c3631] bg-[#101411]">
          <div className="site-container py-12 md:py-16">
            <p className="font-mono text-xs uppercase text-[#68bd8d]">Standalone articles</p>
            <h2 className="display-font mt-2 text-3xl text-white md:text-4xl">Detailed {itemType.label} Guides</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Link
                  href={`/items/${item.type}/${item.slug}`}
                  className="border border-[#2c3631] bg-[#151b18] p-5 transition-colors hover:border-[#4d946d]"
                  key={item.slug}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={item.status === "official" ? "accent" : "warning"}>{item.statusLabel}</StatusBadge>
                    <span className="text-xs uppercase text-[#7f8e87]">{item.subtype}</span>
                  </div>
                  <h3 className="display-font mt-4 text-2xl text-white">WARDOGS {item.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{item.summary}</p>
                  <p className="mt-5 text-sm font-semibold text-[#7fd0a1]">Read item guide</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
