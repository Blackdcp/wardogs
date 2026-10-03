import {afterEach, describe, expect, it, vi} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {readFileSync} from "node:fs";
import {NextIntlClientProvider} from "next-intl";
import {compileGuideBody, loadGuideDocument} from "../../src/content/guides";
import {mdxComponents} from "../../src/components/mdx/mdx-components";
import {VideoCandidateList} from "../../src/components/videos/video-candidate-list";
import {candidateWatchUrl, getVideoCandidates, videoCandidates} from "../../src/features/videos/video-candidates";
import {CURRENT_VIDEO_SOURCES_REVIEWED_AT, currentVideoSources} from "../../src/features/videos/video-library";
import {getServiceUpdates} from "../../src/features/news/service-updates";

const locales = ["en", "ja", "ru", "de", "pt-br", "zh-cn"] as const;
const slugs = ["season-2", "progression-wipes-guide", "crash-fix", "server-status", "patch-notes", "helicopter-guide", "cargo-guide", "fob-guide", "equipment-tools-guide", "controls", "ammo-reload-guide", "squad-guide", "best-weapons-loadouts", "artillery-guide", "mortar-guide", "achievements", "ps5", "player-count", "community-servers-guide", "money-guide", "linux-proton"];

afterEach(() => vi.unstubAllEnvs());

describe("September 30 evidence-bounded guide and video refresh", () => {
  it.each(locales)("compiles all 21 changed guide families in %s", async (locale) => {
    for (const suffix of slugs) {
      const guide = await loadGuideDocument(locale, `wardogs-${suffix}`);
      expect(guide, `${locale}/${suffix}`).not.toBeNull();
      expect(guide!.frontmatter.updatedAt >= "2026-09-30").toBe(true);
      expect(guide!.frontmatter.sources.some(source => source.kind === "official")).toBe(true);
      const compiled = await compileGuideBody(guide!.body, mdxComponents);
      const messages = JSON.parse(readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), "utf8"));
      expect(renderToStaticMarkup(
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
          {compiled.content}
        </NextIntlClientProvider>
      ).length).toBeGreaterThan(100);
    }
  }, 30_000);

  it.each(locales)("keeps primary evidence and unknowns connected in %s", async locale => {
    const crash = await loadGuideDocument(locale, "wardogs-crash-fix");
    const patches = await loadGuideDocument(locale, "wardogs-patch-notes");
    const wipes = await loadGuideDocument(locale, "wardogs-progression-wipes-guide");
    const artillery = await loadGuideDocument(locale, "wardogs-artillery-guide");
    expect(crash!.body).toContain("KB5124010");
    expect(crash!.frontmatter.sources).toContainEqual(expect.objectContaining({
      url: "https://store.steampowered.com/news/app/1867240/view/712287592723252267",
      kind: "official",
      checkedAt: "2026-10-03"
    }));
    expect(patches!.body).toContain("2103054159641538707");
    expect(patches!.body).toContain("2103450008431313221");
    expect(wipes!.body).toContain("Steam");
    expect(wipes!.body).toContain("PQvtvAvl-78&t=185s");
    expect(artillery!.body).toContain("701027323413004455");
    expect(artillery!.body).toContain("$500,000");
    expect(artillery!.body).toContain("90");
  });

  it("separates fourteen metadata candidates from the September 17 library", () => {
    expect(videoCandidates).toHaveLength(14);
    expect(new Set(videoCandidates.map(video => video.youtubeId)).size).toBe(14);
    expect(videoCandidates.filter(video => video.language === "ja")).toHaveLength(3);
    expect(videoCandidates.filter(video => video.language === "ru")).toHaveLength(3);
    expect(CURRENT_VIDEO_SOURCES_REVIEWED_AT).toBe("2026-09-17");
    for (const video of videoCandidates) {
      expect(video.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(video.publishedDate >= "2026-09-18" && video.publishedDate <= "2026-09-30").toBe(true);
      expect(video.metadataCheckedAt).toBe("2026-09-30");
      expect(video.transcriptVerified).toBe(false);
      expect(video.gameplayVerified).toBe(false);
      expect(video.embedPlaybackVerified).toBe(false);
      expect(currentVideoSources.some(source => source.youtubeId === video.youtubeId)).toBe(false);
      expect(video.chapters.map(chapter => chapter.seconds)).toEqual([...video.chapters.map(chapter => chapter.seconds)].sort((a, b) => a - b));
      expect(candidateWatchUrl(video.youtubeId)).toBe(`https://www.youtube.com/watch?v=${video.youtubeId}`);
    }
    expect(videoCandidates.find(video => video.youtubeId === "6Xp6IRzDL4g")?.caution).toBe("axis");
    expect(videoCandidates.find(video => video.youtubeId === "SVLgG_eiLs8")?.caution).toBe("disputed");
    expect(videoCandidates.find(video => video.youtubeId === "gt7EZW5joDg")?.caution).toBe("sponsor");
    expect(getVideoCandidates("ja").slice(0, 3).every(video => video.language === "ja")).toBe(true);
    expect(getVideoCandidates("ru").slice(0, 3).every(video => video.language === "ru")).toBe(true);
  });

  it("keeps original watch links, opt-in players and basePath-safe guide links", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/wiki");
    vi.stubEnv("GITHUB_PAGES", "true");
    const html = renderToStaticMarkup(<VideoCandidateList locale="ja" />);
    expect(html).toContain('href="/wiki/ja/guides/wardogs-fob-guide/"');
    expect(html).toContain('href="https://www.youtube.com/watch?v=WRp2TtPMru8"');
    expect(html).toContain("はちぴ");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("<script");
  });

  it.each(locales)("publishes four sourced dated news records in %s", locale => {
    const updates = getServiceUpdates(locale);
    expect(updates.map(update => update.date)).toEqual(["2026-09-29", "2026-09-26", "2026-09-25", "2026-09-24"]);
    expect(updates.every(update => update.sources.length > 0 && update.title && update.description)).toBe(true);
    expect(updates[2].description).toContain("KB5124010");
  });
});
