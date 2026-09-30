import {existsSync} from "node:fs";
import path from "node:path";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {mdxComponents} from "../../src/components/mdx/mdx-components";
import {compileLocalizedGuideBody, loadGuideDocument} from "../../src/content/guides";

const cases = [
  {locale: "en", advisory: /Editorial/, unknown: /unverified|still missing/},
  {locale: "ru", advisory: /Совет редакции/, unknown: /не проверены|пока нет/},
  {locale: "de", advisory: /Redaktioneller/, unknown: /ungeprüft|fehlen hier/},
  {locale: "pt-br", advisory: /editorial/, unknown: /sem verificação|Ainda faltam/},
  {locale: "ja", advisory: /編集部/, unknown: /未検証/},
  {locale: "zh-cn", advisory: /编辑排查建议/, unknown: /未实机验证|仍缺/},
  {locale: "zh-tw", advisory: /編輯排查建議/, unknown: /未實機驗證|仍缺/},
  {locale: "pl", advisory: /Wskazówka redakcyjna/, unknown: /niezweryfikowane|Nadal brakuje/}
] as const;

const families = [
  {
    slug: "wardogs-cargo-guide",
    source: "https://store.steampowered.com/app/1867240/WARDOGS/",
    links: ["guides/wardogs-fob-guide", "tools/logistics-planner", "guides/wardogs-known-issues"]
  },
  {
    slug: "wardogs-controls",
    source: "https://steamcommunity.com/app/1867240/announcements/",
    links: ["guides/wardogs-ammo-reload-guide", "tools/ammo-matcher", "guides/wardogs-known-issues"]
  }
] as const;

describe("concise logistics and zoom diagnostics in all eight locales", () => {
  for (const {locale, advisory, unknown} of cases) {
    it.each(families)(`${locale}: $slug keeps advice, evidence and relevant links together`, async ({slug, source, links}) => {
      const guide = await loadGuideDocument(locale, slug);
      expect(guide).not.toBeNull();
      expect(guide!.frontmatter.slug).toBe(slug);
      expect(guide!.frontmatter.updatedAt).toBe("2026-09-30");
      expect(guide!.frontmatter.sources.find(entry => entry.url === source)).toMatchObject({
        kind: "official",
        checkedAt: "2026-09-30"
      });

      const diagnostics = guide!.body.replace(/\r/g, "").split(/^### /m).slice(1)
        .map(section => section.split(/^## /m)[0])
        .filter(section => section.includes(source));
      expect(diagnostics).toHaveLength(1);
      const diagnostic = diagnostics[0];
      expect(diagnostic).toMatch(advisory);
      expect(diagnostic).toMatch(unknown);
      expect(diagnostic).not.toMatch(/^\|/m);
      expect(diagnostic).not.toMatch(/\*\*[A-Z]\*\*|\$\d/);

      for (const link of links) {
        expect(diagnostic).toContain(`](/${locale}/${link})`);
        const destination = link.startsWith("guides/")
          ? path.resolve("content", locale, `${link}.mdx`)
          : path.resolve("src/app/[locale]", link, "page.tsx");
        expect(existsSync(destination), destination).toBe(true);
      }
      const internalLinks = [...diagnostic.matchAll(/\]\((\/[^)]+)\)/g)].map(match => match[1]);
      expect(internalLinks).toHaveLength(3);
      expect(internalLinks.every(href => href.startsWith(`/${locale}/`))).toBe(true);

      const prose = diagnostic.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[#*]/g, "").trim();
      if (["ja", "zh-cn", "zh-tw"].includes(locale)) {
        expect(prose.length).toBeGreaterThan(250);
        expect(prose.length).toBeLessThan(650);
      } else {
        const words = prose.split(/\s+/).length;
        expect(words).toBeGreaterThanOrEqual(100);
        expect(words).toBeLessThanOrEqual(180);
      }

      const compiled = await compileLocalizedGuideBody(guide!.body, mdxComponents, locale);
      const html = renderToStaticMarkup(compiled.content);
      for (const link of links) expect(html).toContain(`/${locale}/${link}`);
    });
  }
});
