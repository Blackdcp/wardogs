import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Archive, ShieldCheck} from "lucide-react";
import {isLocale, locales, type Locale} from "@/config/site";
import {itemTypes, getFeaturedItems, getItemsByType} from "@/features/items/item-library";
import {Link} from "@/i18n/navigation";
import {buildPageMetadata} from "@/lib/metadata";
import {buildItemIndexJsonLd} from "@/lib/item-structured-data";
import {JsonLd} from "@/components/seo/json-ld";
import {StatusBadge} from "@/components/ui/status-badge";

type PageProps = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata(
    locale,
    "/items",
    "WARDOGS Items - Weapons, Vehicles & Equipment",
    "Browse WARDOGS item pages for weapons, vehicles, equipment, Mortar, Mobile FOB, helicopters, tanks, evidence labels, and pre-release caveats."
  );
}

export default async function ItemsPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const featured = getFeaturedItems(6);

  return (
    <main>
      <JsonLd data={buildItemIndexJsonLd(locale)} />
      <section className="border-b border-[#2c3631] bg-[#111512] py-16 md:py-24">
        <div className="site-container">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#d9a93a]">
            <Archive aria-hidden="true" className="size-4" />
            Evidence-Labeled Database
          </p>
          <h1 className="display-font mt-4 max-w-4xl text-5xl leading-none text-white md:text-7xl">WARDOGS Items</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#a8b4ae] md:text-lg">
            Weapons, vehicles, and equipment pages built from official pages and creator footage. Every pre-release item is labeled so players can separate usable tactics from unconfirmed final stats.
          </p>
        </div>
      </section>

      <section className="site-container py-12 md:py-16" aria-labelledby="item-types-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase text-[#68bd8d]">Browse by type</p>
            <h2 className="display-font mt-2 text-3xl text-white md:text-4xl" id="item-types-title">Item Categories</h2>
          </div>
          <StatusBadge tone="warning">No final stat claims</StatusBadge>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {itemTypes.map((itemType) => (
            <Link
              className="group border border-[#2c3631] bg-[#151b18] p-5 transition-colors hover:border-[#4d946d]"
              href={itemType.href}
              key={itemType.id}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="display-font text-2xl text-white">{itemType.label}</h3>
                <span className="font-mono text-xs uppercase text-[#68bd8d]">{getItemsByType(itemType.id).length} items</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{itemType.description}</p>
              <p className="mt-5 text-sm font-semibold text-[#7fd0a1] group-hover:text-white">Open {itemType.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[#2c3631] bg-[#111512]">
        <div className="site-container py-12 md:py-16">
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-5 text-[#68bd8d]" />
            <h2 className="display-font text-3xl text-white">First Indexable Item Pages</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((item) => (
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
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
