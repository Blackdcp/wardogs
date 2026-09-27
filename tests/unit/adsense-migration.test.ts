import fs from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {locales} from "../../src/config/site";

const root = process.cwd();

function walk(directory: string): string[] {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const resolved = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(resolved) : [resolved];
  });
}

describe("Adsterra monetization strategy", () => {
  it("keeps publisher URLs isolated to the approved ad modules", () => {
    const sourceFiles = walk(path.join(root, "src"));
    for (const file of sourceFiles) {
      const source = fs.readFileSync(file, "utf8");
      if (/arkgleamfox/i.test(source)) {
        expect([
          path.join("src", "features", "ads", "ad-policy.ts"),
          path.join("src", "components", "ads", "adsterra-display-banner.tsx")
        ], path.relative(root, file)).toContain(path.relative(root, file));
      }
      if (/effectivecpmnetwork/i.test(source)) {
        expect(path.relative(root, file)).toBe(path.join("src", "components", "ads", "adsterra-native-banner.tsx"));
        expect(source).toContain("481d6501bcd0c27b98bc3c4776a26f6e");
      }
    }
  });

  it("describes the active high-density Adsterra formats in every privacy policy", () => {
    for (const locale of locales) {
      const messages = JSON.parse(
        fs.readFileSync(path.join(root, "messages", `${locale}.json`), "utf8")
      ) as {privacy: {advertising: string}};
      expect(messages.privacy.advertising, locale).toMatch(/Adsterra/i);
      expect(messages.privacy.advertising, locale).toMatch(/Popunder/i);
      expect(messages.privacy.advertising, locale).toMatch(/Smartlink/i);
    }
  });

  it("removes the rejected AdSense loader from the active locale layout", () => {
    const layout = fs.readFileSync(path.join(root, "src", "app", "[locale]", "layout.tsx"), "utf8");
    expect(layout).not.toContain("GoogleAdsense");
    expect(layout).toContain("AdsterraBehavioralAds");
    expect(layout).toContain("AdsterraGlobalInventory");
  });

  it("retains the authorized Google seller record for a possible future review", () => {
    const adsTxt = fs.readFileSync(path.join(root, "public", "ads.txt"), "utf8").trim();
    expect(adsTxt).toBe(
      "google.com, pub-9912575932665397, DIRECT, f08c47fec0942fa0"
    );
  });
});
