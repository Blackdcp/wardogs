import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {guideManifest} from "../../src/content/manifest";
import {START_GUIDES, TOP_GUIDE_SLUGS} from "../../src/features/home/home-data";
import {getLocalizedVideoArticle} from "../../src/features/videos/video-localization";
import {videoArticles} from "../../src/features/videos/video-library";

const locales = ["en", "de", "ru", "pt-br", "ja"] as const;

const newGuides = [
  ["wardogs-launch-checklist", "wardogs launch checklist"],
  ["wardogs-cargo-guide", "wardogs cargo guide"],
  ["wardogs-ammo-reload-guide", "wardogs ammo reload guide"],
  ["wardogs-squad-guide", "wardogs squad guide"],
  ["wardogs-oil-rig-guide", "wardogs oil rig guide"],
] as const;

describe("2026-08-29 launch and logistics expansion", () => {
  it("registers five new player-demand guides and publishes every locale", async () => {
    for (const [slug, keyword] of newGuides) {
      expect(guideManifest).toContainEqual(expect.objectContaining({slug, keyword}));

      for (const locale of locales) {
        const guide = await loadGuideDocument(locale, slug);

        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt).toBe("2026-08-29");
        expect(guide?.frontmatter.sources.length).toBeGreaterThanOrEqual(2);
        expect(guide?.body.length, `${locale}/${slug} body`).toBeGreaterThan(1800);
      }
    }
  });

  it("keeps launch claims separated from speculation", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-launch-checklist");
      const sources = guide?.frontmatter.sources.map(({url}) => url) ?? [];

      expect(sources).toContain("https://store.steampowered.com/app/1867240/WARDOGS/");
      expect(guide?.body).toMatch(/September 3|3\. September|3 сентября|3 de setembro|9月3日/i);
      expect(guide?.body).toMatch(/September 10|10\. September|10 сентября|10 de setembro|9月10日/i);
      expect(guide?.body).toMatch(/not confirmed|nicht bestätigt|не подтверж|não confirmad|未確認/i);
    }
  });

  it("documents cargo, ammo, squad and oil-rig workflows from checked sources", async () => {
    for (const locale of locales) {
      const cargo = await loadGuideDocument(locale, "wardogs-cargo-guide");
      const ammo = await loadGuideDocument(locale, "wardogs-ammo-reload-guide");
      const squad = await loadGuideDocument(locale, "wardogs-squad-guide");
      const oilRig = await loadGuideDocument(locale, "wardogs-oil-rig-guide");

      expect(cargo?.frontmatter.sources.some(({url}) => url.includes("2aU4OB0duYg"))).toBe(true);
      expect(cargo?.body).toMatch(/Ural/i);
      expect(cargo?.body).toMatch(/pallet|Palette|поддон|palete|パレット/i);
      expect(cargo?.body).toMatch(/build.*ammo.*fuel.*mechanical|Bau.*Munition.*Treibstoff.*mechanisch|строит.*боеприпас.*топлив.*механ|construção.*munição.*combustível.*mecân|建築.*弾薬.*燃料.*機械/i);

      expect(ammo?.frontmatter.sources.some(({url}) => url.includes("1vzsky2"))).toBe(true);
      expect(ammo?.body).toMatch(/loose ammo|lose Munition|россып|munição avulsa|バラ弾/i);
      expect(ammo?.body).toMatch(/combine|zusammenführen|объедин|combinar|まとめ/i);

      expect(squad?.frontmatter.sources.some(({url}) => url.includes("team17.com/games/wardogs"))).toBe(true);
      expect(squad?.body).toMatch(/proximity|Nähe|локаль|proximidade|近接/i);
      expect(squad?.body).toMatch(/Steam/i);

      expect(oilRig?.frontmatter.sources.some(({url}) => url.includes("1vv5wex"))).toBe(true);
      expect(oilRig?.body).toMatch(/Oil Rig|Drill Rig/i);
      expect(oilRig?.body).toMatch(/Hot Zone/i);
      expect(oilRig?.body).toMatch(/fuel|Treibstoff|топлив|combustível|燃料/i);
    }
  });

  it("adds transcript-backed cargo, Havoc, sniper and Medic video pages in every locale", () => {
    const expectedVideos = new Map([
      ["wardogs-vehicle-cargo-logistics", "2aU4OB0duYg"],
      ["wardogs-havoc-helicopter-guide", "Hq6OZqPDoAc"],
      ["wardogs-deadliest-sniper-guide", "DT1_i8m8cMA"],
      ["wardogs-medic-mp9-loadout", "SwlEyNdgw1o"],
    ]);

    for (const [slug, youtubeId] of expectedVideos) {
      expect(videoArticles).toContainEqual(expect.objectContaining({slug, youtubeId}));
      for (const locale of locales) {
        expect(getLocalizedVideoArticle(locale, slug), `${locale}/videos/${slug}`).toBeDefined();
      }
    }
  });

  it("strengthens the five-locale console page for PS5 and Xbox demand", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-ps5");

      expect(guide?.frontmatter.updatedAt).toBe("2026-08-29");
      expect(guide?.frontmatter.title).toMatch(/PS5/i);
      expect(guide?.frontmatter.title).toMatch(/Xbox/i);
      expect(guide?.frontmatter.description).toMatch(/PS5/i);
      expect(guide?.frontmatter.description).toMatch(/Xbox/i);
      expect(guide?.body).toMatch(/not confirmed|nicht bestätigt|не подтверж|não confirmad|未確認/i);
    }
  });

  it("promotes launch preparation ahead of ended playtest content", () => {
    expect(START_GUIDES[1].slug).toBe("wardogs-launch-checklist");
    expect(TOP_GUIDE_SLUGS.slice(0, 3)).toEqual([
      "wardogs-launch-checklist",
      "wardogs-cargo-guide",
      "wardogs-ammo-reload-guide",
    ]);
  });
});
