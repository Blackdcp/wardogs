import type {Locale} from "@/config/site";
import type {LoadoutCatalogue} from "./loadout-catalogue";
import {encodeBudgetState, type BudgetState} from "./share-state";
import {isToolShareWithinLimit, maximumPlanLines, type PurchaseLine} from "./workflow-state";
import {publicRoutePath} from "@/lib/public-url";

export const loadoutPresetIds = ["low-cost-infantry", "medic", "transport", "construction"] as const;
export type LoadoutPresetId = (typeof loadoutPresetIds)[number];

type PresetDescription = {title: string; mission: string; unlock: string; compatibility: string};
type PresetCopy = {
  heading: string; notice: string; quantities: string; budgets: string;
  choose: string; placeholder: string; apply: string; append: string;
  applied: string; unchanged: string; limit: string; unavailable: string;
  open: string; unlock: string; compatibility: string; unknown: string; items: string;
  cases: Record<LoadoutPresetId, PresetDescription>;
};

const copy: Record<Locale, PresetCopy> = {
  en: {
    heading: "Mission preparation lists",
    notice: "Preparation examples, not fully tested loadouts. Low cost is a goal, not a verified price ranking. Unknown prices and purchase units stay unknown; historical prices do not establish free equipment today.",
    quantities: "Each quantity starts at 1 as an editable checklist suggestion, not an optimal in-game amount, magazine count or pallet capacity.",
    budgets: "Standalone links start cash and reserve at 0 as blank budget inputs, not recommended balances. Unlock fees, fuel and other omitted costs must be added separately.",
    choose: "Preparation template", placeholder: "Select a mission", apply: "Add missing items",
    append: "Only missing items are added. Existing quantities, prices, units and budget inputs are kept. Item mode excludes the saved quick loadout total; existing vehicle and one-time costs still count, so check for double counting.",
    applied: "Missing items added; existing entries retained.", unchanged: "All template items are already present; nothing was replaced.",
    limit: "Adding would exceed the item or share limit. The existing plan is unchanged.", unavailable: "A template item is no longer in the catalogue. The existing plan is unchanged.",
    open: "Open preparation list", unlock: "Unlock and availability checks", compatibility: "Fit and task boundaries", unknown: "Price and purchase unit unknown", items: "Suggested checklist entries",
    cases: {
      "low-cost-infantry": {title: "Low-cost infantry", mission: "A minimal rifle, ammo, protection and personal medical checklist. Compare current vendor costs before adding optics, another weapon or a vehicle.", unlock: "Bushmaster M17S is an Alpha reference, not a guaranteed starting grant or permanently free rifle. Confirm current availability and the selected ammunition unlock.", compatibility: "The rifle/ammo pair has historical catalogue evidence only. Confirm ammo load, magazine and equipment slots in the live client; no attachment fit is inferred."},
      medic: {title: "Squad medical support", mission: "Prepare for a squad recovery task with a weapon/ammo reference, defibrillator, battery check and medical bag. This is not a confirmed wearable combination.", unlock: "AMP-9 progression and the medical walkthrough are pre-release references. Current unlocks, prices and medical-bag availability are not confirmed.", compatibility: "The historical walkthrough shows a defibrillator battery dependency, but the separate battery record is unverified: its type, fit and required count remain unknown. Confirm medical effects and carry limits."},
      transport: {title: "Passenger transport", mission: "Plan a passenger drop-off and return with Bobcat, a wrench reference and personal medical support. Agree on the pickup, destination and exit before buying.", unlock: "Bobcat's historical open-purchase record does not guarantee current access. Confirm the vehicle gate and availability of the chosen repair tool.", compatibility: "Verify passenger seats, fuel, repair-tool fit and operation in the current client. This is not a cargo-pallet plan; capacity, protection and repair performance are not established."},
      construction: {title: "FOB construction preparation", mission: "A team procurement checklist for Small Hammer, FOB, build supplies and a Kodiak Pickup reference. Remove team-owned purchases and agree who provides transport and tools.", unlock: "Small Hammer and FOB catalogue art identify candidates only, not current unlocks or building rights. Kodiak Pickup's Alpha gate is historical; confirm the current gate rather than using the old value.", compatibility: "Confirm required hammer size, FOB placement, supply unit and vehicle/pallet fit in the live build. The list does not establish a complete build recipe, supply demand or trip count."},
    },
  },
  "zh-cn": {
    heading: "出击准备清单",
    notice: "以下是准备案例，不是全套实测配装。“低成本”是规划目标，不是已核验的价格排名。未知价格与采购单位保持未知，历史价格不能证明今天免费。",
    quantities: "各项从 1 开始，仅作为可编辑的清单建议，不代表游戏最佳数量、弹匣数量或托盘容量。",
    budgets: "独立链接中的现金与储备从 0 开始，作为待填写的预算输入，不是推荐余额。解锁费、燃料及其他未列支出需另行添加。",
    choose: "准备模板", placeholder: "选择出击任务", apply: "追加缺少项目",
    append: "只追加缺少的项目，保留已有数量、价格、单位和预算输入。逐件模式不计入已保存的快速配装总额；原载具与一次性费用仍计入，请检查重复计算。",
    applied: "已追加缺少项目，原有条目已保留。", unchanged: "模板项目已全部存在，未替换任何内容。",
    limit: "追加后将超过项目数或分享长度限制，原清单未变。", unavailable: "模板中有项目已不在目录中，原清单未变。",
    open: "打开准备清单", unlock: "解锁与可用性核对", compatibility: "适配与任务边界", unknown: "价格与采购单位未知", items: "建议清单项目",
    cases: {
      "low-cost-infantry": {title: "低成本步兵", mission: "以步枪、弹药、防护和个人医疗用品作为精简清单。添加瞄具、副武器或载具前，先比较当前商店成本。", unlock: "Bushmaster M17S 是 Alpha 参考，不保证当前作为起始赠送或永久免费。请核对当前可用性与所选弹药的解锁条件。", compatibility: "步枪与弹药组合只有历史目录证据。请在当前客户端核对弹种、弹匣及装备槽位，不推断任何配件适配。"},
      medic: {title: "小队医疗", mission: "为小队救援准备武器与弹药参考、除颤器、电池核对项及医疗包。并不表示这些物品已确认可同时携带。", unlock: "AMP-9 成长路线与医疗演示均属发行前参考。当前解锁、价格及医疗包可用性尚未确认。", compatibility: "历史演示展示了除颤器的电池依赖，但独立电池条目未核验，其型号、适配和所需数量仍未知。请核对医疗效果与携带限制。"},
      transport: {title: "人员运输", mission: "以 Bobcat、扳手参考和个人医疗用品规划接送及返程。购买前先约定集合点、目的地与撤离路线。", unlock: "Bobcat 历史上的开放购买记录不保证当前可直接购买。请核对载具门槛和所选维修工具是否可用。", compatibility: "请在当前客户端核对座位、燃料、维修工具适配及操作。这不是货运托盘方案，不确认载量、防护或维修性能。"},
      construction: {title: "FOB 建造准备", mission: "以小锤、FOB、建造物资和 Kodiak Pickup 参考建立团队采购清单。移除队伍已有的采购项，并约定运输和工具负责人。", unlock: "小锤和 FOB 目录素材只确认候选名称，不证明当前解锁或建造权限。Kodiak Pickup 的 Alpha 门槛是历史值，请核对当前条件。", compatibility: "请在当前版本核对所需锤具规格、FOB 放置、物资单位与载具托盘适配。清单不代表完整建造配方，不计算物资需求或运输趟数。"},
    },
  },
  "zh-tw": {
    heading: "出擊準備清單",
    notice: "以下是準備案例，不是全套實測配裝。「低成本」是規劃目標，不是已核驗的價格排名。未知價格與採購單位維持未知，歷史價格不能證明今天免費。",
    quantities: "各項從 1 開始，僅作為可編輯的清單建議，不代表遊戲最佳數量、彈匣數量或棧板容量。",
    budgets: "獨立連結的現金與儲備從 0 開始，作為待填寫的預算輸入，不是建議餘額。解鎖費、燃料及其他未列支出需另外新增。",
    choose: "準備範本", placeholder: "選擇出擊任務", apply: "新增缺少項目",
    append: "只新增缺少項目，保留既有數量、價格、單位和預算輸入。逐件模式不計入已儲存的快速配裝總額；原載具與一次性費用仍計入，請檢查重複計算。",
    applied: "已新增缺少項目，原有項目已保留。", unchanged: "範本項目已全部存在，未取代任何內容。",
    limit: "新增後將超過項目數或分享長度限制，原清單未變。", unavailable: "範本中有項目已不在目錄中，原清單未變。",
    open: "開啟準備清單", unlock: "解鎖與可用性核對", compatibility: "適配與任務邊界", unknown: "價格與採購單位未知", items: "建議清單項目",
    cases: {
      "low-cost-infantry": {title: "低成本步兵", mission: "以步槍、彈藥、防護和個人醫療用品作為精簡清單。新增瞄具、副武器或載具前，先比較目前商店成本。", unlock: "Bushmaster M17S 是 Alpha 參考，不保證目前作為起始贈送或永久免費。請核對目前可用性與所選彈藥的解鎖條件。", compatibility: "步槍與彈藥組合只有歷史目錄證據。請在目前用戶端核對彈種、彈匣及裝備欄位，不推斷任何配件適配。"},
      medic: {title: "小隊醫療", mission: "為小隊救援準備武器與彈藥參考、除顫器、電池核對項及醫療包。並不表示這些物品已確認可同時攜帶。", unlock: "AMP-9 成長路線與醫療展示均屬發行前參考。目前解鎖、價格及醫療包可用性尚未確認。", compatibility: "歷史展示呈現了除顫器的電池依賴，但獨立電池項目未核驗，其型號、適配和所需數量仍未知。請核對醫療效果與攜帶限制。"},
      transport: {title: "人員運輸", mission: "以 Bobcat、扳手參考和個人醫療用品規劃接送及返程。購買前先約定集合點、目的地與撤離路線。", unlock: "Bobcat 歷史上的開放購買紀錄不保證目前可直接購買。請核對載具門檻和所選維修工具是否可用。", compatibility: "請在目前用戶端核對座位、燃料、維修工具適配及操作。這不是貨運棧板方案，不確認載量、防護或維修性能。"},
      construction: {title: "FOB 建造準備", mission: "以小槌、FOB、建造物資和 Kodiak Pickup 參考建立團隊採購清單。移除隊伍已有的採購項，並約定運輸和工具負責人。", unlock: "小槌和 FOB 目錄素材只確認候選名稱，不證明目前解鎖或建造權限。Kodiak Pickup 的 Alpha 門檻是歷史值，請核對目前條件。", compatibility: "請在目前版本核對所需槌具規格、FOB 放置、物資單位與載具棧板適配。清單不代表完整建造配方，不計算物資需求或運輸趟數。"},
    },
  },
  ru: {
    heading: "Списки подготовки к задаче",
    notice: "Примеры подготовки, не полностью протестированные комплекты. Низкая стоимость — цель, а не проверенный рейтинг цен. Неизвестные цены и единицы покупки остаются неизвестными; историческая цена не означает бесплатное снаряжение сегодня.",
    quantities: "Количество 1 — редактируемое предложение для списка, не оптимальное игровое значение, число магазинов или вместимость поддона.",
    budgets: "В отдельных ссылках деньги и резерв начинаются с 0 как поля для заполнения, не рекомендуемый баланс. Плату за разблокировку, топливо и другие расходы добавляйте отдельно.",
    choose: "Шаблон подготовки", placeholder: "Выберите задачу", apply: "Добавить недостающие предметы",
    append: "Добавляются только отсутствующие предметы. Количество, цены, единицы и бюджет сохраняются. В режиме списка сохранённая общая стоимость комплекта не учитывается; расходы на транспорт и разовые затраты учитываются: проверьте дублирование.",
    applied: "Недостающие предметы добавлены; прежние записи сохранены.", unchanged: "Все предметы шаблона уже есть; ничего не заменено.",
    limit: "Будет превышен лимит предметов или длины ссылки. План не изменён.", unavailable: "Предмет шаблона отсутствует в каталоге. План не изменён.",
    open: "Открыть список подготовки", unlock: "Разблокировка и доступность", compatibility: "Совместимость и границы задачи", unknown: "Цена и единица покупки неизвестны", items: "Предлагаемые пункты списка",
    cases: {
      "low-cost-infantry": {title: "Недорогая пехота", mission: "Минимальный список: винтовка, патроны, защита и личная медицина. Сравните текущие цены до добавления оптики, второго оружия или транспорта.", unlock: "Bushmaster M17S — ссылка на Alpha, не гарантия стартовой выдачи или постоянно бесплатной винтовки. Проверьте текущую доступность и разблокировку выбранных патронов.", compatibility: "Для пары винтовка/патроны есть только исторические данные каталога. Проверьте тип патронов, магазин и слоты в текущем клиенте; совместимость обвесов не предполагается."},
      medic: {title: "Медицинская поддержка отряда", mission: "Подготовка к помощи отряду: оружие и патроны как ориентир, дефибриллятор, проверка батареи и медицинская сумка. Совместное ношение не подтверждено.", unlock: "Развитие AMP-9 и медицинский видеоматериал относятся к версии до релиза. Текущие условия, цены и доступность медицинской сумки не подтверждены.", compatibility: "Историческое видео показывает потребность дефибриллятора в батарее, но отдельная запись батареи не проверена: тип, совместимость и количество неизвестны. Проверьте эффекты медицины и ограничения переноски."},
      transport: {title: "Перевозка пассажиров", mission: "Спланируйте доставку и возвращение с Bobcat, гаечным ключом как ориентиром и личной медициной. Согласуйте сбор, пункт назначения и выход до покупки.", unlock: "Историческая свободная покупка Bobcat не гарантирует текущий доступ. Проверьте условия покупки транспорта и доступность инструмента ремонта.", compatibility: "Проверьте места, топливо, совместимость и применение инструмента в клиенте. Это не грузовой план; вместимость поддонов, защита и эффективность ремонта не установлены."},
      construction: {title: "Подготовка к строительству FOB", mission: "Командный список закупок: Small Hammer, FOB, строительные припасы и Kodiak Pickup как ориентир. Уберите уже имеющиеся покупки и назначьте ответственных за транспорт и инструменты.", unlock: "Изображения Small Hammer и FOB подтверждают только кандидатов, не текущую разблокировку или права строительства. Условия Kodiak Pickup из Alpha исторические: проверьте текущие.", compatibility: "Проверьте размер молота, размещение FOB, единицы припасов и совместимость поддона с транспортом. Это не полный рецепт строительства и не расчёт ресурсов или рейсов."},
    },
  },
  de: {
    heading: "Vorbereitungslisten für Einsätze",
    notice: "Vorbereitungsbeispiele, keine vollständig getesteten Ausrüstungen. Niedrige Kosten sind ein Ziel, keine geprüfte Preisrangliste. Unbekannte Preise und Kaufeinheiten bleiben unbekannt; historische Preise belegen heute keine kostenlose Ausrüstung.",
    quantities: "Die Menge 1 ist ein bearbeitbarer Listenvorschlag, kein optimaler Spielwert, keine Magazinzahl und keine Palettenkapazität.",
    budgets: "Einzellinks beginnen bei Geld und Reserve mit 0 als auszufüllende Budgetfelder, nicht als empfohlener Kontostand. Freischaltungen, Treibstoff und fehlende Kosten separat ergänzen.",
    choose: "Vorbereitungsvorlage", placeholder: "Einsatz auswählen", apply: "Fehlende Gegenstände ergänzen",
    append: "Nur fehlende Gegenstände werden ergänzt. Mengen, Preise, Einheiten und Budget bleiben erhalten. Der Listenmodus berücksichtigt nicht die gespeicherte Ausrüstungssumme; Fahrzeug- und Einmalkosten zählen weiterhin. Doppelzählungen prüfen.",
    applied: "Fehlende Gegenstände ergänzt; bestehende Einträge erhalten.", unchanged: "Alle Gegenstände sind bereits vorhanden; nichts ersetzt.",
    limit: "Die Ergänzung würde die Gegenstands- oder Linkgrenze überschreiten. Der Plan bleibt unverändert.", unavailable: "Ein Vorlagengegenstand fehlt im Katalog. Der Plan bleibt unverändert.",
    open: "Vorbereitungsliste öffnen", unlock: "Freischaltung und Verfügbarkeit", compatibility: "Passform und Einsatzgrenzen", unknown: "Preis und Kaufeinheit unbekannt", items: "Vorgeschlagene Listeneinträge",
    cases: {
      "low-cost-infantry": {title: "Kostensparende Infanterie", mission: "Eine minimale Liste mit Gewehr, Munition, Schutz und persönlicher Medizin. Aktuelle Händlerpreise vor Optik, Zweitwaffe oder Fahrzeug vergleichen.", unlock: "Bushmaster M17S ist eine Alpha-Referenz, keine garantierte Startausgabe oder dauerhaft kostenlose Waffe. Aktuelle Verfügbarkeit und Munitionsfreischaltung prüfen.", compatibility: "Für Gewehr und Munition liegen nur historische Katalogdaten vor. Ladung, Magazin und Ausrüstungsslots im aktuellen Client prüfen; Aufsatzkompatibilität wird nicht abgeleitet."},
      medic: {title: "Sanitätsunterstützung", mission: "Vorbereitung auf Trupprettung: Waffen-/Munitionsreferenz, Defibrillator, Batterieprüfung und Sanitätstasche. Gleichzeitiges Tragen ist nicht bestätigt.", unlock: "AMP-9-Fortschritt und Medizinvideo stammen aus Vorabversionen. Aktuelle Freischaltungen, Preise und Verfügbarkeit der Sanitätstasche sind nicht bestätigt.", compatibility: "Das historische Video zeigt eine Batterieabhängigkeit des Defibrillators. Der separate Batterieeintrag ist ungeprüft: Typ, Passform und benötigte Anzahl bleiben unbekannt. Medizinwirkung und Tragelimits prüfen."},
      transport: {title: "Personentransport", mission: "Hinfahrt und Rückweg mit Bobcat, Schraubenschlüssel als Referenz und persönlicher Medizin planen. Treffpunkt, Ziel und Ausfahrt vor dem Kauf abstimmen.", unlock: "Bobcats historisch freie Kaufmöglichkeit garantiert keinen aktuellen Zugang. Fahrzeugvoraussetzungen und Verfügbarkeit des Reparaturwerkzeugs prüfen.", compatibility: "Sitze, Treibstoff, Werkzeugpassform und Bedienung im aktuellen Client prüfen. Kein Frachtpalettenplan; Kapazität, Schutz und Reparaturleistung sind nicht belegt."},
      construction: {title: "FOB-Bauvorbereitung", mission: "Team-Einkaufsliste für Small Hammer, FOB, Baumaterial und Kodiak Pickup als Referenz. Vorhandene Teameinkäufe entfernen und Transport sowie Werkzeuge zuordnen.", unlock: "Katalogbilder von Small Hammer und FOB identifizieren nur Kandidaten, keine aktuellen Freischaltungen oder Baurechte. Kodiak Pickups Alpha-Voraussetzung ist historisch; die aktuelle prüfen.", compatibility: "Hammergröße, FOB-Platzierung, Materialeinheit und Fahrzeug-/Palettenpassform im aktuellen Build prüfen. Kein vollständiges Baurezept und keine Material- oder Fahrtenberechnung."},
    },
  },
  "pt-br": {
    heading: "Listas de preparação por missão",
    notice: "Exemplos de preparação, não equipamentos completos testados. Baixo custo é uma meta, não um ranking de preços verificado. Preços e unidades de compra desconhecidos continuam desconhecidos; preços históricos não provam equipamento grátis hoje.",
    quantities: "A quantidade 1 é uma sugestão editável da lista, não uma quantidade ideal no jogo, número de carregadores ou capacidade de palete.",
    budgets: "Links individuais iniciam dinheiro e reserva em 0 como campos a preencher, não saldos recomendados. Acrescente desbloqueios, combustível e outros custos separadamente.",
    choose: "Modelo de preparação", placeholder: "Selecione uma missão", apply: "Adicionar itens ausentes",
    append: "Somente itens ausentes são adicionados. Quantidades, preços, unidades e orçamento existentes são mantidos. O modo de itens exclui o total rápido de equipamento salvo; custos de veículo e custos únicos continuam contando. Confira duplicidades.",
    applied: "Itens ausentes adicionados; entradas existentes preservadas.", unchanged: "Todos os itens já estão presentes; nada foi substituído.",
    limit: "A adição excederia o limite de itens ou do link. O plano permanece igual.", unavailable: "Um item do modelo não está mais no catálogo. O plano permanece igual.",
    open: "Abrir lista de preparação", unlock: "Desbloqueio e disponibilidade", compatibility: "Compatibilidade e limites da missão", unknown: "Preço e unidade de compra desconhecidos", items: "Entradas sugeridas da lista",
    cases: {
      "low-cost-infantry": {title: "Infantaria de baixo custo", mission: "Lista mínima de rifle, munição, proteção e medicina pessoal. Compare preços atuais antes de adicionar mira, outra arma ou veículo.", unlock: "Bushmaster M17S é uma referência da Alpha, não uma garantia de entrega inicial ou rifle sempre grátis. Confira disponibilidade atual e desbloqueio da munição escolhida.", compatibility: "O par rifle/munição tem apenas evidência histórica do catálogo. Confirme carga, carregador e espaços de equipamento no cliente atual; compatibilidade de acessórios não é presumida."},
      medic: {title: "Apoio médico ao esquadrão", mission: "Prepare o resgate do esquadrão com referência de arma/munição, desfibrilador, verificação de bateria e bolsa médica. Não é uma combinação de porte confirmada.", unlock: "Progressão da AMP-9 e vídeo médico são referências anteriores ao lançamento. Desbloqueios, preços e disponibilidade da bolsa médica atuais não estão confirmados.", compatibility: "O vídeo histórico mostra a dependência de bateria do desfibrilador, mas o registro separado da bateria não foi verificado: tipo, encaixe e quantidade são desconhecidos. Confirme efeitos médicos e limites de porte."},
      transport: {title: "Transporte de passageiros", mission: "Planeje desembarque e retorno com Bobcat, chave de reparo como referência e medicina pessoal. Combine ponto de encontro, destino e saída antes da compra.", unlock: "A compra aberta histórica do Bobcat não garante acesso atual. Confira requisitos do veículo e disponibilidade da ferramenta de reparo.", compatibility: "Verifique assentos, combustível, compatibilidade e operação da ferramenta no cliente atual. Não é um plano de paletes; capacidade, proteção e desempenho de reparo não estão estabelecidos."},
      construction: {title: "Preparação para construir FOB", mission: "Lista de compras da equipe para Small Hammer, FOB, suprimentos de construção e referência de Kodiak Pickup. Remova compras já fornecidas e defina responsáveis por transporte e ferramentas.", unlock: "Arte de catálogo de Small Hammer e FOB identifica apenas candidatos, não desbloqueios ou permissões atuais. O requisito Alpha do Kodiak Pickup é histórico; confira o atual.", compatibility: "Confirme tamanho do martelo, posicionamento da FOB, unidade de suprimentos e encaixe de veículo/palete no jogo atual. Não é receita completa, cálculo de suprimentos ou número de viagens."},
    },
  },
  ja: {
    heading: "任務別の出撃準備リスト",
    notice: "準備例であり、全装備を実機検証した構成ではありません。低コストは目標であり、検証済みの価格順位ではありません。不明な価格と購入単位は不明のままです。過去の価格は現在の無料装備を証明しません。",
    quantities: "数量 1 は編集用のリスト提案です。ゲーム内の最適数量、マガジン数、パレット容量を示しません。",
    budgets: "個別リンクの所持金と予備費は入力待ちの値として 0 から始まります。推奨残高ではありません。解除費、燃料などの未掲載費用は別途追加してください。",
    choose: "準備テンプレート", placeholder: "任務を選択", apply: "不足項目を追加",
    append: "不足項目のみ追加し、既存の数量、価格、単位、予算入力を保持します。品目モードでは保存済みの装備概算額を除外しますが、車両費と一回限りの費用は計上します。二重計上を確認してください。",
    applied: "不足項目を追加し、既存項目を保持しました。", unchanged: "全項目が登録済みです。置き換えはありません。",
    limit: "追加すると項目数または共有リンクの上限を超えます。既存の計画は変更していません。", unavailable: "テンプレートの項目がカタログにありません。既存の計画は変更していません。",
    open: "準備リストを開く", unlock: "解除条件と入手可否", compatibility: "適合と任務の制約", unknown: "価格と購入単位は不明", items: "推奨チェック項目",
    cases: {
      "low-cost-infantry": {title: "低コスト歩兵", mission: "ライフル、弾薬、防護、個人医療品の最小限のリストです。照準器、別の武器、車両を追加する前に現在の店頭価格を比較してください。", unlock: "Bushmaster M17S は Alpha 時点の参考です。初期支給や恒久無料を保証しません。現在の入手可否と選択弾薬の解除条件を確認してください。", compatibility: "ライフルと弾薬の組合せは過去のカタログ証拠のみです。現行クライアントで弾種、マガジン、装備枠を確認してください。アタッチメント適合は推定しません。"},
      medic: {title: "分隊医療支援", mission: "武器と弾薬の参考、除細動器、バッテリー確認項目、医療バッグで分隊救助を準備します。同時携行が確認された構成ではありません。", unlock: "AMP-9 の進行情報と医療映像は発売前の参考です。現在の解除条件、価格、医療バッグの入手可否は未確認です。", compatibility: "過去の映像は除細動器のバッテリー依存を示しますが、個別のバッテリー記録は未検証です。種類、適合、必要数は不明です。医療効果と携行制限を確認してください。"},
      transport: {title: "人員輸送", mission: "Bobcat、レンチの参考、個人医療品で送迎と帰路を計画します。購入前に集合地点、目的地、退出経路を決めてください。", unlock: "Bobcat の過去の自由購入記録は現在の購入可否を保証しません。車両条件と修理工具の入手可否を確認してください。", compatibility: "現行クライアントで座席、燃料、工具の適合と操作を確認してください。貨物パレット計画ではありません。積載量、防護、修理性能は未確認です。"},
      construction: {title: "FOB 建築準備", mission: "Small Hammer、FOB、建築物資、Kodiak Pickup の参考によるチーム購入リストです。既にチームが用意した購入品を除き、輸送と工具の担当者を決めてください。", unlock: "Small Hammer と FOB のカタログ画像は候補を識別するだけで、現在の解除条件や建築権限を証明しません。Kodiak Pickup の Alpha 条件は過去のものです。現行条件を確認してください。", compatibility: "必要なハンマーの種類、FOB 配置、物資単位、車両とパレットの適合を現行版で確認してください。完全な建築レシピ、物資需要、輸送回数は示しません。"},
    },
  },
  pl: {
    heading: "Listy przygotowań do zadania",
    notice: "Przykłady przygotowań, nie w pełni przetestowane zestawy. Niski koszt to cel, nie zweryfikowany ranking cen. Nieznane ceny i jednostki zakupu pozostają nieznane; cena historyczna nie oznacza dziś darmowego wyposażenia.",
    quantities: "Ilość 1 jest edytowalną propozycją listy, nie optymalną wartością w grze, liczbą magazynków ani pojemnością palety.",
    budgets: "Osobne linki zaczynają gotówkę i rezerwę od 0 jako pola do uzupełnienia, nie zalecane saldo. Dodaj osobno opłaty za odblokowanie, paliwo i pozostałe koszty.",
    choose: "Szablon przygotowań", placeholder: "Wybierz zadanie", apply: "Dodaj brakujące przedmioty",
    append: "Dodawane są tylko brakujące przedmioty. Ilości, ceny, jednostki i budżet zostają zachowane. Tryb listy pomija zapisaną szybką sumę wyposażenia; koszty pojazdu i jednorazowe nadal się liczą. Sprawdź podwójne naliczanie.",
    applied: "Dodano brakujące przedmioty; poprzednie wpisy zachowano.", unchanged: "Wszystkie przedmioty już są; niczego nie zastąpiono.",
    limit: "Dodanie przekroczyłoby limit przedmiotów lub linku. Plan pozostaje bez zmian.", unavailable: "Przedmiotu szablonu nie ma w katalogu. Plan pozostaje bez zmian.",
    open: "Otwórz listę przygotowań", unlock: "Odblokowanie i dostępność", compatibility: "Dopasowanie i granice zadania", unknown: "Cena i jednostka zakupu nieznane", items: "Proponowane pozycje listy",
    cases: {
      "low-cost-infantry": {title: "Niskobudżetowa piechota", mission: "Minimalna lista: karabin, amunicja, ochrona i środki medyczne. Porównaj aktualne ceny przed dodaniem optyki, drugiej broni lub pojazdu.", unlock: "Bushmaster M17S to odniesienie do Alpha, nie gwarancja wyposażenia początkowego ani stale darmowej broni. Sprawdź aktualną dostępność i odblokowanie wybranej amunicji.", compatibility: "Para karabin/amunicja ma wyłącznie historyczne dowody katalogowe. Sprawdź typ amunicji, magazynek i sloty w aktualnym kliencie; zgodność dodatków nie jest zakładana."},
      medic: {title: "Wsparcie medyczne oddziału", mission: "Przygotuj ratowanie oddziału: odniesienie do broni i amunicji, defibrylator, sprawdzenie baterii i torba medyczna. Wspólne przenoszenie nie jest potwierdzone.", unlock: "Rozwój AMP-9 i materiał medyczny pochodzą sprzed premiery. Aktualne odblokowania, ceny i dostępność torby medycznej nie są potwierdzone.", compatibility: "Historyczne nagranie pokazuje zależność defibrylatora od baterii, ale osobny wpis baterii jest niezweryfikowany: typ, dopasowanie i liczba są nieznane. Sprawdź efekty medyczne i limity noszenia."},
      transport: {title: "Transport pasażerów", mission: "Zaplanuj dowóz i powrót z Bobcat, kluczem jako odniesieniem i osobistymi środkami medycznymi. Ustal zbiórkę, cel i wyjazd przed zakupem.", unlock: "Historyczny zakup Bobcat bez blokady nie gwarantuje aktualnego dostępu. Sprawdź wymagania pojazdu i dostępność narzędzia naprawczego.", compatibility: "Sprawdź siedzenia, paliwo, dopasowanie narzędzia i obsługę w aktualnym kliencie. To nie plan palet cargo; ładowność, ochrona i wydajność napraw nie są ustalone."},
      construction: {title: "Przygotowanie budowy FOB", mission: "Lista zakupów zespołu: Small Hammer, FOB, materiały budowlane i Kodiak Pickup jako odniesienie. Usuń zakupy już zapewnione przez zespół i wyznacz transport oraz narzędzia.", unlock: "Grafiki Small Hammer i FOB identyfikują tylko kandydatów, nie aktualne odblokowania ani prawa budowy. Wymagania Kodiak Pickup z Alpha są historyczne; sprawdź aktualne.", compatibility: "Sprawdź rozmiar młota, umieszczenie FOB, jednostkę materiałów i zgodność pojazdu z paletą w aktualnej wersji. Lista nie jest pełnym przepisem budowy ani obliczeniem zapasów lub kursów."},
    },
  },
};

const itemIds: Record<LoadoutPresetId, readonly string[]> = {
  "low-cost-infantry": ["weapons/bushmaster-m17s", "ammo/5-56x45mm", "gear/light-helmet", "gear/light-armor", "medical/stimpen"],
  medic: ["weapons/amp-9", "ammo/9x19mm", "medical/defibrillator", "equipment/battery", "medical/medical-bag"],
  transport: ["vehicles/bobcat", "equipment/wrench", "medical/stimpen"],
  construction: ["equipment/small-hammer", "equipment/forward-operating-base", "supplies/build-supply-pallet", "vehicles/kodiak-pickup"],
};

export type LoadoutPreset = PresetDescription & {id: LoadoutPresetId; lines: PurchaseLine[]};

export function getLoadoutPresetCopy(locale: Locale) { return copy[locale]; }

export function getLoadoutPresets(locale: Locale): LoadoutPreset[] {
  return loadoutPresetIds.map((id) => ({
    id, ...copy[locale].cases[id],
    lines: itemIds[id].map((itemId) => ({id: itemId, quantity: 1, unit: "unknown", unitPrice: null, frequency: "repeat"})),
  }));
}

export function createLoadoutPresetState(preset: LoadoutPreset): BudgetState {
  return {cash: 0, loadout: 0, vehicle: 0, reserve: 0, once: 0, mode: "items", lines: preset.lines.map((line) => ({...line}))};
}

export function getLoadoutPresetHref(preset: LoadoutPreset, locale: Locale, dataVersion: string) {
  return publicRoutePath(`/${locale}/tools/loadout-budget?${encodeBudgetState(createLoadoutPresetState(preset), dataVersion)}`);
}

export function getMatchingLoadoutPresets(lines: readonly PurchaseLine[], presets: readonly LoadoutPreset[]) {
  const ids = new Set(lines.map(({id}) => id));
  return presets.filter((preset) => preset.lines.every(({id}) => ids.has(id)));
}

export function appendLoadoutPreset(state: BudgetState, preset: LoadoutPreset, catalogue: LoadoutCatalogue): {status: "applied" | "unchanged" | "limit" | "unavailable"; state: BudgetState} {
  const available = new Set(catalogue.items.map(({id}) => id));
  if (preset.lines.some(({id}) => !available.has(id))) return {status: "unavailable", state};
  const lines = state.lines ?? [];
  const existing = new Set(lines.map(({id}) => id));
  const added = preset.lines.filter(({id}) => !existing.has(id)).map((line) => ({...line}));
  if (lines.length + added.length > maximumPlanLines) return {status: "limit", state};
  if (!added.length && state.mode === "items") return {status: "unchanged", state};
  // Preserve even deleted IDs and hidden quick totals; a template never reprices existing entries.
  const next: BudgetState = {...state, mode: "items", lines: [...lines, ...added]};
  if (!isToolShareWithinLimit(encodeBudgetState(next, catalogue.dataVersion))) return {status: "limit", state};
  return {status: "applied", state: next};
}
