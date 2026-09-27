import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {CatalogueCard} from "../../src/components/catalogue/catalogue-card";
import {getCatalogueRecords} from "../../src/features/catalogue/catalogue-records";

describe("catalogue card image disclosure", () => {
  const historical = getCatalogueRecords("gear").find((record) => record.slug === "light-helmet")!;
  const pending = getCatalogueRecords("weapons").find((record) => record.slug === "m12g")!;
  const captured = getCatalogueRecords("weapons").find((record) => record.slug === "ak74")!;

  it.each([
    ["en", "Historical owner-provided artwork"],
    ["de", "Historische, vom Betreiber bereitgestellte Grafik"],
    ["ru", "Историческое изображение от владельца сайта"],
    ["pt-br", "Arte histórica fornecida pelo responsável pelo site"],
    ["ja", "サイト運営者提供の過去の画像"],
    ["zh-cn", "站长提供的历史物品图"],
  ] as const)("labels owner-pack art honestly in %s", (locale, caption) => {
    const html = renderToStaticMarkup(<CatalogueCard locale={locale} record={historical} />);

    expect(html).toContain("light-helmet.webp");
    expect(html).toContain(`data-catalogue-media-source="owner-asset-pack"`);
    expect(html).toContain(caption);
    expect(html).toContain("2026");
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
