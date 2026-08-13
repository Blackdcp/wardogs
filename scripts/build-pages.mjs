import {existsSync, readdirSync, renameSync, rmdirSync, writeFileSync} from "node:fs";
import {join, relative, resolve, sep} from "node:path";
import {spawnSync} from "node:child_process";

const proxyPath = resolve("src/proxy.ts");
const disabledProxyPath = resolve("src/proxy.ts.pages-disabled");
const npmCliPath = process.env.npm_execpath;

function collectFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

function removeEmptyDirectories(directory) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    if (entry.isDirectory()) removeEmptyDirectories(join(directory, entry.name));
  }
  rmdirSync(directory);
}

function normalizeWindowsSegmentExports(directory) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;

    const child = join(directory, entry.name);
    if (!entry.name.startsWith("__next.")) {
      normalizeWindowsSegmentExports(child);
      continue;
    }

    for (const source of collectFiles(child)) {
      const destination = join(directory, relative(directory, source).split(sep).join("."));
      if (existsSync(destination)) {
        throw new Error(`Cannot normalize duplicate segment export: ${destination}`);
      }
      renameSync(source, destination);
    }
    removeEmptyDirectories(child);
  }
}

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
      NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wardogswiki.com"
    },
    stdio: "inherit"
  });

  status = result.status ?? 1;
  if (result.error) throw result.error;
} finally {
  renameSync(disabledProxyPath, proxyPath);
}

if (status === 0) {
  normalizeWindowsSegmentExports(resolve("out"));
  const entryHtml = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta http-equiv=\"refresh\" content=\"0;url=./en/\"><title>WARDOGS Wiki</title><script>location.replace('./en/')</script></head><body><a href=\"./en/\">Open WARDOGS Wiki</a></body></html>";
  writeFileSync(resolve("out/index.html"), entryHtml);
  writeFileSync(resolve("out/CNAME"), "www.wardogswiki.com\n");
  writeFileSync(resolve("out/.nojekyll"), "");
}

process.exit(status);
