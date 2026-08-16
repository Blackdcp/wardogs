import {describe, expect, it} from "vitest";
import sitemap from "../../src/app/sitemap";

describe("sitemap", () => {
  it("includes standalone video article URLs for indexing", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("http://localhost:3000/en/videos");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-10-reasons-not-to-buy");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-mortars-indirect-fire");
    expect(urls).toContain("http://localhost:3000/en/videos/wardogs-first-look-gameplay");
  });
});
