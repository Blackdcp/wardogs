import {beforeAll, describe, expect, it} from "vitest";
import {locales, type Locale} from "@/config/site";
import {buildSiteSearchIndex, getSearchKeyboardAction, searchSiteIndex, type SiteSearchEntry} from "@/features/search/site-search-index";

// Recorded before the fix: 120 task queries; 78 target-first, 3 lower-ranked,
// 39 missing targets (27 of those completely empty). These are user tasks,
// not aliases generated from the implementation being tested.
const destinations = [
  "/guides/wardogs-season-2",
  "/guides/wardogs-season-2",
  "/guides/wardogs-solo-guide",
  "/guides/wardogs-solo-guide",
  "/guides/wardogs-report-player",
  "/videos/wardogs-season-2-developer-interview",
  "/videos/wardogs-attachments-tested",
  "/videos/wardogs-solo-duo-fob-layout",
  "/videos/wardogs-fob-income-breakdown",
  "/videos/wardogs-offensive-support-playstyle",
  "/gold-market",
  "/gold-market",
  "/tools/map",
  "/tools/map",
  "/tools/artillery-calculator"
] as const;
const tasks: Record<Locale, readonly string[]> = {
  "en": [
    "October 15",
    "Season 2 new weapons",
    "solo",
    "no mic",
    "report player",
    "Bigfry",
    "Evo4Fun attachments",
    "Wake Up FOB",
    "RadioGLHF costs",
    "Colvin C4",
    "gold budget",
    "gold calculator",
    "interactive map",
    "map pins",
    "artillery calculator"
  ],
  "de": [
    "15. Oktober",
    "Saison 2 neue Waffen",
    "solo",
    "ohne Mikro",
    "Spieler melden",
    "Bigfry",
    "Evo4Fun Aufsätze",
    "Wake Up FOB",
    "RadioGLHF Kosten",
    "Colvin C4",
    "Gold Budget",
    "Goldrechner",
    "interaktive Karte",
    "Kartenmarkierungen",
    "Artillerierechner"
  ],
  "ru": [
    "15 октября",
    "сезон 2 новое оружие",
    "соло",
    "без микрофона",
    "жалоба на игрока",
    "Bigfry",
    "Evo4Fun обвесы",
    "Wake Up FOB",
    "RadioGLHF расходы",
    "Colvin C4",
    "бюджет золота",
    "калькулятор золота",
    "интерактивная карта",
    "метки на карте",
    "калькулятор артиллерии"
  ],
  "pt-br": [
    "15 de outubro",
    "Temporada 2 novas armas",
    "solo",
    "sem microfone",
    "denunciar jogador",
    "Bigfry",
    "Evo4Fun acessórios",
    "Wake Up FOB",
    "RadioGLHF custos",
    "Colvin C4",
    "orçamento de ouro",
    "calculadora de ouro",
    "mapa interativo",
    "marcadores do mapa",
    "calculadora de artilharia"
  ],
  "ja": [
    "10月15日",
    "シーズン2 新武器",
    "ソロ",
    "マイクなし",
    "プレイヤー通報",
    "Bigfry",
    "Evo4Fun アタッチメント",
    "Wake Up FOB",
    "RadioGLHF 費用",
    "Colvin C4",
    "ゴールド予算",
    "ゴールド計算機",
    "インタラクティブマップ",
    "マップピン",
    "砲兵計算機"
  ],
  "zh-cn": [
    "10月15日",
    "第二赛季 新武器",
    "独狼",
    "不开麦",
    "举报玩家",
    "Bigfry",
    "Evo4Fun 配件",
    "Wake Up FOB",
    "RadioGLHF 成本",
    "Colvin C4",
    "黄金预算",
    "黄金计算器",
    "互动地图",
    "地图标记",
    "火炮计算器"
  ],
  "zh-tw": [
    "10月15日",
    "第二賽季 新武器",
    "獨狼",
    "不開麥",
    "檢舉玩家",
    "Bigfry",
    "Evo4Fun 配件",
    "Wake Up FOB",
    "RadioGLHF 成本",
    "Colvin C4",
    "黃金預算",
    "黃金計算器",
    "互動地圖",
    "地圖標記",
    "火砲計算器"
  ],
  "pl": [
    "15 października",
    "sezon 2 nowe bronie",
    "solo",
    "bez mikrofonu",
    "zgłoś gracza",
    "Bigfry",
    "Evo4Fun dodatki",
    "Wake Up FOB",
    "RadioGLHF koszty",
    "Colvin C4",
    "budżet złota",
    "kalkulator złota",
    "mapa interaktywna",
    "znaczniki mapy",
    "kalkulator artylerii"
  ]
};
const alreadyFirst: Record<Locale, readonly number[]> = {
  "en": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    9,
    12
  ],
  "de": [
    0,
    1,
    2,
    3,
    4,
    5,
    7,
    8,
    9,
    12
  ],
  "ru": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    9,
    12,
    14
  ],
  "pt-br": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    9,
    12
  ],
  "ja": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    9,
    12
  ],
  "zh-cn": [
    0,
    1,
    2,
    3,
    5,
    6,
    7,
    9
  ],
  "zh-tw": [
    0,
    1,
    2,
    3,
    5,
    6,
    7,
    9,
    12
  ],
  "pl": [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    9,
    12
  ]
};

describe("eight-language search task journeys", () => {
  const indices = new Map<Locale, SiteSearchEntry[]>();
  beforeAll(async () => {
    await Promise.all(locales.map(async locale => indices.set(locale, await buildSiteSearchIndex(locale))));
  });

  it.each(locales)("preserves the pre-fix leading answers in %s", locale => {
    const index = indices.get(locale)!;
    for (const position of alreadyFirst[locale]) {
      const query = tasks[locale][position];
      expect(searchSiteIndex(index, query)[0]?.href, query).toBe(destinations[position]);
    }
  });

  it.each(locales)("opens the task's actual guide, reviewed video or executable tool in %s", locale => {
    const index = indices.get(locale)!;
    expect(tasks[locale]).toHaveLength(destinations.length);
    for (const [position, query] of tasks[locale].entries()) {
      const results = searchSiteIndex(index, query);
      expect(results[0]?.href, `${locale}: ${query}; got ${results.map(({href}) => href).join(", ")}`).toBe(destinations[position]);
      expect(getSearchKeyboardAction("Enter", 0, results), query).toEqual({type: "open", href: destinations[position]});
    }
  });
});
