import type {Locale} from "@/config/site";
import type {ItemType, ItemTypeId, WardogsItem} from "./item-library";

type TranslatedLocale = Exclude<Locale, "en">;

type ItemLocaleProfile = {
  typeNames: Record<ItemTypeId, string>;
  status: Record<WardogsItem["status"], string>;
  buildPrefix: string;
  summary(item: WardogsItem, typeName: string): string;
  description(item: WardogsItem, typeName: string): string;
  role(item: WardogsItem, typeName: string): string;
  strengths(item: WardogsItem, typeName: string): string[];
  cautions(item: WardogsItem, typeName: string): string[];
  confirmed(item: WardogsItem, typeName: string): string[];
  unconfirmed(item: WardogsItem, typeName: string): string[];
  imageAlt(item: WardogsItem, typeName: string): string;
};

const profiles: Record<TranslatedLocale, ItemLocaleProfile> = {
  ru: {
    typeNames: {weapons: "оружие", vehicles: "транспорт", ammo: "боеприпасы", attachments: "модификация", gear: "экипировка", equipment: "тактическое оборудование", loadouts: "комплект"},
    status: {official: "Официально", "verified-in-game": "Проверено в игре", "pre-release-build": "Предрелизная сборка", "community-report": "Сообщение сообщества"},
    buildPrefix: "Проверено для сборки",
    summary: (item, typeName) => `${item.name} — это ${typeName} в WARDOGS. Страница объединяет подтвержденную роль, практическое применение, ограничения сборки и источники, не выдавая данные Alpha за окончательные характеристики раннего доступа.`,
    description: (item, typeName) => `${item.name} рассматривается как ${typeName} для больших трехсторонних боев WARDOGS. Здесь отделены наблюдения из официальных материалов и записей авторов от неподтвержденных значений урона, цены, прочности и разблокировки. Используйте руководство для выбора роли и бюджета, а перед покупкой или изменением комплекта сверяйте текущую сборку игры.`,
    role: (item, typeName) => `Выбирайте ${item.name}, когда отряду действительно требуется эта категория: ${typeName}. Сначала определите задачу, маршрут, доступный бюджет и поддержку союзников, затем оцените риск потери. Эффективность зависит не только от модели, но и от связи, снабжения, позиции и способности команды продолжить давление на Control Zone.`,
    strengths: (item) => [`${item.name} дает отряду понятный инструмент для заранее выбранной задачи и облегчает распределение ролей.`, `Сохраненные данные позволяют сравнить модель с соседними вариантами без предположений о финальном балансе.`, `Страница связывает предмет с экономикой, логистикой и командными действиями, а не оценивает его только по одному числу.`, `Источники и дата проверки помогают понять, к какой сборке относится наблюдение.`],
    cautions: (item) => [`Характеристики ${item.name}, цена, доступность и условия разблокировки могут измениться до или после раннего доступа.`, `Наблюдение в видеозаписи не подтверждает скрытые параметры, полный урон, броню, вместимость или серверные настройки.`, `Дорогой или специализированный выбор быстро теряет ценность без боеприпасов, ремонта, транспорта, связи и безопасного маршрута.`, `Проверяйте Steam и официальные заметки WARDOGS после каждого крупного обновления.`],
    confirmed: (item, typeName) => [`Модель: ${item.name}; категория: ${typeName}.`, `Статус доказательства: ${item.statusLabel}; исходная проверка: ${item.build}.`, `На странице сохранены наблюдаемые значения и ссылки на материалы, в которых предмет был показан.`],
    unconfirmed: (item) => [`Окончательные параметры ${item.name} для раннего доступа и полной версии не подтверждены.`, `Текущая цена, баланс, прогресс и доступность могут отличаться от предрелизной сборки.`, `Не следует считать отсутствие данных доказательством отсутствия функции или будущего изменения.`],
    imageAlt: (item, typeName) => `${item.name}, ${typeName} в WARDOGS`
  },
  de: {
    typeNames: {weapons: "Waffe", vehicles: "Fahrzeug", ammo: "Munition", attachments: "Aufsatz", gear: "Ausrüstung", equipment: "taktisches Gerät", loadouts: "Loadout"},
    status: {official: "Offiziell", "verified-in-game": "Im Spiel bestätigt", "pre-release-build": "Vorabversion", "community-report": "Community-Bericht"},
    buildPrefix: "Geprüft für den Stand",
    summary: (item, typeName) => `${item.name} ist ein ${typeName} in WARDOGS. Diese Seite bündelt die bestätigte Rolle, den praktischen Einsatz, versionsabhängige Grenzen und Quellen, ohne Alpha-Werte als endgültige Early-Access-Daten darzustellen.`,
    description: (item, typeName) => `${item.name} wird als ${typeName} für die großen Drei-Team-Gefechte von WARDOGS eingeordnet. Die Analyse trennt Beobachtungen aus offiziellen Materialien und Creator-Aufnahmen von unbestätigten Werten zu Schaden, Preis, Haltbarkeit und Freischaltung. Nutze den Guide für Rollen- und Budgetentscheidungen und prüfe bei Kauf oder Loadout-Wechsel immer den aktuellen Spielstand.`,
    role: (item, typeName) => `Wähle ${item.name}, wenn der Trupp diese Kategorie wirklich benötigt: ${typeName}. Kläre zuerst Aufgabe, Route, Budget und Unterstützung, bevor du das Verlustrisiko akzeptierst. Die Wirkung hängt nicht nur vom Modell ab, sondern auch von Kommunikation, Versorgung, Positionierung und dem gemeinsamen Druck auf die Control Zone.`,
    strengths: (item) => [`${item.name} gibt dem Trupp ein klar zugeordnetes Werkzeug für eine vorher festgelegte Aufgabe.`, `Beobachtete Daten erlauben einen Vergleich mit ähnlichen Optionen, ohne endgültige Balancewerte zu erfinden.`, `Der Guide verbindet den Gegenstand mit Wirtschaft, Logistik und Teamspiel statt nur mit einer einzelnen Statistik.`, `Quellen und Prüfdatum zeigen transparent, aus welcher Version die Aussage stammt.`],
    cautions: (item) => [`Werte, Preis, Verfügbarkeit und Freischaltung von ${item.name} können sich vor oder während des Early Access ändern.`, `Eine Aufnahme bestätigt keine versteckten Werte, vollständigen Schadensmodelle, Panzerung, Kapazität oder Serverregeln.`, `Eine teure oder spezialisierte Wahl verliert ohne Munition, Reparatur, Transport, Kommunikation und sicheren Weg schnell ihren Nutzen.`, `Prüfe Steam und offizielle WARDOGS-Patchnotes nach jedem größeren Update.`],
    confirmed: (item, typeName) => [`Modell: ${item.name}; Kategorie: ${typeName}.`, `Belegstatus: ${item.statusLabel}; ursprünglicher Prüfstand: ${item.build}.`, `Die Seite bewahrt beobachtbare Werte und verlinkt die Materialien, in denen der Gegenstand zu sehen ist.`],
    unconfirmed: (item) => [`Die endgültigen Werte von ${item.name} für Early Access und Vollversion sind nicht bestätigt.`, `Preis, Balance, Fortschritt und Verfügbarkeit können von der Vorabversion abweichen.`, `Fehlende Daten beweisen weder das Fehlen einer Funktion noch eine geplante Änderung.`],
    imageAlt: (item, typeName) => `${item.name}, ${typeName} in WARDOGS`
  },
  "pt-br": {
    typeNames: {weapons: "arma", vehicles: "veículo", ammo: "munição", attachments: "acessório", gear: "equipamento pessoal", equipment: "equipamento tático", loadouts: "kit"},
    status: {official: "Oficial", "verified-in-game": "Verificado no jogo", "pre-release-build": "Build de pré-lançamento", "community-report": "Relato da comunidade"},
    buildPrefix: "Verificado para a build",
    summary: (item, typeName) => `${item.name} é um item da categoria ${typeName} em WARDOGS. Esta página reúne função confirmada, uso prático, limites da build e fontes sem tratar valores do Alpha como estatísticas finais do Acesso Antecipado.`,
    description: (item, typeName) => `${item.name} é analisado como ${typeName} para as grandes batalhas entre três equipes de WARDOGS. O texto separa observações de materiais oficiais e vídeos de criadores de números não confirmados sobre dano, preço, resistência e desbloqueio. Use o guia para decidir função e orçamento e confira sempre a build atual antes de comprar ou mudar o kit.`,
    role: (item, typeName) => `Escolha ${item.name} quando o esquadrão realmente precisar desta categoria: ${typeName}. Defina primeiro objetivo, rota, orçamento e apoio disponível antes de aceitar o risco da perda. O resultado depende do modelo, mas também de comunicação, suprimento, posicionamento e capacidade de manter pressão sobre a Zona de Controle.`,
    strengths: (item) => [`${item.name} oferece ao esquadrão uma ferramenta clara para uma tarefa definida antes da compra.`, `Os dados observados permitem comparar opções próximas sem inventar o balanceamento final.`, `O guia relaciona o item à economia, à logística e ao jogo em equipe, em vez de usar apenas um número isolado.`, `Fontes e data de verificação deixam claro a qual build cada observação pertence.`],
    cautions: (item) => [`Atributos, preço, disponibilidade e requisito de ${item.name} podem mudar antes ou durante o Acesso Antecipado.`, `Um vídeo não confirma valores ocultos, dano completo, blindagem, capacidade ou configuração do servidor.`, `Uma escolha cara ou especializada perde valor sem munição, reparo, transporte, comunicação e uma rota segura.`, `Confira a Steam e as notas oficiais de WARDOGS depois de cada atualização importante.`],
    confirmed: (item, typeName) => [`Modelo: ${item.name}; categoria: ${typeName}.`, `Status da evidência: ${item.statusLabel}; verificação original: ${item.build}.`, `A página preserva valores observáveis e links para os materiais em que o item apareceu.`],
    unconfirmed: (item) => [`Os valores finais de ${item.name} para o Acesso Antecipado e a versão completa não foram confirmados.`, `Preço, balanceamento, progressão e disponibilidade atuais podem ser diferentes da build de pré-lançamento.`, `A ausência de dados não prova que uma função não existe nem que uma mudança está planejada.`],
    imageAlt: (item, typeName) => `${item.name}, ${typeName} em WARDOGS`
  },
  ja: {
    typeNames: {weapons: "武器", vehicles: "車両", ammo: "弾薬", attachments: "アタッチメント", gear: "個人装備", equipment: "特殊装備", loadouts: "ロードアウト"},
    status: {official: "公式", "verified-in-game": "ゲーム内確認済み", "pre-release-build": "発売前ビルド", "community-report": "コミュニティ報告"},
    buildPrefix: "確認対象ビルド",
    summary: (item, typeName) => `${item.name}はWARDOGSの${typeName}です。このページでは、確認された役割、実戦での使い方、ビルド依存の制限、情報源をまとめ、アルファ版の数値を早期アクセス版の最終仕様として扱わないよう整理しています。`,
    description: (item, typeName) => `${item.name}を、WARDOGSの大規模な3チーム戦で使う${typeName}として分析します。公式資料やクリエイター映像で観察できる内容と、ダメージ、価格、耐久性、解除条件などの未確認情報を分離しています。役割と予算を決めるための資料として使い、購入や装備変更の前には必ず現在のゲームビルドを確認してください。`,
    role: (item, typeName) => `分隊が${typeName}を必要としている場面で${item.name}を選びます。任務、進入ルート、予算、味方の支援を先に確認し、失った場合の損失まで考えてください。性能はモデルだけで決まらず、通信、補給、位置取り、コントロールゾーンへ圧力を継続できるかによって大きく変わります。`,
    strengths: (item) => [`${item.name}は、購入前に決めた任務へ分隊の役割を合わせやすくする明確な選択肢です。`, `観察済みデータを使って近い候補と比較でき、未発表の最終バランスを作り上げずに判断できます。`, `単独の数値だけでなく、資金経済、兵站、連携との関係からこのアイテムを評価しています。`, `情報源と確認日を表示するため、どのビルドに基づく説明かを追跡できます。`],
    cautions: (item) => [`${item.name}の性能、価格、入手方法、解除条件は、早期アクセスの前後で変更される可能性があります。`, `映像だけでは、非表示パラメータ、完全なダメージ、装甲、容量、サーバー設定までは確認できません。`, `高価または専門的な装備は、弾薬、修理、輸送、通信、安全なルートがなければ価値を失います。`, `大きなアップデート後はSteamとWARDOGS公式パッチノートを再確認してください。`],
    confirmed: (item, typeName) => [`モデル名: ${item.name}。カテゴリー: ${typeName}。`, `証拠の状態: ${item.statusLabel}。元データの確認対象: ${item.build}。`, `このページは観察可能な値と、アイテムが確認できる映像・公式資料へのリンクを保持しています。`],
    unconfirmed: (item) => [`${item.name}の早期アクセス版および正式版における最終性能は確認されていません。`, `現在の価格、バランス、進行条件、入手可否は発売前ビルドと異なる可能性があります。`, `情報がないことは、機能が存在しないことや将来の変更予定を証明するものではありません。`],
    imageAlt: (item, typeName) => `WARDOGSの${typeName}、${item.name}`
  },
  "zh-cn": {
    typeNames: {weapons: "武器", vehicles: "载具", ammo: "弹药", attachments: "配件", gear: "个人装备", equipment: "战术装备", loadouts: "配装"},
    status: {official: "官方信息", "verified-in-game": "游戏内已验证", "pre-release-build": "预发布版本", "community-report": "社区报告"},
    buildPrefix: "验证版本",
    summary: (item, typeName) => `${item.name} 是 WARDOGS 中的${typeName}。本页汇总已确认的定位、实战用法、版本限制和来源，不会把 Alpha 测试数据当作抢先体验版的最终数值。`,
    description: (item, typeName) => `${item.name} 按 WARDOGS 三方大规模战斗中的${typeName}进行分析。正文区分官方资料、创作者实机画面中可直接观察的事实，以及伤害、价格、耐久和解锁条件等尚未确认的数值。可用它规划职责和预算，但购买或更换配装前仍应核对当前游戏版本。`,
    role: (item, typeName) => `当小队确实需要${typeName}时再选择 ${item.name}。先确认任务、路线、预算和队友支援，再评估损失风险。它的效果不仅取决于型号，还取决于沟通、补给、站位以及持续向控制区施压的能力。`,
    strengths: (item) => [`${item.name} 能为预先确定的任务提供清晰工具，方便小队分工。`, `已观察数据可用于比较相邻选项，无需编造最终平衡数值。`, `本页从经济、后勤和团队协作评估该物品，而不是只看单一数字。`, `来源和核查日期说明每项结论对应的游戏版本。`],
    cautions: (item) => [`${item.name} 的属性、价格、可用性和解锁条件可能在抢先体验前后调整。`, `单段视频不能确认隐藏参数、完整伤害模型、装甲、容量或服务器规则。`, `昂贵或专业化的选择如果缺少弹药、维修、运输、沟通和安全路线，会迅速失去价值。`, `每次重大更新后请重新核对 Steam 页面和 WARDOGS 官方公告。`],
    confirmed: (item, typeName) => [`型号：${item.name}；类别：${typeName}。`, `证据状态：${item.statusLabel}；原始核查版本：${item.build}。`, `本页保留可观察数据，并链接展示该物品的官方资料或实机内容。`],
    unconfirmed: (item) => [`${item.name} 在抢先体验版和正式版中的最终属性尚未确认。`, `当前价格、平衡、进度条件和可用性可能与预发布版本不同。`, `缺少数据不代表某项功能不存在，也不代表官方计划进行某种改动。`],
    imageAlt: (item, typeName) => `WARDOGS ${typeName} ${item.name}`
  }
};

const localizedTerms: Record<string, Partial<Record<TranslatedLocale, string>>> = {
  "Alpha price": {ru:"Цена в Alpha", de:"Alpha-Preis", "pt-br":"Preço no Alpha", ja:"アルファ価格"},
  "Closed Beta price": {ru:"Цена в закрытой бете", de:"Closed-Beta-Preis", "pt-br":"Preço no Beta Fechado", ja:"クローズドベータ価格"},
  "Assault rifle": {ru:"Штурмовая винтовка", de:"Sturmgewehr", "pt-br":"Fuzil de assalto", ja:"アサルトライフル"},
  SMG: {ru:"Пистолет-пулемёт", de:"Maschinenpistole", "pt-br":"Submetralhadora", ja:"サブマシンガン"},
  "Marksman rifle": {ru:"Марксманская винтовка", de:"Präzisionsgewehr", "pt-br":"Fuzil de precisão", ja:"マークスマンライフル"},
  Bow: {ru:"Лук", de:"Bogen", "pt-br":"Arco", ja:"弓"},
  Sidearm: {ru:"Пистолет", de:"Seitenwaffe", "pt-br":"Arma secundária", ja:"サイドアーム"},
  Shotgun: {ru:"Дробовик", de:"Schrotflinte", "pt-br":"Escopeta", ja:"ショットガン"},
  LMG: {ru:"Ручной пулемёт", de:"Leichtes Maschinengewehr", "pt-br":"Metralhadora leve", ja:"軽機関銃"},
  "Sniper rifle": {ru:"Снайперская винтовка", de:"Scharfschützengewehr", "pt-br":"Fuzil de precisão de longo alcance", ja:"スナイパーライフル"},
  Launcher: {ru:"Пусковая установка", de:"Werfer", "pt-br":"Lançador", ja:"ランチャー"},
  "Stationary support": {ru:"Стационарная поддержка", de:"Stationäre Unterstützung", "pt-br":"Suporte estacionário", ja:"固定式支援装備"},
  "Stationary anti-air": {ru:"Стационарная ПВО", de:"Stationäre Flugabwehr", "pt-br":"Defesa antiaérea estacionária", ja:"固定式対空装備"},
  "Stationary artillery": {ru:"Стационарная артиллерия", de:"Stationäre Artillerie", "pt-br":"Artilharia estacionária", ja:"固定式砲兵装備"},
  "Stationary defense": {ru:"Стационарная оборона", de:"Stationäre Verteidigung", "pt-br":"Defesa estacionária", ja:"固定式防衛装備"},
  "Stationary weapon": {ru:"Стационарное оружие", de:"Stationäre Waffe", "pt-br":"Arma estacionária", ja:"固定式兵器"},
  "Anti-air launcher": {ru:"Зенитная пусковая установка", de:"Flugabwehrwerfer", "pt-br":"Lançador antiaéreo", ja:"対空ランチャー"},
  "Anti-vehicle launcher": {ru:"Противотранспортная пусковая установка", de:"Panzerabwehrwerfer", "pt-br":"Lançador antiveículo", ja:"対車両ランチャー"},
  "Grenade launcher": {ru:"Гранатомёт", de:"Granatwerfer", "pt-br":"Lança-granadas", ja:"グレネードランチャー"},
  Ammunition: {ru:"Боеприпасы", de:"Munition", "pt-br":"Munição", ja:"弾薬"},
  "Fire modes": {ru:"Режимы огня", de:"Feuermodi", "pt-br":"Modos de disparo", ja:"射撃モード"},
  Weight: {ru:"Вес", de:"Gewicht", "pt-br":"Peso", ja:"重量"},
  Progression: {ru:"Прогресс", de:"Fortschritt", "pt-br":"Progressão", ja:"進行系統"},
  Role: {ru:"Роль", de:"Rolle", "pt-br":"Função", ja:"役割"},
  "Observed gate": {ru:"Условие доступа", de:"Beobachtete Freischaltung", "pt-br":"Requisito observado", ja:"確認済み解除条件"},
  "Observed crew": {ru:"Наблюдаемый экипаж", de:"Beobachtete Besatzung", "pt-br":"Tripulação observada", ja:"確認済み乗員"},
  "Observed shell": {ru:"Наблюдаемый снаряд", de:"Beobachtetes Geschoss", "pt-br":"Projétil observado", ja:"確認済み砲弾"},
  "Observed setup": {ru:"Наблюдаемая подготовка", de:"Beobachtete Einrichtung", "pt-br":"Preparação observada", ja:"確認済み準備"},
  Track: {ru:"Ветка", de:"Fortschrittszweig", "pt-br":"Trilha", ja:"進行ルート"},
  "Combat role": {ru:"Боевая роль", de:"Kampfrolle", "pt-br":"Função de combate", ja:"戦闘での役割"},
  "Best targets": {ru:"Лучшие цели", de:"Geeignete Ziele", "pt-br":"Melhores alvos", ja:"主な目標"},
  "Key support": {ru:"Необходимая поддержка", de:"Wichtige Unterstützung", "pt-br":"Suporte necessário", ja:"必要な支援"},
  "Final balance": {ru:"Финальный баланс", de:"Endgültige Balance", "pt-br":"Balanceamento final", ja:"最終バランス"},
  "System role": {ru:"Системная роль", de:"Systemrolle", "pt-br":"Função no sistema", ja:"システム上の役割"},
  "Placement needs": {ru:"Условия размещения", de:"Anforderungen an die Platzierung", "pt-br":"Requisitos de posicionamento", ja:"配置条件"},
  "Team dependency": {ru:"Зависимость от команды", de:"Teamabhängigkeit", "pt-br":"Dependência da equipe", ja:"チーム依存度"},
  "Final upgrade list": {ru:"Финальный список улучшений", de:"Endgültige Ausbauliste", "pt-br":"Lista final de melhorias", ja:"最終強化一覧"},
  "Vehicle role": {ru:"Роль транспорта", de:"Fahrzeugrolle", "pt-br":"Função do veículo", ja:"車両の役割"},
  "Best use": {ru:"Лучшее применение", de:"Bester Einsatz", "pt-br":"Melhor uso", ja:"主な用途"},
  "Main risk": {ru:"Главный риск", de:"Hauptrisiko", "pt-br":"Principal risco", ja:"主なリスク"},
  "Final loadout": {ru:"Финальный комплект", de:"Endgültiges Loadout", "pt-br":"Kit final", ja:"最終ロードアウト"},
  "Best support": {ru:"Лучшая поддержка", de:"Beste Unterstützung", "pt-br":"Melhor suporte", ja:"最適な支援"},
  "Final stats": {ru:"Финальные характеристики", de:"Endgültige Werte", "pt-br":"Atributos finais", ja:"最終性能"},
  "Natural counter": {ru:"Естественная контрмера", de:"Direkte Gegenmaßnahme", "pt-br":"Contramedida natural", ja:"主な対抗手段"},
  "Final weapons": {ru:"Финальное вооружение", de:"Endgültige Bewaffnung", "pt-br":"Armamento final", ja:"最終武装"},
  "Final capacity": {ru:"Финальная вместимость", de:"Endgültige Kapazität", "pt-br":"Capacidade final", ja:"最終収容力"},
  "Not captured": {ru:"Не зафиксировано", de:"Nicht erfasst", "pt-br":"Não registrado", ja:"未記録"},
  "Not confirmed": {ru:"Не подтверждено", de:"Nicht bestätigt", "pt-br":"Não confirmado", ja:"未確認"},
  "Gate unread": {ru:"Условие не читается", de:"Freischaltung unlesbar", "pt-br":"Requisito ilegível", ja:"解除条件を判読できず"},
  "Open purchase": {ru:"Свободная покупка", de:"Frei kaufbar", "pt-br":"Compra livre", ja:"自由購入"},
  "Assault XP": {ru:"Опыт штурмовика", de:"Sturm-XP", "pt-br":"XP de assalto", ja:"アサルトXP"},
  "Medic XP": {ru:"Опыт медика", de:"Sanitäter-XP", "pt-br":"XP de médico", ja:"メディックXP"},
  "Support XP": {ru:"Опыт поддержки", de:"Unterstützungs-XP", "pt-br":"XP de suporte", ja:"サポートXP"},
  "Recon XP": {ru:"Опыт разведчика", de:"Aufklärungs-XP", "pt-br":"XP de reconhecimento", ja:"偵察XP"},
  Driver: {ru:"Водитель", de:"Fahrer", "pt-br":"Motorista", ja:"ドライバー"},
  Pilot: {ru:"Пилот", de:"Pilot", "pt-br":"Piloto", ja:"パイロット"},
  Wardog: {ru:"Боец", de:"Wardog", "pt-br":"Wardog", ja:"WARDOG"},
  "Semi / Full Auto": {ru:"Одиночный / автоматический", de:"Einzelfeuer / Vollautomatik", "pt-br":"Semiautomático / automático", ja:"セミ / フルオート"},
  "Semi / Burst": {ru:"Одиночный / очередь", de:"Einzelfeuer / Feuerstoß", "pt-br":"Semiautomático / rajada", ja:"セミ / バースト"},
  "Bolt-action / Magazine": {ru:"Скользящий затвор / магазин", de:"Repetierer / Magazin", "pt-br":"Ferrolho / carregador", ja:"ボルトアクション / マガジン"},
  "Indirect fire pressure": {ru:"Давление непрямым огнем", de:"Druck durch indirektes Feuer", "pt-br":"Pressão com fogo indireto", ja:"間接射撃による圧力"},
  "Self-propelled artillery": {ru:"Самоходная артиллерия", de:"Selbstfahrartillerie", "pt-br":"Artilharia autopropulsada", ja:"自走砲"},
  "Driver / gunner / top gunner": {ru:"Водитель / наводчик / верхний стрелок", de:"Fahrer / Richtschütze / Dachschütze", "pt-br":"Motorista / artilheiro / atirador superior", ja:"ドライバー / 主砲手 / 上部銃手"},
  "155 mm high explosive": {ru:"155-мм осколочно-фугасный", de:"155-mm-Sprenggeschoss", "pt-br":"Alto explosivo de 155 mm", ja:"155 mm榴弾"},
  "Stabilize before firing": {ru:"Стабилизировать перед выстрелом", de:"Vor dem Schuss stabilisieren", "pt-br":"Estabilizar antes de disparar", ja:"射撃前に安定化"},
  "Static clusters, rooftops, towers, FOB defenses": {ru:"Скопления без движения, крыши, башни и оборона FOB", de:"Statische Gruppen, Dächer, Türme und FOB-Verteidigung", "pt-br":"Grupos parados, telhados, torres e defesas de FOB", ja:"停止した集団、屋上、タワー、FOB防衛"},
  "Spotting, distance correction, supply": {ru:"Разведка, корректировка дистанции и снабжение", de:"Aufklärung, Entfernungskorrektur und Versorgung", "pt-br":"Marcação, correção de distância e suprimento", ja:"索敵、距離修正、補給"},
  "Forward logistics and defense point": {ru:"Передовой пункт логистики и обороны", de:"Vorgeschobener Logistik- und Verteidigungspunkt", "pt-br":"Ponto avançado de logística e defesa", ja:"前線の兵站・防衛拠点"},
  "Terrain, cover, delivery room, route access": {ru:"Рельеф, укрытие, место для доставки и доступ к маршруту", de:"Gelände, Deckung, Lieferfläche und Routenzugang", "pt-br":"Terreno, cobertura, espaço de entrega e acesso à rota", ja:"地形、遮蔽物、配送スペース、ルート接続"},
  "Requires supplies and defense": {ru:"Требует снабжения и защиты", de:"Benötigt Versorgung und Verteidigung", "pt-br":"Exige suprimento e defesa", ja:"補給と防衛が必要"},
  "Light air mobility": {ru:"Легкая воздушная мобильность", de:"Leichte Luftmobilität", "pt-br":"Mobilidade aérea leve", ja:"軽航空機動"},
  "Scouting, insertion, fast rotation": {ru:"Разведка, высадка и быстрая ротация", de:"Aufklärung, Verlegung und schnelle Rotation", "pt-br":"Reconhecimento, inserção e rotação rápida", ja:"偵察、投入、高速移動"},
  "Exposure during approach and landing": {ru:"Уязвимость при заходе и посадке", de:"Verwundbarkeit bei Anflug und Landung", "pt-br":"Exposição durante aproximação e pouso", ja:"接近・着陸時の無防備さ"},
  "Heavy armor pressure": {ru:"Давление тяжелой бронетехникой", de:"Druck durch schwere Panzerung", "pt-br":"Pressão de blindado pesado", ja:"重装甲による圧力"},
  "Infantry screen and logistics": {ru:"Пехотное прикрытие и логистика", de:"Infanterieschutz und Logistik", "pt-br":"Proteção de infantaria e logística", ja:"歩兵護衛と兵站"},
  "Isolation from the team": {ru:"Отрыв от команды", de:"Trennung vom Team", "pt-br":"Isolamento da equipe", ja:"チームからの孤立"},
  "Air support pressure": {ru:"Давление с воздуха", de:"Druck durch Luftunterstützung", "pt-br":"Pressão de apoio aéreo", ja:"航空支援による圧力"},
  "Anti-air coverage and pressure": {ru:"Противовоздушное прикрытие и давление", de:"Flugabwehrdeckung und Druck", "pt-br":"Cobertura antiaérea e pressão", ja:"対空援護と圧力"},
  "Exposed movement and clustered fights": {ru:"Открытые перемещения и плотные бои", de:"Offene Bewegungen und konzentrierte Kämpfe", "pt-br":"Movimento exposto e combates concentrados", ja:"露出した移動と密集戦"},
  "Protected transport": {ru:"Защищенный транспорт", de:"Geschützter Transport", "pt-br":"Transporte protegido", ja:"防護輸送"},
  "Squad movement and supply support": {ru:"Перемещение отряда и поддержка снабжения", de:"Truppbewegung und Versorgungsunterstützung", "pt-br":"Movimento do esquadrão e apoio de suprimento", ja:"分隊移動と補給支援"},
  "Predictable routes": {ru:"Предсказуемые маршруты", de:"Vorhersehbare Routen", "pt-br":"Rotas previsíveis", ja:"予測されやすいルート"}
};

const chineseTerms: Record<string, string> = {
  "Alpha price":"Alpha 测试价格", "Closed Beta price":"封闭测试价格", "Assault rifle":"突击步枪", SMG:"冲锋枪", "Marksman rifle":"精确射手步枪", "Sniper rifle":"狙击步枪", Bow:"弓", Sidearm:"副武器", Shotgun:"霰弹枪", LMG:"轻机枪", Launcher:"发射器",
  Ammunition:"弹药", "Fire modes":"射击模式", Weight:"重量", Progression:"进度", Role:"定位", "Observed gate":"已观察解锁条件", "Observed crew":"已观察乘员", "Observed shell":"已观察弹种", "Observed setup":"已观察部署方式", Track:"进度路线", "Combat role":"战斗定位", "Vehicle class":"载具类别", "Aircraft class":"飞行器类别", "Build role":"建造定位",
  "Base damage":"基础伤害", Loads:"弹种", "Standard per round":"标准单发价格", "Box price":"弹药箱价格", Weapons:"适用武器", Kind:"类型", "Zoom or capacity":"倍率或容量", "Weight or calibre":"重量或口径", Slot:"栏位", Tier:"等级", "Recorded identifier":"已记录标识", "Spending rule":"花费原则", "Best use":"最佳用途", "Main risk":"主要风险", "Not captured":"未记录", "Gate unread":"解锁条件无法辨认", "Open purchase":"可直接购买", Variable:"可变", fixed:"固定",
  "Semi / Full Auto":"半自动 / 全自动", "Semi / Burst":"半自动 / 点射", "Semi automatic":"半自动", "Break-action":"折开式", "Single-shot":"单发", "Bolt action":"栓动", "Bolt-action / Magazine":"栓动 / 弹匣", "Pull and Release":"拉弓并释放", "Assault XP":"突击经验", "Medic XP":"医疗经验", "Support XP":"支援经验", "Recon XP":"侦察经验", "Driver XP":"驾驶经验", "Pilot XP":"飞行经验",
  Driver:"驾驶员", Pilot:"飞行员", Wardog:"战士", Optic:"瞄具", Magazine:"弹匣", Helmet:"头盔", Armor:"护甲", Backpack:"背包", Special:"特殊", Lightest:"最轻", Offensive:"进攻", Medical:"医疗", Recon:"侦察", Building:"建造", Utility:"通用", "Building / Offensive":"建造 / 进攻",
  "Light transport":"轻型运输", "Fast transport":"快速运输", "Utility transport":"通用运输", "Cargo transport":"货运载具", "Protected transport":"防护运输", "Armed transport":"武装运输", "Heavy armed transport":"重型武装运输", "Logistics truck":"后勤卡车", "Protected logistics":"防护后勤", "Armed logistics":"武装后勤", "Anti-air armor":"防空装甲载具", "Main battle tank":"主战坦克", "Self-propelled artillery":"自行火炮", "Combat helicopter":"战斗直升机", "Armed utility helicopter":"武装通用直升机", "Rocket helicopter":"火箭直升机", "Attack helicopter":"攻击直升机", "Light air transport":"轻型空运", "Air transport":"空中运输"
};

function translateItemTerm(value: string, locale: TranslatedLocale): string {
  if (locale === "zh-cn") return chineseTerms[value] ?? value;
  const direct = localizedTerms[value]?.[locale];
  if (direct) return direct;

  const level = value.match(/^(Driver|Pilot|Wardog) Level (\d+)$/);
  if (level) {
    const role = localizedTerms[level[1]]?.[locale] ?? level[1];
    return locale === "ja" ? `${role}レベル${level[2]}` : `${role} ${locale === "ru" ? "уровня" : locale === "de" ? "Stufe" : "nível"} ${level[2]}`;
  }

  const unlock = value.match(/^(\$[\d,]+) unlock$/);
  if (unlock) {
    return locale === "ru" ? `Разблокировка за ${unlock[1]}`
      : locale === "de" ? `Freischaltung für ${unlock[1]}`
      : locale === "pt-br" ? `Desbloqueio por ${unlock[1]}`
      : `${unlock[1]}で解除`;
  }
  return value;
}

function localizeBuild(build: string, locale: TranslatedLocale, prefix: string): string {
  if (build === "Alpha 1 - 7 Aug 2026") {
    return locale === "ru" ? "Alpha 1 — 7 августа 2026"
      : locale === "de" ? "Alpha 1 — 7. August 2026"
      : locale === "pt-br" ? "Alpha 1 — 7 de agosto de 2026"
      : "Alpha 1 — 2026年8月7日";
  }
  if (build === "Closed Beta - 21-23 Aug 2026") {
    return locale === "ru" ? "Закрытая бета — 21–23 августа 2026"
      : locale === "de" ? "Closed Beta — 21.–23. August 2026"
      : locale === "pt-br" ? "Beta Fechado — 21–23 de agosto de 2026"
      : "クローズドベータ — 2026年8月21日～23日";
  }
  if (build === "Creator footage checked 2026-08-16") {
    return locale === "ru" ? "Видео автора проверено 16 августа 2026"
      : locale === "de" ? "Creator-Aufnahme geprüft am 16. August 2026"
      : locale === "pt-br" ? "Vídeo do criador verificado em 16 de agosto de 2026"
      : "クリエイター映像を2026年8月16日に確認";
  }
  if (build === "Creator footage checked 2026-08-25") {
    return locale === "ru" ? "Видео автора проверено 25 августа 2026"
      : locale === "de" ? "Creator-Aufnahme geprüft am 25. August 2026"
      : locale === "pt-br" ? "Vídeo do criador verificado em 25 de agosto de 2026"
      : "クリエイター映像を2026年8月25日に確認";
  }
  return `${prefix}: ${build}`;
}

export function getLocalizedItem(item: WardogsItem, locale: Locale): WardogsItem {
  if (locale === "en") return item;
  const profile = profiles[locale];
  const typeName = profile.typeNames[item.type];
  const translatedSubtype = translateItemTerm(item.subtype, locale);
  return {
    ...item,
    subtype: translatedSubtype === item.subtype ? typeName : translatedSubtype,
    statusLabel: profile.status[item.status],
    build: localizeBuild(item.build, locale, profile.buildPrefix),
    summary: profile.summary(item, typeName),
    description: profile.description(item, typeName),
    role: profile.role(item, typeName),
    strengths: profile.strengths(item, typeName),
    cautions: profile.cautions(item, typeName),
    facts: item.facts.map((fact) => ({
      ...fact,
      label: translateItemTerm(fact.label, locale),
      value: translateItemTerm(fact.value, locale)
    })),
    observedProgressionOrGate: item.observedProgressionOrGate ? translateItemTerm(item.observedProgressionOrGate, locale) : item.observedProgressionOrGate,
    observedAmmoOrVehicleClass: item.observedAmmoOrVehicleClass ? translateItemTerm(item.observedAmmoOrVehicleClass, locale) : item.observedAmmoOrVehicleClass,
    confirmedFacts: profile.confirmed(item, typeName),
    unconfirmedFacts: profile.unconfirmed(item, typeName),
    detailImageAlt: item.detailImage ? profile.imageAlt(item, typeName) : item.detailImageAlt,
    imageAlt: item.image ? profile.imageAlt(item, typeName) : item.imageAlt
  };
}

export function getLocalizedItemType(itemType: ItemType, locale: Locale): ItemType {
  if (locale === "en") return itemType;
  const profile = profiles[locale];
  const label = profile.typeNames[itemType.id];
  return {
    ...itemType,
    label,
    description: profile.description({name: `WARDOGS ${label}`} as WardogsItem, label),
    imageAlt: `WARDOGS ${label}`
  };
}
