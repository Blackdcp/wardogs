import {existsSync, renameSync} from "node:fs";
import {resolve} from "node:path";
import {spawnSync} from "node:child_process";

const proxyPath = resolve("src/proxy.ts");
const disabledProxyPath = resolve("src/proxy.ts.pages-disabled");
const npmCliPath = process.env.npm_execpath;

if (!npmCliPath) {
  throw new Error("npm_execpath is required to run the Pages build");
}

if (!existsSync(proxyPath)) {
  throw new Error(`Expected proxy file at ${proxyPath}`);
}
if (existsSync(disabledProxyPath)) {
  throw new Error(`Temporary proxy file already exists at ${disabledProxyPath}`);
}

renameSync(proxyPath, disabledProxyPath);

let status = 1;
try {
  const result = spawnSync(process.execPath, [npmCliPath, "run", "build"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
      NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "/wardogs",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blackdcp.github.io/wardogs"
    },
    stdio: "inherit"
  });

  status = result.status ?? 1;
  if (result.error) throw result.error;
} finally {
  renameSync(disabledProxyPath, proxyPath);
}

process.exit(status);
