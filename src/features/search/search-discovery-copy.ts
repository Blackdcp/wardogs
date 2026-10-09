import type {Locale} from "@/config/site";

// Search synonyms point to existing answers, including announced-but-unreleased items.
// They do not create equipment records or claim that a planned weapon is live.
const terms: Record<Locale, {season: string[]; weapons: string[]; gold: string[]; wipe: string[]; antiAir: string[]; candidate: string}> = {
  en: {season: ["Season 2", "Season 02"], weapons: ["new weapons", "new guns"], gold: ["gold market", "gold bars", "skins"], wipe: ["wipe", "season reset"], antiAir: ["anti air", "anti helicopter", "anti armor", "anti tank"], candidate: "Creator research candidate; gameplay claims require verification."},
  ja: {season: ["シーズン2", "シーズン 2", "シーズン02"], weapons: ["新武器", "新しい武器"], gold: ["ゴールドマーケット", "ゴールドバー", "金の延べ棒"], wipe: ["ワイプ", "リセット"], antiAir: ["対空", "対ヘリ", "対装甲", "ヘリの倒し方"], candidate: "配信者の調査候補。ゲーム内の主張は追加検証が必要です。"},
  ru: {season: ["сезон 2", "второй сезон"], weapons: ["новое оружие", "новые пушки"], gold: ["золотой рынок", "рынок золота", "золотые слитки"], wipe: ["вайп", "сброс сезона"], antiAir: ["ПВО", "против вертолетов", "противотанковое оружие"], candidate: "Видео для изучения; игровые утверждения требуют проверки."},
  de: {season: ["Saison 2", "zweite Saison"], weapons: ["neue Waffen"], gold: ["Goldmarkt", "Goldbarren"], wipe: ["Wipe", "Saison-Reset"], antiAir: ["Flugabwehr", "gegen Helikopter", "Panzerabwehr"], candidate: "Recherchekandidat eines Creators; Spielaussagen müssen geprüft werden."},
  "zh-cn": {season: ["第二赛季", "赛季2"], weapons: ["新武器", "新枪"], gold: ["黄金市场", "金币市场", "金条"], wipe: ["清档", "赛季重置"], antiAir: ["防空", "反直升机", "反装甲", "怎么打直升机"], candidate: "博主研究候选，游戏机制说法仍需核验。"},
  "zh-tw": {season: ["第二賽季", "賽季2"], weapons: ["新武器", "新槍"], gold: ["黃金市場", "金幣市場", "金條"], wipe: ["清檔", "賽季重置"], antiAir: ["防空", "反直升機", "反裝甲", "怎麼打直升機"], candidate: "創作者研究候選，遊戲機制說法仍需核驗。"},
  "pt-br": {season: ["Temporada 2", "segunda temporada"], weapons: ["novas armas"], gold: ["mercado de ouro", "barras de ouro"], wipe: ["wipe", "reset da temporada"], antiAir: ["antiaéreo", "contra helicópteros", "antitanque"], candidate: "Vídeo candidato à pesquisa; as afirmações de jogo exigem verificação."},
  pl: {season: ["sezon 2", "drugi sezon"], weapons: ["nowe bronie"], gold: ["rynek złota", "sztabki złota"], wipe: ["wipe", "reset sezonu"], antiAir: ["obrona przeciwlotnicza", "przeciw śmigłowcom", "przeciwpancerne"], candidate: "Materiał twórcy do analizy; twierdzenia o grze wymagają weryfikacji."}
};

// A role query must remain distinct from the medical-equipment catalogue.
// Exact aliases let the runtime rank the intended answer above prefix matches.
const medicRoleTerms: Record<Locale, readonly string[]> = {
  en: ["medic", "medic revive"],
  ja: ["メディック", "衛生兵"],
  ru: ["медик"],
  de: ["Sanitäter"],
  "pt-br": ["médico"],
  "zh-cn": ["医疗兵"],
  "zh-tw": ["醫療兵"],
  pl: ["medyk"]
};

const mortarToolTerms: Record<Locale, readonly string[]> = {
  en: ["mortar", "mortar calculator"],
  ja: ["迫撃砲", "迫撃砲計算機", "迫撃砲 計算機"],
  ru: ["миномёт", "миномет", "минометный калькулятор", "калькулятор миномета"],
  de: ["Mörser", "Mörserrechner", "Mörser Rechner"],
  "pt-br": ["morteiro", "calculadora de morteiro"],
  "zh-cn": ["迫击炮", "迫击炮计算器"],
  "zh-tw": ["迫擊砲", "迫擊炮", "迫擊砲計算器"],
  pl: ["moździerz", "kalkulator moździerza"]
};

export function getDiscoverySearchAliases(locale: Locale, href: string): string[] {
  const t = terms[locale];
  if (href === "/tools/artillery-calculator") return ["mortar", "mortar calculator", ...mortarToolTerms[locale]];
  if (href === "/guides/wardogs-medic-revive-guide") return ["medic", ...medicRoleTerms[locale]];
  if (href === "/items/medical") return ["medical", "medical items"];
  if (href === "/guides/wardogs-season-2") return [...t.season, ...t.season.map((term) => term.replace(/\s+/g, "")), ...t.weapons, "Season 2", "Season 02", "new weapons", "M14"];
  if (href === "/guides/wardogs-progression-wipes-guide") return t.wipe;
  if (href === "/gold-market") return [...t.gold, "gold market"];
  if (href === "/guides/wardogs-helicopter-guide") return [...t.antiAir, "Verbe", "Verba anti air", "anti helicopter"];
  if (href === "/guides/wardogs-community-servers-guide") return ["1of1", "1 of 1", "community servers"];
  return [];
}

export function getSearchCandidateSummary(locale: Locale) {return terms[locale].candidate;}
