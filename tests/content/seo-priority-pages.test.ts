import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

const englishTargets = [
  ["wardogs-discord", "WARDOGS Discord Invite"],
  ["wardogs-alpha-key", "WARDOGS key"],
  ["wardogs-ps5", "Is WARDOGS coming to PS5"],
  ["wardogs-beta", "Is the WARDOGS beta free"],
  ["wardogs-playtest", "playtest sign up"],
] as const;

const russianTargets = [
  "wardogs-playtest",
  "wardogs-beta",
  "wardogs-alpha-key",
  "wardogs-game-developers",
  "wardogs-factions",
] as const;

describe("SEO priority guide pages", () => {
  it("matches high-impression English queries in titles, descriptions, or FAQ copy", async () => {
    for (const [slug, phrase] of englishTargets) {
      const guide = await loadGuideDocument("en", slug);
      const searchableText = [
        guide?.frontmatter.title,
        guide?.frontmatter.description,
        guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join(" "),
        guide?.body,
      ].join("\n");

      expect(searchableText, `${slug} should target "${phrase}"`).toContain(phrase);
    }
  });

  it("uses readable Cyrillic on the Russian pages that are already gaining impressions", async () => {
    for (const slug of russianTargets) {
      const guide = await loadGuideDocument("ru", slug);
      const localizedText = `${guide?.frontmatter.title}\n${guide?.frontmatter.description}\n${guide?.body}`;

      expect(localizedText, `${slug} should contain readable Russian`).toMatch(/[А-Яа-яЁё]{4}/);
      expect(localizedText, `${slug} should not contain mojibake CJK text`).not.toMatch(/[\u4E00-\u9FFF]{4}/);
    }
  });

  it("keeps refreshed WARDOGS source-driven guide facts visible", async () => {
    const expectations = [
      ["wardogs-gameplay", "one-time starting cash"],
      ["wardogs-early-access", "37 weapons"],
      ["wardogs-price", "$59.99"],
      ["wardogs-first-look", "10 Reasons NOT to Buy"],
      ["wardogs-ps5", "controller support"],
    ] as const;

    for (const [slug, phrase] of expectations) {
      const guide = await loadGuideDocument("en", slug);
      const text = [
        guide?.frontmatter.title,
        guide?.frontmatter.description,
        guide?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join(" "),
        guide?.body,
      ].join("\n");

      expect(text, `${slug} should include "${phrase}"`).toContain(phrase);
    }
  });

  it("includes the latest first-look creator footage in existing guide pages", async () => {
    const firstLook = await loadGuideDocument("en", "wardogs-first-look");
    const gameplay = await loadGuideDocument("en", "wardogs-gameplay");
    const firstLookText = `${firstLook?.frontmatter.sources.map(({url}) => url).join("\n")}\n${firstLook?.body}`;
    const gameplayText = `${gameplay?.frontmatter.sources.map(({url}) => url).join("\n")}\n${gameplay?.body}`;

    expect(firstLookText).toContain("UKL0hwMRT9s");
    expect(firstLookText).toContain("Large Squad Alpha Impressions");
    expect(gameplayText).toContain("Emergent Squad Play");
  });
});
