import type {Locale} from "@/config/site";
import {publicRoutePath} from "@/lib/public-url";

export type MarketKind = "black" | "gold";

type Copy = {
  title: string;
  description: string;
  status: string;
  statusDetail: string;
  actionTitle: string;
  steps: readonly [string, string, string];
  evidenceTitle: string;
  evidence: string;
  unknownTitle: string;
  unknown: string;
  relatedTitle: string;
  relatedMarket: string;
  moneyGuide: string;
  sourceTitle: string;
  checkedLabel: string;
};

const copy: Record<Locale, Record<MarketKind, Copy>> = {
  en: {
    black: {
      title: "WARDOGS Black Market", description: "What BULKHEAD announced about the Black Market and Vault, what remains unverified in the live client, and how to plan your cash meanwhile.",
      status: "Announced metagame; check the current client", statusDetail: "BULKHEAD introduced the Black Market and Vault as planned systems for Early Access. That plan does not prove every menu action or item is available now.",
      actionTitle: "Before committing cash", steps: ["Check the current in-game menu for an available Black Market action and its exact terms.", "Keep enough cash for a usable next loadout; match-to-match cash still pays for equipment and vehicles.", "If an action is locked, use the money guide for active earning and spending routes."],
      evidenceTitle: "What the developer described", evidence: "The April Early Access & Beyond presentation names the Black Market and Vault alongside Player Skills and Challenges as a deeper between-match layer. These are announced directions, not a verified live inventory or price list.",
      unknownTitle: "Still needs a current-build check", unknown: "Availability, dealer stock, Vault capacity, prices, resale rules, and season-reset treatment for stored items are not established here. Check the live interface and official patch notes before making a purchase plan.",
      relatedTitle: "Keep exploring", relatedMarket: "Gold Market and Gold Bars", moneyGuide: "Cash and recovery guide", sourceTitle: "Official sources", checkedLabel: "Sources checked September 27, 2026"
    },
    gold: {
      title: "WARDOGS Gold Market", description: "Understand the cash-to-Gold-Bar decision and cosmetic market without mistaking an old screenshot for a current exchange rate.",
      status: "No live exchange quote on this page", statusDetail: "BULKHEAD describes a fluctuating cash-to-Gold-Bar rate. A static page cannot tell you today's rate or current cosmetic prices. Read both values in the in-game exchange screen before deciding.",
      actionTitle: "Decide whether to convert", steps: ["Set aside a cash reserve for your next usable loadout and any near-term unlocks.", "Read the current rate in the in-game exchange screen and the Gold Market cost of the cosmetic you want.", "Convert only surplus cash if the trade works for your plan; beta screenshots and creator quotes are not current prices."],
      evidenceTitle: "What the developer described", evidence: "BULKHEAD's Top Questions post says cash profits can be exchanged for Gold Bars for cosmetic unlocks in the Gold Market. Its Early Access & Beyond video says remaining cash converts automatically at season end, while Gold Bars and cosmetics persist across seasons.",
      unknownTitle: "What this guide cannot quote", unknown: "The live Gold Bar rate, chart history, cosmetic stock and prices, and exact rate at the next season boundary require current client or transition-notice evidence. This page has no verified rate feed.",
      relatedTitle: "Keep exploring", relatedMarket: "Black Market and Vault", moneyGuide: "Cash and recovery guide", sourceTitle: "Official sources", checkedLabel: "Sources checked September 27, 2026"
    }
  },
  ru: {
    black: {
      title: "WARDOGS: чёрный рынок", description: "Что BULKHEAD объявила о чёрном рынке и хранилище и что нужно проверить в текущей версии игры.",
      status: "Анонсированная метаигра — проверяйте клиент", statusDetail: "BULKHEAD представила чёрный рынок и хранилище как системы для разработки в раннем доступе. Анонс не подтверждает доступность каждой функции сейчас.",
      actionTitle: "Перед тратой денег", steps: ["Проверьте в игре, доступно ли действие чёрного рынка и каковы его условия.", "Оставьте деньги на следующий рабочий комплект: снаряжение и техника требуют наличных.", "Если функция закрыта, используйте руководство по деньгам для доступных способов заработка."],
      evidenceTitle: "Что сообщил разработчик", evidence: "Видео Early Access & Beyond называет чёрный рынок и хранилище частью будущей метаигры наряду с навыками и испытаниями.",
      unknownTitle: "Требует проверки в игре", unknown: "Доступность, ассортимент, цены, вместимость хранилища и правила сезонного сброса предметов здесь не подтверждены.",
      relatedTitle: "Читайте также", relatedMarket: "Рынок золота", moneyGuide: "Руководство по деньгам", sourceTitle: "Официальные источники", checkedLabel: "Источники проверены 27 сентября 2026 г."
    },
    gold: {
      title: "WARDOGS: рынок золота", description: "Как оценить обмен денег на золотые слитки и покупку косметики без устаревшего курса.",
      status: "Актуального курса на этой странице нет", statusDetail: "BULKHEAD описывает меняющийся курс. Узнайте текущий курс и цены косметики в игре перед обменом.",
      actionTitle: "Перед обменом", steps: ["Оставьте денежный резерв на следующий комплект и ближайшие открытия.", "Проверьте курс в игровом окне обмена и цену нужной косметики.", "Обменивайте только свободные средства; цены из бета-версии не являются текущими."],
      evidenceTitle: "Что сообщил разработчик", evidence: "В Top Questions сказано, что деньги можно обменять на слитки для косметики. Видео Early Access & Beyond описывает автоматический обмен остатка в конце сезона и сохранение слитков и косметики.",
      unknownTitle: "Что здесь не указано", unknown: "Текущий курс, история курса, ассортимент и точный курс на границе сезона требуют данных из игры или нового официального сообщения.",
      relatedTitle: "Читайте также", relatedMarket: "Чёрный рынок и хранилище", moneyGuide: "Руководство по деньгам", sourceTitle: "Официальные источники", checkedLabel: "Источники проверены 27 сентября 2026 г."
    }
  },
  de: {
    black: {
      title: "WARDOGS Schwarzmarkt", description: "Was BULKHEAD zum Schwarzmarkt und Tresor angekündigt hat und was im aktuellen Spiel geprüft werden muss.",
      status: "Angekündigtes Metaspiel; im Client prüfen", statusDetail: "BULKHEAD stellte Schwarzmarkt und Tresor als Systeme für die Early-Access-Entwicklung vor. Die Ankündigung belegt nicht, dass jede Funktion bereits verfügbar ist.",
      actionTitle: "Vor einer Ausgabe", steps: ["Prüfe im Spielmenü, ob eine Schwarzmarkt-Aktion verfügbar ist und welche Bedingungen gelten.", "Behalte genug Geld für die nächste brauchbare Ausrüstung.", "Ist die Aktion gesperrt, nutze den Geld-Guide für verfügbare Wege zum Verdienen."],
      evidenceTitle: "Aussage des Entwicklers", evidence: "Early Access & Beyond nennt Schwarzmarkt und Tresor zusammen mit Spielerfähigkeiten und Herausforderungen als Ebene zwischen Matches.",
      unknownTitle: "Im aktuellen Build zu prüfen", unknown: "Verfügbarkeit, Sortiment, Preise, Tresorgröße und saisonale Regeln für gelagerte Gegenstände sind hier nicht bestätigt.",
      relatedTitle: "Weiterlesen", relatedMarket: "Goldmarkt und Goldbarren", moneyGuide: "Geld-Guide", sourceTitle: "Offizielle Quellen", checkedLabel: "Quellen geprüft am 27. September 2026"
    },
    gold: {
      title: "WARDOGS Goldmarkt", description: "Bargeld, Goldbarren und kosmetische Gegenstände verstehen, ohne einen alten Wechselkurs zu übernehmen.",
      status: "Kein aktueller Wechselkurs auf dieser Seite", statusDetail: "BULKHEAD beschreibt einen schwankenden Kurs. Prüfe den aktuellen Kurs und Kosmetikpreis vor dem Tausch im Spiel.",
      actionTitle: "Vor dem Umtausch", steps: ["Halte eine Geldreserve für die nächste Ausrüstung und baldige Freischaltungen zurück.", "Lies den Kurs im Austauschfenster und den Preis des gewünschten kosmetischen Gegenstands ab.", "Tausche nur überschüssiges Geld; Beta-Screenshots sind kein aktuelles Angebot."],
      evidenceTitle: "Aussage des Entwicklers", evidence: "Top Questions beschreibt den Tausch von Geld in Goldbarren für Kosmetik im Goldmarkt. Early Access & Beyond beschreibt den automatischen Tausch am Saisonende und den Erhalt von Goldbarren und Kosmetik.",
      unknownTitle: "Hier nicht beziffert", unknown: "Aktueller Kurs, Kursverlauf, Sortiment und Saisonendkurs benötigen Daten aus dem Spiel oder eine offizielle Mitteilung.",
      relatedTitle: "Weiterlesen", relatedMarket: "Schwarzmarkt und Tresor", moneyGuide: "Geld-Guide", sourceTitle: "Offizielle Quellen", checkedLabel: "Quellen geprüft am 27. September 2026"
    }
  },
  "pt-br": {
    black: {
      title: "WARDOGS Mercado Negro", description: "O que a BULKHEAD anunciou sobre o Mercado Negro e o Cofre e o que exige confirmação no jogo atual.",
      status: "Metajogo anunciado; confira no cliente", statusDetail: "A BULKHEAD apresentou Mercado Negro e Cofre como sistemas a desenvolver no Acesso Antecipado. O anúncio não comprova que todas as ações já estejam disponíveis.",
      actionTitle: "Antes de gastar", steps: ["Confira no menu do jogo se a ação está disponível e quais são as condições.", "Guarde dinheiro para um próximo equipamento funcional.", "Se a ação estiver bloqueada, use o guia de dinheiro para rotas de ganho já disponíveis."],
      evidenceTitle: "O que a desenvolvedora descreveu", evidence: "Early Access & Beyond cita Mercado Negro e Cofre junto com habilidades e desafios como parte do metajogo entre partidas.",
      unknownTitle: "Ainda requer verificação", unknown: "Disponibilidade, estoque, preços, capacidade do Cofre e regras sazonais dos itens guardados não estão confirmados aqui.",
      relatedTitle: "Continue lendo", relatedMarket: "Mercado de Ouro", moneyGuide: "Guia de dinheiro", sourceTitle: "Fontes oficiais", checkedLabel: "Fontes verificadas em 27 de setembro de 2026"
    },
    gold: {
      title: "WARDOGS Mercado de Ouro", description: "Como avaliar a troca de dinheiro por barras de ouro e cosméticos sem usar uma cotação antiga.",
      status: "Sem cotação ao vivo nesta página", statusDetail: "A BULKHEAD descreve uma taxa variável. Confira a taxa e o preço dos cosméticos no jogo antes de trocar.",
      actionTitle: "Antes de converter", steps: ["Separe uma reserva de dinheiro para o próximo equipamento e desbloqueios próximos.", "Leia a taxa na tela de câmbio do jogo e o preço do cosmético desejado.", "Converta apenas o excedente; capturas da beta não são cotações atuais."],
      evidenceTitle: "O que a desenvolvedora descreveu", evidence: "Top Questions diz que dinheiro pode virar barras de ouro para cosméticos. Early Access & Beyond descreve a conversão automática ao fim da temporada e a permanência de barras e cosméticos.",
      unknownTitle: "Sem valores confirmados aqui", unknown: "Taxa atual, histórico, catálogo e taxa na virada da temporada dependem do cliente atual ou de um aviso oficial.",
      relatedTitle: "Continue lendo", relatedMarket: "Mercado Negro e Cofre", moneyGuide: "Guia de dinheiro", sourceTitle: "Fontes oficiais", checkedLabel: "Fontes verificadas em 27 de setembro de 2026"
    }
  },
  ja: {
    black: {
      title: "WARDOGS ブラックマーケット", description: "BULKHEADが発表したブラックマーケットと保管庫、現行版で確認が必要な点を整理します。",
      status: "発表済みの計画・現行ゲームで確認", statusDetail: "BULKHEADは両システムを早期アクセス中に開発する仕組みとして紹介しました。すべての機能が現在利用可能という証拠ではありません。",
      actionTitle: "現金を使う前に", steps: ["ゲーム内メニューで取引の利用可否と条件を確認する。", "次の出撃に必要な装備を買える現金を残す。", "未開放なら資金ガイドにある現行の稼ぎ方を使う。"],
      evidenceTitle: "開発元の説明", evidence: "Early Access & Beyondでは、ブラックマーケットと保管庫をスキルやチャレンジとともに、試合外の進行要素として挙げています。",
      unknownTitle: "現行版で要確認", unknown: "利用可否、品揃え、価格、保管庫の容量、保管品のシーズン更新時の扱いは、このページでは確認できていません。",
      relatedTitle: "関連ページ", relatedMarket: "ゴールドマーケット", moneyGuide: "資金ガイド", sourceTitle: "公式情報", checkedLabel: "情報確認日: 2026年9月27日"
    },
    gold: {
      title: "WARDOGS ゴールドマーケット", description: "古い交換レートに頼らず、現金からゴールドバーへの交換と外観アイテムの購入を考えるガイドです。",
      status: "このページに現在の交換レートはありません", statusDetail: "BULKHEADは変動レートを説明しています。交換前にゲーム内で現在のレートと外観アイテムの価格を確認してください。",
      actionTitle: "交換前の確認", steps: ["次の装備と近日中のアンロックに必要な現金を確保する。", "ゲーム内の交換画面でレートと欲しい外観アイテムの価格を確認する。", "余剰分だけ交換を検討する。ベータ版の画像は現在の価格ではない。"],
      evidenceTitle: "開発元の説明", evidence: "Top Questionsは現金をゴールドバーに換え、外観アイテムに使うと説明しています。Early Access & Beyondはシーズン末の自動交換とバー・外観の継続を説明しています。",
      unknownTitle: "ここでは提示できない値", unknown: "現在のレート、履歴、商品とシーズン境界のレートには、現行ゲームか新しい公式告知が必要です。",
      relatedTitle: "関連ページ", relatedMarket: "ブラックマーケットと保管庫", moneyGuide: "資金ガイド", sourceTitle: "公式情報", checkedLabel: "情報確認日: 2026年9月27日"
    }
  },
  "zh-cn": {
    black: {
      title: "WARDOGS 黑市", description: "梳理 BULKHEAD 公布的黑市与仓库计划，以及现行游戏中仍需核对的功能。",
      status: "已公布的开发计划；请以游戏内为准", statusDetail: "BULKHEAD 将黑市和仓库列为抢先体验期间要建设的赛外系统。公布计划不等于每项功能现在都已开放。",
      actionTitle: "花钱前先做三件事", steps: ["打开当前游戏菜单，确认黑市操作是否可用，以及实际条款。", "保留下一套可用装备所需的现金。", "若操作尚未开放，先用赚钱指南规划现有的收入与开支。"],
      evidenceTitle: "开发者实际说了什么", evidence: "《Early Access & Beyond》将黑市和仓库与玩家技能、挑战系统一起列为赛外成长方向，并未提供已上线商品和价格清单。",
      unknownTitle: "仍需现行版本核对", unknown: "开放状态、商品、价格、仓库容量以及赛季重置时仓库存货的处理方式，本页均没有可靠的现行证据。",
      relatedTitle: "继续了解", relatedMarket: "黄金市场与金条", moneyGuide: "现金与回本指南", sourceTitle: "官方来源", checkedLabel: "来源核查于 2026 年 9 月 27 日"
    },
    gold: {
      title: "WARDOGS 黄金市场", description: "理解现金兑换金条和外观购买，不把旧截图误当作当前汇率。",
      status: "本页没有实时兑换报价", statusDetail: "BULKHEAD 说明现金兑换金条的汇率会变化。兑换前请在游戏内核对当前汇率和目标外观的价格。",
      actionTitle: "兑换前怎么判断", steps: ["先留出下一套可用装备及近期解锁所需的现金。", "在游戏内兑换界面查看汇率，再查看想要的外观需要多少金条。", "只考虑兑换不影响作战的余款；Beta 截图不是当前报价。"],
      evidenceTitle: "开发者实际说了什么", evidence: "《Top Questions》说明现金可兑换金条，用于黄金市场的外观解锁。《Early Access & Beyond》说明赛季末剩余现金会自动转换，金条和外观跨赛季保留。",
      unknownTitle: "本页不能提供的数值", unknown: "当前汇率、历史曲线、商品与价格，以及赛季切换时的执行汇率，需要现行客户端或新的官方通知。",
      relatedTitle: "继续了解", relatedMarket: "黑市与仓库", moneyGuide: "现金与回本指南", sourceTitle: "官方来源", checkedLabel: "来源核查于 2026 年 9 月 27 日"
    }
  }
};

const sources = {
  black: [
    {label: "BULKHEAD — Early Access & Beyond announcement", href: "https://steamcommunity.com/games/1867240/announcements/detail/519742851965258340"},
    {label: "BULKHEAD — Early Access & Beyond video", href: "https://www.youtube.com/watch?v=PQvtvAvl-78&t=153s"}
  ],
  gold: [
    {label: "BULKHEAD — WARDOGS Top Questions", href: "https://store.steampowered.com/news/app/1867240/view/1825093633182385"},
    {label: "BULKHEAD — Early Access & Beyond video", href: "https://www.youtube.com/watch?v=PQvtvAvl-78&t=153s"}
  ]
} as const;

export function getMarketCopy(locale: Locale, kind: MarketKind): Copy {
  return copy[locale][kind];
}

export function MarketGuide({locale, kind}: {locale: Locale; kind: MarketKind}) {
  const content = getMarketCopy(locale, kind);
  const otherMarket = kind === "black" ? "gold-market" : "black-market";

  return <main>
    <header className="border-b border-[#2c3631] bg-[#111512] py-14 md:py-20"><div className="site-container max-w-5xl">
      <p className="font-mono text-xs uppercase tracking-widest text-[#68bd8d]">WARDOGS / MARKET INTEL</p>
      <h1 className="display-font mt-4 text-4xl leading-tight text-white md:text-6xl">{content.title}</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-[#b6c2ba] md:text-lg">{content.description}</p>
      <p className="mt-6 text-xs text-[#8fa198]"><time dateTime="2026-09-27">{content.checkedLabel}</time></p>
    </div></header>
    <div className="site-container max-w-5xl py-10 md:py-14">
      <section className="border-l-4 border-[#d9a93a] bg-[#1b211b] px-5 py-6" aria-labelledby="market-status">
        <h2 id="market-status" className="display-font text-2xl text-white">{content.status}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#c3cec6]">{content.statusDetail}</p>
      </section>
      <section className="mt-12" aria-labelledby="market-actions">
        <h2 id="market-actions" className="display-font text-3xl text-white">{content.actionTitle}</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">{content.steps.map((step, index) => <li key={step} className="border-t border-[#354039] pt-4 text-sm leading-7 text-[#c3cec6]"><span className="font-mono text-xs text-[#68bd8d]">0{index + 1}</span><p className="mt-2">{step}</p></li>)}</ol>
      </section>
      <div className="mt-12 grid gap-7 border-t border-[#354039] pt-10 md:grid-cols-2">
        <section aria-labelledby="market-evidence"><h2 id="market-evidence" className="display-font text-2xl text-white">{content.evidenceTitle}</h2><p className="mt-3 text-sm leading-7 text-[#b6c2ba]">{content.evidence}</p></section>
        <section aria-labelledby="market-unknown"><h2 id="market-unknown" className="display-font text-2xl text-white">{content.unknownTitle}</h2><p className="mt-3 text-sm leading-7 text-[#b6c2ba]">{content.unknown}</p></section>
      </div>
      <nav className="mt-12 border-t border-[#354039] pt-8" aria-label={content.relatedTitle}>
        <h2 className="display-font text-2xl text-white">{content.relatedTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-[#79d19c]">
          <a href={publicRoutePath(`/${locale}/${otherMarket}`)} title={content.relatedMarket}>{content.relatedMarket} →</a>
          <a href={publicRoutePath(`/${locale}/guides/wardogs-money-guide`)} title={content.moneyGuide}>{content.moneyGuide} →</a>
        </div>
      </nav>
      <aside className="mt-12 border-t border-[#354039] pt-8" aria-labelledby="market-sources"><h2 id="market-sources" className="display-font text-2xl text-white">{content.sourceTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-[#79d19c]">{sources[kind].map((source) => <li key={source.href}><a href={source.href} title={source.label} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ul>
      </aside>
    </div>
  </main>;
}
