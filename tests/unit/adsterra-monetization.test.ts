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
          path.join("src", "components", "ads", "adsterra-display-banner.tsx"),
          path.join("src", "features", "ads", "adsterra-native.ts"),
          path.join("src", "features", "ads", "adsterra-banner.ts")
        ], path.relative(root, file)).toContain(path.relative(root, file));
      }
      if (/effectivecpmnetwork/i.test(source)) {
        expect(path.relative(root, file)).toBe(path.join("src", "components", "ads", "adsterra-native-banner.tsx"));
        expect(source).toContain("481d6501bcd0c27b98bc3c4776a26f6e");
      }
    }
  });

  it("discloses isolated Adsterra displays and the disabled redirect formats in every privacy policy", () => {
    for (const locale of locales) {
      const messages = JSON.parse(
        fs.readFileSync(path.join(root, "messages", `${locale}.json`), "utf8")
      ) as {privacy: {advertising: string; metaDescription: string}};
      expect(messages.privacy.advertising, locale).toMatch(/Adsterra/i);
      expect(messages.privacy.advertising, locale).toContain("2026-10-01");
      expect(messages.privacy.advertising, locale).toMatch(/Popunder/i);
      expect(messages.privacy.advertising, locale).toMatch(/Smartlink/i);
      expect(messages.privacy.metaDescription, locale).toMatch(/Adsterra/i);
    }
  });

  it("does not ship Google advertising code or a Google seller record", () => {
    expect(fs.existsSync(path.join(root, "src", "components", "ads", "google-adsense.tsx"))).toBe(false);
    expect(fs.existsSync(path.join(root, "public", "ads.txt"))).toBe(false);
    for (const file of walk(path.join(root, "src"))) {
      expect(fs.readFileSync(file, "utf8"), path.relative(root, file)).not.toMatch(
        /googlesyndication|google-adsense-account|ca-pub-/i
      );
    }
  });
});
