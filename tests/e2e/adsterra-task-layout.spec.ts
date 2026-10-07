import {expect, test} from "@playwright/test";
import {expectNoHorizontalOverflow} from "./helpers";

test.beforeEach(async ({page}) => {
  await page.route("**/bauval.org/**", (route) => route.fulfill({contentType: "application/javascript", body: "/* Layout test: no third-party creative. */"}));
});

for (const tool of ["map", "artillery-calculator"]) {
  for (const width of [390, 1440, 1920]) {
    test(`${tool} keeps a single rectangle outside its work surface at ${width}px`, async ({page}) => {
      await page.setViewportSize({width, height: 1000});
      await page.goto(`/en/tools/${tool}`);
      const workspace = page.locator("[data-tool-workspace]");
      const sponsor = page.locator("[data-tool-workspace-sponsor]");
      await expect(workspace).toBeVisible();
      await expect(sponsor.locator('[data-ad-placement="rectangle"]')).toHaveCount(1);
      await expect(workspace.locator('[data-ad-placement="rectangle"]')).toHaveCount(0);
      await expect(page.locator('[data-ad-slot="adsterra-native"]')).toHaveCount(1);
      const work = await workspace.boundingBox();
      const ad = await sponsor.boundingBox();
      expect(work).not.toBeNull();
      expect(ad).not.toBeNull();
      if (width >= 1920) {
        expect(work!.width).toBeGreaterThanOrEqual(1180);
        expect(ad!.x).toBeGreaterThanOrEqual(work!.x + work!.width + 20);
        const rightRail = await page.locator('[data-ad-placement="right-rail"]').boundingBox();
        expect(rightRail).not.toBeNull();
        expect(ad!.x + ad!.width).toBeLessThan(rightRail!.x);
      } else {
        expect(ad!.y).toBeGreaterThanOrEqual(work!.y + work!.height);
        if (width === 1440) expect(work!.width).toBeGreaterThanOrEqual(1180);
      }
      await expectNoHorizontalOverflow(page);
    });
  }
}

for (const path of ["guides/wardogs-artillery-guide", "items/weapons/amp-9", "videos/wardogs-artillery-tank-guide"]) {
  test(`useful content separates both detail units on ${path}`, async ({page}) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto(`/ja/${path}`);
    const native = page.locator('[data-ad-slot="adsterra-native"]');
    const rectangle = page.locator('[data-ad-placement="rectangle"]');
    await expect(native).toHaveCount(1);
    await expect(rectangle).toHaveCount(1);
    const betweenHeadings = await page.locator("article h2").evaluateAll((headings) => {
      const native = document.querySelector('[data-ad-slot="adsterra-native"]')!;
      const rectangle = document.querySelector('[data-ad-placement="rectangle"]')!;
      return headings.filter((heading) => Boolean(native.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING) && Boolean(heading.compareDocumentPosition(rectangle) & Node.DOCUMENT_POSITION_FOLLOWING)).length;
    });
    expect(betweenHeadings).toBeGreaterThan(0);
    await expectNoHorizontalOverflow(page);
  });
}
