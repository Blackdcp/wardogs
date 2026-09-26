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

  it("selects only URLs newly absent from the pre-deploy sitemap", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      deriveNewlyAbsentUrls: (before: string[], after: string[]) => string[];
    };
    const before = [
      "https://www.wardogswiki.com/en",
      "https://www.wardogswiki.com/en/guides/removed",
      "https://www.wardogswiki.com/en/guides/removed",
      "https://www.wardogswiki.com/en/guides/still-live"
    ];
    const after = [
      "https://www.wardogswiki.com/en",
      "https://www.wardogswiki.com/en/guides/still-live",
      "https://www.wardogswiki.com/en/guides/added"
    ];

    expect(indexNow.deriveNewlyAbsentUrls(before, after)).toEqual([
      "https://www.wardogswiki.com/en/guides/removed"
    ]);
  });

  it("captures a nonempty live sitemap before deployment", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      fetchLiveSitemapUrls: (fetchImpl: typeof fetch) => Promise<string[]>;
    };
    const sitemap = `<urlset><url><loc>https://www.wardogswiki.com/en</loc></url></urlset>`;
    const fetchImpl = vi.fn<typeof fetch>(async () => new Response(sitemap, {status: 200}));

    await expect(indexNow.fetchLiveSitemapUrls(fetchImpl)).resolves.toEqual([
      "https://www.wardogswiki.com/en"
    ]);
    expect(String(fetchImpl.mock.calls[0][0])).toMatch(/^https:\/\/www\.wardogswiki\.com\/sitemap\.xml\?indexnow=/);
    expect(fetchImpl.mock.calls[0][1]).toMatchObject({redirect: "manual", cache: "no-store"});

    await expect(indexNow.fetchLiveSitemapUrls(async () => new Response("<urlset />", {status: 200})))
      .rejects.toThrow(/empty sitemap/i);

    await expect(indexNow.fetchLiveSitemapUrls(async () => new Response(
      "<urlset><url><loc>https://example.com/foreign</loc></url></urlset>",
      {status: 200}
    ))).rejects.toThrow(/outside the site origin/i);
  });

  it("accepts newly absent URLs only when live responses are actual 404, 410, or redirects", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      verifyAbsentUrlsLive: (urls: string[], fetchImpl: typeof fetch) => Promise<void>;
    };
    const urls = [
      "https://www.wardogswiki.com/en/guides/deleted",
      "https://www.wardogswiki.com/en/guides/gone",
      "https://www.wardogswiki.com/en/guides/moved"
    ];
    const replacement = "https://www.wardogswiki.com/en/guides/replacement";
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      if (url === urls[0]) return new Response("missing", {status: 404});
      if (url === urls[1]) return new Response("gone", {status: 410});
      if (url === urls[2]) return new Response(null, {status: 308, headers: {location: "/en/guides/replacement"}});
      if (url === replacement) return new Response("replacement", {status: 200});
      throw new Error(`Unexpected live URL: ${url}`);
    });

    await expect(indexNow.verifyAbsentUrlsLive(urls, fetchImpl)).resolves.toBeUndefined();
    expect(fetchImpl.mock.calls.map(([input]) => String(input))).toEqual([...urls, replacement]);
    expect(fetchImpl.mock.calls.every(([, init]) => init?.redirect === "manual" && init?.cache === "no-store"))
      .toBe(true);
  });

  it.each([
    ["soft 404", new Response("not found", {status: 200})],
    ["redirect without Location", new Response(null, {status: 302})],
    ["self redirect", new Response(null, {status: 308, headers: {location: "/en/guides/removed"}})]
  ])("blocks notification for a %s", async (_label, response) => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      verifyAbsentUrlsLive: (urls: string[], fetchImpl: typeof fetch) => Promise<void>;
    };
    const removed = "https://www.wardogswiki.com/en/guides/removed";

    await expect(indexNow.verifyAbsentUrlsLive([removed], async () => response))
      .rejects.toThrow(/newly absent URL.*not a 404, 410, or valid redirect/i);
  });

  it.each([
    ["offsite redirect", () => new Response(null, {status: 302, headers: {location: "https://elsewhere.example/new"}}), /same.origin/i],
    ["redirect loop", () => new Response(null, {status: 302, headers: {location: "https://www.wardogswiki.com/en/guides/removed"}}), /loop/i],
    ["redirect to a 404", () => new Response(null, {status: 404}), /final.*200/i]
  ])("rejects a %s for a newly absent URL", async (label, finalResponse, message) => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      verifyAbsentUrlsLive: (urls: string[], fetchImpl: typeof fetch) => Promise<void>;
    };
    const removed = "https://www.wardogswiki.com/en/guides/removed";
    const next = "https://www.wardogswiki.com/en/guides/next";
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      if (String(input) === removed) {
        return new Response(null, {status: 302, headers: {location: label === "offsite redirect" ? "https://elsewhere.example/new" : "/en/guides/next"}});
      }
      if (String(input) === next) return finalResponse();
      throw new Error(`Unexpected redirect target: ${String(input)}`);
    });

    await expect(indexNow.verifyAbsentUrlsLive([removed], fetchImpl)).rejects.toThrow(message);
  });

  it("rejects a redirect chain that exceeds five hops", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      verifyAbsentUrlsLive: (urls: string[], fetchImpl: typeof fetch) => Promise<void>;
    };
    const first = "https://www.wardogswiki.com/en/guides/removed";
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      const hop = url === first ? 0 : Number(new URL(url).pathname.split("/").at(-1));
      return new Response(null, {status: 302, headers: {location: `/en/guides/${hop + 1}`}});
    });

    await expect(indexNow.verifyAbsentUrlsLive([first], fetchImpl)).rejects.toThrow(/redirect.*hop/i);
    expect(fetchImpl.mock.calls).toHaveLength(6);
  });

  it("notifies a newly absent URL even when the changed-file list is empty", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      INDEXNOW_KEY: string;
      submitIndexNow: (options: {
        changedFiles: string[];
        previousSitemapUrls: string[];
        fetchImpl: typeof fetch;
        pause: () => Promise<void>;
      }) => Promise<{submitted: number}>;
    };
    const removed = "https://www.wardogswiki.com/en/guides/newly-removed";
    const requests: string[] = [];
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      requests.push(url);
      if (new URL(url).pathname === `/${indexNow.INDEXNOW_KEY}.txt`) {
        return new Response(indexNow.INDEXNOW_KEY, {status: 200});
      }
      if (new URL(url).pathname === "/sitemap.xml") {
        return new Response("<urlset><url><loc>https://www.wardogswiki.com/en</loc></url></urlset>", {status: 200});
      }
      if (url === removed) return new Response("gone", {status: 410});
      if (new URL(url).origin === "https://api.indexnow.org") return new Response("", {status: 200});
      throw new Error(`Unexpected fetch: ${url}`);
    });

    await expect(indexNow.submitIndexNow({
      changedFiles: [],
      previousSitemapUrls: ["https://www.wardogswiki.com/en", removed],
      fetchImpl,
      pause: async () => undefined
    })).resolves.toEqual({submitted: 1});

    const notification = requests.filter((url) => new URL(url).origin === "https://api.indexnow.org");
    expect(notification.map((url) => new URL(url).searchParams.get("url"))).toEqual([removed]);
    expect(requests.indexOf(removed)).toBeLessThan(requests.indexOf(notification[0]));
  });

  it.each(["0000000000000000", "indexnow-invalid-base-commit"])(
    "fails explicitly when the Git diff base %s is unreliable",
    async (base) => {
      const indexNow = await import(pathToFileURL(scriptPath).href) as {
        submitIndexNow: (options: {fetchImpl: typeof fetch}) => Promise<{submitted: number}>;
      };
      vi.stubEnv("BEFORE_SHA", base);
      vi.stubEnv("CURRENT_SHA", "HEAD");
      const fetchImpl = vi.fn<typeof fetch>(async () => {
        throw new Error("No network request should run without a reliable Git diff.");
      });
      try {
        await expect(indexNow.submitIndexNow({fetchImpl})).rejects.toThrow(/reliable changed-file diff/i);
        expect(fetchImpl).not.toHaveBeenCalled();
      } finally {
        vi.unstubAllEnvs();
      }
    }
  );

  it("sends no IndexNow request when a newly absent URL still returns 200", async () => {
    const indexNow = await import(pathToFileURL(scriptPath).href) as {
      INDEXNOW_KEY: string;
      submitIndexNow: (options: {
        changedFiles: string[];
        previousSitemapUrls: string[];
        fetchImpl: typeof fetch;
      }) => Promise<{submitted: number}>;
    };
    const removed = "https://www.wardogswiki.com/en/guides/newly-removed";
    const requests: string[] = [];
    const fetchImpl = vi.fn<typeof fetch>(async (input) => {
      const url = String(input);
      requests.push(url);
      if (new URL(url).pathname === `/${indexNow.INDEXNOW_KEY}.txt`) {
        return new Response(indexNow.INDEXNOW_KEY, {status: 200});
      }
      if (new URL(url).pathname === "/sitemap.xml") {
        return new Response("<urlset><url><loc>https://www.wardogswiki.com/en</loc></url></urlset>", {status: 200});
      }
      if (url === removed) return new Response("soft 404", {status: 200});
      throw new Error(`Unexpected fetch: ${url}`);
    });

    await expect(indexNow.submitIndexNow({
      changedFiles: ["src/components/layout/header.tsx"],
      previousSitemapUrls: ["https://www.wardogswiki.com/en", removed],
      fetchImpl
    })).rejects.toThrow(/newly absent URL.*returned 200/i);
    expect(requests.some((url) => new URL(url).origin === "https://api.indexnow.org")).toBe(false);
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
