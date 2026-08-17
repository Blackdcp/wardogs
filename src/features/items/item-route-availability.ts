import type {Locale} from "@/config/site";

export type ItemDetailRoutePath = `/items/${string}/${string}`;
export type ItemRouteFallback = "english-detail" | "localized-category";

export type ItemDetailRouteAvailability = {
  pathname: ItemDetailRoutePath;
  locales: readonly Locale[];
};

export type ItemRouteTarget = {
  locale: Locale;
  pathname: string;
};

const englishAndRussian = ["en", "ru"] as const;
const englishOnly = ["en"] as const;

export const itemDetailRouteManifest: readonly ItemDetailRouteAvailability[] = [
  {pathname: "/items/weapons/mortar", locales: englishAndRussian},
  {pathname: "/items/equipment/mobile-fob", locales: englishAndRussian},
  {pathname: "/items/vehicles/littlebird", locales: englishAndRussian},
  {pathname: "/items/vehicles/tank", locales: englishAndRussian},
  {pathname: "/items/vehicles/attack-helicopter", locales: englishAndRussian},
  {pathname: "/items/vehicles/armored-transport", locales: englishAndRussian},
  {pathname: "/items/weapons/a-91", locales: englishOnly},
  {pathname: "/items/weapons/ak74", locales: englishOnly},
  {pathname: "/items/weapons/amp-9", locales: englishOnly},
  {pathname: "/items/weapons/amr-50", locales: englishOnly},
  {pathname: "/items/weapons/bmr-308", locales: englishOnly},
  {pathname: "/items/weapons/bushmaster-m17s", locales: englishOnly},
  {pathname: "/items/weapons/compound-bow", locales: englishOnly},
  {pathname: "/items/weapons/deagle", locales: englishOnly},
  {pathname: "/items/weapons/fal", locales: englishOnly},
  {pathname: "/items/weapons/galil", locales: englishOnly},
  {pathname: "/items/weapons/ggx-17", locales: englishOnly},
  {pathname: "/items/weapons/ggx-18", locales: englishOnly},
  {pathname: "/items/weapons/judge", locales: englishOnly},
  {pathname: "/items/weapons/kh-2002", locales: englishOnly},
  {pathname: "/items/vehicles/ah-6m-miniguns", locales: englishOnly},
  {pathname: "/items/vehicles/ah-6r-rockets", locales: englishOnly},
  {pathname: "/items/vehicles/bobcat", locales: englishOnly},
  {pathname: "/items/vehicles/dune-buggy", locales: englishOnly},
  {pathname: "/items/vehicles/flakpanzer-gepard", locales: englishOnly},
  {pathname: "/items/vehicles/havoc", locales: englishOnly},
  {pathname: "/items/vehicles/humvee-m249", locales: englishOnly},
  {pathname: "/items/vehicles/humvee-minigun", locales: englishOnly},
  {pathname: "/items/vehicles/humvee", locales: englishOnly},
  {pathname: "/items/vehicles/kodiak-m249", locales: englishOnly},
  {pathname: "/items/vehicles/kodiak-pickup", locales: englishOnly},
  {pathname: "/items/vehicles/kodiak", locales: englishOnly},
  {pathname: "/items/vehicles/l2a6", locales: englishOnly},
  {pathname: "/items/vehicles/mh-6", locales: englishOnly},
  {pathname: "/items/vehicles/sph-2", locales: englishOnly},
  {pathname: "/items/vehicles/uh-1y-miniguns", locales: englishOnly},
  {pathname: "/items/vehicles/uh-1y", locales: englishOnly},
  {pathname: "/items/vehicles/ural-defender-m249", locales: englishOnly},
  {pathname: "/items/vehicles/ural-defender", locales: englishOnly},
  {pathname: "/items/vehicles/ural", locales: englishOnly}
] as const;

const routeAvailability = new Map(
  itemDetailRouteManifest.map((entry) => [entry.pathname, entry] as const)
);

function splitPathname(pathname: string) {
  const suffixIndex = pathname.search(/[?#]/);
  const route = suffixIndex < 0 ? pathname : pathname.slice(0, suffixIndex);
  const suffix = suffixIndex < 0 ? "" : pathname.slice(suffixIndex);
  const normalized = route === "/" ? route : route.replace(/\/+$/g, "");
  return {normalized, suffix};
}

function getRoute(pathname: string) {
  const {normalized} = splitPathname(pathname);
  return routeAvailability.get(normalized as ItemDetailRoutePath);
}

export function isItemDetailRouteAvailable(locale: Locale, pathname: string) {
  return getRoute(pathname)?.locales.includes(locale) ?? false;
}

export function resolveItemRouteTarget(
  locale: Locale,
  pathname: string,
  fallback: ItemRouteFallback = "english-detail"
): ItemRouteTarget {
  const {normalized, suffix} = splitPathname(pathname);
  const route = routeAvailability.get(normalized as ItemDetailRoutePath);
  if (!route) return {locale, pathname};
  if (route.locales.includes(locale)) return {locale, pathname: `${route.pathname}${suffix}`};

  if (fallback === "localized-category") {
    const categoryPath = route.pathname.split("/").slice(0, 3).join("/");
    return {locale, pathname: categoryPath};
  }

  const canonicalLocale = route.locales.includes("en") ? "en" : route.locales[0];
  return {locale: canonicalLocale, pathname: `${route.pathname}${suffix}`};
}

export function localizedItemRoutePath(target: ItemRouteTarget) {
  return `/${target.locale}${target.pathname}`;
}
