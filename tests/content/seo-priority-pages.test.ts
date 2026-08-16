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
});
