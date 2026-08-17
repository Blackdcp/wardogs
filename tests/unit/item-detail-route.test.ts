import {describe, expect, it, vi} from "vitest";

vi.mock("@/i18n/navigation", () => ({Link: () => null}));
vi.mock("next-intl/server", () => ({getTranslations: vi.fn()}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw Object.assign(new Error("NEXT_NOT_FOUND"), {digest: "NEXT_HTTP_ERROR_FALLBACK;404"});
  }
}));

import ItemDetailPage, {generateMetadata} from "../../src/app/[locale]/items/[type]/[slug]/page";

const unsupportedBobcatParams = {
  params: Promise.resolve({locale: "ru", type: "vehicles", slug: "bobcat"})
};

describe("item detail route entry", () => {
  it("generates only English canonical metadata for a known model requested in an unsupported locale", async () => {
    const metadata = await generateMetadata(unsupportedBobcatParams);

    expect(metadata.alternates).toEqual({
      canonical: "http://localhost:3000/en/items/vehicles/bobcat",
      languages: {
        en: "http://localhost:3000/en/items/vehicles/bobcat",
        "x-default": "http://localhost:3000/en/items/vehicles/bobcat"
      }
    });
    expect(metadata.openGraph?.url).toBe("http://localhost:3000/en/items/vehicles/bobcat");
    expect(JSON.stringify(metadata)).not.toContain("/ru/items/vehicles/bobcat");
  });

  it("keeps that unsupported model locale on Next's 404 path", async () => {
    await expect(ItemDetailPage(unsupportedBobcatParams)).rejects.toMatchObject({
      digest: "NEXT_HTTP_ERROR_FALLBACK;404"
    });
  });

  it("does not synthesize metadata for an unknown model", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({locale: "en", type: "vehicles", slug: "not-a-model"})
    });

    expect(metadata).toEqual({});
  });
});
