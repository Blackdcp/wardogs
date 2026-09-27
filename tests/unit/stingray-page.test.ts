import {describe, expect, it} from "vitest";
import {getItemByTypeAndSlug} from "../../src/features/items/item-library";
import {getLocalizedItem} from "../../src/features/items/item-localization";
import {isItemDetailRouteAvailable} from "../../src/features/items/item-route-availability";
import {buildItemMetadata} from "../../src/lib/item-metadata";

describe("Stingray detail page", () => {
  it("keeps the searched Japanese detail URL available", () => {
    const item = getItemByTypeAndSlug("vehicles", "stingray");

    expect(item?.indexable).toBe(true);
    expect(isItemDetailRouteAvailable("ja", "/items/vehicles/stingray")).toBe(true);
  });

  it("answers the Japanese Stingray intent without inventing a live price", () => {
    const item = getItemByTypeAndSlug("vehicles", "stingray");
    expect(item).toBeDefined();
    if (!item) return;

    const localized = getLocalizedItem(item, "ja");
    const metadata = buildItemMetadata("ja", item);

    expect(localized.summary).toMatch(/スティングレイ.*対車両ドローン/);
    expect(localized.description).toContain("現在の価格");
    expect(localized.role).toContain("発射");
    expect(metadata.title).toContain("スティングレイ");
    expect(metadata.alternates?.canonical).toContain("/ja/items/vehicles/stingray");
  });
});
