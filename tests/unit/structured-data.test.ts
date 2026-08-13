import {describe, expect, it} from "vitest";
import {buildArticleJsonLd, buildHomeJsonLd} from "../../src/lib/structured-data";
import {loadGuideDocument} from "../../src/content/guides";

describe("structured data", () => {
  it("marks the site as independent and exposes article FAQs", async () => {
    const home = buildHomeJsonLd("en");
    expect(JSON.stringify(home)).toContain("independent fan-made guide");

    const guide = await loadGuideDocument("en", "wardogs-gameplay");
    const article = buildArticleJsonLd("en", guide!);
    expect(article.map((item) => item["@type"])).toEqual(["Article", "BreadcrumbList", "FAQPage"]);
  });
});
