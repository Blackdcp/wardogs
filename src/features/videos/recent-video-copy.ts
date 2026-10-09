import type {Locale} from "@/config/site";
import {recentMatchCopy, type RecentVideoCopy} from "./recent-match-copy";

type Localized = Record<Locale, RecentVideoCopy>;
// Authored, source-specific summaries; recorded cases are not live-client tests.
export const recentVideoCopy: Record<string, Localized> = {
  ...recentMatchCopy,
  "liRK9si1Ubo": {
    "en": {
      "title": "WARDOGS Season 2: the developer interview, by decision",
      "answer": "The developers describe four planned class weapons, Gold Market rotation, a narrower Level 4 helmet view and rain. Use these chapters to prepare for October 15; the interview does not establish final item statistics or a launch hour.",
      "notes": [
        "32:38 — Gold Market: distinguish an offer rotating out of the shop from an item already bought being removed. Keep owned cosmetics and Gold separate from cash and XP when preparing your wipe checklist; a creator's short recap can collapse these different cases.",
        "46:04 — Season length: the discussion does not promise an identical monthly schedule. Plan your next unlock around the announced season date and your available sessions, without projecting a permanent four-week reset calendar.",
        "53:50 — Parachutes: the developers explain why meaningful landings matter to the pilot role. The proposed deployment-height change is not a dated live mechanic. Practice a clear approach, a stable landing and an exit route; do not replace your current safety check with a number from a proposal.",
        "1:25:27 and 1:26:21 — Helmet visibility and weather are separate trade-offs. The planned narrow visor reduces the field of view; rain and fog can affect target acquisition. Test the released build on your hardware before adopting another player's settings or assuming identical performance.",
        "1:28:35 — Four weapons are discussed, one per class. The Recon weapon is described as M14-like, but final in-game naming, prices, unlock gates, ammunition and damage are not a completed catalogue. Keep a cash reserve and compare the release notes before paying for a new route."
      ],
      "chapterTitles": [
        "Gold rotation and owned items",
        "Plan around announced season dates",
        "Parachutes and the pilot role",
        "Helmet visibility and changing weather",
        "Four class weapons: what remains unknown"
      ]
    },
    "de": {
      "title": "WARDOGS Saison 2: Entwicklerinterview nach Entscheidungen",
      "answer": "Die Entwickler besprechen vier geplante Klassenwaffen, Goldmarkt-Rotation, ein engeres Sichtfeld des Level-4-Helms und Regen. Die Kapitel helfen bei der Vorbereitung auf den 15. Oktober; endgültige Werte und die Startuhrzeit stehen damit nicht fest.",
      "notes": [
        "32:38 — Goldmarkt: Ein Angebot, das aus dem Shop rotiert, ist nicht dasselbe wie ein bereits gekaufter Gegenstand, der entfernt wird. Trenne eigene Kosmetik und Gold von Geld und XP auf deiner Wipe-Liste; verkürzte Zusammenfassungen können diese Fälle vermischen.",
        "46:04 — Saisonlänge: Das Gespräch verspricht keinen dauerhaft gleichen Monatsrhythmus. Plane Freischaltungen anhand des angekündigten Datums und deiner verfügbaren Spielzeit, nicht nach einem angenommenen Vier-Wochen-Kalender.",
        "53:50 — Fallschirme: Die Entwickler erläutern den Wert echter Landungen für Piloten. Die diskutierte Auslösehöhe ist keine datierte Live-Änderung. Übe Anflug, stabiles Aufsetzen und Abflug; ersetze die aktuelle Sicherheitsprüfung nicht durch einen Vorschlagswert.",
        "1:25:27 und 1:26:21 — Helmsicht und Wetter sind unterschiedliche Kompromisse. Das geplante schmale Visier schränkt die Sicht ein; Regen und Nebel können die Zielerkennung verändern. Prüfe die veröffentlichte Version auf deinem PC, bevor du fremde Einstellungen übernimmst.",
        "1:28:35 — Vier Waffen, eine pro Klasse, werden besprochen. Die Recon-Waffe wird als M14-artig beschrieben; endgültige Namen, Preise, Freischaltungen, Munition und Schaden sind damit nicht dokumentiert. Halte Geld zurück und prüfe die Patchnotes vor einem neuen Freischaltpfad."
      ],
      "chapterTitles": [
        "Goldrotation und eigene Gegenstände",
        "Mit angekündigten Saisonterminen planen",
        "Fallschirme und die Pilotenrolle",
        "Helmsicht und wechselndes Wetter",
        "Vier Klassenwaffen: offene Details"
      ]
    },
    "ru": {
      "title": "WARDOGS: интервью разработчиков о решениях перед сезоном 2",
      "answer": "Разработчики обсуждают четыре новых оружия для классов, ротацию золотого магазина, узкий обзор шлема 4-го уровня и дождь. Главы помогут подготовиться к 15 октября, но не подтверждают финальные характеристики и час запуска.",
      "notes": [
        "32:38 — Золотой магазин: исчезновение предложения из продажи не означает изъятие купленного предмета. В списке подготовки отделяйте имеющуюся косметику и золото от денег и XP: краткие пересказы могут смешивать эти случаи.",
        "46:04 — Длина сезона: постоянного месячного расписания в интервью не обещают. Планируйте открытие предметов по объявленной дате и своему времени на игру, а не по предполагаемому циклу в четыре недели.",
        "53:50 — Парашюты: разработчики объясняют роль настоящей посадки для пилота. Предлагаемая высота раскрытия не является уже внедрённым изменением с датой. Тренируйте заход, устойчивую посадку и отход; не заменяйте текущую проверку безопасности числом из предложения.",
        "1:25:27 и 1:26:21 — Обзор шлема и погода требуют разных решений. Узкий визор должен ограничивать поле зрения, а дождь и туман меняют обнаружение целей. Проверьте выпущенную версию на своём ПК, прежде чем копировать чужие настройки.",
        "1:28:35 — Обсуждаются четыре оружия, по одному на класс. Оружие разведчика описано как аналог M14, но окончательные названия, цены, требования, боеприпасы и урон ещё не образуют готовый каталог. Сохраните резерв денег и сверяйтесь с заметками к релизу."
      ],
      "chapterTitles": [
        "Ротация золота и купленные предметы",
        "Планирование по объявленным датам",
        "Парашюты и роль пилота",
        "Обзор шлема и погода",
        "Четыре классовых оружия: что неизвестно"
      ]
    },
    "pt-br": {
      "title": "WARDOGS Temporada 2: decisões da entrevista com os devs",
      "answer": "Os desenvolvedores discutem quatro armas de classe, rotação da Loja de Ouro, visão reduzida no capacete de nível 4 e chuva. Os capítulos ajudam a preparar o dia 15 de outubro; não definem atributos finais nem o horário de lançamento.",
      "notes": [
        "32:38 — Loja de Ouro: uma oferta sair da loja não significa remover um item já comprado. Separe cosméticos adquiridos e ouro de dinheiro e XP na lista do wipe; resumos curtos podem misturar essas situações.",
        "46:04 — Duração: a entrevista não promete um calendário mensal fixo. Planeje o próximo desbloqueio com a data anunciada e suas sessões disponíveis, sem presumir resets permanentes a cada quatro semanas.",
        "53:50 — Paraquedas: os devs explicam por que pousar deve importar para o piloto. A altura de abertura discutida não é uma mudança já lançada com data. Treine aproximação, pouso estável e saída; não substitua a verificação atual por um número proposto.",
        "1:25:27 e 1:26:21 — Visão do capacete e clima são escolhas diferentes. O visor estreito planejado reduz o campo de visão; chuva e neblina podem afetar a identificação de alvos. Teste a versão lançada no seu PC antes de copiar ajustes de outro jogador.",
        "1:28:35 — São quatro armas, uma por classe. A arma de Recon é descrita como semelhante à M14, mas nomes, preços, requisitos, munição e dano finais não estão documentados. Guarde uma reserva e confira as notas antes de investir numa nova rota."
      ],
      "chapterTitles": [
        "Rotação e itens já comprados",
        "Planejar pelas datas anunciadas",
        "Paraquedas e o papel do piloto",
        "Visão do capacete e clima",
        "Quatro armas de classe: dúvidas restantes"
      ]
    },
    "ja": {
      "title": "WARDOGS シーズン2：開発者インタビューから準備を考える",
      "answer": "開発者が語ったのは各クラス向けの新武器4種、ゴールド市場の入れ替え、レベル4ヘルメットの視界制限、雨です。10月15日の準備に使える発言ですが、最終性能や開始時刻の確定情報ではありません。",
      "notes": [
        "32:38 — ゴールド市場では、販売枠から外れることと購入済みアイテムを失うことを分けて考えます。ワイプ準備表では所有済みコスメ・ゴールドと現金・XPを別項目にしてください。短い要約だけでは、この区別が消えることがあります。 交換を考える場合は欲しい品の必要ゴールド、現在の所持分、足りない分を先に書き出します。販売終了の不安だけで、次の試合に必要な装備代まで使わないようにします。",
        "46:04 — シーズンの長さは毎月同じとは限りません。固定の4週間周期を想定せず、発表された日程と実際に遊べる時間から次のアンロックを決めます。 「次も同じ日にリセットされる」と決めつけると、最後に遊べる日と交換を確認する日がずれます。自分の残りのセッション数から購入と練習の優先順位を決め、次の公式告知で見直してください。",
        "53:50 — パラシュートの話は、輸送パイロットが着陸する意味を重視した設計説明です。開傘高度の案は実装日が決まった現行仕様ではありません。進入、安定した着陸、離脱を練習し、提案の数値だけで安全判定を置き換えないでください。 この章を根拠に、現在のクライアントで特定の高度なら必ず開傘できると判断してはいけません。既存の飛行ガイドと現行の操作表示で降下条件を確認し、安全な場所で練習してから輸送へ進みます。",
        "1:25:27・1:26:21 — ヘルメットの視界と天候は別の判断材料です。狭いバイザーは視野を制限し、雨や霧は索敵に影響し得ます。他人の設定をそのまま採用せず、公開後のビルドを自分のPCで確認します。 公開後は同じ場所、同じ画質設定で、敵を認識できる範囲とフレーム時間を別々に比較します。視界が狭くなったことと、描画負荷によるカクつきを同じ問題として扱わないのが判断の要点です。",
        "1:28:35 — 新武器は各クラス1種、計4種として説明されています。Recon用はM14系という話ですが、最終名称・価格・アンロック条件・弾薬・威力の一覧はまだ完成していません。資金を残し、更新説明を読んでから次の育成先を決めましょう。 「M14系」という説明は、カタログ名や弾薬互換を確定するものではありません。購入前に装備画面でクラス、解放条件、対応弾薬を確認し、武器本体だけを買って使用できなくなる失敗を避けます。"
      ],
      "chapterTitles": [
        "販売ローテーションと所有済みアイテム",
        "発表された日程から育成を計画する",
        "パラシュート案とパイロットの役割",
        "ヘルメットの視界と天候の変化",
        "各クラスの新武器と未確定の仕様"
      ]
    },
    "zh-cn": {
      "title": "WARDOGS 第二赛季开发者访谈：按玩家决策看重点",
      "answer": "开发者谈到了四种职业新武器、Gold Market 轮换、四级头盔视野限制和雨天。可以用这些章节准备10月15日，但访谈并没有给出完整装备属性或确切开服时刻。",
      "notes": [
        "32:38 — Gold Market：商品退出售卖轮换，不等于收回已经购买的物品。做删档清单时，把已拥有外观和金条，与现金、XP 分开列；短视频摘要容易把这些不同情况混为一谈。 先记下目标外观需要多少Gold、已经持有多少、还差多少，再核对当前兑换报价。不要只因担心商品轮换，就把下一局的装备储备也换光。",
        "46:04 — 赛季长度：访谈没有承诺永久固定的月度周期。根据已公布日期和自己还能玩几场安排解锁，不要从一次短赛季推导出每四周必定重置的日历。 把剩余可玩的场次列出来，再决定先解锁、先练习还是保留资金。永久四周重置周期不是这段访谈给出的承诺，下一季安排应继续看官方公告。",
        "53:50 — 降落伞：开发者解释了为什么真正的降落应当体现飞行员价值。讨论中的开伞高度调整尚不是有确定实施日的现行规则。先练进场、稳定降落和撤离，不要拿提案数字替代当前安全判断。 不要把讨论中的高度当作当前客户端必定能开伞的保证。先在安全环境核对操作提示与现行条件，再把降落流程用于载人运输。",
        "1:25:27、1:26:21 — 头盔视野与天气分别影响决策。计划中的窄面罩会限制视野，雨雾可能改变发现目标的难度。等正式版本上线后在自己的设备上测试，不要假定别人的画质设置和帧率适用于自己。 发布后固定地点与画质设置，分别比较目标识别范围和帧时间。头盔视野变窄与渲染负载造成的卡顿，是两类需要分别判断的问题。",
        "1:28:35 — 四种新武器按每职业一种讨论，侦察武器被描述为 M14 类。但游戏内最终名称、价格、解锁门槛、弹药与伤害并未组成完整属性表。保留资金，等更新说明后再决定新的解锁路线。 M14类的描述不等于已确定的目录名称或弹药兼容。购买前核对职业、解锁要求与对应弹药，避免只买枪体却无法完成配装。"
      ],
      "chapterTitles": [
        "商品轮换与已购买物品",
        "按已公布日期规划赛季",
        "降落伞提案与飞行员角色",
        "头盔视野与天气变化",
        "四把职业武器还有哪些未知"
      ]
    },
    "zh-tw": {
      "title": "WARDOGS 第二賽季開發者訪談：依玩家決策掌握重點",
      "answer": "開發者談到四種職業新武器、黃金市場輪替、四級頭盔視野限制及雨天。這些章節有助於準備10月15日，但沒有公布完整裝備數值或確切開服時間。",
      "notes": [
        "32:38 — 黃金市場：商品離開販售輪替，不代表收回已購買的物品。整理重置清單時，請將已持有的外觀與金條，以及現金、XP分別列出；短篇摘要容易混淆這些情況。 先列出目標外觀所需Gold、持有數量及缺口，再核對目前兌換報價。不要只因擔心販售輪替，就把下一局的裝備預備金也換光。",
        "46:04 — 賽季長度：訪談沒有承諾固定的每月週期。依公布日期與自己能玩的場次安排解鎖，不要從單次短賽季推定每四週必定重置。 列出剩餘能玩的場次，再決定解鎖、練習及保留資金的順序。永久四週重置週期不是這段訪談的承諾，下季安排仍應依官方公告。",
        "53:50 — 降落傘：開發者說明真正降落如何體現飛行員的價值。討論中的開傘高度調整，尚不是有確定實施日的現行規則。先練習進場、穩定落地與離場，別用提案數字取代當前安全判斷。 別把討論中的高度當成目前用戶端一定能開傘的保證。先在安全環境核對操作提示與現行條件，再把降落流程用於載人運輸。",
        "1:25:27、1:26:21 — 頭盔視野與天候是不同取捨。規劃中的窄面罩會限制視野，雨霧可能影響索敵。正式版本推出後，應在自己的電腦測試，別假定別人的畫質與影格率適用於自己。 更新後固定地點與畫質設定，分別比較目標辨識範圍和影格時間。頭盔視野變窄與繪圖負載造成的卡頓，需要分開判斷。",
        "1:28:35 — 四種新武器按每職業一種討論，偵察武器被形容為M14類型。但最終遊戲名稱、售價、解鎖條件、彈藥與傷害尚未形成完整資料表。保留資金，閱讀更新說明後再選擇解鎖路線。 M14類的說法不等於已確定的目錄名稱或彈藥相容性。購買前核對職業、解鎖要求和對應彈藥，避免只買槍身卻無法完成配裝。"
      ],
      "chapterTitles": [
        "販售輪替與已購買物品",
        "依公布日期規劃賽季",
        "降落傘提案與飛行員角色",
        "頭盔視野與天候變化",
        "四把職業武器的未定細節"
      ]
    },
    "pl": {
      "title": "WARDOGS sezon 2: wywiad z twórcami a decyzje gracza",
      "answer": "Twórcy omawiają cztery bronie klasowe, rotację sklepu za złoto, ograniczenie widoku hełmu poziomu 4 i deszcz. Rozdziały pomagają przygotować się na 15 października, lecz nie podają końcowych statystyk ani godziny startu.",
      "notes": [
        "32:38 — Sklep za złoto: wycofanie oferty ze sprzedaży nie oznacza usunięcia kupionego przedmiotu. Na liście przed resetem oddziel posiadane kosmetyki i złoto od gotówki oraz XP. Skrócone omówienia potrafią mieszać te sytuacje.",
        "46:04 — Długość sezonu: rozmowa nie obiecuje stałego cyklu miesięcznego. Planuj odblokowania według ogłoszonej daty i dostępnych sesji, bez zakładania resetu co cztery tygodnie.",
        "53:50 — Spadochrony: twórcy wyjaśniają wartość prawdziwego lądowania dla roli pilota. Proponowana wysokość otwarcia nie jest datowaną zmianą już obecną w grze. Ćwicz podejście, stabilne lądowanie i odlot; nie zastępuj bieżącej kontroli bezpieczeństwa propozycją liczbową.",
        "1:25:27 i 1:26:21 — Widok z hełmu i pogoda to odrębne kompromisy. Wąski wizjer ma ograniczać widoczność, a deszcz i mgła mogą zmieniać wykrywanie celów. Przetestuj wydaną wersję na własnym komputerze przed kopiowaniem ustawień.",
        "1:28:35 — Omówiono cztery bronie, po jednej na klasę. Broń zwiadowcy opisano jako podobną do M14, ale nazwy, ceny, wymagania, amunicja i obrażenia nie są jeszcze pełnym katalogiem. Zachowaj rezerwę i sprawdź informacje o aktualizacji przed nową ścieżką odblokowań."
      ],
      "chapterTitles": [
        "Rotacja i posiadane przedmioty",
        "Plan według ogłoszonych dat sezonu",
        "Spadochrony i rola pilota",
        "Widoczność w hełmie i pogoda",
        "Cztery bronie klasowe: czego nie wiemy"
      ]
    }
  },
  "kC3P-klWNxk": {
    "en": {
      "title": "WARDOGS attachments: compare Evo4Fun's tests with your loadout",
      "answer": "Choose attachments around the fight you expect: aiming speed, recoil control, magazine capacity and sight picture compete. Evo4Fun mixes datamined statistics, firing-range observations and personal recommendations; they are not all equally certain.",
      "notes": [
        "1:31–2:21 — In the creator's datamined comparison, TDG gives 30% vertical recoil reduction with a 10% ADS-speed penalty. RVG gives five percentage points less vertical control and two less horizontal control, but a 10% ADS-speed bonus. That makes RVG the handling option for an entry fight, while TDG prioritizes a steadier burst. These are reported modifiers, not our measured aim times; changing several parts at once hides which trade-off caused the result.",
        "4:08–5:38 — An optic changes sight picture as well as aiming behavior. The author qualifies confidence in optic ADS values in the description; the automatic caption also varies the 1.5× sight's name. Match the actual item in your menu instead of buying from a possibly mistranscribed name.",
        "6:25–6:56 and 10:49–11:04 — Magazine choices should fit the engagement and reload opportunity. More capacity can help a long push, while the handling cost can matter in a quick close fight. The AMP-9 example starts from a 20-round magazine; check the live item before copying it.",
        "7:32–8:30 — Use the M4/AK-74 discussion to set up a repeatable comparison around 40 metres. Keep weapon, ammo, position and burst length fixed; change one attachment, record the result, then repeat. Do not turn a single creator's preferred kit into an unconditional best build.",
        "13:10 and 18:36 — The author admits limited LMG experience and personal preference. At 14:33 he describes a small bipod recoil penalty when it is not properly supported without establishing a numerical magnitude. Record your own support state; these observations do not justify changing the site's damage or TTK model."
      ],
      "chapterTitles": [
        "Grips: control versus handling",
        "Optics: ADS and a usable sight picture",
        "Magazine capacity and reload opportunities",
        "Compare M4 and AK74 under equal conditions",
        "Bipod states and limits of the evidence"
      ]
    },
    "de": {
      "title": "WARDOGS-Anbauteile: Evo4Funs Tests fürs eigene Loadout nutzen",
      "answer": "Wähle Anbauteile nach der geplanten Distanz: Zielgeschwindigkeit, Rückstoß, Magazin und Visierbild konkurrieren. Evo4Fun kombiniert ausgelesene Daten, Schießstandbeobachtungen und persönliche Empfehlungen mit unterschiedlicher Sicherheit.",
      "notes": [
        "1:31–2:21 — Laut den ausgelesenen Daten des Autors bietet TDG 30% weniger vertikalen Rückstoß bei 10% weniger ADS-Geschwindigkeit. RVG kontrolliert vertikal fünf und horizontal zwei Prozentpunkte weniger, bietet aber 10% mehr ADS-Geschwindigkeit. Damit ist RVG die Handhabungsoption für den Einstieg, TDG die Wahl für ruhigere Feuerstöße. Gemeldete Modifikatoren, keine von uns gemessenen Zielzeiten; mehrere gleichzeitige Änderungen verdecken die Ursache.",
        "4:08–5:38 — Ein Visier verändert auch das Sichtbild. Der Autor schränkt die Sicherheit der ADS-Werte in seiner Beschreibung ein; die Untertitel variieren den Namen des 1,5-fachen Visiers. Gleiche den echten Gegenstand im Menü ab.",
        "6:25–6:56 und 10:49–11:04 — Wähle das Magazin nach Gefecht und Nachladefenster. Mehr Patronen helfen bei längeren Vorstößen, können aber die Handhabung belasten. Das AMP-9-Beispiel beginnt mit 20 Patronen; prüfe den aktuellen Gegenstand.",
        "7:32–8:30 — Nutze die M4-/AK-74-Passage für einen Vergleich bei etwa 40 Metern. Gleiche Waffe, Munition, Position und Feuerstoß; ändere ein Anbauteil, protokolliere und wiederhole. Eine bevorzugte Zusammenstellung ist kein universell bestes Loadout.",
        "13:10 und 18:36 — Der Autor nennt geringe LMG-Erfahrung und persönliche Vorlieben. Bei 14:33 beschreibt er eine kleine Rückstoßverschlechterung beim nicht abgestützten Zweibein ohne belastbare Größe. Dokumentiere den Auflagestatus; daraus folgen keine neuen Schadens- oder TTK-Werte."
      ],
      "chapterTitles": [
        "Griffe: Kontrolle gegen Handhabung",
        "Optik: ADS und nutzbares Sichtbild",
        "Magazinkapazität und Nachladefenster",
        "M4 und AK74 unter gleichen Bedingungen",
        "Zweibeinzustände und Grenzen der Quelle"
      ]
    },
    "ru": {
      "title": "Обвесы WARDOGS: как применять тесты Evo4Fun",
      "answer": "Выбирайте обвес под бой: скорость прицеливания, отдача, ёмкость и обзор конкурируют. Evo4Fun сочетает извлечённые данные, наблюдения на полигоне и личные советы с разной степенью уверенности.",
      "notes": [
        "1:31–2:21 — По извлечённым автором данным TDG уменьшает вертикальную отдачу на 30%, снижая скорость ADS на 10%. RVG даёт на пять процентных пунктов меньше вертикального и на два меньше горизонтального контроля, но повышает скорость ADS на 10%. RVG подходит для быстрого входа, TDG — для более ровной очереди. Это сообщённые модификаторы, не наши замеры времени; меняя сразу несколько деталей, вы теряете причину результата.",
        "4:08–5:38 — Прицел меняет видимость и поведение при наведении. Автор оговаривает уверенность в ADS оптики; субтитры по-разному передают название прицела 1,5×. Сверяйте предмет в игровом меню.",
        "6:25–6:56 и 10:49–11:04 — Магазин выбирают с учётом боя и возможности перезарядиться. Дополнительные патроны помогают при длинном штурме, но обращение тоже важно. Пример AMP-9 начинается с 20 патронов; проверьте текущий предмет.",
        "7:32–8:30 — Сравнение M4 и AK-74 можно повторить примерно на 40 метрах. Фиксируйте оружие, патроны, позицию и длину очереди; меняйте одну деталь и повторяйте замеры. Любимый комплект автора не универсален.",
        "13:10 и 18:36 — Автор признаёт небольшой опыт с LMG и личные предпочтения. В 14:33 он описывает небольшую отдачу от неупёртых сошек без точной величины. Записывайте состояние опоры; это не основание менять урон или модель TTK."
      ],
      "chapterTitles": [
        "Рукоятки: контроль и удобство",
        "Прицелы: скорость и обзор",
        "Ёмкость магазина и время перезарядки",
        "Сравнение M4 и AK74 в равных условиях",
        "Положение сошек и пределы данных"
      ]
    },
    "pt-br": {
      "title": "Acessórios de WARDOGS: aplique os testes de Evo4Fun",
      "answer": "Escolha acessórios para o combate esperado: ADS, recuo, capacidade e visão competem. Evo4Fun combina dados extraídos, observações no campo de tiro e preferências; a certeza varia entre eles.",
      "notes": [
        "1:31–2:21 — Nos dados extraídos pelo autor, TDG reduz 30% do recuo vertical com penalidade de 10% na velocidade de ADS. RVG oferece cinco pontos percentuais menos de controle vertical e dois menos de horizontal, mas dá bônus de 10% na velocidade de ADS. RVG favorece a entrada rápida; TDG prioriza rajadas mais estáveis. São modificadores relatados, não tempos medidos por nós; mudar várias peças juntas esconde qual troca causou o resultado.",
        "4:08–5:38 — A mira muda a imagem e o comportamento ao apontar. O autor ressalva os valores de ADS das ópticas na descrição; as legendas variam o nome da mira 1,5×. Confira o item real no menu.",
        "6:25–6:56 e 10:49–11:04 — O carregador depende da luta e da chance de recarregar. Capacidade ajuda em avanços longos, mas a perda de manuseio pode pesar. O exemplo da AMP-9 parte de 20 tiros; confira a versão atual.",
        "7:32–8:30 — Use o trecho M4/AK-74 para comparar a cerca de 40 metros. Mantenha arma, munição, posição e rajada; mude um acessório, anote e repita. A preferência de um criador não é uma montagem universal.",
        "13:10 e 18:36 — O autor admite pouca experiência com LMGs e preferência pessoal. Aos 14:33 descreve uma pequena penalidade de recuo no bipé sem apoio, sem definir magnitude. Registre o apoio usado; isso não fornece novos valores de dano ou TTK."
      ],
      "chapterTitles": [
        "Empunhaduras: controle e manuseio",
        "Miras: ADS e visibilidade",
        "Capacidade e oportunidades de recarga",
        "Comparar M4 e AK74 nas mesmas condições",
        "Estados do bipé e limites da evidência"
      ]
    },
    "ja": {
      "title": "WARDOGS アタッチメント：Evo4Funの比較を自分の装備に活かす",
      "answer": "交戦距離に合わせ、ADS速度・反動・装弾数・見やすさを比較します。Evo4Funの動画は抽出データ、射撃場での観察、個人の好みを含むため、すべてを同じ確度で扱えません。",
      "notes": [
        "1:31–2:21 — 作者が紹介する抽出データでは、TDGは縦反動を30%抑える代わりにADS速度が10%低下します。RVGは縦の抑制が5ポイント、横が2ポイント小さい一方、ADS速度は10%上がるという比較です。突入時の構えやすさを選ぶならRVG、連射を安定させる方向ならTDGという取捨選択になります。これは作者が報告した補正値で、本站が照準までの時間を測った結果ではありません。同時に銃口や照準器まで変えると、どの変更が扱いやすさを変えたか分からなくなります。",
        "4:08–5:38 — 照準器はADSだけでなく視界も変えます。説明欄には光学サイトのADS値への留保があり、自動字幕の1.5倍サイト名も揺れています。字幕名だけで買わず、実際のメニューで確認してください。 倍率だけではなく、サイトの外枠が周囲の敵を隠さないかも確認します。サイト名が字幕と異なる場合はそのまま同一製品と判断せず、現在の装備画面に表示された名称を試験記録へ転記してください。",
        "6:25–6:56・10:49–11:04 — マガジンは交戦時間とリロードの機会で選びます。長い攻撃には容量が役立ちますが、近距離では取り回しも重要です。AMP-9の例は20発から比較しており、現行アイテムを確認する必要があります。 装弾数を変える試験では他のパーツを固定します。最初の交戦で何発使い、どこで安全に再装填できたかを記録すれば、容量増加がその役割に役立つのか、単に使い切らない弾を増やすだけかを比べられます。",
        "7:32–8:30 — M4・AK-74の話を約40mでの比較練習に使えます。銃、弾、姿勢、連射数をそろえ、部品を1つだけ変更して記録・反復します。作者の好みを万能な最強構成にしないでください。 配装計画には武器と候補パーツを追加し、価格と装着可否は実際の装備画面で入力します。別の武器や弾薬に替えた結果を同じ試験として混ぜず、一つ前の構成へ戻して再現するかも確認します。",
        "13:10・18:36 — 作者はLMG経験の少なさと好みを認めています。14:33の支持されていないバイポッドによる小さな反動増加には確定幅がありません。支持状態を記録し、ダメージやTTKモデルの確定値にはしません。 二脚が収納中か、展開しただけか、地面に支持されているかを毎回記録します。作者自身の経験範囲を超えてLMG全体の結論に広げず、同条件で確認できた挙動だけを自分の装備判断に使います。"
      ],
      "chapterTitles": [
        "グリップの反動制御と取り回し",
        "照準器のADS速度と見やすさ",
        "装弾数とリロードできる時間",
        "同条件でM4・AK74を比較する",
        "二脚の状態と作者の経験範囲"
      ]
    },
    "zh-cn": {
      "title": "WARDOGS 配件实测解析：把 Evo4Fun 的比较用于自己的配装",
      "answer": "按交战任务比较开镜速度、后坐力、容量和视野。Evo4Fun 混合使用了数据挖掘、靶场观察和个人推荐，三类信息的确定程度不同。",
      "notes": [
        "1:31–2:21 — 按作者介绍的拆包数据，TDG减少30%垂直后坐力，但ADS速度降低10%；RVG比它少5个百分点垂直控制、少2个百分点水平控制，换来ADS速度增加10%。因此近距离入场更看重快速抬枪时可考虑RVG，连射稳定优先时考虑TDG。这是作者报告的修正值，不是本站测出的开镜毫秒数。一次只换握把，保留其他配件，才看得出更快开镜与后坐力之间的实际取舍；不要把两种百分比直接当成同一种收益相加。",
        "4:08–5:38 — 瞄具同时影响观察画面与开镜表现。作者在描述中保留了光学镜 ADS 数值的不确定性；1.5倍镜名称在自动字幕中也有多个拼写。应核对游戏内实际物品，不要按字幕误写的名字购买。 除倍率外，也检查镜框是否挡住侧边目标。字幕名称与当前菜单不一致时，记录游戏内准确名称，不把读音相近当作已确认同一型号。",
        "6:25–6:56、10:49–11:04 — 弹匣选择取决于交战长度和换弹窗口。长时间推进可能更需要容量，近战快速反应则要考虑操控代价。AMP-9 以20发弹匣为对照起点，实际购买仍查看当前物品。 比较容量时固定其他配件，记下首轮交火实际用了多少发、何时能安全换弹。这样才能判断大弹匣对任务有用，还是只增加没有用上的容量。",
        "7:32–8:30 — 用 M4、AK-74 的讨论安排约40米对照：固定枪械、弹药、位置和连射长度，每次只换一个配件，记录结果并重复。某位作者偏好的组合不是无条件最强配装。 把候选武器与部件放进配装清单，价格及安装可行性由当前装备界面核对。更换枪或弹种后另开记录，再回到原配置看结果能否重现。",
        "13:10、18:36 — 作者承认 LMG 经验有限且部分推荐出于偏好。14:33提到两脚架未支撑时有轻微后坐力代价，但没确立具体幅度。记录自己的支撑状态，这些观察不足以更改伤害或 TTK 模型。 记录两脚架是收起、展开未架设还是稳定架设。不要把作者对少数武器的体验推广成所有轻机枪结论，自己能复现的条件才用于购买判断。"
      ],
      "chapterTitles": [
        "握把控枪与操控取舍",
        "瞄具举枪速度与视野",
        "弹匣容量与换弹机会",
        "固定条件对比M4与AK74",
        "两脚架状态与证据范围"
      ]
    },
    "zh-tw": {
      "title": "WARDOGS 配件實測解析：把Evo4Fun的比較用在自己的配裝",
      "answer": "依交戰任務比較瞄準速度、後座力、容量與視野。Evo4Fun混合使用資料挖掘、靶場觀察和個人推薦，三類資訊的確定程度不同。",
      "notes": [
        "1:31–2:21 — 依作者介紹的資料解析，TDG降低30%垂直後座力，但ADS速度降低10%；RVG比它少5個百分點垂直控制、少2個百分點水平控制，換來ADS速度增加10%。近距離突入重視快速舉槍時可考慮RVG，連射穩定優先時考慮TDG。這是作者回報的修正值，不是本站測得的開鏡毫秒數。一次只換握把並保留其他配件，才能分辨快速瞄準與後座力的取捨，別將不同項目的百分比直接相加。",
        "4:08–5:38 — 瞄具同時影響畫面與瞄準表現。作者在說明欄保留光學鏡ADS數值的不確定性；1.5倍鏡名稱在自動字幕中也有不同拼法。請核對遊戲中的實際物品，別依誤寫名稱購買。 除了倍率，也檢查鏡框會不會擋住側邊目標。字幕名稱與目前選單不一致時，記錄遊戲內的確切名稱，不把讀音相近當成已確認同款。",
        "6:25–6:56、10:49–11:04 — 彈匣選擇取決於交戰時間及換彈機會。持續推進可能更需要容量，近戰則須考慮操作代價。AMP-9以20發彈匣為比較起點，購買時仍應確認當前物品。 比較容量時固定其他配件，記下第一輪交火實際用了幾發、何時能安全換彈，才能判斷較大彈匣是否幫助任務，而非只是增加用不到的容量。",
        "7:32–8:30 — 可用M4、AK-74的討論安排約40公尺對照：固定槍械、彈藥、位置及連射長度，每次更換一項配件並記錄、重複。作者偏好的組合不等於通用最強配裝。 把候選武器與配件放進配裝清單，依目前裝備介面核對價格與安裝可行性。換槍或換彈種就另開紀錄，再回到原配置確認是否能重現。",
        "13:10、18:36 — 作者承認LMG經驗有限，部分推薦來自偏好。14:33提到兩腳架未支撐時有輕微後座力代價，但未確定幅度。記錄自己的支撐狀態，這些觀察不足以改動傷害或TTK模型。 記錄兩腳架是收起、展開未架設，或穩定架設。別把作者對少數武器的體驗推廣成全部輕機槍的結論，能重現的條件才用於購買判斷。"
      ],
      "chapterTitles": [
        "握把控槍與操控取捨",
        "瞄具舉槍速度與視野",
        "彈匣容量與換彈機會",
        "固定條件比較M4與AK74",
        "兩腳架狀態與證據範圍"
      ]
    },
    "pl": {
      "title": "Dodatki WARDOGS: zastosuj porównania Evo4Fun",
      "answer": "Dobieraj dodatki do starcia: szybkość ADS, odrzut, pojemność i widoczność konkurują. Evo4Fun łączy dane wydobyte z gry, obserwacje na strzelnicy i własne preferencje o różnej pewności.",
      "notes": [
        "1:31–2:21 — Według danych odczytanych przez autora TDG zmniejsza pionowy odrzut o 30%, kosztem 10% szybkości ADS. RVG daje o pięć punktów procentowych mniej kontroli pionowej i o dwa mniej poziomej, lecz zwiększa szybkość ADS o 10%. RVG sprzyja szybkiemu wejściu, TDG stabilniejszej serii. To podane modyfikatory, nie nasze pomiary czasu celowania; jednoczesna zmiana kilku części ukrywa przyczynę różnicy.",
        "4:08–5:38 — Celownik zmienia obraz i celowanie. Autor zastrzega niepewność ADS optyki; napisy różnie zapisują nazwę celownika 1,5×. Sprawdź rzeczywisty przedmiot w menu zamiast kupować według błędnej transkrypcji.",
        "6:25–6:56 i 10:49–11:04 — Magazynek dobieraj do długości walki i możliwości przeładowania. Pojemność pomaga przy długim szturmie, lecz koszt obsługi ma znaczenie w zwarciu. Przykład AMP-9 zaczyna się od 20 nabojów; sprawdź aktualny przedmiot.",
        "7:32–8:30 — Fragment M4/AK-74 wykorzystaj do prób na około 40 metrach. Zachowaj broń, amunicję, pozycję i serię; zmieniaj jeden dodatek, zapisuj wynik i powtarzaj. Ulubiony zestaw autora nie jest zawsze najlepszy.",
        "13:10 i 18:36 — Autor przyznaje małe doświadczenie z LMG i osobiste preferencje. W 14:33 opisuje drobną karę odrzutu niepodpartego dwójnogu, bez określonej wartości. Zapisuj stan podparcia; obserwacja nie uzasadnia zmian obrażeń ani modelu TTK."
      ],
      "chapterTitles": [
        "Chwyty: kontrola a poręczność",
        "Celowniki: ADS i widoczność",
        "Pojemność i okazje do przeładowania",
        "M4 i AK74 w tych samych warunkach",
        "Stan dwójnogu i granice dowodów"
      ]
    }
  },
  "z7wMLQQtIIM": {
    "en": {
      "title": "WARDOGS solo/duo FOB: Wake Up's layout and re-entry limits",
      "answer": "This compact firing-range build combines a sealed FOB, shelter, mortar pit and Talon. Copy its supply and access planning before copying the walls: the author shows awkward door access, and a sealed base creates a real recovery cost after death.",
      "notes": [
        "0:00 — The proposed initial run uses one transport, one building-supply pallet and one ammunition pallet. This is the author's demonstrated starting plan, not a universal bill of materials. Confirm current unlocks, supplies and terrain before buying; firing-range construction is faster than a live match.",
        "3:41 — Follow the demonstrated order: raised outer walls, indirect-fire shelter, then a Recon tower with its ladder facing inward. The early wall sequence uses three pieces per side (1:40); at 2:38 a wall placed too far forward prevents the corner from snapping, so align the preview and close the gap before completing it. Keep doors open while working, add the upper Hesco pieces, then place the mortar pit at 7:27. This is an order of operations, not a counted total-material bill.",
        "9:21–11:25 — Build the Talon from the edge, not standing on the unfinished object: the author warns of being pushed into the surrounding blocks. The side pockets are intended as escape cover; test climbing back out instead of assuming that a visually enclosed pocket is usable.",
        "14:07–14:44 — The door is an escape hatch, not a reliable entrance; the wall and door can trap the player. The description also says death recovery needs a parachute or dismantling and rebuilding a Hesco access point. Budget a hammer, replacement materials and a second person's access plan. Use the small staircase to enter the Talon position instead. At 18:17–18:41 the author finds the rear sandbag prevents climbing and leaves it one build stage lower; preserve that climb route before adding more head cover.",
        "15:01–18:41 — Extra head cover can obstruct low-angle Talon shots and climbing. The claimed mortar reach is a single layout observation, not a terrain or collision guarantee. Use the map and logistics planner for supply and route planning; confirm firing arcs, exits and resupply in the current build before treating this as a defended live FOB."
      ],
      "chapterTitles": [
        "Transport and starting supplies",
        "Build order and a usable supply route",
        "Finish the Talon without trapping yourself",
        "The exit door and returning after death",
        "Cover, firing arcs and resupply checks"
      ]
    },
    "de": {
      "title": "WARDOGS Solo-/Duo-FOB: Wake Ups Bauplan und Zugangskosten",
      "answer": "Der Schießstand-Bau verbindet geschlossene FOB, Unterstand, Mörser und Talon. Übernimm zuerst Versorgung und Zugang: Der Autor zeigt problematische Türen, und nach dem Tod verursacht die geschlossene Basis echte Rückkehrkosten.",
      "notes": [
        "0:00 — Ein Transport, eine Baumaterialpalette und eine Munitionspalette sind der gezeigte Startplan, keine allgemeine Stückliste. Prüfe Freischaltungen, Vorräte und Gelände. Am Schießstand geht der Bau schneller als im Match.",
        "3:41 — Gezeigte Reihenfolge: erhöhte Außenwände, Schutzraum gegen indirektes Feuer, dann Recon-Turm mit Leiter nach innen. Der erste Wandabschnitt nutzt drei Teile je Seite (1:40). Bei 2:38 verhindert eine zu weit vorn gesetzte Wand das Einrasten der Ecke: Vorschau ausrichten und Lücke schließen, bevor fertiggebaut wird. Türen während der Arbeit offenlassen, obere Hesco ergänzen, dann bei 7:27 den Mörserplatz setzen. Keine vollständig gezählte Materialliste.",
        "9:21–11:25 — Baue den Talon vom Rand, nicht auf dem unfertigen Objekt: Laut Autor kann man in die Blöcke gedrückt werden. Seitentaschen sollen Fluchtdeckung bieten; prüfe auch das Heraussteigen.",
        "14:07–14:44 — Die Tür ist ein Fluchtausgang, kein zuverlässiger Eingang; Wand und Tür können festklemmen. Nach dem Tod verlangt die Beschreibung Fallschirm oder Abbau und Neubau eines Hesco-Zugangs. Plane Hammer, Ersatzmaterial und Partnerzugang ein. Nutze stattdessen die kleine Treppe zum Talon. Bei 18:17–18:41 blockiert der hintere Sandsack das Klettern; der Autor lässt ihn eine Baustufe niedriger. Den Kletterweg vor zusätzlichem Kopfschutz freihalten.",
        "15:01–18:41 — Zusätzlicher Kopfschutz kann flache Talon-Schüsse und Klettern behindern. Die genannte Mörserreichweite ist eine Layout-Beobachtung, keine Gelände- oder Kollisionsgarantie. Prüfe mit Karte und Logistikplanung Nachschub, Schusswinkel und Ausgänge vor dem Live-Einsatz."
      ],
      "chapterTitles": [
        "Transport und Startvorräte",
        "Baufolge und nutzbarer Versorgungsweg",
        "Talon fertigstellen, ohne sich einzuschließen",
        "Ausgangstür und Rückkehr nach dem Tod",
        "Deckung, Schussfeld und Nachschub prüfen"
      ]
    },
    "ru": {
      "title": "FOB для одного или двоих: схема Wake Up и цена возвращения",
      "answer": "Постройка на полигоне объединяет закрытую FOB, укрытие, миномёт и Talon. Сначала планируйте снабжение и вход: автор показывает проблемы с дверью, а закрытая база усложняет возвращение после смерти.",
      "notes": [
        "0:00 — Один транспорт, поддон стройматериалов и поддон боеприпасов — показанный стартовый план, не универсальная смета. Проверьте открытия, запасы и местность. На полигоне строительство быстрее, чем в матче.",
        "3:41 — Порядок показанного строительства: поднятые внешние стены, укрытие от непрямого огня, затем Recon-башня лестницей внутрь. Начальный участок использует три детали с каждой стороны (1:40). В 2:38 стена слишком выдвинута и мешает привязке угла: выровняйте предварительное размещение и закройте щель до завершения стройки. Двери пока открыты, затем верхние Hesco и в 7:27 миномётная позиция. Это порядок работ, не полный подсчёт материалов.",
        "9:21–11:25 — Стройте Talon с края, не стоя на незавершённой установке: автор предупреждает о застревании в блоках. Боковые карманы предназначены для отхода; проверьте, что из них можно выбраться.",
        "14:07–14:44 — Дверь служит аварийным выходом, а не надёжным входом: у стены можно застрять. После смерти описание предлагает парашют или разборку и восстановление входа через Hesco. Оставьте молоток, материалы и доступ для напарника. Входите к Talon по маленькой лестнице. В 18:17–18:41 задний мешок мешает подъёму, и автор оставляет его на одну строительную ступень ниже. Не перекрывайте путь дополнительной защитой головы.",
        "15:01–18:41 — Защита головы может перекрывать низкие выстрелы Talon и мешать подъёму. Заявленная дальность миномёта относится к одной схеме, а не гарантирует отсутствие столкновений. Планируйте снабжение на карте и проверяйте сектора огня, выходы и пополнение в текущей версии."
      ],
      "chapterTitles": [
        "Транспорт и начальные запасы",
        "Порядок стройки и путь снабжения",
        "Достроить Talon и не застрять",
        "Выход и возвращение после смерти",
        "Укрытие, сектор огня и пополнение"
      ]
    },
    "pt-br": {
      "title": "FOB solo/dupla: projeto de Wake Up e limites de reentrada",
      "answer": "A construção no campo de tiro reúne FOB fechada, abrigo, morteiro e Talon. Copie primeiro o plano de suprimentos e acesso: o autor mostra uma porta problemática, e morrer cria um custo real para voltar à base.",
      "notes": [
        "0:00 — Um transporte, um palete de construção e um de munição são o plano inicial demonstrado, não uma lista universal de materiais. Confira desbloqueios, estoque e terreno. A construção no campo de tiro é mais rápida que na partida.",
        "3:41 — Siga a ordem mostrada: paredes externas elevadas, abrigo contra fogo indireto e torre Recon com escada para dentro. O trecho inicial usa três peças por lado (1:40). Em 2:38 uma parede adiantada impede o encaixe do canto: alinhe a prévia e feche a fresta antes de concluir. Deixe portas abertas durante o trabalho, acrescente Hesco superiores e só então coloque o morteiro em 7:27. É uma sequência de construção, não a contagem total de material.",
        "9:21–11:25 — Construa o Talon pela borda, sem ficar sobre o objeto incompleto: o autor alerta que você pode ficar preso nos blocos. Os bolsões laterais servem como fuga; teste também a subida para sair deles.",
        "14:07–14:44 — A porta funciona como saída, não entrada confiável; parede e porta podem prender o jogador. A descrição exige paraquedas ou desmontar e reconstruir um acesso de Hesco após morrer. Reserve martelo, materiais e uma rota para a dupla. Entre no Talon pela pequena escada. Em 18:17–18:41 o saco de areia traseiro impede a subida, e o autor o deixa um estágio de construção abaixo. Preserve a rota de escalada antes de ampliar a proteção da cabeça.",
        "15:01–18:41 — Cobertura extra pode bloquear tiros baixos do Talon e a escalada. O alcance citado do morteiro é observação de um projeto, não garantia de terreno ou colisão. Use mapa e logística para planejar reposição e confira arcos, saídas e acesso na versão atual."
      ],
      "chapterTitles": [
        "Transporte e suprimentos iniciais",
        "Ordem de construção e acesso logístico",
        "Concluir o Talon sem ficar preso",
        "Porta de saída e retorno após morrer",
        "Cobertura, campo de tiro e reabastecimento"
      ]
    },
    "ja": {
      "title": "WARDOGS ソロ・デュオFOB：Wake Upの構成と再入場の弱点",
      "answer": "射撃場で作る密閉FOBに、シェルター、迫撃砲、Talonを組み合わせた構成です。壁の形より先に補給と出入りを考えましょう。動画には扉の引っ掛かりがあり、死亡後に戻る手段も必要です。",
      "notes": [
        "0:00 — 輸送車両1台、建築資材1パレット、弾薬1パレットが作者の開始案です。万能な資材表ではありません。アンロック、在庫、地形を確認し、射撃場では実戦より建築が速い点も考慮します。 この開始案から実戦で必要な購入金額や運搬回数まで確定することはできません。出発前に受け手、荷下ろし地点、建築用と弾薬用の荷物を確認し、補給車を失った場合に続行するか撤退するかも決めます。",
        "3:41 — 動画の順序は高くした外壁、間接射撃用シェルター、梯子を内側へ向けたReconタワーです。最初の外壁では各辺3個と説明しています（1:40）。2:38では先に置いた壁が前へ出すぎて角がスナップせず、まだ完成させていなかったため、左の壁に合わせて隙間を埋め直せています。プレビューで角を合わせてから建て、作業中は扉を開けておきます。上側のHescoを追加した後、7:27で迫撃砲の位置を決めます。これは実際の工程であり、全体の資材数を数え終えた一覧ではありません。",
        "9:21–11:25 — Talonは未完成の本体に乗らず端から建てます。周囲のブロックに押し込まれる危険を作者が説明しています。横の退避スペースは入るだけでなく、登って戻れるかも試してください。 完成した構造物がプレイヤーの足元や退避路をふさぐ可能性を確認します。相方がいる場合は外から経路を見てもらい、閉じ込められた時に何を撤去するかを完成前に相談しておくと復旧を判断しやすくなります。",
        "14:07–14:44 — 扉は脱出用で、安定した入口ではありません。壁との間に引っ掛かります。説明欄では死亡後の再入場にパラシュートかHescoの撤去・再建が必要とされています。ハンマー、予備資材、相方の経路を確保します。 死亡して装備を失った後も同じ経路で戻れるとは限りません。外側から入場を試し、撤去と再建に必要な道具を再取得できるかを確認してください。出口が一度使えたことを、繰り返し入れる入口の証拠にはしません。 Talonへ入るときは小さな階段を使います。18:17–18:41では後方の土嚢で登れなくなり、作者は一段低い施工状態に戻しています。頭部の遮蔽を増やす前に、退避場所から上がる経路を残してください。",
        "15:01–18:41 — 頭部を守る追加遮蔽は低角度のTalon射撃や登り動作を妨げます。迫撃砲の到達距離はこの構成での観察であり地形・衝突の保証ではありません。マップと補給プランナーを使い、現行版で射界、出口、補給口を確認します。 最後に射撃と補給を別々に試し、遮蔽物を追加するたびに同じ確認を繰り返します。低い目標へ撃てない場合は計算機の数値を変える前に、砲身の前や足元の構造物が射線を遮っていないか調べます。"
      ],
      "chapterTitles": [
        "輸送手段と初期物資",
        "建築順序と補給経路",
        "Talon完成時の閉じ込めを防ぐ",
        "脱出用の扉と死亡後の再入場",
        "遮蔽物・射界・補給口の確認"
      ]
    },
    "zh-cn": {
      "title": "WARDOGS 单双人 FOB：Wake Up 布局与重新入场代价",
      "answer": "这套靶场演示结合封闭 FOB、掩体、迫击炮坑和 Talon。先学补给与进出规划，再照搬墙体：作者明确展示了门口卡人，封闭基地也会增加死亡后返回的成本。",
      "notes": [
        "0:00 — 作者以一辆运输车、一板建材和一板弹药为起步方案，不代表所有地形与版本的固定材料清单。购买前核对解锁、资源和地形；靶场的建造速度也比实际对局更快。 起步物资并不能直接推出实战总造价或运输次数。出发前确认接货人、卸货位置、建材与弹药分工，也决定补给车损失后是继续还是撤退。",
        "3:41 — 实际顺序是抬高外墙、间接火力掩体、梯子朝内的Recon塔。前面1:40的外墙步骤是每侧三块；2:38因为第一面墙放得太靠前，墙角无法吸附。作者没有先把全部墙建完，而是重新对齐左墙并补缝，这能避免拆掉成品返工。施工时门保持打开，再补上层Hesco，最后到7:27安放迫击炮坑。先做外壳和施工通路，再封闭入口，而不是照完成截图一次封死所有位置。这里给的是源视频的建造顺序，不是假造精确总材料清单。",
        "9:21–11:25 — 从边缘建造 Talon，不要站在尚未完工的本体上，作者警告可能被推入周围方块。侧边凹位用于紧急躲避，但要测试能否爬回，不要认为看着封闭就一定好用。 检查完工物体会不会挤占脚下与退路。有队友时让其从外侧观察，提前约定卡住后撤掉哪一块，避免封闭完成才发现无处恢复。",
        "14:07–14:44 — 那扇门更适合作为逃生口，不是可靠入口；墙体和门会让玩家卡住。描述还要求死亡后用降落伞回入，或锤拆 Hesco 再重建入口。需预留锤子、补墙材料和队友的进出安排。 阵亡丢装后未必还能走原路径回来，应从外侧测试重新进入，并确认能再次取得拆建工具。门成功出去一次，不等于它是可靠的重复入口。 Talon入口改走小阶梯。18:17–18:41作者发现后侧沙袋建高后无法攀回去，便保留低一阶的施工状态；加头部掩护之前先保住从躲避处返回炮位的路线。",
        "15:01–18:41 — 增加头部掩体可能挡住 Talon 的低角度射击和攀爬。视频中的迫击炮射程是单个布局观察，不能当作地形与碰撞保证。地图和物流工具用于规划补给，实际仍应在当前版本测试射界、出口和回补路线。 射击与补给分别验收，每次加掩体后复测。打不到低处目标时，先检查炮口和脚下建筑挡线，不要把建筑碰撞当成计算器需要修正的距离。"
      ],
      "chapterTitles": [
        "运输工具与起步物资",
        "施工顺序与补给通道",
        "避免完工时被Talon卡住",
        "出口门与阵亡后的再进入",
        "掩体射界与补给检查"
      ]
    },
    "zh-tw": {
      "title": "WARDOGS 單雙人FOB：Wake Up配置與重新進入的代價",
      "answer": "這套靶場示範結合封閉FOB、掩體、迫擊砲陣地與Talon。先學補給及出入規劃，再仿照牆體：作者展示了門口卡人，封閉基地也增加死亡後返回的成本。",
      "notes": [
        "0:00 — 作者用一輛運輸車、一板建材和一板彈藥作為起步方案，不代表各種地形與版本的固定材料表。購買前核對解鎖、資源與地形；靶場建造也比實戰更快。 起始物資不能直接推出實戰總造價或運輸次數。出發前確認收貨人、卸貨位置、建材與彈藥分工，也決定補給車損失後要繼續還是撤退。",
        "3:41 — 實際順序是抬高外牆、間接火力掩體、梯子朝內的Recon塔。1:40外牆步驟為每側三塊；2:38第一面牆放得太前面，牆角無法吸附。作者沒有先把牆全部建完，而是重新對齊左牆並補縫，避免拆成品重做。施工時保持開門，再補上層Hesco，到7:27才放迫擊砲坑。先完成外殼與施工通道，再封閉入口，別依完工截圖一次封死。這是原影片的施工順序，不是杜撰精確總材料表。",
        "9:21–11:25 — 請從邊緣建造Talon，別站在未完工的本體上，作者提醒可能被推入周圍方塊。側邊凹位用來緊急躲避，也要確認爬得回來，不能只看外觀判斷安全。 檢查完工物件是否擠占腳下與退路。有隊友時請他從外側觀察，先約定卡住後拆哪一塊，別等全部封閉才發現無法恢復。",
        "14:07–14:44 — 那扇門較適合作為逃生口，不是可靠入口；牆與門可能卡住玩家。說明欄也要求死亡後用降落傘進入，或拿鎚子拆掉Hesco再重建。須保留工具、補牆材料及隊友的出入安排。 陣亡失去裝備後未必還能走原路回來，應從外側測試重新進入，並確認能再取得拆建工具。門成功出去一次，不等於它是可靠的重複入口。 Talon入口改走小階梯。18:17–18:41後側沙袋加高後爬不回去，作者便保留低一階的施工狀態；增加頭部掩護前，先保住從躲避處返回砲位的路線。",
        "15:01–18:41 — 增加頭部掩體可能擋住Talon低角度射擊與攀爬。影片的迫擊砲射程只是該配置的觀察，不是地形與碰撞保證。地圖及物流工具協助規劃，仍需在當前版本檢查射界、出口與補給動線。 射擊與補給分開驗收，每次加掩體後重測。打不到低處目標時，先檢查砲口與腳下建築擋線，別把建築碰撞當成計算機距離需要修正。"
      ],
      "chapterTitles": [
        "運輸工具與起始物資",
        "施工順序與補給通道",
        "避免完工時被Talon卡住",
        "出口門與陣亡後的重新進入",
        "掩體射界與補給檢查"
      ]
    },
    "pl": {
      "title": "FOB solo/duo: układ Wake Up i koszt powrotu",
      "answer": "Projekt ze strzelnicy łączy zamkniętą FOB, schron, moździerz i Talon. Najpierw zaplanuj dostawy i wejście: autor pokazuje blokującą się drogę, a śmierć utrudnia powrót do zamkniętej bazy.",
      "notes": [
        "0:00 — Jeden transport, paleta materiałów i paleta amunicji to pokazany plan startowy, nie uniwersalna lista zakupów. Sprawdź odblokowania, zapasy i teren. Na strzelnicy budowanie jest szybsze niż w meczu.",
        "3:41 — Pokazana kolejność to podwyższone ściany, schron przeciw ostrzałowi pośredniemu i wieża Recon z drabiną do środka. Początkowy odcinek ma trzy elementy na stronę (1:40). W 2:38 zbyt wysunięta ściana blokuje dopasowanie narożnika: wyrównaj podgląd i zamknij szczelinę przed ukończeniem. Drzwi zostają otwarte na czas prac; później górne Hesco i stanowisko moździerza w 7:27. To kolejność działań, nie pełny spis materiałów.",
        "9:21–11:25 — Buduj Talona z krawędzi, bez stania na nieukończonym obiekcie: autor ostrzega przed wepchnięciem w bloki. Boczne wnęki służą do ucieczki; sprawdź, czy potrafisz z nich wyjść.",
        "14:07–14:44 — Drzwi są wyjściem awaryjnym, nie pewnym wejściem; można utknąć przy ścianie. Opis wymaga po śmierci spadochronu albo rozebrania i odbudowania przejścia Hesco. Zostaw młotek, materiały i drogę partnerowi. Do Talona wejdź małymi schodkami. W 18:17–18:41 tylny worek blokuje wspinanie, więc autor zostawia go o etap budowy niżej. Zachowaj powrót z osłony, zanim podniesiesz ochronę głowy.",
        "15:01–18:41 — Dodatkowa osłona głowy może blokować niski strzał Talona i wspinanie. Zasięg moździerza pochodzi z jednego układu, nie gwarantuje braku kolizji. Planuj dostawy na mapie i sprawdź sektory ostrzału, wyjścia oraz uzupełnianie w bieżącej wersji."
      ],
      "chapterTitles": [
        "Transport i zapasy początkowe",
        "Kolejność budowy i droga dostaw",
        "Dokończ Talon bez uwięzienia operatora",
        "Wyjście i powrót po śmierci",
        "Osłona, pole ostrzału i uzupełnianie"
      ]
    }
  },
  "j7hJXEXo5U8": {
    "en": {
      "title": "WARDOGS after the IR hotfix: spotting, anti-air and Gold",
      "answer": "The October 2 hotfix already changed IR purchases and CIWS/Havoc balance. Airwingmarine's newer video adds his experience of movement and target spotting; its Gold-price theory and future-season predictions remain commentary.",
      "notes": [
        "0:30 — IR Rangefinders were disabled in the vendor until Season 2. Regional and community-server restart timing explains the uneven rollout; a range item appearing in a menu was not proof that it could be purchased in a match. Check the live vendor before spending on an unlock.",
        "4:32 — The announced CIWS-versus-Havoc time moved from roughly 12 to 6 seconds. That is a balance reference, not a guaranteed kill time for moving targets with missed shots or interrupted line of sight. Plan coverage, ammunition and a fallback rather than exposing the operator to chase the number.",
        "6:52–10:22 — The author reports fewer constant marks and more room to move and flank. At 9:41 he connects less spotting to fewer immediate mortar/artillery targets. Treat this as player observation: break line of sight, change position after firing and ask a spotter for a fresh target before using calculator output.",
        "11:06–16:47 — The chart discussion mixes historical price observations with a theory about total player cash. He explicitly calls it a guess at 15:47. Do not convert it into a guaranteed price formula or tomorrow's forecast; use the current exchange quote, a spending reserve and the official wipe rules.",
        "17:00–21:58 — The interview recap includes proposed weapons, parachutes and helmet visibility. The source interview does not date every change, and ammo examples are speculative. Gold-store rotation is different from confiscating an owned cosmetic; use the maintained Season 2 and Gold Market pages for the decision."
      ],
      "chapterTitles": [
        "IR purchase removal and server restarts",
        "CIWS and Havoc: timing is not ammunition",
        "Movement when persistent marks decline",
        "Gold-price theory is not a forecast",
        "Separate interview proposals from releases"
      ]
    },
    "de": {
      "title": "WARDOGS nach dem IR-Hotfix: Aufklärung, Flugabwehr und Gold",
      "answer": "Der Hotfix vom 2. Oktober änderte bereits IR-Käufe und CIWS/Havoc. Airwingmarine ergänzt Erfahrungen zu Bewegung und Markierungen. Seine Goldpreis-Theorie und Saisonprognosen bleiben Kommentare.",
      "notes": [
        "0:30 — IR-Entfernungsmesser wurden bis Saison 2 beim Händler deaktiviert. Unterschiedliche Neustarts erklären die gestaffelte Umstellung; ein Menüeintrag beweist keine Kaufbarkeit im Match. Prüfe den Händler vor einer Freischaltung.",
        "4:32 — Der angekündigte CIWS-Wert gegen Havoc wechselte von etwa zwölf auf sechs Sekunden. Das garantiert keine Abschusszeit bei Bewegung, Fehlschüssen oder verdecktem Ziel. Plane Deckung, Munition und Rückzug.",
        "6:52–10:22 — Der Autor berichtet von weniger ständigen Markierungen und mehr Raum zum Flankieren. Bei 9:41 verbindet er das mit weniger direkten Mörserzielen. Das ist eine Spielerbeobachtung: Sichtkontakt brechen, nach Schüssen verlegen und neue Zieldaten anfordern.",
        "11:06–16:47 — Historische Goldkurse werden mit einer Theorie zur gesamten Spielergeldmenge vermischt. Bei 15:47 nennt er sie ausdrücklich eine Vermutung. Daraus folgt keine Preisformel oder sichere Prognose. Nutze den aktuellen Kurs, eine Geldreserve und offizielle Wipe-Regeln.",
        "17:00–21:58 — Die Zusammenfassung behandelt geplante Waffen, Fallschirme und Helmsicht. Nicht jede Änderung ist datiert; Munitionsbeispiele sind spekulativ. Shop-Rotation bedeutet nicht die Beschlagnahme eigener Kosmetik. Nutze die gepflegten Saison-2- und Goldmarkt-Seiten."
      ],
      "chapterTitles": [
        "IR-Verkaufsstopp und Serverneustarts",
        "CIWS gegen Havoc: Zeit statt Schusszahl",
        "Bewegung bei weniger Dauermarkierungen",
        "Goldpreis-Theorie ist keine Prognose",
        "Interviewpläne von Veröffentlichungen trennen"
      ]
    },
    "ru": {
      "title": "WARDOGS после IR-хотфикса: разведка, ПВО и золото",
      "answer": "Хотфикс 2 октября уже изменил покупку IR и баланс CIWS/Havoc. Airwingmarine добавляет свой опыт перемещения и обнаружения. Теория цены золота и прогнозы сезона остаются мнением автора.",
      "notes": [
        "0:30 — IR-дальномер отключили у продавца до сезона 2. Разное время перезапуска серверов объясняет постепенное внедрение; наличие пункта меню не доказывает возможность покупки в матче. Проверьте продавца до оплаты открытия.",
        "4:32 — Объявленное время CIWS против Havoc изменилось примерно с 12 до 6 секунд. Оно не гарантирует результат по движущейся цели при промахах и потере видимости. Планируйте прикрытие, боезапас и отход.",
        "6:52–10:22 — Автор отмечает меньше постоянных меток и больше возможностей обхода. В 9:41 он связывает это с меньшим числом целей для миномётов. Это наблюдение игрока: разрывайте обзор, меняйте позицию после огня и запрашивайте свежую цель.",
        "11:06–16:47 — Исторические цены сопровождаются теорией об общей денежной массе игроков. В 15:47 автор прямо называет её догадкой. Это не формула и не прогноз завтрашней цены. Используйте текущую котировку, резерв денег и официальные правила вайпа.",
        "17:00–21:58 — Пересказ включает предложенные оружие, парашюты и обзор шлема. Не всем изменениям назначена дата, примеры боеприпасов предположительны. Ротация магазина не равна изъятию купленной косметики; сверяйтесь со страницами сезона 2 и золотого рынка."
      ],
      "chapterTitles": [
        "Отключение покупки IR и рестарты",
        "CIWS против Havoc: время, не боезапас",
        "Движение при меньшем числе отметок",
        "Теория цены золота не прогноз",
        "Отделяйте идеи интервью от релиза"
      ]
    },
    "pt-br": {
      "title": "WARDOGS após o hotfix IR: marcações, antiaérea e ouro",
      "answer": "O hotfix de 2 de outubro já alterou a compra do IR e o equilíbrio CIWS/Havoc. Airwingmarine acrescenta experiências de movimentação e marcação. Sua teoria do preço do ouro e previsões continuam sendo opinião.",
      "notes": [
        "0:30 — O Telêmetro IR foi desativado no vendedor até a Temporada 2. Reinícios diferentes explicam a aplicação gradual; aparecer no menu não provava que era comprável na partida. Confira o vendedor antes de pagar o desbloqueio.",
        "4:32 — O tempo anunciado de CIWS contra Havoc passou de cerca de 12 para 6 segundos. Não é garantia contra alvo móvel, tiros perdidos ou linha de visão interrompida. Planeje cobertura, munição e retirada.",
        "6:52–10:22 — O autor relata menos marcações constantes e mais espaço para flanquear. Aos 9:41 relaciona isso a menos alvos imediatos para morteiros. É observação de jogador: quebre a visão, mude após atirar e peça uma posição atualizada ao observador.",
        "11:06–16:47 — Preços históricos aparecem junto a uma teoria sobre o dinheiro total dos jogadores. Aos 15:47 ele a chama explicitamente de palpite. Não use como fórmula ou previsão garantida: confira cotação atual, reserva de dinheiro e regras oficiais do wipe.",
        "17:00–21:58 — O resumo cita propostas de armas, paraquedas e visor. Nem toda mudança tem data, e exemplos de munição são especulação. Rotação da loja não significa confiscar cosméticos comprados; confira as páginas mantidas de Temporada 2 e Loja de Ouro."
      ],
      "chapterTitles": [
        "Retirada do IR e reinícios de servidor",
        "CIWS e Havoc: tempo, não munição",
        "Movimento com menos marcações constantes",
        "Teoria do preço do ouro não é previsão",
        "Separar propostas e mudanças publicadas"
      ]
    },
    "ja": {
      "title": "WARDOGS IR修正後：索敵・対空・ゴールドをどう考えるか",
      "answer": "10月2日の修正でIR購入とCIWS対Havocの調整は実施済みです。Airwingmarineは移動やマーキングの体感を追加していますが、金価格の理論や次期変更の予測は作者の見解です。",
      "notes": [
        "0:30 — IRレンジファインダーはシーズン2まで販売停止になりました。サーバー再起動の時差が段階的な反映を説明します。メニュー表示だけで試合中に買えるとは限らないため、アンロック費用を払う前に販売欄を確認します。 ショップに残る表示と購入処理が通ることを分けて確認します。プレイしているサーバーの状態と日時を記録すれば、別地域の動画や更新前の画面だけを見て購入可能だと誤解するのを避けられます。",
        "4:32 — 公表されたCIWS対Havocの時間は約12秒から6秒になりました。移動目標、外れ弾、視線切れを含む実戦の撃破保証ではありません。カバー、弾薬、退避経路を優先します。 約6秒という説明は発射弾数ではなく、公表された調整の時間です。防空の費用を考える時は、撃ち始めるまでの移動、目標を見続けられる場所、補給の可否も含め、交戦中の一部分だけで収益を比較しないでください。",
        "6:52–10:22 — 作者は常時マークが減り、移動や側面攻撃がしやすくなったと述べ、9:41で迫撃砲の即時目標減少につなげています。これは体感です。視線を切り、発砲後に移動し、計算結果を使う前に観測手から新しい位置を受け取ります。 敵のマーキングが減ったという感想は、自分が発見されなくなった証拠ではありません。観測地点が危険になったら移動し、味方の射撃が終わるまで同じ場所で安全だと決めつけない運用にします。",
        "11:06–16:47 — 過去の金価格と全プレイヤーの現金量に関する仮説が混ざっています。15:47では本人が推測だと明言します。価格式や翌日の確定予測にはせず、現在の交換価格、予備資金、公式ワイプルールで判断します。 交換前には目標の必要ゴールドと所持数を比べ、足りない分だけを現在の見積もりで検討します。過去のグラフが上向いたことや作者の予想だけを根拠に、補充用の現金を使い切らないでください。",
        "17:00–21:58 — 武器、パラシュート、ヘルメット視野の案を要約していますが、すべてに実装日はなく弾薬例も推測です。販売ローテーションと購入済みコスメの没収を区別し、更新中のシーズン2・ゴールド市場ページを参照してください。 公式発表で実装が確認できた変更と、開発者が今後を語った部分を分けて読みます。リリース当日は価格、アンロック条件、弾薬を改めて確認し、古い購入表をそのまま最新の装備へ当てはめないようにします。"
      ],
      "chapterTitles": [
        "IR販売停止とサーバー再起動",
        "CIWS対Havocは弾数でなく時間",
        "常時マーク減少後の移動判断",
        "金価格の仮説と実際の購入判断",
        "インタビューの提案と実装を分ける"
      ]
    },
    "zh-cn": {
      "title": "WARDOGS IR热修之后：标记、防空和金条该怎么判断",
      "answer": "10月2日热修已改变 IR 购买和 CIWS 对 Havoc 的平衡。Airwingmarine 的新视频补充了移动与标记的实战体感；金价理论和未来赛季预测仍是作者观点。",
      "notes": [
        "0:30 — IR测距仪在商店停购至第二赛季。不同地区与社区服重启时间解释了分批生效，菜单中可见并不能证明对局里可购买。花钱解锁前应先核对当前商店。 分别确认商店仍显示该条目与实际能否完成购买。记录所处服务器和时间，避免拿另一地区或更新前截图当作自己当前可以购买的依据。",
        "4:32 — 公告中的 CIWS 对 Havoc 时间从约12秒调为约6秒。这不是目标移动、子弹落空或视线中断时的击杀保证。应安排掩护、弹药和撤退路线，不要为了追求秒数暴露操作手。 约6秒说的是公布的平衡时间，不是发射弹数。评估防空成本还要计入转场、建立视线和补给，不能只看已经开火后的一个理想片段。",
        "6:52–10:22 — 作者报告持续标记减少后更能移动、绕侧，9:41又把它与迫击炮、火炮即时目标减少联系起来。这是玩家观察：切断视线、开火后换位，并让观察手更新目标位置，再使用计算器结果。 作者感到标记变少，不等于自己不会被发现。观察点暴露后应移动，别因为一次绕侧成功，就假定友军射击结束前原地一直安全。",
        "11:06–16:47 — 金价图表讨论混合了历史观察与全体玩家现金量的假说。15:47作者明确承认这是猜测。不要把它做成固定价格公式或明日预测；决策应使用当前兑换报价、资金储备和官方删档规则。 兑换前核对目标需要的Gold与持有数量，只为缺口查看当前报价。过去价格走势与作者预期不能代替自己的补装储备和实际购买预算。",
        "17:00–21:58 — 访谈回顾涉及武器、降落伞与头盔视野提案，不是每项都有实施日，弹药举例也带有猜测。商品轮换不等于没收已拥有外观，购买决策应回到持续维护的第二赛季与 Gold Market 页面。 分开阅读官方确认已上线的改动与开发者讨论的未来方向。发布当天重新核对价格、解锁和弹药，不能把旧购买表直接套在新装备上。"
      ],
      "chapterTitles": [
        "IR停售与服务器重启",
        "CIWS对Havoc是时间而非弹数",
        "持续标记减少后的移动选择",
        "金价假说与实际购买决策",
        "区分访谈提案与已上线改动"
      ]
    },
    "zh-tw": {
      "title": "WARDOGS IR熱修後：標記、防空及金條如何判斷",
      "answer": "10月2日熱修已改動IR購買和CIWS對Havoc的平衡。Airwingmarine的新影片補充移動與標記的實戰感受；金價理論和下賽季預測仍屬作者觀點。",
      "notes": [
        "0:30 — IR測距儀在商店停售至第二賽季。各地與社群伺服器重啟時間不同，造成分批生效；選單可見不代表對局中能購買。支付解鎖費用前先確認當前商店。 分別確認商店仍顯示項目與實際能否完成購買。記錄所在伺服器及時間，避免把另一地區或更新前截圖當成自己目前可購買的依據。",
        "4:32 — 公告中的CIWS對Havoc時間從約12秒改為約6秒。目標移動、射失或視線中斷時並無擊殺保證。應規劃掩護、彈藥與撤退路線，別為了追求秒數暴露操作手。 約6秒指公布的平衡時間，不是發射彈數。評估防空成本也要計入轉場、建立視線和補給，不能只看已經開火後的一段理想情境。",
        "6:52–10:22 — 作者表示持續標記減少後更能移動及繞側，9:41又連結到迫擊砲、火砲即時目標減少。這是玩家觀察：切斷視線、開火後換位，並請觀測手更新位置再使用計算結果。 作者感到標記變少，不等於自己不會被發現。觀測點暴露後應移動，別因一次繞側成功，就假定友軍射擊結束前原地一直安全。",
        "11:06–16:47 — 金價討論混合歷史觀察與全體玩家現金量的假說。15:47作者明言只是猜測。不能當成固定價格公式或隔日預測；應依當前報價、資金預備及官方重置規則決策。 兌換前核對目標所需Gold和持有數量，只為缺口查看目前報價。過去價格走勢與作者預期，不能取代自己的補裝預備金和實際預算。",
        "17:00–21:58 — 訪談回顧包含武器、降落傘、頭盔視野提案，並非每項已有實施日，彈藥例子也屬推測。販售輪替不等於收回持有外觀，購買前應參考持續維護的第二賽季及黃金市場頁面。 分開閱讀官方確認已上線的調整與開發者討論的未來方向。更新當天重查價格、解鎖和彈藥，別把舊購買表直接套在新裝備上。"
      ],
      "chapterTitles": [
        "IR停售與伺服器重啟",
        "CIWS對Havoc是時間而非彈數",
        "持續標記減少後的移動選擇",
        "金價假說與實際購買決策",
        "區分訪談提案與已上線改動"
      ]
    },
    "pl": {
      "title": "WARDOGS po hotfiksie IR: oznaczanie, obrona i złoto",
      "answer": "Hotfix z 2 października już zmienił zakupy IR i balans CIWS/Havoc. Airwingmarine dodaje obserwacje ruchu i oznaczeń; teoria cen złota oraz prognozy pozostają komentarzem autora.",
      "notes": [
        "0:30 — Dalmierz IR wyłączono u sprzedawcy do sezonu 2. Różne restarty serwerów tłumaczą stopniowe wdrożenie; wpis w menu nie dowodzi możliwości zakupu w meczu. Sprawdź sprzedawcę przed opłatą za odblokowanie.",
        "4:32 — Ogłoszony czas CIWS przeciw Havoc zmieniono z około 12 do 6 sekund. Nie gwarantuje to wyniku przy ruchu, pudłach czy utracie widoczności. Planuj osłonę, amunicję i odwrót.",
        "6:52–10:22 — Autor zauważa mniej stałych oznaczeń i więcej miejsca na flankowanie. W 9:41 wiąże to z mniejszą liczbą celów dla moździerzy. To obserwacja gracza: zrywaj widoczność, zmieniaj pozycję po strzale i proś obserwatora o świeży cel.",
        "11:06–16:47 — Historyczne ceny mieszają się z teorią o łącznej gotówce graczy. W 15:47 autor nazywa ją domysłem. Nie jest to wzór ani pewna prognoza. Używaj bieżącego kursu, rezerwy i oficjalnych zasad resetu.",
        "17:00–21:58 — Omówienie wywiadu zawiera propozycje broni, spadochronów i wizjera. Nie każda zmiana ma datę, przykłady amunicji są spekulacją. Rotacja sklepu nie oznacza odebrania kupionych kosmetyków; sprawdź utrzymywane strony sezonu 2 i rynku złota."
      ],
      "chapterTitles": [
        "Wyłączenie zakupów IR i restarty",
        "CIWS i Havoc: czas, nie liczba pocisków",
        "Ruch przy mniejszej liczbie oznaczeń",
        "Teoria ceny złota to nie prognoza",
        "Oddzielaj propozycje wywiadu od wdrożeń"
      ]
    }
  }
};
