import {readFile, readdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import matter from "gray-matter";

const competitorHosts = new Set([
  "wardogshub.gg",
  "www.wardogshub.gg",
  "gamblewithyourfriends.net",
  "www.gamblewithyourfriends.net"
]);
const botProtectedHosts = new Set(["reddit.com", "www.reddit.com"]);

const requestHeaders = {"user-agent": "WARDOGS-Wiki-Link-Checker/1.0"};
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function filesUnder(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(target));
    else files.push(target);
  }
  return files;
}

function validatePublicUrl(value) {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:") throw new Error(`Public URL must use HTTPS: ${value}`);
  if (competitorHosts.has(parsed.hostname)) throw new Error(`Competitor URL is forbidden: ${value}`);
  return parsed.toString();
}

export async function collectPublicUrls(root = process.cwd()) {
  const official = JSON.parse(await readFile(path.join(root, "config", "official-links.json"), "utf8"));
  const urls = Object.values(official);
  const contentRoot = path.join(root, "content");
  for (const file of (await filesUnder(contentRoot)).filter((name) => name.endsWith(".mdx"))) {
    const parsed = matter(await readFile(file, "utf8"));
    for (const source of parsed.data.sources ?? []) urls.push(source.url);
  }
  return [...new Set(urls.map(validatePublicUrl))].sort();
}

async function requestWithRetry(url, method, fetchImpl, timeout) {
  let response;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetchImpl(url, {
      method,
      redirect: "follow",
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout)
    });
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt < 2) await wait(attempt === 0 ? 500 : 1_000);
  }
  return response;
}

export async function checkUrl(url, fetchImpl = fetch) {
  validatePublicUrl(url);
  const head = await requestWithRetry(url, "HEAD", fetchImpl, 15_000);
  if (head.ok || (head.status >= 300 && head.status < 400)) {
    return {url, status: head.status, method: "HEAD"};
  }
  const get = await requestWithRetry(url, "GET", fetchImpl, 20_000);
  if (get.status === 403 && botProtectedHosts.has(new URL(url).hostname)) {
    return {url, status: get.status, method: "GET"};
  }
  if (!get.ok && !(get.status >= 300 && get.status < 400)) throw new Error(`${url} returned ${get.status}`);
  return {url, status: get.status, method: "GET"};
}

async function main() {
  const urls = await collectPublicUrls();
  const failures = [];
  for (const url of urls) {
    try {
      const result = await checkUrl(url);
      process.stdout.write(`OK ${result.status} ${result.method} ${url}\n`);
    } catch (error) {
      failures.push(`${url}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (failures.length) {
    process.stderr.write(`Broken public links:\n${failures.map((failure) => `- ${failure}`).join("\n")}\n`);
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (fileURLToPath(import.meta.url) === invokedPath) await main();
