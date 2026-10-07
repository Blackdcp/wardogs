import Image from "next/image";
import type {ReactNode} from "react";
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
import {seasonOneSourceUrl} from "@/features/catalogue/catalogue-evidence-data";

type CatalogueCategoryViewProps = {
  guide: CatalogGuide;
  locale: Locale;
  sponsoredSlot?: ReactNode;
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

const seasonOneVehicleCopy: Record<Locale, {title: string; description: string; source: string}> = {
  en: {title: "Season 1 vehicle update", description: "The official Season 1 changelog names the Z20 Lakota and reduces its Pilot unlock from $50,000 to $35,000. The UH-1Y entries below are from the Alpha vendor, not a confirmed current helicopter roster.", source: "Official Season 1 changelog"},
  de: {title: "Fahrzeug-Update in Saison 1", description: "Das offizielle Änderungsprotokoll zu Saison 1 nennt den Z20 Lakota und senkt seine Freischaltung für Piloten von $50,000 auf $35,000. Die UH-1Y-Einträge unten stammen aus dem Alpha-Händler und sind kein bestätigtes aktuelles Helikopterangebot.", source: "Offizielles Änderungsprotokoll zu Saison 1"},
  ru: {title: "Обновление техники в сезоне 1", description: "В официальном списке изменений сезона 1 указан Z20 Lakota: стоимость открытия для пилота снижена с $50,000 до $35,000. Записи UH-1Y ниже относятся к магазину альфа-версии, а не к подтвержденному текущему списку вертолетов.", source: "Официальные изменения сезона 1"},
  "pt-br": {title: "Atualização de veículos da Temporada 1", description: "O registro oficial da Temporada 1 cita o Z20 Lakota e reduz seu desbloqueio de Piloto de $50,000 para $35,000. As entradas UH-1Y abaixo vieram da loja Alpha e não são uma lista atual de helicópteros confirmada.", source: "Registro oficial da Temporada 1"},
  ja: {title: "シーズン1の車両更新", description: "公式のシーズン1更新履歴にはZ20 Lakotaが記載され、パイロットの解除費用は$50,000から$35,000に下がりました。以下のUH-1Yはアルファ版ショップの記録であり、現行ヘリ一覧として確定したものではありません。", source: "シーズン1公式更新履歴"},
  "zh-cn": {title: "第 1 赛季载具更新", description: "官方第 1 赛季更新记录已列出 Z20 Lakota，飞行员解锁费用从 $50,000 降至 $35,000。下方 UH-1Y 条目属于 Alpha 商店记录，不能当作当前直升机名单。", source: "官方第 1 赛季更新记录"},

  pl: {title: "Zmiany pojazdów w sezonie 1", description: "Oficjalna lista zmian sezonu 1 wymienia Z20 Lakota i obniża koszt odblokowania dla pilota z $50,000 do $35,000. Poniższe wpisy UH-1Y pochodzą ze sklepu wersji alfa, a nie z potwierdzonej aktualnej listy śmigłowców.", source: "Oficjalna lista zmian sezonu 1"},
  "zh-tw": { title: "第 1 賽季載具更新", description: "官方第 1 賽季更新記錄已列出 Z20 Lakota，飛行員解鎖費用從 $50,000 降至 $35,000。下方 UH-1Y 條目屬於 Alpha 商店記錄，不能當作當前直升機名單。", source: "官方第 1 賽季更新記錄" }
};

function SeasonOneVehicleUpdate({locale}: {locale: Locale}) {
  const copy = seasonOneVehicleCopy[locale];
  return (
    <section className="border-b border-[#35423b] bg-[#111b16]" data-season-one-vehicle-update>
      <div className="site-container py-6">
        <h2 className="display-font text-2xl text-white">{copy.title}</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-[#c0d0c5]">{copy.description}</p>
        <a className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#86d0a4] hover:text-white" href={seasonOneSourceUrl} rel="noreferrer" target="_blank" title={copy.source}>{copy.source}</a>
      </div>
    </section>
  );
}

export function CatalogueCategoryView({guide, locale, sponsoredSlot}: CatalogueCategoryViewProps) {
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

      {guide.id === "vehicles" ? <SeasonOneVehicleUpdate locale={locale} /> : null}

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

      {sponsoredSlot}
      <ItemCatalogGuide guide={linkedGuide} locale={locale} />
    </>
  );
}
