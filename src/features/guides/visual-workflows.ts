import type {Locale} from "@/config/site";

export const visualWorkflowSlugs = [
  "wardogs-cargo-guide", "wardogs-fob-guide", "wardogs-medic-revive-guide", "wardogs-controls",
] as const;
export type VisualWorkflowSlug = (typeof visualWorkflowSlugs)[number];
export type VisualWorkflowStep = {id: string; action: string; observe: string; success: string; failure: string};
type StepCopy = readonly [action: string, observe: string, success: string, failure: string];
type WorkflowCopy = {
  title: string;
  summary: string;
  imageAlt: string;
  imageCaption: string;
  missingFrames: string;
  steps: readonly [StepCopy, StepCopy, StepCopy, StepCopy];
};
type WorkflowUi = {
  eyebrow: string; observe: string; success: string; failure: string; sources: string;
  context: string; missing: string; buildUnknown: string; editorial: string;
  originalSample: string; originalCandidate: string; officialContext: string; imageSource: string;
};

const ui: Record<Locale, WorkflowUi> = {
  en: {eyebrow: "Field workflow", observe: "Look here", success: "Pass when", failure: "If it fails", sources: "Evidence scope", context: "Context image only", missing: "Operation frames still missing", buildUnknown: "Capture build unknown", editorial: "Editorial checks; not reproduced in the current client. Use live prompts, not a historical key chart.", originalSample: "Original video sample only", originalCandidate: "Original segment link; operation not visually verified", officialContext: "Official system context only", imageSource: "Image source"},
  ru: {eyebrow: "Порядок действий", observe: "Где смотреть", success: "Критерий успеха", failure: "При неудаче", sources: "Границы доказательств", context: "Только контекст", missing: "Не хватает кадров операции", buildUnknown: "Версия съёмки неизвестна", editorial: "Редакционные проверки; в текущем клиенте не воспроизведены. Следуйте подсказкам игры, а не старой таблице клавиш.", originalSample: "Только фрагмент исходного видео", originalCandidate: "Ссылка на исходный фрагмент; операция визуально не проверена", officialContext: "Только официальное описание систем", imageSource: "Источник изображения"},
  de: {eyebrow: "Ablauf im Feld", observe: "Hier prüfen", success: "Erfolgreich, wenn", failure: "Bei Fehlschlag", sources: "Umfang der Belege", context: "Nur Kontextbild", missing: "Fehlende Bedienungsbilder", buildUnknown: "Aufnahmeversion unbekannt", editorial: "Redaktionelle Prüfungen; im aktuellen Client nicht nachgestellt. Spielhinweise statt historischer Tastentabellen verwenden.", originalSample: "Nur Stichprobe des Originalvideos", originalCandidate: "Originalsegment verlinkt; Bedienung nicht visuell bestätigt", officialContext: "Nur offizieller Systemkontext", imageSource: "Bildquelle"},
  "pt-br": {eyebrow: "Fluxo em campo", observe: "Onde olhar", success: "Passa quando", failure: "Se falhar", sources: "Alcance da evidência", context: "Imagem apenas de contexto", missing: "Faltam quadros da operação", buildUnknown: "Versão da captura desconhecida", editorial: "Verificações editoriais; não reproduzidas no cliente atual. Siga as indicações do jogo, não uma tabela antiga de teclas.", originalSample: "Apenas amostra do vídeo original", originalCandidate: "Link do trecho original; operação não verificada visualmente", officialContext: "Apenas contexto oficial dos sistemas", imageSource: "Fonte da imagem"},
  ja: {eyebrow: "現場の確認手順", observe: "見る場所", success: "成功の判定", failure: "失敗したら", sources: "証拠の範囲", context: "参考画像のみ", missing: "未収録の操作画面", buildUnknown: "撮影ビルド不明", editorial: "編集上の確認手順です。現行クライアントでの再現検証は未実施。過去のキー表ではなく、ゲーム内の表示に従ってください。", originalSample: "元動画の一部のみ確認", originalCandidate: "元動画の区間リンク。操作画面は未確認", officialContext: "公式のシステム説明のみ", imageSource: "画像の出典"},
  "zh-cn": {eyebrow: "现场操作流程", observe: "观察位置", success: "成功判据", failure: "失败后检查", sources: "证据范围", context: "仅作画面背景", missing: "仍缺操作帧", buildUnknown: "拍摄版本未知", editorial: "编辑整理的检查流程，尚未在当前客户端复现。以游戏内提示为准，不照抄历史按键表。", originalSample: "仅核对原视频片段", originalCandidate: "原视频区段链接，尚未视觉核验操作", officialContext: "仅支持官方系统背景", imageSource: "图片出处"},
  "zh-tw": {eyebrow: "現場操作流程", observe: "觀察位置", success: "成功判據", failure: "失敗後檢查", sources: "證據範圍", context: "僅作畫面背景", missing: "仍缺操作幀", buildUnknown: "拍攝版本未知", editorial: "編輯整理的檢查流程，尚未在目前用戶端重現。以遊戲內提示為準，不照抄歷史按鍵表。", originalSample: "僅核對原影片片段", originalCandidate: "原影片區段連結，尚未視覺核驗操作", officialContext: "僅支持官方系統背景", imageSource: "圖片出處"},
  pl: {eyebrow: "Procedura w terenie", observe: "Gdzie patrzeć", success: "Warunek powodzenia", failure: "Gdy się nie uda", sources: "Zakres dowodów", context: "Tylko obraz kontekstowy", missing: "Brakujące kadry operacji", buildUnknown: "Wersja nagrania nieznana", editorial: "Kontrole redakcyjne; nie odtworzono ich w obecnym kliencie. Korzystaj z komunikatów gry, nie ze starej tabeli klawiszy.", originalSample: "Tylko próbka oryginalnego filmu", originalCandidate: "Link do oryginalnego fragmentu; operacji nie potwierdzono wizualnie", officialContext: "Tylko oficjalny opis systemów", imageSource: "Źródło obrazu"},
};

const cargo: Record<Locale, WorkflowCopy> = {
  en: {
    title: "Cargo: dropped is not delivered", summary: "Follow the resource from the vehicle to usable FOB stock. A pallet on the ground is an intermediate state.",
    imageAlt: "Existing WARDOGS Ural vehicle artwork, not an unloading screen", imageCaption: "Ural identification context. This image shows neither the receiving area nor a transfer prompt.", missingFrames: "Current cargo selection, valid receiving prompt, and before/after FOB stock receipt.",
    steps: [
      ["Confirm the requested load", "Vehicle cargo menu and the destination's resource request.", "The selected resource matches what the receiving FOB needs.", "Wrong type or missing cargo: recheck the load before unloading."],
      ["Stop at the receiver", "The live receiving prompt and the vehicle's exit route.", "The receiver accepts this cargo and the access lane stays clear.", "No valid prompt: check position and the displayed requirement; do not guess a distance."],
      ["Drop, then transfer", "Selected cargo, ground load and the current transfer interaction.", "Complete the transfer shown by your current interface, not just the drop.", "Only a ground pallet remains: verify the receiving interaction before leaving."],
      ["Check the receipt", "The same FOB resource stock before and after the transfer.", "The requested resource is registered as usable stock; then clear the lane.", "No clear stock change: check type, receiver and team consumption before repeating."],
    ],
  },
  ru: {
    title: "Груз: сброс ещё не доставка", summary: "Проследите ресурс от машины до доступного запаса FOB. Поддон на земле — промежуточный этап.",
    imageAlt: "Существующее изображение Ural из WARDOGS, не экран разгрузки", imageCaption: "Контекст для узнавания Ural. Зона приёма и подсказка передачи здесь не показаны.", missingFrames: "Выбор груза в текущей версии, допустимая передача и запас FOB до и после приёма.",
    steps: [
      ["Проверьте нужный груз", "Меню груза машины и запрос ресурсов FOB.", "Выбранный ресурс соответствует запросу принимающей FOB.", "Неверный тип или пустой груз: проверьте загрузку до разгрузки."],
      ["Остановитесь у приёмника", "Текущая подсказка приёма и путь выезда машины.", "Приёмник принимает этот груз, а проезд остаётся свободным.", "Нет подсказки: проверьте положение и указанное требование; не угадывайте расстояние."],
      ["Сбросьте и передайте", "Выбранный груз, поддон на земле и действие передачи.", "Завершите передачу по текущему интерфейсу, а не только сброс.", "На земле остался поддон: проверьте действие приёма, прежде чем уезжать."],
      ["Проверьте приём", "Запас того же ресурса FOB до и после передачи.", "Нужный ресурс учтён как доступный запас; освободите проезд.", "Изменение неясно: проверьте тип, приёмник и расход команды до повтора."],
    ],
  },
  de: {
    title: "Fracht: abgeworfen ist nicht geliefert", summary: "Verfolge die Ressource vom Fahrzeug bis zum nutzbaren FOB-Vorrat. Eine Palette am Boden ist ein Zwischenzustand.",
    imageAlt: "Vorhandenes WARDOGS-Ural-Bild, kein Entladebildschirm", imageCaption: "Ural als Fahrzeugkontext. Weder Empfangsbereich noch Übergabehinweis sind abgebildet.", missingFrames: "Aktuelle Frachtauswahl, gültiger Empfangshinweis und FOB-Vorrat vor/nach der Übergabe.",
    steps: [
      ["Angeforderte Ladung prüfen", "Frachtmenü des Fahrzeugs und Ressourcenanforderung der FOB.", "Die gewählte Ressource entspricht dem Bedarf der empfangenden FOB.", "Falscher Typ oder keine Fracht: Ladung vor dem Entladen prüfen."],
      ["Am Empfang halten", "Aktueller Empfangshinweis und Ausfahrt des Fahrzeugs.", "Der Empfänger nimmt die Fracht an und die Zufahrt bleibt frei.", "Kein gültiger Hinweis: Position und angezeigte Voraussetzung prüfen; keine Entfernung raten."],
      ["Abwerfen, dann übergeben", "Gewählte Fracht, Bodenladung und aktuelle Übergabeaktion.", "Die im aktuellen Menü angezeigte Übergabe abschließen, nicht nur abwerfen.", "Nur eine Palette am Boden: vor der Abfahrt die Empfangsaktion prüfen."],
      ["Empfang kontrollieren", "Derselbe FOB-Ressourcenvorrat vor und nach der Übergabe.", "Die Ressource ist als nutzbarer Vorrat erfasst; danach die Zufahrt räumen.", "Keine klare Änderung: Typ, Empfänger und Teamverbrauch vor einer Wiederholung prüfen."],
    ],
  },
  "pt-br": {
    title: "Carga: soltar não é entregar", summary: "Acompanhe o recurso do veículo até o estoque utilizável do FOB. Um pallet no chão é só uma etapa intermediária.",
    imageAlt: "Imagem existente do Ural em WARDOGS, não uma tela de descarga", imageCaption: "Contexto para identificar o Ural. A área receptora e a indicação de transferência não aparecem.", missingFrames: "Seleção de carga atual, indicação válida de recebimento e estoque do FOB antes/depois.",
    steps: [
      ["Confirme a carga pedida", "Menu de carga do veículo e pedido de recurso do FOB.", "O recurso selecionado corresponde ao que o FOB precisa.", "Tipo errado ou sem carga: confira o carregamento antes de descarregar."],
      ["Pare junto ao receptor", "Indicação atual de recebimento e rota de saída do veículo.", "O receptor aceita a carga e a passagem continua livre.", "Sem indicação válida: confira posição e requisito exibido; não adivinhe a distância."],
      ["Solte e transfira", "Carga selecionada, pallet no chão e interação atual de transferência.", "Conclua a transferência indicada na interface atual, não apenas a soltura.", "Só há um pallet no chão: confira a interação de recebimento antes de sair."],
      ["Confira o recebimento", "Estoque do mesmo recurso no FOB antes e depois da transferência.", "O recurso foi registrado como estoque utilizável; libere a passagem.", "Mudança incerta: confira tipo, receptor e consumo da equipe antes de repetir."],
    ],
  },
  ja: {
    title: "貨物：降ろすだけでは納品完了しない", summary: "車両の貨物からFOBで使える資源になるまで確認。地面のパレットは途中段階です。",
    imageAlt: "既存のWARDOGS Ural車両画像。荷下ろし画面ではありません", imageCaption: "Uralの識別用画像。受け取り範囲や移送の表示は写っていません。", missingFrames: "現行の貨物選択、受け取り可能な表示、移送前後のFOB資源数。",
    steps: [
      ["必要な貨物を確認", "車両の貨物メニューと配送先FOBの資源要求。", "選択した資源が配送先の要求と一致する。", "種類違いや空荷なら、降ろす前に積み荷を確認。"],
      ["受け取り場所で停車", "現在の受け取り表示と車両の退出経路。", "貨物を受け取れる表示があり、通路を塞いでいない。", "表示がなければ位置と要求条件を確認。距離を推測しない。"],
      ["降ろしてから移送", "選択中の貨物、地面の荷物、現在の移送操作。", "降ろすだけでなく、現在の表示に従って移送を完了する。", "地面にパレットがあるだけなら、出発前に受け取り操作を確認。"],
      ["受領を確認", "同じFOBの同じ資源について、移送前後の在庫。", "要求資源が使用可能な在庫に反映されたら通路を空ける。", "変化が不明なら種類、受取先、味方の消費を確認してから再試行。"],
    ],
  },
  "zh-cn": {
    title: "货盘卸下，不等于完成交付", summary: "从车上货物一直核对到 FOB 可用库存。地上的货盘只是中间状态。",
    imageAlt: "已有的 WARDOGS Ural 车辆素材，不是卸货操作画面", imageCaption: "仅用于识别 Ural；画面没有接收区域或转移提示。", missingFrames: "当前货物选择、有效接收提示，以及 FOB 收货前后的同类库存。",
    steps: [
      ["确认请求的货物", "车辆货物菜单与目标 FOB 的资源需求。", "选中的资源类型与接收方需求一致。", "类型不对或没有装货：卸货前先核对载荷。"],
      ["停在接收位置", "当前接收提示与车辆离开的通路。", "接收方允许这批货物，出入口保持畅通。", "没有有效提示：检查位置和界面要求，不猜通用距离。"],
      ["先卸下，再转移", "选中货物、地面货盘与当前转移交互。", "完成当前界面要求的转移，而不是只把货盘放地上。", "仍只有地面货盘：离开前核对接收交互。"],
      ["核对收货结果", "同一 FOB、同类资源在转移前后的库存。", "请求资源登记为可用库存，再让出卸货通路。", "变化不明确：核对类型、接收方与队友消耗，再决定是否重试。"],
    ],
  },
  "zh-tw": {
    title: "貨盤卸下，不等於完成交付", summary: "從車上貨物一路核對到 FOB 可用庫存。地上的貨盤只是中間狀態。",
    imageAlt: "已有的 WARDOGS Ural 車輛素材，不是卸貨操作畫面", imageCaption: "僅用於識別 Ural；畫面沒有接收區域或轉移提示。", missingFrames: "目前貨物選擇、有效接收提示，以及 FOB 收貨前後的同類庫存。",
    steps: [
      ["確認請求的貨物", "車輛貨物選單與目標 FOB 的資源需求。", "選中的資源類型與接收方需求一致。", "類型不對或沒有裝貨：卸貨前先核對載荷。"],
      ["停在接收位置", "目前接收提示與車輛離開的通路。", "接收方允許這批貨物，出入口保持暢通。", "沒有有效提示：檢查位置和介面要求，不猜通用距離。"],
      ["先卸下，再轉移", "選中貨物、地面貨盤與目前轉移互動。", "完成目前介面要求的轉移，而不是只把貨盤放地上。", "仍只有地面貨盤：離開前核對接收互動。"],
      ["核對收貨結果", "同一 FOB、同類資源在轉移前後的庫存。", "請求資源登記為可用庫存，再讓出卸貨通路。", "變化不明確：核對類型、接收方與隊友消耗，再決定是否重試。"],
    ],
  },
  pl: {
    title: "Ładunek: zrzut to nie dostawa", summary: "Śledź zasób od pojazdu do użytecznego zapasu FOB. Paleta na ziemi jest etapem pośrednim.",
    imageAlt: "Istniejąca grafika Ural z WARDOGS, nie ekran rozładunku", imageCaption: "Kontekst rozpoznania Ural. Nie widać obszaru odbioru ani komunikatu przekazania.", missingFrames: "Obecny wybór ładunku, poprawny komunikat odbioru i zapas FOB przed/po przekazaniu.",
    steps: [
      ["Sprawdź zamówiony ładunek", "Menu ładunku pojazdu i zapotrzebowanie docelowego FOB.", "Wybrany zasób odpowiada potrzebie odbierającego FOB.", "Zły typ lub brak ładunku: sprawdź załadunek przed rozładunkiem."],
      ["Zatrzymaj się przy odbiorcy", "Bieżący komunikat odbioru i droga wyjazdu pojazdu.", "Odbiorca przyjmuje ładunek, a przejazd pozostaje wolny.", "Brak komunikatu: sprawdź pozycję i wyświetlany warunek; nie zgaduj odległości."],
      ["Zrzuć, potem przekaż", "Wybrany ładunek, paleta na ziemi i obecna interakcja przekazania.", "Zakończ przekazanie wskazane w obecnym interfejsie, nie sam zrzut.", "Jest tylko paleta na ziemi: sprawdź odbiór przed odjazdem."],
      ["Sprawdź odbiór", "Zapas tego samego zasobu FOB przed i po przekazaniu.", "Zasób został zapisany jako użyteczny zapas; zwolnij przejazd.", "Zmiana niejasna: sprawdź typ, odbiorcę i zużycie zespołu przed powtórką."],
    ],
  },
};

const fob: Record<Locale, WorkflowCopy> = {
  en: {
    title: "FOB: validate placement before expanding", summary: "Check access, the live preview, the built object and the first supply run separately.",
    imageAlt: "Official WARDOGS river terrain screenshot, not a FOB placement screen", imageCaption: "Terrain context from the official press kit. No FOB footprint, valid preview or measured clearance is shown.", missingFrames: "Current valid/invalid FOB previews with rejection messages, a vehicle access test, and a supplied-base receipt.",
    steps: [
      ["Reserve access", "The delivery approach, unloading space and a way out.", "The intended vehicle can enter, turn and leave before walls are added.", "Blocked approach: revise the layout before investing in defenses."],
      ["Read the placement preview", "Current tool or deployable, preview and exact requirement message.", "The interface accepts this particular position.", "Rejected: separate terrain/overlap from tool, unlock, permission, resource or limit requirements."],
      ["Confirm the built state", "The placed object and its current completion or interaction state.", "The object is actually built and available, not merely a preview.", "Only a plan or unfinished object: follow the displayed construction requirement."],
      ["Prove the supply loop", "Usable resources and the separate spawn/deployment interface.", "Supplies register and any requested spawn support meets its own conditions.", "No supply or spawn: diagnose each separately; a placed FOB is not proof of either."],
    ],
  },
  ru: {
    title: "FOB: проверьте размещение до расширения", summary: "Отдельно проверьте подъезд, текущий предпросмотр, построенный объект и первую доставку.",
    imageAlt: "Официальный снимок речной местности WARDOGS, не экран размещения FOB", imageCaption: "Контекст местности из официального пресс-кита. Нет контура FOB, допустимого предпросмотра или измеренного зазора.", missingFrames: "Допустимый и отклонённый предпросмотр FOB с причинами, проверка проезда и подтверждение снабжения.",
    steps: [
      ["Оставьте проезд", "Подъезд доставки, место разгрузки и выезд.", "Нужная машина может въехать, развернуться и выехать до возведения стен.", "Подъезд перекрыт: измените план до вложений в оборону."],
      ["Читайте предпросмотр", "Текущий инструмент или предмет, предпросмотр и точное сообщение.", "Интерфейс принимает именно эту позицию.", "Отказ: отделите рельеф/пересечение от инструмента, доступа, ресурса и лимита."],
      ["Подтвердите постройку", "Размещённый объект и его состояние готовности или взаимодействия.", "Объект действительно построен и доступен, а не только показан в предпросмотре.", "Лишь план или незавершённый объект: выполните указанное требование строительства."],
      ["Проверьте снабжение", "Доступные ресурсы и отдельный интерфейс развёртывания/возрождения.", "Ресурсы учтены, а нужная поддержка возрождения выполняет свои условия.", "Нет ресурсов или возрождения: проверяйте отдельно; размещение FOB ничего из этого не доказывает."],
    ],
  },
  de: {
    title: "FOB: Platzierung vor dem Ausbau prüfen", summary: "Zufahrt, aktuelle Vorschau, fertiges Objekt und erste Lieferung getrennt prüfen.",
    imageAlt: "Offizielles WARDOGS-Bild einer Flusslandschaft, keine FOB-Platzierung", imageCaption: "Geländekontext aus dem offiziellen Press Kit. Kein FOB-Umriss, gültige Vorschau oder gemessener Freiraum.", missingFrames: "Aktuelle gültige/ungültige FOB-Vorschauen mit Fehlermeldungen, Zufahrtstest und bestätigte Versorgung.",
    steps: [
      ["Zufahrt freihalten", "Lieferweg, Entladefläche und Ausfahrt.", "Das vorgesehene Fahrzeug kann vor dem Mauerbau einfahren, wenden und ausfahren.", "Zufahrt blockiert: Grundriss vor dem Ausbau der Verteidigung ändern."],
      ["Vorschau lesen", "Aktuelles Werkzeug oder Objekt, Vorschau und genaue Anforderung.", "Die Oberfläche akzeptiert genau diese Position.", "Abgelehnt: Gelände/Überlappung von Werkzeug, Freischaltung, Berechtigung, Ressourcen und Limit trennen."],
      ["Fertigen Bau prüfen", "Platziertes Objekt und aktueller Fertigstellungs- oder Interaktionszustand.", "Das Objekt ist tatsächlich gebaut und verfügbar, nicht nur eine Vorschau.", "Nur Plan oder unfertiger Bau: angezeigte Bauanforderung erfüllen."],
      ["Versorgung belegen", "Nutzbare Ressourcen und separate Spawn-/Deployment-Oberfläche.", "Vorräte sind erfasst; benötigte Spawn-Unterstützung erfüllt ihre eigenen Bedingungen.", "Keine Versorgung oder kein Spawn: getrennt prüfen; eine platzierte FOB beweist beides nicht."],
    ],
  },
  "pt-br": {
    title: "FOB: valide a posição antes de ampliar", summary: "Confira separadamente o acesso, a prévia atual, a estrutura construída e a primeira entrega.",
    imageAlt: "Captura oficial do terreno de rio em WARDOGS, não de posicionamento do FOB", imageCaption: "Contexto de terreno do press kit oficial. Não mostra contorno de FOB, prévia válida nem folga medida.", missingFrames: "Prévias atuais válidas/inválidas com mensagens, teste de acesso do veículo e confirmação de abastecimento.",
    steps: [
      ["Reserve o acesso", "Aproximação da entrega, espaço de descarga e saída.", "O veículo previsto consegue entrar, virar e sair antes de erguer paredes.", "Acesso bloqueado: revise o desenho antes de investir em defesas."],
      ["Leia a prévia", "Ferramenta ou objeto atual, prévia e requisito exato exibido.", "A interface aceita essa posição específica.", "Recusa: separe terreno/sobreposição de ferramenta, desbloqueio, permissão, recurso ou limite."],
      ["Confirme a construção", "Objeto colocado e estado atual de conclusão ou interação.", "O objeto está realmente construído e disponível, não só em prévia.", "Só um plano ou objeto incompleto: siga o requisito de construção exibido."],
      ["Comprove o abastecimento", "Recursos utilizáveis e interface separada de spawn/desdobramento.", "O estoque foi registrado e o apoio de spawn atende às suas próprias condições.", "Sem estoque ou spawn: diagnostique separadamente; um FOB colocado não comprova nenhum deles."],
    ],
  },
  ja: {
    title: "FOB：拡張前に設置を確認", summary: "進入路、現在のプレビュー、完成した建物、最初の補給を別々に確認します。",
    imageAlt: "公式のWARDOGS河川地形画像。FOB設置画面ではありません", imageCaption: "公式プレスキットの地形参考画像。FOBの設置範囲、有効なプレビュー、実測した余裕は示していません。", missingFrames: "現行FOBの有効・無効な設置プレビューと理由、車両の進入試験、補給受領画面。",
    steps: [
      ["通路を確保", "配送車両の進入路、荷下ろし場所、退出路。", "壁を追加する前に予定車両が進入・旋回・退出できる。", "進入できなければ、防御設備に投資する前に配置を変更。"],
      ["設置プレビューを読む", "現在の道具や設置物、プレビュー、正確な要求表示。", "その位置を現在の画面が受け付ける。", "拒否されたら地形・重なりと、道具・解放・権限・資源・上限を分けて確認。"],
      ["建設完了を確認", "配置した物と現在の完成・操作可能状態。", "プレビューではなく、実際に完成して利用可能になっている。", "計画だけ、または未完成なら、表示された建設条件を満たす。"],
      ["補給経路を確認", "使用可能な資源と、別の出撃・展開画面。", "補給が在庫に反映され、必要な出撃支援も固有の条件を満たす。", "資源不足と出撃不可は別々に調べる。FOB設置だけではどちらも証明できない。"],
    ],
  },
  "zh-cn": {
    title: "FOB：先验收放置，再扩建", summary: "车辆通路、放置预览、已建成状态和首次补给分别验收。",
    imageAlt: "WARDOGS 官方河岸地形截图，不是 FOB 放置界面", imageCaption: "官方素材仅提供地形背景；没有 FOB 占地、有效预览或实测净空。", missingFrames: "当前 FOB 有效/无效预览及拒绝信息、车辆进出测试和补给到账画面。",
    steps: [
      ["预留车辆通路", "补给接近路线、卸货空间与撤离出口。", "加墙之前，计划使用的车辆能进入、转向并离开。", "通路被挡：先调整布局，再投入防御建筑。"],
      ["读放置预览", "当前工具或部署物、预览与准确要求提示。", "界面接受这一个具体位置。", "被拒绝：区分地形/重叠与工具、解锁、权限、资源或数量要求。"],
      ["确认已经建成", "已放置物体与当前完工或可交互状态。", "实际建成且可用，而不是只有预览。", "仅有规划或未完工物：按显示的建造条件继续检查。"],
      ["跑通首次补给", "可用库存与独立的出生/部署界面。", "资源到账，所需出生支援也满足自身条件。", "没库存或不能出生：分别诊断；放下 FOB 不能证明两者已成立。"],
    ],
  },
  "zh-tw": {
    title: "FOB：先驗收放置，再擴建", summary: "車輛通路、放置預覽、已建成狀態和首次補給分別驗收。",
    imageAlt: "WARDOGS 官方河岸地形截圖，不是 FOB 放置介面", imageCaption: "官方素材僅提供地形背景；沒有 FOB 佔地、有效預覽或實測淨空。", missingFrames: "目前 FOB 有效/無效預覽及拒絕訊息、車輛進出測試和補給入帳畫面。",
    steps: [
      ["預留車輛通路", "補給接近路線、卸貨空間與撤離出口。", "加牆之前，計畫使用的車輛能進入、轉向並離開。", "通路被擋：先調整配置，再投入防禦建築。"],
      ["讀放置預覽", "目前工具或部署物、預覽與準確要求提示。", "介面接受這一個具體位置。", "被拒絕：區分地形/重疊與工具、解鎖、權限、資源或數量要求。"],
      ["確認已經建成", "已放置物體與目前完工或可互動狀態。", "實際建成且可用，而不是只有預覽。", "僅有規劃或未完工物：按顯示的建造條件繼續檢查。"],
      ["跑通首次補給", "可用庫存與獨立的重生/部署介面。", "資源入帳，所需重生支援也滿足自身條件。", "沒庫存或不能重生：分別診斷；放下 FOB 不能證明兩者已成立。"],
    ],
  },
  pl: {
    title: "FOB: sprawdź ustawienie przed rozbudową", summary: "Osobno sprawdź dojazd, obecny podgląd, gotowy obiekt i pierwszą dostawę.",
    imageAlt: "Oficjalny zrzut terenu nad rzeką w WARDOGS, nie ekran ustawiania FOB", imageCaption: "Kontekst terenu z oficjalnego press kitu. Brak obrysu FOB, poprawnego podglądu i zmierzonego prześwitu.", missingFrames: "Obecne poprawne/błędne podglądy FOB z komunikatami, test przejazdu i potwierdzenie dostawy.",
    steps: [
      ["Zostaw dostęp", "Dojazd dostawy, miejsce rozładunku i wyjazd.", "Planowany pojazd może wjechać, zawrócić i wyjechać przed postawieniem ścian.", "Zablokowany dojazd: zmień plan przed inwestycją w obronę."],
      ["Czytaj podgląd", "Obecne narzędzie lub obiekt, podgląd i dokładny komunikat wymagania.", "Interfejs akceptuje tę konkretną pozycję.", "Odmowa: oddziel teren/kolizję od narzędzia, odblokowania, uprawnień, zasobu lub limitu."],
      ["Sprawdź ukończenie", "Postawiony obiekt i obecny stan ukończenia lub interakcji.", "Obiekt naprawdę zbudowano i jest dostępny; to nie sam podgląd.", "Tylko plan lub niegotowy obiekt: spełnij wyświetlony wymóg budowy."],
      ["Sprawdź dostawę", "Użyteczne zasoby i osobny interfejs odradzania/rozstawiania.", "Zapas zapisano, a potrzebne wsparcie odradzania spełnia własne warunki.", "Brak zapasu lub odrodzenia: badaj osobno; postawienie FOB nie dowodzi żadnego z nich."],
    ],
  },
};

const medic: Record<Locale, WorkflowCopy> = {
  en: {
    title: "Revive: threat, interaction, recovery", summary: "Treat a reachable casualty and a safe recovery as separate checks. A completed interaction is not a safe exit.",
    imageAlt: "Official WARDOGS image of a casualty beside a tank; no revive interface", imageCaption: "Casualty and vehicle-cover context only. The press image proves no key, timer, treatment item or completed revive.", missingFrames: "Current eligible/ineligible casualty prompts, the required equipment state, and a complete revive followed by recovery.",
    steps: [
      ["Control the approach", "The shooter lane, second angle and your exit cover.", "You have a covered route and a teammate watching the threat.", "The lane is still exposed: hold or change route instead of adding another casualty."],
      ["Check the casualty prompt", "The downed player's current interaction and your medical equipment.", "The live interface offers the recovery action and its requirements are met.", "No action: read the casualty state and equipment requirement; do not invent a universal key."],
      ["Perform the shown action", "The current interaction feedback while keeping the threat in mind.", "The action completes and the teammate is no longer in the downed state.", "Interaction stops or danger returns: protect yourself and recheck the displayed state before retrying."],
      ["Recover behind cover", "Both players' condition, available treatment and the next enemy angle.", "Both players can move into cover and assess any remaining damage.", "The teammate is up but exposed: move first; completion alone is not a safe recovery."],
    ],
  },
  ru: {
    title: "Оживление: угроза, действие, отход", summary: "Доступность раненого и безопасное спасение проверяйте отдельно. Завершённое действие не гарантирует отход.",
    imageAlt: "Официальное изображение раненого рядом с танком в WARDOGS; без интерфейса оживления", imageCaption: "Только контекст раненого и укрытия у машины. Изображение не подтверждает клавишу, таймер, предмет или успех оживления.", missingFrames: "Текущие подсказки доступного/недоступного оживления, нужное снаряжение и полный цикл спасения.",
    steps: [
      ["Прикройте подход", "Линия огня, второй угол и укрытие для отхода.", "Есть прикрытый маршрут и союзник, наблюдающий за угрозой.", "Проход простреливается: ждите или меняйте маршрут, не становитесь второй жертвой."],
      ["Проверьте подсказку", "Текущее действие у раненого и ваше медицинское снаряжение.", "Интерфейс предлагает восстановление, и требования выполнены.", "Нет действия: читайте состояние раненого и требования; не придумывайте общую клавишу."],
      ["Выполните действие", "Текущий отклик взаимодействия и обстановка вокруг.", "Действие завершено, союзник больше не находится в состоянии раненого.", "Остановка или новая угроза: защитите себя и проверьте состояние до повтора."],
      ["Отойдите в укрытие", "Состояние обоих игроков, доступное лечение и новый угол угрозы.", "Оба могут уйти в укрытие и оценить оставшиеся повреждения.", "Союзник встал, но открыт: сначала переместитесь; это ещё не безопасное спасение."],
    ],
  },
  de: {
    title: "Wiederbeleben: Gefahr, Aktion, Rückzug", summary: "Erreichbare Verwundete und sichere Rettung getrennt prüfen. Eine abgeschlossene Aktion garantiert keinen sicheren Rückzug.",
    imageAlt: "Offizielles WARDOGS-Bild eines Verwundeten neben einem Panzer; ohne Wiederbelebungsmenü", imageCaption: "Nur Kontext zu Verwundeten und Fahrzeugdeckung. Kein Beleg für Taste, Dauer, Behandlungsgegenstand oder erfolgreiche Wiederbelebung.", missingFrames: "Aktuelle mögliche/unmögliche Interaktion, benötigte Ausrüstung und vollständige Wiederbelebung mit Rückzug.",
    steps: [
      ["Annäherung sichern", "Schusslinie, zweiter Winkel und Rückzugsdeckung.", "Ein gedeckter Weg ist vorhanden und ein Teammitglied beobachtet die Gefahr.", "Weg noch unter Beschuss: warten oder Route ändern, nicht selbst verwundet werden."],
      ["Interaktion prüfen", "Aktueller Hinweis am Verwundeten und deine medizinische Ausrüstung.", "Die Oberfläche bietet die Rettungsaktion an und ihre Voraussetzungen sind erfüllt.", "Keine Aktion: Zustand und Ausrüstungsvorgabe lesen; keine universelle Taste erfinden."],
      ["Angezeigte Aktion ausführen", "Aktuelle Interaktionsrückmeldung und die Bedrohung im Umfeld.", "Die Aktion endet erfolgreich und der Mitspieler ist nicht mehr niedergeschlagen.", "Abbruch oder neue Gefahr: selbst schützen und Zustand vor dem nächsten Versuch prüfen."],
      ["In Deckung erholen", "Zustand beider Spieler, mögliche Behandlung und nächster Gefahrenwinkel.", "Beide können in Deckung gehen und verbleibenden Schaden prüfen.", "Mitspieler steht, ist aber offen: zuerst bewegen; Abschluss allein ist keine sichere Rettung."],
    ],
  },
  "pt-br": {
    title: "Reviver: ameaça, interação, recuperação", summary: "Separe alcançar o ferido de concluir um resgate seguro. Terminar a interação não garante uma saída segura.",
    imageAlt: "Imagem oficial de um ferido junto a um tanque em WARDOGS; sem interface de revive", imageCaption: "Apenas contexto de ferido e cobertura de veículo. Não comprova tecla, tempo, item médico ou revive concluído.", missingFrames: "Indicações atuais de revive permitido/bloqueado, equipamento necessário e revive completo seguido de recuperação.",
    steps: [
      ["Proteja a aproximação", "Linha do atirador, segundo ângulo e cobertura para sair.", "Há uma rota coberta e um aliado observando a ameaça.", "Rota ainda exposta: espere ou mude o caminho, sem virar mais uma baixa."],
      ["Confira a indicação", "Interação atual do ferido e seu equipamento médico.", "A interface oferece a recuperação e os requisitos estão atendidos.", "Sem ação: leia o estado e o requisito de equipamento; não invente uma tecla universal."],
      ["Faça a ação indicada", "Resposta atual da interação e a ameaça ao redor.", "A ação termina e o aliado deixa o estado de incapacitado.", "Interrupção ou nova ameaça: proteja-se e confira o estado antes de tentar de novo."],
      ["Recupere-se na cobertura", "Condição dos dois, tratamento disponível e próximo ângulo inimigo.", "Ambos conseguem chegar à cobertura e avaliar o dano restante.", "Aliado levantou, mas está exposto: movam-se primeiro; concluir não torna o resgate seguro."],
    ],
  },
  ja: {
    title: "蘇生：脅威、操作、退避", summary: "倒れた味方に届くことと安全な救助を分けて確認。操作完了だけでは安全に離脱できません。",
    imageAlt: "戦車のそばの負傷者を描く公式WARDOGS画像。蘇生操作表示はありません", imageCaption: "負傷者と車両遮蔽物の参考画像のみ。キー、時間、医療品、蘇生完了を証明するものではありません。", missingFrames: "現行の蘇生可能・不可能な表示、必要装備の状態、蘇生から退避までの一連の画面。",
    steps: [
      ["接近経路を確保", "射線、別の角度、退避先の遮蔽物。", "遮蔽のある経路と、脅威を監視する味方がいる。", "まだ危険なら待機か経路変更。自分も倒れないようにする。"],
      ["負傷者の表示を確認", "倒れた味方への現在の操作表示と医療装備。", "回復操作が表示され、要求条件を満たしている。", "操作がなければ状態と装備条件を確認。共通キーを推測しない。"],
      ["表示された操作を実行", "現在の操作反応と周辺の脅威。", "操作が完了し、味方が倒れた状態から復帰する。", "中断や危険があれば自分を守り、表示状態を確認してから再試行。"],
      ["遮蔽物で立て直す", "両者の状態、利用可能な治療、次の敵の角度。", "二人とも遮蔽物へ移動し、残った負傷を確認できる。", "立ち上がっても露出中なら先に移動。操作完了だけでは安全な救助にならない。"],
    ],
  },
  "zh-cn": {
    title: "救起队友：威胁、交互、脱离", summary: "能接近伤员与安全救援分别判断。交互完成不代表已经安全离开。",
    imageAlt: "WARDOGS 官方坦克旁伤员画面，没有复活交互界面", imageCaption: "仅提供伤员与车辆掩体背景；不能证明按键、时长、医疗物品或已完成复活。", missingFrames: "当前可救/不可救提示、所需装备状态，以及救起后脱离的完整过程。",
    steps: [
      ["控制接近路线", "射手方向、第二条射线与撤离掩体。", "有受掩护的路径，且队友正在观察威胁。", "路线仍暴露：等待或换路，不再增加一个伤员。"],
      ["核对伤员提示", "倒地队友的当前交互提示与自己的医疗装备。", "界面提供救援动作，且满足显示的条件。", "没有动作：读伤员状态和装备要求，不编造通用救人键。"],
      ["执行显示的动作", "当前交互反馈，同时继续留意周围威胁。", "动作完成，队友不再处于倒地状态。", "动作中断或危险重现：先保护自己，再读当前状态决定重试。"],
      ["在掩体后恢复", "双方状态、可用治疗与下一条敌方射线。", "两人能转移到掩体，并检查剩余伤害。", "队友起来但仍暴露：先移动；完成交互不等于安全救援。"],
    ],
  },
  "zh-tw": {
    title: "救起隊友：威脅、互動、脫離", summary: "能接近傷員與安全救援分別判斷。互動完成不代表已經安全離開。",
    imageAlt: "WARDOGS 官方戰車旁傷員畫面，沒有復活互動介面", imageCaption: "僅提供傷員與車輛掩體背景；不能證明按鍵、時長、醫療物品或已完成復活。", missingFrames: "目前可救/不可救提示、所需裝備狀態，以及救起後脫離的完整過程。",
    steps: [
      ["控制接近路線", "射手方向、第二條射線與撤離掩體。", "有受掩護的路徑，且隊友正在觀察威脅。", "路線仍暴露：等待或換路，不再增加一個傷員。"],
      ["核對傷員提示", "倒地隊友的目前互動提示與自己的醫療裝備。", "介面提供救援動作，且滿足顯示的條件。", "沒有動作：讀傷員狀態和裝備要求，不編造通用救人鍵。"],
      ["執行顯示的動作", "目前互動回饋，同時繼續留意周圍威脅。", "動作完成，隊友不再處於倒地狀態。", "動作中斷或危險重現：先保護自己，再讀目前狀態決定重試。"],
      ["在掩體後恢復", "雙方狀態、可用治療與下一條敵方射線。", "兩人能轉移到掩體，並檢查剩餘傷害。", "隊友起來但仍暴露：先移動；完成互動不等於安全救援。"],
    ],
  },
  pl: {
    title: "Reanimacja: zagrożenie, działanie, odwrót", summary: "Oddziel dostępność rannego od bezpiecznej akcji ratunkowej. Koniec interakcji nie gwarantuje bezpiecznego wyjścia.",
    imageAlt: "Oficjalny obraz rannego obok czołgu w WARDOGS; bez interfejsu reanimacji", imageCaption: "Tylko kontekst rannego i osłony pojazdu. Obraz nie potwierdza klawisza, czasu, przedmiotu ani ukończonej reanimacji.", missingFrames: "Obecne komunikaty możliwej/zablokowanej reanimacji, wymagany sprzęt i pełny ratunek z odwrotem.",
    steps: [
      ["Zabezpiecz podejście", "Linia strzelca, drugi kąt i osłona na odwrót.", "Masz osłoniętą drogę i sojusznika pilnującego zagrożenia.", "Droga wciąż odkryta: poczekaj lub zmień trasę, nie zostań kolejnym rannym."],
      ["Sprawdź komunikat", "Obecna interakcja z rannym i twój sprzęt medyczny.", "Interfejs oferuje ratunek i spełniasz jego warunki.", "Brak akcji: czytaj stan i wymagania sprzętu; nie wymyślaj uniwersalnego klawisza."],
      ["Wykonaj wskazaną akcję", "Obecna reakcja interakcji i zagrożenie w otoczeniu.", "Akcja się kończy, a sojusznik nie jest już powalony.", "Przerwanie lub nowa groźba: osłoń siebie i sprawdź stan przed kolejną próbą."],
      ["Odpocznij za osłoną", "Stan obu graczy, dostępne leczenie i następny kąt przeciwnika.", "Obaj mogą dojść za osłonę i ocenić pozostałe obrażenia.", "Sojusznik wstał, lecz jest odkryty: najpierw ruch; koniec interakcji to nie bezpieczny ratunek."],
    ],
  },
};

const scope: Record<Locale, WorkflowCopy> = {
  en: {
    title: "Scope: identify the action, then test", summary: "ADS, field of view and optic magnification are different. This is a diagnostic sequence, not a verified zoom shortcut.",
    imageAlt: "Historical WARDOGS 2.5x combat optic artwork, not a zoom controls screen", imageCaption: "Optic identification context only. The artwork does not establish variable magnification or a compatible weapon.", missingFrames: "Current optic-specific controls, default/remapped input and same-target before/after magnification with FOV unchanged.",
    steps: [
      ["Name the equipped optic", "Actual weapon and equipped optic in the current inventory.", "You can record both exact names, not just a catalogue image.", "Unclear equipment: verify what is equipped before changing bindings."],
      ["Find the zoom action", "Current optic description and controls menu; separate ADS from magnification.", "A magnification action is explicitly offered for this setup.", "No action shown: stop treating zoom as available; do not reset the whole profile."],
      ["Test one binding", "Displayed binding, active device and possible input conflicts.", "One offered input triggers the intended action in a safe place.", "Wrong action or no response: check conflicts and remapping without changing everything."],
      ["Compare the same target", "Same position, target, ADS state and unchanged FOV.", "An observable magnification change follows the offered action.", "Still unchanged: record build, device, weapon, optic and binding screenshots; no universal key is verified here."],
    ],
  },
  ru: {
    title: "Прицел: найдите действие и проверьте", summary: "Прицеливание, поле зрения и кратность — разные вещи. Это диагностика, а не подтверждённая клавиша зума.",
    imageAlt: "Историческое изображение прицела 2.5x WARDOGS, не меню зума", imageCaption: "Только контекст узнавания прицела. Изображение не подтверждает переменную кратность или совместимое оружие.", missingFrames: "Текущие настройки конкретного прицела, штатная/изменённая клавиша и одна цель до/после без изменения FOV.",
    steps: [
      ["Назовите установленный прицел", "Реальное оружие и установленный прицел в текущем инвентаре.", "Вы записали оба точных названия, а не выбрали картинку из каталога.", "Снаряжение неясно: проверьте установленное до изменения клавиш."],
      ["Найдите действие зума", "Описание прицела и меню управления; отличайте прицеливание от кратности.", "Для этой комбинации явно предлагается изменение кратности.", "Нет действия: не считайте зум доступным; не сбрасывайте весь профиль."],
      ["Проверьте одну клавишу", "Показанное назначение, устройство ввода и возможные конфликты.", "Одно предлагаемое действие срабатывает в безопасном месте.", "Неверное действие или нет отклика: проверьте конфликты и переназначение отдельно."],
      ["Сравните одну цель", "Та же позиция, цель, состояние прицеливания и неизменный FOV.", "После предлагаемого действия видимо меняется кратность.", "Без изменений: запишите версию, устройство, оружие, прицел и снимки назначений; общей клавиши здесь не подтверждено."],
    ],
  },
  de: {
    title: "Zielfernrohr: Aktion finden und testen", summary: "ADS, Sichtfeld und Vergrößerung sind verschieden. Dies ist eine Diagnosefolge, kein verifiziertes Zoom-Kürzel.",
    imageAlt: "Historisches WARDOGS-Bild einer 2.5x-Optik, kein Zoom-Einstellungsbildschirm", imageCaption: "Nur Kontext zur Optikerkennung. Das Bild belegt weder variable Vergrößerung noch Waffenkompatibilität.", missingFrames: "Aktuelle optikspezifische Bedienung, Standard/Neubelegung und dasselbe Ziel vor/nach dem Zoom bei gleichem FOV.",
    steps: [
      ["Ausgerüstete Optik benennen", "Tatsächliche Waffe und montierte Optik im aktuellen Inventar.", "Beide genauen Namen sind notiert, nicht nur ein Katalogbild gewählt.", "Ausrüstung unklar: vor Änderungen der Tasten die ausgerüsteten Gegenstände prüfen."],
      ["Zoom-Aktion finden", "Optikbeschreibung und Steuerungsmenü; ADS von Vergrößerung trennen.", "Eine Vergrößerungsaktion wird für diese Kombination ausdrücklich angeboten.", "Keine Aktion: Zoom nicht als verfügbar annehmen; nicht das ganze Profil zurücksetzen."],
      ["Eine Belegung testen", "Angezeigte Belegung, Eingabegerät und mögliche Konflikte.", "Eine angebotene Eingabe löst die gewünschte Aktion an einem sicheren Ort aus.", "Falsche Aktion oder keine Reaktion: Konflikte und Neubelegung einzeln prüfen."],
      ["Dasselbe Ziel vergleichen", "Gleiche Position, Ziel, ADS-Zustand und unverändertes FOV.", "Nach der angebotenen Aktion ist eine Vergrößerungsänderung sichtbar.", "Unverändert: Build, Gerät, Waffe, Optik und Belegungsbilder erfassen; hier ist keine universelle Taste verifiziert."],
    ],
  },
  "pt-br": {
    title: "Mira: identifique a ação e teste", summary: "ADS, campo de visão e ampliação da mira são diferentes. É um diagnóstico, não um atalho de zoom verificado.",
    imageAlt: "Arte histórica da mira 2.5x de WARDOGS, não uma tela de controles de zoom", imageCaption: "Apenas identificação da mira. A arte não comprova ampliação variável nem compatibilidade com arma.", missingFrames: "Controles atuais da mira, entrada padrão/remapeada e o mesmo alvo antes/depois sem mudar o FOV.",
    steps: [
      ["Identifique a mira equipada", "Arma real e mira equipada no inventário atual.", "Você consegue anotar os dois nomes exatos, não apenas escolher uma imagem.", "Equipamento incerto: confira o que está equipado antes de mudar vínculos."],
      ["Ache a ação de zoom", "Descrição atual da mira e controles; separe ADS de ampliação.", "Uma ação de ampliação é oferecida explicitamente para esse conjunto.", "Sem ação exibida: não trate zoom como disponível; não redefina o perfil inteiro."],
      ["Teste um vínculo", "Vínculo exibido, dispositivo ativo e possíveis conflitos.", "Uma entrada oferecida aciona o comando esperado em local seguro.", "Ação errada ou sem resposta: confira conflitos e remapeamento sem mudar tudo."],
      ["Compare o mesmo alvo", "Mesma posição, alvo, estado de ADS e FOV inalterado.", "Há mudança observável de ampliação após a ação oferecida.", "Ainda igual: registre versão, dispositivo, arma, mira e telas de vínculos; nenhuma tecla universal foi verificada aqui."],
    ],
  },
  ja: {
    title: "スコープ：操作を特定してから試す", summary: "ADS、視野角、倍率は別です。検証済みのズームキー表ではなく、切り分け手順です。",
    imageAlt: "過去のWARDOGS 2.5x照準器画像。ズーム操作設定画面ではありません", imageCaption: "照準器の識別用のみ。可変倍率や対応武器を証明する画像ではありません。", missingFrames: "現行の照準器固有の操作、初期・変更後の割り当て、FOVを変えない同一目標の倍率比較。",
    steps: [
      ["装備中の照準器を特定", "現在のインベントリにある武器と装着した照準器。", "カタログ画像ではなく、両方の正確な名称を記録できる。", "装備が不明なら、割り当てを変える前に実際の装備を確認。"],
      ["倍率操作を探す", "現在の照準器説明と操作設定。ADSと倍率を区別。", "その組み合わせで倍率変更操作が明示されている。", "操作がなければズーム可能と決めつけず、設定全体を初期化しない。"],
      ["一つの入力を試す", "表示された割り当て、入力機器、競合の可能性。", "安全な場所で、提示された入力が意図する操作を実行する。", "別の操作や無反応なら、競合と再割り当てを個別に確認。"],
      ["同じ目標で比較", "同じ位置、目標、ADS状態、変えないFOV。", "提示された操作後に倍率の変化が観察できる。", "変わらなければビルド、機器、武器、照準器、割り当て画像を記録。共通キーは未検証。"],
    ],
  },
  "zh-cn": {
    title: "瞄具：先找动作，再测输入", summary: "开镜、视野角与瞄具倍率是三件事。这是排查流程，不是已验证的通用缩放键。",
    imageAlt: "历史 WARDOGS 2.5x 战斗瞄具素材，不是缩放控制界面", imageCaption: "仅作瞄具识别背景；素材不能证明可变倍率或适配武器。", missingFrames: "当前具体瞄具的控制项、默认/重绑定输入，以及固定 FOV 下同一目标的倍率前后对照。",
    steps: [
      ["认清已装备瞄具", "当前背包中的实际武器与已装瞄具。", "能记录两者准确名称，而不是只认一张目录图。", "装备不明确：先核对实际装配，再改按键。"],
      ["找到倍率动作", "当前瞄具说明与控制菜单；分清开镜和倍率。", "界面明确为这套装备提供倍率动作。", "没显示动作：别假定能够缩放，也别重置整个配置。"],
      ["只测一个绑定", "显示的绑定、当前输入设备与可能的冲突。", "在安全位置，提供的输入触发预期动作。", "触发别的动作或没反应：单独查冲突与重绑定，不同时改全部。"],
      ["比较同一目标", "相同位置、目标、开镜状态与不变的 FOV。", "执行提供的动作后，能观察到倍率变化。", "仍不变：记录版本、设备、武器、瞄具与绑定截图；这里未验证通用按键。"],
    ],
  },
  "zh-tw": {
    title: "瞄具：先找動作，再測輸入", summary: "開鏡、視野角與瞄具倍率是三件事。這是排查流程，不是已驗證的通用縮放鍵。",
    imageAlt: "歷史 WARDOGS 2.5x 戰鬥瞄具素材，不是縮放控制介面", imageCaption: "僅作瞄具識別背景；素材不能證明可變倍率或適配武器。", missingFrames: "目前具體瞄具的控制項、預設/重綁定輸入，以及固定 FOV 下同一目標的倍率前後對照。",
    steps: [
      ["認清已裝備瞄具", "目前背包中的實際武器與已裝瞄具。", "能記錄兩者準確名稱，而不是只認一張目錄圖。", "裝備不明確：先核對實際裝配，再改按鍵。"],
      ["找到倍率動作", "目前瞄具說明與控制選單；分清開鏡和倍率。", "介面明確為這套裝備提供倍率動作。", "沒顯示動作：別假定能夠縮放，也別重設整個配置。"],
      ["只測一個綁定", "顯示的綁定、目前輸入裝置與可能的衝突。", "在安全位置，提供的輸入觸發預期動作。", "觸發別的動作或沒反應：單獨查衝突與重綁定，不同時改全部。"],
      ["比較同一目標", "相同位置、目標、開鏡狀態與不變的 FOV。", "執行提供的動作後，能觀察到倍率變化。", "仍不變：記錄版本、裝置、武器、瞄具與綁定截圖；這裡未驗證通用按鍵。"],
    ],
  },
  pl: {
    title: "Luneta: znajdź działanie i sprawdź wejście", summary: "ADS, pole widzenia i powiększenie lunety to różne rzeczy. To diagnostyka, nie sprawdzony skrót zoomu.",
    imageAlt: "Historyczna grafika celownika 2.5x WARDOGS, nie ekran ustawień zoomu", imageCaption: "Tylko kontekst rozpoznania optyki. Grafika nie dowodzi zmiennego powiększenia ani zgodności z bronią.", missingFrames: "Obecne sterowanie konkretnej optyki, domyślne/zmienione przypisanie i ten sam cel przed/po przy stałym FOV.",
    steps: [
      ["Nazwij zamontowaną optykę", "Rzeczywista broń i zamontowana optyka w obecnym ekwipunku.", "Możesz zapisać obie dokładne nazwy, nie tylko wybrać grafikę katalogową.", "Sprzęt niejasny: sprawdź wyposażenie przed zmianą przypisań."],
      ["Znajdź akcję zoomu", "Obecny opis optyki i menu sterowania; oddziel ADS od powiększenia.", "Akcja powiększenia jest wyraźnie oferowana dla tego zestawu.", "Brak akcji: nie zakładaj dostępności zoomu; nie resetuj całego profilu."],
      ["Sprawdź jedno przypisanie", "Wyświetlone przypisanie, aktywne urządzenie i możliwe konflikty.", "Jedno oferowane wejście wykonuje oczekiwaną akcję w bezpiecznym miejscu.", "Zła akcja lub brak reakcji: sprawdź konflikty i zmianę przypisania osobno."],
      ["Porównaj ten sam cel", "Ta sama pozycja, cel, stan ADS i niezmienione FOV.", "Po oferowanej akcji widać zmianę powiększenia.", "Bez zmiany: zapisz wersję, urządzenie, broń, optykę i zrzuty przypisań; brak sprawdzonego uniwersalnego klawisza."],
    ],
  },
};

export type VisualWorkflowEvidence = {
  url: string;
  label: string;
  scope: "original-sample" | "original-candidate" | "official-context";
  sampledSeconds: number | null;
  reviewedAt: string | null;
  captureBuild: string | null;
};
type WorkflowDefinition = {
  copy: Record<Locale, WorkflowCopy>;
  stepIds: readonly [string, string, string, string];
  image: {src: string; width: number; height: number; sourceUrl: string | null; credit: string; sourceLocator: string; retrievedAt: string; captureBuild: null; role: "context-only"};
  evidence: readonly VisualWorkflowEvidence[];
};

// Review dates describe only the bounded original-video samples, not a client test or refreshed guide fact.
const definitions: Record<VisualWorkflowSlug, WorkflowDefinition> = {
  "wardogs-cargo-guide": {
    copy: cargo, stepIds: ["load", "receiver", "transfer", "receipt"],
    image: {src: "/images/catalogue/vehicles/ural.webp", width: 768, height: 399, sourceUrl: "https://www.youtube.com/watch?v=ZFRrDSru7Kg", credit: "WARDOGS vehicle catalogue source", sourceLocator: "Existing item-specific vehicle artwork", retrievedAt: "2026-08-18", captureBuild: null, role: "context-only"},
    evidence: [{url: "https://www.youtube.com/watch?v=18NAV3XnXsA&t=149s", label: "Duskguy · 02:29", scope: "original-sample", sampledSeconds: 149, reviewedAt: "2026-09-30", captureBuild: null}],
  },
  "wardogs-fob-guide": {
    copy: fob, stepIds: ["access", "preview", "built", "supplied"],
    image: {src: "/images/source-evidence/2026-09-30-official-gameplay/press-kit-sept-2026/river-2.webp", width: 1920, height: 1080, sourceUrl: "https://www.team17.com/press-and-creator-hub", credit: "BULKHEAD / Team17", sourceLocator: "September 2026 press kit / WD_Screenshot_River_2_WD2.jpg", retrievedAt: "2026-09-30", captureBuild: null, role: "context-only"},
    evidence: [{url: "https://www.youtube.com/watch?v=LJhMbE-Hle8&t=656s", label: "HitboTC · 10:56", scope: "original-sample", sampledSeconds: 656, reviewedAt: "2026-09-30", captureBuild: null}],
  },
  "wardogs-medic-revive-guide": {
    copy: medic, stepIds: ["threat", "eligibility", "interaction", "recovery"],
    image: {src: "/images/guide-discovery/medic-revive.webp", width: 1280, height: 720, sourceUrl: "https://www.team17.com/hubfs/WARDOGS%20-%20Press%20Kit%20%28Aug%2026%29.zip", credit: "BULKHEAD / Team17", sourceLocator: "WD_Screenshot_Tank_1_WD2.jpg", retrievedAt: "2026-08-30", captureBuild: null, role: "context-only"},
    evidence: [
      {url: "https://www.youtube.com/watch?v=eAE9LOV-p3s&t=200s", label: "jackfrags · 03:20", scope: "original-candidate", sampledSeconds: null, reviewedAt: null, captureBuild: null},
      {url: "https://www.team17.com/games/wardogs/", label: "Team17 / WARDOGS", scope: "official-context", sampledSeconds: null, reviewedAt: null, captureBuild: null},
    ],
  },
  "wardogs-controls": {
    copy: scope, stepIds: ["optic", "action", "binding", "comparison"],
    image: {src: "/images/catalogue/attachments/2-5x-combat-optic.webp", width: 768, height: 399, sourceUrl: null, credit: "Owner-provided WARDOGS catalogue asset pack (Aug 2026)", sourceLocator: "Historical 2.5x combat optic artwork", retrievedAt: "2026-08-17", captureBuild: null, role: "context-only"},
    evidence: [{url: "https://steamcommunity.com/app/1867240/announcements/", label: "BULKHEAD / Steam", scope: "official-context", sampledSeconds: null, reviewedAt: null, captureBuild: null}],
  },
};

// Bounded acquisition audit. Public source excerpts do not establish client reproduction or reusable frame assets.
export const visualWorkflowSourceAudit = {
  operationCaptureStatus: "public-source-only",
  newBitmapAssets: 0,
  clientReproductions: 0,
  reusedContextAssets: 4,
  releaseScope: "User selected public-source review only; missing current-client captures remain explicit",
  attempts: [
    {slug: "wardogs-cargo-guide", sourceUrl: "https://www.youtube.com/watch?v=18NAV3XnXsA&t=143s", method: "Native public player, pause and screenshot inspection", observedSeconds: 149, outcome: "Ural with pallet on ground; no before/after FOB stock receipt", persistedOperationFrames: 0},
    {slug: "wardogs-fob-guide", sourceUrl: "https://www.youtube.com/watch?v=LJhMbE-Hle8&t=628s", method: "Native public player after ordinary preroll, pause and screenshot inspection", observedSeconds: 656, outcome: "Hammer and red construction preview; no full valid FOB placement or supplied-base acceptance", persistedOperationFrames: 0},
    {slug: "wardogs-medic-revive-guide", sourceUrl: "https://www.youtube.com/watch?v=eAE9LOV-p3s&t=200s", method: "Native public player, pause attempt, two ordinary skip attempts, final sample and one native seek attempt", observedSeconds: 798, outcome: "Initial inspections were prerolls; skip controls expired. Later visible source frame was building at 13:18, not a revive. Native timeline was not settable. No medical operation accepted as evidence", persistedOperationFrames: 0},
    {slug: "wardogs-controls", sourceUrl: "https://steamcommunity.com/app/1867240/announcements/", method: "Official feed review and one two-query official-domain-oriented zoom/control search", observedSeconds: null, outcome: "No verified current optic-control screenshot or before/after zoom sequence obtained. Community fixes and competitor key charts were not adopted as facts", persistedOperationFrames: 0},
  ],
} as const;

export function getVisualWorkflowUi(locale: Locale): WorkflowUi {
  return ui[locale];
}

export function getVisualWorkflow(slug: string, locale: Locale) {
  if (!visualWorkflowSlugs.includes(slug as VisualWorkflowSlug)) return null;
  const definition = definitions[slug as VisualWorkflowSlug];
  const copy = definition.copy[locale];
  return {
    ...copy, slug: slug as VisualWorkflowSlug, image: definition.image, evidence: definition.evidence,
    operationFrames: "missing" as const, clientReproduced: false as const,
    steps: copy.steps.map(([action, observe, success, failure], index): VisualWorkflowStep => ({
      id: definition.stepIds[index], action, observe, success, failure,
    })),
  };
}
