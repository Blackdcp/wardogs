import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
import {locales} from "@/config/site";
import {EquipmentCompatibility} from "@/components/tools/equipment-compatibility";
import {getCompatibilityDataset} from "@/features/tools/equipment-compatibility";
import {getCompatibilityCopy} from "@/features/tools/equipment-compatibility-copy";

vi.mock("next/image", () => ({default: (props: Record<string, unknown>) => createElement("img", props)}));
vi.mock("@/i18n/navigation", () => ({Link: (props: Record<string, unknown>) => createElement("a", props)}));

describe("compatibility matrix view", () => {
  it.each(locales)("renders historical evidence without invented compatible results in %s", (locale) => {
    const dataset = getCompatibilityDataset(locale);
    const html = renderToStaticMarkup(createElement(EquipmentCompatibility, {dataset, locale}));
    const copy = getCompatibilityCopy(locale);
    expect(html).toContain("data-compatibility-matrix");
    expect(html).toContain(copy.title.replace(/&/g, "&amp;"));
    expect(html.match(/data-fit="unknown"/g)).toHaveLength(dataset.attachments.length);
    expect(html).not.toMatch(/data-fit="(?:confirmed|incompatible)"/);
    expect(html).toContain(copy.unitUnknown);
    expect(html).toContain(copy.scope);
    expect(html).toContain("overflow-x-auto");
    expect(html).toContain("2026");
    expect(html).toContain("MP5");
  });
});
