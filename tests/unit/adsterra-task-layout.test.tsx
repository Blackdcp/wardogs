import {Children, isValidElement, type ReactElement, type ReactNode} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import GuidePage from "../../src/app/[locale]/guides/[slug]/page";
import ItemPage from "../../src/app/[locale]/items/[type]/[slug]/page";
import VideoPage from "../../src/app/[locale]/videos/[slug]/page";
import ItemTypePage from "../../src/app/[locale]/items/[type]/page";
import {AdsterraNativeBanner} from "../../src/components/ads/adsterra-native-banner";
import {AdsterraDisplayBanner} from "../../src/components/ads/adsterra-display-banner";
import {CatalogueCategoryView} from "../../src/components/catalogue/catalogue-category-view";
import {CatalogueHub} from "../../src/components/catalogue/catalogue-hub";
import {ToolSponsoredWorkspace} from "../../src/components/tools/tool-sponsored-workspace";
import {SourceList} from "../../src/components/guides/source-list";
import {GuideTaskPanel} from "../../src/components/guides/guide-task-panel";
import {itemTypes} from "../../src/features/items/item-library";
import {locales} from "../../src/config/site";

vi.mock("next-intl/server", () => ({getTranslations: async () => (key: string) => key, setRequestLocale: () => {}}));
vi.mock("next-intl", () => ({useTranslations: () => (key: string) => key}));
vi.mock("@/i18n/navigation", () => ({Link: "a"}));

type NodeProps = {children?: ReactNode; className?: string; "aria-labelledby"?: string};
function elements(node: ReactNode): ReactElement<NodeProps>[] {
  return Children.toArray(node).filter(isValidElement) as ReactElement<NodeProps>[];
}
function articleChildren(node: ReactElement<NodeProps>) {
  const article = elements(node.props.children).find((child) => child.type === "article");
  expect(article).toBeDefined();
  return elements(article!.props.children);
}
function assertAdSeparation(children: ReactElement<NodeProps>[], useful: (node: ReactElement<NodeProps>) => boolean) {
  const native = children.findIndex((node) => node.type === AdsterraNativeBanner);
  const rectangle = children.findIndex((node) => node.type === AdsterraDisplayBanner);
  expect(native).toBeGreaterThanOrEqual(0);
  expect(rectangle).toBeGreaterThan(native);
  expect(children.filter((node) => node.type === AdsterraNativeBanner)).toHaveLength(1);
  expect(children.filter((node) => node.type === AdsterraDisplayBanner)).toHaveLength(1);
  expect(children.slice(native + 1, rectangle).some(useful)).toBe(true);
  return {native, rectangle};
}

describe("task-aware detail ad boundaries", () => {
  it.each(locales)("keeps the %s guide answer before Native and exactly one rectangle inside prose", async (locale) => {
    const children = articleChildren(await GuidePage({params: Promise.resolve({locale, slug: "wardogs-artillery-guide"})}));
    const native = children.findIndex((node) => node.type === AdsterraNativeBanner);
    const prose = children.findIndex((node) => node.props.className === "guide-prose");
    expect(native).toBeGreaterThanOrEqual(0);
    expect(prose).toBeGreaterThan(native);
    expect(children.filter((node) => node.type === AdsterraDisplayBanner)).toHaveLength(0);
    expect(children.slice(0, native).some((node) => node.type === GuideTaskPanel || node.type === "aside")).toBe(true);
    const html = renderToStaticMarkup(children[prose]);
    expect(html.match(/data-ad-placement="rectangle"/g)).toHaveLength(1);
    const offset = html.indexOf('data-ad-placement="rectangle"');
    expect(html.slice(0, offset)).toContain("<h2");
    expect(html.slice(offset)).toContain("<h2");
    expect(children.findIndex((node) => node.type === SourceList)).toBeGreaterThan(prose);
  });

  it.each(locales)("shows %s item facts and useful actions before Native, then role before rectangle", async (locale) => {
    const children = articleChildren(await ItemPage({params: Promise.resolve({locale, type: "weapons", slug: "amp-9"})}));
    const {native, rectangle} = assertAdSeparation(children, (node) => node.props["aria-labelledby"] === "role-title");
    expect(children.findIndex((node) => node.props["aria-labelledby"] === "facts-title")).toBeLessThan(native);
    expect(children.findIndex((node) => node.props["aria-labelledby"] === "sources-title")).toBeGreaterThan(rectangle);
  });

  it.each(locales)("keeps %s video takeaways and the complete interpretation ahead of rectangle", async (locale) => {
    const children = articleChildren(await VideoPage({params: Promise.resolve({locale, slug: "wardogs-artillery-tank-guide"})}));
    assertAdSeparation(children, (node) => node.props.className?.includes("guide-prose") ?? false);
  });
});

describe("catalogue and tool boundaries", () => {
  it.each(locales.flatMap((locale) => itemTypes.map(({id}) => ({locale, type: id}))))(
    "preserves both slots and a complete catalogue guide between them for $locale/$type",
    async ({locale, type}) => {
      const page = await ItemTypePage({params: Promise.resolve({locale, type})});
      const children = elements(page.props.children);
      const catalogue = children.find((node) => node.type === CatalogueCategoryView)!;
      const html = renderToStaticMarkup(CatalogueCategoryView(catalogue.props as Parameters<typeof CatalogueCategoryView>[0]));
      expect(html.match(/data-ad-slot="adsterra-native"/g)).toHaveLength(1);
      const afterNative = html.slice(html.indexOf('data-ad-slot="adsterra-native"'));
      expect(afterNative).toContain("<h2");
      const rectangle = children.findIndex((node) => renderableRectangle(node));
      expect(rectangle).toBeGreaterThan(children.indexOf(catalogue));
    }
  );

  it("places catalogue sponsorship between complete discovery modules", () => {
    const html = renderToStaticMarkup(<CatalogueHub locale="en" secondarySponsoredSlot={<div data-test-slot="rectangle" />}><div data-test-slot="native" /></CatalogueHub>);
    expect(html.indexOf('id="catalogue-categories-title"')).toBeLessThan(html.indexOf('data-test-slot="native"'));
    expect(html.indexOf('data-test-slot="native"')).toBeLessThan(html.indexOf('data-test-slot="rectangle"'));
    expect(html.slice(html.indexOf('data-test-slot="native"'), html.indexOf('data-test-slot="rectangle"'))).toContain('data-evidence-legend');
    expect(html.indexOf('data-test-slot="rectangle"')).toBeLessThan(html.indexOf('id="published-guides-title"'));
  });

  it("uses one movable ad outside the protected tool controls", () => {
    const tree = ToolSponsoredWorkspace({inventory: "tools-map", label: "Advertisement", children: <button>Plan route</button>, sponsoredSlot: <AdsterraDisplayBanner placement="rectangle" label="Advertisement" />});
    const children = elements(tree.props.children);
    const html = renderToStaticMarkup(tree);
    expect(html.match(/data-ad-placement="rectangle"/g)).toHaveLength(1);
    expect(html.match(/data-mobile-ad-protected/g)).toHaveLength(1);
    expect(renderToStaticMarkup(children[0])).toContain("Plan route");
    expect(renderToStaticMarkup(children[0])).not.toContain("data-ad-placement");
    expect(renderToStaticMarkup(children[1])).not.toContain("data-mobile-ad-protected");
  });
});

function renderableRectangle(node: ReactElement<NodeProps>) {
  return typeof node.type === "string" && elements(node.props.children).some((child) => child.type === AdsterraDisplayBanner);
}
