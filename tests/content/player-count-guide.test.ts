import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;

describe("WARDOGS player-count guide", () => {
  it("separates official sales and peak milestones from live concurrent players", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-player-count");
      expect(guide, locale).toBeDefined();
      expect(guide?.frontmatter.order, locale).toBe(53);
      expect(guide?.body.length, locale).toBeGreaterThanOrEqual(1_200);
      expect(guide?.frontmatter.sources.some((source) => source.kind === "official" && source.url.includes("steamcommunity.com/app/1867240/announcements")), locale).toBe(true);
      expect(guide?.frontmatter.sources.some((source) => source.url.includes("partner.steamgames.com/doc/webapi/ISteamUserStats")), locale).toBe(true);
      expect(guide?.frontmatter.sources.some((source) => source.url.includes("steamdb.info/app/1867240/charts")), locale).toBe(true);
      expect(guide?.body, locale).not.toMatch(/(?:currently|right now|now playing|此刻在线|当前在线|現在の同時接続)\s*[:：]?\s*\d[\d,]*/i);
    }
  });
});
