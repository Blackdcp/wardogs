import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;

const localizedQueries = {
  en: {
    earlyAccess: "Is WARDOGS in Early Access?",
    playtest: "What is the current WARDOGS Playtest window?",
    release: "When does WARDOGS release?",
    beta: "Is WARDOGS Closed Beta 02 live?",
    gameplay: "How do you play WARDOGS?",
    discord: "What is the official WARDOGS Discord?",
    drops: "Are WARDOGS Twitch Drops active in Beta 02?",
    crash: "How do you fix WARDOGS crashes and freezes?"
  },
  de: {
    earlyAccess: "Ist WARDOGS im Early Access?",
    playtest: "Wann läuft der aktuelle WARDOGS-Playtest?",
    release: "Wann erscheint WARDOGS?",
    beta: "Läuft WARDOGS Closed Beta 02 jetzt?",
    gameplay: "Wie spielt man WARDOGS?",
    discord: "Welcher WARDOGS-Discord ist offiziell?",
    drops: "Sind WARDOGS Twitch Drops in Beta 02 aktiv?",
    crash: "Wie behebt man Abstürze und Einfrieren in WARDOGS?"
  },
  ru: {
    earlyAccess: "WARDOGS уже в раннем доступе?",
    playtest: "Когда идет текущий WARDOGS Playtest?",
    release: "Когда выйдет WARDOGS?",
    beta: "Идет ли сейчас WARDOGS Closed Beta 02?",
    gameplay: "Как играть в WARDOGS?",
    discord: "Какой Discord WARDOGS является официальным?",
    drops: "Активны ли WARDOGS Twitch Drops в Beta 02?",
    crash: "Как исправить вылеты и зависания WARDOGS?"
  },
  "pt-br": {
    earlyAccess: "WARDOGS já está em Acesso Antecipado?",
    playtest: "Qual é a janela atual do WARDOGS Playtest?",
    release: "Quando WARDOGS será lançado?",
    beta: "O Closed Beta 02 de WARDOGS está ativo?",
    gameplay: "Como jogar WARDOGS?",
    discord: "Qual é o Discord oficial de WARDOGS?",
    drops: "Os Twitch Drops de WARDOGS estão ativos no Beta 02?",
    crash: "Como corrigir travamentos e congelamentos em WARDOGS?"
  },
  ja: {
    earlyAccess: "WARDOGSはEarly Access中？",
    playtest: "現在のWARDOGS Playtest期間は？",
    release: "WARDOGSの発売日はいつ？",
    beta: "WARDOGS Closed Beta 02は開催中ですか？",
    gameplay: "WARDOGSの遊び方は？",
    discord: "WARDOGSの公式Discordはどれ？",
    drops: "Beta 02でWARDOGS Twitch Dropsは開催中ですか？",
    crash: "WARDOGSのクラッシュやフリーズを直すには？"
  },
  "zh-cn": {
    earlyAccess: "WARDOGS 已经进入抢先体验了吗？",
    playtest: "当前 WARDOGS Playtest 时间是什么？",
    release: "WARDOGS 什么时候发布？",
    beta: "WARDOGS Closed Beta 02 现在开放吗？",
    gameplay: "WARDOGS 怎么玩？",
    discord: "哪个是 WARDOGS 官方 Discord？",
    drops: "Beta 02 正在开放 WARDOGS Twitch Drops 吗？",
    crash: "如何修复 WARDOGS 崩溃和卡死？"
  }
} as const;

const queryPages = {
  earlyAccess: "wardogs-early-access",
  playtest: "wardogs-playtest",
  release: "wardogs-release-date",
  beta: "wardogs-beta",
  gameplay: "wardogs-gameplay",
  discord: "wardogs-discord",
  drops: "wardogs-twitch-drops",
  crash: "wardogs-crash-fix"
} as const;

describe("AI citation query coverage", () => {
  it("puts a current, source-backed Early Access status snapshot in every locale", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-early-access");
      const searchable = `${guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${guide?.body}`;
      const expectedDate = locale === "en" || locale === "zh-cn" ? "2026-09-01" : "2026-08-24";

      expect(guide?.frontmatter.updatedAt, locale).toBe(expectedDate);
      expect(searchable, `${locale} date`).toContain(locale === "zh-cn" ? "2026年9月10日" : "September 10, 2026");
      expect(searchable, `${locale} platform`).toMatch(locale === "zh-cn" ? /Windows\s*PC|WindowsPC|Windows 电脑/i : /Windows PC/i);
      expect(searchable, `${locale} store`).toContain("Steam");
      expect(searchable, `${locale} verification date`).toContain(expectedDate);
      expect(searchable, `${locale} table`).toMatch(/\|[^\n]+\|[^\n]+\|/);
    }
  });

  it("uses player-language questions to give each ranking page one clear intent", async () => {
    for (const locale of locales) {
      for (const [intent, slug] of Object.entries(queryPages)) {
        const guide = await loadGuideDocument(locale, slug);
        const query = localizedQueries[locale][intent as keyof typeof localizedQueries.en];

        expect(["2026-08-24", "2026-08-25", "2026-08-26", "2026-08-28", "2026-09-01", "2026-09-04"], `${locale}/${slug}`).toContain(guide?.frontmatter.updatedAt);
        const searchable = `${guide?.body}\n${guide?.frontmatter.faq.map(({question}) => question).join("\n")}`;
        expect(searchable, `${locale}/${slug} missing ${query}`).toContain(query);
      }
    }
  });

  it("disambiguates BULKHEAD's FPS from the 2016 movie on home and gameplay pages", async () => {
    for (const locale of locales) {
      const messages = JSON.parse(await readFile(`messages/${locale}.json`, "utf8"));
      const gameplay = await loadGuideDocument(locale, "wardogs-gameplay");

      if (locale !== "zh-cn") {
        expect(messages.home.about.bodyOne, `${locale} home`).toContain("2016");
        expect(gameplay?.body, `${locale} gameplay`).toContain("2016");
      }
      expect(`${messages.home.about.bodyOne}\n${gameplay?.body}`, locale).toMatch(/BULKHEAD/i);
    }
  });
});
