import {describe, expect, it} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {DiagnosticRecord} from "@/components/guides/diagnostic-record";
import {getDiagnosticRecordCopy, type DiagnosticRecordKind} from "@/features/guides/diagnostic-record-copy";
import {locales} from "@/config/site";
import {compileGuideBody, loadGuideDocument} from "@/content/guides";
import {mdxComponents} from "@/components/mdx/mdx-components";

const cases = [
  {kind: "performance", slug: "wardogs-best-settings", count: 12},
  {kind: "connection", slug: "wardogs-server-status", count: 9},
  {kind: "linux", slug: "wardogs-linux-proton", count: 10}
] as const satisfies readonly {kind: DiagnosticRecordKind; slug: string; count: number}[];

describe("problem-specific diagnostic records", () => {
  it.each(locales)("ships native, distinct SSR copy and working MDX registration for %s", async locale => {
    const templates = new Set<string>();
    for (const {kind, slug, count} of cases) {
      const copy = getDiagnosticRecordCopy(locale, kind);
      const lines = copy.text.split("\n");
      expect(lines).toHaveLength(count);
      expect(new Set(lines).size).toBe(count);
      expect(lines.every(line => line.endsWith(": ____"))).toBe(true);
      const html = renderToStaticMarkup(<DiagnosticRecord locale={locale} kind={kind} />);
      expect(html).toContain(copy.title);
      expect(html).toContain(copy.copy);
      expect(html).toContain('whitespace-pre-wrap');
      expect(html).not.toContain("<input");
      expect(html).not.toContain("<form");
      if (locale !== "en") expect(copy.text).not.toEqual(getDiagnosticRecordCopy("en", kind).text);
      templates.add(copy.text);
      const guide = (await loadGuideDocument(locale, slug))!;
      expect(guide.body.match(/<DiagnosticRecord /g)).toHaveLength(1);
      expect(guide.body).toContain(`<DiagnosticRecord locale="${locale}" kind="${kind}" />`);
      // Exercise the approved MDX component policy and compiler, not merely the source string.
      const compiled = await compileGuideBody(guide.body, mdxComponents);
      expect(compiled.content).toBeTruthy();
    }
    expect(templates.size).toBe(3);
  });
});
