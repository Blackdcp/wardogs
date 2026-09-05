import {existsSync} from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {describe, expect, it} from "vitest";

type StatusRouteModule = {
  dynamic: string;
  GET: () => Promise<Response> | Response;
};

async function loadStatusRoute(): Promise<StatusRouteModule | null> {
  const routePath = path.resolve("src/app/api/status.json/route.ts");
  if (!existsSync(routePath)) return null;
  return import(pathToFileURL(routePath).href) as Promise<StatusRouteModule>;
}

describe("api/status.json", () => {
  it("publishes the verified current event without inventing an unlock time", async () => {
    const route = await loadStatusRoute();

    expect(route, "src/app/api/status.json/route.ts must exist").not.toBeNull();
    if (!route) return;

    const response = await route.GET();
    const payload = await response.json();

    expect(route.dynamic).toBe("force-static");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(payload).toMatchObject({
      schemaVersion: 1,
      dataAsOf: "2026-09-05",
      game: "WARDOGS",
      currentEvent: {
        id: "closed-beta-02",
        name: "Closed Beta 02",
        status: "live",
        startsAt: "2026-09-03T19:00:00Z",
        endsAt: "2026-09-06T08:00:00Z"
      },
      earlyAccess: {
        date: "2026-09-10",
        datePrecision: "date",
        exactUnlockTimeConfirmed: false
      }
    });
    expect(payload.earlyAccess).not.toHaveProperty("at");
    expect(payload.earlyAccess).not.toHaveProperty("unlockAt");
    expect(payload.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({kind: "official", url: "https://store.steampowered.com/app/1867240/WARDOGS/"}),
      expect.objectContaining({kind: "official", url: "https://steamcommunity.com/ogg/1867240/announcements/detail/671752657526850807"})
    ]));
  });
});
