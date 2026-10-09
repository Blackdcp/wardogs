import type {Locale} from "@/config/site";

export const RECENT_VIDEO_SEO_SLUGS = [
  "wardogs-season-2-developer-interview",
  "wardogs-attachments-tested",
  "wardogs-solo-duo-fob-layout",
  "wardogs-ir-rangefinder-hotfix",
  "wardogs-fob-income-breakdown",
  "wardogs-offensive-support-playstyle"
] as const;

export type RecentVideoSeoSlug = typeof RECENT_VIDEO_SEO_SLUGS[number];
export type RecentVideoSeo = {
  description: string;
  keywords: readonly string[];
};

// Search snippets are deliberately separate from the full on-page answers.
// Keywords name local search intents; the metadata caller can add the site brand once.
const recentVideoSeoCopy: Record<RecentVideoSeoSlug, Record<Locale, RecentVideoSeo>> = {
  "wardogs-season-2-developer-interview": {
    en: {description: "Developer interview chapters on planned Season 2 weapons, Gold Market rotation and October 15 preparation, with confirmed facts separated from proposals.", keywords: ["Season 2 developer interview", "October 15 update", "Gold Market rotation", "new class weapons", "season reset preparation"]},
    de: {description: "Kapitel zum Entwicklerinterview: geplante Waffen für Saison 2, Goldmarkt-Rotation und Vorbereitung auf den 15. Oktober, mit klaren Grenzen der Aussagen.", keywords: ["Entwicklerinterview Saison 2", "Update am 15. Oktober", "Goldmarkt-Rotation", "neue Klassenwaffen", "Saisonwechsel vorbereiten"]},
    ru: {description: "Главы интервью о планах на сезон 2: новое оружие, ротация золотого магазина и подготовка к 15 октября. Отделяем предложения от подтверждённых изменений.", keywords: ["интервью разработчиков сезон 2", "обновление 15 октября", "ротация золотого магазина", "новое оружие классов", "подготовка к вайпу"]},
    "pt-br": {description: "Capítulos da entrevista sobre armas planejadas, rotação da Loja de Ouro e preparação para 15 de outubro. Separe propostas dos detalhes já confirmados.", keywords: ["entrevista dos desenvolvedores", "Temporada 2 em 15 de outubro", "rotação da Loja de Ouro", "novas armas de classe", "preparação para o wipe"]},
    ja: {description: "開発者インタビューを章ごとに解説。シーズン2の新武器案、ゴールド市場の入れ替え、10月15日への準備を、確定情報と提案に分けて整理します。", keywords: ["シーズン2開発者インタビュー", "10月15日アップデート", "ゴールド市場入れ替え", "クラス別新武器", "ワイプ前の準備"]},
    "zh-cn": {description: "按章节解读第二赛季开发者访谈：四种职业新武器、黄金市场轮换及10月15日准备，区分开发提案、已公布信息与尚未确认的细节。", keywords: ["第二赛季开发者访谈", "10月15日更新", "黄金市场轮换", "职业新武器", "赛季重置准备"]},
    "zh-tw": {description: "依章節解讀第二賽季開發者訪談：四種職業新武器、黃金市場輪替與10月15日準備，區分開發提案、已公布資訊及未定細節。", keywords: ["第二賽季開發者訪談", "10月15日更新", "黃金市場輪替", "職業新武器", "賽季重置準備"]},
    pl: {description: "Rozdziały wywiadu o planach sezonu 2: nowe bronie, rotacja rynku złota i przygotowania na 15 października. Oddzielamy propozycje od potwierdzonych danych.", keywords: ["wywiad z twórcami sezon 2", "aktualizacja 15 października", "rotacja rynku złota", "nowe bronie klasowe", "przygotowania do resetu"]}
  },
  "wardogs-attachments-tested": {
    en: {description: "Compare Evo4Fun's grip, optic and magazine findings for M4 and AK74 loadouts. Separate reported modifiers, firing-range observations and personal choices.", keywords: ["attachment comparison", "TDG vs RVG", "M4 loadout", "AK74 attachments", "ADS and recoil control"]},
    de: {description: "Evo4Funs Vergleiche zu Griffen, Optiken und Magazinen für M4 und AK74: gemeldete Werte, Schießstandbeobachtungen und persönliche Empfehlungen trennen.", keywords: ["Waffenaufsätze vergleichen", "TDG oder RVG", "M4-Ausrüstung", "AK74-Anbauteile", "Zielgeschwindigkeit und Rückstoß"]},
    ru: {description: "Разбор сравнений Evo4Fun: рукоятки, прицелы и магазины для M4 и AK74. Отделяем заявленные модификаторы от наблюдений на полигоне и личных предпочтений.", keywords: ["сравнение обвесов", "TDG или RVG", "сборка M4", "обвесы AK74", "скорость прицеливания и отдача"]},
    "pt-br": {description: "Compare empunhaduras, miras e carregadores de M4 e AK74 no vídeo de Evo4Fun. Distinga dados relatados, observações no estande e preferências pessoais.", keywords: ["comparação de acessórios", "TDG ou RVG", "equipamento M4", "acessórios AK74", "velocidade de mira e recuo"]},
    ja: {description: "Evo4Funのグリップ・照準器・マガジン比較をM4とAK74の装備選びに活用。報告された補正値、射撃場での観察、作者の好みを分けて解説します。", keywords: ["アタッチメント比較", "TDGとRVGの違い", "M4装備構成", "AK74アタッチメント", "ADS速度と反動制御"]},
    "zh-cn": {description: "解析Evo4Fun对握把、瞄具和弹匣的比较，说明M4与AK74配装的举枪速度和后坐力取舍，区分作者报告的数据、靶场观察与个人偏好。", keywords: ["配件对比", "TDG与RVG握把", "M4配装", "AK74配件", "举枪速度与后坐力"]},
    "zh-tw": {description: "解析Evo4Fun的握把、瞄具與彈匣比較，整理M4和AK74配裝的舉槍速度及後座力取捨，區分作者回報數據、靶場觀察與個人偏好。", keywords: ["配件比較", "TDG與RVG握把", "M4配裝", "AK74配件", "舉槍速度與後座力"]},
    pl: {description: "Porównania Evo4Fun: chwyty, celowniki i magazynki do M4 oraz AK74. Rozróżnij podane modyfikatory, obserwacje na strzelnicy i osobiste preferencje autora.", keywords: ["porównanie dodatków", "TDG czy RVG", "zestaw M4", "dodatki AK74", "szybkość celowania i odrzut"]}
  },
  "wardogs-solo-duo-fob-layout": {
    en: {description: "Follow Wake Up's solo/duo FOB build order, supply route and return drill. Check Talon clearance, trapped build points and the cost of reopening the shell.", keywords: ["solo duo FOB layout", "FOB build order", "Wake Up base guide", "Talon firing clearance", "FOB re-entry"]},
    de: {description: "Wake Ups Solo-/Duo-FOB: Baufolge, Versorgung und Rückkehr von außen. Prüfe Talon-Schussfeld, blockierte Baupunkte und den Aufwand zum erneuten Öffnen.", keywords: ["Solo-Duo-FOB-Bauplan", "FOB-Baureihenfolge", "Wake Up Basisbau", "Talon-Schussfeld", "FOB wieder betreten"]},
    ru: {description: "Порядок постройки FOB для одного или двоих у Wake Up: снабжение, возврат снаружи, сектор Talon и недоступные точки стройки. Учтите расходы на вскрытие.", keywords: ["схема FOB соло дуо", "порядок постройки FOB", "база Wake Up", "сектор огня Talon", "возвращение в FOB"]},
    "pt-br": {description: "FOB solo/duo de Wake Up: ordem de construção, suprimentos e retorno por fora. Confira o campo do Talon, pontos bloqueados e o custo de reabrir a base.", keywords: ["projeto FOB solo duo", "ordem de construção FOB", "base de Wake Up", "campo de tiro Talon", "retorno ao FOB"]},
    ja: {description: "Wake Upのソロ・デュオFOBを建築順、補給経路、外からの戻り方で解説。Talonの射界、届かない建築点、壁を開け直す資材負担を確認します。", keywords: ["ソロデュオFOB配置", "FOB建築順序", "Wake Up拠点構築", "Talon射界", "FOB再入場"]},
    "zh-cn": {description: "拆解Wake Up单双人FOB的施工顺序、补给通路与外部再入场流程，检查Talon射界、锤点卡住和拆墙重建的材料代价。", keywords: ["单双人FOB布局", "FOB施工顺序", "Wake Up建家", "Talon射界", "FOB重新入场"]},
    "zh-tw": {description: "拆解Wake Up單雙人FOB的施工順序、補給通道及外部重新進入流程，檢查Talon射界、施工點卡住與拆牆重建的資材成本。", keywords: ["單雙人FOB配置", "FOB施工順序", "Wake Up基地建設", "Talon射界", "FOB重新進入"]},
    pl: {description: "FOB solo/duo Wake Up: kolejność budowy, dostawy i powrót z zewnątrz. Sprawdź pole Talona, niedostępne punkty budowy i koszt ponownego otwarcia osłony.", keywords: ["układ FOB solo duo", "kolejność budowy FOB", "baza Wake Up", "pole ostrzału Talon", "powrót do FOB"]}
  },
  "wardogs-ir-rangefinder-hotfix": {
    en: {description: "Airwingmarine's IR hotfix breakdown: vendor removal, spotting and CIWS versus Havoc. Separate the official change from Gold-price theories and future plans.", keywords: ["IR rangefinder hotfix", "IR vendor removal", "spotting after update", "CIWS versus Havoc", "Gold Market price claims"]},
    de: {description: "Airwingmarines IR-Hotfix-Analyse: Verkaufsstopp, Aufklärung und CIWS gegen Havoc. Trenne offizielle Änderungen von Goldpreis-Theorien und Zukunftsplänen.", keywords: ["IR-Entfernungsmesser Hotfix", "IR-Verkaufsstopp", "Aufklärung nach Update", "CIWS gegen Havoc", "Goldpreis-Theorien"]},
    ru: {description: "Разбор IR-хотфикса Airwingmarine: снятие с продажи, разведка и CIWS против Havoc. Отделяем официальные изменения от теорий цены золота и будущих планов.", keywords: ["хотфикс IR-дальномера", "IR снят с продажи", "разведка после обновления", "CIWS против Havoc", "теории цены золота"]},
    "pt-br": {description: "Análise de Airwingmarine sobre o hotfix IR: retirada da loja, marcação e CIWS contra Havoc. Separe a mudança oficial de teorias sobre ouro e planos futuros.", keywords: ["hotfix do telêmetro IR", "IR removido da loja", "marcação após atualização", "CIWS contra Havoc", "teorias de preço do ouro"]},
    ja: {description: "AirwingmarineのIR修正解説を整理。販売停止、マーク減少後の索敵、CIWS対Havocを確認し、公式変更と金価格の仮説・今後の計画を分けます。", keywords: ["IR距離計ホットフィックス", "IR販売停止", "更新後の索敵", "CIWS対Havoc", "ゴールド価格の仮説"]},
    "zh-cn": {description: "解析Airwingmarine对IR热修的解读：测距仪停售、标记变化和CIWS对Havoc，区分官方改动、作者体验、金价推测与未来计划。", keywords: ["红外测距仪热修", "IR测距仪停售", "更新后标记侦察", "CIWS对Havoc", "黄金价格推测"]},
    "zh-tw": {description: "整理Airwingmarine的IR熱修解析：測距儀停售、標記變化及CIWS對Havoc，區分官方改動、作者經驗、金價推測與未來計畫。", keywords: ["紅外線測距儀熱修", "IR測距儀停售", "更新後標記偵察", "CIWS對Havoc", "黃金價格推測"]},
    pl: {description: "Analiza hotfixa IR od Airwingmarine: wycofanie ze sklepu, zwiad i CIWS kontra Havoc. Oddziel oficjalne zmiany od teorii cen złota i przyszłych planów.", keywords: ["hotfix dalmierza IR", "IR wycofany ze sklepu", "zwiad po aktualizacji", "CIWS kontra Havoc", "teorie cen złota"]}
  },
  "wardogs-fob-income-breakdown": {
    en: {description: "RadioGLHF reports 334k earned but just over 200k profit. Review his FOB deliveries, failed drones and supply shortages without treating one match as a rate.", keywords: ["FOB income breakdown", "logistics net profit", "RadioGLHF money guide", "Stingray costs", "delivery and storage rewards"]},
    de: {description: "RadioGLHF nennt 334.000 Einnahmen, aber gut 200.000 Gewinn. FOB-Lieferungen, Drohnenverluste und Materialmangel erklären die Bilanz dieser einzelnen Runde.", keywords: ["FOB-Einnahmen analysieren", "Logistik-Nettogewinn", "RadioGLHF Geld-Guide", "Stingray-Kosten", "Liefer- und Lagerprämien"]},
    ru: {description: "RadioGLHF сообщает о 334 тысячах дохода и чуть более 200 тысячах прибыли. Разбираем доставки FOB, потери дронов и дефицит деталей в этой одной игре.", keywords: ["разбор дохода FOB", "чистая прибыль логистики", "заработок RadioGLHF", "затраты на Stingray", "награды за доставку и склад"]},
    "pt-br": {description: "RadioGLHF relata 334 mil de receita, mas pouco mais de 200 mil de lucro. Reveja entregas, drones perdidos e falta de peças nessa partida de defesa do FOB.", keywords: ["renda de FOB", "lucro líquido da logística", "guia de dinheiro RadioGLHF", "custos do Stingray", "pagamento por entrega e depósito"]},
    ja: {description: "RadioGLHFが報告する334kの総収入と200k強の利益を区別。FOB補給、失敗したドローン、部品不足を含め、一試合の記録から収支を読み解きます。", keywords: ["FOB金策の収支", "兵站の純利益", "RadioGLHF金策", "Stingrayの費用", "配送と入庫の報酬"]},
    "zh-cn": {description: "RadioGLHF口述334k总收入、略高于200k净利润。按FOB交付、无人机失败与机械件断供复盘成本，不把单场视频当作固定收益。", keywords: ["FOB赚钱复盘", "后勤净收益", "RadioGLHF赚钱", "Stingray成本", "配送与入库奖励"]},
    "zh-tw": {description: "RadioGLHF口述334k總收入、略高於200k淨利。依FOB交付、無人機失敗與機械零件斷供分析成本，不把單場影片當成固定收益。", keywords: ["FOB賺錢復盤", "後勤淨收益", "RadioGLHF賺錢", "Stingray成本", "配送與入庫獎勵"]},
    pl: {description: "RadioGLHF podaje 334 tys. przychodu i nieco ponad 200 tys. zysku. Analiza dostaw FOB, straconych dronów i braku części dotyczy tej jednej rozgrywki.", keywords: ["analiza zarobku FOB", "zysk netto logistyki", "zarabianie RadioGLHF", "koszty Stingraya", "nagrody za dostawy i magazyn"]}
  },
  "wardogs-offensive-support-playstyle": {
    en: {description: "Colvin's attacking Support run separates class level from the C4 detonator unlock. Follow the failed RPG breach, C4 switch and fight to hold a captured FOB.", keywords: ["offensive Support guide", "C4 detonator unlock", "Colvin Support build", "RPG or C4 breach", "capture and hold FOB"]},
    de: {description: "Colvins Support-Angriff trennt Klassenstufe und C4-Zünderfreischaltung. Verfolge den gescheiterten RPG-Angriff, den C4-Wechsel und den Kampf um die FOB.", keywords: ["offensiver Support", "C4-Zünder freischalten", "Colvin Support-Ausrüstung", "RPG oder C4 beim Angriff", "FOB erobern und halten"]},
    ru: {description: "Атакующий Support у Colvin: уровень класса не оплачивает детонатор C4. Разбираем неудачный штурм с RPG, смену оружия и удержание захваченной FOB.", keywords: ["атакующий Support", "открытие детонатора C4", "сборка Support Colvin", "штурм с RPG или C4", "захват и удержание FOB"]},
    "pt-br": {description: "O Support de ataque de Colvin separa nível de classe e desbloqueio do detonador C4. Veja o RPG falhar, a troca para C4 e a tentativa de manter o FOB.", keywords: ["Support ofensivo", "desbloquear detonador C4", "equipamento Support Colvin", "ataque com RPG ou C4", "capturar e manter FOB"]},
    ja: {description: "Colvinの攻撃型Supportを解説。クラスレベルとC4起爆装置の有料解放を分け、RPGの失敗、C4への切り替え、FOB奪取後の防衛を追います。", keywords: ["攻撃型Support攻略", "C4起爆装置の解放", "ColvinのSupport装備", "RPGとC4の突破", "FOB奪取と防衛"]},
    "zh-cn": {description: "解读Colvin的进攻型Support：职业等级不等于付清C4引爆器解锁费，按RPG破点失败、改用C4和夺点后失守梳理下一步。", keywords: ["进攻型支援兵", "C4引爆器解锁", "Colvin支援兵配装", "RPG与C4破点", "FOB夺取与防守"]},
    "zh-tw": {description: "解讀Colvin的進攻型Support：職業等級不等於付清C4引爆器解鎖費，依RPG突破失敗、改用C4及奪點後失守整理行動順序。", keywords: ["進攻型支援兵", "C4引爆器解鎖", "Colvin支援兵配裝", "RPG與C4突破", "FOB奪取與防守"]},
    pl: {description: "Ofensywny Support Colvina: poziom klasy nie opłaca detonatora C4. Prześledź nieudany atak RPG, zmianę na C4 i próbę utrzymania zdobytej FOB.", keywords: ["ofensywny Support", "odblokowanie detonatora C4", "zestaw Support Colvin", "szturm RPG lub C4", "zdobycie i obrona FOB"]}
  }
};

export function getRecentVideoSeo(locale: Locale, slug: string): RecentVideoSeo | undefined {
  return Object.hasOwn(recentVideoSeoCopy, slug)
    ? recentVideoSeoCopy[slug as RecentVideoSeoSlug][locale]
    : undefined;
}
