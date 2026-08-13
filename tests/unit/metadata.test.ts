import {describe, expect, it} from "vitest";
import {buildAlternates, buildArticleMetadata} from "../../src/lib/metadata";
import {loadGuideDocument} from "../../src/content/guides";

describe("localized metadata", () => {
  it("stays within limits and emits every language alternate", async () => {
    const guide = await loadGuideDocument("en", "wardogs-gameplay");
    const metadata = buildArticleMetadata("en", guide!);
    expect(String(metadata.title).length).toBeLessThanOrEqual(60);
    expect(String(metadata.description).length).toBeGreaterThanOrEqual(140);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    const alternates = buildAlternates("en", "/guides/wardogs-gameplay");
    expect(Object.keys(alternates.languages!)).toEqual(["en", "ru", "de", "pt-BR", "x-default"]);
  });
});
