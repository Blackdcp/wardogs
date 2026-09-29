import {afterEach, describe, expect, it, vi} from "vitest";
import {GET} from "@/app/api/revision/route";

afterEach(() => vi.unstubAllEnvs());

describe("production revision route", () => {
  it("exposes the build revision used by the deployment smoke", async () => {
    vi.stubEnv("WARDOGSWIKI_RELEASE_SHA", "a".repeat(40));
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "b".repeat(40));

    const response = GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({revision: "a".repeat(40)});
  });

  it("uses the Git revision for automatic production deployments", async () => {
    vi.stubEnv("WARDOGSWIKI_RELEASE_SHA", "");
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "b".repeat(40));

    expect(await GET().json()).toEqual({revision: "b".repeat(40)});
  });
});
