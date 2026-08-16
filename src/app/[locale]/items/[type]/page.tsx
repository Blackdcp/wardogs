import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowLeft, Boxes} from "lucide-react";
import {isLocale, locales, type Locale} from "@/config/site";
import {getItemType, getItemsByType, itemTypes} from "@/features/items/item-library";
import {Link} from "@/i18n/navigation";
import {buildPageMetadata} from "@/lib/metadata";
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
  return buildPageMetadata(
    locale,
    `/items/${itemType.id}`,
    `WARDOGS ${itemType.label} - Evidence-Labeled Item Guide`,
    `${itemType.description} Includes evidence labels, source notes, pre-release caveats, and related WARDOGS guides.`
  );
}

export default async function ItemTypePage({params}: PageProps) {
  const {locale: requestedLocale, type} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const itemType = getItemType(type);
  if (!itemType) notFound();
  const items = getItemsByType(itemType.id);

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
          <h1 className="display-font mt-4 max-w-4xl text-5xl leading-none text-white md:text-7xl">WARDOGS {itemType.label}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#a8b4ae] md:text-lg">{itemType.description}</p>
        </div>
      </section>

      <section className="site-container py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              <h2 className="display-font mt-4 text-2xl text-white">WARDOGS {item.name}</h2>
              <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{item.summary}</p>
              <p className="mt-5 text-sm font-semibold text-[#7fd0a1]">Read item guide</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
