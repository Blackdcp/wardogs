import {spawnSync} from "node:child_process";
import {existsSync} from "node:fs";

const npmCliPath = process.env.npm_execpath;
if (!npmCliPath) throw new Error("npm_execpath is required to run the Pages smoke suite");

const installedChrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const env = {
  ...process.env,
  GITHUB_PAGES: process.env.GITHUB_PAGES ?? "true",
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "/wardogs",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blackdcp.github.io",
  ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? {}
    : existsSync(installedChrome) ? {PLAYWRIGHT_EXECUTABLE_PATH: installedChrome} : {})
};

for (const script of ["build:pages", "test:pages:built"]) {
  const result = spawnSync(process.execPath, [npmCliPath, "run", script], {
    cwd: process.cwd(),
    env,
    stdio: "inherit"
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
