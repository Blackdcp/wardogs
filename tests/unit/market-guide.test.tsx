import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";
import {MarketGuide, getMarketCopy} from "../../src/components/markets/market-guide";

describe("market guides", () => {
  it("gives Black Market readers a dated, sourced status and a useful next action", () => {
    const html = renderToStaticMarkup(<MarketGuide locale="en" kind="black" />);
    expect(html).toContain("Black Market");
    expect(html).toContain("September 27, 2026");
    expect(html).toContain("planned");
    expect(html).toContain("Check the current in-game menu");
    expect(html).toContain("steamcommunity.com/games/1867240/announcements/detail/519742851965258340");
    expect(html).toContain('href="/en/gold-market"');
    expect(html).toContain('href="/en/guides/wardogs-money-guide"');
  });

  it("helps Gold Market readers decide without presenting a stale exchange quote", () => {
    const html = renderToStaticMarkup(<MarketGuide locale="en" kind="gold" />);
    expect(html).toContain("Gold Market");
    expect(html).toContain("No live exchange quote");
    expect(html).toContain("cash reserve");
    expect(html).toContain("in-game exchange screen");
    expect(html).toContain("store.steampowered.com/news/app/1867240/view/1825093633182385");
    expect(html).toContain('href="/en/black-market"');
    expect(html).not.toMatch(/\$\d[\d,.]*\s*(?:per|for|=)\s*(?:gold|bar)/i);
  });

  it("offers every published locale a route-specific heading and locale-correct crosslinks", () => {
    for (const locale of locales) {
      for (const kind of ["black", "gold"] as const) {
        const copy = getMarketCopy(locale, kind);
        const html = renderToStaticMarkup(<MarketGuide locale={locale} kind={kind} />);
        expect(copy.title.trim(), `${locale}/${kind}`).not.toBe("");
        expect(html).toContain(copy.title);
        expect(html).toContain(`href="/${locale}/guides/wardogs-money-guide"`);
        expect(html).toContain(`href="/${locale}/${kind === "black" ? "gold-market" : "black-market"}"`);
      }
    }
  });
});
