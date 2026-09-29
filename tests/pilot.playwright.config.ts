import {defineConfig, devices} from "@playwright/test";

// Reuse the shared server; the public canonical origin is configured separately.
export default defineConfig({
  testDir: "./e2e",
  testMatch: "pilot-locales.spec.ts",
  outputDir: "../test-results/pilot-locales",
  workers: 1,
  timeout: 120_000,
  reporter: "list",
  use: {
    baseURL: process.env.PILOT_BASE_URL ?? process.env.TOOLS_BASE_URL ?? "http://127.0.0.1:3108",
    launchOptions: {executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe"},
    trace: "retain-on-failure"
  },
  projects: [
    {name: "desktop", use: {...devices["Desktop Chrome"], viewport: {width: 1440, height: 1000}}},
    {name: "mobile", use: {...devices["iPhone 13"], defaultBrowserType: "chromium"}}
  ]
});
