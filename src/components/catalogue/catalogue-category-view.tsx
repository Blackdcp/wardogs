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
import {getCatalogueCategoryMedia} from "@/features/catalogue/catalogue-media";

type CatalogueCategoryViewProps = {
  guide: CatalogGuide;
  locale: Locale;
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

type CatalogueItemType = Exclude<CatalogueRecordType, "maps">;

function hasImageExplorer(type: ItemTypeId): type is CatalogueItemType {
  return type !== "loadouts";
}

export function CatalogueCategoryView({guide, locale}: CatalogueCategoryViewProps) {
  const hero = getCatalogueCategoryMedia(guide.id);
  const records = hasImageExplorer(guide.id) ? getLocalizedCatalogueRecords(getCatalogueRecords(guide.id), locale) : [];
  const baseGroup = hasImageExplorer(guide.id) ? getCatalogueGroup(guide.id) : undefined;
  const group = baseGroup ? getLocalizedCatalogueGroup(baseGroup, locale) : undefined;
  const linkedGuide = records.length > 0 ? matchCatalogueGuideRecords(guide, records) : guide;
  const ui = getItemUi(locale);

  return (
    <>
      <section className="relative min-h-[28rem] overflow-hidden border-b border-[#2c3631] bg-[#090c0a] md:min-h-[34rem]" data-catalogue-category-hero>
        {hero ? (
          <Image
            alt={hero.imageAlt}
            className="object-cover opacity-60"
            fill
            priority
            sizes="100vw"
            src={assetPath(hero.image)}
          />
        ) : null}
        <div aria-hidden="true" className="absolute inset-0 bg-[#080b09]/60" />
        <div className="site-container relative flex min-h-[28rem] flex-col justify-end py-12 md:min-h-[34rem] md:py-16">
          <a className="mb-auto inline-flex min-h-11 w-fit items-center gap-2 text-sm text-[#9bd1b3] hover:text-white" href={publicRoutePath(`/${locale}/items`)} title={ui.allItems}>
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
          featuredImage={hero?.image}
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
