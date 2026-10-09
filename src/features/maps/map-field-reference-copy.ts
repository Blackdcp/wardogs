import type {Locale} from "@/config/site";

type FieldReferenceCopy = {intro: string; tableHelp: string; correctionTitle: string; correction: string; theatersTitle: string; source: string; tactics: string};

export const fieldReferenceCopy: Record<Locale, FieldReferenceCopy> = {
  en: {
    intro: "Keep your map plan beside the game. Mark observations manually, calibrate against a known distance, then share a snapshot with your squad. Shared links do not synchronize later edits.",
    tableHelp: "Community elevation references: L81 mortar and SPH-2 high arc. Flight times are model estimates, not measured timings. Check the current build; select other trajectories in the calculator.",
    correctionTitle: "Correct from the selected trajectory",
    correction: "Fire one ranging round and observe the impact. Enter the range correction in the calculator and compare the old and new elevations. SPH-2 low and high arcs respond differently: a fixed mil-per-100m rule is not reliable. Do not extrapolate outside the firing table. Terrain and obstructions are not modeled.",
    theatersTitle: "Community places by map",
    source: "Community coordinate source · retrieved 9 Oct 2026",
    tactics: "Find a place in the map search, copy it to your markers, and use it as a route point or fire-mission endpoint. Verify the location and access in your current match. Missing categories mean no records in this dataset, not that a place does not exist."
  },
  "zh-cn": {
    intro: "将地图计划放在游戏旁边，手动标注观察结果，用已知距离校准，再把当前快照分享给小队。分享链接不会同步后续编辑。",
    tableHelp: "社区参考射角：L81 迫击炮与 SPH-2 高弹道。飞行时间为模型估算，并非实测。请核对当前版本；其他弹道可在计算器中选择。",
    correctionTitle: "按所选弹道修正",
    correction: "先试射一发并观察落点，在计算器中输入距离修正，比较修正前后的射角。SPH-2 高、低弹道的变化方向不同，不能套用每 100 米固定多少密位的口诀。不要外推超出射表的结果；本工具未计算地形和遮挡。",
    theatersTitle: "各地图的社区地点",
    source: "社区坐标来源 · 获取于 2026 年 10 月 9 日",
    tactics: "在地图搜索中查找地点，复制到自己的标记，再设为路线端点或火力任务端点。位置和通行情况请以当前对局为准。未列出的类别代表此数据集没有记录，不代表游戏内不存在。"
  },
  "zh-tw": {
    intro: "將地圖計畫放在遊戲旁邊，手動標註觀察結果，以已知距離校準，再將目前快照分享給小隊。分享連結不會同步後續編輯。",
    tableHelp: "社群參考射角：L81 迫擊砲與 SPH-2 高彈道。飛行時間為模型估算，並非實測。請核對目前版本；其他彈道可在計算器中選擇。",
    correctionTitle: "依所選彈道修正",
    correction: "先試射一發並觀察落點，在計算器中輸入距離修正，比較修正前後的射角。SPH-2 高、低彈道的變化方向不同，不能套用每 100 公尺固定多少密位的口訣。不要外推超出射表的結果；本工具未計算地形和遮擋。",
    theatersTitle: "各地圖的社群地點",
    source: "社群座標來源 · 取得於 2026 年 10 月 9 日",
    tactics: "在地圖搜尋中尋找地點，複製到自己的標記，再設為路線端點或火力任務端點。位置與通行情況請以目前對局為準。未列出的類別代表此資料集沒有紀錄，不代表遊戲內不存在。"
  },
  ja: {
    intro: "ゲームの横に作戦地図を表示し、観測結果を手動で記入します。既知の距離で補正してから現在の状態を分隊に共有してください。共有リンクに後の編集は同期されません。",
    tableHelp: "コミュニティの参考仰角：L81 迫撃砲と SPH-2 の高弾道。飛翔時間はモデルによる推定であり、実測ではありません。現行ビルドで確認し、別の弾道は計算機で選択してください。",
    correctionTitle: "選択した弾道に合わせて修正",
    correction: "まず一発試射して着弾を観測し、計算機に距離修正を入力して前後の仰角を比較します。SPH-2 の低弾道と高弾道では変化が異なるため、100m ごとの固定ミル補正は使えません。射表の範囲外は外挿しないでください。地形や障害物は計算していません。",
    theatersTitle: "マップ別のコミュニティ地点",
    source: "コミュニティ座標の出典 · 2026 年 10 月 9 日取得",
    tactics: "地図検索で地点を探し、自分のマーカーにコピーして経路や射撃任務の端点に使えます。位置と通行可否は現在の試合で確認してください。表示されない分類はこのデータに記録がないだけで、ゲーム内に存在しないという意味ではありません。"
  },
  ru: {
    intro: "Держите план карты рядом с игрой, отмечайте наблюдения вручную и калибруйте по известному расстоянию. Делитесь снимком плана с отрядом: последующие изменения по ссылке не синхронизируются.",
    tableHelp: "Справочные углы сообщества: L81 и высокая траектория SPH-2. Время полёта оценено моделью, а не измерено. Сверяйте с текущей сборкой; другую траекторию выбирайте в калькуляторе.",
    correctionTitle: "Поправка для выбранной траектории",
    correction: "Сделайте пристрелочный выстрел, отметьте попадание и введите поправку дальности в калькулятор. Сравните прежний и новый угол. Низкая и высокая траектории SPH-2 меняются по-разному: постоянная поправка в mil на 100 м ненадёжна. Не экстраполируйте за пределы таблицы. Рельеф и препятствия не учитываются.",
    theatersTitle: "Точки сообщества по картам",
    source: "Источник координат сообщества · получено 9 октября 2026 г.",
    tactics: "Найдите место через поиск карты, скопируйте в свои отметки и используйте как точку маршрута или огневой задачи. Проверяйте положение и доступ в текущем матче. Отсутствующая категория означает отсутствие записей в наборе, а не отсутствие таких мест в игре."
  },
  de: {
    intro: "Öffne den Kartenplan neben dem Spiel, trage Beobachtungen manuell ein und kalibriere mit einer bekannten Entfernung. Teile den aktuellen Stand mit deinem Trupp. Spätere Änderungen werden über den Link nicht synchronisiert.",
    tableHelp: "Referenzwinkel der Community: L81-Mörser und steile SPH-2-Flugbahn. Flugzeiten sind Modellschätzungen, keine Messwerte. Im aktuellen Build prüfen; andere Flugbahnen im Rechner auswählen.",
    correctionTitle: "Korrektur anhand der gewählten Flugbahn",
    correction: "Gib einen Probeschuss ab, beobachte den Einschlag und trage die Entfernungskorrektur im Rechner ein. Vergleiche alten und neuen Winkel. Flache und steile SPH-2-Flugbahnen reagieren unterschiedlich; eine feste Mil-Korrektur je 100 m ist unzuverlässig. Nicht außerhalb der Schusstabelle extrapolieren. Gelände und Hindernisse werden nicht berechnet.",
    theatersTitle: "Community-Orte nach Karte",
    source: "Quelle der Community-Koordinaten · abgerufen am 9. Oktober 2026",
    tactics: "Suche einen Ort auf der Karte, kopiere ihn in deine Markierungen und nutze ihn als Wegpunkt oder Endpunkt eines Feuerauftrags. Prüfe Lage und Zugang im aktuellen Match. Fehlende Kategorien bedeuten fehlende Datensätze, nicht zwingend fehlende Orte im Spiel."
  },
  "pt-br": {
    intro: "Mantenha o plano do mapa ao lado do jogo, registre observações manualmente e calibre com uma distância conhecida. Compartilhe uma cópia do plano com o esquadrão. O link não sincroniza edições posteriores.",
    tableHelp: "Elevações de referência da comunidade: L81 e trajetória alta do SPH-2. Os tempos de voo são estimativas do modelo, não medições. Confira na versão atual; selecione outras trajetórias na calculadora.",
    correctionTitle: "Corrija conforme a trajetória selecionada",
    correction: "Faça um disparo de ajuste, observe o impacto e informe a correção de distância na calculadora. Compare a elevação anterior e a nova. As trajetórias baixa e alta do SPH-2 respondem de maneiras diferentes; uma correção fixa em mil por 100 m não é confiável. Não extrapole além da tabela. Terreno e obstáculos não são calculados.",
    theatersTitle: "Locais da comunidade por mapa",
    source: "Fonte das coordenadas da comunidade · consultada em 9 de outubro de 2026",
    tactics: "Encontre um local na busca do mapa, copie para seus marcadores e use como ponto de rota ou de missão de tiro. Verifique a posição e o acesso na partida atual. Uma categoria ausente indica falta de registros neste conjunto, não que o local inexista no jogo."
  },
  pl: {
    intro: "Otwórz plan mapy obok gry, ręcznie oznaczaj obserwacje i kalibruj według znanej odległości. Udostępnij drużynie aktualny zapis planu. Link nie synchronizuje późniejszych zmian.",
    tableHelp: "Kąty referencyjne społeczności: L81 i wysoki tor SPH-2. Czasy lotu są szacunkami modelu, a nie pomiarami. Sprawdź je w bieżącej wersji; inny tor wybierz w kalkulatorze.",
    correctionTitle: "Poprawka zgodna z wybranym torem",
    correction: "Oddaj strzał próbny, obserwuj trafienie i wpisz poprawkę odległości w kalkulatorze. Porównaj poprzedni i nowy kąt. Niski i wysoki tor SPH-2 zmieniają się inaczej, więc stała poprawka w mil na 100 m jest zawodna. Nie ekstrapoluj poza tabelę. Teren i przeszkody nie są uwzględniane.",
    theatersTitle: "Miejsca społeczności według mapy",
    source: "Źródło współrzędnych społeczności · pobrano 9 października 2026 r.",
    tactics: "Znajdź miejsce w wyszukiwarce mapy, skopiuj je do swoich znaczników i wykorzystaj jako punkt trasy lub zadania ogniowego. Sprawdź pozycję i dostęp w bieżącym meczu. Brak kategorii oznacza brak zapisów w zbiorze, a nie brak takich miejsc w grze."
  }
};
