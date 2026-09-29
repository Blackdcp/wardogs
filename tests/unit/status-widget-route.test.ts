import {describe, expect, it} from "vitest";
import {dynamic, GET} from "../../src/app/embed/status/route";

describe("embed/status", () => {
  it("renders the current Early Access status without a stale maintenance countdown", async () => {
    const response = await GET();
    const body = await response.text();

    expect(dynamic).toBe("force-static");
    expect(response.status).toBe(200);
    expect(body).toContain("WARDOGS Early Access is live");
    expect(body).toContain("Season 2 is announced for October 15");
    expect(body).toContain("exact start time is not confirmed");
    expect(body).toContain("not live server telemetry");
    expect(body).toContain("2026-09-30");
    expect(body).not.toContain("September 17");
    expect(body).toContain("steamcommunity.com/app/1867240/homecontent");
    expect(body).not.toContain("Maintenance in");
    expect(body).not.toContain("setInterval");
  });
});
