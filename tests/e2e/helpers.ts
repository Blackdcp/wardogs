import {expect, type Page} from "@playwright/test";

export async function expectCopiedToolState(page: Page, tool: string) {
  const current = new URL(page.url());
  const shared = new URL(await page.evaluate(() => navigator.clipboard.readText()));
  expect(shared.origin).toBe(current.origin);
  expect(shared.pathname).toBe(current.pathname);
  expect(shared.hash).toBe(current.hash);
  expect(shared.searchParams.getAll("wd_share")).toEqual([tool]);

  // Copying creates a fresh share record; the address bar retains the last edit.
  const timestamps = shared.searchParams.getAll("createdAt");
  expect(timestamps).toHaveLength(1);
  expect(Number.isFinite(Date.parse(timestamps[0]))).toBe(true);
  expect(new Date(timestamps[0]).toISOString()).toBe(timestamps[0]);
  expect(Date.parse(timestamps[0])).toBeGreaterThanOrEqual(Date.parse(current.searchParams.get("createdAt")!));

  for (const url of [current, shared]) {
    url.searchParams.delete("createdAt");
    url.searchParams.delete("wd_share");
    url.searchParams.sort();
  }
  // Keep all actual selections, schema and data-version checks exact.
  expect(shared.search).toBe(current.search);
}

export async function installDeterministicExternalMediaFallback(page: Page) {
  await page.route("https://i.ytimg.com/**", (route) => route.abort("failed"));
}

export async function installDeterministicMobileAdCreative(page: Page) {
  if ((page.viewportSize()?.width ?? Number.POSITIVE_INFINITY) >= 468) return;
  const sticky = page.locator('[data-ad-placement="mobile-sticky"]');
  await expect(sticky).toBeVisible();
  const unit = sticky.locator("[data-adsterra-unit]");
  await expect(unit).toBeVisible();
  const [stickyBox, unitBox] = await Promise.all([sticky.boundingBox(), unit.boundingBox()]);
  await unit.evaluate((container) => {
    if (container.querySelector("[data-visual-ad-creative]")) return;
    const creative = document.createElement("div");
    creative.dataset.visualAdCreative = "true";
    creative.textContent = "ADVERTISEMENT";
    Object.assign(creative.style, {
      alignItems: "center",
      background: "#111512",
      border: "1px solid #46534d",
      color: "#82938a",
      display: "flex",
      fontFamily: "sans-serif",
      fontSize: "10px",
      height: container.style.minHeight,
      justifyContent: "center",
      width: "100%"
    });
    container.append(creative);
  });
  await expect(unit.locator("[data-visual-ad-creative]")).toHaveText("ADVERTISEMENT");
  expect(await sticky.boundingBox()).toEqual(stickyBox);
  expect(await unit.boundingBox()).toEqual(unitBox);
}

export async function expectImagesLoaded(page: Page) {
  const images = page.locator("img:visible");
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    const src = await image.getAttribute("src");
    await expect.poll(
      () => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0),
      {message: `Image did not load: ${src ?? "missing src"}`}
    ).toBe(true);
  }
}

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    if (scrollWidth <= width + 1) return {width, scrollWidth, offenders: []};
    return {
      width,
      scrollWidth,
      offenders: Array.from(document.querySelectorAll<HTMLElement>("body *"))
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          id: element.id,
          classes: element.className,
          left: Math.round(element.getBoundingClientRect().left),
          right: Math.round(element.getBoundingClientRect().right),
          scrollWidth: element.scrollWidth
        }))
        .filter(({left, right}) => left < -1 || right > width + 1)
        .slice(0, 10)
    };
  });
  expect(dimensions.scrollWidth, `${page.url()} overflowed: ${JSON.stringify(dimensions.offenders)}`)
    .toBeLessThanOrEqual(dimensions.width + 1);
}
