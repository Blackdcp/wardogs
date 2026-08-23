import type {Locale} from "@/config/site";
import {itemLibrary} from "./item-library";

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

export const itemDetailRouteManifest: readonly ItemDetailRouteAvailability[] = itemLibrary.map((item) => ({
  pathname: `/items/${item.type}/${item.slug}`,
  locales: item.indexLocales
}));

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
