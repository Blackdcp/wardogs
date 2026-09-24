import {describe, expect, it} from "vitest";
import {GET, generateStaticParams} from "../../src/app/api/search-index/[locale]/route";
import {locales} from "../../src/config/site";

describe("localized search index endpoint", () => {
  it("prebuilds all supported locales and rejects unknown ones", async () => {
    expect(generateStaticParams()).toEqual(locales.map((locale) => ({locale})));
    const invalid = await GET(new Request("https://example.com/api/search-index/no"), {params: Promise.resolve({locale: "no"})});
    expect(invalid.status).toBe(404);
  });

  it("returns item and guide destinations without user search input", async () => {
    const response = await GET(new Request("https://example.com/api/search-index/en"), {params: Promise.resolve({locale: "en"})});
    const entries = await response.json() as {type: string; href: string}[];
    expect(response.status).toBe(200);
    expect(entries).toContainEqual(expect.objectContaining({type: "item", href: "/items/vehicles/sph-2"}));
    expect(entries).toContainEqual(expect.objectContaining({type: "guide", href: "/guides/wardogs-artillery-guide"}));
  });
});
