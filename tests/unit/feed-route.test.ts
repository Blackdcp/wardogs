import {existsSync} from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {describe, expect, it} from "vitest";

type FeedRouteModule = {
  dynamic: string;
  GET: () => Promise<Response> | Response;
};

async function loadFeedRoute(): Promise<FeedRouteModule | null> {
  const routePath = path.resolve("src/app/feed.xml/route.ts");
  if (!existsSync(routePath)) return null;
  return import(pathToFileURL(routePath).href) as Promise<FeedRouteModule>;
}

describe("feed.xml", () => {
  it("publishes a static RSS 2.0 feed for updates and guides", async () => {
    const route = await loadFeedRoute();

    expect(route, "src/app/feed.xml/route.ts must exist").not.toBeNull();
    if (!route) return;

    const response = await route.GET();
    const body = await response.text();

    expect(route.dynamic).toBe("force-static");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/rss+xml; charset=utf-8");
    expect(body).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain("<atom:link");
    expect(body).toContain("/feed.xml");
    expect(body).toContain("<category>News</category>");
    expect(body).toContain("Closed Beta 02 runs September 3-6");
    expect(body).toContain("/en/guides/wardogs-beta");
    expect(body).toContain("<category>Guide</category>");
    expect(body).toContain("/en/guides/wardogs-system-requirements");
    expect(body).not.toContain("& ");
  });
});
