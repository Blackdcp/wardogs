import rawContract from "../../config/traffic-protected-routes.json" with {type: "json"};

export type RouteSource = "sitemap" | "internal-link" | "ga-landing" | "ga-page" | "gsc" | "bing-search" | "bing-ai" | "legacy" | "clean-404";
export type CanonicalRouteContract = {
  path: string;
  expectedStatus: 200;
  tier: "protected" | "growth" | "support";
  sources: RouteSource[];
  locales: string[];
};
export type LegacyRouteContract = {
  path: string;
  expectedStatus: 308;
  target: string;
  sources: RouteSource[];
};
export type MissingRouteContract = {
  path: string;
  expectedStatus: 404;
  noindex: true;
  sources: RouteSource[];
};
export type TrafficRouteContract = {
  schemaVersion: 1;
  production: {origin: string; platform: "vercel-cloudflare"; baselineRevision: string};
  canonical: CanonicalRouteContract[];
  legacy: LegacyRouteContract[];
  knownMissing: MissingRouteContract[];
};

export const TRAFFIC_ROUTE_CONTRACT = rawContract as TrafficRouteContract;

export const RELEASE_CANONICAL_ROUTES = TRAFFIC_ROUTE_CONTRACT.canonical.filter(({path, tier}) =>
  tier === "protected" || path.endsWith("/tools")
);

const requiredLegacyPaths = [
  "/maps",
  "/tools/map",
  "/guides/wardogs-squad-invite",
  "/ja/guides/wardogs-squad-invite",
  "/ja/ja/guides/wardogs-squad-invite",
  "/wardogs/ja/guides/wardogs-squad-invite"
] as const;

export const RELEASE_LEGACY_ROUTES = requiredLegacyPaths.map((path) => {
  const route = TRAFFIC_ROUTE_CONTRACT.legacy.find((candidate) => candidate.path === path);
  if (!route) throw new Error(`Missing required legacy route contract: ${path}`);
  return route;
});
