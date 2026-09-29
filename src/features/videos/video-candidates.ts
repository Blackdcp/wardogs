export type CandidateLanguage = "en" | "ja" | "ru" | "de";
export type CandidateCaution = "operations" | "calculator" | "gold" | "rollback" | "layout" | "axis" | "sponsor" | "disputed";

export interface VideoCandidate {
  youtubeId: string;
  title: string;
  channel: string;
  language: CandidateLanguage;
  publishedDate: string;
  metadataCheckedAt: "2026-09-30";
  // Metadata provenance only; caption/frame review is in video-candidate-evidence.ts.
  evidence: "metadata-and-chapters" | "metadata-only";
  // Exporting/reading automatic captions does not validate them against the audio.
  transcriptVerified: false;
  gameplayVerified: false;
  embedPlaybackVerified: false;
  guideSlug: string;
  caution: CandidateCaution;
  chapters: readonly {seconds: number; label: string}[];
}

const candidate = (data: Omit<VideoCandidate, "metadataCheckedAt" | "transcriptVerified" | "gameplayVerified" | "embedPlaybackVerified" | "evidence">): VideoCandidate => ({
  ...data,
  metadataCheckedAt: "2026-09-30",
  evidence: data.chapters.length ? "metadata-and-chapters" : "metadata-only",
  transcriptVerified: false,
  gameplayVerified: false,
  embedPlaybackVerified: false
});

// Original watch-page metadata and displayed chapters, not validated game instructions.
export const videoCandidates: readonly VideoCandidate[] = [
  candidate({youtubeId: "BIvKEmXlw78", title: "WARDOGS: Complete Mortar Guide", channel: "LifeofKino", language: "en", publishedDate: "2026-09-18", guideSlug: "wardogs-mortar-guide", caution: "operations", chapters: [{seconds: 10, label: "Building a Mortar & Ammo for a Mortar"}, {seconds: 65, label: "Aiming Mortars"}]}),
  candidate({youtubeId: "YIJ9EE8wflk", title: "Wardogs - Mortar/Stingray base - Stingray Tutorial - Choosing where to build", channel: "RadioGLHF", language: "en", publishedDate: "2026-09-27", guideSlug: "wardogs-fob-guide", caution: "layout", chapters: []}),
  candidate({youtubeId: "LfDuaJXN_g0", title: "WARDOGS Mortar Calculator – Perfect Your Aim! Free Tool + Voice Commands #wardogs #wardogsgame", channel: "ThePretender", language: "en", publishedDate: "2026-09-26", guideSlug: "wardogs-mortar-guide", caution: "calculator", chapters: [{seconds: 120, label: "Calculator"}, {seconds: 192, label: "Voice commands"}, {seconds: 358, label: "Browser compatibility"}]}),
  candidate({youtubeId: "PbvKl6Cicw4", title: "WARDOGS Gold Bars: Don't Waste Them Until You Watch This", channel: "Airwingmarine", language: "en", publishedDate: "2026-09-22", guideSlug: "wardogs-money-guide", caution: "gold", chapters: [{seconds: 33, label: "Gold Exchange"}, {seconds: 104, label: "Two currencies"}, {seconds: 255, label: "Price history"}, {seconds: 371, label: "Uses"}]}),
  candidate({youtubeId: "oCPyxCVQBvA", title: "WARDOGS - Expert Helicopter Flying & Landing Guide | Master the J Hook", channel: "ProLosco", language: "en", publishedDate: "2026-09-20", guideSlug: "wardogs-helicopter-guide", caution: "operations", chapters: [{seconds: 49, label: "Controls & inputs"}, {seconds: 300, label: "Flying"}, {seconds: 552, label: "Landing"}, {seconds: 930, label: "J-Hook"}]}),
  candidate({youtubeId: "dbB4BXEDAPc", title: "WARDOGS startet nicht mehr nach Windows Update? DAS hilft! KB5124010", channel: "PORMI", language: "de", publishedDate: "2026-09-25", guideSlug: "wardogs-crash-fix", caution: "rollback", chapters: []}),
  candidate({youtubeId: "LJhMbE-Hle8", title: "The ULTIMATE Building Guide for WARDOGS", channel: "HitboTC", language: "en", publishedDate: "2026-09-21", guideSlug: "wardogs-fob-guide", caution: "layout", chapters: [{seconds: 92, label: "Gates"}, {seconds: 396, label: "Walls"}, {seconds: 601, label: "Indirect-fire shelter"}, {seconds: 1231, label: "Drills & equipment"}]}),
  candidate({youtubeId: "18NAV3XnXsA", title: "Quick and Dirty - Logistics Basics", channel: "Duskguy", language: "en", publishedDate: "2026-09-18", guideSlug: "wardogs-cargo-guide", caution: "operations", chapters: [{seconds: 20, label: "Kodiak vs Ural"}, {seconds: 35, label: "Crates vs pallets"}, {seconds: 60, label: "Crates"}, {seconds: 124, label: "Ural / pallets"}, {seconds: 180, label: "Choosing supplies"}]}),
  candidate({youtubeId: "WRp2TtPMru8", title: "【建築】海外で話題の最強拠点！設計＆使える防衛テクニック【WARDOGS】", channel: "はちぴ", language: "ja", publishedDate: "2026-09-29", guideSlug: "wardogs-fob-guide", caution: "layout", chapters: [{seconds: 76, label: "建造方法"}, {seconds: 173, label: "四角の壁"}, {seconds: 303, label: "ドリル"}, {seconds: 417, label: "弱点・注意点"}]}),
  candidate({youtubeId: "yjTYiok5yng", title: "輸送ヘリ初心者講座【WARDOGS】", channel: "Apple Gaming", language: "ja", publishedDate: "2026-09-21", guideSlug: "wardogs-helicopter-guide", caution: "operations", chapters: []}),
  candidate({youtubeId: "6Xp6IRzDL4g", title: "【ガチ初歩講座】これからヘリコプターパイロットになる諸君の為の動画【WARDOGS】", channel: "ﾀｶﾄｼ", language: "ja", publishedDate: "2026-09-25", guideSlug: "wardogs-controls", caution: "axis", chapters: []}),
  candidate({youtubeId: "z8i2cQiQSjE", title: "WARDOGS - Как спрятать миномет", channel: "Tactiq", language: "ru", publishedDate: "2026-09-25", guideSlug: "wardogs-mortar-guide", caution: "layout", chapters: [{seconds: 25, label: "Вариант 1"}, {seconds: 206, label: "Вариант 2"}, {seconds: 343, label: "Вариант 3"}, {seconds: 480, label: "Итоги"}]}),
  candidate({youtubeId: "gt7EZW5joDg", title: "WARDOGS КАК летать на вертолете - управление, маневры, цели", channel: "Splandor Game", language: "ru", publishedDate: "2026-09-20", guideSlug: "wardogs-helicopter-guide", caution: "sponsor", chapters: [{seconds: 84, label: "Тренировка"}, {seconds: 131, label: "Клавиши"}, {seconds: 210, label: "Чувствительность мыши"}, {seconds: 242, label: "Маневры"}]}),
  candidate({youtubeId: "SVLgG_eiLs8", title: "Самый лучший фарм в WARDOGS?", channel: "Dungeon Hamster", language: "ru", publishedDate: "2026-09-18", guideSlug: "wardogs-cargo-guide", caution: "disputed", chapters: []})
];

export function candidateWatchUrl(id: string, seconds?: number) {
  return `https://www.youtube.com/watch?v=${id}${seconds === undefined ? "" : `&t=${seconds}s`}`;
}

export function getVideoCandidates(locale: string) {
  return [...videoCandidates].sort((a, b) => Number(b.language === locale) - Number(a.language === locale) || b.publishedDate.localeCompare(a.publishedDate));
}
