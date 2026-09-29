import type {Locale} from "@/config/site";
import type {ItemType, ItemTypeId, WardogsItem} from "./item-library";
import {localizeItemProseZhTw} from "./item-prose.zh-tw";
import {localizeItemProsePl} from "./item-prose.pl";

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
    typeNames: {weapons: "оружие", vehicles: "транспорт", ammo: "боеприпасы", attachments: "модификация", gear: "экипировка", equipment: "тактическое оборудование", medical: "медицинское оснащение", supplies: "снабжение", deployables: "развёртываемые объекты", mechanics: "игровая механика", loadouts: "комплект"},
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
    typeNames: {weapons: "Waffe", vehicles: "Fahrzeug", ammo: "Munition", attachments: "Aufsatz", gear: "Ausrüstung", equipment: "taktisches Gerät", medical: "Medizin", supplies: "Versorgung", deployables: "platzierbare Systeme", mechanics: "Spielmechanik", loadouts: "Loadout"},
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
    typeNames: {weapons: "arma", vehicles: "veículo", ammo: "munição", attachments: "acessório", gear: "equipamento pessoal", equipment: "equipamento tático", medical: "equipamento médico", supplies: "suprimentos", deployables: "itens posicionáveis", mechanics: "mecânica", loadouts: "kit"},
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
    typeNames: {weapons: "武器", vehicles: "車両", ammo: "弾薬", attachments: "アタッチメント", gear: "個人装備", equipment: "特殊装備", medical: "医療装備", supplies: "補給物資", deployables: "設置物", mechanics: "ゲームシステム", loadouts: "ロードアウト"},
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
    typeNames: {weapons: "武器", vehicles: "载具", ammo: "弹药", attachments: "配件", gear: "个人装备", equipment: "战术装备", medical: "医疗物品", supplies: "补给物资", deployables: "部署物", mechanics: "玩法机制", loadouts: "配装"},
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
  },

  pl: {
  typeNames: {weapons:"broń",vehicles:"pojazdy",ammo:"amunicja",attachments:"dodatki",gear:"wyposażenie osobiste",equipment:"sprzęt taktyczny",medical:"przedmioty medyczne",supplies:"zaopatrzenie",deployables:"obiekty do rozmieszczenia",mechanics:"mechaniki gry",loadouts:"zestawy wyposażenia"},
  status: {official:"Informacje oficjalne","verified-in-game":"Sprawdzone w grze","pre-release-build":"Wersja przedpremierowa","community-report":"Relacja społeczności"},
  buildPrefix: "Sprawdzona wersja",
  summary: (item,typeName) => `${item.name} w WARDOGS należy do kategorii „${typeName}”. Ta strona zbiera potwierdzoną rolę, praktyczne zastosowanie, ograniczenia wersji i źródła. Nie traktuje danych z alfy jako ostatecznych parametrów wczesnego dostępu.`,
  description: (item,typeName) => `Analiza ${item.name} w kategorii „${typeName}” dotyczy dużych starć trzech zespołów w WARDOGS. Oddzielamy obserwacje z materiałów oficjalnych i nagrań twórców od niepotwierdzonych obrażeń, cen, wytrzymałości i warunków odblokowania. Korzystaj z niej przy planowaniu roli i budżetu, ale przed zakupem lub zmianą wyposażenia sprawdź bieżącą wersję gry.`,
  role: (item,typeName) => `Wybierz ${item.name}, gdy oddział rzeczywiście potrzebuje kategorii „${typeName}”. Najpierw określ zadanie, trasę, budżet i dostępne wsparcie, a następnie oceń ryzyko utraty. Skuteczność zależy również od komunikacji, zaopatrzenia, pozycji i utrzymywania presji na strefę kontroli.`,
  strengths: (item) => [`${item.name} daje oddziałowi narzędzie do wcześniej wyznaczonego zadania i ułatwia podział ról.`, "Zaobserwowane dane pozwalają porównać podobne opcje bez wymyślania ostatecznego balansu.", "Ocena uwzględnia ekonomię, logistykę i współpracę, a nie tylko pojedynczą liczbę.", "Źródła i data weryfikacji wskazują wersję, której dotyczy obserwacja."],
  cautions: (item) => [`Parametry, cena, dostępność i wymagania odblokowania ${item.name} mogą zmienić się przed wczesnym dostępem lub w jego trakcie.`, "Samo nagranie nie potwierdza ukrytych parametrów, pełnego modelu obrażeń, pancerza, pojemności ani zasad serwera.", "Drogi lub wyspecjalizowany sprzęt szybko traci wartość bez amunicji, napraw, transportu, komunikacji i bezpiecznej trasy.", "Po każdej dużej aktualizacji sprawdź Steam i oficjalne komunikaty WARDOGS."],
  confirmed: (item,typeName) => [`Model: ${item.name}; kategoria: ${typeName}.`, `Stan dowodów: ${item.statusLabel}; pierwotna weryfikacja: ${item.build}.`, "Strona zachowuje zaobserwowane wartości i odsyła do materiałów, w których pokazano ten przedmiot."],
  unconfirmed: (item) => [`Ostateczne parametry ${item.name} we wczesnym dostępie i pełnej wersji nie zostały potwierdzone.`, "Bieżące ceny, balans, postępy i dostępność mogą różnić się od wersji przedpremierowej.", "Brak danych nie dowodzi braku funkcji ani planowanej zmiany."],
  imageAlt: (item,typeName) => `${item.name}, WARDOGS, kategoria: ${typeName}`
},
  "zh-tw": {
    typeNames: { weapons: "武器", vehicles: "載具", ammo: "彈藥", attachments: "配件", gear: "個人裝備", equipment: "戰術裝備", medical: "醫療物品", supplies: "補給物資", deployables: "部署物", mechanics: "玩法機制", loadouts: "配裝" },
    status: { official: "官方資訊", "verified-in-game": "遊戲內已驗證", "pre-release-build": "預釋出版本", "community-report": "社群報告" },
    buildPrefix: "驗證版本",
    summary: (item, typeName) => `${item.name} 是 WARDOGS 中的${typeName}。本頁彙總已確認的定位、實戰用法、版本限制和來源，不會把 Alpha 測試資料當作搶先體驗版的最終數值。`,
    description: (item, typeName) => `${item.name} 按 WARDOGS 三方大規模戰鬥中的${typeName}進行分析。正文區分官方資料、創作者實機畫面中可直接觀察的事實，以及傷害、價格、耐久和解鎖條件等尚未確認的數值。可用它規劃職責和預算，但購買或更換配裝前仍應核對當前遊戲版本。`,
    role: (item, typeName) => `當小隊確實需要${typeName}時再選擇 ${item.name}。先確認任務、路線、預算和隊友支援，再評估損失風險。它的效果不僅取決於型號，還取決於溝通、補給、站位以及持續向控制區施壓的能力。`,
    strengths: (item) => [`${item.name} 能為預先確定的任務提供清晰工具，方便小隊分工。`, `已觀察資料可用於比較相鄰選項，無需編造最終平衡數值。`, `本頁從經濟、後勤和團隊協作評估該物品，而不是隻看單一數字。`, `來源和核查日期說明每項結論對應的遊戲版本。`],
    cautions: (item) => [`${item.name} 的屬性、價格、可用性和解鎖條件可能在搶先體驗前後調整。`, `單段影片不能確認隱藏引數、完整傷害模型、裝甲、容量或伺服器規則。`, `昂貴或專業化的選擇如果缺少彈藥、維修、運輸、溝通和安全路線，會迅速失去價值。`, `每次重大更新後請重新核對 Steam 頁面和 WARDOGS 官方公告。`],
    confirmed: (item, typeName) => [`型號：${item.name}；類別：${typeName}。`, `證據狀態：${item.statusLabel}；原始核查版本：${item.build}。`, `本頁保留可觀察資料，並連結展示該物品的官方資料或實機內容。`],
    unconfirmed: (item) => [`${item.name} 在搶先體驗版和正式版中的最終屬性尚未確認。`, `當前價格、平衡、進度條件和可用性可能與預釋出版本不同。`, `缺少資料不代表某項功能不存在，也不代表官方計劃進行某種改動。`],
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
  "Anti-vehicle drone launcher": {ru:"пусковая установка противотранспортного дрона", de:"Startanlage für eine Anti-Fahrzeug-Drohne", "pt-br":"lançador de drone antiveículo", ja:"対車両ドローンランチャー"},
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
  "Light transport":"轻型运输", "Fast transport":"快速运输", "Utility transport":"通用运输", "Cargo transport":"货运载具", "Protected transport":"防护运输", "Armed transport":"武装运输", "Heavy armed transport":"重型武装运输", "Logistics truck":"后勤卡车", "Protected logistics":"防护后勤", "Armed logistics":"武装后勤", "Anti-air armor":"防空装甲载具", "Main battle tank":"主战坦克", "Self-propelled artillery":"自行火炮", "Combat helicopter":"战斗直升机", "Armed utility helicopter":"武装通用直升机", "Rocket helicopter":"火箭直升机", "Attack helicopter":"攻击直升机", "Light air transport":"轻型空运", "Air transport":"空中运输",
  "Best targets":"最佳目标", "Key support":"关键支援", "Final balance":"最终平衡", "System role":"系统定位", "Placement needs":"部署要求", "Team dependency":"团队依赖", "Final upgrade list":"最终升级列表", "Vehicle role":"载具定位", "Final loadout":"最终配装", "Best support":"最佳支援", "Final stats":"最终属性", "Natural counter":"主要克制方式", "Final weapons":"最终武装", "Final capacity":"最终容量", "Not confirmed":"尚未确认",
  "Indirect fire pressure":"间接火力压制", "Static clusters, rooftops, towers, FOB defenses":"固定集群、屋顶、塔楼与 FOB 防御点", "Spotting, distance correction, supply":"侦察标记、距离修正与补给", "Forward logistics and defense point":"前线后勤与防御支点", "Terrain, cover, delivery room, route access":"地形、掩体、卸货空间与路线通行条件", "Requires supplies and defense":"需要持续补给与防守", "Light air mobility":"轻型空中机动", "Scouting, insertion, fast rotation":"侦察、投送与快速转场", "Exposure during approach and landing":"接近与着陆阶段容易暴露", "Heavy armor pressure":"重装甲火力压制", "Infantry screen and logistics":"步兵掩护与后勤支援", "Isolation from the team":"脱离团队支援", "Air support pressure":"空中支援压制", "Anti-air coverage and pressure":"防空掩护与压制", "Exposed movement and clustered fights":"开阔移动与密集交战", "Squad movement and supply support":"小队运输与补给支援", "Predictable routes":"路线容易被预判",
  "Driver / gunner / top gunner":"驾驶员 / 炮手 / 顶部机枪手", "155 mm high explosive":"155 毫米高爆弹", "Stabilize before firing":"开火前需要稳定车体",
  "Anti-air launcher":"防空发射器", "Anti-vehicle launcher":"反载具发射器", "Anti-vehicle drone launcher":"反载具无人机发射器", "Grenade launcher":"榴弹发射器", "Standard Arrows":"标准箭矢", "Stationary anti-air":"固定式防空", "Stationary artillery":"固定式火炮", "Stationary defense":"固定防御设施", "Stationary support":"固定支援设备", "Stationary weapon":"固定式武器"
};

const polishTerms: Record<string,string> = {
  "Alpha price": "Cena w alfie",
  "Closed Beta price": "Cena w zamkniętej becie",
  "Assault rifle": "Karabin szturmowy",
  "SMG": "Pistolet maszynowy",
  "Marksman rifle": "Karabin wyborowy",
  "Sniper rifle": "Karabin snajperski",
  "Bow": "Łuk",
  "Sidearm": "Broń boczna",
  "Shotgun": "Strzelba",
  "LMG": "Lekki karabin maszynowy",
  "Launcher": "Wyrzutnia",
  "Ammunition": "Amunicja",
  "Fire modes": "Tryby ognia",
  "Weight": "Masa",
  "Progression": "Postępy",
  "Role": "Rola",
  "Observed gate": "Zaobserwowane wymaganie",
  "Observed crew": "Zaobserwowana załoga",
  "Observed shell": "Zaobserwowany pocisk",
  "Observed setup": "Zaobserwowane przygotowanie",
  "Track": "Ścieżka postępów",
  "Combat role": "Rola bojowa",
  "Vehicle class": "Klasa pojazdu",
  "Aircraft class": "Klasa maszyny latającej",
  "Build role": "Rola budowlana",
  "Base damage": "Bazowe obrażenia",
  "Loads": "Rodzaje nabojów",
  "Standard per round": "Cena standardowego naboju",
  "Box price": "Cena skrzynki amunicji",
  "Weapons": "Zgodna broń",
  "Kind": "Typ",
  "Zoom or capacity": "Powiększenie lub pojemność",
  "Weight or calibre": "Masa lub kaliber",
  "Slot": "Miejsce wyposażenia",
  "Tier": "Poziom",
  "Recorded identifier": "Zapisany identyfikator",
  "Spending rule": "Zasada wydatków",
  "Best use": "Najlepsze zastosowanie",
  "Main risk": "Główne ryzyko",
  "Not captured": "Nie zarejestrowano",
  "Gate unread": "Wymaganie nieczytelne",
  "Open purchase": "Zakup bez dodatkowych wymagań",
  "Variable": "Zmienna",
  "fixed": "stały",
  "Semi / Full Auto": "Ogień pojedynczy / ciągły",
  "Semi / Burst": "Ogień pojedynczy / seria",
  "Semi automatic": "Samopowtarzalna",
  "Break-action": "Łamana",
  "Single-shot": "Jednostrzałowa",
  "Bolt action": "Zamek ślizgowo-obrotowy",
  "Bolt-action / Magazine": "Zamek ślizgowo-obrotowy / magazynek",
  "Pull and Release": "Naciągnij i puść",
  "Assault XP": "XP szturmowca",
  "Medic XP": "XP medyka",
  "Support XP": "XP wsparcia",
  "Recon XP": "XP zwiadowcy",
  "Driver XP": "XP kierowcy",
  "Pilot XP": "XP pilota",
  "Driver": "Kierowca",
  "Pilot": "Pilot",
  "Wardog": "Żołnierz",
  "Optic": "Celownik",
  "Magazine": "Magazynek",
  "Helmet": "Hełm",
  "Armor": "Pancerz",
  "Backpack": "Plecak",
  "Special": "Specjalne",
  "Lightest": "Najlżejsze",
  "Offensive": "Ofensywne",
  "Medical": "Medyczne",
  "Recon": "Zwiad",
  "Building": "Budowanie",
  "Utility": "Pomocnicze",
  "Building / Offensive": "Budowanie / ofensywa",
  "Light transport": "Lekki transport",
  "Fast transport": "Szybki transport",
  "Utility transport": "Transport uniwersalny",
  "Cargo transport": "Transport ładunków",
  "Protected transport": "Transport chroniony",
  "Armed transport": "Transport uzbrojony",
  "Heavy armed transport": "Ciężki transport uzbrojony",
  "Logistics truck": "Ciężarówka logistyczna",
  "Protected logistics": "Logistyka chroniona",
  "Armed logistics": "Logistyka uzbrojona",
  "Anti-air armor": "Opancerzona obrona przeciwlotnicza",
  "Main battle tank": "Czołg podstawowy",
  "Self-propelled artillery": "Artyleria samobieżna",
  "Combat helicopter": "Śmigłowiec bojowy",
  "Armed utility helicopter": "Uzbrojony śmigłowiec wielozadaniowy",
  "Rocket helicopter": "Śmigłowiec z rakietami",
  "Attack helicopter": "Śmigłowiec szturmowy",
  "Light air transport": "Lekki transport powietrzny",
  "Air transport": "Transport powietrzny",
  "Best targets": "Najlepsze cele",
  "Key support": "Kluczowe wsparcie",
  "Final balance": "Ostateczny balans",
  "System role": "Rola systemu",
  "Placement needs": "Wymagania rozmieszczenia",
  "Team dependency": "Zależność od zespołu",
  "Final upgrade list": "Ostateczna lista ulepszeń",
  "Vehicle role": "Rola pojazdu",
  "Final loadout": "Ostateczne wyposażenie",
  "Best support": "Najlepsze wsparcie",
  "Final stats": "Ostateczne parametry",
  "Natural counter": "Główna kontra",
  "Final weapons": "Ostateczne uzbrojenie",
  "Final capacity": "Ostateczna pojemność",
  "Not confirmed": "Niepotwierdzone",
  "Indirect fire pressure": "Presja ognia pośredniego",
  "Static clusters, rooftops, towers, FOB defenses": "Nieruchome grupy, dachy, wieże i obrona FOB",
  "Spotting, distance correction, supply": "Rozpoznanie, korekta odległości i zaopatrzenie",
  "Forward logistics and defense point": "Wysunięty punkt logistyczny i obronny",
  "Terrain, cover, delivery room, route access": "Teren, osłona, miejsce rozładunku i dostęp do trasy",
  "Requires supplies and defense": "Wymaga zaopatrzenia i obrony",
  "Light air mobility": "Lekka mobilność powietrzna",
  "Scouting, insertion, fast rotation": "Zwiad, desant i szybka zmiana pozycji",
  "Exposure during approach and landing": "Narażenie podczas podejścia i lądowania",
  "Heavy armor pressure": "Presja ciężkich pojazdów opancerzonych",
  "Infantry screen and logistics": "Osłona piechoty i logistyka",
  "Isolation from the team": "Odcięcie od zespołu",
  "Air support pressure": "Presja wsparcia powietrznego",
  "Anti-air coverage and pressure": "Osłona i presja przeciwlotnicza",
  "Exposed movement and clustered fights": "Ruch na otwartym terenie i skupiska walczących",
  "Squad movement and supply support": "Przemieszczanie oddziału i wsparcie dostaw",
  "Predictable routes": "Przewidywalne trasy",
  "Driver / gunner / top gunner": "Kierowca / działonowy / strzelec górny",
  "155 mm high explosive": "Pocisk odłamkowo-burzący 155 mm",
  "Stabilize before firing": "Ustabilizuj przed strzałem",
  "Anti-air launcher": "Wyrzutnia przeciwlotnicza",
  "Anti-vehicle launcher": "Wyrzutnia przeciw pojazdom",
  "Anti-vehicle drone launcher": "Wyrzutnia drona przeciw pojazdom",
  "Grenade launcher": "Granatnik",
  "Standard Arrows": "Standardowe strzały",
  "Stationary anti-air": "Stacjonarna obrona przeciwlotnicza",
  "Stationary artillery": "Artyleria stacjonarna",
  "Stationary defense": "Obrona stacjonarna",
  "Stationary support": "Wsparcie stacjonarne",
  "Stationary weapon": "Broń stacjonarna"
};

const traditionalTerms: Record<string,string> = {
  "Alpha price": "Alpha 測試價格",
  "Closed Beta price": "封閉測試價格",
  "Assault rifle": "突擊步槍",
  "SMG": "衝鋒槍",
  "Marksman rifle": "精確射手步槍",
  "Sniper rifle": "狙擊步槍",
  "Bow": "弓",
  "Sidearm": "副武器",
  "Shotgun": "霰彈槍",
  "LMG": "輕機槍",
  "Launcher": "發射器",
  "Ammunition": "彈藥",
  "Fire modes": "射擊模式",
  "Weight": "重量",
  "Progression": "進度",
  "Role": "定位",
  "Observed gate": "已觀察解鎖條件",
  "Observed crew": "已觀察乘員",
  "Observed shell": "已觀察彈種",
  "Observed setup": "已觀察部署方式",
  "Track": "進度路線",
  "Combat role": "戰鬥定位",
  "Vehicle class": "載具類別",
  "Aircraft class": "飛行器類別",
  "Build role": "建造定位",
  "Base damage": "基礎傷害",
  "Loads": "彈種",
  "Standard per round": "標準單發價格",
  "Box price": "彈藥箱價格",
  "Weapons": "適用武器",
  "Kind": "型別",
  "Zoom or capacity": "倍率或容量",
  "Weight or calibre": "重量或口徑",
  "Slot": "欄位",
  "Tier": "等級",
  "Recorded identifier": "已記錄標識",
  "Spending rule": "花費原則",
  "Best use": "最佳用途",
  "Main risk": "主要風險",
  "Not captured": "未記錄",
  "Gate unread": "解鎖條件無法辨認",
  "Open purchase": "可直接購買",
  "Variable": "可變",
  "fixed": "固定",
  "Semi / Full Auto": "半自動 / 全自動",
  "Semi / Burst": "半自動 / 點射",
  "Semi automatic": "半自動",
  "Break-action": "折開式",
  "Single-shot": "單發",
  "Bolt action": "栓動",
  "Bolt-action / Magazine": "栓動 / 彈匣",
  "Pull and Release": "拉弓並釋放",
  "Assault XP": "突擊經驗",
  "Medic XP": "醫療經驗",
  "Support XP": "支援經驗",
  "Recon XP": "偵察經驗",
  "Driver XP": "駕駛經驗",
  "Pilot XP": "飛行經驗",
  "Driver": "駕駛員",
  "Pilot": "飛行員",
  "Wardog": "戰士",
  "Optic": "瞄具",
  "Magazine": "彈匣",
  "Helmet": "頭盔",
  "Armor": "護甲",
  "Backpack": "背包",
  "Special": "特殊",
  "Lightest": "最輕",
  "Offensive": "進攻",
  "Medical": "醫療",
  "Recon": "偵察",
  "Building": "建造",
  "Utility": "通用",
  "Building / Offensive": "建造 / 進攻",
  "Light transport": "輕型運輸",
  "Fast transport": "快速運輸",
  "Utility transport": "通用運輸",
  "Cargo transport": "貨運載具",
  "Protected transport": "防護運輸",
  "Armed transport": "武裝運輸",
  "Heavy armed transport": "重型武裝運輸",
  "Logistics truck": "後勤卡車",
  "Protected logistics": "防護後勤",
  "Armed logistics": "武裝後勤",
  "Anti-air armor": "防空裝甲載具",
  "Main battle tank": "主戰坦克",
  "Self-propelled artillery": "自行火炮",
  "Combat helicopter": "戰鬥直升機",
  "Armed utility helicopter": "武裝通用直升機",
  "Rocket helicopter": "火箭直升機",
  "Attack helicopter": "攻擊直升機",
  "Light air transport": "輕型空運",
  "Air transport": "空中運輸",
  "Best targets": "最佳目標",
  "Key support": "關鍵支援",
  "Final balance": "最終平衡",
  "System role": "系統定位",
  "Placement needs": "部署要求",
  "Team dependency": "團隊依賴",
  "Final upgrade list": "最終升級列表",
  "Vehicle role": "載具定位",
  "Final loadout": "最終配裝",
  "Best support": "最佳支援",
  "Final stats": "最終屬性",
  "Natural counter": "主要剋制方式",
  "Final weapons": "最終武裝",
  "Final capacity": "最終容量",
  "Not confirmed": "尚未確認",
  "Indirect fire pressure": "間接火力壓制",
  "Static clusters, rooftops, towers, FOB defenses": "固定叢集、屋頂、塔樓與 FOB 防禦點",
  "Spotting, distance correction, supply": "偵察標記、距離修正與補給",
  "Forward logistics and defense point": "前線後勤與防禦支點",
  "Terrain, cover, delivery room, route access": "地形、掩體、卸貨空間與路線通行條件",
  "Requires supplies and defense": "需要持續補給與防守",
  "Light air mobility": "輕型空中機動",
  "Scouting, insertion, fast rotation": "偵察、投送與快速轉場",
  "Exposure during approach and landing": "接近與著陸階段容易暴露",
  "Heavy armor pressure": "重灌甲火力壓制",
  "Infantry screen and logistics": "步兵掩護與後勤支援",
  "Isolation from the team": "脫離團隊支援",
  "Air support pressure": "空中支援壓制",
  "Anti-air coverage and pressure": "防空掩護與壓制",
  "Exposed movement and clustered fights": "開闊移動與密集交戰",
  "Squad movement and supply support": "小隊運輸與補給支援",
  "Predictable routes": "路線容易被預判",
  "Driver / gunner / top gunner": "駕駛員 / 炮手 / 頂部機槍手",
  "155 mm high explosive": "155 毫米高爆彈",
  "Stabilize before firing": "開火前需要穩定車體",
  "Anti-air launcher": "防空發射器",
  "Anti-vehicle launcher": "反載具發射器",
  "Anti-vehicle drone launcher": "反載具無人機發射器",
  "Grenade launcher": "榴彈發射器",
  "Standard Arrows": "標準箭矢",
  "Stationary anti-air": "固定式防空",
  "Stationary artillery": "固定式火炮",
  "Stationary defense": "固定防禦設施",
  "Stationary support": "固定支援裝置",
  "Stationary weapon": "固定式武器"
};

function translateItemTerm(value: string, locale: TranslatedLocale): string {
  if (locale === "pl" || locale === "zh-tw") {
    const terms = locale === "pl" ? polishTerms : traditionalTerms;
    const direct = terms[value];
    if (direct) return direct;
    const level = value.match(/^(Driver|Pilot|Wardog) Level (\d+)$/);
    if (level) return locale === "pl" ? `${terms[level[1]]}, poziom ${level[2]}` : `${terms[level[1]]}等級 ${level[2]}`;
    const unlock = value.match(/^(\$[\d,]+) unlock$/);
    if (unlock) return locale === "pl" ? `Odblokowanie za ${unlock[1]}` : `${unlock[1]} 解鎖`;
    return value;
  }
  if (locale === "zh-cn") {
    const direct = chineseTerms[value];
    if (direct) return direct;

    const level = value.match(/^(Driver|Pilot|Wardog) Level (\d+)$/);
    if (level) return `${chineseTerms[level[1]] ?? level[1]}等级 ${level[2]}`;

    const unlock = value.match(/^(\$[\d,]+) unlock$/);
    if (unlock) return `${unlock[1]} 解锁`;

    return value;
  }
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

const localizedBuilds: Record<"pl" | "zh-tw", Record<string, string>> = {
  "pl": {
    "Alpha 1 - 7 Aug 2026": "Alfa 1 - 7 sierpnia 2026",
    "Closed Beta - 21-23 Aug 2026": "Zamknięta beta - 21–23 sierpnia 2026",
    "Closed Beta - 29 Aug 2026": "Zamknięta beta - 29 sierpnia 2026",
    "Alpha 1 and Closed Beta - 7-23 Aug 2026": "Alfa 1 i zamknięta beta - 7–23 sierpnia 2026",
    "Alpha 1 to Season 1 - checked 17 Sep 2026": "Od alfy 1 do sezonu 1 - sprawdzono 17 września 2026",
    "Season 1": "Sezon 1",
    "Season 1 Early Access": "Sezon 1 we wczesnym dostępie",
    "Season 1 Early Access - checked 17 Sep 2026": "Sezon 1 we wczesnym dostępie - sprawdzono 17 września 2026",
    "Season 1 Early Access - checked 26 Sep 2026": "Sezon 1 we wczesnym dostępie - sprawdzono 26 września 2026",
    "Official pre-release mode explanation": "Oficjalne przedpremierowe objaśnienie trybu",
    "Pre-release catalogue walkthrough - 20 Aug 2026": "Przegląd katalogu przed premierą - 20 sierpnia 2026",
    "Record-specific evidence pending - checked 17 Sep 2026": "Dowód dla konkretnego rekordu oczekuje na weryfikację - sprawdzono 17 września 2026",
    "Community catalogue snapshot - 27 Sep 2026": "Zapis katalogu społeczności - 27 września 2026",
    "Alpha 1 and Closed Beta footage checked 2026-08-28": "Nagrania z alfy 1 i zamkniętej bety sprawdzono 28 sierpnia 2026"
  },
  "zh-tw": {
    "Alpha 1 - 7 Aug 2026": "Alpha 1 — 2026年8月7日",
    "Closed Beta - 21-23 Aug 2026": "封閉測試 — 2026年8月21日至23日",
    "Closed Beta - 29 Aug 2026": "封閉測試 — 2026年8月29日",
    "Alpha 1 and Closed Beta - 7-23 Aug 2026": "Alpha 1 與封閉測試 — 2026年8月7日至23日",
    "Alpha 1 to Season 1 - checked 17 Sep 2026": "Alpha 1 至第 1 賽季 — 2026年9月17日核查",
    "Season 1": "第 1 賽季",
    "Season 1 Early Access": "第 1 賽季搶先體驗",
    "Season 1 Early Access - checked 17 Sep 2026": "第 1 賽季搶先體驗 — 2026年9月17日核查",
    "Season 1 Early Access - checked 26 Sep 2026": "第 1 賽季搶先體驗 — 2026年9月26日核查",
    "Official pre-release mode explanation": "官方預釋出模式說明",
    "Pre-release catalogue walkthrough - 20 Aug 2026": "預釋出圖鑑演示 — 2026年8月20日",
    "Record-specific evidence pending - checked 17 Sep 2026": "逐項證據待核驗 — 2026年9月17日檢查",
    "Community catalogue snapshot - 27 Sep 2026": "社群圖鑑快照 — 2026年9月27日",
    "Alpha 1 and Closed Beta footage checked 2026-08-28": "Alpha 1 與封閉測試實機核查於 2026 年 8 月 28 日"
  }
};

function localizeBuild(build: string, locale: TranslatedLocale, prefix: string): string {
  if (locale === "pl" || locale === "zh-tw") {
    const direct = localizedBuilds[locale][build];
    if (direct) return direct;
    const footage = build.match(/^Creator footage checked (\d{4}-\d{2}-\d{2})$/);
    if (footage) return locale === "pl" ? `Nagranie twórcy sprawdzono ${footage[1]}` : `創作者實機核查於 ${footage[1]}`;
    return `${prefix}: ${build}`;
  }
  if (build === "Alpha 1 - 7 Aug 2026") {
    return locale === "zh-cn" ? "Alpha 1 — 2026 年 8 月 7 日"
      : locale === "ru" ? "Alpha 1 — 7 августа 2026"
      : locale === "de" ? "Alpha 1 — 7. August 2026"
      : locale === "pt-br" ? "Alpha 1 — 7 de agosto de 2026"
      : "Alpha 1 — 2026年8月7日";
  }
  if (build === "Closed Beta - 21-23 Aug 2026") {
    return locale === "zh-cn" ? "封闭测试 — 2026 年 8 月 21 日至 23 日"
      : locale === "ru" ? "Закрытая бета — 21–23 августа 2026"
      : locale === "de" ? "Closed Beta — 21.–23. August 2026"
      : locale === "pt-br" ? "Beta Fechado — 21–23 de agosto de 2026"
      : "クローズドベータ — 2026年8月21日～23日";
  }
  if (build === "Creator footage checked 2026-08-16") {
    return locale === "zh-cn" ? "创作者实机核查于 2026 年 8 月 16 日"
      : locale === "ru" ? "Видео автора проверено 16 августа 2026"
      : locale === "de" ? "Creator-Aufnahme geprüft am 16. August 2026"
      : locale === "pt-br" ? "Vídeo do criador verificado em 16 de agosto de 2026"
      : "クリエイター映像を2026年8月16日に確認";
  }
  if (build === "Creator footage checked 2026-08-25") {
    return locale === "zh-cn" ? "创作者实机核查于 2026 年 8 月 25 日"
      : locale === "ru" ? "Видео автора проверено 25 августа 2026"
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
  const statusLabel = profile.status[item.status];
  const build = localizeBuild(item.build, locale, profile.buildPrefix);
  const localizedEvidenceItem = {...item, statusLabel, build};
  const localized: WardogsItem = {
    ...item,
    subtype: translatedSubtype === item.subtype ? typeName : translatedSubtype,
    statusLabel,
    build,
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
    confirmedFacts: profile.confirmed(localizedEvidenceItem, typeName),
    unconfirmedFacts: profile.unconfirmed(item, typeName),
    detailImageAlt: item.detailImage ? profile.imageAlt(item, typeName) : item.detailImageAlt,
    imageAlt: item.image ? profile.imageAlt(item, typeName) : item.imageAlt
  };
  if (locale === "ja" && item.type === "vehicles" && item.slug === "stingray") {
    return {
      ...localized,
      summary: "スティングレイはWARDOGSの対車両ドローン用ランチャーです。ベータ版映像で発射筒と操作端末を確認できますが、現在の価格・解除条件・ダメージは未確認です。",
      description: "スティングレイは運転する車両ではなく、発射筒と操作端末を使う対車両ドローンです。クローズドベータの建築映像で機材を確認でき、9月の実機映像では敵車両や砲兵を狙う様子が見られます。現在の価格、解除条件、配備費用、ダメージはこれらの映像だけでは確定できません。",
      role: "目標の位置を確認してから発射し、操縦者は遮蔽物の内側に置きましょう。停止中の高価値車両や砲兵を優先する運用は過去の実機映像に基づきます。着弾前の最終修正に余裕を残し、無理な追尾より撤退判断を優先します。飛行操作やブーストの感覚は現在のビルドで再確認してください。",
      strengths: [
        "確認済みの敵車両や停止中の砲兵を遠隔から攻撃できます。",
        "発射筒と操作端末は出典のベータ版映像で直接確認できます。",
        "9月の実機映像もスティングレイによる対車両運用の参考になります。"
      ],
      cautions: [
        "操作中の操縦者は周辺の敵に対応しづらいため、発射地点の防護と味方の監視が必要です。",
        "ベータ版の操縦方法、誘導、威力を現在の仕様として扱わないでください。",
        "現在の価格、解除条件、配備費用、ダメージは未確認です。"
      ],
      confirmedFacts: [
        "出典のクローズドベータ映像で発射筒と操作端末を確認できます。",
        "9月の実機映像で敵車両・砲兵を狙う運用が紹介されています。"
      ],
      unconfirmedFacts: [
        "現在のショップ価格、解除条件、配備費用、ダメージは公式資料や現行ビルドの画面で確認できていません。",
        "ベータ版の飛行操作が現行ビルドと同じとは限りません。"
      ]
    };
  }
  if (locale === "zh-tw") return {...localized, ...localizeItemProseZhTw(item)};
  if (locale === "pl") return {...localized, ...localizeItemProsePl(item)};
  return localized;
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
