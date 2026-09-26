import {existsSync, readFileSync, readdirSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {guideManifest} from "../../src/content/manifest";
import {NEWS_UPDATES} from "../../src/features/news/news-data";
import {TOP_GUIDE_SLUGS} from "../../src/features/home/home-data";
import {catalogueRecords} from "../../src/features/catalogue/catalogue-records";
import {catalogueMediaSources} from "../../src/features/catalogue/catalogue-media-sources";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const currentGuideSlugs = [
  "wardogs-beta",
  "wardogs-playtest",
  "wardogs-download",
  "wardogs-launch-checklist",
  "wardogs-livestream",
] as const;
const newGuideSlugs = ["wardogs-100k-clip-contest", "wardogs-known-issues"] as const;
const refreshedGuideSlugs = [
  "wardogs-preload",
  "wardogs-best-settings",
  "wardogs-crash-fix",
  "wardogs-controls",
  "wardogs-ps5",
  "wardogs-factions",
  "wardogs-twitch-drops",
] as const;
const steamUrl = "https://store.steampowered.com/app/1867240/WARDOGS/";
const beta02Url = "https://steamcommunity.com/ogg/1867240/announcements/detail/671752657526850807";
const contestUrl = "https://www.wardogs100k.com/";
const knownIssuesUrl = "https://steamcommunity.com/app/1867240/discussions/0/586183630899134901/";

describe("Closed Beta 02 weekend release contract", () => {
  it("adds the typed current-event source before any UI consumes it", () => {
    const eventPath = path.resolve("src/features/live-ops/current-event.ts");
    expect(existsSync(eventPath)).toBe(true);
    if (!existsSync(eventPath)) return;

    const source = readFileSync(eventPath, "utf8");
    expect(source).toContain('broadcastAt: "2026-09-03T18:00:00Z"');
    expect(source).toContain('startsAt: "2026-09-03T19:00:00Z"');
    expect(source).toContain('endsAt: "2026-09-06T08:00:00Z"');
    expect(source).toContain('earlyAccessAt: "2026-09-10"');
    expect(source).toContain('status: "live"');
    expect(source).toContain('latestPatchVersion: "0.11"');
    expect(source).toContain('maintenanceStartsAt: "2026-09-14T08:00:00Z"');
  });

  it("publishes the contest and known-issues guides in every language while promoting only current help", async () => {
    expect(guideManifest).toHaveLength(51);
    for (const slug of newGuideSlugs) {
      expect(guideManifest.some((entry) => entry.slug === slug), slug).toBe(true);
    }
    expect(TOP_GUIDE_SLUGS).toContain("wardogs-known-issues");
    expect(TOP_GUIDE_SLUGS).not.toContain("wardogs-100k-clip-contest");

    for (const locale of locales) {
      for (const slug of newGuideSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe(slug === "wardogs-known-issues" ? "2026-09-17" : "2026-09-04");
        expect(guide?.frontmatter.description.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(140);
        expect(guide?.frontmatter.faq.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(3);
        expect(guide?.body.length, `${locale}/${slug}`).toBeGreaterThanOrEqual(1_200);
      }

      const contest = await loadGuideDocument(locale, "wardogs-100k-clip-contest");
      const issues = await loadGuideDocument(locale, "wardogs-known-issues");
      expect(contest?.frontmatter.sources.map(({url}) => url)).toContain(contestUrl);
      expect(contest?.body).toContain("#WARDOGS100K");
      expect(contest?.body).toContain("23:59 BST");
      expect(issues?.frontmatter.sources.map(({url}) => url)).toContain(knownIssuesUrl);
      expect(issues?.frontmatter.sources.map(({url}) => url)).toContain(steamUrl);
    }
  });

  it("keeps the ended Beta 02 window on every high-intent access page", async () => {
    for (const locale of locales) {
      for (const slug of currentGuideSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        const sources = guide?.frontmatter.sources.map(({url}) => url) ?? [];
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe(
          slug === "wardogs-livestream" ? "2026-09-13"
            : locale === "en" && ["wardogs-beta", "wardogs-playtest"].includes(slug) ? "2026-09-24"
            : "2026-09-17"
        );
        expect(sources, `${locale}/${slug}`).toContain(steamUrl);
        expect(guide?.body, `${locale}/${slug}`).toContain("08:00 UTC");
        if (["wardogs-beta", "wardogs-playtest", "wardogs-livestream"].includes(slug)) {
          expect(guide?.body, `${locale}/${slug}`).toContain("18:00 UTC");
          expect(guide?.body, `${locale}/${slug}`).toContain("19:00 UTC");
        }
      }
    }
  });

  it("refreshes the remaining decision and troubleshooting guides with current evidence", async () => {
    for (const locale of locales) {
      for (const slug of refreshedGuideSlugs) {
        const guide = await loadGuideDocument(locale, slug);
        const expectedDate = locale === "en" && slug === "wardogs-crash-fix"
          ? "2026-09-26"
          : ["wardogs-preload", "wardogs-best-settings"].includes(slug)
          ? "2026-09-17"
          : slug === "wardogs-ps5"
            ? "2026-09-13"
          : slug === "wardogs-twitch-drops"
            ? "2026-09-09"
            : locale === "en" && slug === "wardogs-factions"
              ? "2026-09-09"
            : "2026-09-04";
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe(expectedDate);
        expect(guide?.frontmatter.sources.map(({url}) => url), `${locale}/${slug}`).toContain(beta02Url);
        if (locale === "en" && slug === "wardogs-crash-fix") {
          expect(guide?.frontmatter.sources.map(({url}) => url)).toContain("https://steamcommunity.com/app/1867240/discussions/3/585060903246925093/");
        }
        if (slug === "wardogs-ps5") {
          expect(guide?.body, `${locale}/${slug}`).toContain("2028");
        } else {
          expect(guide?.body, `${locale}/${slug}`).toContain("Beta 02");
        }
      }

      const preload = await loadGuideDocument(locale, "wardogs-preload");
      const controls = await loadGuideDocument(locale, "wardogs-controls");
      const drops = await loadGuideDocument(locale, "wardogs-twitch-drops");
      const ps5 = await loadGuideDocument(locale, "wardogs-ps5");
      const preloadSearchable = `${preload?.frontmatter.faq.map(({question, answer}) => `${question} ${answer}`).join("\n")}\n${preload?.body}`;
      expect(preloadSearchable, locale).toContain("19:00 UTC");
      expect(preloadSearchable, locale).toContain("08:00 UTC");
      expect(controls?.body, locale).toContain("U");
      expect(drops?.body, locale).toContain("Twitch Inventory");
      expect(ps5?.body, locale).toContain("PS5");
    }
  });

  it("keeps the ended beta and completed contest reveal in home and news data", () => {
    expect(NEWS_UPDATES).toContainEqual({
      date: "2026-09-03",
      status: "Confirmed",
      titleKey: "closedBeta02",
      guideSlug: "wardogs-beta",
    });
    expect(NEWS_UPDATES).toContainEqual({
      date: "2026-09-03",
      status: "Confirmed",
      titleKey: "clipContest",
      guideSlug: "wardogs-100k-clip-contest",
    });
  });

  it("uses meaningful hero image text and keeps the intentional Adsterra policy explicit", () => {
    const hero = readFileSync(path.resolve("src/components/home/home-hero.tsx"), "utf8");
    const adPolicy = readFileSync(path.resolve("src/features/ads/ad-policy.ts"), "utf8");
    expect(hero).toContain('alt={t("home.heroImageAlt")}');
    expect(adPolicy).toContain("ADSTERRA_SOCIAL_BAR_SCRIPT_SRC");
    expect(adPolicy).toContain("ADSTERRA_POPUNDER_SCRIPT_SRC");
    expect(adPolicy).toContain("ADSTERRA_SMARTLINK_URLS");
    expect(adPolicy).toContain("smartlink-1");
    expect(adPolicy).toContain("smartlink-2");
  });

  it("keeps every catalogue image present, described, sourced, and build-labeled", () => {
    for (const record of catalogueRecords) {
      if (record.mediaState === "pending") {
        expect(record.image, record.slug).toBeUndefined();
        expect(record.imageAlt, record.slug).toBeUndefined();
      } else {
        expect(record.image, record.slug).toBeTruthy();
        expect(record.imageAlt?.trim().length, record.slug).toBeGreaterThanOrEqual(5);
        expect(existsSync(path.resolve("public", record.image!.replace(/^\//, ""))), record.image).toBe(true);
        expect(catalogueMediaSources[record.image!], record.image).toBeDefined();
      }
      if (record.evidence.sourceClass === "unverified") {
        expect(record.dataAsOf, record.slug).toMatch(/record-specific evidence pending/i);
        expect(record.evidence.sourceUrl, record.slug).toBeUndefined();
      } else {
        expect(record.dataAsOf, record.slug).toMatch(/Alpha|Closed Beta|Season 1|pre-release/i);
      }
    }
  });

  it("shows the three approved faction emblems in every localized faction guide", async () => {
    for (const locale of locales) {
      const guide = await loadGuideDocument(locale, "wardogs-factions");
      expect(guide?.body, locale).toContain(`<FactionVisuals locale="${locale}" />`);
    }

    for (const faction of ["valkyra", "lonestar", "manticore"]) {
      expect(existsSync(path.resolve(`public/images/catalogue/factions/${faction}.webp`))).toBe(true);
    }
  });
});

function walk(root: string): string[] {
  return readdirSync(root, {withFileTypes: true}).flatMap((entry) => {
    const next = path.join(root, entry.name);
    return entry.isDirectory() ? walk(next) : [next];
  });
}
