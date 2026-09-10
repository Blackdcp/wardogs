import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe, expect, it} from "vitest";

describe("navigation link labels", () => {
  const header = readFileSync(resolve("src/components/layout/site-header.tsx"), "utf8");
  const footer = readFileSync(resolve("src/components/layout/site-footer.tsx"), "utf8");

  it("gives brand links an accessible name and an explanatory title", () => {
    expect(header.match(/aria-label=\{t\("footer\.aboutTitle"\)\}/g)).toHaveLength(2);
    expect(header.match(/title=\{t\("footer\.aboutTitle"\)\}/g)).toHaveLength(2);
    expect(footer).toContain('aria-label={t("footer.aboutTitle")}');
    expect(footer).toContain('title={t("footer.aboutTitle")}');
  });

  it("provides real anchor text for the icon-only Steam link", () => {
    expect(header).toContain('<span className="sr-only">{t("common.openSteam")}</span>');
    expect(header.match(/aria-label=\{t\("common\.openSteam"\)\}/g)).toHaveLength(2);
    expect(header.match(/title=\{t\("common\.openSteam"\)\}/g)).toHaveLength(2);
  });
});
