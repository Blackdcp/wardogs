import type {Locale} from "@/config/site";
import type {CatalogGuide} from "@/features/items/item-catalog-guides";
import {getCatalogEntryCount} from "@/features/items/item-catalog-guides";
import {getLocalizedItemType} from "@/features/items/item-localization";
import {getItemType} from "@/features/items/item-library";
import {getCatalogueFreshness} from "./catalogue-evidence";
import type {CatalogueGroup, CatalogueRecord} from "./catalogue-types";

const sectionNames: Record<Exclude<Locale, "en">, Record<string, string>> = {
  "zh-cn": {"Assault Rifles":"突击步枪", SMGs:"冲锋枪", "Shotguns and LMGs":"霰弹枪与轻机枪", "Marksman and Sniper Rifles":"精确射手步枪与狙击步枪", "Bow, Sidearms, and Launchers":"弓、副武器与发射器", "Land Transport":"地面运输", "Armor and Artillery":"装甲与火炮", Aircraft:"飞行器", "Every Calibre":"全部口径", "Short Optics":"低倍率瞄具", "Medium Optics":"中倍率瞄具", "Captured Optics With Incomplete Tooltips":"信息不完整的已记录瞄具", Magazines:"弹匣", Helmets:"头盔", Armor:"护甲", Backpacks:"背包", Offensive:"进攻装备", Medical:"医疗装备", "Recon and Vehicle Support":"侦察与载具支援", "Building and Utility":"建造与通用装备", "Budget Bands":"预算档位"},
  ru: {"Assault Rifles":"Штурмовые винтовки", SMGs:"Пистолеты-пулеметы", "Shotguns and LMGs":"Дробовики и пулеметы", "Marksman and Sniper Rifles":"Марксманские и снайперские винтовки", "Bow, Sidearms, and Launchers":"Лук, пистолеты и пусковые установки", "Land Transport":"Наземный транспорт", "Armor and Artillery":"Бронетехника и артиллерия", Aircraft:"Авиация", "Every Calibre":"Все калибры", "Short Optics":"Прицелы малой кратности", "Medium Optics":"Прицелы средней кратности", "Captured Optics With Incomplete Tooltips":"Прицелы с неполными подсказками", Magazines:"Магазины", Helmets:"Шлемы", Armor:"Броня", Backpacks:"Рюкзаки", Offensive:"Наступательное", Medical:"Медицинское", "Recon and Vehicle Support":"Разведка и обслуживание транспорта", "Building and Utility":"Строительство и вспомогательные средства", "Budget Bands":"Уровни бюджета"},
  de: {"Assault Rifles":"Sturmgewehre", SMGs:"Maschinenpistolen", "Shotguns and LMGs":"Schrotflinten und leichte MGs", "Marksman and Sniper Rifles":"Präzisions- und Scharfschützengewehre", "Bow, Sidearms, and Launchers":"Bogen, Seitenwaffen und Werfer", "Land Transport":"Landtransport", "Armor and Artillery":"Panzerung und Artillerie", Aircraft:"Luftfahrzeuge", "Every Calibre":"Alle Kaliber", "Short Optics":"Optiken mit geringer Vergrößerung", "Medium Optics":"Optiken mit mittlerer Vergrößerung", "Captured Optics With Incomplete Tooltips":"Erfasste Optiken mit unvollständigen Angaben", Magazines:"Magazine", Helmets:"Helme", Armor:"Körperpanzerung", Backpacks:"Rucksäcke", Offensive:"Offensiv", Medical:"Medizinisch", "Recon and Vehicle Support":"Aufklärung und Fahrzeugunterstützung", "Building and Utility":"Bau und Hilfsmittel", "Budget Bands":"Budgetstufen"},
  "pt-br": {"Assault Rifles":"Fuzis de assalto", SMGs:"Submetralhadoras", "Shotguns and LMGs":"Escopetas e metralhadoras leves", "Marksman and Sniper Rifles":"Fuzis de precisão e de atirador", "Bow, Sidearms, and Launchers":"Arco, armas secundárias e lançadores", "Land Transport":"Transporte terrestre", "Armor and Artillery":"Blindados e artilharia", Aircraft:"Aeronaves", "Every Calibre":"Todos os calibres", "Short Optics":"Miras de curto alcance", "Medium Optics":"Miras de médio alcance", "Captured Optics With Incomplete Tooltips":"Miras registradas com dados incompletos", Magazines:"Carregadores", Helmets:"Capacetes", Armor:"Armaduras", Backpacks:"Mochilas", Offensive:"Ofensivo", Medical:"Médico", "Recon and Vehicle Support":"Reconhecimento e suporte a veículos", "Building and Utility":"Construção e utilidade", "Budget Bands":"Faixas de orçamento"},
  ja: {"Assault Rifles":"アサルトライフル", SMGs:"サブマシンガン", "Shotguns and LMGs":"ショットガン・軽機関銃", "Marksman and Sniper Rifles":"マークスマン・スナイパーライフル", "Bow, Sidearms, and Launchers":"弓・サイドアーム・ランチャー", "Land Transport":"地上輸送車両", "Armor and Artillery":"装甲車両・砲兵", Aircraft:"航空機", "Every Calibre":"全口径", "Short Optics":"低倍率サイト", "Medium Optics":"中倍率サイト", "Captured Optics With Incomplete Tooltips":"情報が不完全な確認済みサイト", Magazines:"マガジン", Helmets:"ヘルメット", Armor:"ボディアーマー", Backpacks:"バックパック", Offensive:"攻撃装備", Medical:"医療装備", "Recon and Vehicle Support":"偵察・車両支援", "Building and Utility":"建築・汎用装備", "Budget Bands":"予算区分"}
};

const localeText = {
  "zh-cn": {count:(n:number,l:string)=>`${l}：${n} 条记录`, description:(l:string)=>`WARDOGS ${l}完整观察图鉴。比较型号、定位、测试版本价格和证据，不推测最终平衡。`, disclaimer:"社区在预发布版本中观察到的数据。价格、解锁、平衡和可用性可能在抢先体验前发生变化。", section:(s:string,l:string)=>`${s}：${l}类别中已观察的型号与数值。所有数字仅对应标注的测试版本。`, insight:(l:string)=>[`${l}应按照明确的职责、预算和补给计划选择。`,"已观察数值适合比较选项，但不是最终平衡表。","昂贵选择只有在小队能持续使用和补给时才有价值。"], unknown:(l:string)=>[`${l}在抢先体验版中的最终属性尚未确认。`,"价格、进度、可用性和平衡可能随新版本改变。","不能根据单个视频或截图补写缺失数值。"], asOf:"Alpha 1 — 2026年8月7日", sources:["WARDOGS Steam 页面","Team17 WARDOGS 页面","BULKHEAD WARDOGS 页面"]},
  ru: {count:(n:number,l:string)=>`${n} записей: ${l}`, description:(l:string)=>`Полный наблюдаемый каталог WARDOGS: ${l}. Сравнивайте модели, роли, цены сборки и доказательства без предположений о финальном балансе.`, disclaimer:"Данные сообщества из предрелизной сборки. Цена, разблокировка, баланс и доступность могут измениться до раннего доступа.", section:(s:string,l:string)=>`${s}: наблюдаемые модели и значения для категории «${l}». Все числа относятся к указанной тестовой сборке.`, insight:(l:string)=>[`Категория «${l}» должна выбираться под конкретную роль, бюджет и план снабжения.`,"Наблюдаемые значения помогают сравнивать варианты, но не являются окончательной таблицей баланса.","Дорогой выбор оправдан только тогда, когда отряд может использовать и поддерживать его в бою."], unknown:(l:string)=>[`Финальные характеристики категории «${l}» для раннего доступа не подтверждены.`,"Цены, прогресс, доступность и баланс могут измениться после обновления сборки.","Неуказанное значение не следует восстанавливать по одному видео или скриншоту."], asOf:"Alpha 1 — 7 августа 2026", sources:["WARDOGS в Steam","Страница WARDOGS на Team17","Страница WARDOGS на BULKHEAD"]},
  de: {count:(n:number,l:string)=>`${n} Einträge: ${l}`, description:(l:string)=>`Vollständiger beobachteter WARDOGS-Katalog für ${l}. Vergleiche Modelle, Rollen, Preise der Testversion und Belege ohne Annahmen zur endgültigen Balance.`, disclaimer:"Von der Community beobachtete Vorabdaten. Preise, Freischaltungen, Balance und Verfügbarkeit können sich vor dem Early Access ändern.", section:(s:string,l:string)=>`${s}: beobachtete Modelle und Werte für ${l}. Alle Zahlen beziehen sich auf die angegebene Testversion.`, insight:(l:string)=>[`Wähle ${l} nach klarer Rolle, Budget und Versorgungsplan.`,"Beobachtete Werte ermöglichen Vergleiche, sind aber keine endgültige Balancetabelle.","Eine teure Wahl lohnt sich nur, wenn der Trupp sie im Einsatz unterstützen und versorgen kann."], unknown:(l:string)=>[`Die endgültigen Early-Access-Werte für ${l} sind nicht bestätigt.`,"Preise, Fortschritt, Verfügbarkeit und Balance können sich mit neuen Versionen ändern.","Fehlende Werte dürfen nicht aus einem einzelnen Video oder Bild ergänzt werden."], asOf:"Alpha 1 — 7. August 2026", sources:["WARDOGS auf Steam","WARDOGS bei Team17","WARDOGS bei BULKHEAD"]},
  "pt-br": {count:(n:number,l:string)=>`${n} registros de ${l}`, description:(l:string)=>`Catálogo completo observado de WARDOGS para ${l}. Compare modelos, funções, preços da build e evidências sem presumir o balanceamento final.`, disclaimer:"Dados de pré-lançamento observados pela comunidade. Preços, desbloqueios, balanceamento e disponibilidade podem mudar antes do Acesso Antecipado.", section:(s:string,l:string)=>`${s}: modelos e valores observados para ${l}. Todos os números pertencem à build de teste indicada.`, insight:(l:string)=>[`Escolha ${l} de acordo com uma função, orçamento e plano de suprimento claros.`,"Valores observados ajudam na comparação, mas não são uma tabela final de balanceamento.","Uma opção cara só compensa quando o esquadrão consegue usá-la e sustentá-la em combate."], unknown:(l:string)=>[`Os valores finais de ${l} no Acesso Antecipado não foram confirmados.`,"Preços, progressão, disponibilidade e balanceamento podem mudar com novas builds.","Um valor ausente não deve ser inventado a partir de um único vídeo ou imagem."], asOf:"Alpha 1 — 7 de agosto de 2026", sources:["WARDOGS na Steam","Página de WARDOGS na Team17","Página de WARDOGS na BULKHEAD"]},
  ja: {count:(n:number,l:string)=>`${l} ${n}件`, description:(l:string)=>`WARDOGSで確認できた${l}の完全カタログです。最終バランスを推測せず、モデル、役割、テストビルドの価格、証拠を比較できます。`, disclaimer:"コミュニティが発売前ビルドで確認したデータです。価格、解除条件、バランス、入手可否は早期アクセス前に変更される可能性があります。", section:(s:string,l:string)=>`${s}として確認できた${l}のモデルと数値です。すべての数値は記載されたテストビルド時点の情報です。`, insight:(l:string)=>[`${l}は、明確な役割、予算、補給計画に合わせて選びます。`,"観察済みの数値は候補の比較に使えますが、最終バランス表ではありません。", "高価な選択は、分隊が実戦で運用・補給できる場合にだけ価値を持ちます。"], unknown:(l:string)=>[`${l}の早期アクセス版における最終性能は確認されていません。`,"価格、進行条件、入手可否、バランスは新しいビルドで変わる可能性があります。", "未記載の数値を1本の動画や画像から推測してはいけません。"], asOf:"Alpha 1 — 2026年8月7日", sources:["Steam版WARDOGS","Team17のWARDOGSページ","BULKHEADのWARDOGSページ"]}
} as const;

const localizedDataAsOf: Record<Exclude<Locale, "en">, Record<string, string>> = {
  "zh-cn": {"Alpha 1 - 7 Aug 2026":"Alpha 1 — 2026年8月7日", "Closed Beta - 21-23 Aug 2026":"封闭测试 — 2026年8月21日至23日", "Alpha 1 and Closed Beta - 7-23 Aug 2026":"Alpha 1 与封闭测试 — 2026年8月7日至23日", "Season 1":"第 1 赛季", "Season 1 Early Access":"第 1 赛季抢先体验", "Official pre-release mode explanation":"官方预发布模式说明", "Pre-release catalogue walkthrough - 20 Aug 2026":"预发布图鉴演示 — 2026年8月20日"},
  ru: {
    "Alpha 1 - 7 Aug 2026": "Alpha 1 — 7 августа 2026",
    "Closed Beta - 21-23 Aug 2026": "Закрытая бета — 21–23 августа 2026",
    "Alpha 1 and Closed Beta - 7-23 Aug 2026": "Alpha 1 и закрытая бета — 7–23 августа 2026",
    "Season 1": "Сезон 1",
    "Season 1 Early Access": "Ранний доступ, сезон 1",
    "Official pre-release mode explanation": "Официальное предрелизное объяснение режима",
    "Pre-release catalogue walkthrough - 20 Aug 2026": "Предрелизный обзор каталога — 20 августа 2026",
  },
  de: {
    "Alpha 1 - 7 Aug 2026": "Alpha 1 — 7. August 2026",
    "Closed Beta - 21-23 Aug 2026": "Closed Beta — 21.–23. August 2026",
    "Alpha 1 and Closed Beta - 7-23 Aug 2026": "Alpha 1 und Closed Beta — 7.–23. August 2026",
    "Season 1": "Saison 1",
    "Season 1 Early Access": "Saison 1 im Early Access",
    "Official pre-release mode explanation": "Offizielle Moduserklärung vor Release",
    "Pre-release catalogue walkthrough - 20 Aug 2026": "Katalog-Rundgang vor Release — 20. August 2026",
  },
  "pt-br": {
    "Alpha 1 - 7 Aug 2026": "Alpha 1 — 7 de agosto de 2026",
    "Closed Beta - 21-23 Aug 2026": "Beta Fechado — 21–23 de agosto de 2026",
    "Alpha 1 and Closed Beta - 7-23 Aug 2026": "Alpha 1 e Beta Fechado — 7–23 de agosto de 2026",
    "Season 1": "Temporada 1",
    "Season 1 Early Access": "Temporada 1 do Acesso Antecipado",
    "Official pre-release mode explanation": "Explicação oficial do modo antes do lançamento",
    "Pre-release catalogue walkthrough - 20 Aug 2026": "Visão do catálogo antes do lançamento — 20 de agosto de 2026",
  },
  ja: {
    "Alpha 1 - 7 Aug 2026": "Alpha 1 — 2026年8月7日",
    "Closed Beta - 21-23 Aug 2026": "クローズドベータ — 2026年8月21日～23日",
    "Alpha 1 and Closed Beta - 7-23 Aug 2026": "Alpha 1・クローズドベータ — 2026年8月7日～23日",
    "Season 1": "シーズン1",
    "Season 1 Early Access": "早期アクセス・シーズン1",
    "Official pre-release mode explanation": "公式リリース前モード解説",
    "Pre-release catalogue walkthrough - 20 Aug 2026": "リリース前カタログ解説 — 2026年8月20日",
  },
};

export function localizeCatalogueBuild(value: string, locale: Locale): string {
  return locale === "en" ? value : localizedDataAsOf[locale][value] ?? value;
}

export function formatCatalogueVerifiedAt(value: string, locale: Locale): string {
  const localeTags: Record<Locale, string> = {en: "en-US", de: "de-DE", ru: "ru-RU", "pt-br": "pt-BR", ja: "ja-JP", "zh-cn": "zh-CN"};
  return new Intl.DateTimeFormat(localeTags[locale], {year: "numeric", month: "short", day: "numeric", timeZone: "UTC"})
    .format(new Date(`${value}T00:00:00Z`));
}

const evidenceBoundaryText: Record<Exclude<Locale, "en">, {current: string; historical: string; unknown: string}> = {
  "zh-cn": {current: "这是当前官方资料；仅来源明确支持的事实可视为已确认。", historical: "这是历史预发布记录；价格、解锁、平衡和可用性不得视为当前版本事实。", unknown: "该资料的当前适用性尚未确认；请按标注来源与版本范围使用。"},
  ru: {current: "Это актуальный официальный источник; подтверждены только прямо указанные в нём факты.", historical: "Это историческая предрелизная запись; цены, доступ, баланс и наличие не считаются актуальными.", unknown: "Актуальность не подтверждена; используйте запись только в пределах указанного источника и сборки."},
  de: {current: "Dies ist eine aktuelle offizielle Quelle; bestätigt sind nur die dort ausdrücklich belegten Fakten.", historical: "Dies ist ein historischer Vorabstand; Preise, Freischaltungen, Balance und Verfügbarkeit gelten nicht als aktuell.", unknown: "Die aktuelle Gültigkeit ist ungeklärt; nutze den Eintrag nur im angegebenen Quellen- und Build-Rahmen."},
  "pt-br": {current: "Esta é uma fonte oficial atual; apenas os fatos expressamente sustentados por ela estão confirmados.", historical: "Este é um registro histórico de pré-lançamento; preços, desbloqueios, equilíbrio e disponibilidade não são atuais.", unknown: "A validade atual não foi confirmada; use o registro somente no escopo da fonte e da build indicadas."},
  ja: {current: "現行の公式情報です。出典が明示的に裏付ける事実だけを確認済みとして扱います。", historical: "過去のリリース前記録です。価格、解除条件、バランス、入手可否を現行情報として扱いません。", unknown: "現行ビルドでの有効性は未確認です。記載された出典とビルドの範囲内で参照してください。"},
};

const expandedLabels: Record<Exclude<Locale, "en">, Record<string, string>> = {
  "zh-cn": {LMG:"轻机枪", Shotgun:"霰弹枪", Launcher:"发射器", "Identifier only":"仅记录标识", "Stationary system":"固定式系统", "Closed Beta price":"封闭测试价格", Build:"版本", Verification:"验证", "Anti-air launcher":"防空发射器", "Anti-vehicle launcher":"反载具发射器", "Grenade launcher":"榴弹发射器", "Stationary support":"固定式支援", "Stationary anti-air":"固定式防空", "Stationary artillery":"固定式火炮", "Stationary defense":"固定式防御", "Stationary weapon":"固定式武器"},
  ru: {
    LMG: "Ручной пулемет",
    Shotgun: "Дробовик",
    Launcher: "Пусковая установка",
    "Identifier only": "Только идентификатор",
    "Stationary system": "Стационарная система",
    "Closed Beta price": "Цена в закрытой бете",
    Build: "Сборка",
    Verification: "Проверка",
    "Anti-air launcher": "Зенитная пусковая установка",
    "Anti-vehicle launcher": "Противотранспортная пусковая установка",
    "Grenade launcher": "Гранатомет",
    "Stationary support": "Стационарная поддержка",
    "Stationary anti-air": "Стационарная ПВО",
    "Stationary artillery": "Стационарная артиллерия",
    "Stationary defense": "Стационарная оборона",
    "Stationary weapon": "Стационарное оружие",
  },
  de: {
    LMG: "Leichtes Maschinengewehr",
    Shotgun: "Schrotflinte",
    Launcher: "Werfer",
    "Identifier only": "Nur Bezeichnung",
    "Stationary system": "Stationäres System",
    "Closed Beta price": "Closed-Beta-Preis",
    Build: "Build",
    Verification: "Verifizierung",
    "Anti-air launcher": "Flugabwehrwerfer",
    "Anti-vehicle launcher": "Panzerabwehrwerfer",
    "Grenade launcher": "Granatwerfer",
    "Stationary support": "Stationäre Unterstützung",
    "Stationary anti-air": "Stationäre Flugabwehr",
    "Stationary artillery": "Stationäre Artillerie",
    "Stationary defense": "Stationäre Verteidigung",
    "Stationary weapon": "Stationäre Waffe",
  },
  "pt-br": {
    LMG: "Metralhadora leve",
    Shotgun: "Escopeta",
    Launcher: "Lançador",
    "Identifier only": "Somente identificador",
    "Stationary system": "Sistema estacionário",
    "Closed Beta price": "Preço no Beta Fechado",
    Build: "Build",
    Verification: "Verificação",
    "Anti-air launcher": "Lançador antiaéreo",
    "Anti-vehicle launcher": "Lançador antiveículo",
    "Grenade launcher": "Lança-granadas",
    "Stationary support": "Suporte estacionário",
    "Stationary anti-air": "Defesa antiaérea estacionária",
    "Stationary artillery": "Artilharia estacionária",
    "Stationary defense": "Defesa estacionária",
    "Stationary weapon": "Arma estacionária",
  },
  ja: {
    LMG: "軽機関銃",
    Shotgun: "ショットガン",
    Launcher: "ランチャー",
    "Identifier only": "名称のみ確認",
    "Stationary system": "固定式システム",
    "Closed Beta price": "クローズドベータ価格",
    Build: "ビルド",
    Verification: "確認状態",
    "Anti-air launcher": "対空ランチャー",
    "Anti-vehicle launcher": "対車両ランチャー",
    "Grenade launcher": "グレネードランチャー",
    "Stationary support": "固定式支援装備",
    "Stationary anti-air": "固定式対空装備",
    "Stationary artillery": "固定式砲兵装備",
    "Stationary defense": "固定式防衛装備",
    "Stationary weapon": "固定式兵器",
  },
};

const expandedSectionNames: Record<Exclude<Locale, "en">, Record<string, string>> = {
  "zh-cn": {"Closed Beta Identifiers":"封闭测试标识", "Closed Beta Systems and Identifiers":"封闭测试系统与标识"},
  ru: {
    "Closed Beta Identifiers": "Идентификаторы закрытой беты",
    "Closed Beta Systems and Identifiers": "Системы и идентификаторы закрытой беты",
  },
  de: {
    "Closed Beta Identifiers": "Bezeichnungen aus der Closed Beta",
    "Closed Beta Systems and Identifiers": "Systeme und Bezeichnungen aus der Closed Beta",
  },
  "pt-br": {
    "Closed Beta Identifiers": "Identificadores do Beta Fechado",
    "Closed Beta Systems and Identifiers": "Sistemas e identificadores do Beta Fechado",
  },
  ja: {
    "Closed Beta Identifiers": "クローズドベータで確認した名称",
    "Closed Beta Systems and Identifiers": "クローズドベータのシステムと名称",
  },
};

const fieldReferenceLabels: Record<Exclude<Locale, "en">, Record<string, string>> = {
  "zh-cn": {
    "Vehicle support":"载具支援", "Personal recovery":"个人恢复", "Squad recovery":"小队救治", Supplies:"补给物资", Fuel:"燃料", Mechanical:"机械补给", "Route denial":"路线封锁", "FOB asset":"FOB 设施", "Objective support":"目标支援", Objective:"目标", Economy:"经济", Support:"支援", Orientation:"地图判读", Construction:"建造", Logistics:"后勤", "Fire support":"火力支援", "Air operations":"空中行动", "Observed role":"已观察用途", "Observed form":"已观察形态", "Observed dependency":"已观察依赖", "Observed family":"已观察类别", "Evidence scope":"证据范围", "Primary task":"主要任务", Context:"适用场景", "Supply Types":"补给类型", "Route Denial":"路线封锁", "FOB and Objective Assets":"FOB 与目标设施", "Objective and Economy Systems":"目标与经济系统", "Medical item":"医疗物品", Supply:"补给", Deployable:"部署物", Mechanic:"机制", System:"系统", "Confirmed fact":"已确认事实", "Evidence state":"证据状态", "Evidence window":"证据时期"
  },
  ru: {
    "Vehicle support":"Поддержка транспорта", "Personal recovery":"Личное восстановление", "Squad recovery":"Помощь отряду", Supplies:"Снабжение", Fuel:"Топливо", Mechanical:"Механическое снабжение", "Route denial":"Блокирование маршрута", "FOB asset":"Объект FOB", "Objective support":"Поддержка цели", Objective:"Цель", Economy:"Экономика", Support:"Поддержка", Orientation:"Ориентирование", Construction:"Строительство", Logistics:"Логистика", "Fire support":"Огневая поддержка", "Air operations":"Воздушные операции", "Observed role":"Наблюдаемая роль", "Observed form":"Наблюдаемая форма", "Observed dependency":"Наблюдаемая зависимость", "Observed family":"Наблюдаемая категория", "Evidence scope":"Границы доказательства", "Primary task":"Основная задача", Context:"Контекст", "Supply Types":"Типы снабжения", "Route Denial":"Блокирование маршрута", "FOB and Objective Assets":"Объекты FOB и цели", "Objective and Economy Systems":"Системы целей и экономики", "Medical item":"Медицинский предмет", Supply:"Снабжение", Deployable:"Развёртываемый объект", Mechanic:"Механика", System:"Система", "Confirmed fact":"Подтверждённый факт", "Evidence state":"Статус доказательства", "Evidence window":"Период доказательства"
  },
  de: {
    "Vehicle support":"Fahrzeugunterstützung", "Personal recovery":"Eigene Regeneration", "Squad recovery":"Trupprettung", Supplies:"Versorgung", Fuel:"Treibstoff", Mechanical:"Mechanisch", "Route denial":"Wegsperre", "FOB asset":"FOB-Anlage", "Objective support":"Zielunterstützung", Objective:"Ziel", Economy:"Wirtschaft", Support:"Unterstützung", Orientation:"Orientierung", Construction:"Bau", Logistics:"Logistik", "Fire support":"Feuerunterstützung", "Air operations":"Luftoperationen", "Observed role":"Beobachtete Rolle", "Observed form":"Beobachtete Form", "Observed dependency":"Beobachtete Abhängigkeit", "Observed family":"Beobachtete Kategorie", "Evidence scope":"Belegumfang", "Primary task":"Hauptaufgabe", Context:"Kontext", "Supply Types":"Versorgungsarten", "Route Denial":"Wegsperre", "FOB and Objective Assets":"FOB- und Zielanlagen", "Objective and Economy Systems":"Ziel- und Wirtschaftssysteme", "Medical item":"Medizinischer Gegenstand", Supply:"Versorgung", Deployable:"Platzierbares System", Mechanic:"Mechanik", System:"System", "Confirmed fact":"Bestätigte Tatsache", "Evidence state":"Belegstatus", "Evidence window":"Belegzeitraum"
  },
  "pt-br": {
    "Vehicle support":"Suporte a veículos", "Personal recovery":"Recuperação pessoal", "Squad recovery":"Recuperação do esquadrão", Supplies:"Suprimentos", Fuel:"Combustível", Mechanical:"Mecânico", "Route denial":"Bloqueio de rota", "FOB asset":"Recurso de FOB", "Objective support":"Suporte ao objetivo", Objective:"Objetivo", Economy:"Economia", Support:"Suporte", Orientation:"Orientação", Construction:"Construção", Logistics:"Logística", "Fire support":"Apoio de fogo", "Air operations":"Operações aéreas", "Observed role":"Função observada", "Observed form":"Forma observada", "Observed dependency":"Dependência observada", "Observed family":"Categoria observada", "Evidence scope":"Escopo da evidência", "Primary task":"Tarefa principal", Context:"Contexto", "Supply Types":"Tipos de suprimento", "Route Denial":"Bloqueio de rota", "FOB and Objective Assets":"Recursos de FOB e objetivo", "Objective and Economy Systems":"Sistemas de objetivo e economia", "Medical item":"Item médico", Supply:"Suprimento", Deployable:"Item posicionável", Mechanic:"Mecânica", System:"Sistema", "Confirmed fact":"Fato confirmado", "Evidence state":"Estado da evidência", "Evidence window":"Período da evidência"
  },
  ja: {
    "Vehicle support":"車両支援", "Personal recovery":"自己回復", "Squad recovery":"分隊救護", Supplies:"補給物資", Fuel:"燃料", Mechanical:"整備", "Route denial":"経路阻止", "FOB asset":"FOB施設", "Objective support":"目標支援", Objective:"目標", Economy:"経済", Support:"支援", Orientation:"状況把握", Construction:"建設", Logistics:"兵站", "Fire support":"火力支援", "Air operations":"航空作戦", "Observed role":"確認済み用途", "Observed form":"確認済み形態", "Observed dependency":"確認済み依存関係", "Observed family":"確認済み分類", "Evidence scope":"証拠の範囲", "Primary task":"主要任務", Context:"状況", "Supply Types":"補給物資の種類", "Route Denial":"経路阻止", "FOB and Objective Assets":"FOB・目標施設", "Objective and Economy Systems":"目標・経済システム", "Medical item":"医療アイテム", Supply:"補給物資", Deployable:"設置物", Mechanic:"システム", System:"分類", "Confirmed fact":"確認済み事実", "Evidence state":"証拠状態", "Evidence window":"証拠の時期"
  },
};

const fieldReferenceValues: Record<Exclude<Locale, "en">, Record<string, string>> = {
  "zh-cn": {
    "Recon observation":"侦察观察", "Name and catalogue category":"名称与图鉴分类", "Distance and bearing observation":"距离与方位观察", "Item label only":"仅确认物品名称", "Portable fuel container":"便携燃料容器", "Fuel container segment, 01:03-02:16":"燃料容器片段 01:03-02:16", "Repair equipment":"维修器材", "Battery-powered in the walkthrough":"演示中由电池供电", "Portable power source":"便携电源", "Personal recovery":"个人恢复", "Medical segment, 02:16-03:23":"医疗片段 02:16-03:23", "Squad recovery":"小队救治", "Improvised explosive":"简易爆炸物", "Explosives segment, 01:03-02:16":"爆炸物片段 01:03-02:16", "Anti-vehicle mine":"反载具地雷", "Directional mine":"定向地雷", "Three teams fight across a 16 km² battlefield":"三支队伍在 16 平方公里战场中作战", "Randomized 2 x 2 km Control Zone":"随机生成的 2×2 公里控制区", "Tower terminals appear in the official pre-release mode explanation":"官方预发布模式说明展示了塔楼终端", "Official pre-release footage checked 26 Aug 2026":"官方预发布画面于 2026 年 8 月 26 日核查", "FOB-built objective support structure":"由 FOB 建造的目标支援设施", "Construction supplies and fuel in Closed Beta":"封闭测试中需要建造补给与燃料", "The official description includes base building":"官方说明包含基地建造", "The official description includes logistics and transport":"官方说明包含后勤与运输", "Vehicles carry supply pallets to field destinations":"载具将补给托盘运往战场目的地", "Closed Beta creator walkthrough":"封闭测试创作者演示", "Crew-operated indirect-fire emplacement":"由乘员操作的间接火力阵地", "Closed Beta creator demonstration":"封闭测试创作者演示", "Helicopter transport of players or supplies":"直升机运输玩家或补给", "Closed Beta creator guide":"封闭测试创作者攻略"
  },
  ru: {
    "Recon observation":"Разведывательное наблюдение", "Name and catalogue category":"Название и категория каталога", "Distance and bearing observation":"Определение дальности и направления", "Item label only":"Подтверждено только название", "Portable fuel container":"Переносная ёмкость для топлива", "Fuel container segment, 01:03-02:16":"Фрагмент о топливе, 01:03-02:16", "Repair equipment":"Ремонтное оборудование", "Battery-powered in the walkthrough":"В демонстрации работает от батареи", "Portable power source":"Переносной источник питания", "Personal recovery":"Личное восстановление", "Medical segment, 02:16-03:23":"Медицинский фрагмент, 02:16-03:23", "Squad recovery":"Помощь отряду", "Improvised explosive":"Самодельное взрывное устройство", "Explosives segment, 01:03-02:16":"Фрагмент о взрывчатке, 01:03-02:16", "Anti-vehicle mine":"Противотранспортная мина", "Directional mine":"Мина направленного действия", "Three teams fight across a 16 km² battlefield":"Три команды сражаются на поле боя площадью 16 км²", "Randomized 2 x 2 km Control Zone":"Случайная зона контроля 2 × 2 км", "Tower terminals appear in the official pre-release mode explanation":"Терминалы башен показаны в официальном предрелизном описании режима", "Official pre-release footage checked 26 Aug 2026":"Официальные предрелизные кадры проверены 26 августа 2026 года", "FOB-built objective support structure":"Построенный на FOB объект поддержки цели", "Construction supplies and fuel in Closed Beta":"Стройматериалы и топливо в закрытой бете", "The official description includes base building":"Официальное описание включает строительство баз", "The official description includes logistics and transport":"Официальное описание включает логистику и транспорт", "Vehicles carry supply pallets to field destinations":"Транспорт доставляет паллеты снабжения в полевые точки", "Closed Beta creator walkthrough":"Авторское прохождение закрытой беты", "Crew-operated indirect-fire emplacement":"Расчётная позиция непрямого огня", "Closed Beta creator demonstration":"Авторская демонстрация закрытой беты", "Helicopter transport of players or supplies":"Перевозка игроков или припасов вертолётом", "Closed Beta creator guide":"Авторский гайд по закрытой бете"
  },
  de: {
    "Recon observation":"Aufklärungsbeobachtung", "Name and catalogue category":"Name und Katalogkategorie", "Distance and bearing observation":"Entfernungs- und Richtungsbeobachtung", "Item label only":"Nur Gegenstandsname bestätigt", "Portable fuel container":"Tragbarer Treibstoffbehälter", "Fuel container segment, 01:03-02:16":"Treibstoffbehälter-Segment, 01:03-02:16", "Repair equipment":"Reparaturgerät", "Battery-powered in the walkthrough":"In der Demonstration batteriebetrieben", "Portable power source":"Tragbare Stromquelle", "Personal recovery":"Eigene Regeneration", "Medical segment, 02:16-03:23":"Medizin-Segment, 02:16-03:23", "Squad recovery":"Trupprettung", "Improvised explosive":"Improvisierter Sprengsatz", "Explosives segment, 01:03-02:16":"Sprengstoff-Segment, 01:03-02:16", "Anti-vehicle mine":"Panzerabwehrmine", "Directional mine":"Richtmine", "Three teams fight across a 16 km² battlefield":"Drei Teams kämpfen auf einem 16 km² großen Schlachtfeld", "Randomized 2 x 2 km Control Zone":"Zufällige 2 × 2 km große Control Zone", "Tower terminals appear in the official pre-release mode explanation":"Turmterminals erscheinen in der offiziellen Vorab-Erklärung des Modus", "Official pre-release footage checked 26 Aug 2026":"Offizielles Vorabmaterial am 26. August 2026 geprüft", "FOB-built objective support structure":"An einer FOB gebaute Zielunterstützungsanlage", "Construction supplies and fuel in Closed Beta":"Baumaterial und Treibstoff in der Closed Beta", "The official description includes base building":"Die offizielle Beschreibung nennt Basisbau", "The official description includes logistics and transport":"Die offizielle Beschreibung nennt Logistik und Transport", "Vehicles carry supply pallets to field destinations":"Fahrzeuge bringen Versorgungspaletten zu Feldzielen", "Closed Beta creator walkthrough":"Creator-Demonstration aus der Closed Beta", "Crew-operated indirect-fire emplacement":"Von einer Besatzung bediente indirekte Feuerstellung", "Closed Beta creator demonstration":"Creator-Demonstration aus der Closed Beta", "Helicopter transport of players or supplies":"Helikoptertransport von Spielern oder Versorgung", "Closed Beta creator guide":"Creator-Guide aus der Closed Beta"
  },
  "pt-br": {
    "Recon observation":"Observação de reconhecimento", "Name and catalogue category":"Nome e categoria do catálogo", "Distance and bearing observation":"Observação de distância e direção", "Item label only":"Apenas o nome do item", "Portable fuel container":"Recipiente portátil de combustível", "Fuel container segment, 01:03-02:16":"Trecho do recipiente de combustível, 01:03-02:16", "Repair equipment":"Equipamento de reparo", "Battery-powered in the walkthrough":"Alimentado por bateria na demonstração", "Portable power source":"Fonte de energia portátil", "Personal recovery":"Recuperação pessoal", "Medical segment, 02:16-03:23":"Trecho médico, 02:16-03:23", "Squad recovery":"Recuperação do esquadrão", "Improvised explosive":"Explosivo improvisado", "Explosives segment, 01:03-02:16":"Trecho de explosivos, 01:03-02:16", "Anti-vehicle mine":"Mina antiveículo", "Directional mine":"Mina direcional", "Three teams fight across a 16 km² battlefield":"Três equipes lutam em um campo de batalha de 16 km²", "Randomized 2 x 2 km Control Zone":"Control Zone aleatória de 2 × 2 km", "Tower terminals appear in the official pre-release mode explanation":"Terminais de torre aparecem na explicação oficial do modo antes do lançamento", "Official pre-release footage checked 26 Aug 2026":"Material oficial de pré-lançamento verificado em 26 de agosto de 2026", "FOB-built objective support structure":"Estrutura de suporte ao objetivo construída em FOB", "Construction supplies and fuel in Closed Beta":"Suprimentos de construção e combustível no Beta Fechado", "The official description includes base building":"A descrição oficial inclui construção de bases", "The official description includes logistics and transport":"A descrição oficial inclui logística e transporte", "Vehicles carry supply pallets to field destinations":"Veículos levam paletes de suprimentos a destinos no campo", "Closed Beta creator walkthrough":"Demonstração de criador no Beta Fechado", "Crew-operated indirect-fire emplacement":"Posição de fogo indireto operada por equipe", "Closed Beta creator demonstration":"Demonstração de criador no Beta Fechado", "Helicopter transport of players or supplies":"Transporte de jogadores ou suprimentos por helicóptero", "Closed Beta creator guide":"Guia de criador do Beta Fechado"
  },
  ja: {
    "Recon observation":"偵察観測", "Name and catalogue category":"名称とカタログ分類", "Distance and bearing observation":"距離と方位の観測", "Item label only":"アイテム名のみ確認", "Portable fuel container":"携行燃料容器", "Fuel container segment, 01:03-02:16":"燃料容器の区間 01:03-02:16", "Repair equipment":"修理器材", "Battery-powered in the walkthrough":"映像内ではバッテリー駆動", "Portable power source":"携行電源", "Personal recovery":"自己回復", "Medical segment, 02:16-03:23":"医療区間 02:16-03:23", "Squad recovery":"分隊救護", "Improvised explosive":"即製爆発物", "Explosives segment, 01:03-02:16":"爆発物の区間 01:03-02:16", "Anti-vehicle mine":"対車両地雷", "Directional mine":"指向性地雷", "Three teams fight across a 16 km² battlefield":"3チームが16 km²の戦場で交戦", "Randomized 2 x 2 km Control Zone":"ランダムな2×2 kmのControl Zone", "Tower terminals appear in the official pre-release mode explanation":"公式発売前モード解説にタワー端末が登場", "Official pre-release footage checked 26 Aug 2026":"公式発売前映像を2026年8月26日に確認", "FOB-built objective support structure":"FOBで建設する目標支援施設", "Construction supplies and fuel in Closed Beta":"クローズドベータでの建設物資と燃料", "The official description includes base building":"公式説明に基地建設を記載", "The official description includes logistics and transport":"公式説明に兵站と輸送を記載", "Vehicles carry supply pallets to field destinations":"車両が補給パレットを現地へ輸送", "Closed Beta creator walkthrough":"クローズドベータのクリエイター解説", "Crew-operated indirect-fire emplacement":"班員が操作する間接射撃陣地", "Closed Beta creator demonstration":"クローズドベータのクリエイター実演", "Helicopter transport of players or supplies":"ヘリによるプレイヤーまたは物資の輸送", "Closed Beta creator guide":"クローズドベータのクリエイター攻略"
  },
};

const valueMaps: Record<Exclude<Locale, "en">, Record<string, string>> = {
  "zh-cn": {Weapon:"武器", Vehicle:"载具", Calibre:"口径", Attachment:"配件", Gear:"个人装备", Equipment:"战术装备", Band:"预算档位", "Alpha price":"Alpha 测试价格", Ammunition:"弹药", "Fire modes":"射击模式", Weight:"重量", Progression:"进度", Role:"定位", "Observed gate":"已观察解锁条件", Track:"进度路线", "Base damage":"基础伤害", Loads:"弹种", "Standard per round":"标准单发价格", "Box price":"弹药箱价格", Weapons:"适用武器", Kind:"类型", "Zoom or capacity":"倍率或容量", "Weight or calibre":"重量或口径", Slot:"栏位", Tier:"等级", "Recorded identifier":"已记录标识", "Spending rule":"花费原则", "Best use":"最佳用途", "Main risk":"主要风险", "Not captured":"未记录", "Gate unread":"条件无法辨认", "Open purchase":"可直接购买", Variable:"可变", fixed:"固定", "Semi / Full Auto":"半自动 / 全自动", "Semi / Burst":"半自动 / 点射", "Semi automatic":"半自动", "Break-action":"折开式", "Single-shot":"单发", "Bolt action":"栓动", "Bolt-action / Magazine":"栓动 / 弹匣", "Pull and Release":"拉弓并释放", "Assault XP":"突击经验", "Medic XP":"医疗经验", "Support XP":"支援经验", "Recon XP":"侦察经验", "Driver XP":"驾驶经验", "Pilot XP":"飞行经验", Driver:"驾驶员", Pilot:"飞行员", Wardog:"战士", Optic:"瞄具", Magazine:"弹匣", Helmet:"头盔", Armor:"护甲", Backpack:"背包", Special:"特殊", Lightest:"最轻", Offensive:"进攻", Medical:"医疗", Recon:"侦察", Building:"建造", Utility:"通用", "Building / Offensive":"建造 / 进攻", "Assault rifle":"突击步枪", SMG:"冲锋枪", "Marksman rifle":"精确射手步枪", "Sniper rifle":"狙击步枪", Bow:"弓", Sidearm:"副武器", "Light transport":"轻型运输", "Fast transport":"快速运输", "Utility transport":"通用运输", "Cargo transport":"货运载具", "Protected transport":"防护运输", "Armed transport":"武装运输", "Heavy armed transport":"重型武装运输", "Logistics truck":"后勤卡车", "Protected logistics":"防护后勤", "Armed logistics":"武装后勤", "Anti-air armor":"防空装甲载具", "Main battle tank":"主战坦克", "Self-propelled artillery":"自行火炮", "Combat helicopter":"战斗直升机", "Armed utility helicopter":"武装通用直升机", "Rocket helicopter":"火箭直升机", "Attack helicopter":"攻击直升机", "Light air transport":"轻型空运", "Air transport":"空中运输", Budget:"低预算", Standard:"标准", "Full Budget":"全额投入"},
  ru: {
    Weapon:"Оружие", Vehicle:"Транспорт", Calibre:"Калибр", Attachment:"Модификация", Gear:"Экипировка", Equipment:"Оборудование", Band:"Бюджет",
    "Alpha price":"Цена в Alpha", Ammunition:"Боеприпасы", "Fire modes":"Режимы огня", Weight:"Вес", Progression:"Прогресс", Role:"Роль", "Observed gate":"Условие доступа", Track:"Ветка",
    "Base damage":"Базовый урон", Loads:"Типы зарядов", "Standard per round":"Цена стандартного патрона", "Box price":"Цена коробки", Weapons:"Оружие",
    Kind:"Тип", "Zoom or capacity":"Кратность или емкость", "Weight or calibre":"Вес или калибр", Slot:"Слот", Tier:"Уровень", "Recorded identifier":"Идентификатор",
    "Spending rule":"Правило расходов", "Best use":"Лучшее применение", "Main risk":"Главный риск",
    "Not captured":"Не зафиксировано", "Gate unread":"Условие не читается", "Open purchase":"Свободная покупка", Variable:"Переменная кратность", fixed:"фиксированная",
    "Semi / Full Auto":"Одиночный / автоматический", "Semi / Burst":"Одиночный / очередь", "Semi automatic":"Полуавтоматический", "Break-action":"Переломный механизм", "Single-shot":"Одиночный выстрел", "Bolt action":"Продольно-скользящий затвор", "Bolt-action / Magazine":"Скользящий затвор / магазин", "Pull and Release":"Натяжение и отпускание",
    "Assault XP":"Опыт штурмовика", "Medic XP":"Опыт медика", "Support XP":"Опыт поддержки", "Recon XP":"Опыт разведчика", "Driver XP":"Опыт водителя", "Pilot XP":"Опыт пилота",
    Driver:"Водитель", Pilot:"Пилот", Wardog:"Боец", Optic:"Прицел", Magazine:"Магазин", Helmet:"Шлем", Armor:"Броня", Backpack:"Рюкзак", Special:"Особый", Lightest:"Самый легкий",
    Offensive:"Наступательное", Medical:"Медицинское", Recon:"Разведка", Building:"Строительство", Utility:"Вспомогательное", "Building / Offensive":"Строительство / наступление",
    "Assault rifle":"Штурмовая винтовка", SMG:"Пистолет-пулемет", "Marksman rifle":"Марксманская винтовка", "Sniper rifle":"Снайперская винтовка", Bow:"Лук", Sidearm:"Пистолет",
    "Light transport":"Легкий транспорт", "Fast transport":"Быстрый транспорт", "Utility transport":"Вспомогательный транспорт", "Cargo transport":"Грузовой транспорт", "Protected transport":"Защищенный транспорт", "Armed transport":"Вооруженный транспорт", "Heavy armed transport":"Тяжелый вооруженный транспорт", "Logistics truck":"Грузовик снабжения", "Protected logistics":"Защищенное снабжение", "Armed logistics":"Вооруженное снабжение", "Anti-air armor":"Зенитная бронетехника", "Main battle tank":"Основной боевой танк", "Self-propelled artillery":"Самоходная артиллерия", "Combat helicopter":"Боевой вертолет", "Armed utility helicopter":"Вооруженный многоцелевой вертолет", "Rocket helicopter":"Ракетный вертолет", "Attack helicopter":"Ударный вертолет", "Light air transport":"Легкий воздушный транспорт", "Air transport":"Воздушный транспорт",
    Budget:"Экономный", Standard:"Стандартный", "Full Budget":"Полный бюджет", "Protect most of the $10,000 starting balance":"Сохранить большую часть стартовых $10 000", "Balance weapon, ammunition, protection, and one job":"Сбалансировать оружие, боеприпасы, защиту и одну задачу", "Commit heavily to a specialist role or vehicle":"Вложиться в специализированную роль или транспорт", "Learning routes, support play, repeated lives":"Изучение маршрутов, поддержка и повторные выходы", "Regular squad play and objective pushes":"Обычная игра отрядом и штурм целей", "Coordinated armor, air, sniper, or demolition play":"Согласованная игра на бронетехнике, авиации, снайпере или подрывнике", "Low armor and limited specialist tools":"Слабая броня и мало специальных средств", "Can become unfocused if every slot is upgraded":"Комплект теряет специализацию при улучшении каждого слота", "One bad loss can remove multiple future options":"Одна неудачная потеря ограничит несколько будущих выходов"
  },
  de: {
    Weapon:"Waffe", Vehicle:"Fahrzeug", Calibre:"Kaliber", Attachment:"Aufsatz", Gear:"Ausrüstung", Equipment:"Gerät", Band:"Budgetstufe",
    "Alpha price":"Alpha-Preis", Ammunition:"Munition", "Fire modes":"Feuermodi", Weight:"Gewicht", Progression:"Fortschritt", Role:"Rolle", "Observed gate":"Beobachtete Freischaltung", Track:"Fortschrittszweig",
    "Base damage":"Basisschaden", Loads:"Ladungsarten", "Standard per round":"Standardpreis je Schuss", "Box price":"Packungspreis", Weapons:"Waffen",
    Kind:"Art", "Zoom or capacity":"Vergrößerung oder Kapazität", "Weight or calibre":"Gewicht oder Kaliber", Slot:"Slot", Tier:"Stufe", "Recorded identifier":"Erfasste Kennung",
    "Spending rule":"Ausgabenregel", "Best use":"Bester Einsatz", "Main risk":"Hauptrisiko",
    "Not captured":"Nicht erfasst", "Gate unread":"Freischaltung unlesbar", "Open purchase":"Frei kaufbar", Variable:"Variabel", fixed:"fest",
    "Semi / Full Auto":"Einzelfeuer / Vollautomatik", "Semi / Burst":"Einzelfeuer / Feuerstoß", "Semi automatic":"Halbautomatisch", "Break-action":"Kipplauf", "Single-shot":"Einzelschuss", "Bolt action":"Repetierer", "Bolt-action / Magazine":"Repetierer / Magazin", "Pull and Release":"Spannen und Lösen",
    "Assault XP":"Sturm-XP", "Medic XP":"Sanitäter-XP", "Support XP":"Unterstützungs-XP", "Recon XP":"Aufklärungs-XP", "Driver XP":"Fahrer-XP", "Pilot XP":"Piloten-XP",
    Driver:"Fahrer", Pilot:"Pilot", Wardog:"Wardog", Optic:"Optik", Magazine:"Magazin", Helmet:"Helm", Armor:"Panzerung", Backpack:"Rucksack", Special:"Spezial", Lightest:"Am leichtesten",
    Offensive:"Offensiv", Medical:"Medizinisch", Recon:"Aufklärung", Building:"Bau", Utility:"Hilfsmittel", "Building / Offensive":"Bau / offensiv",
    "Assault rifle":"Sturmgewehr", SMG:"Maschinenpistole", "Marksman rifle":"Präzisionsgewehr", "Sniper rifle":"Scharfschützengewehr", Bow:"Bogen", Sidearm:"Seitenwaffe",
    "Light transport":"Leichttransport", "Fast transport":"Schnelltransport", "Utility transport":"Mehrzwecktransport", "Cargo transport":"Frachttransport", "Protected transport":"Geschützter Transport", "Armed transport":"Bewaffneter Transport", "Heavy armed transport":"Schwer bewaffneter Transport", "Logistics truck":"Logistik-Lkw", "Protected logistics":"Geschützte Logistik", "Armed logistics":"Bewaffnete Logistik", "Anti-air armor":"Flugabwehrpanzer", "Main battle tank":"Kampfpanzer", "Self-propelled artillery":"Panzerhaubitze", "Combat helicopter":"Kampfhubschrauber", "Armed utility helicopter":"Bewaffneter Mehrzweckhubschrauber", "Rocket helicopter":"Raketenhubschrauber", "Attack helicopter":"Angriffshubschrauber", "Light air transport":"Leichter Lufttransport", "Air transport":"Lufttransport",
    Budget:"Günstig", Standard:"Standard", "Full Budget":"Volles Budget", "Protect most of the $10,000 starting balance":"Den Großteil der 10.000 Dollar Startkapital schützen", "Balance weapon, ammunition, protection, and one job":"Waffe, Munition, Schutz und eine Aufgabe ausbalancieren", "Commit heavily to a specialist role or vehicle":"Stark in eine Spezialrolle oder ein Fahrzeug investieren", "Learning routes, support play, repeated lives":"Routen lernen, unterstützen und wiederholt ausrücken", "Regular squad play and objective pushes":"Reguläres Truppspiel und Vorstöße auf Ziele", "Coordinated armor, air, sniper, or demolition play":"Koordinierter Einsatz von Panzerung, Luftwaffe, Scharfschützen oder Sprengmitteln", "Low armor and limited specialist tools":"Wenig Schutz und begrenzte Spezialwerkzeuge", "Can become unfocused if every slot is upgraded":"Verliert den Schwerpunkt, wenn jeder Slot aufgerüstet wird", "One bad loss can remove multiple future options":"Ein schlechter Verlust nimmt mehrere spätere Optionen"
  },
  "pt-br": {
    Weapon:"Arma", Vehicle:"Veículo", Calibre:"Calibre", Attachment:"Acessório", Gear:"Equipamento pessoal", Equipment:"Equipamento", Band:"Faixa",
    "Alpha price":"Preço no Alpha", Ammunition:"Munição", "Fire modes":"Modos de disparo", Weight:"Peso", Progression:"Progressão", Role:"Função", "Observed gate":"Requisito observado", Track:"Trilha",
    "Base damage":"Dano base", Loads:"Tipos de carga", "Standard per round":"Padrão por disparo", "Box price":"Preço da caixa", Weapons:"Armas",
    Kind:"Tipo", "Zoom or capacity":"Ampliação ou capacidade", "Weight or calibre":"Peso ou calibre", Slot:"Espaço", Tier:"Nível", "Recorded identifier":"Identificador registrado",
    "Spending rule":"Regra de gasto", "Best use":"Melhor uso", "Main risk":"Principal risco",
    "Not captured":"Não registrado", "Gate unread":"Requisito ilegível", "Open purchase":"Compra livre", Variable:"Variável", fixed:"fixo",
    "Semi / Full Auto":"Semiautomático / automático", "Semi / Burst":"Semiautomático / rajada", "Semi automatic":"Semiautomático", "Break-action":"Ação basculante", "Single-shot":"Tiro único", "Bolt action":"Ação por ferrolho", "Bolt-action / Magazine":"Ferrolho / carregador", "Pull and Release":"Puxar e soltar",
    "Assault XP":"XP de assalto", "Medic XP":"XP de médico", "Support XP":"XP de suporte", "Recon XP":"XP de reconhecimento", "Driver XP":"XP de motorista", "Pilot XP":"XP de piloto",
    Driver:"Motorista", Pilot:"Piloto", Wardog:"Wardog", Optic:"Mira", Magazine:"Carregador", Helmet:"Capacete", Armor:"Armadura", Backpack:"Mochila", Special:"Especial", Lightest:"Mais leve",
    Offensive:"Ofensivo", Medical:"Médico", Recon:"Reconhecimento", Building:"Construção", Utility:"Utilidade", "Building / Offensive":"Construção / ofensivo",
    "Assault rifle":"Fuzil de assalto", SMG:"Submetralhadora", "Marksman rifle":"Fuzil de precisão", "Sniper rifle":"Fuzil de atirador", Bow:"Arco", Sidearm:"Arma secundária",
    "Light transport":"Transporte leve", "Fast transport":"Transporte rápido", "Utility transport":"Transporte utilitário", "Cargo transport":"Transporte de carga", "Protected transport":"Transporte protegido", "Armed transport":"Transporte armado", "Heavy armed transport":"Transporte pesado armado", "Logistics truck":"Caminhão logístico", "Protected logistics":"Logística protegida", "Armed logistics":"Logística armada", "Anti-air armor":"Blindado antiaéreo", "Main battle tank":"Carro de combate principal", "Self-propelled artillery":"Artilharia autopropulsada", "Combat helicopter":"Helicóptero de combate", "Armed utility helicopter":"Helicóptero utilitário armado", "Rocket helicopter":"Helicóptero de foguetes", "Attack helicopter":"Helicóptero de ataque", "Light air transport":"Transporte aéreo leve", "Air transport":"Transporte aéreo",
    Budget:"Econômico", Standard:"Padrão", "Full Budget":"Orçamento total", "Protect most of the $10,000 starting balance":"Preservar a maior parte dos 10.000 dólares iniciais", "Balance weapon, ammunition, protection, and one job":"Equilibrar arma, munição, proteção e uma função", "Commit heavily to a specialist role or vehicle":"Investir muito em uma função especializada ou veículo", "Learning routes, support play, repeated lives":"Aprender rotas, apoiar e voltar várias vezes", "Regular squad play and objective pushes":"Jogo regular em esquadrão e avanço nos objetivos", "Coordinated armor, air, sniper, or demolition play":"Ação coordenada com blindado, aviação, atirador ou demolição", "Low armor and limited specialist tools":"Pouca armadura e ferramentas especializadas limitadas", "Can become unfocused if every slot is upgraded":"Pode perder o foco se todos os espaços forem melhorados", "One bad loss can remove multiple future options":"Uma perda ruim pode eliminar várias opções futuras"
  },
  ja: {
    Weapon:"武器", Vehicle:"車両", Calibre:"口径", Attachment:"アタッチメント", Gear:"個人装備", Equipment:"特殊装備", Band:"予算帯",
    "Alpha price":"アルファ価格", Ammunition:"弾薬", "Fire modes":"射撃モード", Weight:"重量", Progression:"進行系統", Role:"役割", "Observed gate":"確認済み解除条件", Track:"進行ルート",
    "Base damage":"基礎ダメージ", Loads:"弾種数", "Standard per round":"標準弾1発の価格", "Box price":"ボックス価格", Weapons:"対応武器数",
    Kind:"種類", "Zoom or capacity":"倍率・容量", "Weight or calibre":"重量・口径", Slot:"装備枠", Tier:"ティア", "Recorded identifier":"記録済み識別子",
    "Spending rule":"支出ルール", "Best use":"主な用途", "Main risk":"主なリスク",
    "Not captured":"未記録", "Gate unread":"解除条件を判読できず", "Open purchase":"自由購入", Variable:"可変", fixed:"固定",
    "Semi / Full Auto":"セミ / フルオート", "Semi / Burst":"セミ / バースト", "Semi automatic":"セミオート", "Break-action":"中折れ式", "Single-shot":"単発", "Bolt action":"ボルトアクション", "Bolt-action / Magazine":"ボルトアクション / マガジン", "Pull and Release":"引いて放つ",
    "Assault XP":"アサルトXP", "Medic XP":"メディックXP", "Support XP":"サポートXP", "Recon XP":"偵察XP", "Driver XP":"ドライバーXP", "Pilot XP":"パイロットXP",
    Driver:"ドライバー", Pilot:"パイロット", Wardog:"WARDOG", Optic:"サイト", Magazine:"マガジン", Helmet:"ヘルメット", Armor:"アーマー", Backpack:"バックパック", Special:"特殊", Lightest:"最軽量",
    Offensive:"攻撃", Medical:"医療", Recon:"偵察", Building:"建築", Utility:"汎用", "Building / Offensive":"建築 / 攻撃",
    "Assault rifle":"アサルトライフル", SMG:"サブマシンガン", "Marksman rifle":"マークスマンライフル", "Sniper rifle":"スナイパーライフル", Bow:"弓", Sidearm:"サイドアーム",
    "Light transport":"軽輸送車両", "Fast transport":"高速輸送車両", "Utility transport":"汎用輸送車両", "Cargo transport":"貨物輸送車両", "Protected transport":"防護輸送車両", "Armed transport":"武装輸送車両", "Heavy armed transport":"重武装輸送車両", "Logistics truck":"兵站トラック", "Protected logistics":"防護兵站車両", "Armed logistics":"武装兵站車両", "Anti-air armor":"対空装甲車両", "Main battle tank":"主力戦車", "Self-propelled artillery":"自走砲", "Combat helicopter":"戦闘ヘリコプター", "Armed utility helicopter":"武装多用途ヘリコプター", "Rocket helicopter":"ロケットヘリコプター", "Attack helicopter":"攻撃ヘリコプター", "Light air transport":"軽航空輸送", "Air transport":"航空輸送",
    Budget:"低予算", Standard:"標準", "Full Budget":"全額投入", "Protect most of the $10,000 starting balance":"初期資金1万ドルの大半を残す", "Balance weapon, ammunition, protection, and one job":"武器、弾薬、防具、1つの役割を均衡させる", "Commit heavily to a specialist role or vehicle":"専門役または車両へ重点投資する", "Learning routes, support play, repeated lives":"ルート学習、支援、繰り返しの出撃", "Regular squad play and objective pushes":"通常の分隊行動と目標への攻勢", "Coordinated armor, air, sniper, or demolition play":"連携した装甲、航空、狙撃、爆破プレイ", "Low armor and limited specialist tools":"防具が弱く専門装備が少ない", "Can become unfocused if every slot is upgraded":"全スロットを強化すると役割がぼやける", "One bad loss can remove multiple future options":"一度の損失で今後の複数の選択肢を失う"
  }
};

function translateValue(value: string, locale: Exclude<Locale, "en">): string {
  const direct = valueMaps[locale][value] ?? expandedLabels[locale][value] ?? fieldReferenceLabels[locale][value] ?? fieldReferenceValues[locale][value];
  if (direct) return direct;

  const rounds = value.match(/^(\d+) rounds$/);
  if (rounds) {
    return locale === "zh-cn" ? `${rounds[1]} 发`
      : locale === "ru" ? `${rounds[1]} патронов`
      : locale === "de" ? `${rounds[1]} Schuss`
      : locale === "pt-br" ? `${rounds[1]} projéteis`
      : `${rounds[1]}発`;
  }

  const level = value.match(/^(Driver|Pilot|Wardog) Level (\d+)$/);
  if (level) {
    const role: string = translateValue(level[1], locale);
    return locale === "ja" ? `${role}レベル${level[2]}` : locale === "zh-cn" ? `${role}等级 ${level[2]}` : `${role} ${locale === "ru" ? "уровня" : locale === "de" ? "Stufe" : "nível"} ${level[2]}`;
  }

  const unlock = value.match(/^(\$[\d,]+) unlock$/);
  if (unlock) {
    return locale === "zh-cn" ? `${unlock[1]} 解锁`
      : locale === "ru" ? `Разблокировка за ${unlock[1]}`
      : locale === "de" ? `Freischaltung für ${unlock[1]}`
      : locale === "pt-br" ? `Desbloqueio por ${unlock[1]}`
      : `${unlock[1]}で解除`;
  }

  return value
    .replace(/\bfixed\b/g, valueMaps[locale].fixed)
    .replace(/\brounds\b/g, locale === "zh-cn" ? "发" : locale === "ru" ? "патронов" : locale === "de" ? "Schuss" : locale === "pt-br" ? "projéteis" : "発");
}

export function localizeCatalogueFact(fact: CatalogueRecord["facts"][number], locale: Locale): CatalogueRecord["facts"][number] {
  if (locale === "en") return fact;
  return {label: translateValue(fact.label, locale), value: translateValue(fact.value, locale)};
}

export function getLocalizedCatalogGuide(guide: CatalogGuide, locale: Locale): CatalogGuide {
  if (locale === "en") return guide;
  const baseType = getItemType(guide.id);
  if (!baseType) return guide;
  const type = getLocalizedItemType(baseType, locale);
  const text = localeText[locale];
  const count = getCatalogEntryCount(guide.id);
  return {
    ...guide,
    title: `WARDOGS ${type.label}`,
    description: text.description(type.label),
    countLabel: text.count(count, type.label),
    dataAsOf: localizeCatalogueBuild(guide.dataAsOf, locale),
    heroImageAlt: type.imageAlt,
    disclaimer: text.disclaimer,
    columns: guide.columns.map((column) => translateValue(column, locale)),
    sections: guide.sections.map((section) => {
      const title = sectionNames[locale][section.title] ?? expandedSectionNames[locale][section.title] ?? fieldReferenceLabels[locale][section.title] ?? section.title;
      return {...section, title, description: text.section(title, type.label), rows: section.rows.map((row) => ({cells: row.cells.map((cell, index) => index === 0 ? cell : translateValue(cell, locale))}))};
    }),
    insights: text.insight(type.label),
    unknowns: text.unknown(type.label),
    officialSources: guide.officialSources.map((source, index) => ({...source, label: text.sources[index] ?? source.label}))
  };
}

export function getLocalizedCatalogueRecords(records: readonly CatalogueRecord[], locale: Locale): CatalogueRecord[] {
  if (locale === "en") return [...records];
  return records.map((record) => {
    const type = getItemType(record.type);
    const label = type ? getLocalizedItemType(type, locale).label : record.type;
    const facts = record.facts.map((fact) => ({label: translateValue(fact.label, locale), value: translateValue(fact.value, locale)}));
    const factText = facts.map((fact) => `${fact.label}: ${fact.value}`).join("; ");
    const freshness = getCatalogueFreshness(record);
    return {...record, subtype: translateValue(record.subtype, locale), imageAlt: record.image ? `${record.name} — WARDOGS ${label}` : undefined, summary: `${record.name} — ${label} WARDOGS. ${factText}. ${evidenceBoundaryText[locale][freshness]}`, facts, dataAsOf: localizeCatalogueBuild(record.dataAsOf, locale)};
  });
}

export function getLocalizedCatalogueGroup(group: CatalogueGroup, locale: Locale): CatalogueGroup {
  if (locale === "en") return group;
  const type = getItemType(group.type);
  const label = type ? getLocalizedItemType(type, locale).label : group.label;
  return {...group, label, filters: group.filters.map((filter) => ({...filter, label: translateValue(filter.label, locale)}))};
}
