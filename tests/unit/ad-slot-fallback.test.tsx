import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it, vi} from "vitest";
import {locales} from "../../src/config/site";
import {AdSlotFallback, getAdFallbackCopy} from "../../src/components/ads/ad-slot-fallback";

afterEach(() => vi.unstubAllEnvs());

describe("unfilled inventory site navigation", () => {
  it.each(locales)("keeps the %s fallback in the reader's language and outside ad accounting", (locale) => {
    const html = renderToStaticMarkup(React.createElement(AdSlotFallback, {pathname: `/${locale}/guides/wardogs-squad-guide`}));
    const copy = getAdFallbackCopy(`/${locale}/guides/wardogs-squad-guide`);
    expect(copy.locale).toBe(locale);
    expect(html).toContain(`href="/${locale}/guides"`);
    expect(html).toContain(`href="/${locale}/tools"`);
    expect(html).toContain('data-ad-fallback="site-navigation"');
    expect(html).toContain("WARDOGS Wiki");
    expect(html).not.toMatch(/iframe|<img|data-adsterra-unit|bauval\.org/);
    if (locale !== "en") expect(copy.guides).not.toBe("Browse guides");
  });

  it("preserves deployed base paths instead of sending readers to an unlocalized route", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wardogs");
    const html = renderToStaticMarkup(React.createElement(AdSlotFallback, {pathname: "/wardogs/ja/tools/artillery-calculator"}));
    expect(html).toContain('href="/wardogs/ja/guides/"');
    expect(html).toContain('href="/wardogs/ja/tools/"');
    expect(html).toContain("攻略ガイド");
  });
});
