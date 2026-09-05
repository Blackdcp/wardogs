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
  it("uses the known public ModDB tutorial and accepts configured public URLs", async () => {
    const monitor = await loadMonitor();
    if (!monitor) return;

    expect(monitor.DEFAULT_BACKLINK_URLS).toContain(
      "https://www.moddb.com/games/wardogs/tutorials/wardogs-beginners-guide-control-zones-cash-roles-and-teamplay"
    );
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
    expect(unavailable).toMatchObject({state: "unavailable", httpStatus: 503});
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

    const workflow = readFileSync(workflowPath, "utf8");
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
