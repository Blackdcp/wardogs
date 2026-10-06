import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {compileLocalizedGuideBody, loadGuideDocument} from "../../src/content/guides";
import {prepareGuideBodyForTaskPanel} from "../../src/features/guides/guide-task-body";

describe("English mortar build and use intent", () => {
  it("renders the build and loading checklist before calculator instructions", async () => {
    const guide = await loadGuideDocument("en", "wardogs-mortar-guide");
    const body = prepareGuideBodyForTaskPanel(guide!.body, "en", true);
    const compiled = await compileLocalizedGuideBody(body, {}, "en");
    const html = renderToStaticMarkup(compiled.content);
    const section = html.match(/<h2>How to build and load a mortar in WARDOGS<\/h2>([\s\S]*?)(?=<h2>)/)?.[1];

    expect(section).toBeDefined();
    expect(html.indexOf("How to build and load a mortar in WARDOGS")).toBeLessThan(html.indexOf("Calculator-first mortar workflow"));
    expect(section?.match(/<li>/g)).toHaveLength(6);
    for (const href of [
      "/en/guides/wardogs-fob-guide",
      "/en/guides/wardogs-cargo-guide",
      "/en/guides/wardogs-equipment-tools-guide",
      "/en/items/weapons/mortar",
      "/en/tools/map",
      "/en/tools/artillery-calculator"
    ]) expect(section).toContain(`href="${href}"`);
    expect(section).toMatch(/historical|dated/i);
    expect(section).toMatch(/not a current-client reproduction/);
    expect(section).toMatch(/costs, unlocks, keys and ammunition requirements[^<]*build-sensitive/);
  });
});
