import {CircleAlert} from "lucide-react";
import {StatusBadge} from "@/components/ui/status-badge";
import type {Locale} from "@/config/site";
import {getCatalogueFreshness} from "@/features/catalogue/catalogue-evidence";
import {catalogueRecords} from "@/features/catalogue/catalogue-records";
import {getItemUi} from "@/features/items/item-ui";

const copy: Record<Locale, {title: string; description: string; pending: (count: number) => string}> = {
  en: {
    title: "Current build coverage",
    description: "Catalogue entries combine dated Alpha, Beta, official Season 1 and community sources. Check each item's evidence date before using prices or performance in Early Access.",
    pending: (count) => `${count} records still need an item-specific image.`
  },
  de: {
    title: "Aktueller Stand der Daten",
    description: "Die Einträge verbinden datierte Alpha-, Beta-, offizielle Saison-1- und Community-Quellen. Prüfe den Belegzeitpunkt jedes Gegenstands, bevor du Preise oder Leistung im Early Access verwendest.",
    pending: (count) => `${count} Einträge benötigen noch ein gegenstandsspezifisches Bild.`
  },
  ru: {
    title: "Охват текущей сборки",
    description: "Каталог объединяет датированные источники Alpha, Beta, официального сезона 1 и сообщества. Перед использованием цены или характеристик в раннем доступе проверьте дату подтверждения предмета.",
    pending: (count) => `${count} записей всё ещё требуют изображения конкретного предмета.`
  },
  "pt-br": {
    title: "Cobertura da build atual",
    description: "O catálogo reúne fontes datadas do Alpha, Beta, Temporada 1 oficial e comunidade. Confira a data da evidência de cada item antes de usar preços ou desempenho no Acesso Antecipado.",
    pending: (count) => `${count} registros ainda precisam de uma imagem do item específico.`
  },
  ja: {
    title: "現在のビルド範囲",
    description: "図鑑は日付付きのAlpha、Beta、公式シーズン1、コミュニティ資料を併用しています。早期アクセスで価格や性能を使う前に各アイテムの根拠日付を確認してください。",
    pending: (count) => `${count}件は対象物固有の画像を引き続き確認中です。`
  },
  "zh-cn": {
    title: "当前版本覆盖范围",
    description: "图鉴汇集了标注日期的 Alpha、Beta、官方第 1 赛季和社区资料。使用任何价格或性能数据前，请先核对该物品的来源和时间。",
    pending: (count) => `${count} 个条目仍待补充对应物品图片。`
  },

  pl: {title: "Zakres danych według wersji", description: "Katalog łączy datowane źródła z alfy, bety, oficjalnego sezonu 1 i społeczności. Zanim użyjesz cen lub parametrów we wczesnym dostępie, sprawdź datę dowodów dla danego przedmiotu.", pending: (count) => `${count} rekordów nadal wymaga ilustracji konkretnego przedmiotu.`},
  "zh-tw": {
    title: "當前版本覆蓋範圍",
    description: "圖鑑彙集了標註日期的 Alpha、Beta、官方第 1 賽季和社群資料。使用任何價格或效能資料前，請先核對該物品的來源和時間。",
    pending: (count) => `${count} 個條目仍待補充對應物品圖片。`
}
};

export function CatalogueBuildNotice({locale}: {locale: Locale}) {
  const text = copy[locale];
  const ui = getItemUi(locale);
  const pendingCount = catalogueRecords.filter((record) => record.mediaState === "pending").length;
  const freshnessCounts = catalogueRecords.reduce<Record<"current" | "historical" | "unknown", number>>(
    (counts, record) => {
      counts[getCatalogueFreshness(record)] += 1;
      return counts;
    },
    {current: 0, historical: 0, unknown: 0}
  );

  return (
    <section className="border-b border-[#35423b] bg-[#161d19]" data-catalogue-build-notice>
      <div className="site-container flex items-start gap-4 py-5 md:py-6">
        <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#e2bc61]" />
        <div>
          <h2 className="text-sm font-semibold text-white">{text.title}</h2>
          <p className="mt-1 max-w-5xl text-sm leading-6 text-[#b6c1bb]">{text.description}</p>
          <p className="mt-1 max-w-5xl text-xs leading-5 text-[#8f9d95]">{text.pending(pendingCount)}</p>
          <div className="mt-4 flex flex-wrap gap-2" data-catalogue-freshness-summary>
            {(["current", "historical", "unknown"] as const).map((freshness) => freshnessCounts[freshness] > 0 ? (
              <StatusBadge
                key={freshness}
                tone={freshness === "current" ? "accent" : freshness === "historical" ? "warning" : "muted"}
              >
                {ui[freshness]}: {freshnessCounts[freshness]}
              </StatusBadge>
            ) : null)}
          </div>
        </div>
      </div>
    </section>
  );
}
