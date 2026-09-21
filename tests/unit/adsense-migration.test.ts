import fs from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {locales} from "../../src/config/site";

const root = process.cwd();

function walk(directory: string): string[] {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const resolved = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(resolved) : [resolved];
  });
}

describe("AdSense migration", () => {
  it("keeps AdSense plus only the approved conservative Adsterra native slot", () => {
    const sourceFiles = walk(path.join(root, "src"));
    for (const file of sourceFiles) {
      const source = fs.readFileSync(file, "utf8");
      expect(source, path.relative(root, file)).not.toMatch(/arkgleamfox|popunder|social\s*bar|direct\s*link|smartlink|auto-?redirect/i);
      if (/effectivecpmnetwork/i.test(source)) {
        expect(path.relative(root, file)).toBe(path.join("src", "components", "ads", "adsterra-native-banner.tsx"));
        expect(source).toContain("481d6501bcd0c27b98bc3c4776a26f6e");
      }
    }
  });

  it("describes Google AdSense and the conservative third-party ad provider in every privacy policy", () => {
    for (const locale of locales) {
      const messages = JSON.parse(
        fs.readFileSync(path.join(root, "messages", `${locale}.json`), "utf8")
      ) as {privacy: {advertising: string}};
      expect(messages.privacy.advertising, locale).toMatch(/Google|AdSense/i);
      expect(messages.privacy.advertising, locale).toMatch(/Adsterra|third-party|terceiros|сторон|第三方|第三者/i);
    }
  });

  it("renders the approved AdSense site script and account meta tag", async () => {
    const {ADSENSE_CLIENT_ID, GoogleAdsense} = await import(
      "../../src/components/ads/google-adsense"
    );
    const html = renderToStaticMarkup(React.createElement(GoogleAdsense));

    expect(ADSENSE_CLIENT_ID).toBe("ca-pub-9912575932665397");
    expect(html).toContain(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9912575932665397"
    );
    expect(html).toContain('crossorigin="anonymous"');
    expect(html).toContain(
      '<meta name="google-adsense-account" content="ca-pub-9912575932665397"/>'
    );
  });

  it("publishes the matching authorized seller record", () => {
    const adsTxt = fs.readFileSync(path.join(root, "public", "ads.txt"), "utf8").trim();
    expect(adsTxt).toBe(
      "google.com, pub-9912575932665397, DIRECT, f08c47fec0942fa0"
    );
  });
});
