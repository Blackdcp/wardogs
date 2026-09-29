import {readFile, readdir} from "node:fs/promises";
import path from "node:path";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it, vi} from "vitest";
import {isLocale, isPilotLocale, isSiteLocale, locales, pilotLocales, siteLocales} from "@/config/site";
import {routing} from "@/i18n/routing";
import {getPilotSwitchPath, isPilotPathAvailable, pilotGuideSlugs} from "@/i18n/pilot-locales";
import {
  buildAvailableGuideAlternates, buildPilotGuideMetadata, getPilotGuideStaticParams,
  getPilotSitemapEntries, hasGuideTranslation, listPilotGuides, loadPilotGuide
} from "@/i18n/pilot-guides";
import {compilePilotGuideBody, PilotGuideArticle, PilotGuideIndex, PilotLocaleShell, pilotMessages} from "@/i18n/pilot-pages";

afterEach(() => vi.unstubAllEnvs());

describe("limited multilingual guide pilots", () => {
  it("does not widen the six full-site locales or generate full-site fallbacks", () => {
    expect(locales).toEqual(["en", "ru", "de", "pt-br", "ja", "zh-cn"]);
    expect(siteLocales).toEqual([...locales, "zh-tw", "pl"]);
    expect(isLocale("pl")).toBe(false);
    expect(isSiteLocale("pl")).toBe(true);
    expect(isPilotLocale("zh-tw")).toBe(true);
    expect(routing.locales).toEqual(siteLocales);
    expect(routing.alternateLinks).toBe(false);
  });

  it("defines exactly five real guides per pilot with no extra translations", async () => {
    expect(getPilotGuideStaticParams()).toHaveLength(10);
    for (const locale of pilotLocales) {
      const files = (await readdir(path.resolve("content", locale, "guides"))).filter((file) => file.endsWith(".mdx")).sort();
      expect(files).toEqual(pilotGuideSlugs[locale].map((slug) => `${slug}.mdx`).sort());
      const guides = await listPilotGuides(locale);
      expect(guides).toHaveLength(5);
      for (const guide of guides) {
        expect(guide.locale).toBe(locale);
        expect(guide.body.length).toBeGreaterThan(900);
        expect(guide.frontmatter.sources.some((source) => source.kind === "official")).toBe(true);
        expect(guide.frontmatter.updatedAt).toBe("2026-09-30");
        const english = await readFile(path.resolve("content/en/guides", `${guide.frontmatter.slug}.mdx`), "utf8");
        expect(english).not.toContain(guide.body);
      }
    }
  });

  it("never falls back to English for absent, unlisted, or traversing pilot slugs", async () => {
    expect(await loadPilotGuide("pl", "wardogs-controls")).toBeNull();
    expect(await loadPilotGuide("zh-tw", "wardogs-mortar-guide")).toBeNull();
    expect(await loadPilotGuide("pl", "../../en/guides/wardogs-money-guide")).toBeNull();
    expect(await loadPilotGuide("pl", "wardogs-money-guide", path.resolve("tests/fixtures"))).toBeNull();
    expect(hasGuideTranslation("pl", "wardogs-money-guide", path.resolve("tests/fixtures"))).toBe(false);
    expect(buildAvailableGuideAlternates("pl", "wardogs-controls")).toBeUndefined();
    expect(await buildPilotGuideMetadata("pl", "wardogs-controls")).toEqual({robots: {index: false, follow: false}});
  });

  it("links only genuine equivalents in both directions", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.wardogswiki.com");
    const money = buildAvailableGuideAlternates("pl", "wardogs-money-guide");
    expect(money?.canonical).toBe("https://www.wardogswiki.com/pl/guides/wardogs-money-guide");
    expect(Object.keys(money?.languages ?? {})).toHaveLength(9);
    expect(buildAvailableGuideAlternates("en", "wardogs-money-guide")?.languages).toEqual(money?.languages);
    const controls = buildAvailableGuideAlternates("zh-tw", "wardogs-controls");
    expect(controls?.languages).toHaveProperty("zh-TW");
    expect(controls?.languages).not.toHaveProperty("pl");
    const mortar = buildAvailableGuideAlternates("pl", "wardogs-mortar-guide");
    expect(mortar?.languages).toHaveProperty("pl");
    expect(mortar?.languages).not.toHaveProperty("zh-TW");
  });

  it("preserves base paths and export trailing slashes in canonical and sitemap URLs", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.wardogswiki.com");
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/preview");
    vi.stubEnv("GITHUB_PAGES", "true");
    const metadata = await buildPilotGuideMetadata("pl", "wardogs-money-guide");
    expect(metadata.alternates?.canonical).toBe("https://www.wardogswiki.com/preview/pl/guides/wardogs-money-guide/");
    expect(metadata.robots).toEqual({index: true, follow: true});
    const entries = await getPilotSitemapEntries();
    expect(entries).toHaveLength(12);
    expect(new Set(entries.map(({url}) => url)).size).toBe(12);
    expect(entries.every(({url}) => /\/preview\/(?:pl|zh-tw)\/guides(?:\/[^/]+)?\/$/.test(url))).toBe(true);
    expect(entries.some(({url}) => url.includes("/pl/guides/wardogs-controls"))).toBe(false);
    expect(entries.some(({url}) => /\/tools\//.test(url))).toBe(false);
  });

  it("switches unavailable topics to a real pilot index, not a pretend localized page", () => {
    expect(isPilotPathAvailable("pl", "/guides/wardogs-mortar-guide/")).toBe(true);
    expect(isPilotPathAvailable("pl", "/guides/wardogs-controls")).toBe(false);
    expect(isPilotPathAvailable("pl", "/tools/map")).toBe(false);
    expect(getPilotSwitchPath("pl", "/guides/wardogs-controls")).toBe("/guides");
    expect(getPilotSwitchPath("zh-tw", "/tools/map?x=2")).toBe("/guides");
    expect(getPilotSwitchPath("pl", "/guides/wardogs-money-guide?old=1")).toBe("/guides/wardogs-money-guide");
    expect(getPilotSwitchPath("en", "/tools/map?x=2")).toBe("/tools/map?x=2");
  });

  it("compiles every local article safely and keeps local internal links within the pilot inventory", async () => {
    for (const locale of pilotLocales) {
      for (const guide of await listPilotGuides(locale)) {
        const compiled = await compilePilotGuideBody(guide.body);
        expect(renderToStaticMarkup(compiled.content)).toContain("<h2>");
        const links = [...guide.body.matchAll(/\]\((\/[^)]+)\)/g)].map((match) => match[1]);
        for (const link of links) {
          if (link.startsWith("/en/")) continue;
          expect(link.startsWith(`/${locale}/`), link).toBe(true);
          expect(isPilotPathAvailable(locale, link.slice(locale.length + 1)), link).toBe(true);
        }
      }
    }
    await expect(compilePilotGuideBody("<script>alert(1)</script>")).rejects.toThrow();
  });

  it("renders pilot navigation, five articles, source attribution and honest review disclosure", async () => {
    for (const locale of pilotLocales) {
      const index = await PilotGuideIndex({locale});
      const html = renderToStaticMarkup(<PilotLocaleShell locale={locale}>{index}</PilotLocaleShell>);
      expect(html).toContain(pilotMessages[locale].pilot.title);
      expect(html).toContain(pilotMessages[locale].pilot.review);
      expect(html).toContain(pilotMessages[locale].pilot.independent);
      expect(html).toContain(pilotMessages[locale].common.fanMade);
      expect(html.match(/<article/g)).toHaveLength(5);
      expect(html).not.toMatch(/Patch 0\.11|liveOps|\/pl\/tools|\/zh-tw\/tools/);
      const article = renderToStaticMarkup(await PilotGuideArticle({locale, slug: "wardogs-money-guide"}));
      expect(article).toContain(pilotMessages[locale].pilot.sources);
      expect(article).toContain(pilotMessages[locale].common.fanMade);
      expect(article).toContain('type="application/ld+json"');
      expect(article).toContain(`/${locale}/guides/wardogs-fob-guide`);
      expect(article).toContain("https://store.steampowered.com/app/1867240/WARDOGS/");
    }
    await expect(PilotGuideArticle({locale: "pl", slug: "wardogs-controls"})).rejects.toThrow(/404/);
  });

  it("retains the full English policy navigation with localized labels and public base paths", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/preview");
    vi.stubEnv("GITHUB_PAGES", "true");
    for (const locale of pilotLocales) {
      const html = renderToStaticMarkup(<PilotLocaleShell locale={locale}><main /></PilotLocaleShell>);
      const footer = html.slice(html.indexOf("<footer"));
      for (const pathname of ["about", "contact", "editorial-policy", "privacy", "terms"]) {
        expect(footer).toContain(`href="/preview/en/${pathname}/"`);
        expect(footer).not.toContain(`/${locale}/${pathname}`);
        await expect(readFile(path.resolve("src/app/[locale]", pathname, "page.tsx"), "utf8")).resolves.toContain("export default");
      }
      expect(footer).toContain('hrefLang="en"');
      expect(footer).toContain(pilotMessages[locale].pilot.privacy);
      expect(footer).toContain(pilotMessages[locale].pilot.terms);
      expect(footer).toContain(pilotMessages[locale].pilot.independent);
    }
  });
});
