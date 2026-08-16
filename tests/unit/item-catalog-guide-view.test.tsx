import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {ItemCatalogGuide} from "../../src/features/items/item-catalog-guide";
import {getCatalogGuide} from "../../src/features/items/item-catalog-guides";

describe("ItemCatalogGuide", () => {
  it("renders a complete weapons catalogue with version and evidence context", () => {
    const guide = getCatalogGuide("weapons");
    expect(guide).toBeDefined();

    const html = renderToStaticMarkup(<ItemCatalogGuide guide={guide!} />);

    expect(html).toContain("33 weapons");
    expect(html).toContain("Alpha 1 - 7 Aug 2026");
    expect(html).toContain("Bushmaster M17S");
    expect(html).toContain("What the catalogue means");
    expect(html).toContain("What is not confirmed");
    expect(html).toContain("tabindex=\"0\"");
    expect(html).toContain("<caption");
    expect(html).toContain("scope=\"row\"");
  });
});
