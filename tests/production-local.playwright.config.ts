import {defineConfig, devices} from "@playwright/test";
import {fileURLToPath} from "node:url";

process.env.NEXT_PUBLIC_SITE_URL ??= "https://www.wardogswiki.com";

export default defineConfig({
  testDir: "./e2e",
  grepInvert: /@live/,
  testMatch: [
    "release-route-contract.spec.ts",
    "homepage-structure.spec.ts",
    "adsterra-inventory.spec.ts",
    "adsterra-delivery.spec.ts",
    "adsterra-task-layout.spec.ts",
    "mobile-ad-experience.spec.ts",
    "clarity-consent.spec.ts",
    "production-health.spec.ts",
    "site-search.spec.ts",
    "oct9-community-content.spec.ts"
  ],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  expect: {timeout: 20_000},
  reporter: [["list"], ["json", {outputFile: "../.tmp/production-build-results.json"}]],
  outputDir: "../.tmp/production-build-artifacts",
  use: {
    baseURL: "http://127.0.0.1:3100",
    serviceWorkers: "block",
    navigationTimeout: 45_000,
    actionTimeout: 20_000,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? {executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH}
      : undefined,
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100",
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    url: "http://127.0.0.1:3100/en",
    reuseExistingServer: false,
    timeout: 120_000
  }
});
