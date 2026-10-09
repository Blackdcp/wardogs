import {describe, expect, it} from "vitest";
import {locales} from "@/config/site";
import {compileGuideBody, loadGuideDocument} from "@/content/guides";
import {mdxComponents} from "@/components/mdx/mdx-components";

const creatorSource = "https://www.youtube.com/watch?v=kC3P-klWNxk&t=873s";

describe("LMG position testing in the existing loadout guide", () => {
  it.each(locales)("renders a localized four-step workflow without invented weapon coefficients in %s", async locale => {
    const guide = (await loadGuideDocument(locale, "wardogs-best-weapons-loadouts"))!;
    const flow = guide.body.split("{/* lmg-bipod-workflow */}")[1]?.split(/^## /m)[0];
    expect(flow).toBeTruthy();
    expect(flow?.match(/^\d\. /gm)).toHaveLength(4);
    expect(flow).toContain("M249");
    expect(flow).toContain("14:33");
    expect(flow).toContain(creatorSource);
    expect(guide.frontmatter.sources).toContainEqual(expect.objectContaining({url: creatorSource, kind: "creator", checkedAt: "2026-10-09"}));
    for (const tool of ["ammo-matcher", "loadout-budget"]) expect(flow).toContain(`](/${locale}/tools/${tool})`);
    expect(flow).not.toMatch(/\d+(?:\.\d+)?\s*%/);
    expect((await compileGuideBody(guide.body, mdxComponents)).content).toBeTruthy();
  });
});
