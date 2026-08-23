import type {Locale} from "@/config/site";

type VideoUi = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  hubTitle: string;
  hubDescription: (count: number) => string;
  officialVideo: string;
  creatorFootage: string;
  readBreakdown: string;
  allVideos: string;
  officialBreakdown: string;
  creatorBreakdown: string;
  lastUpdated: string;
  quickAnswer: string;
  takeaways: string;
  connectionTitle: string;
  connectionBody: string;
  youtubeSource: string;
  relatedGuide: string;
  internalGuide: string;
  homeEyebrow: string;
  homeTitle: string;
  homeDescription: string;
  stripEyebrow: string;
  stripTitle: string;
  openHub: string;
  official: string;
  creator: string;
  thumbnail: string;
};

const copy: Record<Locale, VideoUi> = {
  en: {
    metaTitle: "WARDOGS Videos - YouTube Gameplay Breakdowns",
    metaDescription: "Standalone WARDOGS video guides for beginner tips, settings, money, helicopters, FOBs, weapons, vehicles, objectives, gameplay, and Early Access context.",
    eyebrow: "WARDOGS Video Intelligence",
    hubTitle: "WARDOGS YouTube Guides",
    hubDescription: (count) => `${count} independently written breakdowns turn useful creator and official footage into practical guides for first matches, money, settings, objectives, helicopters, FOBs, weapons, vehicles, and buying decisions.`,
    officialVideo: "Official video",
    creatorFootage: "Creator footage",
    readBreakdown: "Read video breakdown",
    allVideos: "All video guides",
    officialBreakdown: "Official video breakdown",
    creatorBreakdown: "Creator footage breakdown",
    lastUpdated: "Last updated",
    quickAnswer: "Quick answer",
    takeaways: "Key Takeaways",
    connectionTitle: "How this connects to the main WARDOGS guide",
    connectionBody: "This page is a video-specific breakdown. For confirmed gameplay systems, access windows, pricing, and platform status, use the linked core guide instead of treating footage as final documentation.",
    youtubeSource: "Source on YouTube",
    relatedGuide: "Read the related WARDOGS guide",
    internalGuide: "Internal guide",
    homeEyebrow: "Video Intelligence",
    homeTitle: "YouTube Footage Turned Into Standalone WARDOGS Guides",
    homeDescription: "Start with useful videos on first matches, money, settings, helicopters, FOB logistics, and objectives. Every source opens as a complete article with test-build caveats and a related core guide.",
    stripEyebrow: "Video-Based Guides",
    stripTitle: "Standalone YouTube Breakdowns",
    openHub: "Open video hub",
    official: "Official",
    creator: "Creator",
    thumbnail: "thumbnail"
  },
  ru: {
    metaTitle: "Видео WARDOGS - разборы геймплея с YouTube",
    metaDescription: "Самостоятельные видео-гайды WARDOGS о первых матчах, настройках, деньгах, вертолетах, FOB, оружии, технике, целях и раннем доступе.",
    eyebrow: "Видеоаналитика WARDOGS",
    hubTitle: "YouTube-гайды WARDOGS",
    hubDescription: (count) => `${count} самостоятельных разборов превращают официальные ролики и записи авторов в практические руководства по первым матчам, деньгам, настройкам, целям, вертолетам, FOB, оружию, технике и покупке игры.`,
    officialVideo: "Официальное видео",
    creatorFootage: "Запись автора",
    readBreakdown: "Читать разбор видео",
    allVideos: "Все видео-гайды",
    officialBreakdown: "Разбор официального видео",
    creatorBreakdown: "Разбор записи автора",
    lastUpdated: "Обновлено",
    quickAnswer: "Краткий ответ",
    takeaways: "Главные выводы",
    connectionTitle: "Как это связано с основным гайдом WARDOGS",
    connectionBody: "Эта страница разбирает конкретное видео. Подтвержденные игровые системы, окна доступа, цену и платформы проверяйте в связанном основном гайде, а не считайте запись окончательной документацией.",
    youtubeSource: "Источник на YouTube",
    relatedGuide: "Читать связанный гайд WARDOGS",
    internalGuide: "Внутренний гайд",
    homeEyebrow: "Видеоаналитика",
    homeTitle: "Видео с YouTube как самостоятельные гайды WARDOGS",
    homeDescription: "Начните с полезных материалов о первых матчах, деньгах, настройках, вертолетах, логистике FOB и целях. У каждого источника есть полноценная статья, оговорки о тестовой сборке и связанный основной гайд.",
    stripEyebrow: "Гайды по видео",
    stripTitle: "Самостоятельные разборы YouTube",
    openHub: "Открыть видеотеку",
    official: "Официальное",
    creator: "Автор",
    thumbnail: "обложка"
  },
  de: {
    metaTitle: "WARDOGS Videos - YouTube-Gameplay erklärt",
    metaDescription: "Eigenständige WARDOGS Video-Guides zu Einstieg, Einstellungen, Geld, Helikoptern, FOBs, Waffen, Fahrzeugen, Zielen und Early Access.",
    eyebrow: "WARDOGS Videoanalyse",
    hubTitle: "WARDOGS YouTube-Guides",
    hubDescription: (count) => `${count} eigenständige Analysen machen offizielle Videos und Creator-Aufnahmen zu praktischen Guides über erste Matches, Geld, Einstellungen, Ziele, Helikopter, FOBs, Waffen, Fahrzeuge und Kaufentscheidungen.`,
    officialVideo: "Offizielles Video",
    creatorFootage: "Creator-Aufnahme",
    readBreakdown: "Videoanalyse lesen",
    allVideos: "Alle Video-Guides",
    officialBreakdown: "Analyse eines offiziellen Videos",
    creatorBreakdown: "Analyse einer Creator-Aufnahme",
    lastUpdated: "Aktualisiert",
    quickAnswer: "Kurzantwort",
    takeaways: "Wichtigste Erkenntnisse",
    connectionTitle: "Verbindung zum Hauptguide für WARDOGS",
    connectionBody: "Diese Seite analysiert ein bestimmtes Video. Bestätigte Spielsysteme, Zugangszeiträume, Preise und Plattformen stehen im verknüpften Hauptguide; Aufnahmen sind keine endgültige Dokumentation.",
    youtubeSource: "Quelle auf YouTube",
    relatedGuide: "Verwandten WARDOGS-Guide lesen",
    internalGuide: "Interner Guide",
    homeEyebrow: "Videoanalyse",
    homeTitle: "YouTube-Aufnahmen als eigenständige WARDOGS-Guides",
    homeDescription: "Beginne mit hilfreichen Videos zu ersten Matches, Geld, Einstellungen, Helikoptern, FOB-Logistik und Zielen. Jede Quelle führt zu einem vollständigen Artikel mit Hinweisen zur Testversion und einem Hauptguide.",
    stripEyebrow: "Video-Guides",
    stripTitle: "Eigenständige YouTube-Analysen",
    openHub: "Videoübersicht öffnen",
    official: "Offiziell",
    creator: "Creator",
    thumbnail: "Vorschaubild"
  },
  "pt-br": {
    metaTitle: "Vídeos de WARDOGS - Guias de gameplay do YouTube",
    metaDescription: "Guias independentes em vídeo de WARDOGS sobre início, configurações, dinheiro, helicópteros, FOBs, armas, veículos, objetivos e Acesso Antecipado.",
    eyebrow: "Análises em vídeo de WARDOGS",
    hubTitle: "Guias de WARDOGS no YouTube",
    hubDescription: (count) => `${count} análises independentes transformam vídeos oficiais e de criadores em guias práticos sobre primeiras partidas, dinheiro, configurações, objetivos, helicópteros, FOBs, armas, veículos e compra.`,
    officialVideo: "Vídeo oficial",
    creatorFootage: "Vídeo de criador",
    readBreakdown: "Ler análise do vídeo",
    allVideos: "Todos os guias em vídeo",
    officialBreakdown: "Análise de vídeo oficial",
    creatorBreakdown: "Análise de vídeo de criador",
    lastUpdated: "Atualizado em",
    quickAnswer: "Resposta rápida",
    takeaways: "Principais conclusões",
    connectionTitle: "Como este conteúdo se conecta ao guia principal de WARDOGS",
    connectionBody: "Esta página analisa um vídeo específico. Para sistemas confirmados, janelas de acesso, preço e plataformas, consulte o guia principal ligado em vez de tratar a gravação como documentação final.",
    youtubeSource: "Fonte no YouTube",
    relatedGuide: "Ler o guia relacionado de WARDOGS",
    internalGuide: "Guia interno",
    homeEyebrow: "Análises em vídeo",
    homeTitle: "Vídeos do YouTube transformados em guias de WARDOGS",
    homeDescription: "Comece por vídeos úteis sobre primeiras partidas, dinheiro, configurações, helicópteros, logística de FOB e objetivos. Cada fonte abre um artigo completo com ressalvas da build de teste e um guia principal relacionado.",
    stripEyebrow: "Guias baseados em vídeo",
    stripTitle: "Análises independentes do YouTube",
    openHub: "Abrir central de vídeos",
    official: "Oficial",
    creator: "Criador",
    thumbnail: "miniatura"
  },
  ja: {
    metaTitle: "WARDOGS動画攻略 - YouTubeゲームプレイ解説",
    metaDescription: "WARDOGSの初心者向けヒント、設定、資金、ヘリコプター、FOB、武器、車両、目標、ゲームプレイ、早期アクセスを扱う独立動画攻略です。",
    eyebrow: "WARDOGS動画分析",
    hubTitle: "WARDOGS YouTube攻略",
    hubDescription: (count) => `${count}本の独立解説記事で、公式映像とクリエイター動画を、初戦、資金、設定、目標、ヘリコプター、FOB、武器、車両、購入判断に役立つ実践攻略へ整理しています。`,
    officialVideo: "公式動画",
    creatorFootage: "クリエイター映像",
    readBreakdown: "動画解説を読む",
    allVideos: "動画攻略一覧",
    officialBreakdown: "公式動画の解説",
    creatorBreakdown: "クリエイター映像の解説",
    lastUpdated: "最終更新",
    quickAnswer: "要点",
    takeaways: "重要ポイント",
    connectionTitle: "WARDOGS主要攻略との関係",
    connectionBody: "このページは特定の動画を分析したものです。確認済みのゲームシステム、参加期間、価格、対応機種は、映像を最終仕様とせず、リンク先の主要攻略で確認してください。",
    youtubeSource: "YouTubeの出典",
    relatedGuide: "関連するWARDOGS攻略を読む",
    internalGuide: "関連攻略",
    homeEyebrow: "動画分析",
    homeTitle: "YouTube映像を独立したWARDOGS攻略に整理",
    homeDescription: "初戦、資金、設定、ヘリコプター、FOB兵站、目標に役立つ動画から始められます。各出典には、テストビルドの注意点と関連攻略を含む完全な記事があります。",
    stripEyebrow: "動画ベース攻略",
    stripTitle: "YouTube独立解説",
    openHub: "動画攻略を開く",
    official: "公式",
    creator: "クリエイター",
    thumbnail: "サムネイル"
  }
};

export function getVideoUi(locale: Locale) {
  return copy[locale];
}
