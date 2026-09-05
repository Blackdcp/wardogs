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
  "home.primaryCta": "Play now",
  "home.secondaryCta": "Known issues",
  "home.statsLabel": "Quick facts"
};

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => translations[key] ?? key)
}));

vi.mock("../../src/components/ui/button-link", () => ({
  ButtonLink: ({children, href}: {children: ReactNode; href: ComponentProps<"a">["href"]}) => (
    <a href={href}>{children}</a>
  )
}));

describe("HomeHero", () => {
  it("uses the permanent site name as the visible homepage heading", async () => {
    const html = renderToStaticMarkup(await HomeHero({facts: ["100 players"]}));

    expect(html).toMatch(/<h1[^>]*>WARDOGS Wiki<\/h1>/);
  });
});
