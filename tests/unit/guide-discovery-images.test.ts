import {afterEach, describe, expect, it, vi} from "vitest";
import {getGuideDiscoveryImage, getGuideDiscoveryImageSrc} from "../../src/features/guides/guide-discovery-images";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("guide discovery images", () => {
  it("prefixes local guide media for a subpath deployment and leaves remote media unchanged", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    vi.stubEnv("GITHUB_PAGES", "true");

    const local = getGuideDiscoveryImage("wardogs-best-weapons-loadouts");
    const remote = getGuideDiscoveryImage("wardogs-crash-fix");

    expect(getGuideDiscoveryImageSrc(local!)).toBe("/wardogs/images/guide-discovery/best-weapons-loadouts.webp");
    expect(getGuideDiscoveryImageSrc(remote!)).toContain("https://i.ytimg.com/");
  });

  it("uses a sourced image for the high-demand squad and cargo guides", () => {
    expect(getGuideDiscoveryImage("wardogs-squad-guide")).toMatchObject({
      url: "/images/wardogs-hero.jpg",
      creditLabel: "Team17 WARDOGS Press Kit"
    });
    expect(getGuideDiscoveryImage("wardogs-cargo-guide")).toMatchObject({
      creditUrl: "https://www.youtube.com/watch?v=2aU4OB0duYg"
    });
  });
});
