import React from "react";
import {readFileSync, existsSync} from "node:fs";
import path from "node:path";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {locales} from "../../src/config/site";
import {VisualWorkflow} from "../../src/components/guides/visual-workflow";
import {getVisualWorkflow, getVisualWorkflowUi, visualWorkflowSlugs, visualWorkflowSourceAudit} from "../../src/features/guides/visual-workflows";

vi.mock("next-intl", () => ({useTranslations: () => (key: string) => key}));

describe("visual workflows", () => {
  it("covers only the four assigned existing guide URLs", () => {
    expect(visualWorkflowSlugs).toEqual(["wardogs-cargo-guide", "wardogs-fob-guide", "wardogs-medic-revive-guide", "wardogs-controls"]);
    expect(getVisualWorkflow("wardogs-mortar-guide", "en")).toBeNull();
    expect(getVisualWorkflow("__proto__", "en")).toBeNull();
    expect(renderToStaticMarkup(<VisualWorkflow slug="wardogs-release-date" locale="en" />)).toBe("");
  });

  for (const locale of locales) {
    it(`provides complete localized steps, context and limitations in ${locale}`, () => {
      const ui = getVisualWorkflowUi(locale);
      expect(Object.values(ui).every((value) => value.trim().length > 0)).toBe(true);
      if (locale !== "en") expect(ui.editorial).not.toBe(getVisualWorkflowUi("en").editorial);
      for (const slug of visualWorkflowSlugs) {
        const data = getVisualWorkflow(slug, locale)!;
        expect(data.steps).toHaveLength(4);
        expect(new Set(data.steps.map((step) => step.id)).size).toBe(4);
        expect(data.steps.map((step) => step.id)).toEqual(getVisualWorkflow(slug, "en")!.steps.map((step) => step.id));
        for (const step of data.steps) {
          for (const key of ["action", "observe", "success", "failure"] as const) {
            expect(step[key].trim().length, `${slug}/${key}`).toBeGreaterThan(2);
            if (locale !== "en") expect(step[key]).not.toBe(getVisualWorkflow(slug, "en")!.steps.find((entry) => entry.id === step.id)![key]);
          }
        }
        expect(data.missingFrames.length).toBeGreaterThan(25);
        expect(data.imageAlt.length).toBeGreaterThan(20);
        expect(data.imageCaption.length).toBeGreaterThan(20);
        expect(data.clientReproduced).toBe(false);
        expect(data.operationFrames).toBe("missing");
        expect(data.image.role).toBe("context-only");
        expect(data.image.captureBuild).toBeNull();
      }
    });

    it(`renders four ordered, labelled checks and honest image evidence in ${locale}`, () => {
      for (const slug of visualWorkflowSlugs) {
        const html = renderToStaticMarkup(<VisualWorkflow slug={slug} locale={locale} />);
        const ui = getVisualWorkflowUi(locale);
        expect(html).toContain(`data-visual-workflow="${slug}"`);
        expect(html).toContain('data-operation-frames="missing"');
        expect(html).toContain('data-workflow-image-role="context-only"');
        expect(html).toContain(`aria-labelledby="visual-workflow-${slug}-title"`);
        expect(html).toContain(`aria-describedby="visual-workflow-${slug}-missing"`);
        expect(html.match(/data-workflow-step=/g)).toHaveLength(4);
        expect(html.match(/data-workflow-observe=/g)).toHaveLength(4);
        expect(html.match(/data-workflow-success=/g)).toHaveLength(4);
        expect(html.match(/data-workflow-failure=/g)).toHaveLength(4);
        expect(html.match(/<img /g)).toHaveLength(1);
        expect(html).toContain('loading="lazy"');
        expect(html).toContain(ui.missing);
        expect(html).toContain(ui.buildUnknown);
        expect(html).not.toContain("<iframe");
        expect(html).toContain("i.ytimg.com");
        expect(html).toContain("data-workflow-video-evidence");
        expect(html).not.toContain("<kbd");
        expect(html).not.toContain("docs/research");
        expect(html).not.toContain("browser-use");
        for (const anchor of html.matchAll(/<a\b[^>]*>/g)) expect(anchor[0]).toMatch(/ title="[^"]+"/);
        const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
        expect(new Set(ids).size).toBe(ids.length);
      }
    });
  }

  it("reuses existing local bitmap assets and preserves historical source dates", () => {
    for (const slug of visualWorkflowSlugs) {
      const data = getVisualWorkflow(slug, "en")!;
      expect(data.image.src).toMatch(/^\/images\/.+\.webp$/);
      expect(existsSync(path.join(process.cwd(), "public", data.image.src))).toBe(true);
      expect(data.image.width).toBeGreaterThan(0);
      expect(data.image.height).toBeGreaterThan(0);
      for (const source of data.evidence) {
        expect(new URL(source.url).protocol).toBe("https:");
        expect(source.captureBuild).toBeNull();
        if (source.scope === "original-sample") {
          expect(new URL(source.url).searchParams.get("t")).toBe(`${source.sampledSeconds}s`);
          expect(source.reviewedAt).toBe("2026-09-30");
        } else {
          expect(source.sampledSeconds).toBeNull();
        }
      }
    }
    expect(getVisualWorkflow("wardogs-cargo-guide", "en")!.image.retrievedAt).toBe("2026-08-18");
    expect(getVisualWorkflow("wardogs-medic-revive-guide", "en")!.image.retrievedAt).toBe("2026-08-30");
    expect(getVisualWorkflow("wardogs-controls", "en")!.image.retrievedAt).toBe("2026-08-17");
  });

  it("keeps responsive tracks, uncropped context and no client-side dependency", () => {
    const source = readFileSync(path.join(process.cwd(), "src/components/guides/visual-workflow.tsx"), "utf8");
    expect(source).toContain("grid-cols-[32px_minmax(0,1fr)]");
    expect(source).toContain("[overflow-wrap:anywhere]");
    expect(source).toContain("lg:grid-cols-3");
    expect(source).toContain("object-contain");
    expect(source).toContain("unoptimized");
    expect(source).not.toContain("use client");
    expect(source).not.toContain("object-cover");
    expect(source).not.toContain("dangerouslySetInnerHTML");
  });

  it("retains the public-only scope and differentiates samples from full operation evidence", () => {
    expect(visualWorkflowSourceAudit.operationCaptureStatus).toBe("public-source-only");
    expect(visualWorkflowSourceAudit.newBitmapAssets).toBe(0);
    expect(visualWorkflowSourceAudit.reusedContextAssets).toBe(4);
    expect(visualWorkflowSourceAudit.attempts.map((entry) => entry.slug)).toEqual(visualWorkflowSlugs);
    expect(visualWorkflowSourceAudit.attempts.every((entry) => entry.persistedOperationFrames === 0)).toBe(true);
    const medic = getVisualWorkflow("wardogs-medic-revive-guide", "en")!;
    const candidate = medic.evidence.find((entry) => entry.scope === "original-candidate")!;
    expect(candidate.sampledSeconds).toBeNull();
    expect(candidate.reviewedAt).toBeNull();
    expect(renderToStaticMarkup(<VisualWorkflow slug={medic.slug} locale="en" />)).toContain("operation not visually verified");
  });
});
