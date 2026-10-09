import {expect, test} from "@playwright/test";
import {writeFileSync} from "node:fs";
import {googleAnalyticsConfigScript, GOOGLE_TAG_ID} from "../../src/features/analytics/google-analytics-bootstrap";

// Verified in GA Admin on 2026-10-09: Wardogs Wiki property 549772110,
// website stream 15428610536. A connected tag ID can differ from its destination.
const expectedDestination = process.env.ANALYTICS_EXPECTED_DESTINATION ?? "G-7B37NSM6WZ";

for (const scenario of [
  {name: "campaign array queue", query: "utm_source=discord&utm_medium=community&utm_campaign=tag-initialization&", argumentQueue: false},
  {name: "organic arguments queue", query: "", argumentQueue: true}
]) {
  test(`queued analytics events retain identity and attribution: ${scenario.name} @live`, async ({browser}, info) => {
    const context = await browser.newContext({serviceWorkers: "block"});
    const hits: Record<string, string>[] = [];
    const errors: string[] = [];
    const origin = "https://www.wardogswiki.com";
    const bootstrap = googleAnalyticsConfigScript();
    await context.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (/\/(?:g\/|j\/)?collect\/?$/.test(url.pathname) || /(^|\.)google-analytics\.com$/.test(url.hostname)) {
        const lines = (request.postData() ?? "").split("\n").filter(Boolean);
        for (const line of lines.length ? lines : [""]) {
          const params = new URLSearchParams(url.search);
          new URLSearchParams(line).forEach((value, key) => params.set(key, value));
          if (params.has("en")) hits.push(Object.fromEntries(params));
        }
        return route.fulfill({status: 204, headers: {"access-control-allow-origin": request.headers().origin ?? "*", "access-control-allow-credentials": "true"}});
      }
      if (url.origin === origin && request.isNavigationRequest()) {
        return route.fulfill({contentType: "text/html", body: `<!doctype html><html lang="en"><head><title>Analytics initialization test</title></head><body><h1>Analytics initialization test</h1><script>
          window.dataLayer = [];
          ${scenario.argumentQueue
            ? 'window.gtag = function () { window.dataLayer.push(arguments); }; window.gtag("event", "ad_status", {status:"queued", placement:"test-slot", format:"display"});'
            : 'window.dataLayer.push(["event", "ad_status", {status:"queued", placement:"test-slot", format:"display"}]);'}
          ${bootstrap}
          window.gtag("event", "ad_status", {status:"script_loaded", placement:"test-slot", format:"display"});
        </script></body></html>`});
      }
      if (url.hostname === "www.googletagmanager.com" && request.method() === "GET" && /^\/gtag\/(js|destination)$/.test(url.pathname)) return route.continue();
      return route.abort();
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      const landing = `${origin}/en${scenario.query ? `?${scenario.query.slice(0, -1)}` : ""}`;
      const externalReferrer = "https://www.google.com/search";
      await page.goto(`${origin}/en?${scenario.query}private=test-only#private-state`, {referer:`${externalReferrer}?q=test-only`});
      await expect.poll(() => hits.filter((hit) => hit.en === "page_view").length).toBe(1);
      await page.evaluate(() => {
        history.pushState(null, "", "/en/tools/map?private=map-state#private-point");
        (window as unknown as {gtag: (...args: unknown[]) => void}).gtag("event", "map_action", {action:"open", map_id:"test-map"});
      });
      await expect.poll(() => hits.filter((hit) => hit.en === "page_view").length).toBe(2);
      await page.goBack();
      await expect.poll(() => hits.filter((hit) => hit.en === "page_view").length).toBe(3);
      // Let a pending Google batch flush without submitting it to Google.
      await expect.poll(() => hits.filter((hit) => hit.en === "ad_status" && hit["ep.status"] === "script_loaded").length, {timeout: 15000}).toBe(1);
      let previousCount = hits.length;
      let lastHit = Date.now();
      await expect.poll(() => {
        if (hits.length !== previousCount) { previousCount = hits.length; lastHit = Date.now(); }
        return Date.now() - lastHit;
      }).toBeGreaterThanOrEqual(1_000);
      const publicHits = hits.map((hit) => ({event: hit.en, status:hit["ep.status"], location:hit.dl, referrer:hit.dr, source:hit.cs, medium:hit.cm, campaign:hit.cn, measurement: hit.tid, sessionStart:hit._ss, consentState:hit.gcs, consentDetails:hit.gcd, nonPersonalizedAds:hit.npa, hasClient: Boolean(hit.cid), hasSession:Boolean(hit.sid), sequence:hit._s}));
      const evidence = JSON.stringify({configuredTag: GOOGLE_TAG_ID, expectedDestination, destinations: [...new Set(hits.map((hit) => hit.tid))], hits: publicHits, clientCount: new Set(hits.map((hit) => hit.cid)).size, sessionCount:new Set(hits.map((hit) => hit.sid)).size, errors}, null, 2);
      writeFileSync(info.outputPath("initialization-transport.json"), evidence);
      await info.attach("initialization-transport", {body:evidence, contentType:"application/json"});
      expect(hits.filter((hit) => hit.en === "ad_status" && hit["ep.status"] === "queued")).toHaveLength(1);
      expect(hits.filter((hit) => hit.en === "ad_status" && hit["ep.status"] === "script_loaded")).toHaveLength(1);
      expect(hits.filter((hit) => hit.en === "map_action")).toHaveLength(1);
      expect(hits.filter((hit) => hit.en === "page_view").map((hit) => ({location:hit.dl, referrer:hit.dr}))).toEqual([
        {location:landing, referrer:externalReferrer},
        {location:`${origin}/en/tools/map`, referrer:`${origin}/en`},
        {location:landing, referrer:`${origin}/en/tools/map`}
      ]);
      for (const hit of hits.filter((hit) => hit.en === "ad_status")) {
        expect(hit.dl).toBe(landing);
        expect(hit.dr).toBe(externalReferrer);
      }
      expect(hits.findIndex((hit) => hit.en === "page_view")).toBeLessThan(hits.findIndex((hit) => hit["ep.status"] === "queued"));
      expect(hits.every((hit) => Boolean(hit.cid) && Boolean(hit.sid))).toBe(true);
      expect(hits.find((hit) => hit.en === "page_view")?._ss).toBe("1");
      expect(hits.every((hit) => hit.npa === "1")).toBe(true);
      // Every event must reach the independently verified website stream.
      const destinations = [...new Set(hits.map((hit) => hit.tid))];
      expect(destinations).toEqual([expectedDestination]);
      expect(new Set(hits.map((hit) => hit.cid)).size).toBe(1);
      expect(new Set(hits.map((hit) => hit.sid)).size).toBe(1);
      expect(errors).toEqual([]);
      expect(publicHits.every((hit) => !`${hit.location} ${hit.referrer}`.includes("private"))).toBe(true);
    } finally {await context.close();}
  });
}
