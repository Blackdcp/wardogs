import {expect, test} from "@playwright/test";

for (const viewport of [{width: 390, height: 844}, {width: 1700, height: 1000}]) {
  test(`display ads cannot access or redirect the parent at ${viewport.width}px`, async ({page, context}) => {
    await page.setViewportSize(viewport);
    // Substitute a harmless adversarial creative; never click a live advertiser.
    await context.route("https://arkgleamfox.com/**", (route) => route.fulfill({
      contentType: "application/javascript",
      body: `
        document.body.textContent = "Sandbox test creative";
        try { parent.document.body.dataset.adEscape = "yes"; } catch { document.body.dataset.parentAccess = "blocked"; }
        try { top.location.href = "https://example.com/blocked-ad-test"; } catch { document.body.dataset.topNavigation = "blocked"; }
        document.body.dataset.popup = window.open("https://example.com/blocked-ad-test") === null ? "blocked" : "opened";
      `
    }));
    await page.goto("/en/guides/wardogs-artillery-guide");
    const banner = page.locator('iframe[data-adsterra-sandbox="3342dc928824e6ed5c01555e7f9e9e0f"]');
    await expect(banner).toHaveAttribute("sandbox", "allow-scripts allow-same-origin");
    await expect(banner).toHaveAttribute("src", /^http:\/\/localhost:\d+\/api\/ad-frame\//);
    await banner.scrollIntoViewIfNeeded();
    const creative = page.frameLocator('iframe[data-adsterra-sandbox="3342dc928824e6ed5c01555e7f9e9e0f"]').locator("body");
    await expect(creative).toHaveText("Sandbox test creative");
    await expect(creative).toHaveAttribute("data-parent-access", "blocked");
    await expect(creative).toHaveAttribute("data-top-navigation", "blocked");
    await expect(creative).toHaveAttribute("data-popup", "blocked");
    await expect(page).toHaveURL(/\/en\/guides\/wardogs-artillery-guide$/);
    expect(await page.locator("body").getAttribute("data-ad-escape")).toBeNull();
    expect(context.pages()).toHaveLength(1);
    await expect(page.locator("script[src*='arkgleamfox'], script[src*='effectivecpmnetwork']")).toHaveCount(0);
    await expect(page.locator('[data-ad-slot="adsterra-native"], [data-ad-placement="mobile-sticky"]')).toHaveCount(0);
  });
}
