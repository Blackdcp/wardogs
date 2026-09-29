import {defineConfig} from "@playwright/test";
import {existsSync} from "node:fs";
import {fileURLToPath} from "node:url";

const chrome = process.env.PLAYWRIGHT_EXECUTABLE_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = process.env.MAP_TEST_PORT ?? "3107";
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "./e2e",
  testMatch: /(?:interactive-map|map-visual-interactions|map-calibration)\.spec\.ts/,
  outputDir: "./map-artifacts/results",
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: "list",
  use: {baseURL, viewport: {width: 1440, height: 1000}, launchOptions: existsSync(chrome) ? {executablePath: chrome} : undefined},
  webServer: process.env.MAP_TEST_EXTERNAL_SERVER === "1" ? undefined : {
    command: `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port ${port}`,
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    url: `${baseURL}/en/tools/map`, reuseExistingServer: true, timeout: 120_000,
  },
});
