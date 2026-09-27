import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {CatalogueCard} from "../../src/components/catalogue/catalogue-card";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";

describe("catalogue card image disclosure", () => {
  const historical = getCatalogueRecords("gear").find((record) => record.slug === "light-helmet")!;
  const pending = getCatalogueRecords("weapons").find((record) => record.slug === "m12g")!;
  const captured = getCatalogueRecords("weapons").find((record) => record.slug === "ak74")!;

  it.each(["en", "de", "ru", "pt-br", "ja", "zh-cn"] as const)("shows owner-pack art without a visible source caption in %s", (locale) => {
    const html = renderToStaticMarkup(<CatalogueCard locale={locale} record={historical} />);

    expect(html).toContain("light-helmet.webp");
    expect(html).not.toContain("data-catalogue-media-source");
    expect(html).not.toContain("Historical owner-provided artwork");
    expect(html).not.toContain("站长提供的历史物品图");
    expect(html).toContain('data-media-surface="contrast"');
  });

  it("keeps an unverified identifier imageless", () => {
    const html = renderToStaticMarkup(<CatalogueCard locale="en" record={pending} />);
    expect(html).toContain("Image not yet verified");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("data-catalogue-media-source");
  });

  it("keeps a sourced capture visible without the owner-pack label", () => {
    const html = renderToStaticMarkup(<CatalogueCard locale="en" record={captured} />);
    expect(html).toContain("ak74.webp");
    expect(html).not.toContain("Historical owner-provided artwork");
  });
});
