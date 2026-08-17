# Final review fix report

Date: 2026-08-18

Branch: `feature/wardogs-wiki`

Base/starting HEAD: `54c90b1aa84b7f35c7d349e476b925cfd38ec9fa`

Commit message: `fix: resolve catalogue release blockers`

## Status

All seven final-review findings are resolved. Focused regressions, both GitHub Pages deployment modes, the complete release gate, and the production route inventory pass. No push, deploy, Vercel CLI, or production mutation was performed.

This report is included in the fix commit, so its own final Git object ID cannot be embedded without changing that ID. The exact resulting SHA is reported in the task completion response and is available from `git log -1 --format=%H`.

## Implemented fixes

1. GitHub Pages root/subpath agreement
   - The Pages workflow now gives both build and verification the same root/custom-domain environment: `GITHUB_PAGES=true`, an empty `NEXT_PUBLIC_BASE_PATH`, and `NEXT_PUBLIC_SITE_URL=https://www.wardogswiki.com`.
   - `scripts/run-pages-smoke.mjs` honors caller-provided environment values and retains `/wardogs` plus `https://blackdcp.github.io` as local smoke defaults.
   - The Pages suite derives preview paths, assets, redirects, canonicals, and crawl targets from environment-backed public URL helpers.
   - Root/custom-domain and `/wardogs` exports are both exercised end to end.

2. Published item-route availability
   - Added lightweight `item-route-availability.ts` with exactly 40 entries: 34 English-only model details and six English/Russian legacy details.
   - Kept the client locale switcher independent of the large server item library.
   - Routed locale switching, fixed navigation, hub features, category cards/tables/standalone articles, homepage models, route guards, and canonical locale selection through the shared helper.
   - Unsupported detail switches use the requested locale's valid category; cross-locale content links use a published detail locale.
   - Added a manifest/server-library synchronization test and four-locale link crawls in both Pages modes.

3. Category return URL
   - The category hero's `All Items` anchor now uses `publicRoutePath`, preserving base paths and trailing-slash behavior.

4. Release 1 boundary
   - Deployment instructions now pin Release 1 to `ebb312d301347af7cac7fa4eafb414fd1ca7a5c1` and explicitly forbid deriving it from the earlier subject lookup.

5. Native ad fill detection
   - Fill now requires visible rendered text or media with geometry greater than 1x1.
   - Hidden/`aria-hidden` ancestry, `display:none`, `visibility:hidden|collapse`, `opacity:0`, zero-sized content, and 1x1 trackers are rejected.
   - Attribute/text/child mutations, capture-phase media loads, and 250 ms polling continue until meaningful fill or the existing eight-second terminal fallback.
   - Observer, listener, interval, and timeout cleanup is explicit for fill, fallback, and unmount.

6. Editorial dates
   - All 14 weapon and 20 vehicle model `detailUpdatedAt` fields are `2026-08-18`.
   - All 34 Alpha observation labels remain `Alpha 1 - 7 Aug 2026` (`2026-08-07`).
   - Item, sitemap, and JSON-LD tests distinguish editorial modification date from observed-data date.

7. Deterministic ad-bearing browser tests
   - Accessibility and every visual route now abort the third-party ad script and wait for all present ad slots to reach `filled` or `fallback` before analysis/screenshots.
   - This includes the guide article and both weapon/vehicle model detail regressions.

## RED/GREEN evidence

Baseline before regression additions:

```powershell
npx vitest run tests/unit/adsterra-native-banner.test.ts tests/unit/item-library.test.ts tests/unit/item-detail-route.test.ts tests/unit/item-metadata.test.ts tests/unit/item-structured-data.test.ts tests/unit/navigation-data.test.ts tests/unit/public-url.test.ts tests/unit/sitemap.test.ts
```

Result: exit 0; 8 files passed, 59 tests passed.

Focused RED after adding the regression contracts:

```powershell
npx vitest run tests/unit/item-route-availability.test.ts tests/unit/adsterra-native-banner.test.ts tests/unit/item-library.test.ts tests/unit/sitemap.test.ts tests/unit/item-structured-data.test.ts tests/unit/readme.test.ts tests/unit/item-catalog-guide-view.test.tsx tests/unit/navigation-data.test.ts tests/unit/pages-deployment-contract.test.ts
```

Result: exit 1; 9 files failed, 17 tests failed and 40 passed. Failures covered the missing route manifest/fallbacks, invisible-content acceptance, old editorial dates, unpinned release boundary, unnormalized category return link, unsafe fixed navigation, and mismatched Pages environments.

Focused GREEN with the same command:

Result: exit 0; 9 files passed, 57 tests passed.

Focused browser regression command:

```powershell
$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/navigation.spec.ts tests/e2e/routes.spec.ts --grep "locale switching|fixed legacy navigation|native banner" --reporter=line
```

Result: exit 0; 6 tests passed in 24.5 seconds. A first run without `PLAYWRIGHT_EXECUTABLE_PATH` failed only because Playwright's bundled Chromium was absent. The first Chrome-backed run exposed two test assumptions (German control text and React Strict Mode duplicate script timing); after correcting those assumptions, all six passed.

The first root Pages crawl also caught a real omitted link generator in the category page's standalone-article block plus a root-mode-only image assertion. Before the fix it reported 4 passed / 2 failed and all 12 invalid German/Portuguese legacy detail URLs. After routing that block through the shared helper and making the image assertion mode-aware, both deployment modes passed.

## Release gate

Longest-running verification: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test --reporter=line` at 5.1 minutes; it passed all 59 tests. No final release-gate command is failing. The intentional focused RED run, the first root Pages regression run, and the preliminary sitemap-shape inventory assertion are the failed diagnostic commands documented below; each was resolved and rerun green.

### Static checks and complete tests

```powershell
npm run lint
```

Result: exit 0; ESLint reported no errors or warnings.

```powershell
npm run typecheck
```

Result: exit 0. The final post-review rerun also exited 0.

```powershell
npm test
```

Result: exit 0; 44 test files passed, 150 tests passed. The final post-review rerun produced the same counts.

```powershell
npm run build
```

Result: exit 0; content validation passed 10 files / 23 tests, Next.js compiled and typechecked, and 220 static pages were generated.

```powershell
$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test --reporter=line
```

Result: exit 0; all 59 Playwright tests passed in 5.1 minutes. This included 8 accessibility routes, navigation and responsive coverage, all 14 weapon and 20 vehicle model details, ad lifecycle tests, and 16 mobile/desktop visual snapshots.

### Root/custom-domain Pages export

```powershell
$env:GITHUB_PAGES='true'; $env:NEXT_PUBLIC_BASE_PATH=''; $env:NEXT_PUBLIC_SITE_URL='https://www.wardogswiki.com'; npm run build:pages
$env:GITHUB_PAGES='true'; $env:NEXT_PUBLIC_BASE_PATH=''; $env:NEXT_PUBLIC_SITE_URL='https://www.wardogswiki.com'; $env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npm run test:pages:built -- --reporter=line
```

Result: both commands exit 0; content validation passed 10 files / 23 tests, 220 pages exported, and all 6 Pages tests passed in 10.6 seconds. Coverage includes all 34 English models, exact custom-domain canonicals, unsupported-locale absence, locale switching, and the four-locale internal-link crawl.

### `/wardogs` subpath Pages export

```powershell
$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npm run test:pages
```

Result: exit 0; content validation passed 10 files / 23 tests, 220 pages exported under `/wardogs`, and all 6 Pages tests passed in 10.7 seconds.

### Release pin

```powershell
git show --no-patch --format=%H ebb312d301347af7cac7fa4eafb414fd1ca7a5c1
```

Result: exit 0; output exactly `ebb312d301347af7cac7fa4eafb414fd1ca7a5c1`.

### Editorial/observation inventory

```powershell
$weaponEditorial = @(Select-String -Path 'src\features\items\weapon-items.ts' -SimpleMatch 'detailUpdatedAt: "2026-08-18"').Count
$vehicleEditorial = @(Select-String -Path 'src\features\items\vehicle-items.ts' -SimpleMatch 'detailUpdatedAt: "2026-08-18"').Count
$weaponObservation = @(Select-String -Path 'src\features\items\weapon-items.ts' -SimpleMatch 'build: "Alpha 1 - 7 Aug 2026"').Count
$vehicleObservation = @(Select-String -Path 'src\features\items\vehicle-items.ts' -SimpleMatch 'build: "Alpha 1 - 7 Aug 2026"').Count
```

Result: exit 0; `WEAPON_EDITORIAL=14 VEHICLE_EDITORIAL=20 WEAPON_OBSERVATION=14 VEHICLE_OBSERVATION=20`.

### Production route inventory

Server command:

```powershell
npm run start -- --hostname 127.0.0.1 --port 3017
```

The inventory derived all English detail routes from `.next/prerender-manifest.json`, separated the six exact legacy paths from the 34 models, and requested home, hub, five visual categories, every detail, `robots.txt`, and `sitemap.xml`. For every HTML route it required status 200, no soft-404 marker, exactly one canonical, and the expected native-ad count; it then fetched every unique local `<img src>` and confirmed all 40 item details occur in the sitemap.

Final inventory result: exit 0; `HTML_ROUTES=47 MODELS=34 LEGACY=6 ENDPOINTS=49 UNIQUE_IMAGES=109 FAILURES=0`.

A preliminary version of this one-off assertion looked for a trailing slash in sitemap URLs and produced 40 false `sitemap-missing` results. Inspecting the XML showed the established no-trailing-slash sitemap form; the corrected exact-path check above passed. The local server was stopped after inventory.

## Changed files

- `.github/workflows/deploy-pages.yml`
- `.superpowers/sdd/2026-08-17-wardogs-catalogue-upgrade/final-review-fix-report.md`
- `docs/superpowers/plans/2026-08-17-wardogs-catalogue-upgrade.md`
- `scripts/run-pages-smoke.mjs`
- `src/app/[locale]/items/[type]/[slug]/page.tsx`
- `src/app/[locale]/items/[type]/page.tsx`
- `src/app/[locale]/items/page.tsx`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/page.tsx`
- `src/components/ads/adsterra-native-banner.tsx`
- `src/components/catalogue/catalogue-card.tsx`
- `src/components/catalogue/catalogue-category-view.tsx`
- `src/components/catalogue/catalogue-home-band.tsx`
- `src/components/layout/desktop-navigation.tsx`
- `src/components/layout/locale-switcher.tsx`
- `src/components/layout/mobile-navigation-groups.tsx`
- `src/components/layout/site-header.tsx`
- `src/features/items/item-catalog-guide.tsx`
- `src/features/items/item-route-availability.ts`
- `src/features/items/vehicle-items.ts`
- `src/features/items/weapon-items.ts`
- `src/features/navigation/navigation-data.ts`
- `src/lib/item-metadata.ts`
- `tests/e2e/accessibility.spec.ts`
- `tests/e2e/helpers.ts`
- `tests/e2e/navigation.spec.ts`
- `tests/e2e/routes.spec.ts`
- `tests/e2e/visual.spec.ts`
- `tests/pages-e2e/pages-export.spec.ts`
- `tests/unit/adsterra-native-banner.test.ts`
- `tests/unit/item-catalog-guide-view.test.tsx`
- `tests/unit/item-library.test.ts`
- `tests/unit/item-route-availability.test.ts`
- `tests/unit/item-structured-data.test.ts`
- `tests/unit/navigation-data.test.ts`
- `tests/unit/pages-deployment-contract.test.ts`
- `tests/unit/readme.test.ts`
- `tests/unit/sitemap.test.ts`

## Preservation audit

The following pre-existing modified user files were neither patched nor staged:

- `next-env.d.ts`
- `package-lock.json`
- `src/features/items/item-catalog-guides.ts`
- `src/features/items/item-library.ts`

The build/dev cycle rewrites `next-env.d.ts`; its final content is the same pre-existing dev-types form recorded by the prior task report, and it remains unstaged. All pre-existing untracked icon, competitor/item/catalogue asset, archive, Python/cache, and keyword files shown by the initial `git status` remain untracked and unstaged.

## Self-review

- Reviewed the complete scoped implementation and test diff, including all new files, then ran `git diff --check` over every scoped tracked path. Result: exit 0; only the repository's existing Windows LF-to-CRLF notices were emitted.
- Confirmed the availability manifest has 40 unique paths and is guarded against drift by equality with the server item library; no large item-library import was added to the client locale switcher.
- Confirmed every catalogue-facing link family is covered by the root and subpath four-locale crawls. The crawl itself found and drove the final standalone-article link correction.
- Confirmed ad state transitions remain terminal and every observer, poll, timeout, load listener, and script listener is cleaned up.
- Confirmed no visual snapshot files changed; deterministic terminal ad states pass the existing snapshots unchanged.
- Confirmed all 34 editorial dates changed while all 34 Alpha observation labels remained intact.
- Confirmed no user-owned dirty/untracked path is in the scoped file list or staging plan.
- Confirmed no push, deploy, Vercel command, or production operation occurred.

Residual risk: the lightweight route manifest intentionally duplicates the server route inventory so it can be client-safe. The synchronization unit test and both deployment crawls are the guard against future drift. No unresolved release blocker was found in self-review.
