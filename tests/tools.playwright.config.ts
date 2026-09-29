import {existsSync} from "node:fs";
import {defineConfig} from "@playwright/test";

const chrome = process.env.PLAYWRIGHT_EXECUTABLE_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

// Reuse the single shared dev server. This config never starts another server.
export default defineConfig({
  testDir: "./e2e",
  testMatch: /(task5-tools|task6-tools|tools-workflow|growth-homepage|pilot-locales)\.spec\.ts/,
  outputDir: "../test-results/tools",
  workers: 1,
  retries: 0,
  timeout: 90_000,
  reporter: "list",
  use: {
    baseURL: process.env.TOOLS_BASE_URL ?? "http://127.0.0.1:3108",
    viewport: {width: 1440, height: 1000},
    launchOptions: existsSync(chrome) ? {executablePath: chrome} : {},
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
