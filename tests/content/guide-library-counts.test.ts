import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {guideManifest} from "../../src/content/manifest";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;

describe("guide library counts", () => {
  it("renders guide totals from the live index instead of hard-coded historical counts", () => {
    expect(guideManifest.length).toBeGreaterThan(40);

    for (const locale of locales) {
      const messages = JSON.parse(readFileSync(path.join(process.cwd(), "messages", `${locale}.json`), "utf8"));

      expect(messages.guides.count, locale).toContain("{count}");
      expect(messages.guides.description, locale).not.toMatch(/(?:34|39|45)/);
      expect(messages.notFound.description, locale).not.toMatch(/(?:34|39|45)/);
    }
  });

  it("does not describe every pre-release catalogue record as having a verified image", () => {
    const imageCompletenessClaims = /illustrated|bebildert|ilustrad|иллюстр|画像付き|带图/i;

    for (const locale of locales) {
      const messages = JSON.parse(readFileSync(path.join(process.cwd(), "messages", `${locale}.json`), "utf8"));
      const counts = [
        messages.home.catalogue.weapons.count,
        messages.home.catalogue.vehicles.count,
        messages.home.catalogue.attachments.count,
      ].join(" ");

      expect(counts, locale).not.toMatch(imageCompletenessClaims);
    }
  });
});
