import {describe, expect, it} from "vitest";
import {GET} from "../../src/app/llms.txt/route";

describe("llms.txt", () => {
  it("exposes every English guide including the beta-weekend pages", async () => {
    const body = await GET().text();
    const guideUrls = body.match(/\/en\/guides\/wardogs-[a-z0-9-]+/g) ?? [];

    expect(guideUrls).toHaveLength(23);
    expect(new Set(guideUrls).size).toBe(23);
    expect(body).toContain("/en/guides/wardogs-twitch-drops");
    expect(body).toContain("/en/guides/wardogs-beginner-guide");
    expect(body).toContain("/en/guides/wardogs-fob-guide");
  });
});
