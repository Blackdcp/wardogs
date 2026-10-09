import {beforeAll, describe, expect, it} from "vitest";
import {locales, type Locale} from "@/config/site";
import {buildSiteSearchIndex, searchSiteIndex, type SiteSearchEntry} from "@/features/search/site-search-index";
import {listGuideSummaries} from "@/content/guides";
import {getRecentCandidateCopy} from "@/features/videos/recent-candidate-copy";

describe("seasonal search discovery", () => {
  const indices = new Map<Locale, SiteSearchEntry[]>();
  beforeAll(async () => {await Promise.all(locales.map(async (locale) => indices.set(locale, await buildSiteSearchIndex(locale))));});
  it.each([
    ["en", ["mortar", "mortar calculator"]], ["ja", ["迫撃砲", "迫撃砲計算機"]],
    ["ru", ["миномёт", "калькулятор миномета"]], ["de", ["Mörser", "Mörserrechner"]],
    ["zh-cn", ["迫击炮", "迫击炮计算器"]], ["zh-tw", ["迫擊砲", "迫擊砲計算器"]],
    ["pt-br", ["morteiro", "calculadora de morteiro"]], ["pl", ["moździerz", "kalkulator moździerza"]]
  ] as const)("keeps mortar intents on maintained answers and explicit calculator terms on the tool in %s", (locale, nativeQueries) => {
    const index = indices.get(locale)!;
    for (const query of ["  MORTAR  ", nativeQueries[0]]) expect(["/items/weapons/mortar", "/guides/wardogs-mortar-guide", "/tools/artillery-calculator"], query).toContain(searchSiteIndex(index, query)[0]?.href);
    for (const query of ["mortar calculator", nativeQueries[1]]) expect(searchSiteIndex(index, query)[0]?.href, query).toBe("/tools/artillery-calculator");
    expect(index.some(({href}) => href === "/videos#candidate-YIJ9EE8wflk")).toBe(true);
  });
  it("retains basic map and gold entry points and the FOB guide among results", () => {
    const index = indices.get("en")!;
    for (const [query, destinations] of [["map", ["/maps", "/tools/map"]], ["gold", ["/gold-market"]]] as const) {
      expect(destinations, query).toContain(searchSiteIndex(index, query)[0]?.href);
    }
    expect(searchSiteIndex(index, "fob").some(({href}) => href === "/guides/wardogs-fob-guide")).toBe(true);
  });
  it.each([
    ["en", "medic"], ["ja", "衛生兵"], ["ru", "медик"], ["de", "Sanitäter"],
    ["zh-cn", "医疗兵"], ["zh-tw", "醫療兵"], ["pt-br", "médico"], ["pl", "medyk"]
  ] as const)("separates %s role intent (%s) from medical equipment", (locale, roleQuery) => {
    const index = indices.get(locale)!;
    for (const query of [roleQuery, "  MEDIC  "]) {
      const results = searchSiteIndex(index, query);
      expect(results[0]?.href).toBe("/guides/wardogs-medic-revive-guide");
      // The catalogue remains discoverable; it must not steal an exact role query.
      expect(index.some(({href}) => href === "/items/medical")).toBe(true);
    }
    for (const query of ["medical", "medical items"]) expect(searchSiteIndex(index, query)[0]?.href).toBe("/items/medical");
  });
  it.each([
    ["en", "season 2"], ["ja", "シーズン2"], ["ru", "сезон 2"], ["de", "Saison 2"],
    ["zh-cn", "第二赛季"], ["zh-tw", "第二賽季"], ["pt-br", "Temporada 2"], ["pl", "sezon 2"]
  ] as const)("leads %s %s to the maintained season answer", (locale, query) => {
    expect(searchSiteIndex(indices.get(locale)!, query)[0]?.href).toBe("/guides/wardogs-season-2");
  });
  it.each([
    ["en", "gold market"], ["ja", "ゴールドマーケット"], ["ru", "золотой рынок"], ["de", "Goldmarkt"],
    ["zh-cn", "黄金市场"], ["zh-tw", "黃金市場"], ["pt-br", "mercado de ouro"], ["pl", "rynek złota"]
  ] as const)("finds the actual %s market hub for %s", (locale, query) => {
    expect(searchSiteIndex(indices.get(locale)!, query)[0]?.href).toBe("/gold-market");
  });
  it.each([
    ["en", "anti helicopter"], ["ja", "対ヘリ"], ["ru", "ПВО"], ["de", "Flugabwehr"],
    ["zh-cn", "反直升机"], ["zh-tw", "反直升機"], ["pt-br", "antiaéreo"], ["pl", "obrona przeciwlotnicza"]
  ] as const)("routes %s %s to the existing pilot and infantry response guide", (locale, query) => {
    expect(searchSiteIndex(indices.get(locale)!, query)[0]?.href).toBe("/guides/wardogs-helicopter-guide");
  });
  it("indexes authored answers even when no task-panel recipe exists", async () => {
    const summaries = await listGuideSummaries("en");
    const season = summaries.find(({slug}) => slug === "wardogs-season-2")!;
    expect(season.directAnswer).toContain("four new weapons");
    const entry = indices.get("en")!.find(({id}) => id === "guide:wardogs-season-2")!;
    expect(entry.taskIntent).toContain(season.directAnswer);
    for (const query of ["new weapons", "M14"]) expect(searchSiteIndex(indices.get("en")!, query)[0]?.href).toBe("/guides/wardogs-season-2");
    expect(searchSiteIndex(indices.get("en")!, "1of1")[0]?.href).toBe("/guides/wardogs-community-servers-guide");
  });
  it("keeps public hubs unique and excludes fabricated new equipment URLs", () => {
    for (const index of indices.values()) {
      for (const href of ["/items", "/items/weapons", "/guides", "/tools", "/news", "/videos", "/gold-market", "/black-market", "/skins"]) expect(index.filter((entry) => entry.href === href), href).toHaveLength(1);
      expect(new Set(index.map(({id}) => id)).size).toBe(index.length);
      expect(index.some(({href}) => href === "/items/weapons/m14")).toBe(false);
      for (const slug of ["wardogs-solo-guide", "wardogs-report-player"]) expect(index.some(({href}) => href === `/guides/${slug}`)).toBe(true);
    }
  });
  it.each(locales)("finds reviewed creator watch pages and explicitly labeled candidates in %s", (locale) => {
    const index = indices.get(locale)!;
    expect(searchSiteIndex(index, "Bigfry").some(({href}) => href === "/videos/wardogs-season-2-developer-interview")).toBe(true);
    expect(searchSiteIndex(index, "Evo4Fun").some(({href}) => href === "/videos/wardogs-attachments-tested")).toBe(true);
    expect(searchSiteIndex(index, "You've been using the WRONG attachments").some(({href}) => href === "/videos/wardogs-attachments-tested")).toBe(true);
    const radio = searchSiteIndex(index, "RadioGLHF").find(({href}) => href === "/videos/wardogs-fob-income-breakdown");
    expect(radio?.summary).toBeTruthy();
    expect(index.some(({href}) => href === "/videos#candidate-Qx1ndM1tc2Y")).toBe(false);
    expect(searchSiteIndex(index, "Colvin").some(({href}) => href === "/videos/wardogs-offensive-support-playstyle")).toBe(true);
    const candidate = searchSiteIndex(index, "Nalerian").find(({href}) => href === "/videos#candidate-NC7nsS8qKBM");
    expect(candidate?.summary).toContain(getRecentCandidateCopy(locale, "NC7nsS8qKBM"));
    expect(index.some(({href}) => href === "/videos/wardogs-full-match-334k")).toBe(false);
    expect(searchSiteIndex(index, "RVG")[0]?.href).toBe("/tools/loadout-budget");
  });
});
