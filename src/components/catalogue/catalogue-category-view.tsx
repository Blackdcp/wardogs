import Image from "next/image";
import {ArrowLeft, Boxes} from "lucide-react";
import {getCatalogueGroup} from "@/features/catalogue/catalogue-groups";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";
import type {CatalogueRecord, CatalogueRecordType} from "@/features/catalogue/catalogue-types";
import type {Locale} from "@/config/site";
import {ItemCatalogGuide, type RecordLinkedCatalogGuide} from "@/features/items/item-catalog-guide";
import type {CatalogGuide} from "@/features/items/item-catalog-guides";
import type {ItemTypeId} from "@/features/items/item-library";
import {assetPath} from "@/lib/assets";
import {publicRoutePath} from "@/lib/public-url";
import {CatalogueExplorer} from "./catalogue-explorer";
import {CatalogueBuildNotice} from "./catalogue-build-notice";
import {getLocalizedCatalogueGroup, getLocalizedCatalogueRecords} from "@/features/catalogue/catalogue-localization";
import {getItemUi} from "@/features/items/item-ui";

type CatalogueCategoryViewProps = {
  guide: CatalogGuide;
  locale: Locale;
};

type CategoryHero = {
  image: string;
  imageAlt: string;
  imageFit: "cover" | "contain";
};

export const categoryHeroes: Record<ItemTypeId, CategoryHero> = {
  weapons: {image: "/images/catalogue/banners/weapons-1280.webp", imageAlt: "WARDOGS weapons on the battlefield", imageFit: "cover"},
  vehicles: {image: "/images/catalogue/banners/vehicles-1280.webp", imageAlt: "WARDOGS vehicles in combat", imageFit: "cover"},
  ammo: {image: "/images/catalogue/ammo/556x45mm.webp", imageAlt: "5.56x45mm ammunition box", imageFit: "contain"},
  attachments: {image: "/images/catalogue/banners/attachments-1280.webp", imageAlt: "WARDOGS weapon attachments", imageFit: "cover"},
  gear: {image: "/images/catalogue/gear/heavy-armor.webp", imageAlt: "WARDOGS heavy armor", imageFit: "contain"},
  equipment: {image: "/images/catalogue/banners/meta-1280.webp", imageAlt: "WARDOGS tactical equipment", imageFit: "cover"},
  loadouts: {image: "/images/catalogue/banners/loadouts-1280.webp", imageAlt: "WARDOGS squad loadout", imageFit: "cover"}
};

function normalizedRecordName(value: string) {
  const normalized = value.normalize("NFKC").trim().toLocaleLowerCase("en-US").replace(/[^a-z0-9]/g, "");
  return normalized === "maws" ? "maaws" : normalized;
}

export function matchCatalogueGuideRecords(
  guide: CatalogGuide,
  records: readonly CatalogueRecord[]
): RecordLinkedCatalogGuide {
  const uniqueRecords = new Map<string, CatalogueRecord | null>();

  for (const record of records) {
    if (record.type !== guide.id) continue;
    const key = normalizedRecordName(record.name);
    uniqueRecords.set(key, uniqueRecords.has(key) ? null : record);
  }

  return {
    ...guide,
    sections: guide.sections.map((section) => ({
      ...section,
      rows: section.rows.map((catalogueRow) => {
        const record = uniqueRecords.get(normalizedRecordName(catalogueRow.cells[0]));
        if (!record) return catalogueRow;
        return {
          ...catalogueRow,
          recordSlug: record.slug,
          detailStatus: record.detailStatus,
          detailHref: record.detailHref
        };
      })
    }))
  };
}

function hasImageExplorer(type: ItemTypeId): type is CatalogueRecordType {
  return type === "weapons" || type === "vehicles" || type === "ammo" || type === "attachments" || type === "gear";
}

export function CatalogueCategoryView({guide, locale}: CatalogueCategoryViewProps) {
  const hero = categoryHeroes[guide.id];
  const records = hasImageExplorer(guide.id) ? getLocalizedCatalogueRecords(getCatalogueRecords(guide.id), locale) : [];
  const baseGroup = hasImageExplorer(guide.id) ? getCatalogueGroup(guide.id) : undefined;
  const group = baseGroup ? getLocalizedCatalogueGroup(baseGroup, locale) : undefined;
  const linkedGuide = records.length > 0 ? matchCatalogueGuideRecords(guide, records) : guide;
  const ui = getItemUi(locale);

  return (
    <>
      <section className="relative min-h-[28rem] overflow-hidden border-b border-[#2c3631] bg-[#090c0a] md:min-h-[34rem]" data-catalogue-category-hero>
        <Image
          alt={guide.heroImageAlt ?? hero.imageAlt}
          className={hero.imageFit === "contain" ? "object-contain p-8 opacity-65 md:p-14" : "object-cover opacity-60"}
          fill
          priority
          sizes="100vw"
          src={assetPath(hero.image)}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[#080b09]/60" />
        <div className="site-container relative flex min-h-[28rem] flex-col justify-end py-12 md:min-h-[34rem] md:py-16">
          <a className="mb-auto inline-flex min-h-11 w-fit items-center gap-2 text-sm text-[#9bd1b3] hover:text-white" href={publicRoutePath(`/${locale}/items`)}>
            <ArrowLeft aria-hidden="true" size={16} />{ui.allItems}
          </a>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#e2bc61]">
            <Boxes aria-hidden="true" className="size-4" />
            {ui.itemCategory}
          </p>
          <h1 className="display-font mt-4 max-w-4xl text-5xl leading-none text-white md:text-7xl">{guide.title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#d0dad5] md:text-lg">{guide.description}</p>
        </div>
      </section>

      <CatalogueBuildNotice locale={locale} />

      {group && records.length > 0 ? (
        <CatalogueExplorer
          featuredImage={hero.image}
          filters={group.filters}
          labels={{
            heading: `${ui.explore}: ${group.label}`,
            searchLabel: `${ui.search}: ${group.label}`,
            searchPlaceholder: ui.searchPlaceholder,
            allFilterLabel: ui.all,
            resultLabel: ui.recordsShown
          }}
          locale={locale}
          records={records}
        />
      ) : null}

      <ItemCatalogGuide guide={linkedGuide} locale={locale} />
    </>
  );
}
