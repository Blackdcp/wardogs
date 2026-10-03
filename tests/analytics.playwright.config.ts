import {defineConfig} from "@playwright/test";

const baseURL = process.env.ANALYTICS_BASE_URL ?? "http://127.0.0.1:3127";

// Reuse the integration server; do not start or stop shared Next.js processes.
export default defineConfig({
  testDir: "./e2e",
  testMatch: "analytics.spec.ts",
  outputDir: "../test-results/analytics",
  workers: 1,
  retries: 0,
  timeout: 90_000,
  reporter: "list",
  use: {
    baseURL,
    serviceWorkers: "block",
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? {executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH}
      : undefined,
    trace: "retain-on-failure"
  }
});
