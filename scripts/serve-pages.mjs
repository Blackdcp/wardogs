import {createServer} from "node:http";
import {readFile, stat} from "node:fs/promises";
import {extname, join, resolve, sep} from "node:path";

const outputRoot = resolve("out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const port = Number(process.env.PAGES_PREVIEW_PORT ?? 3001);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8"
};

function insideOutput(relativePath) {
  const candidate = resolve(outputRoot, relativePath);
  return candidate === outputRoot || candidate.startsWith(`${outputRoot}${sep}`) ? candidate : null;
}

async function findFile(pathname) {
  const relativePathname = basePath ? pathname.slice(basePath.length) : pathname;
  const relative = decodeURIComponent(relativePathname).replace(/^\/+/, "");
  const candidates = relative === ""
    ? ["index.html"]
    : pathname.endsWith("/")
      ? [join(relative, "index.html")]
      : extname(relative)
        ? [relative]
        : [relative, `${relative}.html`, join(relative, "index.html")];

  for (const candidate of candidates) {
    const absolute = insideOutput(candidate);
    if (!absolute) continue;
    try {
      if ((await stat(absolute)).isFile()) return absolute;
    } catch {
      continue;
    }
  }
  return null;
}

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    if (basePath && pathname === basePath) {
      response.writeHead(308, {location: `${basePath}/`});
      response.end();
      return;
    }
    if (basePath && !pathname.startsWith(`${basePath}/`)) {
      response.writeHead(404).end("Not found");
      return;
    }

    const file = await findFile(pathname);
    if (!file) {
      const fallback = insideOutput("404.html");
      response.writeHead(404, {"content-type": "text/html; charset=utf-8"});
      response.end(fallback ? await readFile(fallback) : "Not found");
      return;
    }

    const contentType = contentTypes[extname(file).toLowerCase()] ?? "application/octet-stream";
    const body = await readFile(file);
    response.writeHead(200, {"content-type": contentType, "content-length": body.length, "cache-control": "no-store"});
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(400).end("Bad request");
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Pages preview: http://127.0.0.1:${port}${basePath}/\n`);
});
