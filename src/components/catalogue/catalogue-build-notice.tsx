import {CircleAlert} from "lucide-react";
import type {Locale} from "@/config/site";

const copy: Record<Locale, {title: string; description: string; pending: string}> = {
  en: {
    title: "Current build coverage",
    description: "Names, images, prices, and handling notes come from Alpha 1 and August Closed Beta captures. Closed Beta 02 and Early Access can change any of them.",
    pending: "Seven identifier-only records remain behind a media-verification notice instead of using unrelated or competitor artwork."
  },
  de: {
    title: "Aktueller Stand der Daten",
    description: "Namen, Bilder, Preise und Handhabung stammen aus Alpha 1 und der August-Closed-Beta. Closed Beta 02 und Early Access können sie ändern.",
    pending: "Sieben Einträge mit bloßer Kennung behalten einen Prüfhinweis statt unpassender oder fremder Bilder."
  },
  ru: {
    title: "Охват текущей сборки",
    description: "Названия, изображения, цены и заметки взяты из Alpha 1 и августовской Closed Beta. Closed Beta 02 и Early Access могут изменить их.",
    pending: "Семь записей только с идентификатором показывают проверяемую заглушку, а не чужое или неподходящее изображение."
  },
  "pt-br": {
    title: "Cobertura da build atual",
    description: "Nomes, imagens, preços e notas vêm do Alpha 1 e do Closed Beta de agosto. Closed Beta 02 e Acesso Antecipado podem alterar tudo.",
    pending: "Sete registros apenas com identificador mantêm o aviso de verificação, sem usar arte incorreta ou de concorrentes."
  },
  ja: {
    title: "現在のビルド範囲",
    description: "名称、画像、価格、操作情報はAlpha 1と8月Closed Betaの記録です。Closed Beta 02とEarly Accessで変更される可能性があります。",
    pending: "名称だけ確認できた7件は、無関係な画像や他サイトの画像を使わず、画像検証中として表示します。"
  },
  "zh-cn": {
    title: "当前版本覆盖范围",
    description: "名称、图片、价格和操作信息来自 Alpha 1 和 8 月封闭测试记录，Closed Beta 02 与抢先体验都可能改变这些内容。",
    pending: "7 个仅有标识的条目继续显示图片待核验，而不会拿无关图片或竞争对手素材冒充单品图。"
  }
};

export function CatalogueBuildNotice({locale}: {locale: Locale}) {
  const text = copy[locale];

  return (
    <section className="border-b border-[#35423b] bg-[#161d19]" data-catalogue-build-notice>
      <div className="site-container flex items-start gap-4 py-5 md:py-6">
        <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#e2bc61]" />
        <div>
          <h2 className="text-sm font-semibold text-white">{text.title}</h2>
          <p className="mt-1 max-w-5xl text-sm leading-6 text-[#b6c1bb]">{text.description}</p>
          <p className="mt-1 max-w-5xl text-xs leading-5 text-[#8f9d95]">{text.pending}</p>
        </div>
      </div>
    </section>
  );
}
