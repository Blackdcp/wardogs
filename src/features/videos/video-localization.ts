import type {Locale} from "@/config/site";
import {videoArticles, type VideoArticle} from "./video-library";

type TranslatedLocale = Exclude<Locale, "en">;

const topics: Record<VideoArticle["slug"], Record<TranslatedLocale, string>> = {
  "wardogs-10-reasons-not-to-buy": {ru: "официальные доводы разработчиков о спорных особенностях и ожиданиях перед покупкой", de: "die offiziellen Entwicklerargumente zu möglichen Nachteilen und realistischen Erwartungen vor dem Kauf", "pt-br": "os argumentos oficiais dos desenvolvedores sobre limitações e expectativas antes da compra", ja: "開発者が説明した購入前に知るべき弱点と現実的な期待"},
  "wardogs-7-things-you-need-to-know": {ru: "масштаб на 100 игроков, три команды, постоянные деньги, мобильные FOB и сроки выхода", de: "100 Spieler, drei Teams, dauerhaftes Geld, mobile FOBs und der Veröffentlichungsplan", "pt-br": "100 jogadores, três equipes, dinheiro persistente, FOBs móveis e o cronograma de lançamento", ja: "100人・3チーム戦、持ち越し資金、移動FOB、発売予定"},
  "wardogs-loadout-gear-guide": {ru: "оружие, магазины, медицина, броня, рюкзаки, парашюты, специалисты и строительство FOB", de: "Waffen, Magazine, Medizin, Rüstung, Rucksäcke, Fallschirme, Spezialisten und FOB-Bau", "pt-br": "armas, carregadores, medicina, armadura, mochilas, paraquedas, especialistas e construção de FOB", ja: "武器、マガジン、医療、装甲、バックパック、パラシュート、特殊装備、FOB建築"},
  "wardogs-gameplay-impressions": {ru: "первые впечатления автора от темпа боя, командной работы, транспорта и целей", de: "erste Creator-Eindrücke zu Kampftempo, Teamarbeit, Fahrzeugen und Zielen", "pt-br": "as primeiras impressões do criador sobre ritmo, equipe, veículos e objetivos", ja: "初期クリエイター映像から分かる戦闘テンポ、連携、車両、目標"},
  "wardogs-alpha-gameplay-impressions": {ru: "боевые наблюдения из ранней Alpha-сборки и ограничения такого материала", de: "Kampfbeobachtungen aus einer frühen Alpha-Version und die Grenzen dieses Materials", "pt-br": "observações de combate da build Alpha e os limites desse material", ja: "初期アルファビルドの戦闘観察と映像から判断できる範囲"},
  "wardogs-mortars-indirect-fire": {ru: "работа минометов, корректировка огня, давление по площади и способы противодействия", de: "Mörser, Feuerkorrektur, Flächendruck und Gegenmaßnahmen", "pt-br": "morteiros, correção de tiro, pressão de área e contrajogo", ja: "迫撃砲の照準修正、範囲制圧、対抗手段、強さの判断"},
  "wardogs-20-hours-gameplay": {ru: "уроки длинной игровой сессии о деньгах, маршрутах, ролях и повторных выходах", de: "Lehren aus einer langen Sitzung zu Geld, Routen, Rollen und wiederholten Einsätzen", "pt-br": "lições de uma sessão longa sobre dinheiro, rotas, funções e novas tentativas", ja: "長時間プレイから分かる資金、ルート、役割、再出撃の教訓"},
  "wardogs-sniping-long-range-combat": {ru: "снайпинг, дальние дистанции, выбор позиции, информация и смена огневой точки", de: "Scharfschützenkampf, große Distanzen, Positionswahl, Aufklärung und Stellungswechsel", "pt-br": "tiro de precisão, longa distância, posição, informação e mudança de ponto", ja: "狙撃、長距離戦、位置選び、索敵、射撃地点の移動"},
  "wardogs-first-look-gameplay": {ru: "первый большой групповой взгляд на Alpha-геймплей, связь и хаос трех команд", de: "den ersten großen Gruppenblick auf Alpha-Gameplay, Kommunikation und Drei-Team-Chaos", "pt-br": "o primeiro grande olhar em grupo para a jogabilidade Alpha, comunicação e caos entre três equipes", ja: "大人数アルファ映像で確認できる分隊通信と3チーム戦の混乱"},
  "wardogs-everything-before-playing": {ru: "основные системы, которые нужно понять до первого матча", de: "die wichtigsten Systeme, die vor dem ersten Match verstanden werden sollten", "pt-br": "os principais sistemas que precisam ser entendidos antes da primeira partida", ja: "最初の試合前に理解しておくべき主要システム"},
  "wardogs-40-tips": {ru: "сорок практических советов для первых матчей и бета-выходных", de: "vierzig praktische Hinweise für die ersten Matches und ein Beta-Wochenende", "pt-br": "quarenta dicas práticas para as primeiras partidas e o fim de semana beta", ja: "初戦とベータ週末で役立つ40の実践的なヒント"},
  "wardogs-fob-building-supply": {ru: "строительство FOB, снабжение, размещение, улучшения и оборону", de: "FOB-Bau, Versorgung, Platzierung, Verbesserungen und Verteidigung", "pt-br": "construção de FOB, suprimento, posicionamento, melhorias e defesa", ja: "FOBの建築、補給、配置、強化、防衛"},
  "wardogs-best-settings": {ru: "настройки тестовой сборки, стабильность кадров, видимость и ограничения аппаратных советов", de: "Einstellungen der Testversion, Bildstabilität, Sichtbarkeit und Grenzen von Hardware-Empfehlungen", "pt-br": "configurações da build de teste, estabilidade, visibilidade e limites das recomendações de hardware", ja: "テストビルドの設定、フレーム安定性、視認性、ハードウェア助言の限界"},
  "wardogs-first-10000": {ru: "как заработать первые 10 000 долларов через цели, поддержку, транспорт и дисциплину расходов", de: "die ersten 10.000 Dollar durch Ziele, Unterstützung, Transport und Ausgabendisziplin", "pt-br": "como obter os primeiros 10.000 dólares com objetivos, suporte, transporte e disciplina de gastos", ja: "目標、支援、輸送、支出管理で最初の1万ドルを稼ぐ方法"},
  "wardogs-helicopter-flight-guide": {ru: "основы полета на вертолете, безопасный взлет, посадку, маршрут и ценность транспорта", de: "Hubschraubergrundlagen, sicheren Start, Landung, Routenwahl und Transportwert", "pt-br": "fundamentos de helicóptero, decolagem segura, pouso, rota e valor do transporte", ja: "ヘリコプターの基本操作、安全な離着陸、ルート、輸送の価値"},
  "wardogs-vehicles-explained": {ru: "роли наземной и воздушной техники, работу экипажа, снабжение и риск потери", de: "Rollen von Boden- und Luftfahrzeugen, Besatzung, Versorgung und Verlustrisiko", "pt-br": "funções de veículos terrestres e aéreos, tripulação, suprimento e risco de perda", ja: "地上・航空車両の役割、乗員、補給、損失リスク"},
  "wardogs-weapons-tested": {ru: "практический выбор оружия по дистанции, роли, боеприпасам и стоимости замены", de: "praktische Waffenwahl nach Distanz, Rolle, Munition und Ersatzkosten", "pt-br": "seleção prática de armas por distância, função, munição e custo de reposição", ja: "距離、役割、弾薬、再購入費用に基づく実践的な武器選び"},
  "wardogs-game-mode-explained": {ru: "режим Control Zone, башни, контроль территории, возрождение и командное движение", de: "Control Zone, Türme, Gebietskontrolle, Wiedereinstieg und gemeinsame Bewegung", "pt-br": "Zona de Controle, torres, domínio territorial, retorno e movimento em equipe", ja: "コントロールゾーン、タワー、地域支配、再出撃、チーム移動"},
  "wardogs-is-it-worth-it": {ru: "решение о покупке раннего доступа с учетом цены, состояния сборки и типа игрока", de: "die Early-Access-Kaufentscheidung nach Preis, Versionsstand und Spielertyp", "pt-br": "a decisão de compra do Acesso Antecipado considerando preço, estado da build e perfil do jogador", ja: "価格、ビルド状態、プレイスタイルから判断する早期アクセス購入判断"}
};

const titles: Record<TranslatedLocale, Record<VideoArticle["slug"], string>> = {
  ru: Object.fromEntries(videoArticles.map((article) => [article.slug, `WARDOGS: разбор видео — ${topics[article.slug].ru}`])) as Record<VideoArticle["slug"], string>,
  de: Object.fromEntries(videoArticles.map((article) => [article.slug, `WARDOGS Video-Guide: ${topics[article.slug].de}`])) as Record<VideoArticle["slug"], string>,
  "pt-br": Object.fromEntries(videoArticles.map((article) => [article.slug, `Guia em vídeo de WARDOGS: ${topics[article.slug]["pt-br"]}`])) as Record<VideoArticle["slug"], string>,
  ja: Object.fromEntries(videoArticles.map((article) => [article.slug, `WARDOGS動画攻略: ${topics[article.slug].ja}`])) as Record<VideoArticle["slug"], string>
};

function localizedArticle(article: VideoArticle, locale: TranslatedLocale): VideoArticle {
  const topic = topics[article.slug][locale];
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
