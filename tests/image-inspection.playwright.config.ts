import {defineConfig} from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "catalogue-image-inspection.spec.ts",
  outputDir: "../test-results/image-inspection",
  workers: 1,
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL: process.env.TOOLS_BASE_URL ?? "http://127.0.0.1:3108",
    launchOptions: {executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe"},
    trace: "retain-on-failure"
  }
});
