# Traffic-protected production release runbook

This runbook is the release contract for the traffic-protected site upgrade. `www.wardogswiki.com` on Vercel behind Cloudflare is the only production site. GitHub Pages is an auxiliary export at `https://blackdcp.github.io/wardogs/`; its workflow may build and upload evidence, but it must not set a production CNAME, deploy `www.wardogswiki.com`, or notify IndexNow.

## Release inputs and evidence

Record these values before changing production:

- previous production SHA from `https://www.wardogswiki.com/api/revision`;
- release SHA from the clean release checkout (`git rev-parse HEAD`);
- Vercel deployment/artifact ID and the Cloudflare hostname being checked;
- `config/traffic-protected-routes.json` counts and diff;
- full test output, production-contract output, sitemap added/removed URL diff, ad-inventory diff, and desktop/mobile screenshots of the six-section home page and the Guides, Catalogue, and Tools hubs.

Raw GA4, GSC, Bing, Bing AI, and Adsterra exports stay under `.tmp/traffic-baseline/<release-sha>/` and are never committed. The baseline manifest records the account timezone, exact inclusive dates, hostname/environment filters, dimensions, export filenames, release SHA, and unavailable fields. Missing Bing AI or revenue segmentation is written as `unavailable`, never as zero.

Production build variables:

```text
NEXT_PUBLIC_SITE_URL=https://www.wardogswiki.com
VERCEL_GIT_COMMIT_SHA=<release-sha>       # supplied by Vercel
INDEXNOW_BASE_SHA=<previous-production-sha>
```

The auxiliary Pages verification uses these separate values:

```text
GITHUB_PAGES=true
NEXT_PUBLIC_BASE_PATH=/wardogs
NEXT_PUBLIC_SITE_URL=https://blackdcp.github.io/wardogs
WARDOGSWIKI_RELEASE_SHA=<40-character-commit-sha>
```

Pages is a verify-only artifact and must contain no `out/CNAME`. Page routes use the Pages trailing-slash convention, but API resources and client requests are deliberately slashless: `/api/revision` and `/api/search-index/<locale>`. Adding `/` to either API URL is a release-contract failure because the export contains files at those exact extensionless paths.

The completed local acceptance baseline for this upgrade is: content 431 passed, unit 1,532 passed, full dev E2E 184 passed, production-local E2E 23 passed, the 22-test visual suite passed twice, Pages export E2E 8 passed, production build generated 1,355 routes, and the external-link check passed 139 links. This is candidate evidence, not production evidence. The production push, production E2E, and IndexNow submission remain pending until the final candidate SHA exists and `/api/revision` reports that exact SHA.

## Pre-release gate

Use the final release commit in a clean checkout. Do not run release preparation from a dirty working tree or a feature branch.

On a clean machine, install the pinned dependencies and Playwright Chromium before running any browser gate. On a clean Linux runner that also lacks Chromium system libraries, use `npx playwright install --with-deps chromium` in place of the second command.

```bash
npm ci
npx playwright install chromium
npm run content:validate
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e:build
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/wardogs NEXT_PUBLIC_SITE_URL=https://blackdcp.github.io/wardogs WARDOGSWIKI_RELEASE_SHA=<release-sha> npm run build:pages
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/wardogs NEXT_PUBLIC_SITE_URL=https://blackdcp.github.io/wardogs WARDOGSWIKI_RELEASE_SHA=<release-sha> npm run test:pages:built
test ! -e out/CNAME
test -f out/api/revision
test -f out/api/search-index/en
```

Then save the current production sitemap before pushing:

```bash
INDEXNOW_BASE_SHA=<previous-production-sha> npm run release:prepare
```

Preparation must confirm that the live revision equals the base SHA and write `.indexnow/predeploy-sitemap.json`. Preserve that file until finalization succeeds. Record its base, head, and URL count in the release evidence.

## Deploy and immediate verification

Push the release commit to `main` once and let the configured Vercel production integration deploy it. Do not run a second manual production deploy for the same SHA. Wait until `/api/revision` returns the release SHA, then run:

```bash
npm run test:e2e:production
INDEXNOW_BASE_SHA=<previous-production-sha> npm run release:finalize
```

Finalization checks the exact live SHA, every canonical route, every contracted legacy redirect, and every known clean 404 from `config/traffic-protected-routes.json`. It uses six concurrent requests, retries transport errors and 5xx responses once, aggregates failures, and stops after ten minutes. It also requires:

- an exact self-canonical and reciprocal protected hreflang targets;
- no `noindex` on canonical routes;
- sitemap coverage equal to the canonical contract, with redirects and known 404s excluded;
- clean 404 status, `noindex`, and no canonical/hreflang metadata;
- exactly six home sections in the frozen order, working search and localized `/items` entries;
- the enabled home rectangle and native ad inventory.

IndexNow runs only after this contract passes. A smoke or IndexNow failure leaves `.indexnow/predeploy-sitemap.json` in place. Fix the cause and rerun finalization with the same base and head; never replace or reuse the snapshot for a different release.

## Analytics and revenue checks

Before release, verify these GA4 event parameters are registered as event-scoped custom dimensions: `task`, `placement`, `section`, `target_path`, and `hub`. Ad diagnostics additionally require `format`, `status`, `locale`, `ad_unit`, `page_type`, and `config_version`. `page_path` is emitted without queries/fragments; use the standard page dimension when available instead of creating an unnecessary high-cardinality duplicate. The frozen events are:

- `home_task_click {task, placement, locale, page_path, link_url, target_path}`;
- `home_section_view {section, locale, page_path}`;
- `discovery_click {hub, task, locale, page_path, target_path}`.

Legacy per-task events with `legacy_compat: true` remain for continuity and must be excluded from conversion counts. Measure task CTR as both `unique task-click sessions / unique section-view sessions` and the explicitly named fallback `unique task-click sessions / homepage landing sessions`; never merge the denominators.

`ad_status` records DOM/runtime delivery state. `request_started` marks an actual loader insertion. `script_loaded`/`script_error` describe known loader state and may be replayed for a reused creative after SPA navigation, without issuing another request. `creative_missing` means no qualifying DOM creative after 15 foreground seconds from successful loader state; it does not prove vendor no-fill. `creative_viewable` means at least 50% intersection for one continuous foreground second, not a billed impression. Observations restart with the normalized current page while persistent layout ad requests stay unchanged. Segment releases using `config_version`; see [the experiment ledger](ad-monetization-experiments.md). It is not an Adsterra impression, CPM, or revenue event. Revenue comparisons use Adsterra by zone, format, country, and device for matching UTC dates and production hostnames. Calculate revenue per thousand eligible page views only when the zone-to-template mapping and eligible-page set are reliable; otherwise mark it unavailable. Exclude preview, test, and internal traffic.

Export 28 complete days, the latest seven complete days, and the preceding comparable seven days for:

- GA4 Landing page and Pages and screens, split by locale/page, country, device, source, and hostname;
- GSC Pages and Queries;
- Bing Search pages and queries;
- Bing AI citations/referrals when the product exposes them;
- Adsterra impressions, CPM, and revenue by zone, format, country, and device.

## Monitoring schedule

- **0 minutes:** revision, production E2E, full route contract, sitemap diff, canonical/hreflang/404, enabled ad containers, IndexNow result.
- **15 minutes:** homepage search/task clicks, JS errors, unexpected 404s, ad container delivery, and Vercel/Cloudflare errors.
- **1 hour:** GA real-time production hostname, the three frozen discovery events, landing-page routing, Adsterra zone delivery, and mobile layout.
- **Day 1 and Day 3:** GA landing sessions and engagement by locale/page/device/source; protected-route 404s; ad impressions and revenue alignment.
- **Day 7:** first complete post-release seven-day window when available; GSC/Bing coverage, queries, pages, recrawl status, and Bing AI availability. Delayed data stays unavailable until complete.
- **Day 14 and Day 28:** trend comparison against the frozen 7/28-day baselines, protected queries/URLs, tool and map acquisition, calculator usage, ad yield, and any locale-specific regression.

Traffic movement alone does not prove causation. Diagnose a decline by locale, page, device, and source before reverting a content batch. A technical hard failure uses the rollback procedure immediately.

## Emergency rollback

Hard failures include a wrong revision, protected canonical URL returning non-200, a contracted legacy URL becoming a new 404, broken hreflang/canonical, missing enabled ad inventory, search or primary entry failure, or a material mobile obstruction.

1. Stop IndexNow if finalization has not reached notification.
2. Promote/redeploy the recorded previous Vercel production artifact or revert `main` to the previous production SHA through the normal repository workflow.
3. Confirm `/api/revision` is the rollback SHA and rerun the full production contract against it.
4. Compare the rollback sitemap with the preserved pre-deploy snapshot. Notify IndexNow only for verified current or newly absent URLs through the normal prepare/finalize flow; do not hand-submit guessed URLs.
5. Record the failed release SHA, artifact ID, contract failures, rollback SHA, timestamps, and monitoring impact.

If IndexNow alone fails after the site contract passes, keep production live, preserve the snapshot, record the failed response, and retry `release:finalize` with the same base and head. IndexNow acceptance confirms submission only; it does not confirm crawling, indexing, or ranking.
