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
    "/sitemap.xml": new Response(`<urlset><url><loc>${origin}/en</loc></url></urlset>`, {status: 200}),
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
  it("captures the pre-deploy sitemap before publishing and passes it to post-smoke notification", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      deployProduction: (options: {
        gitImpl: (...args: string[]) => string;
        spawnImpl: () => {status: number};
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
    const newSitemap = `<urlset><url><loc>${origin}/en</loc></url></urlset>`;
    const savedBefore = process.env.BEFORE_SHA;
    const savedCurrent = process.env.CURRENT_SHA;
    vi.stubEnv("INDEXNOW_BASE_SHA", "test-base-does-not-exist");
    let sitemapReads = 0;
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const pathname = new URL(String(input)).pathname;
      if (pathname === "/sitemap.xml") {
        sitemapReads += 1;
        events.push(sitemapReads === 1 ? "sitemap-before" : "sitemap-after");
        return new Response(sitemapReads === 1 ? oldSitemap : newSitemap, {status: 200});
      }
      if (pathname === "/api/revision") events.push("revision");
      const response = liveResponses()[pathname];
      if (!response) throw new Error(`Unexpected smoke request: ${pathname}`);
      return response;
    });
    const gitImpl = (...args: string[]) => {
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
      await expect(deployment.deployProduction({
        gitImpl,
        spawnImpl: () => { events.push("deploy"); expect(existsSync(snapshotPath)).toBe(true); return {status: 0}; },
        fetchImpl,
        submitImpl,
        snapshotPath
      })).resolves.toEqual({submitted: 1});
      expect(events).toEqual(["sitemap-before", "deploy", "revision", "sitemap-after", "notify"]);
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
      deployProduction: (options: {
        gitImpl: (...args: string[]) => string;
        spawnImpl: () => {status: number};
        fetchImpl: typeof fetch;
        submitImpl: (options: {previousSitemapUrls: string[]}) => Promise<{submitted: number}>;
        snapshotPath: string;
      }) => Promise<{submitted: number}>;
    };
    const snapshotDirectory = mkdtempSync(path.join(tmpdir(), "indexnow-retry-"));
    const snapshotPath = path.join(snapshotDirectory, "snapshot.json");
    const removed = `${origin}/en/guides/removed`;
    const oldSitemap = `<urlset><url><loc>${origin}/en</loc></url><url><loc>${removed}</loc></url></urlset>`;
    const newSitemap = `<urlset><url><loc>${origin}/en</loc></url></urlset>`;
    const savedBefore = process.env.BEFORE_SHA;
    const savedCurrent = process.env.CURRENT_SHA;
    vi.stubEnv("INDEXNOW_BASE_SHA", "test-base-does-not-exist");
    let sitemapReads = 0;
    let notificationAttempts = 0;
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const pathname = new URL(String(input)).pathname;
      if (pathname === "/sitemap.xml") {
        sitemapReads += 1;
        return new Response(sitemapReads === 1 ? oldSitemap : newSitemap, {status: 200});
      }
      const response = liveResponses()[pathname];
      if (!response) throw new Error(`Unexpected smoke request: ${pathname}`);
      return response;
    });
    const gitImpl = (...args: string[]) => args.join(" ") === "rev-parse HEAD" ? revision : "";
    const submitImpl = vi.fn(async ({previousSitemapUrls}: {previousSitemapUrls: string[]}) => {
      expect(previousSitemapUrls).toEqual([`${origin}/en`, removed]);
      if (++notificationAttempts === 1) throw new Error("IndexNow outage");
      return {submitted: 1};
    });
    const options = {gitImpl, spawnImpl: () => ({status: 0}), fetchImpl, submitImpl, snapshotPath};

    try {
      await expect(deployment.deployProduction(options)).rejects.toThrow("IndexNow outage");
      expect(existsSync(snapshotPath)).toBe(true);
      expect(JSON.parse(readFileSync(snapshotPath, "utf8"))).toEqual({
        base: "test-base-does-not-exist", head: revision, urls: [`${origin}/en`, removed]
      });

      await expect(deployment.deployProduction(options)).resolves.toEqual({submitted: 1});
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

  it("refuses to deploy with a snapshot belonging to a different release", async () => {
    const deployment = await import(pathToFileURL(deploymentPath).href) as {
      deployProduction: (options: {
        gitImpl: (...args: string[]) => string;
        spawnImpl: () => {status: number};
        fetchImpl: typeof fetch;
        snapshotPath: string;
      }) => Promise<{submitted: number}>;
    };
    const snapshotDirectory = mkdtempSync(path.join(tmpdir(), "indexnow-stale-"));
    const snapshotPath = path.join(snapshotDirectory, "snapshot.json");
    writeFileSync(snapshotPath, JSON.stringify({base: "older-base", head: revision, urls: [`${origin}/en`]}));
    vi.stubEnv("INDEXNOW_BASE_SHA", "current-base");
    const fetchImpl = vi.fn<typeof fetch>(async () => { throw new Error("Must not fetch for stale release."); });
    const spawnImpl = vi.fn(() => ({status: 0}));

    try {
      await expect(deployment.deployProduction({
        gitImpl: (...args: string[]) => args.join(" ") === "rev-parse HEAD" ? revision : "",
        spawnImpl,
        fetchImpl,
        snapshotPath
      })).rejects.toThrow(/snapshot.*different release/i);
      expect(fetchImpl).not.toHaveBeenCalled();
      expect(spawnImpl).not.toHaveBeenCalled();
      expect(existsSync(snapshotPath)).toBe(true);
    } finally {
      vi.unstubAllEnvs();
      unlinkSync(snapshotPath);
      rmdirSync(snapshotDirectory);
    }
  });

  it("checks live landing pages, sitemap, exact redirect, and genuine 404 before notification", async () => {
    const {result, requested} = await verifyWith(liveResponses());

    expect(result).toEqual({checked: 7});
    expect(requested).toEqual([
      "/api/revision",
      "/en",
      "/en/guides/wardogs-squad-guide",
      "/en/guides/wardogs-known-issues",
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
    })).resolves.toEqual({checked: 7});
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

    await expect(verifyWith(responses)).resolves.toMatchObject({result: {checked: 7}});
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
