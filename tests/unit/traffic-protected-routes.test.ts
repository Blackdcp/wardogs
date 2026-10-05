import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";
import {locales} from "@/config/site";

type RouteSource = "sitemap" | "internal-link" | "ga-landing" | "ga-page" | "gsc" | "bing-search" | "bing-ai" | "legacy" | "clean-404";

type CanonicalRoute = {
  path: string;
  expectedStatus: 200;
  tier: "protected" | "growth" | "support";
  sources: RouteSource[];
  locales: string[];
};

type LegacyRoute = {
  path: string;
  expectedStatus: 308;
  target: string;
  sources: RouteSource[];
};

type MissingRoute = {
  path: string;
  expectedStatus: 404;
  noindex: true;
  sources: RouteSource[];
};

type RouteContract = {
  schemaVersion: 1;
  production: {origin: string; platform: "vercel-cloudflare"; baselineRevision: string};
  canonical: CanonicalRoute[];
  legacy: LegacyRoute[];
  knownMissing: MissingRoute[];
};

type TrafficEvidence = {
  path: string;
  sources: Extract<RouteSource, "ga-landing" | "ga-page" | "gsc" | "bing-search" | "bing-ai">[];
  window: string;
  evidenceKey: string;
};

type TrafficEvidenceManifest = {
  schemaVersion: 1;
  evidence: TrafficEvidence[];
};

function readContract(): RouteContract {
  return JSON.parse(readFileSync("config/traffic-protected-routes.json", "utf8")) as RouteContract;
}

function readEvidenceManifest(): TrafficEvidenceManifest {
  return JSON.parse(readFileSync("config/traffic-demand-evidence.json", "utf8")) as TrafficEvidenceManifest;
}

function duplicates(values: readonly string[]) {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

function objectKeys(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(objectKeys);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, nestedValue]) => [key, ...objectKeys(nestedValue)]);
}

describe("traffic-protected route contract", () => {
  it("separates canonical, legacy, and clean-missing routes", () => {
    const contract = readContract();
    const canonicalPaths = contract.canonical.map(({path}) => path);
    const legacyPaths = contract.legacy.map(({path}) => path);
    const missingPaths = contract.knownMissing.map(({path}) => path);
    const allPaths = [...canonicalPaths, ...legacyPaths, ...missingPaths];

    expect(contract.schemaVersion).toBe(1);
    expect(contract.production).toEqual({
      origin: "https://www.wardogswiki.com",
      platform: "vercel-cloudflare",
      baselineRevision: "e8fafbc58f6143bb19fa6009cb9e2aa36400396e"
    });
    expect(duplicates(canonicalPaths)).toEqual([]);
    expect(duplicates(legacyPaths)).toEqual([]);
    expect(duplicates(missingPaths)).toEqual([]);
    expect(duplicates(allPaths)).toEqual([]);
    expect(contract.canonical.every(({expectedStatus}) => expectedStatus === 200)).toBe(true);
    expect(contract.legacy.every(({expectedStatus, target}) => expectedStatus === 308 && target.startsWith("/"))).toBe(true);
    expect(contract.knownMissing.every(({expectedStatus, noindex}) => expectedStatus === 404 && noindex)).toBe(true);
  });

  it("keeps canonical routes localized and protects the proven catalogue entries", () => {
    const contract = readContract();
    const localePrefixes = new Set(locales.map((locale) => `/${locale}`));
    const canonicalPaths = contract.canonical.map(({path}) => path);

    expect(contract.canonical.every(({path}) => {
      const [locale] = path.split("/").filter(Boolean);
      return localePrefixes.has(`/${locale}`);
    })).toBe(true);
    expect(canonicalPaths).toContain("/ja/items");
    expect(canonicalPaths).toContain("/de/items/weapons");
    expect(locales.every((locale) => canonicalPaths.includes(`/${locale}/tools`))).toBe(true);
    expect(canonicalPaths).not.toContain("/ja/guides/wardogs-squad-invite");
  });

  it("retains the old squad invite and non-localized aliases as redirects", () => {
    const contract = readContract();
    const redirects = new Map(contract.legacy.map(({path, target}) => [path, target]));

    expect(redirects.get("/ja/guides/wardogs-squad-invite")).toBe("/ja/guides/wardogs-squad-guide");
    expect(redirects.get("/maps")).toBe("/en/maps");
    expect([...redirects.keys()].some((path) => path.startsWith("/wardogs/"))).toBe(true);
  });

  it("records at least one source on every protected route without embedding metrics", () => {
    const contract = readContract();
    expect(contract.canonical.length).toBeGreaterThan(500);
    expect(contract.canonical.every(({sources, locales: routeLocales, tier}) =>
      sources.length > 0 && routeLocales.length > 0 && ["protected", "growth", "support"].includes(tier)
    )).toBe(true);
    expect(objectKeys(contract).join(" ")).not.toMatch(/clicks|impressions|sessions|revenue|cpm/i);
  });

  it("derives protected tiers and source labels from traceable traffic evidence", () => {
    const contract = readContract();
    const manifest = readEvidenceManifest();
    const canonical = new Map(contract.canonical.map((route) => [route.path, route]));
    const legacy = new Map(contract.legacy.map((route) => [route.path, route]));

    expect(manifest.schemaVersion).toBe(1);
    expect(manifest.evidence.length).toBeGreaterThan(100);
    expect(duplicates(manifest.evidence.map(({evidenceKey}) => evidenceKey))).toEqual([]);
    expect(manifest.evidence.every(({path, sources, window, evidenceKey}) =>
      path.startsWith("/") && sources.length > 0 && Boolean(window) && Boolean(evidenceKey)
    )).toBe(true);

    for (const evidence of manifest.evidence) {
      const route = canonical.get(evidence.path);
      const redirect = legacy.get(evidence.path);
      expect(route ?? redirect, `${evidence.path} must remain canonical or redirect`).toBeDefined();
      if (route) {
        expect(route.tier, `${evidence.path} must be protected`).toBe("protected");
        expect(route.sources, `${evidence.path} must retain its evidence sources`).toEqual(
          expect.arrayContaining(evidence.sources)
        );
      } else {
        expect(canonical.has(redirect?.target ?? ""), `${evidence.path} must redirect to a canonical route`).toBe(true);
        expect(redirect?.sources, `${evidence.path} must retain its evidence sources`).toEqual(
          expect.arrayContaining(evidence.sources)
        );
      }
    }

    expect(objectKeys(manifest).join(" ")).not.toMatch(/clicks|impressions|sessions|revenue|cpm|citations/i);
  });

  it("protects the latest GSC and Bing AI top-page observations", () => {
    const contract = readContract();
    const manifest = readEvidenceManifest();
    const canonical = new Map(contract.canonical.map((route) => [route.path, route]));
    const gscWindow = "2026-09-27/2026-10-03";
    const bingSearchWindow = "2026-09-27/2026-10-03";
    const bingAiWindow = "2026-09-27/2026-10-03";

    const latestGscTopPages = [
      "/ja/guides/wardogs-progression-wipes-guide",
      "/ja/guides/wardogs-squad-guide",
      "/ja/items",
      "/en/guides/wardogs-cargo-guide",
      "/ja/guides/wardogs-fob-guide",
      "/ja/guides/wardogs-towers-guide",
      "/ja/guides/wardogs-crash-fix",
      "/ja/guides/wardogs-cargo-guide",
      "/ja/guides/wardogs-mortar-guide",
      "/en/items/weapons"
    ];
    const latestBingAiTopPages = [
      "/en",
      "/en/guides/wardogs-crash-fix",
      "/en/guides/wardogs-controls",
      "/en/guides/wardogs-helicopter-guide",
      "/en/guides/wardogs-cargo-guide",
      "/en/guides/wardogs-best-settings",
      "/en/guides/wardogs-fob-guide",
      "/en/guides/wardogs-mortar-guide",
      "/en/guides/wardogs-gameplay",
      "/en/guides/wardogs-towers-guide",
      "/en/guides/wardogs-ammo-reload-guide",
      "/en/guides/wardogs-patch-notes",
      "/en/guides/wardogs-game-developers",
      "/en/guides/wardogs-system-requirements",
      "/en/guides/wardogs-ps5",
      "/en/guides/wardogs-beta",
      "/en/guides/wardogs-server-status",
      "/en/guides/wardogs-artillery-guide",
      "/en/guides/wardogs-squad-guide",
      "/en/guides/wardogs-price",
      "/en/guides/wardogs-linux-proton",
      "/en/videos/wardogs-helicopter-flight-guide",
      "/zh-cn/guides/wardogs-server-status",
      "/ja/guides/wardogs-crash-fix",
      "/ja/guides/wardogs-server-status"
    ];
    const latestBingSearchTopPages = [
      "/en",
      "/ja",
      "/en/videos",
      "/en/guides/wardogs-crash-fix",
      "/en/guides/wardogs-controls",
      "/en/guides/wardogs-helicopter-guide",
      "/en/guides/wardogs-best-settings",
      "/en/guides/wardogs-patch-notes",
      "/en/guides/wardogs-fob-guide",
      "/en/guides/wardogs-gameplay",
      "/en/guides/wardogs-mortar-guide",
      "/en/guides/wardogs-cargo-guide",
      "/en/guides/wardogs-towers-guide",
      "/en/guides/wardogs-season-2",
      "/en/guides/wardogs-discord",
      "/en/guides/wardogs-ammo-reload-guide",
      "/en/guides/wardogs-steam",
      "/en/guides/wardogs-system-requirements",
      "/en/guides/wardogs-price",
      "/en/guides/wardogs-server-status",
      "/en/guides/wardogs-money-guide",
      "/en/guides/wardogs-artillery-guide",
      "/en/guides/wardogs-map",
      "/ja/guides/wardogs-crash-fix",
      "/ja/guides/wardogs-progression-wipes-guide"
    ];

    for (const path of latestGscTopPages) {
      const evidence = manifest.evidence.find((entry) =>
        entry.path === path && entry.sources.includes("gsc") && entry.window.includes(gscWindow)
      );
      expect(evidence, `${path} must retain the latest GSC evidence window`).toBeDefined();
      expect(canonical.get(path)?.tier).toBe("protected");
    }
    for (const path of latestBingAiTopPages) {
      const evidence = manifest.evidence.find((entry) =>
        entry.path === path && entry.sources.includes("bing-ai") && entry.window.includes(bingAiWindow)
      );
      expect(evidence, `${path} must retain the latest Bing AI evidence window`).toBeDefined();
      expect(canonical.get(path)?.tier).toBe("protected");
    }
    for (const path of latestBingSearchTopPages) {
      const evidence = manifest.evidence.find((entry) =>
        entry.path === path && entry.sources.includes("bing-search") && entry.window.includes(bingSearchWindow)
      );
      expect(evidence, `${path} must retain the latest Bing Search evidence window`).toBeDefined();
      expect(canonical.get(path)?.tier).toBe("protected");
    }

    for (const path of [
      "/en/guides/wardogs-beta",
      "/en/videos/wardogs-vehicle-cargo-logistics",
      "/en/videos/wardogs-best-settings"
    ]) {
      const evidence = manifest.evidence.find((entry) =>
        entry.path === path && entry.sources.includes("bing-ai") && entry.window === "2026-09-04/2026-10-03"
      );
      expect(evidence, `${path} must retain the 30-day Bing AI evidence window`).toBeDefined();
      expect(canonical.get(path)?.tier).toBe("protected");
    }
  });
});
