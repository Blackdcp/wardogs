import {describe, expect, it} from "vitest";
import {loadGuideDocument} from "../../src/content/guides";
import {TOP_GUIDE_SLUGS} from "../../src/features/home/home-data";
import {getPublicStatus} from "../../src/features/live-ops/public-status";

const locales = ["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const;
const launchGuides = ["wardogs-server-status", "wardogs-patch-notes"] as const;

describe("September 10 launch-day operations", () => {
  it("publishes localized status and patch desks with search-ready metadata", async () => {
    for (const locale of locales) {
      for (const slug of launchGuides) {
        const guide = await loadGuideDocument(locale, slug);
        expect(guide, `${locale}/${slug}`).not.toBeNull();
        expect(guide?.frontmatter.updatedAt, `${locale}/${slug}`).toBe("2026-09-10");
        expect(guide?.frontmatter.title.length, `${locale}/${slug} title`).toBeGreaterThanOrEqual(12);
        expect(guide?.frontmatter.description.length, `${locale}/${slug} description`).toBeGreaterThanOrEqual(140);
        expect(guide?.frontmatter.description.length, `${locale}/${slug} description`).toBeLessThanOrEqual(160);
      }
    }
  });

  it("keeps launch availability and patch publication claims evidence-labeled", async () => {
    const status = await loadGuideDocument("en", "wardogs-server-status");
    const patches = await loadGuideDocument("en", "wardogs-patch-notes");
    expect(status?.body).toMatch(/Steam.*source of truth|source of truth.*Steam/i);
    expect(status?.body).toMatch(/not.*live telemetry|does not operate.*telemetry/i);
    expect(patches?.body).toMatch(/no official.*launch patch notes.*published/i);
    expect(patches?.body).toMatch(/Beta.*histor/i);
  });

  it("exposes both launch desks through home priority data and the public API", () => {
    expect(TOP_GUIDE_SLUGS.slice(0, 8)).toContain("wardogs-server-status");
    expect(TOP_GUIDE_SLUGS.slice(0, 8)).toContain("wardogs-patch-notes");
    expect(getPublicStatus().links.serverStatus).toMatch(/\/en\/guides\/wardogs-server-status$/);
    expect(getPublicStatus().links.patchNotes).toMatch(/\/en\/guides\/wardogs-patch-notes$/);
  });
});
