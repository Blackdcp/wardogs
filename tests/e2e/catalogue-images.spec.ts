import {expect, test} from "@playwright/test";

test("owner-pack ammo, attachment, and gear images load in the catalogue", async ({page}) => {
  for (const [category, slug] of [
    ["ammo", "45-acp"],
    ["attachments", "vektor-frenix-x-micro-reflex-sight"],
    ["gear", "light-helmet"],
  ]) {
    await page.goto(`/en/items/${category}`);
    const card = page.locator(`[data-catalogue-record="${slug}"]`);
    const image = card.locator("img");
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
});
