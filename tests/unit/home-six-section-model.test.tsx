import {cloneElement, isValidElement, type ReactElement, type ReactNode} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import HomePage from "../../src/app/[locale]/page";
import {locales} from "../../src/config/site";
import {listGuideSummaries} from "../../src/content/guides";
import {getHomeProtectedDemand} from "../../src/features/home/home-traffic-assets";
import {publicRoutePath} from "../../src/lib/public-url";

const context = vi.hoisted(() => ({locale: "en"}));
vi.mock("next-intl/server", () => ({getTranslations: async () => (key: string) => key, setRequestLocale: () => {}}));
vi.mock("@/i18n/navigation", () => ({Link: ({href, children, ...props}: {href: string; children?: ReactNode}) => <a {...props} href={publicRoutePath(`/${context.locale}${href}`)}>{children}</a>}));
vi.mock("@/components/home/hero-search-box", () => ({HeroSearchBox: () => <button data-hero-search-trigger="true">Search</button>}));
vi.mock("@/features/search/site-search-index", () => ({buildSiteSearchIndex: () => {throw new Error("Homepage must not preload the search index");}}));
vi.mock("@/components/ads/adsterra-display-banner", () => ({AdsterraDisplayBanner: () => <div data-ad-placement="rectangle" />}));
vi.mock("@/components/ads/adsterra-native-banner", () => ({AdsterraNativeBanner: () => <div data-ad-format="native" />}));
vi.mock("@/components/ads/adsterra-smartlink", () => ({AdsterraSmartlink: () => null}));

import * as model from "../../src/features/home/home-discovery-model";
import {HomeLiveIntel} from "../../src/components/home/home-live-intel";

async function resolveServerTree(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) return Promise.all(node.map(resolveServerTree));
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<{children?: ReactNode}>;
  if (typeof element.type === "function" && element.type.constructor.name === "AsyncFunction") {
    return resolveServerTree(await (element.type as (props: unknown) => Promise<ReactNode>)(element.props));
  }
  return cloneElement(element, {...element.props, children: await resolveServerTree(element.props.children)});
}

describe("six-section homepage", () => {
  it.each(locales)("renders six ordered sections with the protected six guides and exact items route for %s", async (locale) => {
    context.locale = locale;
    const html = renderToStaticMarkup(await resolveServerTree(await HomePage({params: Promise.resolve({locale})})));
    expect([...html.matchAll(/data-home-section="([^"]+)"/g)].map((match) => match[1])).toEqual([
      "command", "proven-demand", "live-intel", "workbench", "database", "library"
    ]);
    expect(html.match(/data-home-section-sentinel=/g)).toHaveLength(6);
    const demand = html.split('data-home-section="proven-demand"')[1]?.split("</section>")[0] ?? "";
    const expected = getHomeProtectedDemand(await listGuideSummaries(locale), locale);
    expect(demand.match(/data-protected-demand=/g)).toHaveLength(6);
    for (const asset of expected) expect(demand).toContain(`href="/${locale}${asset.href}"`);
    expect(demand).toContain(`href="/${locale}/items"`);
    expect(demand.match(/data-page-ad-inventory="home"/g)).toHaveLength(1);
    expect(demand.match(/data-ad-placement="rectangle"/g)).toHaveLength(1);
    expect(demand.match(/data-ad-format="native"/g)).toHaveLength(1);
    expect(html.match(/data-page-ad-inventory="home"/g)).toHaveLength(1);
    expect(html).not.toContain("data-site-search");
    expect(html).not.toContain("data-hero-popular-links");
    expect(html.match(/data-featured-tool=/g)).toHaveLength(4);
    expect(html.match(/data-home-route=/g)).toHaveLength(3);
    for (const href of ["/tools/map", "/tools/artillery-calculator", "/items/weapons", "/guides/wardogs-server-status", "/tools", "/guides", "/videos", "/news", "/about"]) {
      expect(html).toContain(`href="/${locale}${href}"`);
    }
    expect(html).not.toMatch(/data-home-placement="(?:hero|action-hub|recovery|tools|routes|collections|intel)"/);
  });

  it("keeps status and patch-note recovery links when no verified changes are available", async () => {
    context.locale = "en";
    const html = renderToStaticMarkup(await HomeLiveIntel({locale: "en", entries: []}));
    expect(html).toContain("home.discovery.states.noVerifiedChanges");
    expect(html).toContain('href="/en/guides/wardogs-server-status"');
    expect(html).toContain('href="/en/guides/wardogs-patch-notes"');
    expect(html).not.toContain("data-home-intel=");
  });

  it("builds bounded views from the tool, guide-route and catalogue contracts", async () => {
    const result = model.buildHomeDiscoveryModel("ja", await listGuideSummaries("ja"), []);
    expect(result.command.map((entry) => entry.task)).toEqual(["search", "map", "calculator", "weapons", "status"]);
    expect(result.protectedDemand).toHaveLength(6);
    expect(result.featuredTools.map((entry) => entry.id)).toEqual(["weapon-compare", "loadout-budget", "logistics-planner", "system-check"]);
    expect(result.database.map((entry) => entry.href)).toEqual(["/items", "/items/weapons", "/items/vehicles"]);
    expect(result.library.filter((entry) => entry.id.startsWith("route-")).map((entry) => entry.href)).toEqual([
      "/guides#route-new-player", "/guides#route-combat-operations", "/guides#route-logistics-live"
    ]);
    expect(result.liveIntel).toEqual([]);
  });
});
