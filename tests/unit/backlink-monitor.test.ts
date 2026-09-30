import {existsSync, readFileSync} from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {describe, expect, it} from "vitest";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "monitor-backlinks.mjs");
const workflowPath = path.join(root, ".github", "workflows", "monitor-backlinks.yml");

type MonitorModule = {
  DEFAULT_BACKLINK_URLS: string[];
  buildReport: (options: Record<string, unknown>) => Promise<Record<string, unknown>>;
  checkMarginalia: (options: Record<string, unknown>) => Promise<Record<string, unknown>>;
  checkPublicBacklink: (options: Record<string, unknown>) => Promise<Record<string, unknown>>;
  formatStepSummary: (report: Record<string, unknown>) => string;
  parseBacklinkUrls: (value?: string) => string[];
};

async function loadMonitor(): Promise<MonitorModule | null> {
  expect(existsSync(scriptPath), "scripts/monitor-backlinks.mjs must exist").toBe(true);
  if (!existsSync(scriptPath)) return null;
  return import(pathToFileURL(scriptPath).href) as Promise<MonitorModule>;
}

describe("weekly backlink monitor", () => {
  it("uses verified public referrers without owner sites or duplicate ModDB aliases", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;

    expect(monitor.DEFAULT_BACKLINK_URLS).toContain(
      "https://www.moddb.com/games/wardogs/tutorials/wardogs-beginners-guide-control-zones-cash-roles-and-teamplay"
    );
    expect(monitor.DEFAULT_BACKLINK_URLS).toEqual(expect.arrayContaining([
      "https://kennel.gg/guides/reference/sources/",
      "https://kennel.gg/guides/tasks/making-money/",
      "https://kennel.gg/guides/reference/vehicles/",
      "https://kennel.gg/guides/reference/gear-and-equipment/",
      "https://wardogsmanual.wiki/tier-list",
      "https://game.savetip.co.kr/wardogs-first-match-cash-guide/",
      "https://antihype.com.br/c/games/wardogs-chefe-detalha-hora-extra-estudio-bulkhead/",
      "https://wardogs-game.com/weapons",
      "https://www.techtimes.com/articles/326774/20260906/wardogs-beta-ends-245k-players-early-access-begins-this-wednesday.htm"
    ]));
    expect(monitor.DEFAULT_BACKLINK_URLS).toHaveLength(10);
    expect(monitor.DEFAULT_BACKLINK_URLS.some((url) => /tsalon|indiedb|reddit|youtube/.test(url))).toBe(false);
    expect(monitor.parseBacklinkUrls()).toEqual(monitor.DEFAULT_BACKLINK_URLS);
    expect(monitor.parseBacklinkUrls("https://example.com/a\nhttps://example.com/b\nhttps://example.com/a"))
      .toEqual(["https://example.com/a", "https://example.com/b"]);
  });

  it("classifies a public page as active only when it links to the target site", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;

    const active = await monitor.checkPublicBacklink({
      url: "https://example.com/guide",
      targetHost: "www.wardogswiki.com",
      fetchImpl: async () => new Response(
        '<a href="https://wardogswiki.com/en/guides">WARDOGS Wiki</a>',
        {status: 200}
      )
    });
    const missing = await monitor.checkPublicBacklink({
      url: "https://example.com/removed",
      targetHost: "www.wardogswiki.com",
      fetchImpl: async () => new Response("<p>No external references.</p>", {status: 200})
    });

    expect(active).toMatchObject({state: "active", httpStatus: 200});
    expect(missing).toMatchObject({state: "missing", httpStatus: 200});
  });

  it("records actual anchor text, destination and rel, including unquoted hrefs", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;
    const result = await monitor.checkPublicBacklink({
      url: "https://example.com/sources",
      targetHost: "wardogswiki.com",
      fetchImpl: async () => new Response(
        '<a title="go > here" href="https://www.wardogswiki.com/en/items?x=1&amp;y=2" rel="nofollow noopener noreferrer"><strong>Wiki</strong> &amp; sources</a>'
        + '<A HREF=https://wardogswiki.com/en/guides REL=nofollow>Guide</A>',
        {status: 200}
      )
    });
    expect(result).toMatchObject({state: "active", links: [
      {href: "https://www.wardogswiki.com/en/items?x=1&y=2", text: "Wiki & sources", rel: ["nofollow", "noopener", "noreferrer"]},
      {href: "https://wardogswiki.com/en/guides", text: "Guide", rel: ["nofollow"]}
    ]});
  });

  it("does not count text mentions, metadata, scripts, comments or lookalike hosts", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;
    const result = await monitor.checkPublicBacklink({
      url: "https://example.com/mentions",
      targetHost: "wardogswiki.com",
      fetchImpl: async () => new Response([
        '<p>Source: wardogswiki.com</p>',
        '<link rel="canonical" href="https://wardogswiki.com/en">',
        '<!-- <a href="https://wardogswiki.com">hidden</a> -->',
        '<script>const x = `<a href="https://wardogswiki.com">data</a>`;</script>',
        '<template><a href="https://wardogswiki.com">inert</a></template>',
        '<a data-href="https://wardogswiki.com">not linked</a>',
        '<a title="href=\'https://wardogswiki.com\'">attribute text</a>',
        '<a href="https://wardogswiki.com.evil.example">lookalike</a>',
        '<a href="https://evilwardogswiki.com">lookalike</a>',
        '<a href="mailto:editor@wardogswiki.com">email</a>'
      ].join(""), {status: 200})
    });
    expect(result).toMatchObject({state: "missing", links: []});
  });

  it.each([403, 429, 503])("never reports HTTP %i as a lost backlink", async (status) => {
    const monitor = await loadMonitor();
    if (!monitor) return;
    const url = "https://example.com/protected";
    const report = await monitor.buildReport({
      backlinkUrls: [url],
      previousReport: {publicBacklinks: [{url, state: "active"}]},
      fetchImpl: async () => new Response("unavailable", {status})
    });
    expect(report).toMatchObject({publicBacklinks: [{state: "unavailable", httpStatus: status}], changes: {lost: [], gained: []}});
  });

  it("does not turn an access challenge or an availability recovery into a link change", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;
    const challenge = await monitor.checkPublicBacklink({
      url: "https://example.com/challenge", targetHost: "wardogswiki.com",
      fetchImpl: async () => new Response("<title>Just a moment...</title>", {status: 200})
    });
    expect(challenge).toMatchObject({state: "unavailable", httpStatus: 200});
    const url = "https://example.com/recovered";
    const report = await monitor.buildReport({
      backlinkUrls: [url], previousReport: {publicBacklinks: [{url, state: "unavailable"}]},
      fetchImpl: async () => new Response('<a href="https://wardogswiki.com">wiki</a>', {status: 200})
    });
    expect(report).toMatchObject({publicBacklinks: [{state: "active"}], changes: {lost: [], gained: []}});
  });

  it("marks public checks unavailable instead of failing the whole run", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;

    const result = await monitor.checkPublicBacklink({
      url: "https://example.com/timeout",
      targetHost: "wardogswiki.com",
      fetchImpl: async () => {
        throw new Error("network timeout");
      }
    });

    expect(result).toMatchObject({state: "unavailable"});
    expect(String(result.reason)).toContain("network timeout");
  });

  it("refuses to fetch logged-in Google or Bing webmaster dashboards", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;
    let requested = false;

    const result = await monitor.checkPublicBacklink({
      url: "https://www.bing.com/webmasters/home",
      targetHost: "wardogswiki.com",
      fetchImpl: async () => {
        requested = true;
        return new Response("unexpected", {status: 200});
      }
    });

    expect(result).toMatchObject({state: "skipped"});
    expect(requested).toBe(false);
  });

  it("stops redirects before fetching an authenticated dashboard", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;
    const requests: string[] = [];
    const result = await monitor.checkPublicBacklink({
      url: "https://example.com/redirect", targetHost: "wardogswiki.com",
      fetchImpl: async (url: string, options: RequestInit) => {
        requests.push(url);
        expect(options.redirect).toBe("manual");
        return new Response(null, {status: 302, headers: {location: "https://search.google.com/search-console/links"}});
      }
    });
    expect(result).toMatchObject({state: "skipped"});
    expect(requests).toEqual(["https://example.com/redirect"]);
  });

  it("resolves relative anchors against the final public redirect URL", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;
    const result = await monitor.checkPublicBacklink({
      url: "https://example.com/start", targetHost: "wardogswiki.com",
      fetchImpl: async (url: string) => url.endsWith("/start")
        ? new Response(null, {status: 301, headers: {location: "/sources/"}})
        : new Response('<a href="//www.wardogswiki.com/en">Wiki</a>', {status: 200})
    });
    expect(result).toMatchObject({state: "active", finalUrl: "https://example.com/sources/", links: [{href: "https://www.wardogswiki.com/en", rel: []}]});
  });

  it("uses Marginalia's public API and reports indexed, absent, or unavailable", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;

    const indexed = await monitor.checkMarginalia({
      targetHost: "wardogswiki.com",
      fetchImpl: async () => new Response(JSON.stringify({
        results: [{url: "https://www.wardogswiki.com/en/guides"}]
      }), {status: 200, headers: {"Content-Type": "application/json"}})
    });
    const absent = await monitor.checkMarginalia({
      targetHost: "wardogswiki.com",
      fetchImpl: async () => new Response(JSON.stringify({results: []}), {status: 200})
    });
    const unavailable = await monitor.checkMarginalia({
      targetHost: "wardogswiki.com",
      fetchImpl: async () => new Response("rate limited", {status: 503})
    });

    expect(indexed).toMatchObject({state: "indexed", resultCount: 1});
    expect(absent).toMatchObject({state: "not-indexed", resultCount: 0});
    expect(String(absent.reason)).toContain("does not establish submission-review or database-admission status");
    expect(unavailable).toMatchObject({state: "unavailable", httpStatus: 503});
  });

  it("does not interpret a malformed HTTP-200 API payload as an empty index", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;
    const result = await monitor.checkMarginalia({
      targetHost: "wardogswiki.com",
      fetchImpl: async () => new Response(JSON.stringify({error: "API unavailable"}), {status: 200})
    });
    expect(result).toMatchObject({state: "unavailable", httpStatus: 200});
  });

  it("records GSC API limitations and computes gained and lost public backlinks", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;

    const currentUrls = ["https://example.com/gained", "https://example.com/lost"];
    const previousReport = {
      publicBacklinks: [
        {url: currentUrls[0], state: "missing"},
        {url: currentUrls[1], state: "active"}
      ]
    };
    const report = await monitor.buildReport({
      now: new Date("2026-09-05T12:00:00.000Z"),
      targetUrl: "https://www.wardogswiki.com",
      backlinkUrls: currentUrls,
      previousReport,
      fetchImpl: async (input: URL | RequestInfo) => {
        const url = String(input);
        if (url.includes("gained")) {
          return new Response('<a href="https://wardogswiki.com">wiki</a>', {status: 200});
        }
        if (url.includes("lost")) return new Response("gone", {status: 200});
        return new Response(JSON.stringify({results: []}), {status: 200});
      }
    });

    expect(report).toMatchObject({
      generatedAt: "2026-09-05T12:00:00.000Z",
      googleSearchConsole: {state: "unsupported"},
      bingWebmaster: {state: "unavailable"},
      changes: {gained: [currentUrls[0]], lost: [currentUrls[1]]}
    });
    expect(String((report.googleSearchConsole as {reason: string}).reason))
      .toContain("no sitewide external-links endpoint");
  });

  it("formats a GitHub Step Summary with source limitations and changes", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;

    const summary = monitor.formatStepSummary({
      generatedAt: "2026-09-05T12:00:00.000Z",
      target: "https://www.wardogswiki.com",
      publicBacklinks: [{url: "https://example.com/guide", state: "active"}],
      marginalia: {state: "indexed"},
      googleSearchConsole: {state: "unsupported", reason: "No endpoint."},
      bingWebmaster: {state: "unavailable", reason: "No stable endpoint."},
      changes: {gained: ["https://example.com/guide"], lost: []}
    });

    expect(summary).toContain("# Weekly backlink/status monitor");
    expect(summary).toContain("Gained: 1");
    expect(summary).toContain("Google Search Console: unsupported");
    expect(summary).toContain("Bing Webmaster: unavailable");
  });

  it("defines a read-only weekly and manual workflow with report persistence", () => {
    expect(existsSync(workflowPath), ".github/workflows/monitor-backlinks.yml must exist").toBe(true);
    if (!existsSync(workflowPath)) return;

    const workflow = readFileSync(workflowPath, "utf8").replace(/\r\n/g, "\n");
    expect(workflow).toMatch(/schedule:\s*\n\s*- cron:/);
    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toContain("permissions:\n  contents: read");
    expect(workflow).toContain("node scripts/monitor-backlinks.mjs");
    expect(workflow).toContain("actions/upload-artifact@");
    expect(workflow).toContain("GITHUB_STEP_SUMMARY");
    expect(workflow).toContain("github.run_attempt");
    expect(workflow).not.toMatch(/git\s+(add|commit|push)/);
    expect(workflow).not.toContain("analytics.google.com");
    expect(workflow).not.toContain("bing.com/webmasters");
  });
});
