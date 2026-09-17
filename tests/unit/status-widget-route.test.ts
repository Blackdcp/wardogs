import {describe, expect, it} from "vitest";
import {dynamic, GET} from "../../src/app/embed/status/route";

describe("embed/status", () => {
  it("renders the current Early Access status without a stale maintenance countdown", async () => {
    const response = await GET();
    const body = await response.text();

    expect(dynamic).toBe("force-static");
    expect(response.status).toBe(200);
    expect(body).toContain("WARDOGS Early Access is live");
    expect(body).toContain("Patch 0.11 is the latest official patch announcement");
    expect(body).toContain("published maintenance window has passed");
    expect(body).toContain("official feed for live service status");
    expect(body).toContain("steamcommunity.com/app/1867240/homecontent");
    expect(body).not.toContain("Maintenance in");
    expect(body).not.toContain("setInterval");
  });
});
