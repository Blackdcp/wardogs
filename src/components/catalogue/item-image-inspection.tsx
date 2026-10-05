import type {Locale} from "@/config/site";
import type {CatalogueImageInspection, CatalogueImageOrigin} from "@/features/catalogue/catalogue-image-inspection";

const english = {
  summary: "Capture, build and rights record",
  origin: "Recorded origin", captureDate: "Capture date", build: "Image build", rights: "Permission evidence", ai: "AI reconstruction", reviewed: "Record reviewed",
  unknown: "Not recorded", buildUnknown: "Not recorded; current build not verified",
  rightsUnknown: "No rights-holder permission evidence attached to this record",
  rightsRecorded: "Reference recorded; scope requires review",
  aiNone: "Recorded as none", aiUsed: "Recorded as used",
  origins: {
    "publisher-press-kit": "Official press-kit attribution; not our capture",
    "third-party-media": "Third-party media attribution; not our capture",
    "owner-provided-artwork": "Owner-provided historical artwork; not a new capture",
    "supplied-community-artwork": "Owner-supplied community artwork; not our capture",
  } satisfies Record<CatalogueImageOrigin, string>,
};

type Copy = typeof english;
const translations: Record<Locale, Copy> = {
  en: english,
  "zh-cn": {
    summary: "拍摄、版本与许可记录",
    origin: "记录的来源类型", captureDate: "拍摄日期", build: "图片游戏版本", rights: "许可凭证", ai: "AI 重建", reviewed: "记录核查日期",
    unknown: "未记录", buildUnknown: "未记录；当前版本未核实", rightsUnknown: "此记录未附权利人的使用许可凭证", rightsRecorded: "已记录凭证索引；许可范围仍需核对",
    aiNone: "记录为未使用", aiUsed: "记录为已使用",
    origins: {"publisher-press-kit": "记录来源为官方媒体包；非本站实拍", "third-party-media": "记录来源为第三方媒体；非本站实拍", "owner-provided-artwork": "站长提供的历史图片；非新拍摄素材", "supplied-community-artwork": "站长提供的社区图片；非本站实拍"},
  },
  "zh-tw": {
    summary: "拍攝、版本與授權記錄",
    origin: "記錄的來源類型", captureDate: "拍攝日期", build: "圖片遊戲版本", rights: "授權憑證", ai: "AI 重建", reviewed: "記錄核查日期",
    unknown: "未記錄", buildUnknown: "未記錄；目前版本未核實", rightsUnknown: "此記錄未附權利人的使用授權憑證", rightsRecorded: "已記錄憑證索引；授權範圍仍需核對",
    aiNone: "記錄為未使用", aiUsed: "記錄為已使用",
    origins: {"publisher-press-kit": "記錄來源為官方媒體包；非本站實拍", "third-party-media": "記錄來源為第三方媒體；非本站實拍", "owner-provided-artwork": "站長提供的歷史圖片；非新拍攝素材", "supplied-community-artwork": "站長提供的社群圖片；非本站實拍"},
  },
  ja: {
    summary: "撮影・ゲーム版・許諾の記録",
    origin: "記録された出典区分", captureDate: "撮影日", build: "画像のゲーム版", rights: "利用許諾の証拠", ai: "AI による再構成", reviewed: "記録の確認日",
    unknown: "記録なし", buildUnknown: "記録なし・現行版との一致は未確認", rightsUnknown: "この記録には権利者の利用許諾の証拠が添付されていません", rightsRecorded: "証拠の参照先を記録済み・許諾範囲は要確認",
    aiNone: "不使用と記録", aiUsed: "使用と記録",
    origins: {"publisher-press-kit": "公式プレスキットを出典として記録・当サイトの撮影ではありません", "third-party-media": "第三者のメディアを出典として記録・当サイトの撮影ではありません", "owner-provided-artwork": "サイト所有者が提供した過去の画像・新規撮影ではありません", "supplied-community-artwork": "サイト所有者が提供したコミュニティ画像・当サイトの撮影ではありません"},
  },
  de: {
    summary: "Aufnahme, Spielversion und Rechte",
    origin: "Erfasste Herkunft", captureDate: "Aufnahmedatum", build: "Spielversion des Bildes", rights: "Nutzungserlaubnis", ai: "KI-Rekonstruktion", reviewed: "Datensatz geprüft",
    unknown: "Nicht erfasst", buildUnknown: "Nicht erfasst; aktuelle Version nicht bestätigt", rightsUnknown: "Diesem Datensatz liegt kein Erlaubnisnachweis des Rechteinhabers bei", rightsRecorded: "Nachweisreferenz erfasst; Umfang muss geprüft werden",
    aiNone: "Als nicht verwendet erfasst", aiUsed: "Als verwendet erfasst",
    origins: {"publisher-press-kit": "Offizielles Pressepaket als Quelle erfasst; keine eigene Aufnahme", "third-party-media": "Drittanbieter-Medium als Quelle erfasst; keine eigene Aufnahme", "owner-provided-artwork": "Vom Betreiber bereitgestelltes historisches Bild; keine neue Aufnahme", "supplied-community-artwork": "Vom Betreiber bereitgestelltes Community-Bild; keine eigene Aufnahme"},
  },
  ru: {
    summary: "Съёмка, версия и права",
    origin: "Указанное происхождение", captureDate: "Дата съёмки", build: "Версия игры на изображении", rights: "Подтверждение разрешения", ai: "Реконструкция с ИИ", reviewed: "Запись проверена",
    unknown: "Не указано", buildUnknown: "Не указана; текущая версия не подтверждена", rightsUnknown: "К записи не приложено подтверждение разрешения правообладателя", rightsRecorded: "Ссылка на подтверждение указана; условия требуют проверки",
    aiNone: "Указано: не использовалась", aiUsed: "Указано: использовалась",
    origins: {"publisher-press-kit": "Источник по записи: официальный пресс-кит; не наша съёмка", "third-party-media": "Источник по записи: сторонние материалы; не наша съёмка", "owner-provided-artwork": "Историческое изображение от владельца сайта; не новая съёмка", "supplied-community-artwork": "Изображение сообщества от владельца сайта; не наша съёмка"},
  },
  "pt-br": {
    summary: "Captura, versão e direitos",
    origin: "Origem registrada", captureDate: "Data da captura", build: "Versão do jogo na imagem", rights: "Prova de permissão", ai: "Reconstrução com IA", reviewed: "Registro revisado",
    unknown: "Não registrado", buildUnknown: "Não registrada; versão atual não verificada", rightsUnknown: "Nenhuma prova de permissão do titular está anexada a este registro", rightsRecorded: "Referência registrada; o escopo precisa ser revisado",
    aiNone: "Registrada como não utilizada", aiUsed: "Registrada como utilizada",
    origins: {"publisher-press-kit": "Fonte registrada: kit de imprensa oficial; não é captura nossa", "third-party-media": "Fonte registrada: mídia de terceiros; não é captura nossa", "owner-provided-artwork": "Arte histórica fornecida pelo responsável do site; não é captura nova", "supplied-community-artwork": "Arte da comunidade fornecida pelo responsável do site; não é captura nossa"},
  },
  pl: {
    summary: "Zrzut, wersja i prawa",
    origin: "Zapisane pochodzenie", captureDate: "Data wykonania", build: "Wersja gry na obrazie", rights: "Dowód zgody", ai: "Rekonstrukcja AI", reviewed: "Weryfikacja wpisu",
    unknown: "Brak zapisu", buildUnknown: "Brak zapisu; bieżąca wersja niepotwierdzona", rightsUnknown: "Do wpisu nie dołączono dowodu zgody właściciela praw", rightsRecorded: "Zapisano odnośnik do dowodu; zakres wymaga sprawdzenia",
    aiNone: "Zapisano: nie użyto", aiUsed: "Zapisano: użyto",
    origins: {"publisher-press-kit": "Zapisane źródło: oficjalny pakiet prasowy; nie nasz zrzut", "third-party-media": "Zapisane źródło: cudze materiały; nie nasz zrzut", "owner-provided-artwork": "Historyczna grafika od właściciela strony; nie nowy zrzut", "supplied-community-artwork": "Grafika społeczności od właściciela strony; nie nasz zrzut"},
  },
};

export function ItemImageInspection({inspection, locale}: {inspection?: CatalogueImageInspection; locale: Locale}) {
  const copy = translations[locale];
  const rows = [
    [copy.origin, inspection ? copy.origins[inspection.recordedOrigin] : copy.unknown],
    [copy.captureDate, inspection?.captureDate ?? copy.unknown],
    [copy.build, inspection?.gameBuild ?? copy.buildUnknown],
    [copy.rights, inspection?.rights.evidenceReference ? copy.rightsRecorded : copy.rightsUnknown],
    [copy.ai, inspection?.processing.aiReconstruction === "none" ? copy.aiNone : inspection?.processing.aiReconstruction === "used" ? copy.aiUsed : copy.unknown],
    [copy.reviewed, inspection?.recordReviewedAt ?? copy.unknown],
  ];
  return <details className="min-w-0" data-image-inspection>
    <summary className="cursor-pointer break-words py-2 font-semibold text-[#9adeb4]">{copy.summary}</summary>
    <dl className="grid gap-x-4 gap-y-2 py-2 sm:grid-cols-[10rem_minmax(0,1fr)]">
      {rows.map(([label, value]) => <div key={label} className="contents"><dt className="font-semibold text-white">{label}</dt><dd className="min-w-0 break-words">{value}</dd></div>)}
    </dl>
  </details>;
}
