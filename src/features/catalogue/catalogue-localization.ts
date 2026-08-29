import type {Locale} from "@/config/site";
import type {CatalogGuide} from "@/features/items/item-catalog-guides";
import {getCatalogEntryCount} from "@/features/items/item-catalog-guides";
import {getLocalizedItemType} from "@/features/items/item-localization";
import {getItemType} from "@/features/items/item-library";
import type {CatalogueGroup, CatalogueRecord} from "./catalogue-types";

const sectionNames: Record<Exclude<Locale, "en">, Record<string, string>> = {
  ru: {"Assault Rifles":"Штурмовые винтовки", SMGs:"Пистолеты-пулеметы", "Shotguns and LMGs":"Дробовики и пулеметы", "Marksman and Sniper Rifles":"Марксманские и снайперские винтовки", "Bow, Sidearms, and Launchers":"Лук, пистолеты и пусковые установки", "Land Transport":"Наземный транспорт", "Armor and Artillery":"Бронетехника и артиллерия", Aircraft:"Авиация", "Every Calibre":"Все калибры", "Short Optics":"Прицелы малой кратности", "Medium Optics":"Прицелы средней кратности", "Captured Optics With Incomplete Tooltips":"Прицелы с неполными подсказками", Magazines:"Магазины", Helmets:"Шлемы", Armor:"Броня", Backpacks:"Рюкзаки", Offensive:"Наступательное", Medical:"Медицинское", "Recon and Vehicle Support":"Разведка и обслуживание транспорта", "Building and Utility":"Строительство и вспомогательные средства", "Budget Bands":"Уровни бюджета"},
  de: {"Assault Rifles":"Sturmgewehre", SMGs:"Maschinenpistolen", "Shotguns and LMGs":"Schrotflinten und leichte MGs", "Marksman and Sniper Rifles":"Präzisions- und Scharfschützengewehre", "Bow, Sidearms, and Launchers":"Bogen, Seitenwaffen und Werfer", "Land Transport":"Landtransport", "Armor and Artillery":"Panzerung und Artillerie", Aircraft:"Luftfahrzeuge", "Every Calibre":"Alle Kaliber", "Short Optics":"Optiken mit geringer Vergrößerung", "Medium Optics":"Optiken mit mittlerer Vergrößerung", "Captured Optics With Incomplete Tooltips":"Erfasste Optiken mit unvollständigen Angaben", Magazines:"Magazine", Helmets:"Helme", Armor:"Körperpanzerung", Backpacks:"Rucksäcke", Offensive:"Offensiv", Medical:"Medizinisch", "Recon and Vehicle Support":"Aufklärung und Fahrzeugunterstützung", "Building and Utility":"Bau und Hilfsmittel", "Budget Bands":"Budgetstufen"},
  "pt-br": {"Assault Rifles":"Fuzis de assalto", SMGs:"Submetralhadoras", "Shotguns and LMGs":"Escopetas e metralhadoras leves", "Marksman and Sniper Rifles":"Fuzis de precisão e de atirador", "Bow, Sidearms, and Launchers":"Arco, armas secundárias e lançadores", "Land Transport":"Transporte terrestre", "Armor and Artillery":"Blindados e artilharia", Aircraft:"Aeronaves", "Every Calibre":"Todos os calibres", "Short Optics":"Miras de curto alcance", "Medium Optics":"Miras de médio alcance", "Captured Optics With Incomplete Tooltips":"Miras registradas com dados incompletos", Magazines:"Carregadores", Helmets:"Capacetes", Armor:"Armaduras", Backpacks:"Mochilas", Offensive:"Ofensivo", Medical:"Médico", "Recon and Vehicle Support":"Reconhecimento e suporte a veículos", "Building and Utility":"Construção e utilidade", "Budget Bands":"Faixas de orçamento"},
  ja: {"Assault Rifles":"アサルトライフル", SMGs:"サブマシンガン", "Shotguns and LMGs":"ショットガン・軽機関銃", "Marksman and Sniper Rifles":"マークスマン・スナイパーライフル", "Bow, Sidearms, and Launchers":"弓・サイドアーム・ランチャー", "Land Transport":"地上輸送車両", "Armor and Artillery":"装甲車両・砲兵", Aircraft:"航空機", "Every Calibre":"全口径", "Short Optics":"低倍率サイト", "Medium Optics":"中倍率サイト", "Captured Optics With Incomplete Tooltips":"情報が不完全な確認済みサイト", Magazines:"マガジン", Helmets:"ヘルメット", Armor:"ボディアーマー", Backpacks:"バックパック", Offensive:"攻撃装備", Medical:"医療装備", "Recon and Vehicle Support":"偵察・車両支援", "Building and Utility":"建築・汎用装備", "Budget Bands":"予算区分"}
};

const localeText = {
  ru: {count:(n:number,l:string)=>`${n} записей: ${l}`, description:(l:string)=>`Полный наблюдаемый каталог WARDOGS: ${l}. Сравнивайте модели, роли, цены сборки и доказательства без предположений о финальном балансе.`, disclaimer:"Данные сообщества из предрелизной сборки. Цена, разблокировка, баланс и доступность могут измениться до раннего доступа.", section:(s:string,l:string)=>`${s}: наблюдаемые модели и значения для категории «${l}». Все числа относятся к указанной тестовой сборке.`, insight:(l:string)=>[`Категория «${l}» должна выбираться под конкретную роль, бюджет и план снабжения.`,"Наблюдаемые значения помогают сравнивать варианты, но не являются окончательной таблицей баланса.","Дорогой выбор оправдан только тогда, когда отряд может использовать и поддерживать его в бою."], unknown:(l:string)=>[`Финальные характеристики категории «${l}» для раннего доступа не подтверждены.`,"Цены, прогресс, доступность и баланс могут измениться после обновления сборки.","Неуказанное значение не следует восстанавливать по одному видео или скриншоту."], asOf:"Alpha 1 — 7 августа 2026", sources:["WARDOGS в Steam","Страница WARDOGS на Team17","Страница WARDOGS на BULKHEAD"]},
  de: {count:(n:number,l:string)=>`${n} Einträge: ${l}`, description:(l:string)=>`Vollständiger beobachteter WARDOGS-Katalog für ${l}. Vergleiche Modelle, Rollen, Preise der Testversion und Belege ohne Annahmen zur endgültigen Balance.`, disclaimer:"Von der Community beobachtete Vorabdaten. Preise, Freischaltungen, Balance und Verfügbarkeit können sich vor dem Early Access ändern.", section:(s:string,l:string)=>`${s}: beobachtete Modelle und Werte für ${l}. Alle Zahlen beziehen sich auf die angegebene Testversion.`, insight:(l:string)=>[`Wähle ${l} nach klarer Rolle, Budget und Versorgungsplan.`,"Beobachtete Werte ermöglichen Vergleiche, sind aber keine endgültige Balancetabelle.","Eine teure Wahl lohnt sich nur, wenn der Trupp sie im Einsatz unterstützen und versorgen kann."], unknown:(l:string)=>[`Die endgültigen Early-Access-Werte für ${l} sind nicht bestätigt.`,"Preise, Fortschritt, Verfügbarkeit und Balance können sich mit neuen Versionen ändern.","Fehlende Werte dürfen nicht aus einem einzelnen Video oder Bild ergänzt werden."], asOf:"Alpha 1 — 7. August 2026", sources:["WARDOGS auf Steam","WARDOGS bei Team17","WARDOGS bei BULKHEAD"]},
  "pt-br": {count:(n:number,l:string)=>`${n} registros de ${l}`, description:(l:string)=>`Catálogo completo observado de WARDOGS para ${l}. Compare modelos, funções, preços da build e evidências sem presumir o balanceamento final.`, disclaimer:"Dados de pré-lançamento observados pela comunidade. Preços, desbloqueios, balanceamento e disponibilidade podem mudar antes do Acesso Antecipado.", section:(s:string,l:string)=>`${s}: modelos e valores observados para ${l}. Todos os números pertencem à build de teste indicada.`, insight:(l:string)=>[`Escolha ${l} de acordo com uma função, orçamento e plano de suprimento claros.`,"Valores observados ajudam na comparação, mas não são uma tabela final de balanceamento.","Uma opção cara só compensa quando o esquadrão consegue usá-la e sustentá-la em combate."], unknown:(l:string)=>[`Os valores finais de ${l} no Acesso Antecipado não foram confirmados.`,"Preços, progressão, disponibilidade e balanceamento podem mudar com novas builds.","Um valor ausente não deve ser inventado a partir de um único vídeo ou imagem."], asOf:"Alpha 1 — 7 de agosto de 2026", sources:["WARDOGS na Steam","Página de WARDOGS na Team17","Página de WARDOGS na BULKHEAD"]},
  ja: {count:(n:number,l:string)=>`${l} ${n}件`, description:(l:string)=>`WARDOGSで確認できた${l}の完全カタログです。最終バランスを推測せず、モデル、役割、テストビルドの価格、証拠を比較できます。`, disclaimer:"コミュニティが発売前ビルドで確認したデータです。価格、解除条件、バランス、入手可否は早期アクセス前に変更される可能性があります。", section:(s:string,l:string)=>`${s}として確認できた${l}のモデルと数値です。すべての数値は記載されたテストビルド時点の情報です。`, insight:(l:string)=>[`${l}は、明確な役割、予算、補給計画に合わせて選びます。`,"観察済みの数値は候補の比較に使えますが、最終バランス表ではありません。", "高価な選択は、分隊が実戦で運用・補給できる場合にだけ価値を持ちます。"], unknown:(l:string)=>[`${l}の早期アクセス版における最終性能は確認されていません。`,"価格、進行条件、入手可否、バランスは新しいビルドで変わる可能性があります。", "未記載の数値を1本の動画や画像から推測してはいけません。"], asOf:"Alpha 1 — 2026年8月7日", sources:["Steam版WARDOGS","Team17のWARDOGSページ","BULKHEADのWARDOGSページ"]}
} as const;

const expandedLabels: Record<Exclude<Locale, "en">, Record<string, string>> = {
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

const valueMaps: Record<Exclude<Locale, "en">, Record<string, string>> = {
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
  const direct = valueMaps[locale][value] ?? expandedLabels[locale][value];
  if (direct) return direct;

  const rounds = value.match(/^(\d+) rounds$/);
  if (rounds) {
    return locale === "ru" ? `${rounds[1]} патронов`
      : locale === "de" ? `${rounds[1]} Schuss`
      : locale === "pt-br" ? `${rounds[1]} projéteis`
      : `${rounds[1]}発`;
  }

  const level = value.match(/^(Driver|Pilot|Wardog) Level (\d+)$/);
  if (level) {
    const role: string = translateValue(level[1], locale);
    return locale === "ja" ? `${role}レベル${level[2]}` : `${role} ${locale === "ru" ? "уровня" : locale === "de" ? "Stufe" : "nível"} ${level[2]}`;
  }

  const unlock = value.match(/^(\$[\d,]+) unlock$/);
  if (unlock) {
    return locale === "ru" ? `Разблокировка за ${unlock[1]}`
      : locale === "de" ? `Freischaltung für ${unlock[1]}`
      : locale === "pt-br" ? `Desbloqueio por ${unlock[1]}`
      : `${unlock[1]}で解除`;
  }

  return value
    .replace(/\bfixed\b/g, valueMaps[locale].fixed)
    .replace(/\brounds\b/g, locale === "ru" ? "патронов" : locale === "de" ? "Schuss" : locale === "pt-br" ? "projéteis" : "発");
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
    dataAsOf: text.asOf,
    heroImageAlt: type.imageAlt,
    disclaimer: text.disclaimer,
    columns: guide.columns.map((column) => translateValue(column, locale)),
    sections: guide.sections.map((section) => {
      const title = sectionNames[locale][section.title] ?? expandedSectionNames[locale][section.title] ?? section.title;
      return {...section, title, description: text.section(title, type.label), rows: section.rows.map((row) => ({cells: row.cells.map((cell, index) => index === 0 ? cell : translateValue(cell, locale))}))};
    }),
    insights: text.insight(type.label),
    unknowns: text.unknown(type.label),
    officialSources: guide.officialSources.map((source, index) => ({...source, label: text.sources[index] ?? source.label}))
  };
}

export function getLocalizedCatalogueRecords(records: readonly CatalogueRecord[], locale: Locale): CatalogueRecord[] {
  if (locale === "en") return [...records];
  const text = localeText[locale];
  return records.map((record) => {
    const type = getItemType(record.type);
    const label = type ? getLocalizedItemType(type, locale).label : record.type;
    const facts = record.facts.map((fact) => ({label: translateValue(fact.label, locale), value: translateValue(fact.value, locale)}));
    const factText = facts.map((fact) => `${fact.label}: ${fact.value}`).join("; ");
    return {...record, subtype: translateValue(record.subtype, locale), imageAlt: `${record.name} — WARDOGS ${label}`, summary: `${record.name} — ${label} WARDOGS. ${factText}. ${text.disclaimer}`, facts, dataAsOf: text.asOf};
  });
}

export function getLocalizedCatalogueGroup(group: CatalogueGroup, locale: Locale): CatalogueGroup {
  if (locale === "en") return group;
  const type = getItemType(group.type);
  const label = type ? getLocalizedItemType(type, locale).label : group.label;
  return {...group, label, filters: group.filters.map((filter) => ({...filter, label: translateValue(filter.label, locale)}))};
}
