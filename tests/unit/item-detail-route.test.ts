import {describe, expect, it, vi} from "vitest";

vi.mock("@/i18n/navigation", () => ({Link: () => null}));
vi.mock("next-intl/server", () => ({getTranslations: vi.fn(async () => (key: string) => key)}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw Object.assign(new Error("NEXT_NOT_FOUND"), {digest: "NEXT_HTTP_ERROR_FALLBACK;404"});
  }
}));

import ItemDetailPage, {generateMetadata} from "../../src/app/[locale]/items/[type]/[slug]/page";

function collectHrefs(node: unknown, hrefs: string[] = []): string[] {
  if (!node || typeof node !== "object") return hrefs;
  if (Array.isArray(node)) {
    node.forEach((child) => collectHrefs(child, hrefs));
    return hrefs;
  }

  const element = node as {props?: {href?: unknown; children?: unknown}};
  if (typeof element.props?.href === "string") hrefs.push(element.props.href);
  collectHrefs(element.props?.children, hrefs);
  return hrefs;
}

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
        "zh-cn": "http://localhost:3000/zh-cn/items/vehicles/bobcat",
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

  it("marks a generated item page noindex,follow and rejects its direct route", async () => {
    const generatedParams = {
      params: Promise.resolve({locale: "en", type: "weapons", slug: "m4"})
    };

    await expect(generateMetadata(generatedParams)).resolves.toMatchObject({
      robots: {index: false, follow: true},
      alternates: {
        canonical: "http://localhost:3000/en/items/weapons/m4"
      }
    });
    await expect(ItemDetailPage(generatedParams)).rejects.toMatchObject({digest: "NEXT_HTTP_ERROR_FALLBACK;404"});
  });

  it("preserves the weapon slug in compare and ammunition tool actions", async () => {
    const page = await ItemDetailPage({
      params: Promise.resolve({locale: "en", type: "weapons", slug: "amp-9"})
    });
    const hrefs = collectHrefs(page);

    expect(hrefs).toContain("/tools/weapon-compare?left=amp-9");
    expect(hrefs).toContain("/tools/ammo-matcher?weapon=amp-9");
  });

  it("keeps authored AMP-9 and Bobcat routes indexable with canonical alternates", async () => {
    const amp9 = await generateMetadata({
      params: Promise.resolve({locale: "en", type: "weapons", slug: "amp-9"})
    });
    const bobcat = await generateMetadata({
      params: Promise.resolve({locale: "zh-cn", type: "vehicles", slug: "bobcat"})
    });

    expect(amp9.robots).toBeUndefined();
    expect(amp9.alternates?.canonical).toBe("http://localhost:3000/en/items/weapons/amp-9");
    expect(amp9.alternates?.languages).toMatchObject({
      en: "http://localhost:3000/en/items/weapons/amp-9",
      "zh-cn": "http://localhost:3000/zh-cn/items/weapons/amp-9"
    });
    expect(bobcat.robots).toBeUndefined();
    expect(bobcat.alternates?.canonical).toBe("http://localhost:3000/zh-cn/items/vehicles/bobcat");
  });
});
