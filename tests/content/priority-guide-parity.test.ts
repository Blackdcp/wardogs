import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {locales} from "../../src/config/site";
import {compileLocalizedGuideBody, loadGuideDocument} from "../../src/content/guides";
import {mdxComponents} from "../../src/components/mdx/mdx-components";
import {guideManifest} from "../../src/content/manifest";
import {getGuideTaskData} from "../../src/features/guides/guide-task-data";
import {prepareGuideBodyForTaskPanel} from "../../src/features/guides/guide-task-body";
import {auditedGuideFamilies, priorityGuideFamilies, factBoundaries, gapStatuses} from "../fixtures/priority-guide-families";

const reportPath = "docs/research/traffic-protected-content-gap-2026-10-05.md";
const forbiddenHeadings = /^(?:Quick Answer|Confirmed Facts|What Players Search For|How to Use This Guide|FAQ|Sources and Last Checked|Related Guides)$/i;

describe("priority guide family audit", () => {
  it("records 24 existing families and the infantry hub with eight protected paths", () => {
    expect(priorityGuideFamilies).toHaveLength(24);
    expect(new Set(auditedGuideFamilies.map(({slug}) => slug)).size).toBe(25);
    for (const family of auditedGuideFamilies) {
      expect(guideManifest.some(({slug}) => slug === family.slug), family.slug).toBe(true);
      expect(Object.keys(family.localePaths)).toEqual([...locales]);
      expect(family.requiredAnswers.length).toBeGreaterThanOrEqual(2);
      expect(family.relatedPaths.length).toBeGreaterThan(0);
      expect(family.evidenceFields).toEqual(["url", "checkedAt", "kind", "build", "scope", "limitations"]);
    }
    expect(Object.keys(factBoundaries)).toHaveLength(9);
  });

  it("publishes an evidence-bounded gap ledger rather than treating the completed library as empty", () => {
    expect(existsSync(reportPath), "current gap report").toBe(true);
    if (!existsSync(reportPath)) return;
    const report = readFileSync(reportPath, "utf8");
    for (const family of auditedGuideFamilies) for (const locale of locales) {
      expect(report, `${locale}/${family.slug} audit row`).toContain(`| ${locale} | ${family.slug} |`);
    }
    for (const status of gapStatuses) expect(report).toContain(status);
    expect(report).toContain("2026-10-05");
    expect(report).toContain("unavailable");
    const competitorPath = "docs/research/competitive-content-scan-2026-10-05.md";
    expect(existsSync(competitorPath), "competitive source ledger").toBe(true);
  });

  it("retains localized direct answers, evidence and visible workflow after summary removal", async () => {
    for (const family of auditedGuideFamilies) for (const locale of locales) {
      const guide = await loadGuideDocument(locale, family.slug);
      expect(guide, `${locale}/${family.slug}`).not.toBeNull();
      if (!guide) continue;
      const task = getGuideTaskData(family.slug, locale);
      const visibleBody = prepareGuideBodyForTaskPanel(guide.body, locale, Boolean(task));
      const firstParagraph = guide.body.split(/\n\s*\n/).find((part) => !part.startsWith("#") && !part.startsWith("<"));
      expect((task?.directAnswer ?? firstParagraph)?.length, `${locale}/${family.slug} direct answer`).toBeGreaterThan(30);
      expect(visibleBody.length, `${locale}/${family.slug} retained workflow`).toBeGreaterThan(500);
      expect(guide.frontmatter.sources.every(({url, kind, checkedAt}) => url.startsWith("https://") && kind && /^2026-/.test(checkedAt))).toBe(true);
      expect(guide.frontmatter.faq.every(({question, answer}) => question.trim() && answer.trim())).toBe(true);
      if (locale !== "en") for (const heading of [...guide.body.matchAll(/^#{1,3}\s+(.+)$/gm)].map((match) => match[1])) expect(heading, `${locale}/${family.slug}`).not.toMatch(forbiddenHeadings);
      for (const match of guide.body.matchAll(/\]\((\/(?:en|ru|de|pt-br|ja|zh-cn|zh-tw|pl)\/guides\/([^?#)]+))[^)]*\)/g)) expect(guideManifest.some(({slug}) => slug === match[2]), `${family.slug} link ${match[1]}`).toBe(true);
      for (const match of guide.body.matchAll(/\]\(\/(?:en|ru|de|pt-br|ja|zh-cn|zh-tw|pl)\/tools\/([^?#)]+)[^)]*\)/g)) expect(existsSync(join("src/app/[locale]/tools", match[1], "page.tsx")), `${family.slug} tool ${match[1]}`).toBe(true);
    }
  });

  it.each(["operations", "progression", "player-task"] as const)("closes audited %s continuation gaps in the visible output", async (group) => {
    for (const family of auditedGuideFamilies.filter((entry) => entry.group === group)) for (const locale of locales) {
      const guide = (await loadGuideDocument(locale, family.slug))!;
      const task = getGuideTaskData(family.slug, locale);
      const visible = prepareGuideBodyForTaskPanel(guide.body, locale, Boolean(task));
      for (const path of family.relatedPaths) {
        expect(visible.includes(`/${locale}${path}`) || task?.relatedTool?.href === path, `${locale}/${family.slug} continuation ${path}`).toBe(true);
      }
      if (["wardogs-known-issues", "wardogs-community-servers-guide", "wardogs-achievements", "wardogs-squad-guide", "wardogs-towers-guide", "wardogs-helicopter-guide"].includes(family.slug)) {
        const {content} = await compileLocalizedGuideBody(visible, mdxComponents, locale);
        const html = renderToStaticMarkup(content);
        for (const path of family.relatedPaths) expect(html, `${locale}/${family.slug} rendered CTA`).toContain(`href="/${locale}${path}"`);
      }
    }
  });
});
