import {existsSync} from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {describe, expect, it} from "vitest";
import {CURRENT_REFRESH_DATE} from "../refresh-contract";

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
  it("publishes the live Early Access event and sourced maintenance window", async () => {
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
      schemaVersion: 2,
      dataAsOf: CURRENT_REFRESH_DATE,
      game: "WARDOGS",
      currentEvent: {
        id: "early-access-patch-0-11",
        name: "Early Access - Patch 0.11",
        status: "live",
        launchedOn: "2026-09-10"
      },
      earlyAccess: {
        date: "2026-09-10",
        datePrecision: "date",
        status: "live",
        launched: true
      },
      maintenance: {
        status: "completed",
        patchVersion: "0.11",
        startsAt: "2026-09-14T08:00:00Z",
        expectedDurationMinutes: 60,
        completedOn: "2026-09-14"
      }
    });
    expect(payload.historicalEvents).toContainEqual(expect.objectContaining({
      id: "closed-beta-02",
      status: "ended",
      endsAt: "2026-09-06T08:00:00Z"
    }));
    expect(payload.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({kind: "official", url: "https://store.steampowered.com/app/1867240/WARDOGS/"}),
      expect.objectContaining({kind: "official", url: "https://steamcommunity.com/app/1867240/homecontent/"})
    ]));
  });
});
