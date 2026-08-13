import {defineConfig, devices} from "@playwright/test";

export default defineConfig({
  testDir: "./tests/pages-e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3001",
    trace: "on-first-retry",
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "node scripts/serve-pages.mjs",
    url: "http://127.0.0.1:3001/",
    reuseExistingServer: false,
    timeout: 30_000
  }
});
