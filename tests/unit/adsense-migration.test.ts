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
  it("removes every Adsterra integration from production source", () => {
    const sourceFiles = walk(path.join(root, "src"));
    for (const file of sourceFiles) {
      const source = fs.readFileSync(file, "utf8");
      expect(source, path.relative(root, file)).not.toMatch(/Adsterra|arkgleamfox|effectivecpmnetwork/i);
    }
  });

  it("describes Google AdSense instead of Adsterra in every privacy policy", () => {
    for (const locale of locales) {
      const messages = JSON.parse(
        fs.readFileSync(path.join(root, "messages", `${locale}.json`), "utf8")
      ) as {privacy: {advertising: string}};
      expect(messages.privacy.advertising, locale).toMatch(/Google|AdSense/i);
      expect(messages.privacy.advertising, locale).not.toMatch(/Adsterra/i);
    }
  });

  it("renders the approved AdSense site script once", async () => {
    const {ADSENSE_CLIENT_ID, GoogleAdsense} = await import(
      "../../src/components/ads/google-adsense"
    );
    const html = renderToStaticMarkup(React.createElement(GoogleAdsense));

    expect(ADSENSE_CLIENT_ID).toBe("ca-pub-9912575932665397");
    expect(html).toContain(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9912575932665397"
    );
    expect(html).toContain('crossorigin="anonymous"');
  });

  it("publishes the matching authorized seller record", () => {
    const adsTxt = fs.readFileSync(path.join(root, "public", "ads.txt"), "utf8").trim();
    expect(adsTxt).toBe(
      "google.com, pub-9912575932665397, DIRECT, f08c47fec0942fa0"
    );
  });
});
