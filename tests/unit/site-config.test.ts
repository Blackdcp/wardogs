import {describe, expect, it} from "vitest";
import {officialLinks, siteConfig} from "../../src/config/site";

describe("siteConfig", () => {
  it("locks the approved locales, theme, and official identity", () => {
    expect(siteConfig.locales).toEqual(["en", "ru", "de", "pt-br", "ja", "zh-cn"]);
    expect(siteConfig.defaultLocale).toBe("en");
    expect(siteConfig.gameName).toBe("WARDOGS");
    expect(siteConfig.steamAppId).toBe("1867240");
    expect(siteConfig.theme.background).toBe("#0d0f0e");
    expect(officialLinks.steam).toMatch(/^https:\/\/store\.steampowered\.com\//);
  });
});
