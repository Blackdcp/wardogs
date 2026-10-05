import {readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const;

function loadMessages(locale: (typeof locales)[number]) {
  return JSON.parse(readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf8")) as Record<string, unknown>;
}

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key));
}

describe("localized messages", () => {
  it("states calculator input provenance and unverified current economy in every Tools hub", () => {
    const boundaries = {
      en: [/build/i, /inputs/i, /balance/i, /prices/i, /unlocks/i, /do not prove/i],
      ru: [/сбор/i, /ввод|введ/i, /баланс/i, /цен/i, /разблок/i, /не подтверж/i],
      de: [/Build/, /Eingaben/, /Balance/, /Preise/, /Freischaltungen/, /belegen keine/],
      "pt-br": [/versão/, /entradas/, /balanceamento/, /preços/, /desbloqueios/, /não comprovam/],
      ja: [/ビルド/, /入力/, /バランス/, /価格/, /解放/, /保証しません/],
      "zh-cn": [/版本/, /输入/, /平衡/, /价格/, /解锁/, /不能证明/],
      "zh-tw": [/版本/, /輸入/, /平衡/, /價格/, /解鎖/, /不能證明/],
      pl: [/wersji/, /wprowadzone/, /balansu/, /cen/, /odblokowania/, /nie potwierdzają/i],
    } as const;
    for (const locale of locales) {
      const messages = loadMessages(locale) as {toolsHub: {evidenceDescription: string}};
      for (const boundary of boundaries[locale]) expect(messages.toolsHub.evidenceDescription, locale).toMatch(boundary);
    }
  });
  it("provides source-bounded artillery task answers and steps in all eight locales", () => {
    for (const locale of locales) {
      const messages = loadMessages(locale) as {guides: {tasks?: {artillery?: {title: string; directAnswer: string; caution: string; steps: Record<string, string>}}}};
      const task = messages.guides.tasks?.artillery;
      expect(task, locale).toBeDefined();
      if (!task) continue;
      for (const value of [task.title, task.directAnswer, task.caution, ...Object.values(task.steps)]) expect(value.trim().length, locale).toBeGreaterThan(10);
      expect(Object.keys(task.steps), locale).toEqual(["one", "two", "three", "four", "five"]);
    }
  });
  it("provides the six-section homepage copy and bounded evidence states without English fallback", () => {
    const keys = [
      ...["command", "proven-demand", "live-intel", "workbench", "database", "library"].flatMap((id) => [`home.discovery.sections.${id}.title`, `home.discovery.sections.${id}.description`]),
      ...["openGuide", "allTools", "allGuides", "collections", "videos", "news", "about", "catalogue", "serverStatus", "patchNotes"].map((id) => `home.discovery.actions.${id}`),
      ...["earlyAccess", "current", "archive", "unknownBuild", "verifiedAt", "noVerifiedChanges"].map((id) => `home.discovery.states.${id}`),
      ...["official", "live-client", "creator-current", "community-report"].map((id) => `home.discovery.states.sources.${id}`),
      ...["search", "map", "calculator", "weapons", "vehicles", "status", "catalogue", "guides", "tools", "videos", "news", "cargo", "squad", "towers", "progression", "mortar", "fob", "controls", "helicopter", "settings", "pcFixes", "season2", "patchNotes", "money", "firstMatch", "loadout", "logistics", "systemCheck", "faq", "about"].map((id) => `home.discovery.tasks.${id}`),
      ...["failed", "retry", "guidesFallback"].map((id) => `home.search.${id}`),
    ];
    const read = (locale: typeof locales[number], key: string) => key.split(".").reduce<unknown>((value, part) => value && typeof value === "object" ? (value as Record<string, unknown>)[part] : undefined, loadMessages(locale));
    for (const locale of locales) for (const key of keys) {
      const value = read(locale, key) as string | undefined;
      expect(value, `${locale}/${key}`).toBeTypeOf("string");
      expect(value?.trim().length, `${locale}/${key}`).toBeGreaterThan(0);
      if (locale !== "en") expect(value, `${locale}/${key}`).not.toBe(read("en", key));
    }
  });
  it("provides translated task routes and Tools hub copy in every locale", () => {
    const keys = ["nav.toolsHome", ...["title", "description", "metaTitle", "metaDescription", "openTool", "relatedGuides", "evidenceTitle", "evidenceDescription"].map((key) => `toolsHub.${key}`), ...["combat", "economy", "logistics", "progression", "fixes"].map((key) => `toolsHub.groups.${key}`), ...["map", "artillery-calculator", "weapon-compare", "ammo-matcher", "loadout-budget", "cash-xp-calculator", "logistics-planner", "progression-route", "system-check"].map((key) => `toolsHub.tools.${key}.description`), "guides.routes.title", "guides.routes.relatedTools", ...["new-player", "combat-operations", "logistics-live"].flatMap((key) => [`guides.routes.${key}.title`, `guides.routes.${key}.description`])];
    const read = (locale: typeof locales[number], key: string) => key.split(".").reduce<unknown>((value, part) => value && typeof value === "object" ? (value as Record<string, unknown>)[part] : undefined, loadMessages(locale));
    for (const locale of locales) for (const key of keys) {
      const value = read(locale, key) as string | undefined;
      expect(value, `${locale}/${key}`).toBeTypeOf("string");
      expect(value?.trim().length, `${locale}/${key}`).toBeGreaterThan(0);
      if (locale !== "en") expect(value, `${locale}/${key}`).not.toBe(read("en", key));
    }
  });
  it("dates the current official-patch check in every homepage locale", () => {
    for (const locale of locales) {
      const messages = loadMessages(locale) as {liveOps?: {windowValue?: string}};
      expect(messages.liveOps?.windowValue, locale).toMatch(/26/);
      expect(JSON.stringify(messages.liveOps), locale).not.toMatch(/unlock time is not confirmed|解锁时刻|解禁時刻|Freischaltzeit|время открытия раннего доступа|horário exato de liberação/i);
    }
  });

  it("keeps active full-site dictionaries structurally identical to English", () => {
    const englishPaths = leafPaths(loadMessages("en")).sort();

    for (const locale of locales.slice(1)) {
      // Retained legacy pilot copy is not part of the active full-site shell.
      expect(leafPaths(loadMessages(locale)).filter((key) => !key.startsWith("pilot.")).sort(), locale).toEqual(englishPaths);
    }
  });

  it("does not leave high-visibility English UI copy in localized dictionaries", () => {
    const expected = {
      ru: {
        "nav.infantryMode": "Пехотный режим",
        "home.about.officialQuote": "Каждый игрок начинает свой путь с $10,000.",
        "home.buildChanges.entries.artilleryTank.title": "Артиллерийский танк",
      },
      de: {
        "nav.infantryMode": "Infanteriemodus",
        "home.about.officialQuote": "Jeder Spieler beginnt seine Laufbahn mit $10,000.",
        "home.buildChanges.entries.artilleryTank.title": "Artilleriepanzer",
        "guides.title": "WARDOGS-Leitfäden",
      },
      "pt-br": {
        "nav.infantryMode": "Modo de Infantaria",
        "home.about.officialQuote": "Cada jogador começa sua jornada com $10,000.",
        "home.buildChanges.entries.artilleryTank.title": "Tanque de Artilharia",
      },
      ja: {
        "nav.infantryMode": "歩兵モード",
        "home.about.officialQuote": "すべてのプレイヤーは$10,000から旅を始めます。",
        "home.buildChanges.entries.artilleryTank.title": "砲兵戦車",
      },
      "zh-cn": {
        "home.about.officialQuote": "每名玩家都会以 10,000 美元开始自己的旅程。",
      },
      "zh-tw": {
        "home.about.officialQuote": "每名玩家都會以 10,000 美元開始自己的旅程。",
      },
      pl: {
        "nav.infantryMode": "Tryb piechoty",
        "home.buildChanges.entries.artilleryTank.title": "Czołg artyleryjski",
      },
    } as const;

    function readPath(messages: Record<string, unknown>, path: string) {
      return path.split(".").reduce<unknown>((value, part) => (
        value && typeof value === "object" ? (value as Record<string, unknown>)[part] : undefined
      ), messages);
    }

    for (const [locale, checks] of Object.entries(expected)) {
      const messages = loadMessages(locale as (typeof locales)[number]);
      for (const [path, value] of Object.entries(checks)) {
        expect(readPath(messages, path), `${locale} ${path}`).toBe(value);
        expect(readPath(messages, path), `${locale} ${path}`).not.toBe(readPath(loadMessages("en"), path));
      }
    }
  });

  it("keeps homepage SEO metadata within the requested limits", () => {
    for (const locale of locales) {
      const home = loadMessages(locale).home as {
        metaTitle: string;
        metaDescription: string;
        heroTitle: string;
      };
      const cjk = locale === "ja" || locale === "zh-cn" || locale === "zh-tw";
      expect(home.metaTitle.length, `${locale} title`).toBeLessThanOrEqual(60);
      expect(home.metaDescription.length, `${locale} description`).toBeGreaterThanOrEqual(cjk ? 60 : 140);
      expect(home.metaDescription.length, `${locale} description`).toBeLessThanOrEqual(cjk ? 110 : 160);
      expect(home.metaTitle, `${locale} site name`).toMatch(/^WARDOGS Wiki/);
      expect(home.metaTitle, `${locale} evergreen title`).not.toContain("Closed Beta");
      expect(home.heroTitle, `${locale} evergreen heading`).not.toContain("Closed Beta");
    }
  });

  it("provides descriptive guide-index titles for search engines", () => {
    for (const locale of locales) {
      const guides = loadMessages(locale).guides as {metaTitle?: unknown};

      expect(guides.metaTitle, `${locale} guide title`).toBeTypeOf("string");
      if (typeof guides.metaTitle !== "string") continue;
      expect(guides.metaTitle.length, `${locale} guide title`).toBeGreaterThanOrEqual(30);
      expect(guides.metaTitle.length, `${locale} guide title`).toBeLessThanOrEqual(60);
      expect(guides.metaTitle, `${locale} guide title`).toContain("WARDOGS");
    }
  });

  it("provides complete privacy and terms metadata in every locale", () => {
    for (const locale of locales) {
      for (const namespace of ["privacy", "terms"] as const) {
        const messages = loadMessages(locale)[namespace] as {metaTitle?: unknown; metaDescription?: unknown};

        expect(messages.metaTitle, `${locale} ${namespace} title`).toBeTypeOf("string");
        expect(messages.metaDescription, `${locale} ${namespace} description`).toBeTypeOf("string");
        if (typeof messages.metaTitle !== "string" || typeof messages.metaDescription !== "string") continue;
        const cjk = locale === "ja" || locale === "zh-cn" || locale === "zh-tw";
        expect(messages.metaTitle.length, `${locale} ${namespace} title`).toBeGreaterThanOrEqual(cjk ? 16 : 30);
        expect(messages.metaTitle.length, `${locale} ${namespace} title`).toBeLessThanOrEqual(60);
        expect(messages.metaDescription.length, `${locale} ${namespace} description`).toBeGreaterThanOrEqual(cjk ? 60 : 120);
        expect(messages.metaDescription.length, `${locale} ${namespace} description`).toBeLessThanOrEqual(cjk ? 110 : 160);
      }
    }
  });
});
