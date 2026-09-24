import {describe, expect, it} from "vitest";
import {getLegacyEnglishRedirectPath} from "../../src/i18n/legacy-paths";

describe("legacy unprefixed paths", () => {
  it("redirects historical guide and video URLs to the English locale", () => {
    expect(getLegacyEnglishRedirectPath("/guides/wardogs-factions")).toBe("/en/guides/wardogs-factions");
    expect(getLegacyEnglishRedirectPath("/guides/wardogs-trailer")).toBe("/en/guides/wardogs-trailer");
    expect(getLegacyEnglishRedirectPath("/guides/wardogs-early-access")).toBe("/en/guides/wardogs-early-access");
    expect(getLegacyEnglishRedirectPath("/videos/wardogs-mortars-indirect-fire")).toBe("/en/videos/wardogs-mortars-indirect-fire");
    expect(getLegacyEnglishRedirectPath("/items/weapons/ak74")).toBe("/en/items/weapons/ak74");
  });

  it("redirects known top-level pages but leaves unknown paths alone", () => {
    expect(getLegacyEnglishRedirectPath("/guides")).toBe("/en/guides");
    expect(getLegacyEnglishRedirectPath("/videos")).toBe("/en/videos");
    expect(getLegacyEnglishRedirectPath("/items")).toBe("/en/items");
    expect(getLegacyEnglishRedirectPath("/news")).toBe("/en/news");
    expect(getLegacyEnglishRedirectPath("/maps")).toBe("/en/maps");
    expect(getLegacyEnglishRedirectPath("/tools/ammo-matcher")).toBe("/en/tools/ammo-matcher");
    expect(getLegacyEnglishRedirectPath("/editorial-policy")).toBe("/en/editorial-policy");
    expect(getLegacyEnglishRedirectPath("/about")).toBe("/en/about");
    expect(getLegacyEnglishRedirectPath("/contact")).toBe("/en/contact");
    expect(getLegacyEnglishRedirectPath("/tools/not-a-tool")).toBeNull();
    expect(getLegacyEnglishRedirectPath("/maps/not-a-map")).toBeNull();
    expect(getLegacyEnglishRedirectPath("/not-a-page")).toBeNull();
    expect(getLegacyEnglishRedirectPath("/en/guides/wardogs-factions")).toBeNull();
  });

  it("collapses duplicate locale prefixes from historical URLs", () => {
    expect(getLegacyEnglishRedirectPath("/en/en/guides/wardogs-alpha")).toBe("/en/guides/wardogs-alpha");
    expect(getLegacyEnglishRedirectPath("/ja/ja/guides/wardogs-beginner-guide")).toBe("/ja/guides/wardogs-beginner-guide");
    expect(getLegacyEnglishRedirectPath("/pt-br/pt-br/videos")).toBe("/pt-br/videos");
    expect(getLegacyEnglishRedirectPath("/en/ja/videos")).toBeNull();
  });

  it("removes the obsolete deployment prefix while preserving locale and route", () => {
    expect(getLegacyEnglishRedirectPath("/wardogs/en")).toBe("/en");
    expect(getLegacyEnglishRedirectPath("/wardogs/zh-cn/items/weapons")).toBe("/zh-cn/items/weapons");
    expect(getLegacyEnglishRedirectPath("/wardogs/not-a-locale")).toBeNull();
  });
});
