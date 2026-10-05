import {readFileSync} from "node:fs";
import path from "node:path";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";

describe("recent tool page design", () => {
  it("keeps the map page inside the site visual system", async () => {
    const pagePath = "../../src/app/[locale]/tools/map/page";
    const {default: Page} = await import(pagePath);
    const source = renderToStaticMarkup(await Page({params: Promise.resolve({locale: "en"})})).match(/<header[\s\S]*?<\/header>/)![0];

    expect(source).toContain('data-tool-page-hero="map"');
    expect(source).toContain('data-tool-crosslink="artillery"');
    expect(source).not.toContain("bg-sky-950");
    expect(source).not.toContain("text-sky-400");
    expect(source).not.toContain("shadow");
  });

  it("keeps the artillery calculator from drifting into a separate HUD skin", () => {
    const source = readFileSync(path.resolve("src/components/artillery/artillery-calculator.tsx"), "utf8");

    expect(source).toContain('data-tool-calculator-shell="artillery"');
    expect(source).toContain('data-fire-solution-panel="true"');
    expect(source).not.toContain("shadow-[0_0_30px");
    expect(source).not.toContain("border-2 border-[#3c634c]");
    expect(source).not.toContain("bg-gradient-to-r from-[#0d1611]");
  });
});

// Render pages against local translations. Routing is the only Next runtime double;
// calculator/map/form components remain real so duplicated H1s stay observable.

vi.mock("@/i18n/navigation", () => ({Link: ({children, ...props}: {children: React.ReactNode}) => React.createElement("a", props, children)}));
vi.mock("next/navigation", () => ({notFound: () => {throw new Error("404");}}));
vi.mock("next-intl/server", () => ({
  setRequestLocale: () => {},
  getTranslations: async ({locale = "en", namespace}: {locale?: string; namespace?: string} = {}) => {
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8"));
    return (key: string) => [namespace, key].filter(Boolean).join(".").split(".").reduce((value, segment) => value[segment], messages);
  }
}));

const tools = ["map", "artillery-calculator", "weapon-compare", "ammo-matcher", "loadout-budget", "cash-xp-calculator", "logistics-planner", "progression-route", "system-check"];
describe("shared tool page headers", () => {
  it.each(tools)("keeps a single shared heading and localized Tools return link for %s", async (id) => {
    const pagePath = `../../src/app/[locale]/tools/${id}/page`;
    const {default: Page} = await import(pagePath);
    const html = renderToStaticMarkup(await Page({params: Promise.resolve({locale: "ja"})}));
    expect(html.match(/<h1/g), id).toHaveLength(1);
    expect(html.includes(`data-tool-page-hero="${id}"`), id).toBe(true);
    expect(html.includes('href="/ja/tools"'), id).toBe(true);
    expect(html.includes('data-task-link="secondary"'), id).toBe(true);
    if (id === "system-check" || id === "loadout-budget") expect(html).toContain(`id="${id}-form"`);
  });
});

describe("shared Hub page headers", () => {
  it.each(["guides", "items", "tools", "news", "videos", "maps"])("preserves one primary heading in the shared %s template", async (hub) => {
    const pagePath = `../../src/app/[locale]/${hub}/page`;
    const {default: Page} = await import(pagePath);
    const html = renderToStaticMarkup(await Page({params: Promise.resolve({locale: "ja"})}));
    expect(html.match(/<h1/g), hub).toHaveLength(1);
    expect(html.includes('data-hub-header="hub"') || html.includes('data-hub-header="overlay"'), hub).toBe(true);
    expect(html.includes('class="section-heading"'), hub).toBe(true);
  });
});

describe("footer discovery navigation", () => {
  it("keeps the exact Catalogue and Tools hub destinations reachable", async () => {
    const footerPath = "../../src/components/layout/site-footer";
    const {SiteFooter} = await import(footerPath);
    const html = renderToStaticMarkup(await SiteFooter());
    expect(html.includes('href="/items"')).toBe(true);
    expect(html.includes('href="/tools"')).toBe(true);
    expect(html.includes('href="/guides"')).toBe(true);
  });
});


describe("tool and catalogue task continuations", () => {
  it.each(tools)("renders registry guide returns after the actual %s tool", async (id) => {
    const pagePath = `../../src/app/[locale]/tools/${id}/page`;
    const {default: Page} = await import(pagePath);
    const {TOOL_REGISTRY} = await import("../../src/features/tools/tool-registry");
    const tool = TOOL_REGISTRY.find((entry) => entry.id === id)!;
    const html = renderToStaticMarkup(await Page({params: Promise.resolve({locale: "ja"})}));
    expect(html.includes(`data-tool-related-guides="${id}"`), id).toBe(true);
    for (const slug of tool.relatedGuideSlugs) expect(html.includes(`href="/ja/guides/${slug}"`), slug).toBe(true);
  });
  it.each([
    ["weapons", "amp-9", "wardogs-best-weapons-loadouts"],
    ["vehicles", "sph-2", "wardogs-artillery-guide"],
    ["vehicles", "bobcat", "wardogs-cargo-guide"]
  ])("renders a task return on the actual %s/%s detail", async (type, slug, guide) => {
    const pagePath = "../../src/app/[locale]/items/[type]/[slug]/page";
    const {default: Page} = await import(pagePath);
    const html = renderToStaticMarkup(await Page({params: Promise.resolve({locale: "ja", type, slug})}));
    expect(html.includes(`href="/ja/guides/${guide}"`), `${type}/${slug}`).toBe(true);
  });
});
