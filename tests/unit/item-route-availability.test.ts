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
  it("publishes one six-locale manifest for every indexable item article", async () => {
    const routeAvailability = await loadRouteAvailability();

    expect(routeAvailability).not.toBeNull();
    if (!routeAvailability) return;

    expect(routeAvailability.itemDetailRouteManifest).toHaveLength(itemLibrary.filter((item) => item.indexable).length);
    expect(routeAvailability.itemDetailRouteManifest.every(({locales}) =>
      JSON.stringify(locales) === JSON.stringify(["en", "ru", "de", "pt-br", "ja", "zh-cn"])
    )).toBe(true);
  });

  it("keeps the route manifest synchronized with the server item library", async () => {
    const routeAvailability = await loadRouteAvailability();
    expect(routeAvailability).not.toBeNull();
    if (!routeAvailability) return;

    expect(routeAvailability.itemDetailRouteManifest.map(({pathname, locales}) => ({pathname, locales}))).toEqual(
      itemLibrary.filter((item) => item.indexable).map((item) => ({
        pathname: `/items/${item.type}/${item.slug}`,
        locales: item.indexLocales
      }))
    );
  });

  it("keeps every supported locale on its localized item detail route", async () => {
    const routeAvailability = await loadRouteAvailability();
    expect(routeAvailability).not.toBeNull();
    if (!routeAvailability) return;

    expect(routeAvailability.isItemDetailRouteAvailable("en", "/items/vehicles/bobcat")).toBe(true);
    expect(routeAvailability.isItemDetailRouteAvailable("ru", "/items/vehicles/bobcat")).toBe(true);
    expect(routeAvailability.isItemDetailRouteAvailable("de", "/items/vehicles/bobcat")).toBe(true);
    expect(routeAvailability.isItemDetailRouteAvailable("pt-br", "/items/vehicles/bobcat")).toBe(true);
    expect(routeAvailability.isItemDetailRouteAvailable("ja", "/items/vehicles/bobcat")).toBe(true);
    expect(routeAvailability.isItemDetailRouteAvailable("en", "/items/weapons/m4")).toBe(false);
    expect(routeAvailability.resolveItemRouteTarget("en", "/items/weapons/m4")).toEqual({
      locale: "en",
      pathname: "/items/weapons"
    });
    expect(routeAvailability.resolveItemRouteTarget("ru", "/items/vehicles/bobcat")).toEqual({
      locale: "ru",
      pathname: "/items/vehicles/bobcat"
    });
    expect(routeAvailability.resolveItemRouteTarget("ru", "/items/vehicles/bobcat", "localized-category")).toEqual({
      locale: "ru",
      pathname: "/items/vehicles/bobcat"
    });
    expect(routeAvailability.resolveItemRouteTarget("ru", "/items/weapons/mortar")).toEqual({
      locale: "ru",
      pathname: "/items/weapons/mortar"
    });
    expect(routeAvailability.resolveItemRouteTarget("de", "/items/weapons/mortar", "localized-category")).toEqual({
      locale: "de",
      pathname: "/items/weapons/mortar"
    });
    expect(routeAvailability.resolveItemRouteTarget("pt-br", "/guides/wardogs-gameplay", "localized-category")).toEqual({
      locale: "pt-br",
      pathname: "/guides/wardogs-gameplay"
    });
  });
});
