import {describe, expect, it, vi} from "vitest";

vi.mock("@/i18n/navigation", () => ({Link: () => null}));
vi.mock("next-intl/server", () => ({getTranslations: vi.fn(async () => (key: string) => key)}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw Object.assign(new Error("NEXT_NOT_FOUND"), {digest: "NEXT_HTTP_ERROR_FALLBACK;404"});
  }
}));

import ItemDetailPage, {generateMetadata} from "../../src/app/[locale]/items/[type]/[slug]/page";

const localizedBobcatParams = {
  params: Promise.resolve({locale: "ru", type: "vehicles", slug: "bobcat"})
};

describe("item detail route entry", () => {
  it("generates localized canonical metadata for a known model", async () => {
    const metadata = await generateMetadata(localizedBobcatParams);

    expect(metadata.alternates).toEqual({
      canonical: "http://localhost:3000/ru/items/vehicles/bobcat",
      languages: {
        en: "http://localhost:3000/en/items/vehicles/bobcat",
        ru: "http://localhost:3000/ru/items/vehicles/bobcat",
        de: "http://localhost:3000/de/items/vehicles/bobcat",
        "pt-br": "http://localhost:3000/pt-br/items/vehicles/bobcat",
        ja: "http://localhost:3000/ja/items/vehicles/bobcat",
        "x-default": "http://localhost:3000/en/items/vehicles/bobcat"
      }
    });
    expect(metadata.openGraph?.url).toBe("http://localhost:3000/ru/items/vehicles/bobcat");
  });

  it("renders that localized model route instead of returning 404", async () => {
    await expect(ItemDetailPage(localizedBobcatParams)).resolves.toBeTruthy();
  });

  it("does not synthesize metadata for an unknown model", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({locale: "en", type: "vehicles", slug: "not-a-model"})
    });

    expect(metadata).toEqual({});
  });
});
