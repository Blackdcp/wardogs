import {describe, expect, it} from "vitest";
import {GET} from "../../src/app/llms.txt/route";

describe("llms.txt", () => {
  it("exposes every English guide including the beta-weekend pages", async () => {
    const body = await GET().text();
    const guideUrls = body.match(/\/en\/guides\/wardogs-[a-z0-9-]+/g) ?? [];

    expect(guideUrls).toHaveLength(28);
    expect(new Set(guideUrls).size).toBe(28);
    expect(body).toContain("/en/guides/wardogs-twitch-drops");
    expect(body).toContain("/en/guides/wardogs-beginner-guide");
    expect(body).toContain("/en/guides/wardogs-fob-guide");
    expect(body).toContain("/en/guides/wardogs-crash-fix");
    expect(body).toContain("/en/guides/wardogs-helicopter-guide");
  });

  it("exposes the YouTube hub and every standalone video article", async () => {
    const body = await GET().text();
    const videoUrls = body.match(/\/en\/videos\/wardogs-[a-z0-9-]+/g) ?? [];

    expect(body).toContain("/en/videos");
    expect(videoUrls).toHaveLength(19);
    expect(new Set(videoUrls).size).toBe(19);
    expect(body).toContain("/en/videos/wardogs-everything-before-playing");
    expect(body).toContain("/en/videos/wardogs-best-settings");
    expect(body).toContain("/en/videos/wardogs-helicopter-flight-guide");
  });
});
