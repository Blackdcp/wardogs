import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";

vi.mock("next/navigation", () => ({notFound: () => { throw new Error("NEXT_NOT_FOUND"); }}));

describe("skins gallery", () => {
  it("renders the 21 listed skins while excluding emotes and unverified prices", async () => {
    const {SkinGallery} = await import("../../src/components/skins/skin-gallery");
    const html = renderToStaticMarkup(<SkinGallery locale="en" />);

    expect(html.match(/data-skin-entry=/g)).toHaveLength(21);
    expect(html).toContain("Black &amp; Gold");
    expect(html).toContain("Digital Wood");
    expect(html).toContain("Two Tone Desert");
    expect(html).toContain("Taxi");
    expect(html).toContain("Faction Logo");
    expect(html).not.toMatch(/emote-shh|emote-middle_finger|emote-rockpaperscissors/);
    expect(html).not.toMatch(/today.s price|gold bar exchange rate|\$\d/);
  });

  it("leaves the Bushmaster Faction Logo image pending and marks alias images as candidates", async () => {
    const {SkinGallery} = await import("../../src/components/skins/skin-gallery");
    const html = renderToStaticMarkup(<SkinGallery locale="en" />);

    expect(html).toContain("Faction Logo · Bushmaster M17S");
    expect(html).not.toContain("factionlogo-wepn_033.webp");
    expect(html).toContain("Image pending identity check");
    expect(html).toContain("twotonedesert-ax50.webp");
    expect(html).toContain("twotonedesert-mp9.webp");
    expect(html.match(/Candidate image; item identity unverified/g)).toHaveLength(2);
  });

  it("exports all locale routes with localized canonical metadata", async () => {
    const {generateMetadata, generateStaticParams} = await import("../../src/app/[locale]/skins/page");
    expect(generateStaticParams().map(({locale}) => locale)).toEqual(["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"]);
    const metadata = await generateMetadata({params: Promise.resolve({locale: "en"})});
    expect(metadata.title).toContain("WARDOGS Skins");
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/en/skins");
  });
});
