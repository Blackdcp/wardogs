import {CircleAlert} from "lucide-react";
import {StatusBadge} from "@/components/ui/status-badge";
import type {Locale} from "@/config/site";
import {getCatalogueFreshness} from "@/features/catalogue/catalogue-evidence";
import {catalogueRecords} from "@/features/catalogue/catalogue-records";
import {getItemUi} from "@/features/items/item-ui";

const copy: Record<Locale, {title: string; description: string; pending: (count: number) => string}> = {
  en: {
    title: "Current build coverage",
    description: "Names, images, prices, and handling notes come from Alpha 1 and August Closed Beta captures. They were not fully revalidated in Beta 02; recheck every value in Early Access.",
    pending: (count) => `${count} records remain behind a media-verification notice instead of using unrelated or competitor artwork.`
  },
  de: {
    title: "Aktueller Stand der Daten",
    description: "Namen, Bilder, Preise und Handhabung stammen aus Alpha 1 und der August-Closed-Beta. Sie wurden in Beta 02 nicht vollständig neu geprüft; im Early Access muss jeder Wert erneut kontrolliert werden.",
    pending: (count) => `${count} Einträge behalten einen Prüfhinweis statt unpassender oder fremder Bilder.`
  },
  ru: {
    title: "Охват текущей сборки",
    description: "Названия, изображения, цены и заметки взяты из Alpha 1 и августовской Closed Beta. В Beta 02 они не были полностью перепроверены; каждый параметр нужно проверить в Early Access.",
    pending: (count) => `${count} записей показывают уведомление о проверке, а не чужое или неподходящее изображение.`
  },
  "pt-br": {
    title: "Cobertura da build atual",
    description: "Nomes, imagens, preços e notas vêm do Alpha 1 e do Closed Beta de agosto. Eles não foram totalmente revalidados no Beta 02; confira cada valor no Acesso Antecipado.",
    pending: (count) => `${count} registros mantêm o aviso de verificação, sem usar arte incorreta ou de concorrentes.`
  },
  ja: {
    title: "現在のビルド範囲",
    description: "名称、画像、価格、操作情報はAlpha 1と8月Closed Betaの記録です。Beta 02では全面再検証できていないため、Early Accessで各数値を再確認します。",
    pending: (count) => `${count}件は、無関係な画像や他サイトの画像を使わず、画像検証中として表示します。`
  },
  "zh-cn": {
    title: "当前版本覆盖范围",
    description: "名称、图片、价格和操作信息来自 Alpha 1 与 8 月封闭测试记录，尚未在 Beta 02 完整复核；所有数值都要在抢先体验版本重新验证。",
    pending: (count) => `${count} 个条目继续显示图片待核验，而不会拿无关图片或竞争对手素材冒充单品图。`
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
