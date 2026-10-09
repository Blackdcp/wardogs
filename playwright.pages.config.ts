import {defineConfig, devices} from "@playwright/test";
import {execFileSync} from "node:child_process";

process.env.WARDOGSWIKI_RELEASE_SHA ||= process.env.GITHUB_SHA || execFileSync("git", ["rev-parse", "HEAD"], {encoding: "utf8"}).trim();

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default defineConfig({
  testDir: "./tests/pages-e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3001",
    trace: "on-first-retry",
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? {executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH}
      : undefined,
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "node scripts/serve-pages.mjs",
    url: `http://127.0.0.1:3001${basePath}/`,
    reuseExistingServer: false,
    timeout: 30_000
  }
});
