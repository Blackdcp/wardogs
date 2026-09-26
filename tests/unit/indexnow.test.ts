import {existsSync, readFileSync} from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {describe, expect, it, vi} from "vitest";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "submit-indexnow.mjs");
const productionScriptPath = path.join(root, "scripts", "deploy-production.mjs");
const workflowPath = path.join(root, ".github", "workflows", "deploy-pages.yml");

describe("IndexNow deployment notification", () => {
  it("ships a public ownership key and a tested URL selection helper", async () => {
    expect(existsSync(scriptPath)).toBe(true);
    if (!existsSync(scriptPath)) return;

    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      INDEXNOW_KEY: string;
      MAX_URLS_PER_RUN: number;
      deriveIndexNowUrls: (changedFiles: string[], sitemapUrls: string[]) => string[];
    };
    const keyPath = path.join(root, "public", `${indexNow.INDEXNOW_KEY}.txt`);

    expect(readFileSync(keyPath, "utf8").trim()).toBe(indexNow.INDEXNOW_KEY);
    expect(indexNow.deriveIndexNowUrls(
      ["content/en/guides/wardogs-money-guide.mdx"],
      [
        "https://www.wardogswiki.com/en",
        "https://www.wardogswiki.com/en/guides",
        "https://www.wardogswiki.com/en/guides/wardogs-money-guide",
        "https://www.wardogswiki.com/de/guides/wardogs-money-guide"
      ]
    )).toEqual([
      "https://www.wardogswiki.com/en",
      "https://www.wardogswiki.com/en/guides",
      "https://www.wardogswiki.com/en/guides/wardogs-money-guide"
    ]);
  });

  it("skips notification when a deployment has no reliable changed-file diff", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      deriveIndexNowUrls: (changedFiles: string[], sitemapUrls: string[]) => string[];
    };

    expect(indexNow.deriveIndexNowUrls([], [
      "https://www.wardogswiki.com/en",
      "https://www.wardogswiki.com/en/guides"
    ])).toEqual([]);
  });

  it("does not turn generic source changes into whole-site submissions", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      deriveIndexNowUrls: (changedFiles: string[], sitemapUrls: string[]) => string[];
    };

    expect(indexNow.deriveIndexNowUrls(
      ["src/components/layout/header.tsx"],
      ["https://www.wardogswiki.com/en", "https://www.wardogswiki.com/en/guides"]
    )).toEqual([]);
  });

  it("selects every affected catalogue route beyond the first 200 without duplicates", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      deriveIndexNowUrls: (changedFiles: string[], sitemapUrls: string[]) => string[];
    };
    const weaponUrls = Array.from({length: 220}, (_, index) =>
      `https://www.wardogswiki.com/en/items/weapons/weapon-${index}`
    );
    const sitemapUrls = [
      "https://www.wardogswiki.com/en",
      "https://www.wardogswiki.com/en/items",
      "https://www.wardogswiki.com/en/items/weapons",
      ...weaponUrls,
      weaponUrls[0],
      "https://www.wardogswiki.com/en/guides"
    ];

    const selected = indexNow.deriveIndexNowUrls(["src/features/items/weapon-items.ts"], sitemapUrls);

    expect(selected).toHaveLength(222);
    expect(new Set(selected).size).toBe(selected.length);
    expect(selected).toContain("https://www.wardogswiki.com/en/items");
    expect(selected).toContain("https://www.wardogswiki.com/en/items/weapons");
    expect(selected.at(-1)).toBe(weaponUrls[219]);
    expect(selected.some((url) => url.endsWith("/guides"))).toBe(false);
  });

  it("notifies all locale news pages when the shared timeline changes", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      deriveIndexNowUrls: (changedFiles: string[], sitemapUrls: string[]) => string[];
    };
    expect(indexNow.deriveIndexNowUrls(
      ["src/features/news/news-data.ts"],
      ["https://www.wardogswiki.com/en/news", "https://www.wardogswiki.com/ja/news", "https://www.wardogswiki.com/en/guides"]
    )).toEqual(["https://www.wardogswiki.com/en/news", "https://www.wardogswiki.com/ja/news"]);
  });

  it("notifies historical guide pages changed by related-link code in every locale", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      deriveIndexNowUrls: (changedFiles: string[], sitemapUrls: string[]) => string[];
    };
    const sitemapUrls = [
      "https://www.wardogswiki.com/en/guides/wardogs-beta",
      "https://www.wardogswiki.com/ja/guides/wardogs-beta",
      "https://www.wardogswiki.com/zh-cn/guides/wardogs-playtest",
      "https://www.wardogswiki.com/en/guides/wardogs-season-2"
    ];

    expect(indexNow.deriveIndexNowUrls(["src/features/guides/related.ts"], sitemapUrls))
      .toEqual(sitemapUrls.slice(0, 3));
  });

  it("submits one throttled GET request per changed URL instead of batch JSON", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      INDEXNOW_KEY: string;
      submitIndexNowUrls: (
        urls: string[],
        options: {fetchImpl: typeof fetch; keyLocation: string; pause: () => Promise<void>}
      ) => Promise<{submitted: number}>;
    };
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response("", {status: 200}));
    const pause = vi.fn(async () => undefined);
    const urls = [
      "https://www.wardogswiki.com/en/guides/wardogs-money-guide",
      "https://www.wardogswiki.com/en/items/weapons"
    ];

    const result = await indexNow.submitIndexNowUrls(urls, {
      fetchImpl: fetchImpl as typeof fetch,
      keyLocation: `https://www.wardogswiki.com/${indexNow.INDEXNOW_KEY}.txt`,
      pause
    });

    expect(result).toEqual({submitted: 2});
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(pause).toHaveBeenCalledTimes(1);
    for (const [requestUrl, init] of fetchImpl.mock.calls) {
      const parsed = new URL(String(requestUrl));
      expect(parsed.origin + parsed.pathname).toBe("https://api.indexnow.org/indexnow");
      expect(parsed.searchParams.get("key")).toBe(indexNow.INDEXNOW_KEY);
      expect(parsed.searchParams.get("url")).toMatch(/^https:\/\/www\.wardogswiki\.com\//);
      expect(init).toBeUndefined();
    }
  });

  it("submits every selected URL across 200 URL pages with pacing between pages", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      submitIndexNowUrls: (
        urls: string[],
        options: {fetchImpl: typeof fetch; pause: () => Promise<void>}
      ) => Promise<{submitted: number}>;
    };
    const urls = Array.from({length: 205}, (_, index) =>
      `https://www.wardogswiki.com/en/items/weapons/weapon-${index}`
    );
    let requestCount = 0;
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      new Response("", {status: requestCount++ % 2 === 0 ? 200 : 202})
    );
    const pause = vi.fn(async () => undefined);

    const result = await indexNow.submitIndexNowUrls([...urls, urls[0]], {fetchImpl, pause});

    expect(result).toEqual({submitted: 205});
    expect(fetchImpl.mock.calls.map(([requestUrl]) =>
      new URL(String(requestUrl)).searchParams.get("url")
    )).toEqual(urls);
    expect(pause).toHaveBeenCalledTimes(204);
  });

  it("rejects a failed IndexNow response after the first page", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      submitIndexNowUrls: (
        urls: string[],
        options: {fetchImpl: typeof fetch; pause: () => Promise<void>}
      ) => Promise<{submitted: number}>;
    };
    const urls = Array.from({length: 201}, (_, index) =>
      `https://www.wardogswiki.com/en/items/weapons/weapon-${index}`
    );
    const fetchImpl = vi.fn<typeof fetch>(async (requestUrl) =>
      new Response("rate limited", {
        status: new URL(String(requestUrl)).searchParams.get("url") === urls[200] ? 429 : 200
      })
    );

    await expect(indexNow.submitIndexNowUrls(urls, {
      fetchImpl,
      pause: async () => undefined
    })).rejects.toThrow(`IndexNow returned 429 for ${urls[200]}: rate limited`);
    expect(fetchImpl).toHaveBeenCalledTimes(201);
  });

  it("fails explicitly before requests when the run exceeds its safety ceiling", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      submitIndexNowUrls: (
        urls: string[],
        options: {fetchImpl: typeof fetch; pause: () => Promise<void>}
      ) => Promise<{submitted: number}>;
    };
    const urls = Array.from({length: 10_001}, (_, index) =>
      `https://www.wardogswiki.com/en/items/weapons/weapon-${index}`
    );
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response("", {status: 200}));

    await expect(indexNow.submitIndexNowUrls(urls, {
      fetchImpl,
      pause: async () => undefined
    })).rejects.toThrow(/10,001.*10,000/);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("runs the notifier only after the deployment job succeeds", () => {
    const workflow = readFileSync(workflowPath, "utf8");
    expect(workflow).toContain("notify-indexnow:");
    expect(workflow).toContain("needs: deploy");
    expect(workflow).toContain("node scripts/submit-indexnow.mjs");
  });

  it("refuses a direct production deploy without a known diff or with uncommitted content", async () => {
    const deployment = await import(pathToFileURL(productionScriptPath).href) as {
      validateDeploymentDiff: (base: string | undefined, head: string, status: string) => void;
    };
    expect(() => deployment.validateDeploymentDiff(undefined, "new", "")).toThrow(/INDEXNOW_BASE_SHA/);
    expect(() => deployment.validateDeploymentDiff("old", "new", " M messages\/en.json")).toThrow(/Commit/);
    expect(() => deployment.validateDeploymentDiff("same", "same", "")).toThrow(/No committed changes/);
    expect(() => deployment.validateDeploymentDiff("old", "new", "")).not.toThrow();
  });
});
