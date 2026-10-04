import type {ReactNode} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {HomeDiscoveryCompact} from "../../src/components/home/home-discovery-compact";

const translations: Record<string, string> = {
  "home.categories.eyebrow": "All guide areas",
  "home.categories.title": "Find the Intel You Need",
  "home.categories.description": "Browse every topic in the independent WARDOGS guide library.",
  "home.categories.allGuides": "View all {count} guides",
  "home.media.eyebrow": "Official Media",
  "home.media.title": "See WARDOGS in Action",
  "home.media.description": "Watch reviewed WARDOGS creator and official footage.",
  "home.faq.eyebrow": "Frequently Asked Questions",
  "home.faq.title": "WARDOGS Essentials",
  "home.faq.description": "Straight answers to player questions.",
  "home.aboutTitle": "What is WARDOGS?",
  "home.about.bodyOne": "WARDOGS is BULKHEAD's live Steam Early Access tactical all-out warfare FPS.",
  "home.about.points.teams": "Three teams pursue the same scoring objective",
  "home.about.points.battlefield": "Vehicles, construction, and destruction reshape routes",
  "home.about.points.roles": "Combat and support roles both contribute",
  "home.faq.items.game.question": "What kind of game is WARDOGS?",
  "home.faq.items.game.answer": "WARDOGS is a tactical all-out warfare first-person shooter.",
  "home.faq.items.release.question": "When does WARDOGS enter Early Access?",
  "home.faq.items.release.answer": "WARDOGS launched in Steam Early Access on September 10, 2026.",
  "home.faq.items.controlZone.question": "How does the Control Zone work?",
  "home.faq.items.controlZone.answer": "A randomized 2 x 2 km Control Zone becomes the active objective.",
  "home.faq.items.official.question": "Is WARDOGS Wiki an official site?",
  "home.faq.items.official.answer": "No. This is an independent community guide.",
  "nav.allGuides": "All Guides",
  "nav.about": "About",
  "categories.access": "Access",
  "categories.release": "Release",
  "categories.store": "Store",
  "categories.platform": "Platform",
  "categories.video": "Video",
  "categories.community": "Community",
  "categories.developer": "Developer",
  "categories.guide": "Guide",
  "home.categories.items.access": "Playtests, beta history, alpha status, and keys",
  "home.categories.items.release": "Release date and Early Access details",
  "home.categories.items.store": "Steam, pricing, and download guidance",
  "home.categories.items.platform": "Confirmed and unconfirmed platform status",
  "home.categories.items.video": "Official trailers, first looks, and streams",
  "home.categories.items.community": "Official channels and account safety",
  "home.categories.items.developer": "BULKHEAD and Team17 background",
  "home.categories.items.guide": "Gameplay systems, roles, and factions"
};

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string, values?: Record<string, string | number>) => {
    const value = translations[key] ?? key;
    return values?.count ? value.replace("{count}", String(values.count)) : value;
  })
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({children, href, ...props}: {children: ReactNode; href: string}) => <a href={href} {...props}>{children}</a>
}));

describe("HomeDiscoveryCompact", () => {
  it("keeps deleted SEO and click paths as a compact homepage section", async () => {
    const html = renderToStaticMarkup(await HomeDiscoveryCompact({guideCount: 42, locale: "en"}));

    expect(html).toContain('data-home-compact-discovery="true"');
    expect(html).toContain('data-home-section="discovery"');
    expect(html).toContain('data-home-task="videos"');
    expect(html).toContain('data-home-task="guides"');
    expect(html).toContain('data-home-task="faq"');
    expect(html).toContain('data-home-task="about"');
    expect(html.match(/data-home-discovery-category=/g)).toHaveLength(8);
    expect(html.match(/data-home-discovery-faq=/g)).toHaveLength(4);
    expect(html).toContain("View all 42 guides");
    expect(html).toContain("What is WARDOGS?");
    expect(html).toContain("Control Zone");
  });
});
