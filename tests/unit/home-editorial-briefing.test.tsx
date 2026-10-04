import type {ReactNode} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {HomeEditorialBriefing} from "../../src/components/home/home-editorial-briefing";

const translations: Record<string, string> = {
  "eyebrow": "Current field desk",
  "title": "Start with the three decisions that change tonight's match",
  "description": "Use the homepage as an editorial route through current WARDOGS problems instead of a loose directory.",
  "primaryLabel": "Read first",
  "priority.firstMatch.title": "Survive the first deployment",
  "priority.firstMatch.description": "Learn what to do before spending cash.",
  "priority.firstMatch.cta": "Start the route",
  "priority.season2.title": "Check Season 2 wipe rules",
  "priority.season2.description": "Separate confirmed reset policy from rumors.",
  "priority.season2.cta": "Open wipe guide",
  "priority.pcFixes.title": "Fix WD-L020 and launch issues",
  "priority.pcFixes.description": "Diagnose the current crash branch.",
  "priority.pcFixes.cta": "Open fixes",
  "pathsTitle": "Choose by player intent",
  "paths.newPlayer.label": "New player",
  "paths.newPlayer.title": "Beginner route",
  "paths.returning.label": "Returning",
  "paths.returning.title": "Patch and wipe route",
  "paths.tools.label": "Tools",
  "paths.tools.title": "Map and mortar route"
};

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => translations[key] ?? key)
}));

vi.mock("../../src/i18n/navigation", () => ({
  Link: ({children, href, ...props}: {children: ReactNode; href: string}) => <a href={href} {...props}>{children}</a>
}));

describe("HomeEditorialBriefing", () => {
  it("turns the homepage from a loose directory into an editorial player route", async () => {
    const html = renderToStaticMarkup(await HomeEditorialBriefing());

    expect(html).toContain('data-home-editorial-briefing="true"');
    expect(html).toContain('data-home-section="briefing"');
    expect(html.match(/data-home-priority=/g)).toHaveLength(3);
    expect(html).toContain('data-home-priority="firstMatch"');
    expect(html).toContain('data-home-priority="season2"');
    expect(html).toContain('data-home-priority="pcFixes"');
    expect(html).toContain('data-home-task="firstMatch"');
    expect(html).toContain('data-home-task="season2"');
    expect(html).toContain('data-home-task="pcFixes"');
    expect(html).toContain('Choose by player intent');
    expect(html).toContain('/guides/wardogs-beginner-guide');
    expect(html).toContain('/guides/wardogs-season-2');
    expect(html).toContain('/tools/artillery-calculator');
  });
});
