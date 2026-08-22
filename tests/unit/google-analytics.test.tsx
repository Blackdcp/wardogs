import {describe, expect, it} from "vitest";
import {
  GOOGLE_TAG_ID,
  googleAnalyticsConfigScript,
  googleAnalyticsScriptSrc
} from "../../src/components/seo/google-analytics";

describe("Google Analytics", () => {
  it("uses the installable Google tag ID for the loader and config script", () => {
    expect(GOOGLE_TAG_ID).toBe("G-0GJ404WEYV");

    expect(googleAnalyticsScriptSrc()).toBe("https://www.googletagmanager.com/gtag/js?id=G-0GJ404WEYV");
    expect(googleAnalyticsConfigScript()).toContain("gtag('config', 'G-0GJ404WEYV')");
  });
});
