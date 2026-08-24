import Image from "next/image";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Archive, ArrowRight, ShieldCheck} from "lucide-react";
import {CatalogueCategoryCard} from "@/components/catalogue/catalogue-category-card";
import {JsonLd} from "@/components/seo/json-ld";
import {StatusBadge} from "@/components/ui/status-badge";
import {isLocale, locales, type Locale} from "@/config/site";
import {catalogueGroups} from "@/features/catalogue/catalogue-groups";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import type {CatalogueRecord, CatalogueRecordType} from "@/features/catalogue/catalogue-types";
import {getCatalogGuide} from "@/features/items/item-catalog-guides";
import {getLocalizedCatalogGuide, getLocalizedCatalogueRecords} from "@/features/catalogue/catalogue-localization";
import {getFeaturedItems, itemTypes, type ItemTypeId} from "@/features/items/item-library";
import {getLocalizedItem, getLocalizedItemType} from "@/features/items/item-localization";
import {getItemUi} from "@/features/items/item-ui";
import {localizedItemRoutePath, resolveItemRouteTarget} from "@/features/items/item-route-availability";
import {Link} from "@/i18n/navigation";
import {assetPath} from "@/lib/assets";
import {publicRoutePath} from "@/lib/public-url";
import {buildItemHubMetadata} from "@/lib/item-metadata";
import {buildItemIndexJsonLd} from "@/lib/item-structured-data";
import {getTranslations} from "next-intl/server";
import {AdsterraDisplayBanner} from "@/components/ads/adsterra-display-banner";
import {AdsterraNativeBanner} from "@/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "@/components/ads/adsterra-smartlink";

type PageProps = {params: Promise<{locale: string}>};

type CategoryMedia = {
  image: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
};

type PublishedPreviewRecord = CatalogueRecord & {
  detailStatus: "published";
  detailHref: NonNullable<CatalogueRecord["detailHref"]>;
};

const categoryMedia: Record<ItemTypeId, CategoryMedia> = {
  weapons: {image: "/images/catalogue/banners/weapons-1280.webp", imageAlt: "WARDOGS weapons catalogue banner"},
  vehicles: {image: "/images/catalogue/banners/vehicles-1280.webp", imageAlt: "WARDOGS vehicles catalogue banner"},
  ammo: {image: "/images/catalogue/ammo/556x45mm.webp", imageAlt: "5.56x45mm WARDOGS ammunition", imageFit: "contain"},
  attachments: {image: "/images/catalogue/banners/attachments-1280.webp", imageAlt: "WARDOGS attachments catalogue banner"},
  gear: {image: "/images/catalogue/gear/heavy-armor.webp", imageAlt: "WARDOGS heavy armor", imageFit: "contain"},
  equipment: {image: "/images/catalogue/banners/meta-1280.webp", imageAlt: "WARDOGS tactical equipment catalogue banner"},
  loadouts: {image: "/images/catalogue/banners/loadouts-1280.webp", imageAlt: "WARDOGS loadout planning catalogue banner"}
};

const previewSlugs: Record<"weapons" | "vehicles", readonly string[]> = {
  weapons: ["a-91", "amp-9", "compound-bow"],
  vehicles: ["bobcat", "l2a6", "uh-1y"]
};

const previewSizes = "(min-width: 1280px) 386px, (min-width: 640px) calc(33vw - 36px), calc(100vw - 32px)";

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  return buildItemHubMetadata(locale);
}

function getPreviewRecords(type: "weapons" | "vehicles", locale: Locale): readonly PublishedPreviewRecord[] {
  const records = getLocalizedCatalogueRecords(getCatalogueRecords(type), locale);
  return previewSlugs[type].map((slug) => {
    const record = records.find((candidate) => candidate.slug === slug);
    if (!record || record.detailStatus !== "published" || !record.detailHref) {
      throw new Error(`Missing published ${type} catalogue preview: ${slug}`);
    }
    return record as PublishedPreviewRecord;
  });
}

function CataloguePreviewRow({locale, type, title, description}: {locale: Locale; type: "weapons" | "vehicles"; title: string; description: string}) {
  const records = getPreviewRecords(type, locale);
  const ui = getItemUi(locale);
  const headingId = `featured-${type}`;

  return (
    <section data-catalogue-preview-row aria-labelledby={headingId} className="border-t border-[#354039] py-9 first:border-t-0 md:py-11">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase text-[#d9a93a]">{ui.modelPreview}</p>
          <h2 id={headingId} className="display-font mt-2 text-3xl leading-tight text-[#f2f5f3] md:text-4xl">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{description}</p>
        </div>
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[#79d19c] hover:text-white" href={`/items/${type}`}>
          {ui.viewAll}: {getLocalizedItemType(itemTypes.find((itemType) => itemType.id === type)!, locale).label}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <ul className="mt-6 grid gap-5 sm:grid-cols-3">
        {records.map((record) => (
          <li data-catalogue-preview key={record.slug} className="min-w-0 border-t border-[#354039] pt-4">
            <a
              className="group block h-full"
              href={publicRoutePath(localizedItemRoutePath(resolveItemRouteTarget(locale, record.detailHref)))}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-[#090c0a]">
                <Image src={assetPath(record.image)} alt={record.imageAlt} fill sizes={previewSizes} className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]" />
              </span>
              <div className="pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone="warning">{ui.preRelease}</StatusBadge>
                  <span className="text-xs uppercase text-[#829087]">{record.subtype}</span>
                </div>
                <h3 className="display-font mt-3 text-2xl leading-tight text-white group-hover:text-[#79d19c]">{record.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#a8b4ae]">{record.summary}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function catalogueCategories(locale: Locale) {
  const groupedTypes = new Set<CatalogueRecordType>(catalogueGroups.map((group) => group.type));

  return itemTypes.map((itemType) => {
    if (itemType.id !== "equipment" && itemType.id !== "loadouts" && !groupedTypes.has(itemType.id)) {
      throw new Error(`Missing catalogue group for ${itemType.id}`);
    }
    const guide = getCatalogGuide(itemType.id);
    if (!guide) throw new Error(`Missing catalogue guide for ${itemType.id}`);
    const localizedType = getLocalizedItemType(itemType, locale);
    const localizedGuide = getLocalizedCatalogGuide(guide, locale);
    return {...localizedType, ...categoryMedia[itemType.id], imageAlt: localizedType.imageAlt ?? categoryMedia[itemType.id].imageAlt, count: localizedGuide.countLabel};
  });
}

export default async function ItemsPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale: Locale = requestedLocale;
  const categories = catalogueCategories(locale);
  const featured = getFeaturedItems(6).map((item) => getLocalizedItem(item, locale));
  const ui = getItemUi(locale);
  const adsT = await getTranslations({locale, namespace: "ads"});

  return (
    <main>
      <JsonLd data={buildItemIndexJsonLd(locale)} />

      <section data-catalogue-hero className="border-b border-[#2c3631] bg-[#0d110f]">
        <div className="site-container py-5 sm:py-7">
          <div className="relative aspect-[4/5] min-h-[420px] overflow-hidden border-y border-[#354039] sm:aspect-[16/7] sm:min-h-[360px] lg:aspect-[18/5]">
            <Image
              src={assetPath("/images/catalogue/banners/thegame-1280.webp")}
              alt={ui.hubDescription}
              fill
              priority
              sizes="(min-width: 1280px) 1216px, calc(100vw - 32px)"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[#070a08]/70" />
            <div className="absolute inset-0 flex items-end p-6 sm:p-8 lg:p-10">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[#d9a93a]">
                  <Archive aria-hidden="true" className="size-4" />
                  {ui.hubEyebrow}
                </p>
                <h1 className="display-font mt-4 text-4xl leading-none text-white sm:text-5xl lg:text-6xl">{ui.hubTitle}</h1>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-[#d4ddd8] sm:text-base sm:leading-7">
                  {ui.hubDescription}
                </p>
                <div className="mt-5">
                  <StatusBadge tone="warning">{ui.alphaSnapshot}</StatusBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-2">
        <AdsterraDisplayBanner label={adsT("label")} placement="horizontal" />
        <AdsterraNativeBanner label={adsT("label")} />
        <AdsterraSmartlink cta={adsT("smartlinkCta")} description={adsT("smartlinkDescription")} label={adsT("sponsored")} />
      </section>

      <section className="site-container py-12 md:py-16" aria-labelledby="catalogue-categories-title">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase text-[#68bd8d]">{ui.indexesEyebrow}</p>
          <h2 className="display-font mt-2 text-3xl leading-tight text-white md:text-4xl" id="catalogue-categories-title">{ui.browseTitle}</h2>
          <p className="mt-4 text-sm leading-6 text-[#a8b4ae] md:text-base">{ui.browseDescription}</p>
        </div>
        <ul className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CatalogueCategoryCard
              key={category.id}
              title={category.label}
              description={category.description}
              count={category.count}
              href={category.href}
              image={category.image}
              imageAlt={category.imageAlt}
              imageFit={category.imageFit}
            />
          ))}
        </ul>
      </section>

      <section data-evidence-legend aria-labelledby="evidence-legend-title" className="border-y border-[#2c3631] bg-[#111512]">
        <div className="site-container py-9 md:py-11">
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-5 text-[#68bd8d]" />
            <h2 id="evidence-legend-title" className="display-font text-2xl text-white md:text-3xl">{ui.evidenceTitle}</h2>
          </div>
          <dl className="mt-6 grid gap-6 md:grid-cols-3 md:gap-0">
            <div className="border-t border-[#354039] pt-4 md:border-r md:pr-6">
              <dt className="font-semibold text-[#f2f5f3]">{ui.official}</dt>
              <dd className="mt-2 text-sm leading-6 text-[#a8b4ae]">{ui.officialDescription}</dd>
            </div>
            <div className="border-t border-[#354039] pt-4 md:border-r md:px-6">
              <dt className="font-semibold text-[#f2f5f3]">{ui.verified}</dt>
              <dd className="mt-2 text-sm leading-6 text-[#a8b4ae]">{ui.verifiedDescription}</dd>
            </div>
            <div className="border-t border-[#354039] pt-4 md:pl-6">
              <dt className="font-semibold text-[#f2f5f3]">{ui.preRelease}</dt>
              <dd className="mt-2 text-sm leading-6 text-[#a8b4ae]">{ui.preReleaseDescription}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="site-container py-3 md:py-5">
        <CataloguePreviewRow
          locale={locale}
          type="weapons"
          title={ui.featuredWeapons}
          description={ui.featuredWeaponsDescription}
        />
        <CataloguePreviewRow
          locale={locale}
          type="vehicles"
          title={ui.featuredVehicles}
          description={ui.featuredVehiclesDescription}
        />
      </div>

      <section className="border-t border-[#2c3631] bg-[#111512]" aria-labelledby="published-guides-title">
        <div className="site-container py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase text-[#68bd8d]">{ui.publishedAnalysis}</p>
            <h2 id="published-guides-title" className="display-font mt-2 text-3xl text-white md:text-4xl">{ui.detailedFieldGuides}</h2>
          </div>
          <ul className="mt-7 grid gap-x-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((item) => (
              <li className="border-t border-[#354039]" key={item.slug}>
                <Link
                  className="group block min-h-48 py-5"
                  href={resolveItemRouteTarget(locale, `/items/${item.type}/${item.slug}`).pathname}
                  locale={resolveItemRouteTarget(locale, `/items/${item.type}/${item.slug}`).locale}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={item.status === "official" ? "accent" : "warning"}>{item.statusLabel}</StatusBadge>
                    <span className="text-xs uppercase text-[#7f8e87]">{item.subtype}</span>
                  </div>
                  <h3 className="display-font mt-4 text-2xl leading-tight text-white group-hover:text-[#79d19c]">WARDOGS {item.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#a8b4ae]">{item.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
