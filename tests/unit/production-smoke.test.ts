import {pathToFileURL} from "node:url";
import path from "node:path";
import {describe, expect, it} from "vitest";

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
