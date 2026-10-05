import {isValidElement, type ReactElement} from "react";
import {describe, expect, it, vi} from "vitest";
import HomePage from "../../src/app/[locale]/page";

vi.mock("next-intl/server", () => ({getTranslations: async () => (key: string) => key, setRequestLocale: () => {}}));
vi.mock("@/i18n/navigation", () => ({Link: () => null}));
vi.mock("@/components/home/hero-search-box", () => ({HeroSearchBox: () => null}));

function componentName(element: ReactElement) {
  return typeof element.type === "function" ? element.type.name : element.type;
}

describe("homepage composition", () => {
  it("puts exactly six discovery sections in order and sponsors the protected-demand section", async () => {
    const page = await HomePage({params: Promise.resolve({locale: "en"})});
    const children = page.props.children.filter(isValidElement) as ReactElement<{sponsoredSlot?: ReactElement<{"data-page-ad-inventory"?: string}>}>[];
    expect(children.map(componentName)).toEqual([
      "JsonLd", "HomeSectionAnalytics", "HomeCommandDeck", "HomeProvenDemand", "HomeLiveIntel", "HomeToolWorkbench", "CatalogueHomeBand", "HomeLibrary"
    ]);
    expect(children.filter((child) => child.props.sponsoredSlot)).toHaveLength(1);
    expect(children.find((child) => componentName(child) === "HomeProvenDemand")?.props.sponsoredSlot?.props["data-page-ad-inventory"]).toBe("home");
  });
});
