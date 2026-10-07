import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {getGuideTaskData} from "../../src/features/guides/guide-task-data";
import {getLocalizedVideoArticle} from "../../src/features/videos/video-localization";

const videoSlug = "wardogs-artillery-tank-guide";
const videoLabels = {
  en: /\bvideo\b/i,
  ru: /видео/i,
  de: /\bVideo/i,
  "pt-br": /vídeo/i,
  ja: /動画/,
  "zh-cn": /视频/,
  "zh-tw": /影片/,
  pl: /wideo/i,
} as const;

// Existing headings are public fragment targets: reordering must not remove them.
const protectedHeadings = [
  "SPH-2 unlock, purchase or operation: which answer do you need?",
  "Choose the right weapon and diagnose before firing",
  "Quick Answer",
  "Season 1 Evidence Ledger (checked September 26)",
  "Copyable cost breakdown for a guide or squad chat",
  "Sortie break-even budgeting example",
  "What the Videos Confirm",
  "Crew and Seat Plan",
  "Positioning Before the First Shot",
  "Stabilize, Range, Fire, Correct",
  "Manual Reload Sequence",
  "Ammunition, Fuel, and Survival",
  "Historical Values Versus Season 1",
  "FAQ",
  "Map-to-calculator SPH-2 workflow",
  "SPH-2 calculator: map, trajectory and correction",
  "Related Guides",
];

describe("artillery operating answers and video intent", () => {
  it("answers how to fire and reload before the unlock and purchase ledger", async () => {
    const guide = await loadGuideDocument("en", "wardogs-artillery-guide");
    expect(guide).not.toBeNull();
    const body = guide!.body;
    const answer = guide!.frontmatter.directAnswer ?? "";
    expect(body.startsWith("## Quick Answer")).toBe(true);
    for (const action of [/gunner seat/i, /stabilize/i, /ammunition/i, /range/i, /correction round/i, /manual reload/i]) {
      expect(answer).toMatch(action);
      expect(getGuideTaskData("wardogs-artillery-guide", "en")?.directAnswer).toMatch(action);
    }
    expect(answer).toMatch(/Beta footage.*current build/);
    const ledger = body.indexOf("## Season 1 Evidence Ledger");
    for (const heading of ["Crew and Seat Plan", "Stabilize, Range, Fire, Correct", "Manual Reload Sequence", "Map-to-calculator SPH-2 workflow"]) {
      expect(body.indexOf(heading), heading).toBeGreaterThan(-1);
      expect(body.indexOf(heading), heading).toBeLessThan(ledger);
    }
    expect(guide!.frontmatter.description).toMatch(/manual reload sequence/i);
    expect(guide!.frontmatter.description).not.toMatch(/reload timing/i);
  });

  it("retains old fragment targets, model discovery and build-labeled economic evidence", async () => {
    const guide = await loadGuideDocument("en", "wardogs-artillery-guide");
    const headings = [...guide!.body.matchAll(/^#{2,3} (.+)$/gm)].map((match) => match[1]);
    expect(headings).toHaveLength(protectedHeadings.length);
    for (const heading of protectedHeadings) expect(headings.filter((value) => value === heading), heading).toHaveLength(1);
    for (const destination of ["/en/items/vehicles/sph-2", "/en/guides/wardogs-progression-wipes-guide", "/en/tools/loadout-budget?pick=vehicles%2Fsph-2", "/en/tools/map", "/en/tools/artillery-calculator"]) {
      expect(guide!.body).toContain(destination);
    }
    expect(guide!.body).toContain("**One-time unlock — official category payment:** $500,000");
    expect(guide!.body).toContain("**Season 1 deployment — corroborating player reports:** $8,000");
    expect(guide!.frontmatter.sources.some(({url}) => url.includes("701027323413004455"))).toBe(true);
  });

  it.each(Object.entries(videoLabels))("makes the %s video result distinct without changing its source or guide relationship", async (locale, label) => {
    const language = locale as keyof typeof videoLabels;
    const article = getLocalizedVideoArticle(language, videoSlug);
    const guide = await loadGuideDocument(language, "wardogs-artillery-guide");
    expect(article?.title).toMatch(label);
    expect(article?.title).toContain("SPH-2");
    expect(article?.title).not.toBe(guide!.frontmatter.title);
    expect(article?.youtubeId).toBe("oP9RelmWk6A");
    expect(article?.internalGuideSlug).toBe("wardogs-artillery-guide");
  });
});
