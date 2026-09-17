import type {Locale} from "@/config/site";
import {getCatalogueRecord} from "@/features/catalogue/catalogue-records";
import type {CatalogueEvidence, CatalogueFact} from "@/features/catalogue/catalogue-types";
import {getOperationsAtlasMediaSource} from "./operations-atlas-media";

export type OperationsAtlasTask =
  | "orientation"
  | "objective"
  | "construction"
  | "logistics"
  | "fire-support"
  | "air-operations";

export type OperationsAtlasFilter = "all" | OperationsAtlasTask;
export type AtlasVisualState = "verified" | "contextual" | "pending";

export type OperationsAtlasRecord = {
  id: string;
  tasks: readonly OperationsAtlasTask[];
  evidence: CatalogueEvidence;
  facts: readonly CatalogueFact[];
  sourceNotes: readonly string[];
  guideSlug: string;
  relatedGuideSlugs: readonly string[];
  relatedToolHrefs: readonly `/tools/${string}`[];
  sourceLabel: string;
  visual: {
    state: AtlasVisualState;
    image?: string;
  };
};

export type OperationsAtlasEntryCopy = {
  title: string;
  objective: string;
  context: string;
  summary: string;
  imageAlt?: string;
};

export type OperationsAtlasCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  workflowLabel: string;
  workflowNote: string;
  sourcedFactsLabel: string;
  sourceScopeLabel: string;
  filtersLabel: string;
  filters: Record<OperationsAtlasFilter, string>;
  showing: string;
  objectiveLabel: string;
  contextLabel: string;
  evidenceLabel: string;
  sourceLabel: string;
  checkedLabel: string;
  buildLabel: string;
  openGuide: string;
  relatedGuides: string;
  relatedTools: string;
  visualVerified: string;
  visualContextual: string;
  visualPending: string;
  visualPendingDescription: string;
  entries: Record<string, OperationsAtlasEntryCopy>;
};

export const operationsAtlasTaskOrder: readonly OperationsAtlasFilter[] = [
  "all",
  "orientation",
  "objective",
  "construction",
  "logistics",
  "fire-support",
  "air-operations",
];

type AtlasDefinition = Omit<OperationsAtlasRecord, "evidence" | "facts" | "sourceNotes" | "visual">;

const definitions: readonly AtlasDefinition[] = [
  {
    id: "battlefield-control-zone",
    tasks: ["orientation", "objective"],
    guideSlug: "wardogs-map",
    relatedGuideSlugs: ["wardogs-towers-guide", "wardogs-fob-guide"],
    relatedToolHrefs: [],
    sourceLabel: "Official WARDOGS Steam description",
  },
  {
    id: "tower-terminal",
    tasks: ["objective"],
    guideSlug: "wardogs-towers-guide",
    relatedGuideSlugs: ["wardogs-map", "wardogs-mortar-guide"],
    relatedToolHrefs: [],
    sourceLabel: "Official WARDOGS game-mode explanation",
  },
  {
    id: "oil-rig-hot-zone",
    tasks: ["construction", "objective"],
    guideSlug: "wardogs-oil-rig-guide",
    relatedGuideSlugs: ["wardogs-fob-guide", "wardogs-cargo-guide"],
    relatedToolHrefs: ["/tools/logistics-planner"],
    sourceLabel: "WARDOGS Building 101 creator demonstration",
  },
  {
    id: "fob-network",
    tasks: ["construction", "logistics"],
    guideSlug: "wardogs-fob-guide",
    relatedGuideSlugs: ["wardogs-cargo-guide", "wardogs-oil-rig-guide"],
    relatedToolHrefs: ["/tools/logistics-planner"],
    sourceLabel: "Official WARDOGS Steam description",
  },
  {
    id: "cargo-route",
    tasks: ["logistics"],
    guideSlug: "wardogs-cargo-guide",
    relatedGuideSlugs: ["wardogs-fob-guide", "wardogs-helicopter-guide"],
    relatedToolHrefs: ["/tools/logistics-planner"],
    sourceLabel: "How Vehicles and Cargo Work in WARDOGS",
  },
  {
    id: "mortar-support",
    tasks: ["fire-support"],
    guideSlug: "wardogs-mortar-guide",
    relatedGuideSlugs: ["wardogs-fob-guide", "wardogs-towers-guide"],
    relatedToolHrefs: [],
    sourceLabel: "WARDOGS mortar creator demonstration",
  },
  {
    id: "helicopter-transport",
    tasks: ["air-operations", "logistics"],
    guideSlug: "wardogs-helicopter-guide",
    relatedGuideSlugs: ["wardogs-cargo-guide", "wardogs-fob-guide"],
    relatedToolHrefs: ["/tools/logistics-planner"],
    sourceLabel: "WARDOGS helicopter basic guide",
  },
];

export const operationsAtlasRecords: readonly OperationsAtlasRecord[] = definitions.map((definition) => {
  const record = getCatalogueRecord("maps", definition.id);
  if (!record) throw new Error(`Missing normalized map record: ${definition.id}`);
  const media = getOperationsAtlasMediaSource(definition.id);
  return {
    ...definition,
    evidence: record.evidence,
    facts: record.facts,
    sourceNotes: record.sourceNotes,
    visual: media ? {state: media.state, image: media.image} : {state: "pending"},
  };
});

export function filterOperationsAtlas(
  records: readonly OperationsAtlasRecord[],
  filter: OperationsAtlasFilter,
): readonly OperationsAtlasRecord[] {
  if (filter === "all") return [...records];
  return records.filter((record) => record.tasks.includes(filter));
}

const copyByLocale: Record<Locale, OperationsAtlasCopy> = {
  en: {
    metaTitle: "WARDOGS Operations Atlas: Maps, FOBs, Cargo and Objectives",
    metaDescription: "Use the sourced WARDOGS operations atlas for Control Zone orientation, tower objectives, FOBs, cargo, mortars, and helicopter transport without invented routes.",
    eyebrow: "Task-first field reference",
    title: "WARDOGS Operations Atlas",
    description: "Choose the job your squad needs, read the verified context, then jump to the exact maintained guide. This is a workflow index, not an invented tactical map: coordinates and fixed routes are omitted unless a source documents them.",
    workflowLabel: "Editorial workflow",
    workflowNote: "The task sequence is site-authored guidance. Evidence labels apply only to the sourced facts listed below.",
    sourcedFactsLabel: "Sourced facts",
    sourceScopeLabel: "Source scope",
    filtersLabel: "Filter operations by task",
    filters: {all: "All operations", orientation: "Orientation", objective: "Objectives", construction: "Construction", logistics: "Logistics", "fire-support": "Fire support", "air-operations": "Air operations"},
    showing: "workflows shown",
    objectiveLabel: "Task",
    contextLabel: "Context",
    evidenceLabel: "Evidence",
    sourceLabel: "Source",
    checkedLabel: "Checked",
    buildLabel: "Build",
    openGuide: "Open exact guide",
    relatedGuides: "Related guides",
    relatedTools: "Related tools",
    visualVerified: "Object image verified",
    visualContextual: "Context image",
    visualPending: "Image not yet verified",
    visualPendingDescription: "No approved object-matching image is available. The workflow remains documented without a borrowed or generic substitute.",
    entries: {
      "battlefield-control-zone": {title: "Battlefield and Control Zone", objective: "Read the live objective before choosing a route", context: "Whole battlefield and the active randomized Control Zone", summary: "Locate the active Control Zone, compare safe transport and supply approaches, then choose a route for this match instead of memorizing one fixed path.", imageAlt: "Context image for the WARDOGS battlefield and active objective flow"},
      "tower-terminal": {title: "Tower Terminal", objective: "Secure the approach and read the live terminal prompt", context: "Tower objective inside the current Control Zone flow", summary: "Clear immediate threats, identify the correct terminal interaction, communicate it, and return attention to team scoring. Beta codes and timings are not presented as current constants."},
      "oil-rig-hot-zone": {title: "Oil Rig / Drill Rig", objective: "Build, fuel, activate, and defend the rig", context: "Valid FOB construction area near the intended operation", summary: "Use the historical rig sequence as a checklist only. Current costs, cooldowns, placement limits, and Hot Zone behavior must be read from the live build."},
      "fob-network": {title: "FOB Network", objective: "Place, supply, defend, and recover a forward base", context: "Forward position linked to the objective and a sustainable delivery route", summary: "Judge a FOB by reinforcement value, vehicle access, unloading room, cover, and defense. A base that cannot be supplied or exited is not a useful shortcut.", imageAlt: "Official contextual WARDOGS field-operations image for FOB planning"},
      "cargo-route": {title: "Cargo Route", objective: "Deliver the supply type the destination actually needs", context: "Main base, transport route, unloading area, and return route", summary: "Plan purchase, loading, escort, unloading, and recovery as one loop. The recorded controls and pallet capacities remain Closed Beta observations.", imageAlt: "WARDOGS Ural used as contextual art for a cargo and supply route"},
      "mortar-support": {title: "Mortar Support", objective: "Connect a supplied crew with a current spotter call", context: "Protected firing position and an observed target area", summary: "Confirm the target, call direction and distance, fire a correction round, report impact, cease fire for friendlies, and relocate before the position is hunted.", imageAlt: "Verified L81 mortar emplacement in a WARDOGS sandbag firing position"},
      "helicopter-transport": {title: "Helicopter Transport", objective: "Move players or supplies and preserve an exit", context: "Departure point, terrain-covered route, landing zone, and recovery path", summary: "Plan the route before takeoff, confirm the landing area, limit predictable hovering, unload quickly, and leave enough fuel and space to abort safely.", imageAlt: "Contextual WARDOGS helicopter cockpit view for transport route planning"},
    },
  },
  de: {
    metaTitle: "WARDOGS Einsatzatlas: Karten, FOBs, Fracht und Ziele",
    metaDescription: "Der belegte WARDOGS-Einsatzatlas verbindet Control Zone, Turmziele, FOB-Bau, Fracht, Mörser und Hubschraubertransport ohne erfundene Routen.",
    eyebrow: "Aufgabenorientierte Feldreferenz", title: "WARDOGS Einsatzatlas", description: "Wähle die Aufgabe deines Trupps, prüfe Kontext und Beleg und öffne dann den passenden gepflegten Guide. Dies ist ein Arbeitsablauf, keine erfundene taktische Karte; unbestätigte Koordinaten und feste Routen fehlen bewusst.", workflowLabel: "Redaktioneller Ablauf", workflowNote: "Die Schritte sind redaktionelle Hinweise der Website. Beleglabels gelten nur für die unten aufgeführten Quellenfakten.", sourcedFactsLabel: "Belegte Fakten", sourceScopeLabel: "Quellenumfang", filtersLabel: "Einsätze nach Aufgabe filtern", filters: {all: "Alle Einsätze", orientation: "Orientierung", objective: "Ziele", construction: "Bau", logistics: "Logistik", "fire-support": "Feuerunterstützung", "air-operations": "Lufteinsätze"}, showing: "Abläufe angezeigt", objectiveLabel: "Aufgabe", contextLabel: "Kontext", evidenceLabel: "Beleg", sourceLabel: "Quelle", checkedLabel: "Geprüft", buildLabel: "Build", openGuide: "Passenden Guide öffnen", relatedGuides: "Verwandte Guides", relatedTools: "Verwandte Tools", visualVerified: "Objektbild verifiziert", visualContextual: "Kontextbild", visualPending: "Bild noch nicht verifiziert", visualPendingDescription: "Es gibt noch kein freigegebenes, objektgenaues Bild. Der Ablauf bleibt ohne fremden oder generischen Ersatz dokumentiert.",
    entries: {
      "battlefield-control-zone": {title: "Schlachtfeld und Control Zone", objective: "Aktives Ziel vor der Routenwahl lesen", context: "Gesamtes Schlachtfeld und aktive zufällige Control Zone", summary: "Finde die aktive Control Zone, vergleiche sichere Transport- und Versorgungswege und wähle für diese Runde eine Route statt einen festen Pfad auswendig zu lernen.", imageAlt: "Kontextbild für Schlachtfeld und aktiven Zielablauf in WARDOGS"},
      "tower-terminal": {title: "Turmterminal", objective: "Zugang sichern und aktuellen Terminalhinweis lesen", context: "Turmziel im aktuellen Control-Zone-Ablauf", summary: "Sichere den Nahbereich, erkenne die richtige Interaktion, teile sie mit und beachte wieder die Teamwertung. Beta-Codes und Zeiten gelten nicht als aktuelle Konstanten."},
      "oil-rig-hot-zone": {title: "Ölplattform und Bohranlage", objective: "Anlage bauen, betanken, aktivieren und verteidigen", context: "Gültiger FOB-Baubereich nahe der geplanten Operation", summary: "Nutze den historischen Ablauf nur als Checkliste. Kosten, Abklingzeit, Platzierung und Hot-Zone-Verhalten müssen im Live-Build geprüft werden."},
      "fob-network": {title: "FOB-Netzwerk", objective: "Vorgeschobene Basis platzieren, versorgen, verteidigen und bergen", context: "Vorposten mit Zielbezug und tragfähiger Lieferroute", summary: "Bewerte eine FOB nach Verstärkung, Fahrzeugzugang, Entladefläche, Deckung und Verteidigung. Eine unversorgbare oder blockierte Basis ist keine Abkürzung.", imageAlt: "Offizielles WARDOGS-Kontextbild für die FOB-Planung"},
      "cargo-route": {title: "Frachtroute", objective: "Die tatsächlich benötigte Versorgung liefern", context: "Hauptbasis, Transportroute, Entladeplatz und Rückweg", summary: "Plane Kauf, Beladung, Eskorte, Entladung und Rückkehr als einen Kreislauf. Aufgezeichnete Steuerung und Kapazitäten bleiben Closed-Beta-Beobachtungen.", imageAlt: "WARDOGS Ural als Kontextbild für Fracht- und Versorgungsrouten"},
      "mortar-support": {title: "Mörserunterstützung", objective: "Versorgte Bedienung mit aktuellem Spotterruf verbinden", context: "Geschützte Feuerstellung und beobachtetes Zielgebiet", summary: "Bestätige Ziel, Richtung und Entfernung, feuere eine Korrektur, melde den Einschlag, stoppe für Verbündete und verlege, bevor die Stellung gefunden wird.", imageAlt: "Verifizierte L81-Mörserstellung in WARDOGS"},
      "helicopter-transport": {title: "Hubschraubertransport", objective: "Spieler oder Vorräte bewegen und einen Ausweg erhalten", context: "Startpunkt, gedeckte Route, Landezone und Rückweg", summary: "Plane vor dem Start, bestätige die Landezone, vermeide langes Schweben, entlade schnell und behalte Treibstoff und Raum für einen sicheren Abbruch.", imageAlt: "WARDOGS-Hubschraubercockpit als Kontextbild für Transportplanung"},
    },
  },
  ru: {
    metaTitle: "Оперативный атлас WARDOGS: карты, FOB, грузы и цели",
    metaDescription: "Оперативный атлас WARDOGS связывает Control Zone, башни, FOB, грузы, миномёты и вертолёты с источниками, без выдуманных координат и маршрутов.",
    eyebrow: "Справочник по задачам", title: "Оперативный атлас WARDOGS", description: "Выберите нужную отряду задачу, проверьте контекст и источник, затем откройте точное руководство. Это указатель рабочих процессов, а не выдуманная тактическая карта: неподтверждённые координаты и постоянные маршруты не публикуются.", workflowLabel: "Редакционный порядок действий", workflowNote: "Шаги составлены редакцией сайта. Метки доказательств относятся только к перечисленным ниже фактам из источников.", sourcedFactsLabel: "Факты из источников", sourceScopeLabel: "Границы источника", filtersLabel: "Фильтр операций по задаче", filters: {all: "Все операции", orientation: "Ориентирование", objective: "Цели", construction: "Строительство", logistics: "Логистика", "fire-support": "Огневая поддержка", "air-operations": "Воздушные операции"}, showing: "процессов показано", objectiveLabel: "Задача", contextLabel: "Контекст", evidenceLabel: "Доказательство", sourceLabel: "Источник", checkedLabel: "Проверено", buildLabel: "Сборка", openGuide: "Открыть точное руководство", relatedGuides: "Связанные руководства", relatedTools: "Связанные инструменты", visualVerified: "Изображение объекта проверено", visualContextual: "Контекстное изображение", visualPending: "Изображение ещё не проверено", visualPendingDescription: "Одобренного изображения именно этого объекта пока нет. Процесс описан без чужой или общей картинки-замены.",
    entries: {
      "battlefield-control-zone": {title: "Поле боя и Control Zone", objective: "Найти активную цель до выбора маршрута", context: "Всё поле боя и активная случайная Control Zone", summary: "Найдите активную Control Zone, сравните безопасные пути транспорта и снабжения и выберите маршрут для текущего матча, а не заучивайте одну дорогу.", imageAlt: "Контекстное изображение поля боя и активной цели WARDOGS"},
      "tower-terminal": {title: "Терминал башни", objective: "Защитить подход и прочитать текущую подсказку терминала", context: "Башенная цель внутри текущей Control Zone", summary: "Уберите ближайшие угрозы, определите нужное действие, сообщите его отряду и вернитесь к командному счёту. Коды и тайминги беты не считаются текущими."},
      "oil-rig-hot-zone": {title: "Нефтяная и буровая установка", objective: "Построить, заправить, запустить и защитить установку", context: "Допустимая зона строительства FOB рядом с операцией", summary: "Используйте историческую последовательность только как список шагов. Стоимость, задержки, ограничения и поведение Hot Zone проверяйте в текущей сборке."},
      "fob-network": {title: "Сеть FOB", objective: "Разместить, снабжать, защищать и восстанавливать базу", context: "Передовая позиция, связанная с целью и устойчивым маршрутом", summary: "Оценивайте FOB по подкреплениям, подъезду, разгрузке, укрытию и защите. База без снабжения или безопасного выхода не сокращает путь.", imageAlt: "Официальное контекстное изображение полевых операций для планирования FOB"},
      "cargo-route": {title: "Грузовой маршрут", objective: "Доставить именно тот тип снабжения, который нужен", context: "Главная база, маршрут, зона разгрузки и обратный путь", summary: "Планируйте покупку, загрузку, сопровождение, разгрузку и возврат как единый цикл. Управление и вместимость остаются наблюдениями Closed Beta.", imageAlt: "WARDOGS Ural как контекстное изображение грузового маршрута"},
      "mortar-support": {title: "Миномётная поддержка", objective: "Связать снабжённый расчёт с актуальным наблюдателем", context: "Защищённая огневая позиция и наблюдаемая цель", summary: "Подтвердите цель, направление и дальность, дайте пристрелочный выстрел, сообщите попадание, остановитесь перед подходом союзников и смените позицию.", imageAlt: "Проверенная позиция миномёта L81 в WARDOGS"},
      "helicopter-transport": {title: "Вертолётный транспорт", objective: "Перевезти игроков или грузы и сохранить путь отхода", context: "Точка старта, скрытый маршрут, посадочная зона и выход", summary: "Спланируйте маршрут до взлёта, подтвердите площадку, не зависайте предсказуемо, быстро разгрузитесь и оставьте топливо и пространство для отмены захода.", imageAlt: "Кабина вертолёта WARDOGS как контекст транспортного маршрута"},
    },
  },
  "pt-br": {
    metaTitle: "Atlas de Operações WARDOGS: mapas, FOBs, carga e objetivos",
    metaDescription: "Use o atlas de operações WARDOGS com fontes para Control Zone, torres, FOBs, carga, morteiros e helicópteros, sem inventar coordenadas ou rotas.",
    eyebrow: "Referência de campo por tarefa", title: "Atlas de Operações WARDOGS", description: "Escolha a tarefa do esquadrão, confira o contexto e a fonte e abra o guia exato. Este é um índice de fluxo de trabalho, não um mapa tático inventado; coordenadas e rotas fixas sem documentação ficam de fora.", workflowLabel: "Fluxo editorial", workflowNote: "A sequência foi escrita pela equipe editorial do site. Os rótulos de evidência valem apenas para os fatos citados abaixo.", sourcedFactsLabel: "Fatos com fonte", sourceScopeLabel: "Escopo da fonte", filtersLabel: "Filtrar operações por tarefa", filters: {all: "Todas", orientation: "Orientação", objective: "Objetivos", construction: "Construção", logistics: "Logística", "fire-support": "Apoio de fogo", "air-operations": "Operações aéreas"}, showing: "fluxos exibidos", objectiveLabel: "Tarefa", contextLabel: "Contexto", evidenceLabel: "Evidência", sourceLabel: "Fonte", checkedLabel: "Verificado", buildLabel: "Build", openGuide: "Abrir guia exato", relatedGuides: "Guias relacionados", relatedTools: "Ferramentas relacionadas", visualVerified: "Imagem do objeto verificada", visualContextual: "Imagem de contexto", visualPending: "Imagem ainda não verificada", visualPendingDescription: "Ainda não há uma imagem aprovada que corresponda ao objeto. O fluxo continua documentado sem usar imagem genérica ou emprestada.",
    entries: {
      "battlefield-control-zone": {title: "Campo de batalha e Control Zone", objective: "Ler o objetivo ativo antes de escolher a rota", context: "Campo inteiro e Control Zone aleatória ativa", summary: "Localize a Control Zone, compare acessos seguros para transporte e suprimento e escolha a rota desta partida em vez de decorar um único caminho.", imageAlt: "Imagem de contexto do campo de batalha e do objetivo ativo de WARDOGS"},
      "tower-terminal": {title: "Terminal da torre", objective: "Proteger a aproximação e ler o prompt atual do terminal", context: "Objetivo de torre dentro do fluxo da Control Zone", summary: "Elimine ameaças próximas, identifique a interação correta, comunique-a e volte a observar a pontuação. Códigos e tempos do beta não são constantes atuais."},
      "oil-rig-hot-zone": {title: "Plataforma de petróleo e perfuração", objective: "Construir, abastecer, ativar e defender a plataforma", context: "Área válida de construção de FOB perto da operação", summary: "Use a sequência histórica apenas como checklist. Custos, recarga, limites de posição e comportamento da Hot Zone precisam ser conferidos na build atual."},
      "fob-network": {title: "Rede de FOBs", objective: "Posicionar, suprir, defender e recuperar uma base avançada", context: "Posição ligada ao objetivo e a uma rota sustentável", summary: "Avalie a FOB por reforço, acesso de veículos, descarga, cobertura e defesa. Uma base sem suprimento ou saída segura não é um atalho útil.", imageAlt: "Imagem oficial de contexto de operações para planejar uma FOB"},
      "cargo-route": {title: "Rota de carga", objective: "Entregar o tipo de suprimento realmente pedido", context: "Base principal, rota, área de descarga e retorno", summary: "Planeje compra, carga, escolta, descarga e recuperação como um ciclo. Controles e capacidades registrados continuam observações do Beta Fechado.", imageAlt: "Ural de WARDOGS como imagem de contexto de carga e suprimento"},
      "mortar-support": {title: "Apoio de morteiro", objective: "Ligar uma equipe abastecida a uma chamada atual do observador", context: "Posição protegida e área-alvo observada", summary: "Confirme alvo, direção e distância, dispare correção, informe o impacto, cesse para aliados e mude de posição antes de ser localizado.", imageAlt: "Posição verificada do morteiro L81 em WARDOGS"},
      "helicopter-transport": {title: "Transporte de helicóptero", objective: "Mover jogadores ou suprimentos e preservar uma saída", context: "Partida, rota coberta, pouso e caminho de recuperação", summary: "Planeje antes de decolar, confirme o pouso, evite pairar de forma previsível, descarregue rápido e mantenha combustível e espaço para abortar.", imageAlt: "Cabine de helicóptero de WARDOGS como contexto para transporte"},
    },
  },
  ja: {
    metaTitle: "WARDOGS 作戦アトラス：マップ・FOB・輸送・目標",
    metaDescription: "出典付きWARDOGS作戦アトラスで、Control Zone、タワー、FOB、物資輸送、迫撃砲、ヘリ輸送を確認し、架空の座標や固定ルートを避けて詳細ガイドへ進めます。",
    eyebrow: "任務から引けるフィールド資料", title: "WARDOGS 作戦アトラス", description: "分隊に必要な任務を選び、状況と出典を確認して、該当する詳細ガイドへ進みます。これは架空の戦術マップではなく作業手順の索引です。出典のない座標や固定ルートは意図的に除外しています。", workflowLabel: "編集部作成の手順", workflowNote: "手順はサイト編集部による実用提案です。証拠ラベルは、下に列挙した出典付き事実だけに適用されます。", sourcedFactsLabel: "出典付き事実", sourceScopeLabel: "出典の範囲", filtersLabel: "任務で絞り込む", filters: {all: "すべて", orientation: "状況把握", objective: "目標", construction: "建設", logistics: "兵站", "fire-support": "火力支援", "air-operations": "航空作戦"}, showing: "件の手順を表示", objectiveLabel: "任務", contextLabel: "状況", evidenceLabel: "証拠", sourceLabel: "出典", checkedLabel: "確認日", buildLabel: "ビルド", openGuide: "詳細ガイドを開く", relatedGuides: "関連ガイド", relatedTools: "関連ツール", visualVerified: "対象画像を確認済み", visualContextual: "参考画像", visualPending: "画像は未確認", visualPendingDescription: "対象と一致する承認済み画像はまだありません。借用画像や汎用画像で代用せず、手順だけを掲載しています。",
    entries: {
      "battlefield-control-zone": {title: "戦場とControl Zone", objective: "ルートを決める前に現在の目標を確認する", context: "戦場全体とランダムに選ばれたControl Zone", summary: "現在のControl Zoneを探し、安全な輸送路と補給路を比較して、その試合に合うルートを選びます。固定ルートの暗記は前提にしません。", imageAlt: "WARDOGSの戦場と現在の目標フローを示す参考画像"},
      "tower-terminal": {title: "タワー端末", objective: "進入路を確保して現在の端末表示を読む", context: "Control Zone内のタワー目標", summary: "周囲の脅威を排除し、正しい操作を確認して共有し、チームの得点状況へ注意を戻します。ベータ時のコードや時間は現在値として扱いません。"},
      "oil-rig-hot-zone": {title: "石油・掘削リグ", objective: "リグを建設・給油・起動・防衛する", context: "作戦地点に近い有効なFOB建設範囲", summary: "過去の手順はチェックリストとしてのみ利用します。コスト、待機時間、設置制限、Hot Zoneへの影響は現行ビルドで確認してください。"},
      "fob-network": {title: "FOBネットワーク", objective: "前進基地を設置・補給・防衛・復旧する", context: "目標と継続可能な補給路につながる前進地点", summary: "増援価値、車両進入、荷下ろし空間、遮蔽、防衛性でFOBを評価します。補給や離脱ができない基地は有効な近道ではありません。", imageAlt: "FOB計画用のWARDOGS公式フィールド作戦参考画像"},
      "cargo-route": {title: "貨物輸送ルート", objective: "目的地が必要とする補給物資を運ぶ", context: "本拠地、輸送路、荷下ろし地点、帰路", summary: "購入、積載、護衛、荷下ろし、帰還を一つの循環として計画します。記録された操作と容量はクローズドベータ時点の情報です。", imageAlt: "貨物・補給ルートの参考として表示するWARDOGSのUral"},
      "mortar-support": {title: "迫撃砲支援", objective: "補給済みの砲班と最新の観測報告を結ぶ", context: "防護された射撃地点と観測可能な目標地域", summary: "目標、方向、距離を確認し、修正弾を撃ち、着弾を報告し、味方接近時は射撃を止め、発見される前に移動します。", imageAlt: "WARDOGSで確認済みのL81迫撃砲陣地"},
      "helicopter-transport": {title: "ヘリコプター輸送", objective: "人員または物資を運び、離脱手段を残す", context: "出発地点、地形を使う航路、着陸地点、帰還経路", summary: "離陸前に航路を決め、着陸地点を確認し、予測されやすいホバリングを避け、素早く降ろし、安全に中止できる燃料と空間を残します。", imageAlt: "輸送計画用のWARDOGSヘリコプター操縦席参考画像"},
    },
  },
  "zh-cn": {
    metaTitle: "WARDOGS 行动地图：地图、FOB、货运与目标任务",
    metaDescription: "使用带来源的 WARDOGS 行动地图，查找控制区、塔楼、FOB、货运、迫击炮与直升机运输攻略；每项均标注版本、核查日期和来源，不编造坐标、固定路线或当前数值。",
    eyebrow: "按任务查找的战场参考", title: "WARDOGS 行动地图", description: "先选择小队当前需要完成的任务，再核对适用场景、版本与来源，最后进入对应的完整攻略。这里是行动流程索引，不是虚构战术地图；没有可靠来源的坐标、网格和固定路线不会被发布。", workflowLabel: "编辑流程建议", workflowNote: "行动步骤由本站编辑整理；官方、已确认等证据标签仅适用于下方逐条列出的来源事实。", sourcedFactsLabel: "有来源的事实", sourceScopeLabel: "来源范围", filtersLabel: "按任务筛选行动", filters: {all: "全部行动", orientation: "地图判读", objective: "目标任务", construction: "建造", logistics: "后勤", "fire-support": "火力支援", "air-operations": "空中行动"}, showing: "项流程", objectiveLabel: "任务", contextLabel: "适用场景", evidenceLabel: "证据", sourceLabel: "来源", checkedLabel: "核查日期", buildLabel: "版本", openGuide: "打开对应攻略", relatedGuides: "相关攻略", relatedTools: "相关工具", visualVerified: "对象图片已核验", visualContextual: "场景参考图", visualPending: "图片尚未核验", visualPendingDescription: "目前没有与该对象准确对应且已获批准的图片。页面保留流程信息，不使用竞品素材、借用图片或通用横幅冒充实体图。",
    entries: {
      "battlefield-control-zone": {title: "战场与控制区", objective: "选路线前先确认本局实时目标", context: "完整战场与本局随机生成的控制区", summary: "先定位当前控制区，再比较运输、补给、掩体和撤离条件，按本局局势选择路线，而不是死记一条每局都不变的路径。", imageAlt: "WARDOGS 战场与当前目标流程的场景参考图"},
      "tower-terminal": {title: "塔楼终端", objective: "控制入口并读取当前终端提示", context: "控制区流程中的塔楼目标", summary: "清理近距离威胁，确认本版本实际要求的交互，及时告知队友，然后重新关注全队得分。测试版代码和计时不会被当作现行固定值。"},
      "oil-rig-hot-zone": {title: "石油平台与钻井平台", objective: "建造、供油、启动并防守钻井平台", context: "靠近预定行动区域的有效 FOB 建造范围", summary: "历史测试流程只作为核对步骤。建造成本、冷却、放置限制与热点区效果必须以当前客户端提示为准。"},
      "fob-network": {title: "FOB 网络", objective: "部署、补给、防守并恢复前线基地", context: "连接目标区且拥有可持续补给路线的前进位置", summary: "从增援价值、车辆入口、卸货空间、掩体和防守条件评估 FOB。无法持续补给或安全撤出的基地并不是有效捷径。", imageAlt: "用于 FOB 规划的 WARDOGS 官方战场场景参考图"},
      "cargo-route": {title: "货运路线", objective: "运送目的地真正需要的补给类型", context: "主基地、运输路线、卸货区与返程路线", summary: "把购买、装载、护送、卸货和返程作为一个完整循环来规划。页面记录的按键和容量仍属于封闭测试观察值。", imageAlt: "作为货运与补给路线场景参考的 WARDOGS Ural 卡车"},
      "mortar-support": {title: "迫击炮支援", objective: "让有补给的炮组接收仍然有效的观察员指令", context: "受保护的发射阵地与可观察的目标区域", summary: "确认目标、方向和距离，先发射校正弹，报告落点，友军推进时停火，并在敌人定位阵地前转移。", imageAlt: "WARDOGS 中已核验的 L81 迫击炮沙袋阵地"},
      "helicopter-transport": {title: "直升机运输", objective: "运输人员或物资，并始终保留退出路线", context: "起飞点、利用地形的航线、降落区与返航路径", summary: "起飞前完成路线规划，确认降落区，避免可预测的长时间悬停，快速卸载，并保留足够燃料和空间用于中止进近。", imageAlt: "用于运输路线规划的 WARDOGS 直升机驾驶舱场景参考图"},
    },
  },
};

export function getOperationsAtlasCopy(locale: Locale): OperationsAtlasCopy {
  return copyByLocale[locale];
}
