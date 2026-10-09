import {getRecentVideoHubCopy} from "./recent-video-hub-copy";
import type {Locale} from "@/config/site";

type VideoUi = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  hubTitle: string;
  hubDescription: (count: number) => string;
  officialVideo: string;
  creatorFootage: string;
  currentSourcesTitle: string;
  currentSourcesDescription: string;
  seasonOneCurrent: string;
  betaWorkflow: string;
  historicalReference: string;
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
  stripEyebrow: string;
  stripTitle: string;
  openHub: string;
  official: string;
  creator: string;
  thumbnail: string;
};

const copy: Record<Locale, VideoUi> = {
  "zh-cn": {
    metaTitle: "WARDOGS 视频攻略 - YouTube 实机解析", metaDescription: "独立整理的 WARDOGS 中文视频攻略，覆盖新手、设置、赚钱、直升机、FOB、武器、载具、目标和抢先体验信息。", eyebrow: "WARDOGS 视频情报", hubTitle: "WARDOGS YouTube 攻略", hubDescription: (count) => `${count} 篇独立撰写的视频解析，将官方和创作者实机整理成新手、资金、设置、目标、直升机、FOB、武器、载具与购买判断攻略。`, officialVideo: "官方视频", creatorFootage: "创作者实机", currentSourcesTitle: "Season 1 当前视频精选", currentSourcesDescription: "已于 2026 年 9 月 17 日核对的外部视频，优先覆盖新手、赚钱、配装、FOB、设置与进度问题。创作者结论仍需对照当前客户端和官方公告。", seasonOneCurrent: "Season 1 当前版本", betaWorkflow: "Beta 流程参考", historicalReference: "历史资料", readBreakdown: "阅读视频解析", allVideos: "全部视频攻略", officialBreakdown: "官方视频解析", creatorBreakdown: "创作者视频解析", lastUpdated: "最后更新", quickAnswer: "快速结论", takeaways: "关键要点", connectionTitle: "它与核心攻略的关系", connectionBody: "本页分析一段特定视频。已确认的游戏系统、测试时间、价格和平台信息，请通过链接的核心攻略核对，不要把视频画面当作最终版本。", youtubeSource: "YouTube 来源", relatedGuide: "阅读相关 WARDOGS 攻略", internalGuide: "相关攻略", stripEyebrow: "视频驱动攻略", stripTitle: "YouTube 独立解析", openHub: "打开视频攻略", official: "官方", creator: "创作者", thumbnail: "缩略图"
  },
  en: {
    metaTitle: "WARDOGS Videos - YouTube Gameplay Breakdowns",
    metaDescription: "Standalone WARDOGS video guides for beginner tips, settings, money, helicopters, FOBs, weapons, vehicles, objectives, gameplay, and Early Access context.",
    eyebrow: "WARDOGS Video Intelligence",
    hubTitle: "WARDOGS YouTube Guides",
    hubDescription: (count) => `${count} independently written breakdowns turn useful creator and official footage into practical guides for first matches, money, settings, objectives, helicopters, FOBs, weapons, vehicles, and buying decisions.`,
    officialVideo: "Official video",
    creatorFootage: "Creator footage",
    currentSourcesTitle: "Current Season 1 video watchlist",
    currentSourcesDescription: "External videos checked on September 17, 2026, prioritized for beginner, money, loadout, FOB, settings, and progression questions. Verify creator conclusions against the live client and official notes.",
    seasonOneCurrent: "Season 1 current",
    betaWorkflow: "Beta workflow",
    historicalReference: "Historical reference",
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
    currentSourcesTitle: "Актуальные видео первого сезона",
    currentSourcesDescription: "Внешние видео проверены 17 сентября 2026 года и отобраны по вопросам новичков, денег, комплектов, FOB, настроек и прогрессии. Выводы авторов сверяйте с текущим клиентом и официальными заметками.",
    seasonOneCurrent: "Актуально для сезона 1",
    betaWorkflow: "Процесс из бета-версии",
    historicalReference: "Историческая справка",
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
    currentSourcesTitle: "Aktuelle Videos zu Saison 1",
    currentSourcesDescription: "Am 17. September 2026 geprüfte externe Videos zu Einstieg, Geld, Loadouts, FOBs, Einstellungen und Fortschritt. Creator-Aussagen sollten mit dem Live-Client und offiziellen Hinweisen abgeglichen werden.",
    seasonOneCurrent: "Saison 1 aktuell",
    betaWorkflow: "Beta-Ablauf",
    historicalReference: "Historische Referenz",
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
    currentSourcesTitle: "Vídeos atuais da Temporada 1",
    currentSourcesDescription: "Vídeos externos verificados em 17 de setembro de 2026, priorizando dúvidas sobre iniciantes, dinheiro, kits, FOB, configurações e progressão. Compare as conclusões com o cliente atual e as notas oficiais.",
    seasonOneCurrent: "Atual na Temporada 1",
    betaWorkflow: "Fluxo da versão beta",
    historicalReference: "Referência histórica",
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
    currentSourcesTitle: "シーズン1の最新動画",
    currentSourcesDescription: "2026年9月17日に確認した外部動画です。初心者、資金、装備、FOB、設定、進行を優先し、制作者の結論は現在のクライアントと公式告知で再確認します。",
    seasonOneCurrent: "シーズン1現行版",
    betaWorkflow: "ベータ版の手順参考",
    historicalReference: "履歴資料",
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
    stripEyebrow: "動画ベース攻略",
    stripTitle: "YouTube独立解説",
    openHub: "動画攻略を開く",
    official: "公式",
    creator: "クリエイター",
    thumbnail: "サムネイル"
  },

  pl: {metaTitle: "Filmy WARDOGS - analizy rozgrywki z YouTube", metaDescription: "Osobne poradniki filmowe WARDOGS: początki, ustawienia, pieniądze, śmigłowce, FOB, broń, pojazdy, cele, rozgrywka i wczesny dostęp.", eyebrow: "Analizy filmów WARDOGS", hubTitle: "Poradniki WARDOGS z YouTube", hubDescription: (count) => `${count} autorskich analiz materiałów twórców i deweloperów pomaga w pierwszych meczach, zarządzaniu pieniędzmi, ustawieniach, celach, śmigłowcach, FOB, broni, pojazdach i decyzjach zakupowych.`, officialVideo: "Film oficjalny", creatorFootage: "Nagranie twórcy", currentSourcesTitle: "Filmy do sprawdzenia: sezon 1", currentSourcesDescription: "Filmy zewnętrzne sprawdzone 17 września 2026, wybrane pod kątem początków, pieniędzy, wyposażenia, FOB, ustawień i postępów. Wnioski twórców porównuj z obecną wersją gry i oficjalnymi zmianami.", seasonOneCurrent: "Aktualny sezon 1", betaWorkflow: "Procedura z bety", historicalReference: "Materiał historyczny", readBreakdown: "Przeczytaj analizę filmu", allVideos: "Wszystkie poradniki filmowe", officialBreakdown: "Analiza filmu oficjalnego", creatorBreakdown: "Analiza nagrania twórcy", lastUpdated: "Ostatnia aktualizacja", quickAnswer: "Krótka odpowiedź", takeaways: "Najważniejsze wnioski", connectionTitle: "Powiązanie z głównym poradnikiem WARDOGS", connectionBody: "Ta strona analizuje konkretny film. Potwierdzone mechaniki, terminy dostępu, ceny i status platform znajdziesz w powiązanym głównym poradniku. Nagranie nie jest ostateczną dokumentacją.", youtubeSource: "Źródło na YouTube", relatedGuide: "Przeczytaj powiązany poradnik WARDOGS", internalGuide: "Poradnik serwisu", stripEyebrow: "Poradniki na podstawie filmów", stripTitle: "Osobne analizy filmów z YouTube", openHub: "Otwórz bibliotekę filmów", official: "Oficjalny", creator: "Twórca", thumbnail: "miniatura"},
  "zh-tw": {
    metaTitle: "WARDOGS 影片攻略 - YouTube 實機解析", metaDescription: "獨立整理的 WARDOGS 中文影片攻略，覆蓋新手、設定、賺錢、直升機、FOB、武器、載具、目標和搶先體驗資訊。", eyebrow: "WARDOGS 影片情報", hubTitle: "WARDOGS YouTube 攻略", hubDescription: (count) => `${count} 篇獨立撰寫的影片解析，將官方和創作者實機整理成新手、資金、設定、目標、直升機、FOB、武器、載具與購買判斷攻略。`, officialVideo: "官方影片", creatorFootage: "創作者實機", currentSourcesTitle: "Season 1 當前影片精選", currentSourcesDescription: "已於 2026 年 9 月 17 日核對的外部影片，優先覆蓋新手、賺錢、配裝、FOB、設定與進度問題。創作者結論仍需對照當前客戶端和官方公告。", seasonOneCurrent: "Season 1 當前版本", betaWorkflow: "Beta 流程參考", historicalReference: "歷史資料", readBreakdown: "閱讀影片解析", allVideos: "全部影片攻略", officialBreakdown: "官方影片解析", creatorBreakdown: "創作者影片解析", lastUpdated: "最後更新", quickAnswer: "快速結論", takeaways: "關鍵要點", connectionTitle: "它與核心攻略的關係", connectionBody: "本頁分析一段特定影片。已確認的遊戲系統、測試時間、價格和平臺資訊，請通過連結的核心攻略核對，不要把影片畫面當作最終版本。", youtubeSource: "YouTube 來源", relatedGuide: "閱讀相關 WARDOGS 攻略", internalGuide: "相關攻略", stripEyebrow: "影片驅動攻略", stripTitle: "YouTube 獨立解析", openHub: "開啟影片攻略", official: "官方", creator: "創作者", thumbnail: "縮圖"
}
};

export function getVideoUi(locale: Locale) {
  return {...copy[locale], ...getRecentVideoHubCopy(locale)};
}
