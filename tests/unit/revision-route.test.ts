import {afterEach, describe, expect, it, vi} from "vitest";
import {GET} from "@/app/api/revision/route";

afterEach(() => vi.unstubAllEnvs());

describe("production revision route", () => {
  it("exposes the build revision used by the deployment smoke", async () => {
    vi.stubEnv("WARDOGSWIKI_RELEASE_SHA", "a".repeat(40));

    const response = GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({revision: "a".repeat(40)});
  });
});
