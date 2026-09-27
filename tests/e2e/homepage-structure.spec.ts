import {expect, test} from "@playwright/test";

test("home puts the highest-intent paths ahead of the compact search strip", async ({page}) => {
  await page.setViewportSize({width: 1365, height: 900});
  await page.goto("/en");

  const sectionOrder = await page.locator("main").evaluate((main) => {
    const selectors = [
      "#home-hero-title",
      "[data-live-event]",
      "[data-home-action-hub]",
      "[data-catalogue-home-band]",
      "#priority-guides-title",
      "[data-site-search]",
      "[data-current-build-changes]"
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
