import {existsSync} from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {describe, expect, it} from "vitest";

type WidgetRouteModule = {
  dynamic: string;
  GET: () => Promise<Response> | Response;
};

async function loadWidgetRoute(): Promise<WidgetRouteModule | null> {
  const routePath = path.resolve("src/app/embed/status/route.ts");
  if (!existsSync(routePath)) return null;
  return import(pathToFileURL(routePath).href) as Promise<WidgetRouteModule>;
}

describe("embed/status", () => {
  it("renders a standalone sourced status widget with a factual countdown", async () => {
    const route = await loadWidgetRoute();

    expect(route, "src/app/embed/status/route.ts must exist").not.toBeNull();
    if (!route) return;

    const response = await route.GET();
    const body = await response.text();

    expect(route.dynamic).toBe("force-static");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(body).toMatch(/^<!doctype html>/i);
    expect(body).toContain('data-event-ends-at="2026-09-06T08:00:00Z"');
    expect(body).toContain('data-early-access-date="2026-09-10"');
    expect(body).toContain("Exact Early Access unlock time has not been announced.");
    expect(body).toContain("https://steamcommunity.com/ogg/1867240/announcements/detail/671752657526850807");
    expect(body).toMatch(/Powered by[\s\S]*WARDOGS Wiki/);
    expect(body).toContain("/en");
    expect(body).toContain("setInterval(updateStatus, 1000)");
    expect(body).not.toContain("2026-09-10T00:00:00Z");
  });
});
