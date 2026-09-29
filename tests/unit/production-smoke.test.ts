import {existsSync, mkdtempSync, readFileSync, rmdirSync, unlinkSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {pathToFileURL} from "node:url";
import path from "node:path";
import {describe, expect, it, vi} from "vitest";

const origin = "https://www.wardogswiki.com";
const revision = "a".repeat(40);
const deploymentPath = path.join(process.cwd(), "scripts", "deploy-production.mjs");

function htmlPage(pathname: string) {
  return `<html><head><link rel="canonical" href="${origin}${pathname}" /></head><body>WARDOGS</body></html>`;
}

function liveResponses(overrides: Record<string, Response> = {}) {
  const responses: Record<string, Response> = {
    "/api/revision": new Response(JSON.stringify({revision}), {status: 200}),
    "/en": new Response(htmlPage("/en"), {status: 200}),
    "/en/guides/wardogs-squad-guide": new Response(htmlPage("/en/guides/wardogs-squad-guide"), {status: 200}),
    "/en/guides/wardogs-known-issues": new Response(htmlPage("/en/guides/wardogs-known-issues"), {status: 200}),
    "/en/tools/map": new Response(htmlPage("/en/tools/map"), {status: 200}),
    "/sitemap.xml": new Response(`<urlset><url><loc>${origin}/en</loc></url><url><loc>${origin}/en/tools/map</loc></url></urlset>`, {status: 200}),
    "/maps": new Response(null, {status: 308, headers: {location: "/en/maps"}}),
    "/en/items/vehicles/littlebird": new Response("<meta name=\"robots\" content=\"noindex\">", {status: 404})
  };
  return {...responses, ...overrides};
}

async function verifyWith(responses: Record<string, Response>) {
  const deployment = await import(pathToFileURL(deploymentPath).href) as {
    verifyProduction: (fetchImpl: typeof fetch, siteOrigin: string, expectedRevision: string, options: {revisionAttempts: number; pause: () => Promise<void>}) => Promise<{checked: number}>;
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
  const result = await deployment.verifyProduction(fetchImpl, origin, revision, {revisionAttempts: 1, pause: async () => {}});
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
      }) => Promise<{submitted: number}>;
    };
    const snapshotDirectory = mkdtempSync(path.join(tmpdir(), "indexnow-release-"));
    const snapshotPath = path.join(snapshotDirectory, "snapshot.json");
    const events: string[] = [];
    const beforeUrl = `${origin}/en/guides/newly-removed`;
    const oldSitemap = `<urlset><url><loc>${origin}/en</loc></url><url><loc>${beforeUrl}</loc></url></urlset>`;
    const newSitemap = `<urlset><url><loc>${origin}/en</loc></url><url><loc>${origin}/en/tools/map</loc></url></urlset>`;
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
      await expect(deployment.finalizeProductionRelease({gitImpl, fetchImpl, submitImpl, snapshotPath})).resolves.toEqual({submitted: 1});
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
      }) => Promise<{submitted: number}>;
    };
    const snapshotDirectory = mkdtempSync(path.join(tmpdir(), "indexnow-retry-"));
    const snapshotPath = path.join(snapshotDirectory, "snapshot.json");
    const removed = `${origin}/en/guides/removed`;
    const oldSitemap = `<urlset><url><loc>${origin}/en</loc></url><url><loc>${removed}</loc></url></urlset>`;
    const newSitemap = `<urlset><url><loc>${origin}/en</loc></url><url><loc>${origin}/en/tools/map</loc></url></urlset>`;
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
    const options = {gitImpl, fetchImpl, submitImpl, snapshotPath};

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

  it("checks live landing pages, sitemap, exact redirect, and genuine 404 before notification", async () => {
    const {result, requested} = await verifyWith(liveResponses());

    expect(result).toEqual({checked: 8});
    expect(requested).toEqual([
      "/api/revision",
      "/en",
      "/en/guides/wardogs-squad-guide",
      "/en/guides/wardogs-known-issues",
      "/en/tools/map",
      "/sitemap.xml",
      "/maps",
      "/en/items/vehicles/littlebird"
    ]);
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

  it("rejects production if the interactive map route is still missing", async () => {
    const responses = liveResponses({"/en/tools/map": new Response("Not found", {status: 404})});
    await expect(verifyWith(responses)).rejects.toThrow(/\/en\/tools\/map returned 404/);
  });

  it("rejects production if the interactive map is missing from the sitemap", async () => {
    const responses = liveResponses({
      "/sitemap.xml": new Response(`<urlset><url><loc>${origin}/en</loc></url></urlset>`, {status: 200})
    });
    await expect(verifyWith(responses)).rejects.toThrow(/sitemap\.xml.*map URL/);
  });

  it("waits briefly for the production alias to switch to the new revision", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      verifyProduction: (fetchImpl: typeof fetch, siteOrigin: string, expectedRevision: string, options: {revisionAttempts: number; pause: () => Promise<void>}) => Promise<{checked: number}>;
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
      pause: async () => { pauses += 1; }
    })).resolves.toEqual({checked: 8});
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

    await expect(verifyWith(responses)).resolves.toMatchObject({result: {checked: 8}});
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
});
