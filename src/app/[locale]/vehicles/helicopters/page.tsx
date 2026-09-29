import Image from "next/image";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowRight, ExternalLink, Plane, ShieldAlert} from "lucide-react";
import {CatalogueExplorer} from "@/components/catalogue/catalogue-explorer";
import {isLocale, locales, type Locale} from "@/config/site";
import {seasonOneChanges} from "@/features/catalogue/catalogue-evidence-data";
import {assetPath} from "@/lib/assets";
import {buildPageMetadataWithImage} from "@/lib/metadata";
import {publicAssetUrl, publicRoutePath} from "@/lib/public-url";
import {getHelicopterRecords} from "./helicopter-directory";

type PageProps = {params: Promise<{locale: string}>};

const copy: Record<Locale, {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  currentTitle: string;
  currentCopy: string;
  updateLabel: string;
  sourceLabel: string;
  archiveTitle: string;
  archiveCopy: string;
  searchLabel: string;
  searchPlaceholder: string;
  allLabel: string;
  resultLabel: string;
  transport: string;
  combat: string;
  guideTitle: string;
  guideCopy: string;
  guideLink: string;
  vehiclesLink: string;
}> = {
  en: {
    title: "WARDOGS Helicopters", description: "Compare six documented Alpha 1 WARDOGS helicopters by role, observed price and unlock gate. Read the separate official Season 1 Z20 Lakota update and pilot guide.",
    eyebrow: "Air vehicle directory", intro: "Find the aircraft that fits a transport or attack role, then open its evidence-backed model guide. The cards below preserve an Alpha 1 catalogue snapshot; they do not establish the current playable roster.",
    currentTitle: "Season 1 official update", currentCopy: "The official changelog names the Z20 Lakota and changes its Pilot unlock. No current vendor price, full aircraft specification or complete current helicopter roster is established by that note.",
    updateLabel: "Z20 Lakota Pilot unlock", sourceLabel: "Read the official changelog", archiveTitle: "Alpha 1 archive", archiveCopy: "Six aircraft were documented in the Alpha 1 vehicle catalogue. Listed prices and gates belong to that historical build. Use the search and role filters to narrow the models, then open a card for its sources and limits.",
    searchLabel: "Search helicopters", searchPlaceholder: "Search model, role, price or gate", allLabel: "All aircraft", resultLabel: "aircraft", transport: "Transport", combat: "Combat and armed", guideTitle: "Plan a flight before purchase", guideCopy: "The helicopter guide covers takeoff, route planning, landing and squad support. It also flags controls and handling details that remain build-sensitive.", guideLink: "Read the helicopter guide", vehiclesLink: "All vehicles"
  },
  ru: {
    title: "Вертолёты WARDOGS", description: "Шесть вертолётов из каталога Alpha 1: роли, зафиксированные цены и условия доступа, отдельно от официального обновления Z20 Lakota в сезоне 1.",
    eyebrow: "Каталог авиации", intro: "Сравните транспортные и боевые роли и откройте страницу модели с источниками. Карточки сохраняют каталог Alpha 1 и не подтверждают текущий состав техники.",
    currentTitle: "Официальное обновление сезона 1", currentCopy: "В официальном списке изменений указан Z20 Lakota и новая стоимость открытия для пилота. Текущая цена покупки, полные характеристики и весь нынешний парк вертолётов этим сообщением не подтверждены.",
    updateLabel: "Открытие Z20 Lakota для пилота", sourceLabel: "Официальный список изменений", archiveTitle: "Архив Alpha 1", archiveCopy: "В каталоге Alpha 1 зафиксировано шесть летательных аппаратов. Цены и условия относятся к той версии. Ищите по модели или отфильтруйте по роли, затем откройте источники карточки.",
    searchLabel: "Поиск вертолётов", searchPlaceholder: "Модель, роль, цена или доступ", allLabel: "Все", resultLabel: "летательных аппаратов", transport: "Транспорт", combat: "Боевые и вооружённые", guideTitle: "Спланируйте полёт", guideCopy: "Руководство разбирает взлёт, маршрут, посадку и поддержку отряда. Управление и поведение машины могут зависеть от версии игры.", guideLink: "Руководство по вертолётам", vehiclesLink: "Вся техника"
  },
  de: {
    title: "WARDOGS Hubschrauber", description: "Sechs Hubschrauber aus dem Alpha-1-Katalog nach Rolle, beobachtetem Preis und Zugang vergleichen; mit separatem offiziellem Saison-1-Update zum Z20 Lakota.",
    eyebrow: "Luftfahrzeugverzeichnis", intro: "Vergleiche Transport- und Kampfrollen und öffne den Modellartikel mit Belegen. Die Karten bilden den Alpha-1-Katalog ab und bestätigen nicht die aktuelle Fahrzeugauswahl.",
    currentTitle: "Offizielles Update für Saison 1", currentCopy: "Das offizielle Änderungsprotokoll nennt den Z20 Lakota und seinen geänderten Piloten-Freischaltpreis. Ein aktueller Kaufpreis, vollständige technische Daten und die heutige Helikopterauswahl gehen daraus nicht hervor.",
    updateLabel: "Z20 Lakota: Piloten-Freischaltung", sourceLabel: "Offizielles Änderungsprotokoll", archiveTitle: "Alpha-1-Archiv", archiveCopy: "Sechs Fluggeräte wurden im Alpha-1-Fahrzeugkatalog dokumentiert. Preise und Zugang gelten nur für diesen alten Build. Suche oder filtere nach Rolle und öffne die Karten für Quellen und Grenzen.",
    searchLabel: "Hubschrauber suchen", searchPlaceholder: "Modell, Rolle, Preis oder Zugang", allLabel: "Alle Fluggeräte", resultLabel: "Fluggeräte", transport: "Transport", combat: "Kampf und bewaffnet", guideTitle: "Flug vor dem Kauf planen", guideCopy: "Der Leitfaden behandelt Start, Route, Landung und Truppunterstützung. Steuerung und Flugverhalten können sich mit dem Build ändern.", guideLink: "Hubschrauber-Leitfaden lesen", vehiclesLink: "Alle Fahrzeuge"
  },
  "pt-br": {
    title: "Helicópteros de WARDOGS", description: "Compare seis helicópteros documentados no Alpha 1 por função, preço observado e acesso, com a atualização oficial separada do Z20 Lakota na Temporada 1.",
    eyebrow: "Diretório de aeronaves", intro: "Compare funções de transporte e combate e abra o guia de cada modelo com evidências. Os cartões preservam o catálogo Alpha 1; não confirmam a frota jogável atual.",
    currentTitle: "Atualização oficial da Temporada 1", currentCopy: "O registro oficial cita o Z20 Lakota e altera seu desbloqueio de Piloto. A nota não confirma o preço atual de compra, especificações completas nem a lista atual de helicópteros.",
    updateLabel: "Desbloqueio de Piloto do Z20 Lakota", sourceLabel: "Ler o registro oficial", archiveTitle: "Arquivo Alpha 1", archiveCopy: "Seis aeronaves foram documentadas no catálogo Alpha 1. Preços e requisitos pertencem àquela versão. Pesquise ou filtre por função e abra os cartões para ver fontes e limites.",
    searchLabel: "Buscar helicópteros", searchPlaceholder: "Modelo, função, preço ou acesso", allLabel: "Todas as aeronaves", resultLabel: "aeronaves", transport: "Transporte", combat: "Combate e armados", guideTitle: "Planeje o voo antes da compra", guideCopy: "O guia cobre decolagem, rota, pouso e apoio à equipe. Controles e pilotagem podem mudar entre versões.", guideLink: "Ler o guia de helicópteros", vehiclesLink: "Todos os veículos"
  },
  ja: {
    title: "WARDOGS ヘリコプター", description: "Alpha 1で記録された6機の役割、当時の価格、解除条件を比較。シーズン1のZ20 Lakota公式更新は別に掲載します。",
    eyebrow: "航空機ディレクトリ", intro: "輸送と戦闘の役割を比較し、各機体の出典付きガイドを開けます。以下はAlpha 1の記録であり、現行の使用可能機体一覧ではありません。",
    currentTitle: "シーズン1公式更新", currentCopy: "公式更新履歴はZ20 Lakotaとパイロット解除費用の変更を記載しています。現行の購入価格、全仕様、現在のヘリコプター一覧までは確認できません。",
    updateLabel: "Z20 Lakota パイロット解除", sourceLabel: "公式更新履歴を読む", archiveTitle: "Alpha 1 記録", archiveCopy: "Alpha 1の車両カタログには6機が記録されています。価格と条件はその時点のものです。名前や役割で絞り込み、カードから出典と注意点を確認してください。",
    searchLabel: "ヘリコプターを検索", searchPlaceholder: "機体名・役割・価格・条件", allLabel: "すべて", resultLabel: "機", transport: "輸送", combat: "戦闘・武装", guideTitle: "購入前に飛行計画を", guideCopy: "ガイドでは離陸、経路、着陸、分隊支援を扱います。操作や挙動はビルドで変わる場合があります。", guideLink: "ヘリコプターガイドを読む", vehiclesLink: "全車両"
  },
  pl: {
    title: "Helikoptery WARDOGS", description: "Porównaj sześć helikopterów z katalogu Alpha 1: role, zapisane ceny i wymagania. Osobno sprawdź oficjalną zmianę Z20 Lakota z sezonu 1.",
    eyebrow: "Katalog statków powietrznych", intro: "Porównaj role transportowe i bojowe, a następnie otwórz opis modelu ze źródłami. Karty zachowują stan katalogu Alpha 1 i nie potwierdzają aktualnie dostępnej floty.",
    currentTitle: "Oficjalna aktualizacja sezonu 1", currentCopy: "Oficjalny dziennik zmian wymienia Z20 Lakota i zmianę kosztu odblokowania na ścieżce Pilot. Nie potwierdza obecnej ceny zakupu, pełnych parametrów ani aktualnej listy helikopterów.",
    updateLabel: "Odblokowanie Z20 Lakota na ścieżce Pilot", sourceLabel: "Oficjalny dziennik zmian", archiveTitle: "Archiwum Alpha 1", archiveCopy: "W katalogu pojazdów Alpha 1 udokumentowano sześć statków powietrznych. Ceny i wymagania dotyczą tamtej wersji. Wyszukaj model lub wybierz rolę, a następnie otwórz kartę ze źródłami i zastrzeżeniami.",
    searchLabel: "Szukaj helikopterów", searchPlaceholder: "Model, rola, cena lub wymagania", allLabel: "Wszystkie maszyny", resultLabel: "maszyn", transport: "Transport", combat: "Bojowe i uzbrojone", guideTitle: "Zaplanuj lot przed zakupem", guideCopy: "Poradnik obejmuje start, planowanie trasy, lądowanie i wsparcie drużyny. Sterowanie oraz zachowanie maszyny mogą zależeć od wersji gry.", guideLink: "Poradnik pilotażu helikopterów", vehiclesLink: "Wszystkie pojazdy"
  },
  "zh-tw": {
    title: "WARDOGS 直升機", description: "按用途、Alpha 1 記錄價格與解鎖條件比較 6 架直升機，並單獨查看第 1 賽季 Z20 Lakota 官方更新。",
    eyebrow: "飛行載具目錄", intro: "比較運輸與戰鬥用途，開啟各機型的證據頁。下方卡片儲存的是 Alpha 1 圖鑑記錄，不代表目前可用機型名單。",
    currentTitle: "第 1 賽季官方更新", currentCopy: "官方更新記錄提到了 Z20 Lakota 及其飛行員解鎖費用變化；該記錄並未確認目前購買價格、完整性能或現行直升機全名單。",
    updateLabel: "Z20 Lakota 飛行員解鎖", sourceLabel: "查看官方更新記錄", archiveTitle: "Alpha 1 歷史記錄", archiveCopy: "Alpha 1 載具圖鑑記錄了 6 架飛行器。價格和解鎖條件僅適用於該歷史版本。可按機型搜尋或按用途篩選，再開啟卡片查看來源和適用範圍。",
    searchLabel: "搜尋直升機", searchPlaceholder: "搜尋機型、用途、價格或解鎖條件", allLabel: "全部飛行器", resultLabel: "架飛行器", transport: "運輸", combat: "戰鬥與武裝", guideTitle: "購買前規劃飛行", guideCopy: "直升機指南涵蓋起飛、路線、降落與小隊支援；操控和飛行表現可能隨版本變化。", guideLink: "閱讀直升機指南", vehiclesLink: "全部載具"
  },
  "zh-cn": {
    title: "WARDOGS 直升机", description: "按用途、Alpha 1 记录价格与解锁条件比较 6 架直升机，并单独查看第 1 赛季 Z20 Lakota 官方更新。",
    eyebrow: "飞行载具目录", intro: "比较运输与战斗用途，打开各机型的证据页。下方卡片保存的是 Alpha 1 图鉴记录，不代表当前可用机型名单。",
    currentTitle: "第 1 赛季官方更新", currentCopy: "官方更新记录提到了 Z20 Lakota 及其飞行员解锁费用变化；该记录并未确认当前购买价格、完整性能或现行直升机全名单。",
    updateLabel: "Z20 Lakota 飞行员解锁", sourceLabel: "查看官方更新记录", archiveTitle: "Alpha 1 历史记录", archiveCopy: "Alpha 1 载具图鉴记录了 6 架飞行器。价格和解锁条件仅适用于该历史版本。可按机型搜索或按用途筛选，再打开卡片查看来源和适用范围。",
    searchLabel: "搜索直升机", searchPlaceholder: "搜索机型、用途、价格或解锁条件", allLabel: "全部飞行器", resultLabel: "架飞行器", transport: "运输", combat: "战斗与武装", guideTitle: "购买前规划飞行", guideCopy: "直升机指南涵盖起飞、路线、降落与小队支援；操控和飞行表现可能随版本变化。", guideLink: "阅读直升机指南", vehiclesLink: "全部载具"
  }
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) return {};
  const {title, description} = copy[locale];
  return buildPageMetadataWithImage(locale, "/vehicles/helicopters", title, description, {
    url: publicAssetUrl("/images/catalogue/banners/vehicles-1280.webp"), width: 1280, height: 720,
    alt: "WARDOGS vehicle catalogue"
  });
}

export default async function HelicoptersPage({params}: PageProps) {
  const {locale: requestedLocale} = await params;
  if (!isLocale(requestedLocale)) notFound();
  const locale = requestedLocale;
  const text = copy[locale];
  const records = getHelicopterRecords(locale).map((record) => ({
    ...record,
    filterValues: [
      ...record.filterValues,
      record.slug === "mh-6" || record.slug === "uh-1y" ? "directory-transport" : "directory-combat"
    ]
  }));
  const z20Update = seasonOneChanges.find((change) => change.id === "z20-lakota-pilot-unlock");
  if (!z20Update) throw new Error("Missing official Z20 Lakota Season 1 change record");

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[#2c3631] bg-[#090c0a]" data-helicopter-hero>
        <Image alt="" className="object-cover opacity-35" fill priority sizes="100vw" src={assetPath("/images/catalogue/banners/vehicles-1280.webp")} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#090c0a] via-[#090c0a]/85 to-[#090c0a]/40" />
        <div className="site-container relative py-14 md:py-20">
          <a className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#91d3aa] hover:text-white" href={publicRoutePath(`/${locale}/items/vehicles`)} title={text.vehiclesLink}>{text.vehiclesLink}<ArrowRight aria-hidden="true" className="size-4" /></a>
          <p className="mt-9 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#d9a93a]"><Plane aria-hidden="true" className="size-4" />{text.eyebrow}</p>
          <h1 className="display-font mt-3 max-w-4xl text-5xl leading-none text-white md:text-7xl">{text.title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#d3ddd7] md:text-lg">{text.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase text-[#a6c4ae]">
            <span className="border border-[#4a5d4f] bg-[#142119]/80 px-3 py-2">{records.length} {text.resultLabel}</span>
            <span className="border border-[#4a5d4f] bg-[#142119]/80 px-3 py-2">Alpha 1 · Season 1</span>
          </div>
        </div>
      </section>

      <section className="border-b border-[#35423b] bg-[#142019]" data-season-one-helicopter-update>
        <div className="site-container grid gap-5 py-9 md:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)] md:gap-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8bd4a9]">{z20Update.effectiveBuild} · {z20Update.verifiedAt}</p>
            <h2 className="display-font mt-2 text-3xl text-white md:text-4xl">{text.currentTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#c0d0c5]">{text.currentCopy}</p>
            <a className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#91d3aa] hover:text-white" href={z20Update.sourceUrl} rel="noreferrer" target="_blank" title={text.sourceLabel}>{text.sourceLabel}<ExternalLink aria-hidden="true" className="size-4" /></a>
          </div>
          <div className="border-l-2 border-[#78bc92] bg-[#0d1510] p-5">
            <p className="font-mono text-xs uppercase text-[#9bcbaa]">{text.updateLabel}</p>
            <p className="display-font mt-3 text-3xl text-white">{z20Update.currentValue}</p>
            <p className="mt-2 text-sm text-[#aebcb2]">{z20Update.previousValue} → {z20Update.currentValue}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#2c3631] bg-[#0d110f]">
        <div className="site-container py-10">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#d9a93a]"><ShieldAlert aria-hidden="true" className="size-4" />{text.archiveTitle}</p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#b7c3bb]">{text.archiveCopy}</p>
        </div>
      </section>
      <CatalogueExplorer
        locale={locale}
        records={records}
        filters={[{label: text.transport, value: "directory-transport"}, {label: text.combat, value: "directory-combat"}]}
        labels={{heading: text.archiveTitle, searchLabel: text.searchLabel, searchPlaceholder: text.searchPlaceholder, allFilterLabel: text.allLabel, resultLabel: text.resultLabel}}
      />
      <section className="border-t border-[#2c3631] bg-[#0d110f]">
        <div className="site-container flex flex-wrap items-center justify-between gap-5 py-12">
          <div className="max-w-3xl">
            <h2 className="display-font text-3xl text-white">{text.guideTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#aebcb2]">{text.guideCopy}</p>
          </div>
          <a className="inline-flex min-h-11 items-center gap-2 border border-[#68bd8d] px-5 py-3 text-sm font-semibold text-[#9fe3b4] hover:bg-[#214332] hover:text-white" href={publicRoutePath(`/${locale}/guides/wardogs-helicopter-guide`)} title={text.guideLink}>{text.guideLink}<ArrowRight aria-hidden="true" className="size-4" /></a>
        </div>
      </section>
    </main>
  );
}
