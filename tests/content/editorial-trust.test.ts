import {existsSync, readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";
import sitemap from "../../src/app/sitemap";
import {loadGuideDocument} from "../../src/content/guides";
import {locales} from "../../src/config/site";
import {buildArticleJsonLd} from "../../src/lib/structured-data";
import {buildLocalizedUrl} from "../../src/lib/metadata";

describe("editorial trust signals", () => {
  it("publishes a localized editorial policy and byline copy", () => {
    expect(existsSync(path.join(process.cwd(), "src", "app", "[locale]", "editorial-policy", "page.tsx"))).toBe(true);

    for (const locale of locales) {
      const messages = JSON.parse(readFileSync(path.join(process.cwd(), "messages", `${locale}.json`), "utf8"));
      expect(messages.article.byline, locale).toBeTruthy();
      expect(messages.article.editorialPolicy, locale).toBeTruthy();
      expect(messages.editorial.methodTitle, locale).toBeTruthy();
      expect(messages.footer.editorialPolicy, locale).toBeTruthy();
      expect(sitemap().map((entry) => entry.url)).toContain(buildLocalizedUrl(locale, "/editorial-policy"));
    }
  });

  it("publishes localized about and contact routes", () => {
    expect(existsSync(path.join(process.cwd(), "src", "app", "[locale]", "about", "page.tsx"))).toBe(true);
    expect(existsSync(path.join(process.cwd(), "src", "app", "[locale]", "contact", "page.tsx"))).toBe(true);

    const urls = sitemap().map((entry) => entry.url);
    for (const locale of locales) {
      const messages = JSON.parse(readFileSync(path.join(process.cwd(), "messages", `${locale}.json`), "utf8"));
      expect(messages.footer.aboutLink, locale).toBeTruthy();
      expect(messages.footer.contact, locale).toBeTruthy();
      expect(messages.aboutPage.metaDescription, locale).toBeTruthy();
      expect(messages.contactPage.metaDescription, locale).toBeTruthy();
      expect(urls).toContain(buildLocalizedUrl(locale, "/about"));
      expect(urls).toContain(buildLocalizedUrl(locale, "/contact"));
    }
  });

  it("connects article authorship to the public editorial policy", async () => {
    const guide = await loadGuideDocument("en", "wardogs-gameplay");
    const article = buildArticleJsonLd("en", guide!).find((item) => item["@type"] === "Article");

    expect(article?.author).toEqual({
      "@type": "Organization",
      name: "WARDOGS Wiki Editorial Team",
      url: buildLocalizedUrl("en", "/editorial-policy")
    });
  });
});
