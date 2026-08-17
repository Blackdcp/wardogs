import {describe, expect, it} from "vitest";
import {itemLibrary} from "../../src/features/items/item-library";

const routeModulePath = "../../src/features/items/item-route-availability";

type RouteEntry = {
  pathname: string;
  locales: readonly string[];
};

type RouteTarget = {
  locale: string;
  pathname: string;
};

type RouteAvailabilityModule = {
  itemDetailRouteManifest: readonly RouteEntry[];
  isItemDetailRouteAvailable(locale: string, pathname: string): boolean;
  resolveItemRouteTarget(
    locale: string,
    pathname: string,
    fallback?: "english-detail" | "localized-category"
  ): RouteTarget;
};

async function loadRouteAvailability() {
  return import(routeModulePath).catch(() => null) as Promise<RouteAvailabilityModule | null>;
}

describe("item detail route availability", () => {
  it("publishes one lightweight manifest for all 34 models and six legacy articles", async () => {
    const routeAvailability = await loadRouteAvailability();

    expect(routeAvailability).not.toBeNull();
    if (!routeAvailability) return;

    const modelRoutes = routeAvailability.itemDetailRouteManifest.filter(({locales}) => locales.length === 1);
    const legacyRoutes = routeAvailability.itemDetailRouteManifest.filter(({locales}) => locales.length === 2);

    expect(routeAvailability.itemDetailRouteManifest).toHaveLength(40);
    expect(modelRoutes).toHaveLength(34);
    expect(modelRoutes.every(({locales}) => locales[0] === "en")).toBe(true);
    expect(legacyRoutes.map(({pathname}) => pathname)).toEqual([
      "/items/weapons/mortar",
      "/items/equipment/mobile-fob",
      "/items/vehicles/littlebird",
      "/items/vehicles/tank",
      "/items/vehicles/attack-helicopter",
      "/items/vehicles/armored-transport"
    ]);
    expect(legacyRoutes.every(({locales}) => JSON.stringify(locales) === JSON.stringify(["en", "ru"]))).toBe(true);
  });

  it("keeps the route manifest synchronized with the server item library", async () => {
    const routeAvailability = await loadRouteAvailability();
    expect(routeAvailability).not.toBeNull();
    if (!routeAvailability) return;

    expect(routeAvailability.itemDetailRouteManifest.map(({pathname, locales}) => ({pathname, locales}))).toEqual(
      itemLibrary.map((item) => ({
        pathname: `/items/${item.type}/${item.slug}`,
        locales: item.indexLocales
      }))
    );
  });

  it("resolves unsupported links to an English detail or a valid localized category", async () => {
    const routeAvailability = await loadRouteAvailability();
    expect(routeAvailability).not.toBeNull();
    if (!routeAvailability) return;

    expect(routeAvailability.isItemDetailRouteAvailable("en", "/items/vehicles/bobcat")).toBe(true);
    expect(routeAvailability.isItemDetailRouteAvailable("ru", "/items/vehicles/bobcat")).toBe(false);
    expect(routeAvailability.resolveItemRouteTarget("ru", "/items/vehicles/bobcat")).toEqual({
      locale: "en",
      pathname: "/items/vehicles/bobcat"
    });
    expect(routeAvailability.resolveItemRouteTarget("ru", "/items/vehicles/bobcat", "localized-category")).toEqual({
      locale: "ru",
      pathname: "/items/vehicles"
    });
    expect(routeAvailability.resolveItemRouteTarget("ru", "/items/weapons/mortar")).toEqual({
      locale: "ru",
      pathname: "/items/weapons/mortar"
    });
    expect(routeAvailability.resolveItemRouteTarget("de", "/items/weapons/mortar", "localized-category")).toEqual({
      locale: "de",
      pathname: "/items/weapons"
    });
    expect(routeAvailability.resolveItemRouteTarget("pt-br", "/guides/wardogs-gameplay", "localized-category")).toEqual({
      locale: "pt-br",
      pathname: "/guides/wardogs-gameplay"
    });
  });
});
