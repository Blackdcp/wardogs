import Image from "next/image";
import {ArrowUpRight} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {ComponentType, ReactNode} from "react";
import {catalogueGroups} from "@/features/catalogue/catalogue-groups";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import type {CatalogueRecordType} from "@/features/catalogue/catalogue-types";
import type {Locale} from "@/config/site";
import {localizedItemRoutePath, resolveItemRouteTarget} from "@/features/items/item-route-availability";
import {assetPath} from "@/lib/assets";
import {publicRoutePath} from "@/lib/public-url";

type PromotedCatalogueKey = CatalogueRecordType | "loadouts";

export type CatalogueHomeBandEntry = {
  key: PromotedCatalogueKey;
  title: string;
  count: string;
  href: `/items/${string}`;
  image: string;
  imageAlt: string;
  layout: "feature" | "compact";
  imageFit: "cover" | "contain";
};

export type CatalogueHomeModelEntry = {
  key: `${"weapons" | "vehicles"}-${string}`;
  title: string;
  subtype: string;
  href: string;
  image: string;
  imageAlt: string;
};

type CatalogueHomeBandViewProps = {
  heading: string;
  modelHeading?: string;
  entries: readonly CatalogueHomeBandEntry[];
  modelEntries?: readonly CatalogueHomeModelEntry[];
  LinkComponent?: CatalogueLinkComponent;
};

type CatalogueLinkComponent = ComponentType<{className: string; href: string; children: ReactNode}>;

const featureSizes = "(min-width: 1280px) 574px, (min-width: 768px) calc(50vw - 48px), calc(100vw - 32px)";
const compactSizes = "(min-width: 1280px) 277px, (min-width: 768px) calc(25vw - 28px), calc(50vw - 24px)";

function NativeLink({children, ...props}: {className: string; href: string; children: ReactNode}) {
  return <a {...props}>{children}</a>;
}

function CatalogueEntry({entry, LinkComponent}: {entry: CatalogueHomeBandEntry; LinkComponent: CatalogueLinkComponent}) {
  const feature = entry.layout === "feature";

  return (
    <li className="min-w-0 border-t border-[#3a473f]" data-catalogue-entry={entry.key}>
      <LinkComponent className="group block h-full min-w-0 pt-4" href={entry.href}>
        <span className={`relative block overflow-hidden bg-[#090b0a] ${feature ? "aspect-[8/3]" : "aspect-[8/5]"}`}>
          <Image
            src={assetPath(entry.image)}
            alt={entry.imageAlt}
            fill
            sizes={feature ? featureSizes : compactSizes}
            className={`${entry.imageFit === "cover" ? "object-cover" : "object-contain p-3 sm:p-4"} transition-transform duration-300 group-hover:scale-[1.02]`}
          />
        </span>
        <span className={`flex min-w-0 items-start justify-between gap-3 ${feature ? "min-h-24 py-5" : "min-h-24 py-4"}`}>
          <span className="min-w-0">
            <span className={`${feature ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"} display-font block [overflow-wrap:anywhere] leading-tight text-[#f2f5f3] group-hover:text-[#79d19c]`}>
              {entry.title}
            </span>
            <span className="mt-2 block [overflow-wrap:anywhere] text-xs leading-5 text-[#9fada6] sm:text-sm">
              {entry.count}
            </span>
          </span>
          <ArrowUpRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#82938a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#79d19c]" />
        </span>
      </LinkComponent>
    </li>
  );
}

function CatalogueModelEntry({entry}: {entry: CatalogueHomeModelEntry}) {
  return (
    <li className="min-w-0 border-t border-[#3a473f]" data-catalogue-model-entry={entry.key}>
      <a className="group block h-full pt-4" href={entry.href}>
        <span className="relative block aspect-[4/3] overflow-hidden bg-[#090b0a]">
          <Image
            src={assetPath(entry.image)}
            alt={entry.imageAlt}
            fill
            sizes="(min-width: 1280px) 277px, (min-width: 640px) calc(50vw - 36px), calc(100vw - 32px)"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </span>
        <span className="flex min-h-24 items-start justify-between gap-3 py-4">
          <span className="min-w-0">
            <span className="block text-xs uppercase leading-5 text-[#9fada6]">{entry.subtype}</span>
            <h3 className="display-font mt-1 [overflow-wrap:anywhere] text-xl leading-tight text-[#f2f5f3] group-hover:text-[#79d19c]">{entry.title}</h3>
          </span>
          <ArrowUpRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#82938a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#79d19c]" />
        </span>
      </a>
    </li>
  );
}

export function CatalogueHomeBandView({heading, modelHeading = "Published model guides", entries, modelEntries = [], LinkComponent = NativeLink}: CatalogueHomeBandViewProps) {
  const features = entries.filter((entry) => entry.layout === "feature");
  const compact = entries.filter((entry) => entry.layout === "compact");

  return (
    <section data-catalogue-home-band aria-labelledby="catalogue-home-title" className="border-b border-[#26312c] bg-[#151b18] py-16 sm:py-20">
      <div className="site-container">
        <h2 id="catalogue-home-title" className="display-font max-w-3xl text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
          {heading}
        </h2>
        <ul className="mt-9 grid gap-x-5 md:grid-cols-2 md:gap-x-6">
          {features.map((entry) => <CatalogueEntry entry={entry} LinkComponent={LinkComponent} key={entry.key} />)}
        </ul>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 md:grid-cols-4 md:gap-x-5">
          {compact.map((entry) => <CatalogueEntry entry={entry} LinkComponent={LinkComponent} key={entry.key} />)}
        </ul>
        {modelEntries.length > 0 ? (
          <div className="mt-10 border-t border-[#526159] pt-7">
            <p className="font-mono text-xs uppercase text-[#d9a93a]">{modelHeading}</p>
            <ul className="mt-5 grid gap-x-5 sm:grid-cols-2 lg:grid-cols-4">
              {modelEntries.map((entry) => <CatalogueModelEntry entry={entry} key={entry.key} />)}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function observedCount(type: CatalogueRecordType) {
  if (!catalogueGroups.some((group) => group.type === type)) {
    throw new Error(`Missing catalogue group for ${type}`);
  }
  return getCatalogueRecords(type).length;
}

export async function CatalogueHomeBand({locale}: {locale: Locale}) {
  const t = await getTranslations("home.catalogue");
  const {Link} = await import("@/i18n/navigation");
  const entries: CatalogueHomeBandEntry[] = [
    {key: "weapons", title: t("weapons.title"), count: t("weapons.count", {count: observedCount("weapons")}), href: "/items/weapons", image: "/images/catalogue/banners/weapons-1280.webp", imageAlt: t("weapons.imageAlt"), layout: "feature", imageFit: "cover"},
    {key: "vehicles", title: t("vehicles.title"), count: t("vehicles.count", {count: observedCount("vehicles")}), href: "/items/vehicles", image: "/images/catalogue/banners/vehicles-1280.webp", imageAlt: t("vehicles.imageAlt"), layout: "feature", imageFit: "cover"},
    {key: "ammo", title: t("ammo.title"), count: t("ammo.count", {count: observedCount("ammo")}), href: "/items/ammo", image: "/images/catalogue/ammo/556x45mm.webp", imageAlt: t("ammo.imageAlt"), layout: "compact", imageFit: "contain"},
    {key: "attachments", title: t("attachments.title"), count: t("attachments.count", {count: observedCount("attachments")}), href: "/items/attachments", image: "/images/catalogue/banners/attachments-1280.webp", imageAlt: t("attachments.imageAlt"), layout: "compact", imageFit: "cover"},
    {key: "gear", title: t("gear.title"), count: t("gear.count", {count: observedCount("gear")}), href: "/items/gear", image: "/images/catalogue/gear/heavy-armor.webp", imageAlt: t("gear.imageAlt"), layout: "compact", imageFit: "contain"},
    {key: "loadouts", title: t("loadouts.title"), count: t("loadouts.count", {count: 3}), href: "/items/loadouts", image: "/images/catalogue/banners/loadouts-1280.webp", imageAlt: t("loadouts.imageAlt"), layout: "compact", imageFit: "cover"}
  ];
  const modelEntries: CatalogueHomeModelEntry[] = [
    {type: "weapons" as const, slug: "a-91"},
    {type: "weapons" as const, slug: "amp-9"},
    {type: "vehicles" as const, slug: "bobcat"},
    {type: "vehicles" as const, slug: "l2a6"}
  ].map(({type, slug}) => {
    const record = getCatalogueRecords(type).find((candidate) => candidate.slug === slug);
    if (!record || record.detailStatus !== "published" || !record.detailHref) {
      throw new Error(`Missing published homepage model: ${type}/${slug}`);
    }
    return {
      key: `${type}-${slug}` as const,
      title: record.name,
      subtype: record.subtype,
      href: publicRoutePath(localizedItemRoutePath(resolveItemRouteTarget(locale, record.detailHref))),
      image: record.image,
      imageAlt: record.imageAlt
    };
  });

  const LocalizedLink: CatalogueLinkComponent = ({children, href, className}) => (
    <Link className={className} href={href}>{children}</Link>
  );

  return (
    <CatalogueHomeBandView
      heading={t("heading")}
      modelHeading={t("publishedModels")}
      entries={entries}
      modelEntries={modelEntries}
      LinkComponent={LocalizedLink}
    />
  );
}
