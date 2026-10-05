import {expect, test} from "@playwright/test";

test("home presents a focused guide-site journey with integrated high-viewability sponsorship", async ({page}) => {
  await page.setViewportSize({width: 1365, height: 900});
  await page.goto("/en");

  const sectionOrder = await page.locator("main").evaluate((main) => {
    const selectors = [
      "#home-hero-title",
      "[data-live-event]",
      "[data-home-action-hub]",
      "[data-home-section='guide-hub']",
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


  const headerTools = page.locator("[data-header-tool-shortcuts='true']");
  await expect(headerTools).toBeVisible();
  const headerToolBox = await headerTools.boundingBox();
  expect(headerToolBox?.height ?? 0).toBeLessThanOrEqual(38);

  const heroSearchTrigger = page.locator("[data-search-trigger-style='hero-compact']");
  await expect(heroSearchTrigger).toBeVisible();
  const heroSearchBox = await heroSearchTrigger.boundingBox();
  expect(heroSearchBox?.height ?? 0).toBeLessThanOrEqual(56);
  expect(heroSearchBox?.width ?? 0).toBeLessThanOrEqual(640);

  await expect(page.locator("[data-hero-trending='true']")).toHaveCount(0);
  await expect(page.locator("[data-hero-popular-links='true'] a")).toHaveCount(5);

  const heroTasks = await page.locator("[data-home-placement='hero'][data-home-task]").evaluateAll((links) => links.map((link) => link.getAttribute("data-home-task")));
  expect(heroTasks).toEqual(["map", "calculator"]);
  await expect(page.locator("[data-home-placement='hero'][data-home-task='season2']")).toHaveCount(0);
  await expect(page.locator("[data-home-placement='hero'][data-home-task='status']")).toHaveCount(0);

  await expect(page.locator("[data-global-ad-position='top']")).toHaveCount(0);

  await expect(page.locator("[data-home-action-hub] [data-home-task]")).toHaveCount(6);
  await expect(page.locator("[data-home-action-hub] [data-home-task='money']")).toHaveCount(1);
  await expect(page.locator("[data-home-action-hub] [data-home-task='pcFixes']")).toHaveCount(1);
  await expect(page.locator("[data-home-sponsored-slot='true']")).toHaveCount(1);
  await expect(page.locator("[data-home-tools] [data-home-task]")).toHaveCount(9);
  await expect(page.locator("[data-home-placement='collections'][href='/en/guides#collection-logistics']")).toHaveCount(1);
  await expect(page.locator("[data-home-editorial-briefing]")).toHaveCount(0);
  const downstreamSections = await page.locator("[data-home-section]").evaluateAll((sections) => sections.map((section) => section.getAttribute("data-home-section")));
  expect(downstreamSections).toEqual(["tasks", "guide-hub", "catalogue", "search"]);

  const viewportScreens = await page.evaluate(() => document.documentElement.scrollHeight / window.innerHeight);
  expect(viewportScreens).toBeLessThan(8);

  const searchHeight = await page.locator("[data-site-search]").evaluate((section) => section.getBoundingClientRect().height);
  expect(searchHeight).toBeLessThan(240);
});

test("hero search opens in place instead of jumping to the footer search strip", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/en");

  await page.locator("[data-hero-search-trigger='true']").click();

  await expect(page.getByRole("dialog", {name: "Search WARDOGS Wiki"})).toBeVisible();

  const dialogPanel = page.locator("[data-search-dialog-panel='command']");
  await expect(dialogPanel).toBeVisible();
  const dialogBox = await dialogPanel.boundingBox();
  expect(dialogBox?.width ?? 0).toBeLessThanOrEqual(640);

  const dialogInput = page.locator("[data-search-dialog-input='command']");
  await expect(dialogInput).toBeVisible();
  const inputBox = await dialogInput.boundingBox();
  expect(inputBox?.height ?? 0).toBeLessThanOrEqual(52);
  await expect(page).not.toHaveURL(/#site-search-title$/);
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeLessThan(200);
});

test("Japanese homepage keeps squad, towers, cargo, helicopter and wipe entries near the tools", async ({page}) => {
  await page.goto("/ja");
  const recovery = page.locator('[data-home-recovery="ja"]');
  await expect(recovery).toBeVisible();
  for (const slug of ["wardogs-squad-guide", "wardogs-towers-guide", "wardogs-cargo-guide", "wardogs-helicopter-guide", "wardogs-progression-wipes-guide"]) {
    await expect(recovery.locator(`a[href='/ja/guides/${slug}'][data-home-task][data-home-placement='recovery']`)).toHaveCount(1);
  }
});

test("guide hub anchors lead to complete task collections", async ({page}) => {
  await page.goto("/en/guides");
  const collections = page.locator('section[id^="collection-"]');
  await expect(collections).toHaveCount(6);
  const links = await collections.locator('article a').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
  expect(new Set(links).size).toBe(links.length);
  for (const slug of ["wardogs-beginner-guide", "wardogs-money-guide", "wardogs-best-weapons-loadouts", "wardogs-mortar-guide", "wardogs-fob-guide", "wardogs-crash-fix", "wardogs-progression-wipes-guide"]) {
    expect(links).toContain(`/en/guides/${slug}`);
  }
  await page.locator('a[href="#collection-logistics"]').click();
  await expect(page).toHaveURL(/#collection-logistics$/);
  await expect(page.locator('#collection-logistics-title')).toBeInViewport();
});
