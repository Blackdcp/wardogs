import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const team17GameUrl = "https://www.team17.com/games/wardogs";
const team17PressUrl = "https://www.team17.com/press-and-creator-hub";

describe("current WARDOGS platform availability", () => {
  it.each(locales)("attributes GeForce NOW availability to Team17 in %s", async (locale) => {
    const guide = await loadGuideDocument(locale, "wardogs-release-date");

    expect(guide?.body).toContain("GeForce NOW");
    expect(guide?.frontmatter.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({url: team17GameUrl, kind: "official"})
    ]));
  });

  it.each(locales)("keeps the Early Access console table aligned with Team17 in %s", async (locale) => {
    const guide = await loadGuideDocument(locale, "wardogs-early-access");

    expect(guide?.body).toMatch(/PlayStation 5|PS5/);
    expect(guide?.body).toContain("Xbox Series X|S");
    expect(guide?.frontmatter.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({url: team17PressUrl, kind: "official"})
    ]));
  });
});
