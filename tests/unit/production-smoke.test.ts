import {existsSync, mkdtempSync, readFileSync, rmdirSync, unlinkSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {pathToFileURL} from "node:url";
import path from "node:path";
import {describe, expect, it, vi} from "vitest";

const origin = "https://www.wardogswiki.com";
const revision = "a".repeat(40);
const deploymentPath = path.join(process.cwd(), "scripts", "deploy-production.mjs");
const smokeContract = {
  schemaVersion: 1,
  production: {origin, platform: "vercel-cloudflare", baselineRevision: "e".repeat(40)},
  canonical: [
    "/en", "/ja", "/en/maps", "/ja/maps", "/en/items", "/ja/items", "/en/tools/map", "/ja/tools/map"
  ].map((routePath) => ({
    path: routePath,
    expectedStatus: 200,
    tier: routePath === "/en" || routePath === "/ja" ? "protected" : "growth",
    sources: ["sitemap"],
    locales: [routePath.split("/")[1]]
  })),
  legacy: [{path: "/maps", expectedStatus: 308, target: "/en/maps", sources: ["legacy"]}],
  knownMissing: [{path: "/en/items/vehicles/littlebird", expectedStatus: 404, noindex: true, sources: ["clean-404"]}]
};
const releaseSitemap = `<urlset>${smokeContract.canonical.map(({path: routePath}) => `<url><loc>${origin}${routePath}</loc></url>`).join("")}</urlset>`;

function htmlPage(pathname: string) {
  const suffix = pathname.replace(/^\/(?:en|ja)/, "") || "";
  const alternates = ["en", "ja"].map((locale) =>
    `<link rel="alternate" hreflang="${locale}" href="${origin}/${locale}${suffix}" />`
  ).join("");
  const homepage = /^\/(?:en|ja)$/.test(pathname)
    ? `<main><h1>WARDOGS Wiki</h1>${["command", "proven-demand", "live-intel", "workbench", "database", "library"].map((section) => `<section data-home-section="${section}"></section>`).join("")}<button data-home-task="search">Search</button><a href="${pathname}/items" data-home-task="catalogue">Items</a><aside data-page-ad-inventory="home"><div data-ad-container="rectangle"></div><div data-ad-slot="adsterra-native"></div></aside></main>`
    : "<main><h1>WARDOGS Reference</h1></main>";
  return `<html><head><title>WARDOGS protected reference</title><meta name="description" content="A complete WARDOGS reference page with verified gameplay guidance and current navigation." /><link rel="canonical" href="${origin}${pathname}" />${alternates}<link rel="alternate" hreflang="x-default" href="${origin}/en${suffix}" /></head><body>${homepage}<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"WARDOGS Reference"}</script></body></html>`;
}

function liveResponses(overrides: Record<string, Response> = {}) {
  const responses: Record<string, Response> = {
    "/api/revision": new Response(JSON.stringify({revision}), {status: 200}),
    ...Object.fromEntries(smokeContract.canonical.map(({path: routePath}) => [routePath, new Response(htmlPage(routePath), {status: 200})])),
    "/sitemap.xml": new Response(releaseSitemap, {status: 200}),
    "/maps": new Response(null, {status: 308, headers: {location: "/en/maps"}}),
    "/en/items/vehicles/littlebird": new Response("<meta name=\"robots\" content=\"noindex\">", {status: 404})
  };
  return {...responses, ...overrides};
}

async function verifyWith(responses: Record<string, Response>) {
  const deployment = await import(pathToFileURL(deploymentPath).href) as {
    verifyProduction: (fetchImpl: typeof fetch, siteOrigin: string, expectedRevision: string, options: {revisionAttempts: number; pause: () => Promise<void>; contract: typeof smokeContract}) => Promise<{checked: number}>;
  };
  const requested: string[] = [];
  const fetchImpl = (async (input: string | URL | Request, options?: RequestInit) => {
    const pathname = new URL(String(input)).pathname;
    requested.push(pathname);
    expect(options?.redirect).toBe("manual");
    const response = responses[pathname];
    if (!response) throw new Error(`Unexpected smoke request: ${pathname}`);
    return response;
  }) as typeof fetch;
  const result = await deployment.verifyProduction(fetchImpl, origin, revision, {revisionAttempts: 1, pause: async () => {}, contract: smokeContract});
  return {result, requested};
}

describe("production release smoke", () => {
  it("prepares the old sitemap before push and finalizes the existing production build without deploying", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      prepareProductionRelease: (options: {
        gitImpl: (...args: string[]) => string;
        fetchImpl: typeof fetch;
        snapshotPath: string;
      }) => Promise<{prepared: number}>;
      finalizeProductionRelease: (options: {
        gitImpl: (...args: string[]) => string;
        fetchImpl: typeof fetch;
        submitImpl: (options: {previousSitemapUrls: string[]}) => Promise<{submitted: number}>;
        snapshotPath: string;
        smokeOptions: {contract: typeof smokeContract; revisionAttempts: number; pause: () => Promise<void>};
      }) => Promise<{submitted: number}>;
    };
    const snapshotDirectory = mkdtempSync(path.join(tmpdir(), "indexnow-release-"));
    const snapshotPath = path.join(snapshotDirectory, "snapshot.json");
    const events: string[] = [];
    const beforeUrl = `${origin}/en/guides/newly-removed`;
    const oldSitemap = `<urlset><url><loc>${origin}/en</loc></url><url><loc>${beforeUrl}</loc></url></urlset>`;
    const newSitemap = releaseSitemap;
    const savedBefore = process.env.BEFORE_SHA;
    const savedCurrent = process.env.CURRENT_SHA;
    const base = "b".repeat(40);
    vi.stubEnv("INDEXNOW_BASE_SHA", base);
    let sitemapReads = 0;
    let revisionReads = 0;
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const pathname = new URL(String(input)).pathname;
      if (pathname === "/sitemap.xml") {
        sitemapReads += 1;
        events.push(sitemapReads === 1 ? "sitemap-before" : "sitemap-after");
        return new Response(sitemapReads === 1 ? oldSitemap : newSitemap, {status: 200});
      }
      if (pathname === "/api/revision") {
        revisionReads += 1;
        events.push(revisionReads === 1 ? "base-revision" : "release-revision");
        return new Response(JSON.stringify({revision: revisionReads === 1 ? base : revision}), {status: 200});
      }
      const response = liveResponses()[pathname];
      if (!response) throw new Error(`Unexpected smoke request: ${pathname}`);
      return response;
    });
    const gitImpl = (...args: string[]) => {
      if (args.join(" ") === "branch --show-current") return "main";
      if (args.join(" ") === "rev-parse HEAD") return revision;
      if (args.join(" ") === "status --porcelain") return "";
      return "";
    };
    const submitImpl = vi.fn(async ({previousSitemapUrls}: {previousSitemapUrls: string[]}) => {
      events.push("notify");
      expect(existsSync(snapshotPath)).toBe(true);
      expect(previousSitemapUrls).toEqual([`${origin}/en`, beforeUrl]);
      return {submitted: 1};
    });

    try {
      await expect(deployment.prepareProductionRelease({
        gitImpl,
        fetchImpl,
        snapshotPath
      })).resolves.toEqual({prepared: 2});
      expect(events).toEqual(["base-revision", "sitemap-before"]);
      expect(existsSync(snapshotPath)).toBe(true);
      await expect(deployment.finalizeProductionRelease({
        gitImpl, fetchImpl, submitImpl, snapshotPath,
        smokeOptions: {contract: smokeContract, revisionAttempts: 1, pause: async () => {}}
      })).resolves.toEqual({submitted: 1});
      expect(events).toEqual(["base-revision", "sitemap-before", "release-revision", "sitemap-after", "notify"]);
      expect(submitImpl).toHaveBeenCalledTimes(1);
      expect(existsSync(snapshotPath)).toBe(false);
    } finally {
      vi.unstubAllEnvs();
      if (savedBefore === undefined) delete process.env.BEFORE_SHA;
      else process.env.BEFORE_SHA = savedBefore;
      if (savedCurrent === undefined) delete process.env.CURRENT_SHA;
      else process.env.CURRENT_SHA = savedCurrent;
      if (existsSync(snapshotPath)) unlinkSync(snapshotPath);
      rmdirSync(snapshotDirectory);
    }
  });

  it("reuses the saved pre-deploy sitemap after notification fails, then clears it on success", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      prepareProductionRelease: (options: {
        gitImpl: (...args: string[]) => string;
        fetchImpl: typeof fetch;
        snapshotPath: string;
      }) => Promise<{prepared: number}>;
      finalizeProductionRelease: (options: {
        gitImpl: (...args: string[]) => string;
        fetchImpl: typeof fetch;
        submitImpl: (options: {previousSitemapUrls: string[]}) => Promise<{submitted: number}>;
        snapshotPath: string;
        smokeOptions: {contract: typeof smokeContract; revisionAttempts: number; pause: () => Promise<void>};
      }) => Promise<{submitted: number}>;
    };
    const snapshotDirectory = mkdtempSync(path.join(tmpdir(), "indexnow-retry-"));
    const snapshotPath = path.join(snapshotDirectory, "snapshot.json");
    const removed = `${origin}/en/guides/removed`;
    const oldSitemap = `<urlset><url><loc>${origin}/en</loc></url><url><loc>${removed}</loc></url></urlset>`;
    const newSitemap = releaseSitemap;
    const savedBefore = process.env.BEFORE_SHA;
    const savedCurrent = process.env.CURRENT_SHA;
    const base = "b".repeat(40);
    vi.stubEnv("INDEXNOW_BASE_SHA", base);
    let sitemapReads = 0;
    let revisionReads = 0;
    let notificationAttempts = 0;
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const pathname = new URL(String(input)).pathname;
      if (pathname === "/sitemap.xml") {
        sitemapReads += 1;
        return new Response(sitemapReads === 1 ? oldSitemap : newSitemap, {status: 200});
      }
      if (pathname === "/api/revision") {
        revisionReads += 1;
        return new Response(JSON.stringify({revision: revisionReads === 1 ? base : revision}), {status: 200});
      }
      const response = liveResponses()[pathname];
      if (!response) throw new Error(`Unexpected smoke request: ${pathname}`);
      return response;
    });
    const gitImpl = (...args: string[]) => args.join(" ") === "branch --show-current" ? "main" : args.join(" ") === "rev-parse HEAD" ? revision : "";
    const submitImpl = vi.fn(async ({previousSitemapUrls}: {previousSitemapUrls: string[]}) => {
      expect(previousSitemapUrls).toEqual([`${origin}/en`, removed]);
      if (++notificationAttempts === 1) throw new Error("IndexNow outage");
      return {submitted: 1};
    });
    const options = {
      gitImpl, fetchImpl, submitImpl, snapshotPath,
      smokeOptions: {contract: smokeContract, revisionAttempts: 1, pause: async () => {}}
    };

    try {
      await expect(deployment.prepareProductionRelease({gitImpl, fetchImpl, snapshotPath})).resolves.toEqual({prepared: 2});
      await expect(deployment.finalizeProductionRelease(options)).rejects.toThrow("IndexNow outage");
      expect(existsSync(snapshotPath)).toBe(true);
      expect(JSON.parse(readFileSync(snapshotPath, "utf8"))).toEqual({
        base, head: revision, urls: [`${origin}/en`, removed]
      });

      await expect(deployment.finalizeProductionRelease(options)).resolves.toEqual({submitted: 1});
      expect(sitemapReads).toBe(3);
      expect(submitImpl).toHaveBeenCalledTimes(2);
      expect(existsSync(snapshotPath)).toBe(false);
    } finally {
      vi.unstubAllEnvs();
      if (savedBefore === undefined) delete process.env.BEFORE_SHA;
      else process.env.BEFORE_SHA = savedBefore;
      if (savedCurrent === undefined) delete process.env.CURRENT_SHA;
      else process.env.CURRENT_SHA = savedCurrent;
      if (existsSync(snapshotPath)) unlinkSync(snapshotPath);
      rmdirSync(snapshotDirectory);
    }
  });

  it("refuses to prepare with a snapshot belonging to a different release", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      prepareProductionRelease: (options: {
        gitImpl: (...args: string[]) => string;
        fetchImpl: typeof fetch;
        snapshotPath: string;
      }) => Promise<{prepared: number}>;
    };
    const snapshotDirectory = mkdtempSync(path.join(tmpdir(), "indexnow-stale-"));
    const snapshotPath = path.join(snapshotDirectory, "snapshot.json");
    writeFileSync(snapshotPath, JSON.stringify({base: "older-base", head: revision, urls: [`${origin}/en`]}));
    vi.stubEnv("INDEXNOW_BASE_SHA", "current-base");
    const fetchImpl = vi.fn<typeof fetch>(async () => { throw new Error("Must not fetch for stale release."); });

    try {
      await expect(deployment.prepareProductionRelease({
        gitImpl: (...args: string[]) => args.join(" ") === "branch --show-current" ? "main" : args.join(" ") === "rev-parse HEAD" ? revision : "",
        fetchImpl,
        snapshotPath
      })).rejects.toThrow(/snapshot.*different release/i);
      expect(fetchImpl).not.toHaveBeenCalled();
      expect(existsSync(snapshotPath)).toBe(true);
    } finally {
      vi.unstubAllEnvs();
      unlinkSync(snapshotPath);
      rmdirSync(snapshotDirectory);
    }
  });

  it("refuses to snapshot a live site whose revision is not INDEXNOW_BASE_SHA", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      prepareProductionRelease: (options: {gitImpl: (...args: string[]) => string; fetchImpl: typeof fetch; snapshotPath: string}) => Promise<unknown>;
    };
    const snapshotDirectory = mkdtempSync(path.join(tmpdir(), "indexnow-wrong-base-"));
    const snapshotPath = path.join(snapshotDirectory, "snapshot.json");
    const base = "b".repeat(40);
    vi.stubEnv("INDEXNOW_BASE_SHA", base);
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      expect(new URL(String(input)).pathname).toBe("/api/revision");
      return new Response(JSON.stringify({revision: "c".repeat(40)}), {status: 200});
    });

    try {
      await expect(deployment.prepareProductionRelease({
        gitImpl: (...args: string[]) => args.join(" ") === "branch --show-current" ? "main" : args.join(" ") === "rev-parse HEAD" ? revision : "",
        fetchImpl,
        snapshotPath
      })).rejects.toThrow(/live revision.*INDEXNOW_BASE_SHA/);
      expect(fetchImpl).toHaveBeenCalledTimes(1);
      expect(existsSync(snapshotPath)).toBe(false);
    } finally {
      vi.unstubAllEnvs();
      rmdirSync(snapshotDirectory);
    }
  });

  it("never finalizes without a pre-push snapshot", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      finalizeProductionRelease: (options: {
        gitImpl: (...args: string[]) => string;
        fetchImpl: typeof fetch;
        submitImpl: () => Promise<unknown>;
        snapshotPath: string;
      }) => Promise<unknown>;
    };
    const snapshotDirectory = mkdtempSync(path.join(tmpdir(), "indexnow-missing-"));
    const fetchImpl = vi.fn<typeof fetch>(async () => { throw new Error("Must not fetch before snapshot validation."); });
    const submitImpl = vi.fn(async () => ({}));
    vi.stubEnv("INDEXNOW_BASE_SHA", "test-base");

    try {
      await expect(deployment.finalizeProductionRelease({
        gitImpl: (...args: string[]) => args.join(" ") === "branch --show-current" ? "main" : args.join(" ") === "rev-parse HEAD" ? revision : "",
        fetchImpl,
        submitImpl,
        snapshotPath: path.join(snapshotDirectory, "snapshot.json")
      })).rejects.toThrow(/snapshot.*missing.*prepare/i);
      expect(fetchImpl).not.toHaveBeenCalled();
      expect(submitImpl).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllEnvs();
      rmdirSync(snapshotDirectory);
    }
  });

  it("refuses a feature-branch release before reading the live sitemap", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      prepareProductionRelease: (options: {gitImpl: (...args: string[]) => string; fetchImpl: typeof fetch; snapshotPath: string}) => Promise<unknown>;
    };
    const fetchImpl = vi.fn<typeof fetch>(async () => { throw new Error("Must not fetch from a feature branch."); });

    await expect(deployment.prepareProductionRelease({
      gitImpl: (...args: string[]) => args.join(" ") === "branch --show-current" ? "codex/old-feature" : "",
      fetchImpl,
      snapshotPath: path.join(tmpdir(), "unused-indexnow-snapshot.json")
    })).rejects.toThrow(/must run on main/i);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("refuses production release commands in the auxiliary Pages environment before Git or network access", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      prepareProductionRelease: (options: {gitImpl: (...args: string[]) => string; fetchImpl: typeof fetch; snapshotPath: string}) => Promise<unknown>;
    };
    vi.stubEnv("GITHUB_PAGES", "true");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://blackdcp.github.io/wardogs");
    const gitImpl = vi.fn<(...args: string[]) => string>(() => "");
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response("unexpected", {status: 200}));
    try {
      await expect(deployment.prepareProductionRelease({
        gitImpl,
        fetchImpl,
        snapshotPath: path.join(tmpdir(), "unused-pages-release.json")
      })).rejects.toThrow(/production.*Pages/i);
      expect(gitImpl).not.toHaveBeenCalled();
      expect(fetchImpl).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("checks live landing pages, sitemap, exact redirect, and genuine 404 before notification", async () => {
    const {result, requested} = await verifyWith(liveResponses());

    expect(result).toEqual({checked: 12});
    expect(new Set(requested)).toEqual(new Set([
      "/api/revision", "/sitemap.xml",
      ...smokeContract.canonical.map(({path: routePath}) => routePath),
      ...smokeContract.legacy.map(({path: routePath}) => routePath),
      ...smokeContract.knownMissing.map(({path: routePath}) => routePath)
    ]));
  });

  it("rejects a real 404 response that search engines could still index", async () => {
    const responses = liveResponses({
      "/en/items/vehicles/littlebird": new Response("<html><body>Not found</body></html>", {status: 404})
    });

    await expect(verifyWith(responses)).rejects.toThrow(/404.*noindex/);
  });

  it("rejects a stale production alias before notifying IndexNow", async () => {
    const responses = liveResponses({
      "/api/revision": new Response(JSON.stringify({revision: "b".repeat(40)}), {status: 200})
    });

    await expect(verifyWith(responses)).rejects.toThrow(/revision.*expected/i);
  });

  it("rejects a Japanese homepage canonical pointing at English", async () => {
    await expect(verifyWith(liveResponses({
      "/ja": new Response(htmlPage("/en"), {status: 200})
    }))).rejects.toThrow(/\/ja.*canonical/);
  });

  it.each(["html", "header"])("rejects noindex on a key landing page via %s", async (source) => {
    await expect(verifyWith(liveResponses({
      "/ja": new Response(htmlPage("/ja") + (source === "html" ? '<meta name="robots" content="noindex">' : ""), {
        status: 200, headers: source === "header" ? {"x-robots-tag": "noindex"} : {}
      })
    }))).rejects.toThrow(/\/ja.*noindex/);
  });

  it("rejects production if the interactive map route is still missing", async () => {
    const responses = liveResponses({"/en/tools/map": new Response("Not found", {status: 404})});
    await expect(verifyWith(responses)).rejects.toThrow(/\/en\/tools\/map returned 404/);
  });

  it("rejects production if the interactive map is missing from the sitemap", async () => {
    const responses = liveResponses({
      "/sitemap.xml": new Response(`<urlset><url><loc>${origin}/en</loc></url></urlset>`, {status: 200})
    });
    await expect(verifyWith(responses)).rejects.toThrow(/sitemap\.xml.*missing.*\/en\/tools\/map/);
  });

  it("waits briefly for the production alias to switch to the new revision", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      verifyProduction: (fetchImpl: typeof fetch, siteOrigin: string, expectedRevision: string, options: {revisionAttempts: number; pause: () => Promise<void>; contract: typeof smokeContract}) => Promise<{checked: number}>;
    };
    const responses = liveResponses();
    let checks = 0;
    let pauses = 0;
    const fetchImpl = (async (input: string | URL | Request) => {
      const pathname = new URL(String(input)).pathname;
      if (pathname === "/api/revision" && ++checks === 1) {
        return new Response(JSON.stringify({revision: "b".repeat(40)}), {status: 200});
      }
      return responses[pathname];
    }) as typeof fetch;

    await expect(deployment.verifyProduction(fetchImpl, origin, revision, {
      revisionAttempts: 2,
      pause: async () => { pauses += 1; },
      contract: smokeContract
    })).resolves.toEqual({checked: 12});
    expect(checks).toBe(2);
    expect(pauses).toBe(1);
  });

  it("allows an unrelated Link preload header on a clean 404", async () => {
    const responses = liveResponses({
      "/en/items/vehicles/littlebird": new Response("<meta name=\"robots\" content=\"noindex\">", {
        status: 404,
        headers: {link: '</_next/static/chunks/app.js>; rel="preload"; as="script"'}
      })
    });

    await expect(verifyWith(responses)).resolves.toMatchObject({result: {checked: 12}});
  });

  it("rejects a canonical Link header on a 404", async () => {
    const responses = liveResponses({
      "/en/items/vehicles/littlebird": new Response("<meta name=\"robots\" content=\"noindex\">", {
        status: 404,
        headers: {link: `<${origin}/en/items/vehicles/littlebird>; rel="canonical"`}
      })
    });

    await expect(verifyWith(responses)).rejects.toThrow(/404.*noindex/);
  });

  it("rejects a 404 that canonicals to another page", async () => {
    const responses = liveResponses({
      "/en/items/vehicles/littlebird": new Response(
        `<meta name="robots" content="noindex"><link rel="canonical" href="${origin}/en">`,
        {status: 404}
      )
    });

    await expect(verifyWith(responses)).rejects.toThrow(/404.*noindex/);
  });

  it("loads the complete generated traffic contract for the real release gate", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      loadTrafficRouteContract: () => typeof smokeContract;
    };
    const contract = deployment.loadTrafficRouteContract();

    expect(contract.production).toMatchObject({origin, platform: "vercel-cloudflare"});
    expect(contract.canonical.length).toBeGreaterThan(1_300);
    expect(contract.legacy.length).toBeGreaterThan(2_800);
    expect(contract.knownMissing).toEqual(expect.arrayContaining([
      expect.objectContaining({path: "/en/items/vehicles/littlebird", expectedStatus: 404, noindex: true})
    ]));
  });

  it("aggregates route failures instead of stopping after the first broken asset", async () => {
    const responses = liveResponses({
      "/en": new Response("missing", {status: 404}),
      "/ja": new Response(`${htmlPage("/ja")}<meta name="robots" content="noindex">`, {status: 200})
    });

    await expect(verifyWith(responses)).rejects.toThrow(/\/en returned 404[\s\S]*\/ja unexpectedly has noindex/);
  });

  it("retries a transport error or 5xx once, while keeping route concurrency at six", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      verifyProduction: (fetchImpl: typeof fetch, siteOrigin: string, expectedRevision: string, options: {
        revisionAttempts: number; pause: () => Promise<void>; contract: typeof smokeContract; concurrency: number;
      }) => Promise<{checked: number}>;
    };
    const attempts = new Map<string, number>();
    let active = 0;
    let maxActive = 0;
    const fetchImpl = (async (input: string | URL | Request) => {
      const pathname = new URL(String(input)).pathname;
      const attempt = (attempts.get(pathname) ?? 0) + 1;
      attempts.set(pathname, attempt);
      if (pathname === "/api/revision") return new Response(JSON.stringify({revision}), {status: 200});
      if (pathname === "/sitemap.xml") return new Response(releaseSitemap, {status: 200});
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 1));
      active -= 1;
      if (pathname === "/en/tools/map" && attempt === 1) return new Response("retry", {status: 503});
      if (pathname === "/ja/tools/map" && attempt === 1) throw new TypeError("socket reset");
      if (pathname === "/maps") return new Response(null, {status: 308, headers: {location: "/en/maps"}});
      if (pathname === "/en/items/vehicles/littlebird") return new Response('<meta name="robots" content="noindex">', {status: 404});
      return new Response(htmlPage(pathname), {status: 200});
    }) as typeof fetch;

    await expect(deployment.verifyProduction(fetchImpl, origin, revision, {
      revisionAttempts: 1,
      pause: async () => {},
      contract: smokeContract,
      concurrency: 6
    })).resolves.toEqual({checked: 12});
    expect(attempts.get("/en/tools/map")).toBe(2);
    expect(attempts.get("/ja/tools/map")).toBe(2);
    expect(maxActive).toBeLessThanOrEqual(6);
  });

  it("rejects hreflang outside the protected canonical set and a homepage without its frozen ad inventory", async () => {
    const badAlternate = htmlPage("/en/tools/map").replace(`${origin}/ja/tools/map`, `${origin}/ja/tools/removed`);
    const badHome = htmlPage("/en").replace(' data-page-ad-inventory="home"', "");
    const responses = liveResponses({
      "/en/tools/map": new Response(badAlternate, {status: 200}),
      "/en": new Response(badHome, {status: 200})
    });

    await expect(verifyWith(responses)).rejects.toThrow(/\/en.*ad inventory[\s\S]*\/en\/tools\/map.*hreflang/);
  });

  it("rejects sitemap and legacy redirect URLs that reuse a protected pathname on another origin", async () => {
    const foreignSitemap = releaseSitemap.replace(
      `${origin}/en/tools/map`,
      "https://foreign.invalid/en/tools/map"
    );
    const responses = liveResponses({
      "/sitemap.xml": new Response(foreignSitemap, {status: 200}),
      "/maps": new Response(null, {status: 308, headers: {location: "https://foreign.invalid/en/maps"}})
    });

    await expect(verifyWith(responses)).rejects.toThrow(/sitemap\.xml.*foreign[\s\S]*\/maps.*foreign\.invalid/);
  });

  it("rejects canonical entity pages without basic search metadata, one H1, and valid JSON-LD", async () => {
    const sparse = htmlPage("/en/items")
      .replace(/<title>[\s\S]*?<\/title>/, "")
      .replace(/<meta name="description"[^>]*>/, "")
      .replace(/<h1>[\s\S]*?<\/h1>/, "")
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");

    await expect(verifyWith(liveResponses({
      "/en/items": new Response(sparse, {status: 200})
    }))).rejects.toThrow(/\/en\/items.*title[\s\S]*description[\s\S]*one H1[\s\S]*JSON-LD/);
  });

  it("gives route verification a fresh deadline after revision polling", async () => {
    vi.useFakeTimers();
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      verifyProduction: (fetchImpl: typeof fetch, siteOrigin: string, expectedRevision: string, options: {
        revisionAttempts: number;
        pause: () => Promise<void>;
        retryPause: () => Promise<void>;
        contract: typeof smokeContract;
        concurrency: number;
        timeoutMs: number;
      }) => Promise<{checked: number}>;
    };
    const responses = liveResponses();
    let revisionChecks = 0;
    let revisionSignal: AbortSignal | null | undefined;
    let routeSignal: AbortSignal | null | undefined;
    const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
      const pathname = new URL(String(input)).pathname;
      if (pathname === "/api/revision") {
        revisionSignal ??= init?.signal;
        expect(init?.signal).toBe(revisionSignal);
        revisionChecks += 1;
        return new Response(JSON.stringify({
          revision: revisionChecks === 1 ? "b".repeat(40) : revision
        }), {status: 200});
      }
      routeSignal ??= init?.signal;
      expect(init?.signal).toBe(routeSignal);
      expect(init?.signal?.aborted).toBe(false);
      await new Promise((resolve) => setTimeout(resolve, 20));
      const response = responses[pathname];
      if (!response) throw new Error(`Unexpected smoke request: ${pathname}`);
      return response;
    }) as typeof fetch;

    try {
      const verification = deployment.verifyProduction(fetchImpl, origin, revision, {
        revisionAttempts: 2,
        pause: () => new Promise((resolve) => setTimeout(resolve, 90)),
        retryPause: async () => {},
        contract: smokeContract,
        concurrency: 6,
        timeoutMs: 100
      });
      const expectation = expect(verification).resolves.toEqual({checked: 12});
      await vi.advanceTimersByTimeAsync(250);
      await expectation;
      expect(revisionChecks).toBe(2);
      expect(routeSignal).not.toBe(revisionSignal);
    } finally {
      vi.useRealTimers();
    }
  });

  it("applies the release deadline to revision polling and aborts outstanding work", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      verifyProduction: (fetchImpl: typeof fetch, siteOrigin: string, expectedRevision: string, options: {
        revisionAttempts: number; pause: () => Promise<void>; contract: typeof smokeContract; timeoutMs: number;
      }) => Promise<{checked: number}>;
    };
    let observedSignal: AbortSignal | undefined;
    const fetchImpl = (async (_input: string | URL | Request, init?: RequestInit) => {
      observedSignal = init?.signal as AbortSignal | undefined;
      return new Response(JSON.stringify({revision: "b".repeat(40)}), {status: 200});
    }) as typeof fetch;

    await expect(deployment.verifyProduction(fetchImpl, origin, revision, {
      revisionAttempts: 2,
      pause: () => new Promise((resolve) => setTimeout(resolve, 30)),
      contract: smokeContract,
      timeoutMs: 5
    })).rejects.toThrow(/deadline/);
    expect(observedSignal?.aborted).toBe(true);
  });
});
