import {beforeEach, describe, expect, it, vi} from "vitest";

const translations = {
  metaTitle: "WARDOGS Guides - Beta, Gameplay, Weapons & Fixes",
  title: "WARDOGS Guides",
  description: "Browse the complete WARDOGS guide library."
} as const;

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: keyof typeof translations) => translations[key]),
  setRequestLocale: vi.fn()
}));
vi.mock("next/navigation", () => ({notFound: vi.fn()}));
vi.mock("@/components/guides/guide-grid", () => ({GuideGrid: () => null}));
vi.mock("@/components/home/priority-guides", () => ({PriorityGuides: () => null}));
vi.mock("@/components/guides/video-guide-strip", () => ({VideoGuideStrip: () => null}));
vi.mock("@/components/seo/json-ld", () => ({JsonLd: () => null}));
vi.mock("@/features/guides/guide-index", () => ({buildGuideIndex: vi.fn(async () => [])}));
vi.mock("@/lib/structured-data", () => ({buildGuideIndexJsonLd: vi.fn(() => ({}))}));

describe("guide index metadata", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("uses the descriptive metadata title instead of the short visible heading", async () => {
    const {generateMetadata} = await import("@/app/[locale]/guides/page");

    const metadata = await generateMetadata({params: Promise.resolve({locale: "en"})});

    expect(metadata.title).toBe("WARDOGS Guides - Beta, Gameplay, Weapons & Fixes");
  });
});
