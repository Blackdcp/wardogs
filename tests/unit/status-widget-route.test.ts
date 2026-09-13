import {describe, expect, it} from "vitest";
import {dynamic, GET} from "../../src/app/embed/status/route";

describe("embed/status", () => {
  it("renders the live Early Access maintenance countdown", async () => {
    const response = await GET();
    const body = await response.text();

    expect(dynamic).toBe("force-static");
    expect(response.status).toBe(200);
    expect(body).toContain("data-maintenance-starts-at");
    expect(body).toContain("2026-09-14T08:00:00Z");
    expect(body).toContain("WARDOGS Early Access is live");
    expect(body).toContain("schedule-based, not live telemetry");
    expect(body).toContain("steamcommunity.com/app/1867240/homecontent");
    expect(body).toContain("setInterval(updateStatus, 1000)");
    expect(body).not.toContain("servers are back online");
  });
});
