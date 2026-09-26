import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {getLocalizedCatalogGuide} from "../../src/features/catalogue/catalogue-localization";
import {getCatalogGuide} from "../../src/features/items/item-catalog-guides";
import {buildCatalogGuideMetadata} from "../../src/lib/item-metadata";

describe("German weapons and English Oil Rig source boundaries", () => {
  it("shows German weapon searchers a historical list and a first-screen price caveat", () => {
    const guide = getLocalizedCatalogGuide(getCatalogGuide("weapons")!, "de");
    const metadata = buildCatalogGuideMetadata("de", guide);

    expect(guide.title).toMatch(/WARDOGS Waffenliste.*Gewehre.*MPs/i);
    expect(guide.description).toMatch(/Alpha 1.*Closed Beta/i);
    expect(guide.description).toMatch(/historische Preise.*keine aktuellen Saison-1-Preise/i);
    expect(metadata.title).toBe(guide.title);
    expect(metadata.description).toBe(guide.description);
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/de/items/weapons");
  });

  it("separates the beta-only rig workflow from official Season 1 hammer facts", async () => {
    const guide = await loadGuideDocument("en", "wardogs-oil-rig-guide");

    expect(guide?.frontmatter.updatedAt).toBe("2026-09-26");
    expect(guide?.frontmatter.description).toMatch(/current rig availability and build steps are unverified/i);
    expect(guide?.frontmatter.sources).toContainEqual(expect.objectContaining({
      url: "https://store.steampowered.com/news/app/1867240/view/701027323413004455",
      kind: "official",
    }));
    expect(guide?.body).toMatch(/Closed Beta[\s\S]*not (?:verified|confirmed) for Season 1/i);
    expect(guide?.body).toMatch(/Support level 8[\s\S]*\$75,000[\s\S]*\$2,400/);
    expect(guide?.body).toMatch(/official[\s\S]*(?:does not|doesn't)[\s\S]*Oil Rig/i);
  });
});
