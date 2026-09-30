import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {locales} from "../../src/config/site";
import {WorkflowVideoEvidence} from "../../src/components/guides/workflow-video-evidence";
import {OfficialVideo} from "../../src/components/mdx/official-video";
import {getWorkflowVideoEvidence, getWorkflowVideoEvidenceUi, videoSampleTime} from "../../src/features/guides/workflow-video-evidence";
import {visualWorkflowSlugs} from "../../src/features/guides/visual-workflows";

vi.mock("next-intl", () => ({useTranslations: () => (key: string) => key}));

describe("bounded original-video evidence", () => {
  it("has no fallback for unrelated or inherited object keys", () => {
    for (const slug of ["wardogs-map", "__proto__", "constructor"]) {
      expect(getWorkflowVideoEvidence(slug, "en")).toEqual([]);
      expect(renderToStaticMarkup(<WorkflowVideoEvidence slug={slug} locale="en" />)).toBe("");
    }
  });

  for (const locale of locales) {
    it(`preserves source dates, unknown builds and localized limits in ${locale}`, () => {
      const ui = getWorkflowVideoEvidenceUi(locale);
      expect(Object.values(ui).every((value) => value.trim())).toBe(true);
      for (const slug of visualWorkflowSlugs) {
        const entries = getWorkflowVideoEvidence(slug, locale);
        expect(entries.length).toBeGreaterThan(0);
        for (const entry of entries) {
          expect(entry.captureBuild).toBeNull();
          expect(entry.clientReproduced).toBe(false);
          expect(entry.publishedAt).not.toBe(entry.reviewedAt);
          expect(entry.reviewedAt).toBe("2026-09-30");
          expect(entry.endSeconds).toBeGreaterThan(entry.startSeconds);
          expect(entry.notes).toHaveLength(2);
          if (locale !== "en") expect(entry.title).not.toBe(getWorkflowVideoEvidence(slug, "en").find((source) => source.id === entry.id)!.title);
        }
        const html = renderToStaticMarkup(<WorkflowVideoEvidence slug={slug} locale={locale} />);
        expect(html).toContain(ui.limit);
        expect(html).not.toContain("<iframe");
        expect(html).not.toContain("docs/research");
        expect(html).not.toContain("browser-use");
        expect(html.match(/data-workflow-source=/g)).toHaveLength(entries.length);
        for (const entry of entries) {
          expect(html).toContain(`watch?v=${entry.id}&amp;t=${entry.startSeconds}s`);
          for (const second of entry.observedSeconds) expect(html).toContain(`watch?v=${entry.id}&amp;t=${second}s`);
        }
        for (const anchor of html.matchAll(/<a\b[^>]*>/g)) expect(anchor[0]).toMatch(/ title="[^"]+"/);
      }
    });
  }

  it("does not equate the tutorial or a receiving prompt with a matched stock receipt", () => {
    const cargo = getWorkflowVideoEvidence("wardogs-cargo-guide", "en")[0];
    expect(cargo.observedSeconds).toEqual([212]);
    expect(cargo.notes.join(" ")).toContain("before/after stock receipt");
    expect(getWorkflowVideoEvidence("wardogs-fob-guide", "en")[0].notes.join(" ")).toContain("tutorial");
    expect(getWorkflowVideoEvidence("wardogs-medic-revive-guide", "en")[0].notes.join(" ")).toContain("recruit discount");
    expect(getWorkflowVideoEvidence("wardogs-controls", "en")[0].notes.join(" ")).toContain("not verified default bindings");
  });

  it("keeps allowlisting, consent and safe timestamp normalization", () => {
    expect(renderToStaticMarkup(<OfficialVideo id="unreviewed" title="test" />)).toBe("");
    const normal = renderToStaticMarkup(<OfficialVideo id="XUyP1GLUF5o" title="test" startSeconds={212} endSeconds={245} />);
    expect(normal).toContain("&amp;t=212s");
    expect(normal).not.toContain("<iframe");
    for (const value of [-1, 1.5, Infinity, NaN, 86400]) {
      const html = renderToStaticMarkup(<OfficialVideo id="XUyP1GLUF5o" title="test" startSeconds={value} />);
      expect(html).not.toContain("&amp;t=");
    }
    expect(videoSampleTime(14)).toBe("00:14");
    expect(videoSampleTime(814)).toBe("13:34");
  });
});
