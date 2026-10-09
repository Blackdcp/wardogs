import {access} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {compileLocalizedGuideBody, loadGuideDocument} from "../../src/content/guides";
import {mdxComponents} from "../../src/components/mdx/mdx-components";
import {renderToStaticMarkup} from "react-dom/server";
import {getDiagnosticRecordCopy} from "../../src/features/guides/diagnostic-record-copy";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const;
const support = "https://discord.com/channels/1464219389913071646/1547284329854410883/1547285934578466846";
const safety = "https://www.wardogs.com/safety";
const droneDiscussion = "https://discord.com/channels/1464219389913071646/1551954554579451924/threads/1554980728284909688";
const fobVideo = "https://www.youtube.com/watch?v=z7wMLQQtIIM";

// New search destinations must carry full native-language articles, real task routes,
// and evidence scope rather than falling back to the English body or a title-only page.
describe.each(locales)("October player workflows in %s", locale => {
  it("publishes both new task guides with valid MDX and reachable local links", async () => {
    for (const slug of ["wardogs-solo-guide", "wardogs-report-player"]) {
      const guide = await loadGuideDocument(locale, slug);
      expect(guide, slug).not.toBeNull();
      expect(guide!.body.length).toBeGreaterThan(1_600);
      expect(guide!.frontmatter.updatedAt).toBe("2026-10-09");
      expect(guide!.frontmatter.faq).toHaveLength(3);
      expect([...guide!.body.matchAll(/^## /gm)].length).toBeGreaterThanOrEqual(7);
      await expect(compileLocalizedGuideBody(guide!.body, mdxComponents, locale)).resolves.toHaveProperty("content");
      for (const [, href] of guide!.body.matchAll(/\]\((\/[^)#?\s]+)(?:[?#][^)]*)?\)/g)) {
        expect(href).toMatch(new RegExp(`^/${locale}/(?:guides|tools)/`));
        expect(href).not.toBe(`/${locale}/guides/${slug}`);
        const destination = href.startsWith(`/${locale}/guides/`)
          ? path.join("content", `${href.slice(1)}.mdx`)
          : path.join("src/app/[locale]", href.slice(locale.length + 2), "page.tsx");
        await expect(access(destination)).resolves.toBeUndefined();
      }
    }
  });

  it("routes official reports separately from community evidence and technical support", async () => {
    const report = await loadGuideDocument(locale, "wardogs-report-player");
    for (const url of [support, safety, "https://support.team17.com/en"]) {
      expect(report!.frontmatter.sources).toContainEqual(expect.objectContaining({url, kind: "official", checkedAt: "2026-10-09"}));
    }
    for (const marker of ["@WARDOGS Support bot", "appeal@bulkhead.com", "Discord"]) {
      expect(report!.body).toContain(marker);
    }
    expect(report!.frontmatter.sources.some(source => source.kind === "community")).toBe(true);
    for (const slug of ["wardogs-discord", "wardogs-crash-fix", "wardogs-known-issues"]) {
      const guide = await loadGuideDocument(locale, slug);
      expect(guide!.frontmatter.sources).toContainEqual(expect.objectContaining({url: support, kind: "official"}));
      expect(guide!.body).toContain("https://support.team17.com/en");
    }
  });

  it("attributes tactical demonstrations and preserves current tools for verification", async () => {
    for (const slug of ["wardogs-fob-guide", "wardogs-fob-layouts"]) {
      const guide = await loadGuideDocument(locale, slug);
      expect(guide!.frontmatter.sources).toContainEqual(expect.objectContaining({url: fobVideo, kind: "creator", checkedAt: "2026-10-09"}));
      expect(guide!.body).toContain("Talon");
      if (slug === "wardogs-fob-layouts") {
        expect(guide!.body).toContain("Hesco");
        for (const time of ["0:44–3:17", "3:37–4:59", "5:05–7:16", "7:27–9:57", "10:08–14:35", "16:18"]) {
          expect(guide!.body).toContain(time);
        }
      } else {
        // Construction detail lives in the dedicated layout article; the overview
        // must retain a working route to it instead of duplicating the whole build.
        expect(guide!.body).toContain(`/${locale}/guides/wardogs-fob-layouts`);
      }
    }
    const artillery = await loadGuideDocument(locale, "wardogs-artillery-guide");
    expect(artillery!.frontmatter.sources).toContainEqual(expect.objectContaining({url: droneDiscussion, kind: "community"}));
    for (const route of ["tools/map", "tools/artillery-calculator", "videos/wardogs-ir-rangefinder-hotfix"]) {
      expect(artillery!.body).toContain(`/${locale}/${route}`);
    }
    const settings = await loadGuideDocument(locale, "wardogs-best-settings");
    const compiledSettings = await compileLocalizedGuideBody(settings!.body, mdxComponents, locale);
    const renderedSettings = renderToStaticMarkup(compiledSettings.content);
    for (const marker of ["CPU", "GPU", "RAM"]) expect(renderedSettings).toContain(marker);
    expect(renderedSettings).toContain('data-diagnostic-record="performance"');
    expect(renderedSettings).toContain(getDiagnosticRecordCopy(locale, "performance").labels[2]);
  });

  it("compiles the complete operational guides and connects spending to the real target calculator", async () => {
    for (const slug of ["wardogs-money-guide", "wardogs-cargo-guide", "wardogs-fob-guide", "wardogs-fob-layouts", "wardogs-solo-guide", "wardogs-squad-guide", "wardogs-report-player", "wardogs-launch-checklist", "wardogs-what-to-buy-before-wipe"]) {
      const guide = await loadGuideDocument(locale, slug);
      await expect(compileLocalizedGuideBody(guide!.body, mdxComponents, locale)).resolves.toHaveProperty("content");
    }
    const spending = await loadGuideDocument(locale, "wardogs-what-to-buy-before-wipe");
    expect(spending!.body).toContain(`/${locale}/gold-market#gold-target-budget`);
    const money = await loadGuideDocument(locale, "wardogs-money-guide");
    expect(money!.frontmatter.sources).toContainEqual(expect.objectContaining({
      url: "https://www.youtube.com/watch?v=Qx1ndM1tc2Y", kind: "creator", checkedAt: "2026-10-09"
    }));
    for (const timestamp of ["Qx1ndM1tc2Y&t=85s", "Qx1ndM1tc2Y&t=3354s"]) expect(money!.body).toContain(timestamp);
  });
});
