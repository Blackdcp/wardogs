import {isValidElement, type ReactElement, type ReactNode} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import HomePage from "../../src/app/[locale]/page";
import GuidesPage from "../../src/app/[locale]/guides/page";
import ItemsPage from "../../src/app/[locale]/items/page";
import ItemTypePage from "../../src/app/[locale]/items/[type]/page";
import VideosPage from "../../src/app/[locale]/videos/page";
import MapsPage from "../../src/app/[locale]/maps/page";
import TacticalMapPage from "../../src/app/[locale]/tools/map/page";
import ArtilleryCalculatorPage from "../../src/app/[locale]/tools/artillery-calculator/page";
import {locales} from "../../src/config/site";
import {AdsterraNativeBanner} from "../../src/components/ads/adsterra-native-banner";
import {AdsterraSmartlink} from "../../src/components/ads/adsterra-smartlink";
import {AdsterraDisplayBanner} from "../../src/components/ads/adsterra-display-banner";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: () => {}
}));

// Next Intl navigation requires a running Next router, outside this SSR boundary.
vi.mock("@/i18n/navigation", () => ({Link: "a"}));

type InventoryProps = {
  children?: ReactNode;
  sponsoredSlot?: ReactNode;
  secondarySponsoredSlot?: ReactNode;
  supplementalSlot?: ReactNode;
  afterContentSlot?: ReactNode;
};

// Inspect the actual page composition, then render its real ad components.
// No ad or page component is mocked; browser effects stay inactive during SSR.
function findInlineAds(node: ReactNode, smartlink = false): ReactElement<InventoryProps>[] {
  if (Array.isArray(node)) return node.flatMap((child) => findInlineAds(child, smartlink));
  if (!isValidElement<InventoryProps>(node)) return [];
  if (smartlink ? node.type === AdsterraSmartlink : node.type === AdsterraNativeBanner || node.type === AdsterraDisplayBanner) return [node];
  return [node.props.children, node.props.sponsoredSlot, node.props.secondarySponsoredSlot, node.props.supplementalSlot, node.props.afterContentSlot].flatMap((child) => findInlineAds(child, smartlink));
}

const templates = [
  {inventory: "home", page: HomePage},
  {inventory: "guides", page: GuidesPage},
  {inventory: "items", page: ItemsPage},
  {inventory: "item-type", page: ItemTypePage},
  {inventory: "videos", page: VideosPage},
  {inventory: "maps", page: MapsPage},
  {inventory: "tools-map", page: TacticalMapPage},
  {inventory: "tools-artillery", page: ArtilleryCalculatorPage}
] as const;

describe("existing inline inventory across all languages", () => {
  for (const {inventory, page} of templates) {
    it.each(locales)(`${inventory} retains exactly one Native and one rectangle for %s`, async (locale) => {
      const tree = await page({params: Promise.resolve({locale, type: "weapons"})});
      const slots = findInlineAds(tree);
      const smartlinks = findInlineAds(tree, true);
      expect(smartlinks).toHaveLength(1);
      expect(renderToStaticMarkup(smartlinks[0]).match(/data-ad-unit="smartlink-1"/g)).toHaveLength(1);
      expect(slots).toHaveLength(2);
      const html = slots.map((slot) => renderToStaticMarkup(slot)).join("");
      expect(html.match(/data-ad-slot="adsterra-native"/g)).toHaveLength(1);
      expect(html.match(/data-ad-placement="rectangle"/g)).toHaveLength(1);
      if (!inventory.startsWith("tools-")) {
        expect(html.indexOf('data-ad-slot="adsterra-native"')).toBeLessThan(html.indexOf('data-ad-placement="rectangle"'));
      }
    });
  }
});
