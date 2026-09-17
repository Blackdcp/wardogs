import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {currentVideoSources} from "../../src/features/videos/video-library";

describe("September 13-17 search performance refresh", () => {
  it("answers the high-impression English ammo queries directly", async () => {
    const guide = await loadGuideDocument("en", "wardogs-ammo-reload-guide");
    const searchable = `${guide?.frontmatter.title}\n${guide?.frontmatter.description}\n${guide?.body}`;

    expect(guide?.frontmatter.updatedAt).toBe("2026-09-17");
    expect(guide?.frontmatter.title).toBe("WARDOGS Ammo Guide: How to Reload, Refill & Change Ammo");
    expect(searchable).toMatch(/how to reload/i);
    expect(searchable).toMatch(/refill.*magazine/i);
    expect(searchable).toMatch(/change ammo type/i);
    expect(searchable).toMatch(/Season 1/i);
  });

  it("refreshes the Japanese guides driving September 13-15 clicks", async () => {
    const expectations = [
      ["wardogs-squad-guide", "wardogs フレンド", "701027323413005176"],
      ["wardogs-towers-guide", "wardogs タワー", "store.steampowered.com/app/1867240/WARDOGS"],
      ["wardogs-helicopter-guide", "wardogs ヘリ", "4CHoWpu4Imw"],
      ["wardogs-artillery-guide", "wardogs 自走砲", "701027323413005176"],
      ["wardogs-mortar-guide", "wardogs 迫撃砲", "Tkors4Fenh0"],
    ] as const;

    for (const [slug, query, sourceFragment] of expectations) {
      const guide = await loadGuideDocument("ja", slug);
      const searchable = `${guide?.frontmatter.title}\n${guide?.frontmatter.description}\n${guide?.body}`;

      expect(guide?.frontmatter.updatedAt, slug).toBe("2026-09-17");
      expect(searchable.toLowerCase(), slug).toContain(query.toLowerCase());
      expect(
        guide?.frontmatter.sources.some(({url}) => url.includes(sourceFragment)),
        `${slug} is missing ${sourceFragment}`,
      ).toBe(true);
      expect(guide?.body, slug).toMatch(/Early Access|早期アクセス|Season 1|シーズン1/);
    }
  });

  it("adds current helicopter and mortar videos without recasting creator advice as official", () => {
    expect(currentVideoSources).toContainEqual(expect.objectContaining({
      youtubeId: "4CHoWpu4Imw",
      topic: "helicopter",
      internalGuideSlug: "wardogs-helicopter-guide",
    }));
    expect(currentVideoSources).toContainEqual(expect.objectContaining({
      youtubeId: "Tkors4Fenh0",
      topic: "mortar",
      internalGuideSlug: "wardogs-mortar-guide",
    }));
  });
});
