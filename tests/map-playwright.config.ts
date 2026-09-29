import {defineConfig} from "@playwright/test";
import {existsSync} from "node:fs";
import {fileURLToPath} from "node:url";

const chrome = process.env.PLAYWRIGHT_EXECUTABLE_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
export default defineConfig({
  testDir: "./e2e",
  testMatch: /(?:interactive-map|map-visual-interactions)\.spec\.ts/,
  outputDir: "./map-artifacts/results",
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: "list",
  use: {baseURL: "http://127.0.0.1:3107", viewport: {width: 1440, height: 1000}, launchOptions: existsSync(chrome) ? {executablePath: chrome} : undefined},
  webServer: process.env.MAP_TEST_EXTERNAL_SERVER === "1" ? undefined : {
    command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3107",
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    url: "http://127.0.0.1:3107/en/tools/map", reuseExistingServer: true, timeout: 120_000,
  },
});
