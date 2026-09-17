import {expect, test, type Page} from "@playwright/test";
import {getComparableWeapons} from "../../src/features/tools/weapon-compare-data";
import {decodeWeaponCompareState} from "../../src/features/tools/share-state";

declare global {
  interface Window {
    __task5ReplaceCalls?: number;
  }
}

const mobileViewport = {width: 375, height: 812};

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);

  for (const select of await page.getByRole("combobox").all()) {
    const box = await select.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(metrics.viewportWidth);
  }
}

test("German mobile tools keep selectors contained and expose provenance while sharing replaced URLs", async ({context, page}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {origin: "http://127.0.0.1:3000"});
  await page.setViewportSize(mobileViewport);
  await page.addInitScript(() => {
    window.__task5ReplaceCalls = 0;
    const replaceState = window.history.replaceState.bind(window.history);
    window.history.replaceState = (...args) => {
      window.__task5ReplaceCalls = (window.__task5ReplaceCalls ?? 0) + 1;
      replaceState(...args);
    };
  });

  await page.goto("/de/tools/weapon-compare?left=amp-9&right=deagle");
  await expectNoHorizontalOverflow(page);
  await expect(page.getByText("Quellenklasse: Live-Client").first()).toBeVisible();
  await expect(page.getByText("Vertrauensniveau: Beobachtet").first()).toBeVisible();
  await expect(page.getByText("Quellenklasse: Offiziell")).toBeVisible();
  await expect(page.getByText("Vertrauensniveau: Bestätigt")).toBeVisible();

  const historyLength = await page.evaluate(() => window.history.length);
  await page.getByRole("combobox", {name: "Erste Waffe"}).selectOption("fal");
  await expect(page).toHaveURL(/\/de\/tools\/weapon-compare\?left=fal&right=deagle$/);
  expect(await page.evaluate(() => window.history.length)).toBe(historyLength);
  expect(await page.evaluate(() => window.__task5ReplaceCalls ?? 0)).toBeGreaterThan(0);

  await page.getByRole("button", {name: "Werkzeuglink kopieren"}).click();
  await expect(page.getByRole("button", {name: "Werkzeuglink kopiert"})).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());

  await page.goto("/de/tools/ammo-matcher?weapon=amp-9");
  await expectNoHorizontalOverflow(page);
  await expect(page.getByText("Quellenklasse: Live-Client").first()).toBeVisible();
  await expect(page.getByText("Vertrauensniveau: Beobachtet").first()).toBeVisible();

  const matcherHistoryLength = await page.evaluate(() => window.history.length);
  await page.getByRole("combobox", {name: "Munition auswählen"}).selectOption("9x19mm");
  await expect(page).toHaveURL(/\/de\/tools\/ammo-matcher\?weapon=amp-9&ammo=9x19mm$/);
  expect(await page.evaluate(() => window.history.length)).toBe(matcherHistoryLength);
  expect(await page.evaluate(() => window.__task5ReplaceCalls ?? 0)).toBeGreaterThan(0);

  await page.getByRole("button", {name: "Werkzeuglink kopieren"}).click();
  await expect(page.getByRole("button", {name: "Werkzeuglink kopiert"})).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());

  await page.goto("/de/tools/ammo-matcher?weapon=mp5");
  await expect(page.getByText("Quellenklasse: Historische Creator-Quelle")).toBeVisible();
  await expect(page.getByText("Vertrauensniveau: Gegengeprüft")).toBeVisible();
});

test("invalid repeated weapon parameters recover identically in SSR and after hydration", async ({browser}) => {
  const invalidUrl = "/de/tools/weapon-compare?left=deagle&left=fal&right=amp-9";
  const weapons = getComparableWeapons("de");
  const expected = decodeWeaponCompareState(
    "left=deagle&left=fal&right=amp-9",
    weapons.map(({slug}) => slug),
  );
  const expectedValues = [expected.left, expected.right];

  const serverContext = await browser.newContext({javaScriptEnabled: false, viewport: mobileViewport});
  const serverPage = await serverContext.newPage();
  await serverPage.goto(invalidUrl);
  const serverSelects = serverPage.getByRole("region", {name: "Dokumentierter Feldvergleich"}).getByRole("combobox");
  await expect(serverSelects).toHaveCount(2);
  expect(await serverSelects.evaluateAll((selects) =>
    selects.map((select) => (select as HTMLSelectElement).value))).toEqual(expectedValues);
  await serverContext.close();

  const hydratedContext = await browser.newContext({viewport: mobileViewport});
  const hydratedPage = await hydratedContext.newPage();
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  hydratedPage.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  hydratedPage.on("pageerror", (error) => pageErrors.push(error.message));
  await hydratedPage.goto(invalidUrl);
  const hydratedSelects = hydratedPage.getByRole("region", {name: "Dokumentierter Feldvergleich"}).getByRole("combobox");
  await expect(hydratedSelects).toHaveCount(2);
  expect(await hydratedSelects.evaluateAll((selects) =>
    selects.map((select) => (select as HTMLSelectElement).value))).toEqual(expectedValues);
  await hydratedPage.getByRole("combobox", {name: "Erste Waffe"}).selectOption("fal");
  await expect(hydratedPage).toHaveURL(/left=fal&right=amp-9$/);
  expect(consoleErrors.filter((message) => /hydration|did not match|server rendered/i.test(message))).toEqual([]);
  expect(pageErrors).toEqual([]);
  await hydratedContext.close();
});
