import {expect, test} from "@playwright/test";

test("home presents a focused guide-site journey with integrated high-viewability sponsorship", async ({page}) => {
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

  const heroTasks = await page.locator("[data-home-placement='hero'][data-home-task]").evaluateAll((links) => links.map((link) => link.getAttribute("data-home-task")));
  expect(heroTasks).toEqual(["map", "calculator"]);
  await expect(page.locator("[data-home-placement='hero'][data-home-task='season2']")).toHaveCount(0);
  await expect(page.locator("[data-home-placement='hero'][data-home-task='status']")).toHaveCount(0);

  await expect(page.locator("[data-global-ad-position='top']")).toHaveCount(0);

  const decisionCards = page.locator("[data-home-action-hub] [data-home-placement='action-hub'][data-home-task]");
  await expect(decisionCards).toHaveCount(6);
  await expect(page.locator("[data-home-action-hub] [data-home-task='map']")).toBeVisible();
  await expect(page.locator("[data-home-action-hub] [data-home-task='season2']")).toBeVisible();
  await expect(page.locator("[data-home-sponsored-slot='true']")).toBeVisible();
  await expect(page.locator("[data-home-sponsored-slot='true']")).toHaveCount(1);

  const searchHeight = await page.locator("[data-site-search]").evaluate((section) => section.getBoundingClientRect().height);
  expect(searchHeight).toBeLessThan(240);
});

test("hero search opens in place instead of jumping to the footer search strip", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/en");

  await page.locator("[data-hero-search-trigger='true']").click();

  await expect(page.getByRole("dialog", {name: "Search WARDOGS Wiki"})).toBeVisible();
  await expect(page).not.toHaveURL(/#site-search-title$/);
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeLessThan(200);
});
