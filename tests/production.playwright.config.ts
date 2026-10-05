import {defineConfig} from "@playwright/test";

process.env.NEXT_PUBLIC_SITE_URL ??= "https://www.wardogswiki.com";

export default defineConfig({
  testDir: "./e2e",
  testMatch: [
    "production-health.spec.ts",
    "release-route-contract.spec.ts",
    "homepage-structure.spec.ts",
    "adsterra-inventory.spec.ts",
    "guide-depth.spec.ts",
    "tools-workflow.spec.ts",
    "interactive-map.spec.ts"
  ],
  workers: 1,
  retries: 0,
  timeout: 120_000,
  expect: {timeout: 20_000},
  reporter: [["list"], ["json", {outputFile: "../.tmp/production-health-results.json"}]],
  outputDir: "../.tmp/production-health-artifacts",
  use: {
    baseURL: "https://www.wardogswiki.com",
    viewport: {width: 1440, height: 900},
    serviceWorkers: "block",
    navigationTimeout: 45_000,
    actionTimeout: 20_000,
    screenshot: "only-on-failure",
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? {executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH}
      : undefined
  }
});
