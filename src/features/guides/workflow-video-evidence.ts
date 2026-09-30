import type {Locale} from "@/config/site";
import type {VisualWorkflowSlug} from "./visual-workflows";

type Copy = {title: string; notes: readonly string[]};
type SourceExample = {
  id: string;
  author: string;
  publishedAt: string;
  reviewedAt: string;
  captureBuild: null;
  clientReproduced: false;
  startSeconds: number;
  endSeconds: number;
  observedSeconds: readonly number[];
  copy: Record<Locale, Copy>;
};

const medic: SourceExample = {
  id: "CfbKirbnhu8", author: "JA Guides Gaming", publishedAt: "2026-09-11", reviewedAt: "2026-09-30",
  captureBuild: null, clientReproduced: false, startSeconds: 14, endSeconds: 59, observedSeconds: [14, 24, 34, 44, 49, 54],
  copy: {
    en: {title: "Medical equipment and failed-treatment prompts", notes: ["The sampled vendor screen shows a recruit discount; its displayed prices are not universal prices.", "At 00:49 the player is already at full health; at 00:54 the teammate is out of range. Neither frame proves a completed heal or revive."]},
    ru: {title: "Медицинское снаряжение и отказ лечения", notes: ["В магазине на записи действует скидка новичка; цены не универсальны.", "В 00:49 здоровье полное, в 00:54 союзник вне досягаемости. Это не доказательство успешного лечения или оживления."]},
    de: {title: "Medizinausrüstung und abgelehnte Behandlung", notes: ["Der gezeigte Händler bietet einen Rekrutenrabatt; diese Preise gelten nicht allgemein.", "00:49: volle Gesundheit. 00:54: Mitspieler außer Reichweite. Beide Bilder belegen keine erfolgreiche Heilung oder Wiederbelebung."]},
    "pt-br": {title: "Equipamento médico e tratamento recusado", notes: ["A loja gravada mostra desconto de recruta; esses preços não são universais.", "Em 00:49 a saúde está cheia; em 00:54 o aliado está fora de alcance. Nenhum quadro comprova cura ou reanimação concluída."]},
    ja: {title: "医療装備と治療できない場合の表示", notes: ["撮影された店には新兵割引があります。表示価格は全員共通の価格ではありません。", "00:49は体力満タン、00:54は味方が範囲外です。治療や蘇生の完了を示す場面ではありません。"]},
    "zh-cn": {title: "医疗装备与治疗失败提示", notes: ["样本商店画面有新兵折扣，显示价格不能当作全员通用价格。", "00:49 提示自己已经满血；00:54 提示队友不在范围内。这两帧都不能证明治疗或复活成功。"]},
    "zh-tw": {title: "醫療裝備與治療失敗提示", notes: ["樣本商店畫面有新兵折扣，顯示價格不能當作全員通用價格。", "00:49 提示自己已經滿血；00:54 提示隊友不在範圍內。這兩幀都不能證明治療或復活成功。"]},
    pl: {title: "Sprzęt medyczny i odmowa leczenia", notes: ["Sklep w nagraniu pokazuje zniżkę rekruta; te ceny nie są uniwersalne.", "00:49: pełne zdrowie. 00:54: sojusznik poza zasięgiem. Żaden kadr nie potwierdza ukończonego leczenia lub reanimacji."]},
  },
};

const medicLoadout: SourceExample = {
  id: "8Mgl4FRekbg", author: "Gilby", publishedAt: "2026-09-28", reviewedAt: "2026-09-30",
  captureBuild: null, clientReproduced: false, startSeconds: 113, endSeconds: 128, observedSeconds: [79, 99, 181, 188],
  copy: {
    en: {title: "A creator's medic preparation list", notes: ["The author recommends a defibrillator, spare battery and healing supplies. This is a proposed loadout, not a verified affordable preset.", "Narrated income and unlock values are not imported as current rules; no identified-build revive sequence was established in this review."]},
    ru: {title: "Подготовка медика по совету автора", notes: ["Автор советует дефибриллятор, запасную батарею и средства лечения. Это предложение, не проверенный бюджетный комплект.", "Доход и уровни из рассказа не приняты за текущие правила; оживление в установленной версии не подтверждено."]},
    de: {title: "Medic-Vorbereitung nach Empfehlung des Autors", notes: ["Der Autor empfiehlt Defibrillator, Ersatzbatterie und Heilmittel. Das ist ein Vorschlag, kein geprüft bezahlbares Set.", "Genannte Einnahmen und Freischaltungen werden nicht als aktuelle Regeln übernommen; keine Wiederbelebungsfolge mit bekanntem Build bestätigt."]},
    "pt-br": {title: "Preparação de médico sugerida pelo autor", notes: ["O autor recomenda desfibrilador, bateria extra e itens de cura. É uma sugestão, não um conjunto de custo atual validado.", "Renda e níveis narrados não viram regras atuais; nenhuma sequência de reanimação com versão identificada foi confirmada."]},
    ja: {title: "投稿者が勧めるメディックの準備", notes: ["投稿者は除細動器、予備電池、治療用品を推奨しています。提案であり、現行価格で購入可能と検証した装備ではありません。", "説明された収入や解放値は現行ルールとして採用していません。ビルドを特定した蘇生手順は未確認です。"]},
    "zh-cn": {title: "原作者的医疗出击准备", notes: ["作者建议携带除颤器、备用电池和治疗用品。这是配装建议，不是已经验证当前预算可买齐的方案。", "口述收益和解锁数值不作为当前规则导入；本次核对未建立带明确版本的完整复活过程。"]},
    "zh-tw": {title: "原作者的醫療出擊準備", notes: ["作者建議攜帶除顫器、備用電池和治療用品。這是配裝建議，不是已經驗證目前預算可買齊的方案。", "口述收益和解鎖數值不作為目前規則匯入；本次核對未建立帶明確版本的完整復活過程。"]},
    pl: {title: "Przygotowanie medyka według autora", notes: ["Autor zaleca defibrylator, zapasową baterię i środki leczenia. To propozycja, nie zestaw o zweryfikowanym obecnym koszcie.", "Dochody i poziomy z narracji nie stają się obecnymi zasadami; nie potwierdzono reanimacji w zidentyfikowanej wersji."]},
  },
};

const optic: SourceExample = {
  id: "f-B-26p8soc", author: "SwoleBenji", publishedAt: "2026-09-29", reviewedAt: "2026-09-30",
  captureBuild: null, clientReproduced: false, startSeconds: 394, endSeconds: 410, observedSeconds: [392, 395, 402, 415, 814],
  copy: {
    en: {title: "Magnification, breath hold and zeroing are separate", notes: ["At 06:39-06:45 the author describes mouse-wheel magnification and breath hold; these are source-specific instructions, not verified default bindings for every optic.", "His 08:53-09:06 explanation separates the range/zero setting from zoom. Sampled frames do not establish fixed-FOV before/after testing or exact ballistic data."]},
    ru: {title: "Кратность, задержка дыхания и пристрелка различаются", notes: ["В 06:39-06:45 автор говорит о колесе мыши и задержке дыхания; это не проверенные общие клавиши всех прицелов.", "В 08:53-09:06 настройка дальности отделена от зума. Кадры не доказывают сравнение при неизменном FOV или точную баллистику."]},
    de: {title: "Vergrößerung, Atemhalten und Einschießen trennen", notes: ["06:39-06:45 beschreibt der Autor Mausrad und Atemhalten; keine verifizierten Standardtasten für jede Optik.", "08:53-09:06 trennt er Entfernungseinstellung und Zoom. Die Stichprobe belegt weder konstantes FOV noch genaue Ballistik."]},
    "pt-br": {title: "Ampliação, prender a respiração e zeragem são diferentes", notes: ["Em 06:39-06:45 o autor descreve roda do mouse e respiração; não são vínculos padrão verificados para toda mira.", "Em 08:53-09:06 ele separa alcance/zeragem de zoom. Os quadros não comprovam FOV fixo nem dados balísticos exatos."]},
    ja: {title: "倍率、息止め、ゼロインを区別", notes: ["06:39-06:45で投稿者がホイールと息止めを説明します。全照準器の検証済み初期キーではありません。", "08:53-09:06では距離・ゼロインと倍率を区別します。確認した場面だけでは固定FOVの比較や精密弾道を証明できません。"]},
    "zh-cn": {title: "分清变倍、屏息与归零", notes: ["06:39-06:45 作者口述鼠标滚轮变倍与屏息；这是该来源的操作说明，不是已验证的所有瞄具默认按键。", "08:53-09:06 作者把距离/归零设置与缩放区分开。样本画面尚不能证明固定 FOV 的前后测试或精确弹道数值。"]},
    "zh-tw": {title: "分清變倍、屏息與歸零", notes: ["06:39-06:45 作者口述滑鼠滾輪變倍與屏息；這是該來源的操作說明，不是已驗證的所有瞄具預設按鍵。", "08:53-09:06 作者把距離/歸零設定與縮放區分開。樣本畫面尚不能證明固定 FOV 的前後測試或精確彈道數值。"]},
    pl: {title: "Powiększenie, wstrzymanie oddechu i zerowanie", notes: ["W 06:39-06:45 autor opisuje kółko myszy i oddech; to nie zweryfikowane domyślne klawisze dla każdej lunety.", "W 08:53-09:06 oddziela zakres/zerowanie od zoomu. Próbka nie dowodzi stałego FOV ani dokładnych danych balistycznych."]},
  },
};

const fob: SourceExample = {
  id: "XUyP1GLUF5o", author: "Gamers Heroes", publishedAt: "2026-09-16", reviewedAt: "2026-09-30",
  captureBuild: null, clientReproduced: false, startSeconds: 35, endSeconds: 75, observedSeconds: [52, 72],
  copy: {
    en: {title: "FOB deployment and the usable-object check", notes: ["At 00:52 the sampled structure offers an Open FOB interaction; a usable object is stronger evidence than a placement silhouette.", "The author explicitly uses the tutorial. This does not establish current match placement limits, initial stock or a completed live supply loop."]},
    ru: {title: "Размещение FOB и проверка доступного объекта", notes: ["В 00:52 у объекта есть действие Open FOB; это сильнее одного контура размещения.", "Автор использует обучение. Это не доказывает текущие ограничения матча, начальный запас или полный цикл снабжения."]},
    de: {title: "FOB-Aufstellung und Prüfung des nutzbaren Objekts", notes: ["00:52 bietet das Objekt Open FOB an; stärker als ein bloßer Platzierungsumriss.", "Der Autor nutzt ausdrücklich das Tutorial. Aktuelle Matchgrenzen, Anfangsvorrat und Versorgungskreislauf sind damit nicht belegt."]},
    "pt-br": {title: "Posicionamento de FOB e verificação do objeto utilizável", notes: ["Em 00:52 aparece a interação Open FOB; isso é mais forte que uma silhueta de posicionamento.", "O autor usa o tutorial. Isso não comprova limites da partida atual, estoque inicial ou abastecimento completo."]},
    ja: {title: "FOBの配置と利用可能な建物の確認", notes: ["00:52ではOpen FOB操作が表示されます。設置シルエットだけより具体的な証拠です。", "投稿者はチュートリアルを使用しています。現行試合の設置制限、初期在庫、補給経路の完了は証明しません。"]},
    "zh-cn": {title: "FOB 部署与可交互状态", notes: ["00:52 样本建筑显示 Open FOB 交互；可交互物体比一张放置轮廓更有证明力。", "作者明确使用教程环境。这不能证明当前对局的放置限制、初始库存或完整实战补给闭环。"]},
    "zh-tw": {title: "FOB 部署與可互動狀態", notes: ["00:52 樣本建築顯示 Open FOB 互動；可互動物體比一張放置輪廓更有證明力。", "作者明確使用教學環境。這不能證明目前對局的放置限制、初始庫存或完整實戰補給閉環。"]},
    pl: {title: "Ustawienie FOB i sprawdzenie użytecznego obiektu", notes: ["W 00:52 obiekt oferuje Open FOB; to mocniejszy dowód niż sam obrys ustawienia.", "Autor korzysta z samouczka. Nie dowodzi to obecnych limitów meczu, początkowego zapasu ani pełnej dostawy."]},
  },
};

const cargo: SourceExample = {
  ...fob, startSeconds: 212, endSeconds: 245, observedSeconds: [212],
  copy: {
    en: {title: "Pallet transfer: the receiving interaction", notes: ["At 03:32 the sampled pallet offers Unload supplies into FOB. A matched before/after stock receipt is still required to prove completed delivery.", "Do not import narrated capacities, keys or payments as current measured values."]},
    ru: {title: "Передача поддона: действие приёма", notes: ["В 03:32 показано Unload supplies into FOB. Для завершённой доставки нужен запас до и после приёма.", "Названные объёмы, клавиши и выплаты не приняты за текущие измерения."]},
    de: {title: "Palettenübergabe: Empfangsaktion", notes: ["03:32 zeigt Unload supplies into FOB. Eine abgeschlossene Lieferung braucht den zugehörigen Vorrat vor/nach Empfang.", "Genannte Kapazitäten, Tasten und Zahlungen gelten nicht als aktuelle Messwerte."]},
    "pt-br": {title: "Transferência de pallet: interação de recebimento", notes: ["Em 03:32 aparece Unload supplies into FOB. Para comprovar a entrega concluída, confira o mesmo estoque antes/depois.", "Capacidades, teclas e pagamentos narrados não são medições atuais."]},
    ja: {title: "パレット移送：受け取り操作", notes: ["03:32ではUnload supplies into FOBが表示されます。配送完了の証明には同じ在庫の受領前後の確認が必要です。", "説明された容量、キー、報酬を現行の実測値として採用しません。"]},
    "zh-cn": {title: "托盘转移：接收交互", notes: ["03:32 样本托盘显示 Unload supplies into FOB 提示。要证明交付完成，仍需同一库存的到账前后对照。", "口述容量、按键和收益不作为当前实测数值导入。"]},
    "zh-tw": {title: "棧板轉移：接收互動", notes: ["03:32 樣本棧板顯示 Unload supplies into FOB 提示。要證明交付完成，仍需同一庫存的入帳前後對照。", "口述容量、按鍵和收益不作為目前實測數值匯入。"]},
    pl: {title: "Przekazanie palety: działanie odbioru", notes: ["W 03:32 widać Unload supplies into FOB. Pełna dostawa wymaga porównania tego samego zapasu przed/po odbiorze.", "Podane pojemności, klawisze i wypłaty nie są obecnymi pomiarami."]},
  },
};

const ui: Record<Locale, {heading: string; published: string; reviewed: string; visual: string; narration: string; limit: string}> = {
  en: {heading: "Original footage and its limits", published: "Published", reviewed: "Reviewed", visual: "Sampled frames", narration: "Author narration; no accepted operation frames", limit: "Capture build unknown. Publication date is not a game version; current-client reproduction remains unverified."},
  ru: {heading: "Оригинальная запись и её границы", published: "Опубликовано", reviewed: "Проверено", visual: "Выборочные кадры", narration: "Рассказ автора; кадры операции не приняты", limit: "Версия записи неизвестна. Дата публикации не версия игры; проверка в текущем клиенте не выполнена."},
  de: {heading: "Originalaufnahmen und ihre Grenzen", published: "Veröffentlicht", reviewed: "Geprüft", visual: "Bildstichproben", narration: "Erklärung des Autors; keine bestätigten Bedienungsbilder", limit: "Aufnahmeversion unbekannt. Veröffentlichungsdatum ist kein Spiel-Build; nicht im aktuellen Client nachgestellt."},
  "pt-br": {heading: "Gravação original e seus limites", published: "Publicado", reviewed: "Revisado", visual: "Quadros amostrados", narration: "Narração do autor; sem quadros de operação aceitos", limit: "Versão gravada desconhecida. Data de publicação não é versão do jogo; reprodução no cliente atual não verificada."},
  ja: {heading: "元動画と証拠の範囲", published: "公開", reviewed: "確認", visual: "確認した場面", narration: "投稿者の説明。操作画面は未確認", limit: "撮影ビルド不明。公開日はゲームのバージョンではありません。現行クライアントでの再現検証は未実施です。"},
  "zh-cn": {heading: "原片与证据范围", published: "发布", reviewed: "核对", visual: "核对过的画面", narration: "作者口述，尚无已验收操作帧", limit: "拍摄版本未知。视频发布日期不是游戏版本，尚未在当前客户端复现。"},
  "zh-tw": {heading: "原片與證據範圍", published: "發布", reviewed: "核對", visual: "核對過的畫面", narration: "作者口述，尚無已驗收操作幀", limit: "拍攝版本未知。影片發布日期不是遊戲版本，尚未在目前用戶端重現。"},
  pl: {heading: "Oryginalne nagranie i zakres dowodów", published: "Publikacja", reviewed: "Przegląd", visual: "Sprawdzone kadry", narration: "Narracja autora; brak przyjętych kadrów operacji", limit: "Wersja nagrania nieznana. Data publikacji nie jest wersją gry; nie sprawdzono w obecnym kliencie."},
};

const examples: Record<VisualWorkflowSlug, readonly SourceExample[]> = {
  "wardogs-cargo-guide": [cargo], "wardogs-fob-guide": [fob],
  "wardogs-medic-revive-guide": [medic, medicLoadout], "wardogs-controls": [optic],
};

export function getWorkflowVideoEvidence(slug: string, locale: Locale) {
  if (!Object.hasOwn(examples, slug)) return [];
  return examples[slug as VisualWorkflowSlug].map(({copy, ...source}) => ({...source, ...copy[locale]}));
}

export function getWorkflowVideoEvidenceUi(locale: Locale) {return ui[locale];}

export function videoSampleTime(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
