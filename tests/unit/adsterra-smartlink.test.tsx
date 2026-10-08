import {readFileSync} from "node:fs";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {locales} from "../../src/config/site";
import {AdsterraSmartlink} from "../../src/components/ads/adsterra-smartlink";

vi.mock("next/navigation", () => ({usePathname: () => "/en/guides"}));
vi.mock("../../src/features/ads/ad-policy", async (importOriginal) => ({
  ...await importOriginal<typeof import("../../src/features/ads/ad-policy")>(),
  ADSTERRA_SMARTLINK_ENABLED: true
}));

describe("sponsored Smartlink", () => {
  it.each(locales)("renders one labelled external CTA with the %s translation", (locale) => {
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, "utf8")) as {
      ads: {sponsored: string; smartlinkCta: string; smartlinkDescription: string};
    };
    const html = renderToStaticMarkup(<AdsterraSmartlink
      label={messages.ads.sponsored}
      cta={messages.ads.smartlinkCta}
      description={messages.ads.smartlinkDescription}
    />);
    expect(html.match(/<a\s/g)).toHaveLength(1);
    expect(html).toContain('href="https://araplhn.org/4/88f0d659df423718bd107ca16b5284cd"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="nofollow noopener noreferrer sponsored"');
    // Render text independently so localized punctuation is escaped as React does.
    expect(html).toContain(renderToStaticMarkup(<span>{messages.ads.sponsored}</span>).slice(6, -7));
    expect(html).toContain(renderToStaticMarkup(<span>{messages.ads.smartlinkDescription}</span>).slice(6, -7));
    expect(html).toContain(`${renderToStaticMarkup(<span>{messages.ads.smartlinkCta}</span>).slice(6, -7)}<svg`);
    expect(html).not.toContain("smartlink-2");
    expect(html).not.toContain("jvxhi4z3ts");
  });
});
