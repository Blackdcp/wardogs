import {expect, test} from "@playwright/test";

test("home keeps action and freshness sections ahead of discovery and the compact search strip", async ({page}) => {
  await page.setViewportSize({width: 1365, height: 900});
  await page.goto("/en");

  const sectionOrder = await page.locator("main").evaluate((main) => {
    const selectors = [
      "#home-hero-title",
      "[data-live-event]",
      "[data-home-action-hub]",
      "[data-current-build-changes]",
      "#priority-guides-title",
      "[data-catalogue-home-band]",
      "[data-site-search]"
    ];
    const sections = Array.from(main.querySelectorAll("section"));

    return selectors.map((selector) => {
      const section = main.querySelector(selector)?.closest("section");
      return section ? sections.indexOf(section) : -1;
    });
  });

  expect(sectionOrder.every((position) => position >= 0)).toBe(true);
  expect(sectionOrder).toEqual([...sectionOrder].sort((left, right) => left - right));

  const searchHeight = await page.locator("[data-site-search]").evaluate((section) => section.getBoundingClientRect().height);
  expect(searchHeight).toBeLessThan(240);
});

test("hero search opens in place instead of jumping to the footer search strip", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/en");

  await page.locator("[data-hero-search-trigger], [data-hero-search-box='true'] a").first().click();

  await expect(page.getByRole("dialog", {name: "Search WARDOGS Wiki"})).toBeVisible();
  await expect(page).not.toHaveURL(/#site-search-title$/);
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeLessThan(200);
});
