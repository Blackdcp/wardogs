import {readFile, readdir} from "node:fs/promises";
import path from "node:path";
import {afterEach, describe, expect, it, vi} from "vitest";
import {isLocale, isPilotLocale, locales, pilotLocales, siteLocales} from "@/config/site";
import {guideManifest} from "@/content/manifest";
import {loadGuideDocument} from "@/content/guides";
import {routing} from "@/i18n/routing";
import {getPilotSwitchPath} from "@/i18n/pilot-locales";
import {buildAvailableGuideAlternates, hasGuideTranslation} from "@/i18n/pilot-guides";
import {buildAlternates} from "@/lib/metadata";
import {toTraditional} from "@/i18n/traditional";

afterEach(() => vi.unstubAllEnvs());

describe("Traditional Chinese and Polish full-site localization", () => {
  it("uses the same full-site routing inventory for all eight languages", () => {
    expect(locales).toEqual(["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"]);
    expect(siteLocales).toEqual(locales);
    expect(pilotLocales).toEqual([]);
    expect(isLocale("pl")).toBe(true);
    expect(isLocale("zh-tw")).toBe(true);
    expect(isPilotLocale("zh-tw")).toBe(false);
    expect(routing.locales).toEqual(locales);
  });

  it.each(["zh-tw", "pl"] as const)("provides the complete guide inventory and genuine content in %s", async (locale) => {
    const files = (await readdir(path.resolve("content", locale, "guides"))).filter((file) => file.endsWith(".mdx")).sort();
    expect(files).toEqual(guideManifest.map(({slug}) => `${slug}.mdx`).sort());
    for (const {slug} of guideManifest) {
      const guide = await loadGuideDocument(locale, slug);
      const english = await loadGuideDocument("en", slug);
      expect(guide, slug).not.toBeNull();
      expect(guide!.body, slug).not.toBe(english!.body);
      expect(guide!.body.length, slug).toBeGreaterThan(900);
      expect(guide!.frontmatter.title, slug).not.toBe(english!.frontmatter.title);
    }
  });

  it.each(["zh-tw", "pl"] as const)("provides every UI dictionary key in %s", async (locale) => {
    const reference = JSON.parse(await readFile("messages/en.json", "utf8"));
    const actual = JSON.parse(await readFile(`messages/${locale}.json`, "utf8"));
    const check = (expected: unknown, found: unknown, key: string) => {
      if (typeof expected === "string") {
        expect(typeof found, key).toBe("string");
        expect((found as string).trim().length, key).toBeGreaterThan(0);
      } else if (Array.isArray(expected)) {
        expect(Array.isArray(found), key).toBe(true);
        expect((found as unknown[]).length, key).toBe(expected.length);
        expected.forEach((item, i) => check(item, (found as unknown[])[i], `${key}.${i}`));
      } else if (expected && typeof expected === "object") {
        for (const [child, value] of Object.entries(expected)) {
          check(value, (found as Record<string, unknown> | undefined)?.[child], `${key}.${child}`);
        }
      }
    };
    check(reference, actual, locale);
  });

  it("keeps equivalent paths, query and share state when switching languages", () => {
    expect(getPilotSwitchPath("pl", "/guides/wardogs-controls")).toBe("/guides/wardogs-controls");
    expect(getPilotSwitchPath("zh-tw", "/tools/map?x=2#map=abc")).toBe("/tools/map?x=2#map=abc");
    expect(getPilotSwitchPath("pl", "/items/weapons")).toBe("/items/weapons");
  });

  it("uses self-canonical URLs and reciprocal languages without changing the English URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.wardogswiki.com");
    for (const pathname of ["/", "/guides", "/tools/map", "/items", "/news"]) {
      const en = buildAlternates("en", pathname);
      const pl = buildAlternates("pl", pathname);
      expect(en.languages).toEqual(pl.languages);
      expect(pl.languages).toHaveProperty("zh-TW");
      expect(pl.languages).toHaveProperty("pl");
      expect(en.canonical).toBe(`https://www.wardogswiki.com/en${pathname === "/" ? "" : pathname}`);
    }
    const controls = buildAvailableGuideAlternates("pl", "wardogs-controls");
    expect(controls?.canonical).toBe("https://www.wardogswiki.com/pl/guides/wardogs-controls");
    expect(Object.keys(controls?.languages ?? {})).toHaveLength(9);
    expect(buildAvailableGuideAlternates("zh-tw", "wardogs-controls")?.languages).toEqual(controls?.languages);
    expect(hasGuideTranslation("pl", "../../en/guides/wardogs-money-guide")).toBe(false);
  });

  it("converts Traditional Chinese display values without changing URLs, keys or numbers", () => {
    const source = {"鼠标": "鼠标设置与视频", href: "https://example.com/游戏", price: 123, label: (n: number) => `${n} 个载具`};
    const translated = toTraditional(source);
    expect(Object.keys(translated)).toEqual(Object.keys(source));
    expect(translated["鼠标"]).not.toBe(source["鼠标"]);
    expect(translated.href).toBe(source.href);
    expect(translated.price).toBe(123);
    expect(translated.label(3)).toContain("載具");
    expect(toTraditional("装载、运输与卸载货物")).toBe("裝載、運輸與卸載貨物");
  });
});
