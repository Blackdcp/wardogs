import {SectionHeading} from "@/components/ui/section-heading";
import type {DiscoveryTask} from "@/features/discovery/discovery-types";
import Image from "next/image";
import {ArrowUpRight} from "lucide-react";
import {getTranslations} from "next-intl/server";
import type {ComponentType, ReactNode} from "react";
import {buildCatalogueHomeModel} from "@/features/catalogue/catalogue-hub-data";
import type {CatalogueRecordType} from "@/features/catalogue/catalogue-types";
import type {Locale} from "@/config/site";
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
  description?: string;
  modelHeading?: string;
  hubHref?: string;
  hubLabel?: string;
  entries: readonly CatalogueHomeBandEntry[];
  modelEntries?: readonly CatalogueHomeModelEntry[];
  sponsoredSlot?: ReactNode;
  LinkComponent?: CatalogueLinkComponent;
};

type CatalogueLinkProps = {className: string; href: string; title: string; children: ReactNode; "data-home-task"?: DiscoveryTask; "data-home-placement"?: "database"};
type CatalogueLinkComponent = ComponentType<CatalogueLinkProps>;

const featureSizes = "(min-width: 1280px) 574px, (min-width: 768px) calc(50vw - 48px), calc(100vw - 32px)";
const compactSizes = "(min-width: 1280px) 277px, (min-width: 768px) calc(25vw - 28px), calc(50vw - 24px)";

function NativeLink({children, ...props}: CatalogueLinkProps) {
  return <a {...props}>{children}</a>;
}

function CatalogueEntry({entry, LinkComponent}: {entry: CatalogueHomeBandEntry; LinkComponent: CatalogueLinkComponent}) {
  const feature = entry.layout === "feature";

  return (
    <li className="min-w-0" data-catalogue-entry={entry.key}>
      <LinkComponent className="group block h-full min-w-0 overflow-hidden rounded-[6px] border border-[#344039] bg-[#111713]" href={entry.href} title={entry.title} data-home-task={entry.key === "weapons" ? "weapons" : "vehicles"} data-home-placement="database">
        <span className={`relative block overflow-hidden bg-[#090b0a] ${feature ? "aspect-[16/5]" : "aspect-[16/9]"}`}>
          <Image
            src={assetPath(entry.image)}
            alt={entry.imageAlt}
            fill
            sizes={feature ? featureSizes : compactSizes}
            className={`${entry.imageFit === "cover" ? "object-cover" : "object-contain p-3 sm:p-4"} transition-transform duration-300 group-hover:scale-[1.02]`}
          />
        </span>
        <span className={`flex min-w-0 items-start justify-between gap-3 ${feature ? "min-h-20 py-4" : "min-h-[76px] py-3"}`}>
          <span className="min-w-0">
            <span className={`${feature ? "text-xl sm:text-2xl" : "text-base sm:text-lg"} display-font block [overflow-wrap:anywhere] leading-tight text-[#f2f5f3] group-hover:text-[#79d19c]`}>
              {entry.title}
            </span>
            <span className="mt-1.5 block [overflow-wrap:anywhere] text-xs leading-5 text-[#9fada6]">
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
    <li className="min-w-0" data-catalogue-model-entry={entry.key}>
      <a aria-label={entry.title} className="group block h-full overflow-hidden rounded-[6px] border border-[#344039] bg-[#111713]" href={entry.href} title={entry.title} data-home-task={entry.key.startsWith("weapons-") ? "weapons" : "vehicles"} data-home-placement="database">
        <span className="relative block aspect-[16/9] overflow-hidden bg-[#090b0a]">
          <Image
            src={assetPath(entry.image)}
            alt={entry.imageAlt}
            fill
            sizes="(min-width: 1280px) 277px, (min-width: 640px) calc(50vw - 36px), calc(100vw - 32px)"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </span>
        <span className="flex min-h-[76px] items-start justify-between gap-3 py-3">
          <span className="min-w-0">
            <span className="block text-xs uppercase leading-5 text-[#9fada6]">{entry.subtype}</span>
            <h3 className="display-font mt-1 [overflow-wrap:anywhere] text-lg leading-tight text-[#f2f5f3] group-hover:text-[#79d19c]">{entry.title}</h3>
          </span>
          <ArrowUpRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#82938a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#79d19c]" />
        </span>
      </a>
    </li>
  );
}

export function CatalogueHomeBandView({heading, description, modelHeading = heading, hubHref = "/items", hubLabel = heading, entries, modelEntries = [], sponsoredSlot, LinkComponent = NativeLink}: CatalogueHomeBandViewProps) {
  const features = entries.filter((entry) => entry.key === "weapons" || entry.key === "vehicles");
  const previews = modelEntries.slice(0, 4);

  return (
    <section data-catalogue-home-band aria-labelledby="catalogue-home-title" className="border-b border-[#26312c] bg-[#0b0e0c] py-10 sm:py-12" data-home-section="database">
      <span aria-hidden="true" className="block h-px w-full" data-home-section-sentinel="database" />
      <div className="site-container">
        <SectionHeading id="catalogue-home-title" title={heading} description={description} />
        <div className="mt-4">
          <LinkComponent className="inline-flex min-h-11 items-center font-semibold text-[#79d19c]" href={hubHref} title={hubLabel} data-home-task="catalogue" data-home-placement="database">{hubLabel}</LinkComponent>
        </div>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {features.map((entry) => <CatalogueEntry entry={entry} LinkComponent={LinkComponent} key={entry.key} />)}
        </ul>
        {previews.length > 0 ? (
          <div className="mt-5">
            <p className="font-mono text-xs uppercase text-[#d9a93a]">{modelHeading}</p>
            <ul className="mt-3 grid grid-flow-col auto-cols-[minmax(140px,1fr)] gap-3 overflow-x-auto">
              {previews.map((entry) => <CatalogueModelEntry entry={entry} key={entry.key} />)}
            </ul>
          </div>
        ) : null}
        {sponsoredSlot ? <aside className="mt-6 border-t border-[#26312c] pt-5" data-home-sponsored-slot="catalogue">{sponsoredSlot}</aside> : null}
      </div>
    </section>
  );
}

export async function CatalogueHomeBand({locale, sponsoredSlot}: {locale: Locale; sponsoredSlot?: ReactNode}) {
  const t = await getTranslations({locale, namespace: "home.catalogue"});
  const sectionT = await getTranslations({locale, namespace: "home.discovery.sections.database"});
  const model = buildCatalogueHomeModel(locale);
  const entries: CatalogueHomeBandEntry[] = model.categories.map((category) => ({
    key: category.id,
    title: category.label,
    count: category.count,
    href: category.href,
    image: category.image,
    imageAlt: category.imageAlt,
    layout: "feature",
    imageFit: category.imageFit ?? "cover"
  }));
  const modelEntries: CatalogueHomeModelEntry[] = model.previews.map((record) => ({
    key: `${record.type as "weapons" | "vehicles"}-${record.slug}`,
    title: record.name,
    subtype: record.subtype,
    href: publicRoutePath(record.href),
    image: record.image,
    imageAlt: record.imageAlt
  }));
  const LocalizedLink: CatalogueLinkComponent = ({children, href, ...props}) => (
    <a aria-label={props.title} {...props} href={publicRoutePath(`/${locale}${href}`)} title={props.title}>{children}</a>
  );
  return <CatalogueHomeBandView heading={sectionT("title")} description={sectionT("description")} modelHeading={t("publishedModels")} hubHref={model.destinations[0].href} hubLabel={model.hubLabel} entries={entries} modelEntries={modelEntries} sponsoredSlot={sponsoredSlot} LinkComponent={LocalizedLink} />;
}
