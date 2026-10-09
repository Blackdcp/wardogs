import {defineConfig} from "@playwright/test";

// Isolated synthetic pages load the public Google tag. All collector traffic is
// intercepted inside the spec: these checks never submit hits to the property.
export default defineConfig({
  testDir: "./e2e",
  testMatch: "analytics-initialization.spec.ts",
  timeout: 60_000,
  expect: {timeout: 15_000},
  workers: 1,
  retries: 0,
  reporter: [["list"], ["json", {outputFile: "../.tmp/analytics-initialization-results.json"}]],
  outputDir: "../.tmp/analytics-initialization-artifacts",
  use: {
    headless: true,
    viewport: {width: 1280, height: 900},
    serviceWorkers: "block",
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? {executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH}
      : undefined
  }
});
