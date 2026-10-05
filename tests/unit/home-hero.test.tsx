import type {ComponentProps, ReactNode} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {HomeHero} from "../../src/components/home/home-hero";

const translations: Record<string, string> = {
  "common.fanMade": "Independent fan-made guide",
  "home.status": "Closed Beta 02 live",
  "home.heroTitle": "Weapons, Vehicles, Guides & Game Database",
  "home.heroDescription": "Source-checked player reference.",
  "home.heroImageAlt": "WARDOGS combat scene",
  "home.statsLabel": "Quick facts",
  "home.search.placeholder": "Search weapons, tools, maps, or fixes",
  "nav.interactiveMap": "Interactive Map",
  "nav.artilleryCalculator": "Artillery & Mortar Calculator"
};

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => translations[key] ?? key)
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({children, ...props}: ComponentProps<"a"> & {children: ReactNode}) => <a {...props}>{children}</a>
}));

vi.mock("../../src/components/home/hero-search-box", () => ({
  HeroSearchBox: () => <div data-hero-search-box="true" />
}));

describe("HomeHero", () => {
  it("keeps the hero focused on search plus four registry-backed player destinations", async () => {
    const html = renderToStaticMarkup(await HomeHero({facts: ["Early Access", "100 players", "3 teams"]}));

    expect(html).toMatch(/<h1[^>]*>WARDOGS Wiki<\/h1>/);
    expect(html).toContain('alt="WARDOGS"');
    const hero = html.match(/<img[^>]*alt="WARDOGS combat scene"[^>]*>/)?.[0];
    expect(hero).toContain('fetchPriority="high"');
    expect(hero).toContain('loading="eager"');

    expect(html).toContain('href="/tools/map"');
    expect(html).toContain('href="/tools/artillery-calculator"');
    expect(html.match(/data-home-placement="command"/g)).toHaveLength(4);
    expect(html).toContain('data-home-section="command"');
    expect(html).toContain('data-home-section-sentinel="command"');
    // A first-section top=0 sentinel can never enter the viewport middle by scrolling.
    expect(html).toMatch(/style="top:40vh"[^>]*><span[^>]*data-home-section-sentinel="command"/);
    expect(html).toContain('data-home-task="weapons"');
    expect(html).toContain('data-home-task="status"');
    expect(html).toContain('data-home-task="map"');
    expect(html).toContain('data-home-task="calculator"');

    for (const noisyTask of ["vehicles", "season2"]) {
      expect(html).not.toContain(`data-home-task="${noisyTask}"`);
    }
    expect(html).not.toContain('href="/guides/wardogs-patch-notes"');
    expect(html).toContain('href="/guides/wardogs-server-status"');
    expect(html).not.toContain('grid grid-cols-2 gap-px');
  });
});
