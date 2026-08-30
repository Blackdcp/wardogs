import type {Locale} from "@/config/site";

export type ItemUi = {
  hubMetaTitle: string;
  hubMetaDescription: string;
  hubEyebrow: string;
  hubTitle: string;
  hubDescription: string;
  alphaSnapshot: string;
  indexesEyebrow: string;
  browseTitle: string;
  browseDescription: string;
  evidenceTitle: string;
  official: string;
  officialDescription: string;
  verified: string;
  verifiedDescription: string;
  preRelease: string;
  preReleaseDescription: string;
  modelPreview: string;
  viewAll: string;
  featuredWeapons: string;
  featuredWeaponsDescription: string;
  featuredVehicles: string;
  featuredVehiclesDescription: string;
  publishedAnalysis: string;
  detailedFieldGuides: string;
  allItems: string;
  itemCategory: string;
  explore: string;
  search: string;
  searchPlaceholder: string;
  all: string;
  recordsShown: string;
  standaloneArticles: string;
  detailedGuides: string;
  readItemGuide: string;
  catalogueSnapshot: string;
  dataAsOf: string;
  recordedRows: string;
  catalogueTable: string;
  tableScroll: string;
  catalogueMeaning: string;
  notConfirmed: string;
  officialSources: string;
  officialSourcesDescription: string;
  quickAnswer: string;
  quickFacts: string;
  observedPrice: string;
  observedProgression: string;
  observedGate: string;
  observedAmmo: string;
  observedVehicleClass: string;
  observedAlpha: string;
  observedPreRelease: string;
  unconfirmedRelease: string;
  howToUse: string;
  strengths: string;
  cautions: string;
  sources: string;
  lastChecked: string;
  relatedGuides: string;
  relatedItems: string;
  itemsFallback: string;
};

const ui: Record<Locale, ItemUi> = {
  en: {
    hubMetaTitle: "WARDOGS Catalogue - Weapons, Vehicles & Equipment", hubMetaDescription: "Browse WARDOGS weapons, vehicles, ammunition, attachments, gear, equipment and loadouts with evidence labels and pre-release caveats.", hubEyebrow: "Evidence-labelled field index", hubTitle: "WARDOGS Catalogue", hubDescription: "Compare observed weapons, vehicles, ammunition, attachments, gear, equipment, and loadouts without treating Alpha values as final.", alphaSnapshot: "Alpha 1 snapshot", indexesEyebrow: "Seven field indexes", browseTitle: "Browse the Catalogue", browseDescription: "Counts reflect complete observed guide tables, while imagery covers the approved catalogue set.", evidenceTitle: "Evidence legend", official: "Official", officialDescription: "Published by BULKHEAD, Team17, or an official WARDOGS channel.", verified: "Verified in game", verifiedDescription: "Captured consistently in available gameplay or catalogue evidence.", preRelease: "Pre-release build", preReleaseDescription: "Observed during Alpha; values, unlocks, and balance may change.", modelPreview: "Model preview", viewAll: "View all", featuredWeapons: "Featured Weapons", featuredWeaponsDescription: "A visual cross-section of observed firearms and specialist tools with evidence-led details.", featuredVehicles: "Featured Vehicles", featuredVehiclesDescription: "Representative transport, armor, and aircraft records from the Alpha catalogue.", publishedAnalysis: "Published analysis", detailedFieldGuides: "Detailed Field Guides", allItems: "All Items", itemCategory: "WARDOGS Item Category", explore: "Explore", search: "Search", searchPlaceholder: "Search by name or fact", all: "All", recordsShown: "records shown", standaloneArticles: "Standalone articles", detailedGuides: "Detailed Guides", readItemGuide: "Read item guide", catalogueSnapshot: "Catalogue snapshot", dataAsOf: "Data as of", recordedRows: "recorded rows", catalogueTable: "catalogue table", tableScroll: "Scroll horizontally to view every column.", catalogueMeaning: "What the catalogue means", notConfirmed: "What is not confirmed", officialSources: "Official game sources", officialSourcesDescription: "Official pages confirm the game, platform, and high-level systems. Catalogue rows remain an Alpha snapshot until final data is published.", quickAnswer: "Quick answer", quickFacts: "Quick Facts", observedPrice: "Observed Alpha 1 price", observedProgression: "Observed Alpha 1 progression", observedGate: "Observed Alpha 1 gate", observedAmmo: "Observed Alpha 1 ammunition", observedVehicleClass: "Observed Alpha 1 vehicle class", observedAlpha: "Observed in Alpha 1", observedPreRelease: "Observed in pre-release footage", unconfirmedRelease: "Unconfirmed for Early Access / final release", howToUse: "How to Use It", strengths: "Strengths", cautions: "Cautions", sources: "Sources", lastChecked: "Last checked", relatedGuides: "Related Guides", relatedItems: "Related Items", itemsFallback: "Items"
  },
  ru: {
    hubMetaTitle: "Каталог WARDOGS - оружие, транспорт и снаряжение", hubMetaDescription: "Каталог оружия, транспорта, боеприпасов, модификаций, экипировки и комплектов WARDOGS с источниками и оговорками о сборке.", hubEyebrow: "Полевой каталог с пометками источников", hubTitle: "Каталог WARDOGS", hubDescription: "Сравнивайте оружие, транспорт, боеприпасы, модификации, экипировку и комплекты, не принимая значения Alpha за окончательные.", alphaSnapshot: "Снимок Alpha 1", indexesEyebrow: "Семь полевых разделов", browseTitle: "Разделы каталога", browseDescription: "Количество записей взято из полных наблюдаемых таблиц, а изображения относятся к проверенному набору каталога.", evidenceTitle: "Обозначения доказательств", official: "Официально", officialDescription: "Опубликовано BULKHEAD, Team17 или официальным каналом WARDOGS.", verified: "Проверено в игре", verifiedDescription: "Последовательно зафиксировано в доступном геймплее или каталоге.", preRelease: "Предрелизная сборка", preReleaseDescription: "Наблюдалось в Alpha; значения, разблокировки и баланс могут измениться.", modelPreview: "Примеры моделей", viewAll: "Смотреть все", featuredWeapons: "Избранное оружие", featuredWeaponsDescription: "Наглядная подборка обнаруженного оружия и специальных средств с указанием доказательств.", featuredVehicles: "Избранный транспорт", featuredVehiclesDescription: "Примеры транспорта, бронетехники и авиации из каталога Alpha.", publishedAnalysis: "Опубликованные разборы", detailedFieldGuides: "Подробные полевые руководства", allItems: "Все предметы", itemCategory: "Категория предметов WARDOGS", explore: "Обзор", search: "Поиск", searchPlaceholder: "Поиск по названию или факту", all: "Все", recordsShown: "записей показано", standaloneArticles: "Отдельные статьи", detailedGuides: "Подробные руководства", readItemGuide: "Читать руководство", catalogueSnapshot: "Снимок каталога", dataAsOf: "Данные на дату", recordedRows: "записей", catalogueTable: "таблица каталога", tableScroll: "Прокрутите по горизонтали, чтобы увидеть все столбцы.", catalogueMeaning: "Что означают данные каталога", notConfirmed: "Что не подтверждено", officialSources: "Официальные источники игры", officialSourcesDescription: "Официальные страницы подтверждают игру, платформу и системы верхнего уровня. Строки каталога остаются снимком Alpha до публикации финальных данных.", quickAnswer: "Краткий ответ", quickFacts: "Краткие факты", observedPrice: "Цена в Alpha 1", observedProgression: "Прогресс в Alpha 1", observedGate: "Условие в Alpha 1", observedAmmo: "Боеприпасы в Alpha 1", observedVehicleClass: "Класс транспорта в Alpha 1", observedAlpha: "Наблюдалось в Alpha 1", observedPreRelease: "Наблюдалось в предрелизных материалах", unconfirmedRelease: "Не подтверждено для раннего доступа и полной версии", howToUse: "Как использовать", strengths: "Сильные стороны", cautions: "Ограничения", sources: "Источники", lastChecked: "Проверено", relatedGuides: "Связанные руководства", relatedItems: "Связанные предметы", itemsFallback: "Предметы"
  },
  de: {
    hubMetaTitle: "WARDOGS Katalog - Waffen, Fahrzeuge und Ausrüstung", hubMetaDescription: "WARDOGS Waffen, Fahrzeuge, Munition, Aufsätze, Ausrüstung und Loadouts mit Quellenkennzeichnung und Hinweisen zur Vorabversion.", hubEyebrow: "Feldindex mit Quellenkennzeichnung", hubTitle: "WARDOGS Katalog", hubDescription: "Vergleiche beobachtete Waffen, Fahrzeuge, Munition, Aufsätze, Ausrüstung und Loadouts, ohne Alpha-Werte als endgültig zu behandeln.", alphaSnapshot: "Stand von Alpha 1", indexesEyebrow: "Sieben Feldindizes", browseTitle: "Katalog durchsuchen", browseDescription: "Die Anzahlen stammen aus vollständigen Beobachtungstabellen; die Bilder gehören zum geprüften Katalogbestand.", evidenceTitle: "Legende der Belege", official: "Offiziell", officialDescription: "Von BULKHEAD, Team17 oder einem offiziellen WARDOGS-Kanal veröffentlicht.", verified: "Im Spiel bestätigt", verifiedDescription: "In verfügbarem Gameplay oder Katalogmaterial wiederholt erfasst.", preRelease: "Vorabversion", preReleaseDescription: "In der Alpha beobachtet; Werte, Freischaltungen und Balance können sich ändern.", modelPreview: "Modellvorschau", viewAll: "Alle anzeigen", featuredWeapons: "Ausgewählte Waffen", featuredWeaponsDescription: "Ein visueller Querschnitt beobachteter Waffen und Spezialgeräte mit Belegangaben.", featuredVehicles: "Ausgewählte Fahrzeuge", featuredVehiclesDescription: "Beispiele für Transport, Panzerung und Luftfahrzeuge aus dem Alpha-Katalog.", publishedAnalysis: "Veröffentlichte Analysen", detailedFieldGuides: "Ausführliche Feldguides", allItems: "Alle Gegenstände", itemCategory: "WARDOGS Gegenstandskategorie", explore: "Entdecken", search: "Suchen", searchPlaceholder: "Nach Name oder Fakt suchen", all: "Alle", recordsShown: "Einträge angezeigt", standaloneArticles: "Eigenständige Artikel", detailedGuides: "Ausführliche Guides", readItemGuide: "Gegenstands-Guide lesen", catalogueSnapshot: "Katalogstand", dataAsOf: "Datenstand", recordedRows: "erfasste Zeilen", catalogueTable: "Katalogtabelle", tableScroll: "Horizontal scrollen, um alle Spalten zu sehen.", catalogueMeaning: "Bedeutung der Katalogdaten", notConfirmed: "Nicht bestätigt", officialSources: "Offizielle Spielquellen", officialSourcesDescription: "Offizielle Seiten bestätigen Spiel, Plattform und übergeordnete Systeme. Die Katalogzeilen bleiben ein Alpha-Stand, bis endgültige Daten veröffentlicht werden.", quickAnswer: "Kurzantwort", quickFacts: "Kurzdaten", observedPrice: "Beobachteter Alpha-1-Preis", observedProgression: "Beobachteter Fortschritt in Alpha 1", observedGate: "Beobachtete Voraussetzung in Alpha 1", observedAmmo: "Beobachtete Munition in Alpha 1", observedVehicleClass: "Beobachtete Fahrzeugklasse in Alpha 1", observedAlpha: "In Alpha 1 beobachtet", observedPreRelease: "In Vorabmaterial beobachtet", unconfirmedRelease: "Für Early Access und Vollversion unbestätigt", howToUse: "Praktischer Einsatz", strengths: "Stärken", cautions: "Hinweise", sources: "Quellen", lastChecked: "Zuletzt geprüft", relatedGuides: "Verwandte Guides", relatedItems: "Verwandte Gegenstände", itemsFallback: "Gegenstände"
  },
  "pt-br": {
    hubMetaTitle: "Catálogo WARDOGS - Armas, veículos e equipamentos", hubMetaDescription: "Veja armas, veículos, munições, acessórios, equipamentos e kits de WARDOGS com evidências e ressalvas da build de pré-lançamento.", hubEyebrow: "Índice de campo com evidências", hubTitle: "Catálogo WARDOGS", hubDescription: "Compare armas, veículos, munições, acessórios, equipamentos e kits observados sem tratar valores do Alpha como finais.", alphaSnapshot: "Registro do Alpha 1", indexesEyebrow: "Sete índices de campo", browseTitle: "Explorar o catálogo", browseDescription: "As contagens vêm das tabelas observadas completas; as imagens pertencem ao conjunto aprovado do catálogo.", evidenceTitle: "Legenda das evidências", official: "Oficial", officialDescription: "Publicado pela BULKHEAD, Team17 ou por um canal oficial de WARDOGS.", verified: "Verificado no jogo", verifiedDescription: "Registrado de forma consistente em gameplay ou evidência do catálogo.", preRelease: "Build de pré-lançamento", preReleaseDescription: "Observado no Alpha; valores, desbloqueios e balanceamento podem mudar.", modelPreview: "Prévia de modelos", viewAll: "Ver todos", featuredWeapons: "Armas em destaque", featuredWeaponsDescription: "Seleção visual de armas e ferramentas especiais observadas, com detalhes baseados em evidências.", featuredVehicles: "Veículos em destaque", featuredVehiclesDescription: "Exemplos de transporte, blindados e aeronaves registrados no catálogo Alpha.", publishedAnalysis: "Análises publicadas", detailedFieldGuides: "Guias de campo detalhados", allItems: "Todos os itens", itemCategory: "Categoria de itens WARDOGS", explore: "Explorar", search: "Pesquisar", searchPlaceholder: "Pesquisar por nome ou fato", all: "Todos", recordsShown: "registros exibidos", standaloneArticles: "Artigos independentes", detailedGuides: "Guias detalhados", readItemGuide: "Ler guia do item", catalogueSnapshot: "Registro do catálogo", dataAsOf: "Dados de", recordedRows: "linhas registradas", catalogueTable: "tabela do catálogo", tableScroll: "Role horizontalmente para ver todas as colunas.", catalogueMeaning: "O que o catálogo significa", notConfirmed: "O que não está confirmado", officialSources: "Fontes oficiais do jogo", officialSourcesDescription: "As páginas oficiais confirmam o jogo, a plataforma e os sistemas gerais. As linhas continuam sendo um registro do Alpha até a publicação dos dados finais.", quickAnswer: "Resposta rápida", quickFacts: "Fatos rápidos", observedPrice: "Preço observado no Alpha 1", observedProgression: "Progressão observada no Alpha 1", observedGate: "Requisito observado no Alpha 1", observedAmmo: "Munição observada no Alpha 1", observedVehicleClass: "Classe observada no Alpha 1", observedAlpha: "Observado no Alpha 1", observedPreRelease: "Observado em material de pré-lançamento", unconfirmedRelease: "Não confirmado para Acesso Antecipado ou versão final", howToUse: "Como usar", strengths: "Pontos fortes", cautions: "Cuidados", sources: "Fontes", lastChecked: "Última verificação", relatedGuides: "Guias relacionados", relatedItems: "Itens relacionados", itemsFallback: "Itens"
  },
  "zh-cn": {
    hubMetaTitle: "WARDOGS 图鉴 - 武器、载具与装备", hubMetaDescription: "查看 WARDOGS 武器、载具、弹药、配件、装备和配装，包含证据标记与预发布版本说明。", hubEyebrow: "带证据标记的战地索引", hubTitle: "WARDOGS 图鉴", hubDescription: "比较已观察到的武器、载具、弹药、配件、装备和配装，不把 Alpha 数值当作最终数据。", alphaSnapshot: "Alpha 1 记录", indexesEyebrow: "七类战地索引", browseTitle: "浏览图鉴", browseDescription: "数量来自完整的已观察表格；图片仅使用已核对的图鉴素材。", evidenceTitle: "证据说明", official: "官方", officialDescription: "由 BULKHEAD、Team17 或 WARDOGS 官方频道发布。", verified: "游戏内已验证", verifiedDescription: "在可用实机或图鉴证据中重复确认。", preRelease: "预发布版本", preReleaseDescription: "在 Alpha 中观察；数值、解锁和平衡可能变化。", modelPreview: "型号预览", viewAll: "查看全部", featuredWeapons: "重点武器", featuredWeaponsDescription: "按证据整理的枪械和专业工具图文索引。", featuredVehicles: "重点载具", featuredVehiclesDescription: "Alpha 图鉴中的运输、装甲和飞行器代表记录。", publishedAnalysis: "已发布分析", detailedFieldGuides: "详细战地攻略", allItems: "全部物品", itemCategory: "WARDOGS 物品类别", explore: "浏览", search: "搜索", searchPlaceholder: "按名称或属性搜索", all: "全部", recordsShown: "条记录", standaloneArticles: "独立文章", detailedGuides: "详细攻略", readItemGuide: "阅读物品攻略", catalogueSnapshot: "图鉴快照", dataAsOf: "数据截至", recordedRows: "条记录", catalogueTable: "图鉴表格", tableScroll: "横向滚动可查看全部列。", catalogueMeaning: "如何理解图鉴数据", notConfirmed: "尚未确认的内容", officialSources: "游戏官方来源", officialSourcesDescription: "官方页面确认游戏、平台和主要系统。最终数据公布前，图鉴条目仍按 Alpha 版本记录处理。", quickAnswer: "快速结论", quickFacts: "基本信息", observedPrice: "Alpha 1 已观察价格", observedProgression: "Alpha 1 已观察进度", observedGate: "Alpha 1 已观察解锁条件", observedAmmo: "Alpha 1 已观察弹药", observedVehicleClass: "Alpha 1 已观察载具类别", observedAlpha: "Alpha 1 中已观察", observedPreRelease: "预发布画面中已观察", unconfirmedRelease: "抢先体验版 / 正式版尚未确认", howToUse: "使用方法", strengths: "优势", cautions: "注意事项", sources: "来源", lastChecked: "最后核查", relatedGuides: "相关攻略", relatedItems: "相关物品", itemsFallback: "物品"
  },
  ja: {
    hubMetaTitle: "WARDOGSカタログ - 武器・車両・装備一覧", hubMetaDescription: "WARDOGSの武器、車両、弾薬、アタッチメント、装備、ロードアウトを、証拠区分と発売前ビルドの注意点付きで確認できます。", hubEyebrow: "証拠区分付きフィールド索引", hubTitle: "WARDOGSカタログ", hubDescription: "アルファ版の数値を最終仕様とせず、確認できた武器、車両、弾薬、アタッチメント、装備、ロードアウトを比較します。", alphaSnapshot: "Alpha 1時点", indexesEyebrow: "7つのフィールド索引", browseTitle: "カタログを見る", browseDescription: "件数は確認済みの完全な表に基づき、画像は承認済みのカタログ素材を使用しています。", evidenceTitle: "証拠区分", official: "公式", officialDescription: "BULKHEAD、Team17、またはWARDOGS公式チャンネルが公開した情報です。", verified: "ゲーム内確認済み", verifiedDescription: "利用可能なゲームプレイまたはカタログ映像で継続して確認できた内容です。", preRelease: "発売前ビルド", preReleaseDescription: "アルファ版で確認。数値、解除条件、バランスは変更される可能性があります。", modelPreview: "モデル例", viewAll: "すべて見る", featuredWeapons: "注目の武器", featuredWeaponsDescription: "確認できた銃器と特殊装備を、証拠に基づく詳細とともに比較できます。", featuredVehicles: "注目の車両", featuredVehiclesDescription: "アルファ版カタログから輸送車両、装甲車両、航空機の代表例を掲載します。", publishedAnalysis: "公開済み分析", detailedFieldGuides: "詳細フィールドガイド", allItems: "全アイテム", itemCategory: "WARDOGSアイテムカテゴリー", explore: "検索", search: "検索", searchPlaceholder: "名前または情報で検索", all: "すべて", recordsShown: "件を表示", standaloneArticles: "個別記事", detailedGuides: "詳細攻略", readItemGuide: "アイテム攻略を読む", catalogueSnapshot: "カタログ記録", dataAsOf: "データ確認日", recordedRows: "件の記録", catalogueTable: "カタログ表", tableScroll: "横方向にスクロールすると全列を確認できます。", catalogueMeaning: "カタログから分かること", notConfirmed: "未確認の内容", officialSources: "ゲーム公式情報源", officialSourcesDescription: "公式ページはゲーム、対応プラットフォーム、主要システムを確認する一次情報です。最終データが公開されるまで、各行はアルファ版時点の記録として扱います。", quickAnswer: "要点", quickFacts: "基本情報", observedPrice: "Alpha 1で確認した価格", observedProgression: "Alpha 1で確認した進行条件", observedGate: "Alpha 1で確認した解除条件", observedAmmo: "Alpha 1で確認した弾薬", observedVehicleClass: "Alpha 1で確認した車両区分", observedAlpha: "Alpha 1で確認済み", observedPreRelease: "発売前映像で確認済み", unconfirmedRelease: "早期アクセス版・正式版では未確認", howToUse: "使い方", strengths: "強み", cautions: "注意点", sources: "情報源", lastChecked: "最終確認", relatedGuides: "関連攻略", relatedItems: "関連アイテム", itemsFallback: "アイテム"
  }
};

export function getItemUi(locale: Locale) {
  return ui[locale];
}
