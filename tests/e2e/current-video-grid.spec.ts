import {expect, test} from "@playwright/test";

test("filters current creator guidance by task and restores the newest-first watchlist", async ({page}) => {
  await page.goto("/en/videos");

  const grid = page.locator("[data-current-video-source]");
  await expect(grid).toHaveCount(25);
  await expect(page.getByText("Reviewed creator guidance. Check current-client details and official notes before acting on version-sensitive claims.")).toBeVisible();
  await expect(grid.evaluateAll((cards) => cards.slice(0, 6).map((card) => card.getAttribute("data-current-video-source")))).resolves.toEqual([
    "-o6VKUgLq88", "cKFK1F0ZP6I", "3T64Rn9fWsI", "fUKgHeT0JGY", "Tkors4Fenh0", "XUyP1GLUF5o"
  ]);

  await page.getByRole("button", {name: "Controls", exact: true}).click();
  await expect(grid).toHaveCount(1);
  await expect(grid).toHaveAttribute("data-current-video-source", "cKFK1F0ZP6I");

  await page.getByRole("button", {name: "Teamplay", exact: true}).click();
  await expect(grid).toHaveCount(1);
  await expect(grid).toHaveAttribute("data-current-video-source", "eR3U1uR6Wn8");

  await page.getByRole("button", {name: "All player tasks", exact: true}).click();
  await expect(grid).toHaveCount(25);
});
