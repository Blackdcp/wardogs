import {describe, expect, it} from "vitest";
import {getLegacyEnglishRedirectPath} from "../../src/i18n/legacy-paths";

describe("legacy unprefixed paths", () => {
  it("redirects historical guide and video URLs to the English locale", () => {
    expect(getLegacyEnglishRedirectPath("/guides/wardogs-factions")).toBe("/en/guides/wardogs-factions");
    expect(getLegacyEnglishRedirectPath("/guides/wardogs-trailer")).toBe("/en/guides/wardogs-trailer");
    expect(getLegacyEnglishRedirectPath("/guides/wardogs-early-access")).toBe("/en/guides/wardogs-early-access");
    expect(getLegacyEnglishRedirectPath("/videos/wardogs-mortars-indirect-fire")).toBe("/en/videos/wardogs-mortars-indirect-fire");
  });

  it("redirects known top-level pages but leaves unknown paths alone", () => {
    expect(getLegacyEnglishRedirectPath("/guides")).toBe("/en/guides");
    expect(getLegacyEnglishRedirectPath("/videos")).toBe("/en/videos");
    expect(getLegacyEnglishRedirectPath("/news")).toBe("/en/news");
    expect(getLegacyEnglishRedirectPath("/not-a-page")).toBeNull();
    expect(getLegacyEnglishRedirectPath("/en/guides/wardogs-factions")).toBeNull();
  });

  it("removes the obsolete deployment prefix while preserving locale and route", () => {
    expect(getLegacyEnglishRedirectPath("/wardogs/en")).toBe("/en");
    expect(getLegacyEnglishRedirectPath("/wardogs/zh-cn/items/weapons")).toBe("/zh-cn/items/weapons");
    expect(getLegacyEnglishRedirectPath("/wardogs/not-a-locale")).toBeNull();
  });
});
