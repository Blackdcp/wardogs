import {describe, expect, it} from "vitest";
import {GET} from "../../src/app/llms.txt/route";
import {guideManifest} from "../../src/content/manifest";
import {locales} from "../../src/config/site";
import {videoArticles} from "../../src/features/videos/video-library";

describe("llms.txt", () => {
  it("exposes every guide in every supported locale", async () => {
    const body = await GET().text();

    for (const locale of locales) {
      const guideUrls = body.match(new RegExp(`/${locale}/guides/wardogs-[a-z0-9-]+`, "g")) ?? [];

      expect(guideUrls).toHaveLength(guideManifest.length);
      expect(new Set(guideUrls).size).toBe(guideManifest.length);
      expect(body).toContain(`/${locale}/guides/wardogs-preload`);
      expect(body).toContain(`/${locale}/guides/wardogs-twitch-drops`);
      expect(body).toContain(`/${locale}/guides/wardogs-map`);
      expect(body).toContain(`/${locale}/guides/wardogs-best-settings`);
      expect(body).toContain(`/${locale}/guides/wardogs-system-requirements`);
      expect(body).toContain(`/${locale}/guides/wardogs-controls`);
    }
  });

  it("exposes every localized core page and standalone video article", async () => {
    const body = await GET().text();

    for (const locale of locales) {
      const videoUrls = body.match(new RegExp(`/${locale}/videos/wardogs-[a-z0-9-]+`, "g")) ?? [];

      expect(body).toContain(`/${locale}`);
      expect(body).toContain(`/${locale}/guides`);
      expect(body).toContain(`/${locale}/videos`);
      expect(videoUrls).toHaveLength(videoArticles.length);
      expect(new Set(videoUrls).size).toBe(videoArticles.length);
      expect(body).toContain(`/${locale}/videos/wardogs-everything-before-playing`);
      expect(body).toContain(`/${locale}/videos/wardogs-best-settings`);
      expect(body).toContain(`/${locale}/videos/wardogs-helicopter-flight-guide`);
    }
  });
});
