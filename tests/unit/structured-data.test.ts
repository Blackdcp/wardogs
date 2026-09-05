import {describe, expect, it} from "vitest";
import {buildArticleJsonLd, buildHomeJsonLd} from "../../src/lib/structured-data";
import {loadGuideDocument} from "../../src/content/guides";
import {officialLinks} from "../../src/config/site";

describe("structured data", () => {
  it("marks the site as independent and exposes article FAQs", async () => {
    const home = buildHomeJsonLd("en");
    expect(JSON.stringify(home)).toContain("independent fan-made guide");

    const guide = await loadGuideDocument("en", "wardogs-gameplay");
    const article = buildArticleJsonLd("en", guide!);
    expect(article.map((item) => item["@type"])).toEqual(["Article", "BreadcrumbList", "FAQPage"]);
  });

  it("connects the WARDOGS game entity to official first-party profiles", () => {
    const home = buildHomeJsonLd("en");
    const game = home.find((item) => item["@type"] === "VideoGame");

    expect(game).toMatchObject({
      name: "WARDOGS",
      url: officialLinks.steam,
      sameAs: expect.arrayContaining([
        officialLinks.steam,
        officialLinks.team17,
        officialLinks.twitter
      ])
    });
    expect(game?.publisher).toMatchObject({name: "Team17", url: officialLinks.team17});
  });

  it("identifies the permanent site name at the canonical domain root", () => {
    const home = buildHomeJsonLd("en");
    const website = home.find((item) => item["@type"] === "WebSite");

    expect(website).toMatchObject({
      name: "WARDOGS Wiki",
      alternateName: ["WardogsWiki", "wardogswiki.com"],
      inLanguage: "en",
      url: "http://localhost:3000/"
    });
  });

  it("uses an absolute source-audited image URL for new catalogue guides", async () => {
    const guide = await loadGuideDocument("en", "wardogs-medic-revive-guide");
    const article = buildArticleJsonLd("en", guide!)[0];

    expect(article.image).toBe("http://localhost:3000/images/guide-discovery/medic-revive.webp");
  });
});
