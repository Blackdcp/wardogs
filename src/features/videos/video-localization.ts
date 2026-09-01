import type {Locale} from "@/config/site";
import {videoArticles, type VideoArticle} from "./video-library";

type TranslatedLocale = Exclude<Locale, "en">;

const topics: Record<VideoArticle["slug"], Partial<Record<TranslatedLocale, string>>> = {
  "wardogs-10-reasons-not-to-buy": {ru: "официальные доводы разработчиков о спорных особенностях и ожиданиях перед покупкой", de: "die offiziellen Entwicklerargumente zu möglichen Nachteilen und realistischen Erwartungen vor dem Kauf", "pt-br": "os argumentos oficiais dos desenvolvedores sobre limitações e expectativas antes da compra", ja: "開発者が説明した購入前に知るべき弱点と現実的な期待", "zh-cn": "官方开发者列出的购买前风险与适合人群"},
  "wardogs-7-things-you-need-to-know": {ru: "масштаб на 100 игроков, три команды, постоянные деньги, мобильные FOB и сроки выхода", de: "100 Spieler, drei Teams, dauerhaftes Geld, mobile FOBs und der Veröffentlichungsplan", "pt-br": "100 jogadores, três equipes, dinheiro persistente, FOBs móveis e o cronograma de lançamento", ja: "100人・3チーム戦、持ち越し資金、移動FOB、発売予定", "zh-cn": "百人三方战、持久资金、移动 FOB 与发售信息"},
  "wardogs-loadout-gear-guide": {ru: "оружие, магазины, медицина, броня, рюкзаки, парашюты, специалисты и строительство FOB", de: "Waffen, Magazine, Medizin, Rüstung, Rucksäcke, Fallschirme, Spezialisten und FOB-Bau", "pt-br": "armas, carregadores, medicina, armadura, mochilas, paraquedas, especialistas e construção de FOB", ja: "武器、マガジン、医療、装甲、バックパック、パラシュート、特殊装備、FOB建築", "zh-cn": "武器、弹匣、医疗、护甲、背包与 FOB 建造配装"},
  "wardogs-gameplay-impressions": {ru: "первые впечатления автора от темпа боя, командной работы, транспорта и целей", de: "erste Creator-Eindrücke zu Kampftempo, Teamarbeit, Fahrzeugen und Zielen", "pt-br": "as primeiras impressões do criador sobre ritmo, equipe, veículos e objetivos", ja: "初期クリエイター映像から分かる戦闘テンポ、連携、車両、目標", "zh-cn": "创作者对战斗节奏、团队协作、载具与目标的初体验"},
  "wardogs-alpha-gameplay-impressions": {ru: "боевые наблюдения из ранней Alpha-сборки и ограничения такого материала", de: "Kampfbeobachtungen aus einer frühen Alpha-Version und die Grenzen dieses Materials", "pt-br": "observações de combate da build Alpha e os limites desse material", ja: "初期アルファビルドの戦闘観察と映像から判断できる範囲", "zh-cn": "早期 Alpha 实机中的战斗观察与证据边界"},
  "wardogs-mortars-indirect-fire": {ru: "работа минометов, корректировка огня, давление по площади и способы противодействия", de: "Mörser, Feuerkorrektur, Flächendruck und Gegenmaßnahmen", "pt-br": "morteiros, correção de tiro, pressão de área e contrajogo", ja: "迫撃砲の照準修正、範囲制圧、対抗手段、強さの判断", "zh-cn": "迫击炮校射、范围压制、强度判断与反制"},
  "wardogs-20-hours-gameplay": {ru: "уроки длинной игровой сессии о деньгах, маршрутах, ролях и повторных выходах", de: "Lehren aus einer langen Sitzung zu Geld, Routen, Rollen und wiederholten Einsätzen", "pt-br": "lições de uma sessão longa sobre dinheiro, rotas, funções e novas tentativas", ja: "長時間プレイから分かる資金、ルート、役割、再出撃の教訓", "zh-cn": "长时间实机中的资金、路线、职责与重复出击经验"},
  "wardogs-sniping-long-range-combat": {ru: "снайпинг, дальние дистанции, выбор позиции, информация и смена огневой точки", de: "Scharfschützenkampf, große Distanzen, Positionswahl, Aufklärung und Stellungswechsel", "pt-br": "tiro de precisão, longa distância, posição, informação e mudança de ponto", ja: "狙撃、長距離戦、位置選び、索敵、射撃地点の移動", "zh-cn": "狙击、远距离作战、选位、索敌与转移射击点"},
  "wardogs-first-look-gameplay": {ru: "первый большой групповой взгляд на Alpha-геймплей, связь и хаос трех команд", de: "den ersten großen Gruppenblick auf Alpha-Gameplay, Kommunikation und Drei-Team-Chaos", "pt-br": "o primeiro grande olhar em grupo para a jogabilidade Alpha, comunicação e caos entre três equipes", ja: "大人数アルファ映像で確認できる分隊通信と3チーム戦の混乱", "zh-cn": "大规模 Alpha 实机中的小队沟通与三方混战"},
  "wardogs-everything-before-playing": {ru: "основные системы, которые нужно понять до первого матча", de: "die wichtigsten Systeme, die vor dem ersten Match verstanden werden sollten", "pt-br": "os principais sistemas que precisam ser entendidos antes da primeira partida", ja: "最初の試合前に理解しておくべき主要システム", "zh-cn": "首次开战前需要理解的核心系统"},
  "wardogs-40-tips": {ru: "сорок практических советов для первых матчей и бета-выходных", de: "vierzig praktische Hinweise für die ersten Matches und ein Beta-Wochenende", "pt-br": "quarenta dicas práticas para as primeiras partidas e o fim de semana beta", ja: "初戦とベータ週末で役立つ40の実践的なヒント", "zh-cn": "初次对局与测试周末可用的四十条实战建议"},
  "wardogs-fob-building-supply": {ru: "строительство FOB, снабжение, размещение, улучшения и оборону", de: "FOB-Bau, Versorgung, Platzierung, Verbesserungen und Verteidigung", "pt-br": "construção de FOB, suprimento, posicionamento, melhorias e defesa", ja: "FOBの建築、補給、配置、強化、防衛", "zh-cn": "FOB 建造、补给、选址、升级与防守"},
  "wardogs-best-settings": {ru: "настройки тестовой сборки, стабильность кадров, видимость и ограничения аппаратных советов", de: "Einstellungen der Testversion, Bildstabilität, Sichtbarkeit und Grenzen von Hardware-Empfehlungen", "pt-br": "configurações da build de teste, estabilidade, visibilidade e limites das recomendações de hardware", ja: "テストビルドの設定、フレーム安定性、視認性、ハードウェア助言の限界", "zh-cn": "测试版设置、帧率稳定、视野与硬件建议边界"},
  "wardogs-first-10000": {ru: "как заработать первые 10 000 долларов через цели, поддержку, транспорт и дисциплину расходов", de: "die ersten 10.000 Dollar durch Ziele, Unterstützung, Transport und Ausgabendisziplin", "pt-br": "como obter os primeiros 10.000 dólares com objetivos, suporte, transporte e disciplina de gastos", ja: "目標、支援、輸送、支出管理で最初の1万ドルを稼ぐ方法", "zh-cn": "通过目标、支援、运输与控制支出赚到首个一万美元"},
  "wardogs-helicopter-flight-guide": {ru: "основы полета на вертолете, безопасный взлет, посадку, маршрут и ценность транспорта", de: "Hubschraubergrundlagen, sicheren Start, Landung, Routenwahl und Transportwert", "pt-br": "fundamentos de helicóptero, decolagem segura, pouso, rota e valor do transporte", ja: "ヘリコプターの基本操作、安全な離着陸、ルート、輸送の価値", "zh-cn": "直升机基础、安全起降、路线选择与运输价值"},
  "wardogs-vehicles-explained": {ru: "роли наземной и воздушной техники, работу экипажа, снабжение и риск потери", de: "Rollen von Boden- und Luftfahrzeugen, Besatzung, Versorgung und Verlustrisiko", "pt-br": "funções de veículos terrestres e aéreos, tripulação, suprimento e risco de perda", ja: "地上・航空車両の役割、乗員、補給、損失リスク", "zh-cn": "地面与空中载具定位、乘员、补给和损失风险"},
  "wardogs-weapons-tested": {ru: "практический выбор оружия по дистанции, роли, боеприпасам и стоимости замены", de: "praktische Waffenwahl nach Distanz, Rolle, Munition und Ersatzkosten", "pt-br": "seleção prática de armas por distância, função, munição e custo de reposição", ja: "距離、役割、弾薬、再購入費用に基づく実践的な武器選び", "zh-cn": "按距离、职责、弹药与补购成本选择武器"},
  "wardogs-game-mode-explained": {ru: "режим Control Zone, башни, контроль территории, возрождение и командное движение", de: "Control Zone, Türme, Gebietskontrolle, Wiedereinstieg und gemeinsame Bewegung", "pt-br": "Zona de Controle, torres, domínio territorial, retorno e movimento em equipe", ja: "コントロールゾーン、タワー、地域支配、再出撃、チーム移動", "zh-cn": "控制区模式、塔楼、区域争夺、复活与团队推进"},
  "wardogs-is-it-worth-it": {ru: "решение о покупке раннего доступа с учетом цены, состояния сборки и типа игрока", de: "die Early-Access-Kaufentscheidung nach Preis, Versionsstand und Spielertyp", "pt-br": "a decisão de compra do Acesso Antecipado considerando preço, estado da build e perfil do jogador", ja: "価格、ビルド状態、プレイスタイルから判断する早期アクセス購入判断", "zh-cn": "结合价格、版本状态与玩家类型判断是否值得购买"},
  "wardogs-artillery-tank-guide": {ru: "наведение SPH-2, стабилизацию, экипаж, перезарядку и снабжение артиллерии", de: "SPH-2-Zielen, Stabilisierung, Besatzung, Nachladen und Artillerieversorgung", "pt-br": "mira da SPH-2, estabilização, tripulação, recarga e suprimento de artilharia", ja: "SPH-2の照準、安定化、乗員、リロード、砲兵補給", "zh-cn": "SPH-2 瞄准、稳定、乘员、装填与炮兵补给"},
  "wardogs-ammo-types-tested": {ru: "выбор между FMJ, бронебойными и экспансивными боеприпасами против разной брони", de: "die Wahl zwischen FMJ, panzerbrechender und Weichzielmunition gegen verschiedene Rüstung", "pt-br": "a escolha entre FMJ, munição perfurante e munição para alvos sem blindagem", ja: "FMJ、徹甲弾、軟目標弾と装甲に応じた選択", "zh-cn": "面对不同护甲时选择 FMJ、穿甲弹与软目标弹"},
  "wardogs-stingray-anti-vehicle-drone": {ru: "применение дрона Stingray против ценной техники и защиту оператора", de: "den Einsatz der Stingray-Drohne gegen wertvolle Fahrzeuge und den Schutz des Bedieners", "pt-br": "o uso do drone Stingray contra veículos valiosos e a proteção do operador", ja: "Stingray対車両ドローンの目標選びと操縦者防護", "zh-cn": "Stingray 反载具无人机的目标选择与操作员保护"},
  "wardogs-fast-money-routes": {ru: "стабильный заработок через пилотирование, логистику, мобильную точку появления и медика", de: "verlässliches Einkommen durch Piloten-, Logistik-, Spawn- und Sanitäteraufgaben", "pt-br": "renda consistente com pilotagem, logística, ponto móvel e trabalho médico", ja: "操縦、兵站、移動スポーン、衛生兵による安定した資金稼ぎ", "zh-cn": "通过驾驶、后勤、移动出生点与医疗稳定赚钱"},
  "wardogs-vehicle-cargo-logistics": {ru: "грузовой интерфейс, Ural, ящики, поддоны и доставку ресурсов в FOB", de: "Frachtmenü, Ural, Kisten, Paletten und die Ressourcenlieferung zur FOB", "pt-br": "interface de carga, Ural, caixas, paletes e entrega de recursos ao FOB", ja: "貨物画面、Ural、クレート、パレット、FOBへの資材配送", "zh-cn": "货运界面、Ural、箱子、托盘与 FOB 资源配送"},
  "wardogs-havoc-helicopter-guide": {ru: "MI-28 Havoc максимального уровня, контрмеры, выбор целей и противодействие ПВО", de: "den maximalen MI-28 Havoc, Gegenmaßnahmen, Zielwahl und Flugabwehr", "pt-br": "o MI-28 Havoc no nível máximo, contramedidas, alvos e defesa antiaérea", ja: "最大レベルMI-28 Havoc、対抗手段、目標選び、対空攻撃", "zh-cn": "满级 MI-28 Havoc、反制措施、目标选择与防空威胁"},
  "wardogs-deadliest-sniper-guide": {ru: "снайперскую позицию, дальномер, выбор целей, боеприпасы и смену точки", de: "Scharfschützenposition, Entfernungsmesser, Zielwahl, Munition und Stellungswechsel", "pt-br": "posição de sniper, telêmetro, seleção de alvos, munição e reposicionamento", ja: "狙撃位置、距離計、目標選び、弾薬、射撃後の移動", "zh-cn": "狙击位置、测距、目标选择、弹药与开火后转移"},
  "wardogs-medic-mp9-loadout": {ru: "комплект Medic с MP9, безопасные revives, мобильность, позицию и денежный риск", de: "das Medic-MP9-Loadout, sichere Revives, Mobilität, Position und Geldrisiko", "pt-br": "o kit de Medic com MP9, revives seguros, mobilidade, posição e risco financeiro", ja: "MedicのMP9装備、安全な蘇生、機動力、位置、資金リスク", "zh-cn": "Medic 与 MP9 配装、安全救人、机动、站位与资金风险"},
  "wardogs-huge-news-progression": {ru: "изменения прогресса, перенос танков и новости запуска", de: "Fortschrittsänderungen, den Panzerwechsel und Launch-Meldungen", "pt-br": "mudanças de progressão, a nova rota dos tanques e notícias do lançamento", ja: "進行変更、戦車の移動、発売ニュース", "zh-cn": "进度系统调整、坦克路线变化与上线消息"},
  "wardogs-support-skill-leveling": {ru: "прокачку Support через логистику, транспорт, ремонт и помощь команде", de: "Support-Fortschritt durch Logistik, Transport, Reparatur und Teamhilfe", "pt-br": "progressão de Suporte com logística, transporte, reparo e ajuda à equipe", ja: "兵站、輸送、修理、支援によるSupport進行", "zh-cn": "通过后勤、运输、维修与团队支援提升 Support"},
  "wardogs-kamikaze-drone-guide": {ru: "дрон-камикадзе, выбор цели, безопасный запуск и противодействие", de: "Kamikaze-Drohnen, Zielwahl, sicheren Start und Gegenmaßnahmen", "pt-br": "drone kamikaze, escolha de alvo, lançamento seguro e contrajogo", ja: "自爆ドローンの目標選び、安全な発射、対抗策", "zh-cn": "自爆无人机的目标选择、安全起飞与反制"},
  "wardogs-gameplay-overview-tomographic": {ru: "комбинированные бои, три команды, транспорт, цели и поддержку", de: "Combined-Arms-Kämpfe, drei Teams, Fahrzeuge, Ziele und Support", "pt-br": "combate combinado, três equipes, veículos, objetivos e suporte", ja: "諸兵科連合、3チーム、車両、目標、支援", "zh-cn": "诸兵种协同、三方队伍、载具、目标与支援玩法"}
};

const titles: Record<TranslatedLocale, Record<VideoArticle["slug"], string>> = {
  ru: Object.fromEntries(videoArticles.map((article) => [article.slug, `WARDOGS: разбор видео — ${topics[article.slug].ru}`])) as Record<VideoArticle["slug"], string>,
  de: Object.fromEntries(videoArticles.map((article) => [article.slug, `WARDOGS Video-Guide: ${topics[article.slug].de}`])) as Record<VideoArticle["slug"], string>,
  "pt-br": Object.fromEntries(videoArticles.map((article) => [article.slug, `Guia em vídeo de WARDOGS: ${topics[article.slug]["pt-br"]}`])) as Record<VideoArticle["slug"], string>,
  ja: Object.fromEntries(videoArticles.map((article) => [article.slug, `WARDOGS動画攻略: ${topics[article.slug].ja}`])) as Record<VideoArticle["slug"], string>,
  "zh-cn": Object.fromEntries(videoArticles.map((article) => [article.slug, `WARDOGS 视频攻略：${topics[article.slug]["zh-cn"]}`])) as Record<VideoArticle["slug"], string>
};

function localizedArticle(article: VideoArticle, locale: TranslatedLocale): VideoArticle {
  const topic = topics[article.slug][locale] ?? `“${article.title}”中的玩法、证据与实战建议`;
  const title = titles[locale][article.slug];

  if (locale === "ru") return {
    ...article,
    title,
    description: `Подробный русскоязычный разбор ролика о WARDOGS: ${topic}. Факты из записи отделены от изменяемых параметров Alpha и Beta.`,
    quickAnswer: `Видео помогает понять ${topic}. Используйте его как свидетельство конкретной тестовой сборки: надежнее всего подтверждаются показанные действия и интерфейс, а числа, баланс, цена и доступность требуют повторной проверки по Steam и официальным каналам.`,
    takeaways: [`Главная тема материала — ${topic}.`, "Показанное в кадре важнее предположений автора о будущих версиях.", "Числа Alpha и Beta нельзя автоматически переносить в Early Access.", "Практические выводы нужно связывать с целью, деньгами, снабжением и связью отряда.", "Официальные даты, цена и доступ всегда проверяются отдельно через Steam и каналы WARDOGS."],
    sections: [
      {heading: "Что показывает видео", body: [`Материал подробно рассматривает ${topic}. Мы пересобрали его в текстовую структуру, чтобы игрок мог быстро найти механику, практический вывод и ограничение источника, не просматривая запись повторно целиком.`, "Видео полезно как наблюдение за реальным интерфейсом и поведением тестовой сборки. Оно не является окончательной документацией: серверные правила, экономика, характеристики и доступность могут измениться после даты записи."]},
      {heading: "Как читать доказательства", body: ["Подтвержденным наблюдением считается то, что видно или слышно непосредственно в записи: действие игрока, реакция интерфейса, роль техники, последовательность покупки либо командное взаимодействие. Комментарий автора без видимого подтверждения остается интерпретацией.", "Если материал расходится с актуальной страницей Steam или официальным сообщением, первичный официальный источник имеет приоритет. Дата публикации и тип сборки важны не меньше самого утверждения."]},
      {heading: "Практическое применение", body: [`Используйте выводы о ${topic} для подготовки роли перед матчем. Составьте короткий план: какая задача решается, сколько денег можно потерять, какие боеприпасы или транспорт нужны и кто в отряде передает информацию.`, "Во время игры проверяйте вывод в реальной ситуации и не копируйте чужой комплект без учета карты, состава команды и текущего обновления. Стабильная командная ценность обычно важнее одного яркого убийства."]},
      {heading: "Что может измениться", body: ["Предрелизная сборка может изменить цену, отдачу, урон, вместимость, время восстановления, очки, прогрессию, управление и доступность предметов. Отдельный удачный или неудачный эпизод также не доказывает средний баланс.", "Поэтому страница сохраняет полезную логику ролей и принятия решений, но не превращает кадр из ролика в вечную таблицу характеристик. Перед важной покупкой или настройкой сверяйте дату обновления."]},
      {heading: "Следующий шаг", body: [`После этого разбора откройте связанное руководство по теме ${topic}. В нем собраны поддерживаемые инструкции, официальные ссылки и пометки Confirmed vs Rumor, которые проще обновлять при выходе нового билда.`, "Смотрите исходный ролик, если нужен полный контекст, звук, тайминг или положение интерфейса. Текстовая статья предназначена для поиска и подготовки, а не для подмены автора видео."]}
    ]
  };

  if (locale === "de") return {
    ...article,
    title,
    description: `Ausführlicher deutscher WARDOGS-Video-Guide über ${topic}. Sichtbare Belege werden von veränderlichen Alpha- und Beta-Werten getrennt.`,
    quickAnswer: `Das Video erklärt ${topic}. Es ist als Beleg für eine konkrete Testversion nützlich: Gezeigte Abläufe und Oberflächen sind belastbarer als Aussagen über endgültige Werte, Balance, Preis oder Verfügbarkeit, die über Steam und offizielle Kanäle neu geprüft werden müssen.`,
    takeaways: [`Der Schwerpunkt des Materials ist ${topic}.`, "Direkt sichtbare Abläufe sind aussagekräftiger als Vermutungen über spätere Versionen.", "Alpha- und Beta-Zahlen dürfen nicht automatisch als Early-Access-Werte gelten.", "Praktische Schlüsse müssen mit Ziel, Geld, Versorgung und Truppkommunikation verbunden werden.", "Offizielle Termine, Preis und Zugang werden separat bei Steam und WARDOGS geprüft."],
    sections: [
      {heading: "Was das Video zeigt", body: [`Das Material behandelt ${topic}. Diese Seite ordnet die Aufnahme als durchsuchbaren Artikel, damit Mechanik, praktische Folgerung und Quellenbegrenzung ohne erneutes vollständiges Ansehen auffindbar bleiben.`, "Creator-Aufnahmen sind wertvoll, wenn Oberfläche und Verhalten einer Testversion direkt zu sehen sind. Sie sind keine endgültige Dokumentation, denn Serverregeln, Wirtschaft, Werte und Verfügbarkeit können sich nach der Aufnahme ändern."]},
      {heading: "Belege richtig einordnen", body: ["Als beobachtet gilt, was im Bild oder Ton direkt nachvollziehbar ist: Spieleraktion, Reaktion der Oberfläche, Fahrzeugrolle, Kaufablauf oder Teamkommunikation. Eine Aussage des Creators ohne sichtbaren Beleg bleibt eine Interpretation.", "Widerspricht ein älteres Video einer aktuellen Steam-Seite oder offiziellen Meldung, hat die Primärquelle Vorrang. Veröffentlichungsdatum und Build sind deshalb Teil jeder Schlussfolgerung."]},
      {heading: "Praktische Anwendung", body: [`Nutze die Erkenntnisse zu ${topic}, um vor dem Match eine Rolle zu planen. Kläre Aufgabe, vertretbaren Verlust, benötigte Munition oder Fahrzeuge und die Person, die Informationen im Trupp weitergibt.`, "Prüfe die Aussage anschließend in der aktuellen Version. Kopiere kein fremdes Loadout ohne Karte, Teamzusammenstellung und Patchstand zu berücksichtigen; verlässlicher Teamnutzen zählt meist mehr als ein einzelner spektakulärer Moment."]},
      {heading: "Was sich ändern kann", body: ["Vorabversionen können Preis, Rückstoß, Schaden, Kapazität, Abklingzeit, Punkte, Fortschritt, Steuerung und Verfügbarkeit verändern. Eine einzelne starke oder schwache Szene beweist außerdem keine durchschnittliche Balance.", "Darum bewahrt der Artikel Rollenlogik und Entscheidungswege, macht aber aus einem Videobild keine dauerhafte Wertetabelle. Prüfe das Aktualisierungsdatum vor Kauf- oder Einstellungsentscheidungen."]},
      {heading: "Der nächste Schritt", body: [`Öffne nach diesem Video-Guide den verknüpften Hauptartikel zu ${topic}. Dort stehen gepflegte Anweisungen, offizielle Links und Confirmed-vs-Rumor-Hinweise, die bei einem neuen Build gezielt aktualisiert werden.`, "Sieh die Originalaufnahme für vollständigen Kontext, Ton, Timing und genaue Oberfläche. Der Text unterstützt Suche und Vorbereitung, ersetzt aber nicht die Arbeit des Videoautors."]}
    ]
  };

  if (locale === "pt-br") return {
    ...article,
    title,
    description: `Análise completa em português do vídeo de WARDOGS sobre ${topic}. Evidências visíveis são separadas de valores mutáveis do Alpha e do Beta.`,
    quickAnswer: `O vídeo ajuda a entender ${topic}. Ele serve como evidência de uma build de teste específica: ações e telas mostradas são mais confiáveis do que previsões sobre números finais, balanceamento, preço ou disponibilidade, que precisam ser conferidos na Steam e nos canais oficiais.`,
    takeaways: [`O foco principal do material é ${topic}.`, "O que aparece diretamente na gravação vale mais do que suposições sobre versões futuras.", "Números do Alpha e do Beta não devem ser tratados automaticamente como dados do Acesso Antecipado.", "As conclusões práticas precisam considerar objetivo, dinheiro, suprimento e comunicação do esquadrão.", "Datas, preço e acesso oficiais são verificados separadamente na Steam e nos canais de WARDOGS."],
    sections: [
      {heading: "O que o vídeo mostra", body: [`O material examina ${topic}. Esta página reorganiza a gravação como artigo pesquisável para que mecânica, aplicação prática e limite da fonte possam ser encontrados sem assistir novamente ao vídeo inteiro.`, "Vídeos de criadores são úteis quando mostram interface e comportamento de uma build real. Eles não são documentação final: regras do servidor, economia, atributos e disponibilidade podem mudar depois da gravação."]},
      {heading: "Como interpretar as evidências", body: ["Consideramos observado aquilo que pode ser visto ou ouvido diretamente: ação do jogador, resposta da interface, função do veículo, sequência de compra ou comunicação da equipe. Uma afirmação do narrador sem confirmação visual continua sendo interpretação.", "Se um vídeo antigo entrar em conflito com a página atual da Steam ou uma publicação oficial, a fonte primária tem prioridade. A data e a build fazem parte da conclusão."]},
      {heading: "Aplicação prática", body: [`Use as conclusões sobre ${topic} para planejar uma função antes da partida. Defina a tarefa, quanto dinheiro pode ser perdido, qual munição ou transporte é necessário e quem transmitirá informação no esquadrão.`, "Teste a orientação na versão atual e não copie um kit sem considerar mapa, composição da equipe e atualização. Valor consistente para o time costuma importar mais que uma jogada isolada."]},
      {heading: "O que pode mudar", body: ["Uma build de pré-lançamento pode alterar preço, recuo, dano, capacidade, recarga, pontuação, progressão, controles e disponibilidade. Uma cena muito forte ou fraca também não comprova o balanceamento médio.", "Por isso, o artigo preserva a lógica de função e decisão, mas não transforma um quadro do vídeo em tabela permanente. Confira a data de atualização antes de comprar ou mudar configurações."]},
      {heading: "Próximo passo", body: [`Depois desta análise, abra o guia principal ligado a ${topic}. Ele reúne instruções mantidas, links oficiais e marcações de Confirmado vs Rumor que podem ser atualizadas quando uma nova build sair.`, "Assista ao vídeo original para contexto completo, som, tempo e posição da interface. O artigo facilita busca e preparação, mas não substitui o trabalho do criador."]}
    ]
  };

  if (locale === "zh-cn") return {
    ...article,
    title,
    description: `这是一篇关于${topic}的 WARDOGS 中文视频攻略。正文把画面中可验证的事实与可能变化的 Alpha、Beta 数值分开说明。`,
    quickAnswer: `这段视频可用于理解${topic}。它记录的是特定测试版本：画面中的操作与界面更可信，最终数值、平衡、价格和可用性仍需通过 Steam 与官方渠道复核。`,
    takeaways: [`视频的核心主题是${topic}。`, "画面中直接出现的操作，比作者对未来版本的推测更可靠。", "Alpha 与 Beta 数值不能自动视为抢先体验版最终数据。", "实战结论需要同时考虑目标、资金、补给和小队沟通。", "发布日期、价格和参与方式始终单独核对 Steam 与 WARDOGS 官方消息。"],
    sections: [
      {heading: "视频展示了什么", body: [`素材重点讲解${topic}。本页将视频重组为可搜索的文字结构，便于快速找到机制、实战结论与来源限制。`, "创作者实机能证明特定测试版本中的界面和行为，但不是最终说明书；服务器规则、经济、属性与可用性都可能在录制后改变。"]},
      {heading: "如何判断证据", body: ["只有画面或声音能直接支持的玩家动作、界面反馈、载具定位、购买过程和团队沟通，才标记为已观察。没有画面支撑的解说仍属于作者判断。", "旧视频若与当前 Steam 页面或官方公告冲突，应以最新的一手来源为准；发布日期和对应版本与结论本身同样重要。"]},
      {heading: "实战怎么用", body: [`把${topic}的结论用于赛前分工：明确任务、可承受损失、所需弹药或运输，以及小队内负责传递信息的人。`, "在当前版本中再次验证，不要忽略地图、队伍构成和更新内容直接照搬别人的配装；稳定的团队价值通常比一次亮眼击杀更重要。"]},
      {heading: "哪些内容可能变化", body: ["预发布版本可能调整价格、后坐力、伤害、容量、冷却、得分、进度、控制和物品可用性。单次特别强或特别弱的片段也不能证明平均平衡。", "因此本文保留角色逻辑和决策方法，但不会把某一帧画面写成永久属性表。购买或改设置前请检查最后更新时间。"]},
      {heading: "下一步", body: [`看完后打开与${topic}相关的核心攻略，其中包含持续维护的步骤、官方链接以及已确认与传闻标记。`, "需要完整上下文、声音、时机或准确界面位置时，请观看原视频；本文用于搜索和准备，不替代视频作者的作品。", "实战前还应核对当前更新说明与服务器公告，尤其注意控制、经济、武器属性和载具可用性是否已经变化。"]}
    ]
  };

  return {
    ...article,
    title,
    description: `WARDOGSの${topic}を扱う動画を、日本語で詳しく整理した攻略記事です。映像で確認できる事実と、変更される可能性があるアルファ・ベータ版の数値を分けて説明します。`,
    quickAnswer: `この動画からは${topic}を理解できます。ただし、特定のテストビルドを記録した資料として読む必要があります。画面に映る操作やUIは有力な証拠ですが、最終的な数値、バランス、価格、入手可否はSteamと公式情報で再確認してください。`,
    takeaways: [`動画の中心テーマは${topic}です。`, "画面で直接確認できる動作は、将来のビルドに関する予想より信頼できます。", "アルファ・ベータ版の数値を早期アクセス版の最終値として扱ってはいけません。", "実戦で使うときは、目標、資金、補給、分隊通信まで含めて判断します。", "公式の日程、価格、参加方法はSteamとWARDOGS公式チャンネルで別に確認します。"],
    sections: [
      {heading: "動画で確認できる内容", body: [`この映像は${topic}を詳しく扱っています。本ページでは、動画全体を繰り返し見なくても、仕組み、実戦上の判断、情報源の制限を検索できるよう文章として再構成しました。`, "クリエイター映像は、実際のテストビルドの画面や挙動を確認する証拠になります。一方で最終仕様書ではなく、サーバールール、資金経済、性能、入手方法は撮影後に変わる可能性があります。"]},
      {heading: "証拠の読み方", body: ["プレイヤーの操作、UIの反応、車両の役割、購入手順、分隊の通信など、映像や音声から直接追える内容を観察済みとして扱います。画面で裏付けられない話者の推測は解釈として残します。", "古い動画と現在のSteamページや公式発表が食い違う場合は、最新の一次情報を優先します。公開日と対象ビルドは、主張そのものと同じくらい重要です。"]},
      {heading: "実戦での使い方", body: [`${topic}に関する結論を、試合前の役割決めに使います。解決する任務、失ってよい資金、必要な弾薬や輸送手段、情報を伝える担当を短く決めてください。`, "現在のビルドで実際に確かめ、マップ、チーム構成、アップデートを無視して他人のロードアウトをそのままコピーしないようにします。一度の派手な成功より、継続してチームへ価値を出せる判断が重要です。"]},
      {heading: "変更される可能性がある部分", body: ["発売前ビルドでは、価格、反動、ダメージ、容量、再使用時間、得点、進行、操作、入手可否が変わる可能性があります。1つの強い場面や弱い場面だけでは、平均的なバランスも判断できません。", "そのため本記事は役割と意思決定の考え方を残しつつ、動画の一場面を永久的な性能表にはしません。購入や設定変更の前に最終更新日を確認してください。"]},
      {heading: "次に確認するページ", body: [`この動画解説の後は、${topic}に対応する主要攻略を開いてください。そこには更新可能な手順、公式リンク、確認済み・未確認の表示があり、新しいビルドに合わせて維持されます。`, "映像全体の文脈、音、タイミング、正確なUI位置が必要な場合は元動画を視聴してください。この記事は検索と準備を助けるもので、動画制作者の仕事を置き換えるものではありません。"]}
    ]
  };
}

export function getLocalizedVideoArticles(locale: Locale): VideoArticle[] {
  if (locale === "en") return [...videoArticles];
  return videoArticles.map((article) => localizedArticle(article, locale));
}

export function getLocalizedVideoArticle(locale: Locale, slug: string): VideoArticle | undefined {
  return getLocalizedVideoArticles(locale).find((article) => article.slug === slug);
}

export function getLocalizedFeaturedVideoArticles(locale: Locale, limit = 6): VideoArticle[] {
  return getLocalizedVideoArticles(locale).sort((a, b) => a.priority - b.priority).slice(0, limit);
}
