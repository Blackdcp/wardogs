import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

const locales = ["en", "de", "ru", "pt-br", "ja"] as const;

const localizedQueries = {
  en: {
    earlyAccess: "Is WARDOGS in Early Access?",
    playtest: "When is the next WARDOGS playtest?",
    release: "When does WARDOGS release?",
    beta: "Is WARDOGS open beta or closed beta?",
    gameplay: "How do you play WARDOGS?",
    discord: "What is the official WARDOGS Discord?",
    drops: "How do WARDOGS Twitch Drops work?",
    crash: "How do you fix WARDOGS crashes and freezes?"
  },
  de: {
    earlyAccess: "Ist WARDOGS im Early Access?",
    playtest: "Wann ist der nächste WARDOGS-Playtest?",
    release: "Wann erscheint WARDOGS?",
    beta: "Ist WARDOGS in der Open Beta oder Closed Beta?",
    gameplay: "Wie spielt man WARDOGS?",
    discord: "Welcher WARDOGS-Discord ist offiziell?",
    drops: "Wie funktionieren WARDOGS Twitch Drops?",
    crash: "Wie behebt man Abstürze und Einfrieren in WARDOGS?"
  },
  ru: {
    earlyAccess: "WARDOGS уже в раннем доступе?",
    playtest: "Когда следующий плейтест WARDOGS?",
    release: "Когда выйдет WARDOGS?",
    beta: "WARDOGS находится в открытой или закрытой бете?",
    gameplay: "Как играть в WARDOGS?",
    discord: "Какой Discord WARDOGS является официальным?",
    drops: "Как работают Twitch Drops для WARDOGS?",
    crash: "Как исправить вылеты и зависания WARDOGS?"
  },
  "pt-br": {
    earlyAccess: "WARDOGS já está em Acesso Antecipado?",
    playtest: "Quando será o próximo playtest de WARDOGS?",
    release: "Quando WARDOGS será lançado?",
    beta: "WARDOGS está em beta aberto ou beta fechado?",
    gameplay: "Como jogar WARDOGS?",
    discord: "Qual é o Discord oficial de WARDOGS?",
    drops: "Como funcionam os Twitch Drops de WARDOGS?",
    crash: "Como corrigir travamentos e congelamentos em WARDOGS?"
  },
  ja: {
    earlyAccess: "WARDOGSはEarly Access中？",
    playtest: "次回のWARDOGSプレイテストはいつ？",
    release: "WARDOGSの発売日はいつ？",
    beta: "WARDOGSはオープンBeta、それともClosed Beta？",
    gameplay: "WARDOGSの遊び方は？",
    discord: "WARDOGSの公式Discordはどれ？",
    drops: "WARDOGSのTwitch Dropsはどう機能する？",
    crash: "WARDOGSのクラッシュやフリーズを直すには？"
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

      expect(guide?.frontmatter.updatedAt, locale).toBe("2026-08-24");
      expect(searchable, `${locale} date`).toContain("September 10, 2026");
      expect(searchable, `${locale} platform`).toContain("Windows PC");
      expect(searchable, `${locale} store`).toContain("Steam");
      expect(searchable, `${locale} verification date`).toContain("2026-08-24");
      expect(searchable, `${locale} table`).toMatch(/\|[^\n]+\|[^\n]+\|/);
    }
  });

  it("uses player-language questions to give each ranking page one clear intent", async () => {
    for (const locale of locales) {
      for (const [intent, slug] of Object.entries(queryPages)) {
        const guide = await loadGuideDocument(locale, slug);
        const query = localizedQueries[locale][intent as keyof typeof localizedQueries.en];

        expect(["2026-08-24", "2026-08-25", "2026-08-26", "2026-08-28"], `${locale}/${slug}`).toContain(guide?.frontmatter.updatedAt);
        expect(guide?.body, `${locale}/${slug} missing ${query}`).toContain(`## ${query}`);
      }
    }
  });

  it("disambiguates BULKHEAD's FPS from the 2016 movie on home and gameplay pages", async () => {
    for (const locale of locales) {
      const messages = JSON.parse(await readFile(`messages/${locale}.json`, "utf8"));
      const gameplay = await loadGuideDocument(locale, "wardogs-gameplay");

      expect(messages.home.about.bodyOne, `${locale} home`).toContain("2016");
      expect(gameplay?.body, `${locale} gameplay`).toContain("2016");
      expect(`${messages.home.about.bodyOne}\n${gameplay?.body}`, locale).toMatch(/BULKHEAD/i);
    }
  });
});
