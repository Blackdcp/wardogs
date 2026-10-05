import React from "react";
import {readFileSync} from "node:fs";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {guideManifest} from "../../src/content/manifest";
import {locales} from "../../src/config/site";
import {buildGuideIndex} from "../../src/features/guides/guide-index";

const modulePath = "../../src/features/guides/guide-routes";
describe("guide routes", () => {
  it.each(locales)("resolves three complete ordered routes into existing local guides and tools in %s", async (locale) => {
    const routesModule = await import(modulePath).catch(() => undefined);
    expect(routesModule, "Guide route resolver must exist").toBeDefined();
    const guides = await buildGuideIndex(locale);
    const routes = routesModule!.resolveGuideRoutes(guides, locale);
    expect(routes.map((route: {key: string}) => route.key)).toEqual(["new-player", "combat-operations", "logistics-live"]);
    expect(routes[0].guides[0].guide.slug).toBe("wardogs-beginner-guide");
    expect(routes[1].guides.some((entry: {guide: {slug: string}}) => entry.guide.slug === "wardogs-artillery-guide")).toBe(true);
    expect(routes[2].tools.some((entry: {tool: {id: string}}) => entry.tool.id === "logistics-planner")).toBe(true);
    for (const route of routes) {
      expect(route.guides.length).toBeGreaterThanOrEqual(5);
      expect(route.tools.length).toBeGreaterThan(0);
      for (const entry of route.guides) {
        expect(guideManifest.some((guide) => guide.slug === entry.guide.slug)).toBe(true);
        expect(entry.href).toBe(`/${locale}/guides/${entry.guide.slug}`);
      }
      for (const entry of route.tools) expect(entry.href).toBe(`/${locale}${entry.tool.href}`);
    }
  });
  it.each(locales)("renders complete routes with local guide and related tool links in %s", async (locale) => {
    const componentPath = "../../src/components/guides/guide-route-grid";
    const component = await import(componentPath).catch(() => undefined);
    expect(component, "Guide route grid must exist").toBeDefined();
    const routesModule = await import(modulePath);
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8"));
    const t = (key: string): string => key.split(".").reduce((value, segment) => value[segment], messages);
    const routes = routesModule.resolveGuideRoutes(await buildGuideIndex(locale), locale);
    const html = renderToStaticMarkup(React.createElement(component!.GuideRouteGrid, {routes, t}));
    expect(html.match(/data-guide-route=/g)).toHaveLength(3);
    expect(html.match(/<ol/g)).toHaveLength(3);
    for (const route of routes) {
      expect(html).toContain(`id="route-${route.key}"`);
      for (const entry of [...route.guides, ...route.tools]) expect(html).toContain(`href="${entry.href}"`);
    }
    expect(html).not.toContain("guides.routes.");
  });
  it("rejects missing configured guide content instead of silently shortening a route", async () => {
    const routesModule = await import(modulePath).catch(() => undefined);
    expect(routesModule, "Guide route resolver must exist").toBeDefined();
    const guides = await buildGuideIndex("en");
    expect(() => routesModule!.resolveGuideRoutes(guides.filter(({slug}) => slug !== "wardogs-beginner-guide"), "en")).toThrow("wardogs-beginner-guide");
  });
});
