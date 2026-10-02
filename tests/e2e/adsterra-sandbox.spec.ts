import {expect, test} from "@playwright/test";
import {ADSTERRA_BANNER_SANDBOX} from "../../src/features/ads/adsterra-banner";

test.setTimeout(90_000);

for (const viewport of [{width: 390, height: 844}, {width: 1700, height: 1000}]) {
  test("ads allow deliberate clicks without hijacking the parent at " + viewport.width + "px", async ({page, context}) => {
    // All clicks use substituted creatives and destinations, never a live advertiser.
    await page.setViewportSize(viewport);
    await context.route("https://example.com/**", (route) => route.fulfill({
      contentType: "text/html",
      body: route.request().method() === "POST"
        ? "<h1>Submitted</h1>"
        : '<h1>Mock advertiser</h1><form method="post" action="/submitted"><button>Submit</button></form>'
    }));
    await context.route("https://arkgleamfox.com/**", (route) => route.fulfill({
      contentType: "application/javascript",
      body: [
        '(() => {',
        'const native = document.getElementById("container-481d6501bcd0c27b98bc3c4776a26f6e");',
        'const container = native || document.body;',
        'if (native) native.style.height = "260px";',
        'container.innerHTML += \'<a href="https://example.com/ad-click-test" target="_blank">Sandbox test creative</a><button id="script-click">Script click</button><a href="sms:123">SMS test</a><button id="script-sms">SMS script test</button>\';',
        'document.getElementById("script-click").onclick = () => window.open("https://example.com/script-click-test", "_blank");',
        'document.getElementById("script-sms").onclick = () => document.body.dataset.smsOpen = window.open("sms:123") === null ? "blocked" : "opened";',
        'if (native) {',
        'for (const [id, destination] of [["deferred-web", "https://example.com/native-tracked-click"], ["deferred-sms", "sms:123"], ["deferred-empty", "//"]]) {',
        'const link = document.createElement("a"); link.id = id; link.className = native.id + "__link"; link.href = "//"; link.target = "_blank"; link.textContent = id;',
        'link.addEventListener("click", () => { document.body.dataset.lastDeferred = id; link.href = destination; setTimeout(() => { link.href = "//"; }); });',
        'native.appendChild(link);',
        '}',
        '}',
        'try { parent.document.body.dataset.adEscape = "yes"; } catch { document.body.dataset.parentAccess = "blocked"; }',
        'try { top.location.href = "https://example.com/blocked-ad-test"; } catch { document.body.dataset.topNavigation = "blocked"; }',
        'document.body.dataset.popup = window.open("https://example.com/blocked-ad-test") === null ? "blocked" : "opened";',
        '})();'
      ].join("\n")
    }));
    await page.goto("/en/guides/wardogs-artillery-guide");
    const bannerSelector = 'iframe[data-adsterra-sandbox="3342dc928824e6ed5c01555e7f9e9e0f"]';
    const banner = page.locator(bannerSelector);
    await expect(banner).toHaveAttribute("sandbox", ADSTERRA_BANNER_SANDBOX);
    await expect(banner).toHaveAttribute("src", /^http:\/\/localhost:\d+\/api\/ad-frame\/.*\?v=20261002-native-clicks$/);
    await banner.scrollIntoViewIfNeeded();
    const display = page.frameLocator(bannerSelector);
    await expect(display.locator("body")).toHaveAttribute("data-parent-access", "blocked");
    await expect(display.locator("body")).toHaveAttribute("data-top-navigation", "blocked");
    await expect(display.locator("body")).toHaveAttribute("data-popup", "blocked");
    await expect(page).toHaveURL(/\/en\/guides\/wardogs-artillery-guide$/);
    expect(await page.locator("body").getAttribute("data-ad-escape")).toBeNull();
    expect(context.pages()).toHaveLength(1);
    await expect(page.locator("script[src*='arkgleamfox'], script[src*='effectivecpmnetwork']")).toHaveCount(0);

    const displayPopup = context.waitForEvent("page", {timeout: 15_000});
    await display.getByRole("link", {name: "Sandbox test creative"}).click();
    const displayLanding = await displayPopup;
    await expect(displayLanding).toHaveURL("https://example.com/ad-click-test");
    await displayLanding.getByRole("button", {name: "Submit", exact: true}).click();
    await expect(displayLanding.getByRole("heading")).toHaveText("Submitted");
    await displayLanding.close();

    const nativeSelector = 'iframe[data-adsterra-native-sandbox="481d6501bcd0c27b98bc3c4776a26f6e"]';
    const native = page.locator(nativeSelector);
    await expect(native).toHaveAttribute("sandbox", ADSTERRA_BANNER_SANDBOX);
    await native.scrollIntoViewIfNeeded();
    const nativeFrame = page.frameLocator(nativeSelector);
    await expect(nativeFrame.locator("body")).toHaveAttribute("data-parent-access", "blocked");
    await expect(nativeFrame.locator("body")).toHaveAttribute("data-top-navigation", "blocked");
    await expect(nativeFrame.locator("body")).toHaveAttribute("data-popup", "blocked");
    await expect(native).toHaveAttribute("height", "260");
    const nativePopup = context.waitForEvent("page", {timeout: 15_000});
    await nativeFrame.getByRole("link", {name: "Sandbox test creative"}).click();
    const nativeLanding = await nativePopup;
    await expect(nativeLanding).toHaveURL("https://example.com/ad-click-test");
    await nativeLanding.getByRole("button", {name: "Submit", exact: true}).click();
    await expect(nativeLanding.getByRole("heading")).toHaveText("Submitted");
    await nativeLanding.close();

    const deferredPopup = context.waitForEvent("page", {timeout: 15_000});
    await nativeFrame.getByRole("link", {name: "deferred-web", exact: true}).click();
    const deferredLanding = await deferredPopup;
    await expect(deferredLanding).toHaveURL("https://example.com/native-tracked-click");
    await deferredLanding.close();
    await nativeFrame.getByRole("link", {name: "deferred-sms", exact: true}).click();
    await expect(nativeFrame.locator("body")).toHaveAttribute("data-last-deferred", "deferred-sms");
    await nativeFrame.getByRole("link", {name: "deferred-empty", exact: true}).click();
    await expect(nativeFrame.locator("body")).toHaveAttribute("data-last-deferred", "deferred-empty");
    expect(context.pages()).toHaveLength(1);

    const scriptPopup = context.waitForEvent("page", {timeout: 15_000});
    await nativeFrame.getByRole("button", {name: "Script click", exact: true}).click();
    const scriptLanding = await scriptPopup;
    await expect(scriptLanding).toHaveURL("https://example.com/script-click-test");
    await scriptLanding.close();
    await nativeFrame.getByRole("link", {name: "SMS test", exact: true}).click();
    await nativeFrame.getByRole("button", {name: "SMS script test", exact: true}).click();
    await expect(nativeFrame.locator("body")).toHaveAttribute("data-sms-open", "blocked");
    expect(context.pages()).toHaveLength(1);
    await expect(page).toHaveURL(/\/en\/guides\/wardogs-artillery-guide$/);

    if (viewport.width === 390) {
      const mobile = page.locator('[data-ad-placement="mobile-sticky-creative"] iframe');
      await expect(mobile).toBeVisible();
      await expect(mobile).toHaveAttribute("sandbox", ADSTERRA_BANNER_SANDBOX);
      await page.getByRole("button", {name: "Close advertisement", exact: true}).click();
      await expect(page.locator('[data-ad-placement="mobile-sticky"]')).toHaveCount(0);
    } else {
      await expect(page.locator('[data-ad-placement="left-rail-creative"] iframe')).toBeVisible();
      await expect(page.locator('[data-ad-placement="right-rail-creative"] iframe')).toBeVisible();
    }
  });
}
