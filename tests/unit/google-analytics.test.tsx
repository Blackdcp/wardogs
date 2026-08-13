import {describe, expect, it} from "vitest";
import {
  GA_MEASUREMENT_ID,
  googleAnalyticsConfigScript,
  googleAnalyticsScriptSrc
} from "../../src/components/seo/google-analytics";

describe("Google Analytics", () => {
  it("uses the production GA4 measurement ID for the loader and config script", () => {
    expect(GA_MEASUREMENT_ID).toBe("G-7B37NSM6WZ");

    expect(googleAnalyticsScriptSrc()).toBe("https://www.googletagmanager.com/gtag/js?id=G-7B37NSM6WZ");
    expect(googleAnalyticsConfigScript()).toContain("gtag('config', 'G-7B37NSM6WZ')");
  });
});
