import {beforeEach, describe, expect, it, vi} from "vitest";

const translations = {
  title: "Visible legal heading",
  intro: "Short visible introduction.",
  metaTitle: "WARDOGS Wiki Legal Page Metadata Title",
  metaDescription: "A complete legal-page search description that is deliberately different from the short visible introduction used in the rendered page."
} as const;

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: keyof typeof translations) => translations[key]),
  setRequestLocale: vi.fn()
}));
vi.mock("next/navigation", () => ({notFound: vi.fn()}));

describe("legal page metadata", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  const pageLoaders = {
    privacy: () => import("@/app/[locale]/privacy/page"),
    terms: () => import("@/app/[locale]/terms/page")
  } as const;

  it.each(["privacy", "terms"] as const)("uses dedicated SEO fields for the %s page", async (page) => {
    const legalPage = await pageLoaders[page]();

    const metadata = await legalPage.generateMetadata({params: Promise.resolve({locale: "en"})});

    expect(metadata.title).toBe(translations.metaTitle);
    expect(metadata.description).toBe(translations.metaDescription);
  });
});
