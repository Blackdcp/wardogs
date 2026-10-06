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

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: () => {}
}));

// Next Intl navigation requires a running Next router, outside this SSR boundary.
vi.mock("@/i18n/navigation", () => ({Link: "a"}));

type InventoryProps = {
  children?: ReactNode;
  sponsoredSlot?: ReactNode;
  "data-page-ad-inventory"?: string;
};

// Inspect the actual page composition, then render its real ad components.
// No ad or page component is mocked; browser effects stay inactive during SSR.
function findInventory(node: ReactNode, inventory: string): ReactElement<InventoryProps>[] {
  if (Array.isArray(node)) return node.flatMap((child) => findInventory(child, inventory));
  if (!isValidElement<InventoryProps>(node)) return [];
  if (node.props["data-page-ad-inventory"] === inventory) return [node];
  return [node.props.children, node.props.sponsoredSlot].flatMap((child) => findInventory(child, inventory));
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

describe("Native priority in existing inline ad blocks", () => {
  for (const {inventory, page} of templates) {
    it.each(locales)(`${inventory} renders one Native before one rectangle for %s`, async (locale) => {
      const tree = await page({params: Promise.resolve({locale, type: "weapons"})});
      const blocks = findInventory(tree, inventory);
      expect(blocks).toHaveLength(1);
      const html = renderToStaticMarkup(blocks[0]);
      expect(html.match(/data-ad-slot="adsterra-native"/g)).toHaveLength(1);
      expect(html.match(/data-ad-placement="rectangle"/g)).toHaveLength(1);
      expect(html.indexOf('data-ad-slot="adsterra-native"')).toBeLessThan(html.indexOf('data-ad-placement="rectangle"'));
    });
  }
});
