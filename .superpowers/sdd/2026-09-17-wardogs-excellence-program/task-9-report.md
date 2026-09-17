# Task 9 Report: Local Integration Verification And Repair

## Status

DONE locally. Push, Vercel publication, production-response verification, and IndexNow submission were intentionally not performed under the controller ruling.

## Branch And Scope

- Branch: `codex/adsense-migration`
- Starting HEAD: `bfda05389c2efcb2aed1f45e8edbcaab72b73852`
- Base reviewed: `origin/codex/adsense-migration` at `7878cb0`
- Reviewed change set before Task 9 fixes: 21 commits, 128 files, about 9,500 inserted lines.
- Task 9 fix commit message: `fix: complete excellence program verification` (this report is included in that commit).
- No worktree, subagent, push, deployment, production request, or IndexNow action was used.

## Required Verification Sequence

The required order was run before repair and again after all runtime repairs.

### Initial run

1. `npm run content:validate`
   - Exit 0.
   - 37 test files passed; 127 tests passed.
2. `npm test`
   - Exit 0.
   - 108 test files passed; 449 tests passed.
3. `npm run typecheck`
   - Exit 0; `tsc --noEmit` produced no diagnostics.
4. `npm run lint`
   - Exit 0 with one warning: unused `normalizeCatalogueEvidence` import in `src/features/items/item-library.ts`.
5. `npm run build`
   - Exit 0.
   - Content validation repeated at 37 files / 127 tests.
   - Next.js 16.3.0 production compilation and TypeScript completed.
   - 874 static pages generated.

### Final run after repair

1. `npm run content:validate`
   - Exit 0; 37 files / 127 tests passed; duration 10.24s.
2. `npm test`
   - Exit 0; 108 files / 449 tests passed; duration 8.68s.
3. `npm run typecheck`
   - Exit 0; no diagnostics.
4. `npm run lint`
   - Exit 0; zero errors and zero warnings.
5. `npm run build`
   - Exit 0.
   - Content validation: 37 files / 127 tests passed.
   - Production compilation and TypeScript passed.
   - 874 static pages generated in 14.8s.

`next build` rewrote `next-env.d.ts` to production route-type imports; it was restored to the branch's existing development form after each final build and excluded from the functional diff.

## Local Route And Metadata Verification

The optimized build was served with:

```powershell
npm run start -- --hostname 127.0.0.1 --port 3000
```

The following local routes returned HTTP 200 with expected content types and non-empty bodies:

- Six locale homes: `/en`, `/de`, `/ru`, `/pt-br`, `/ja`, `/zh-cn`.
- Tools: `/en/tools/weapon-compare`, `/en/tools/ammo-matcher`, `/en/tools/progression-route`, `/en/tools/logistics-planner`.
- Atlas: `/en/maps`.
- Item evidence: `/en/items/weapons/deagle`, `/en/items/weapons/amp-9`.
- Guide and video surfaces: `/de/guides/wardogs-fob-guide`, `/en/videos`.
- Machine routes: `/sitemap.xml`, `/video-sitemap.xml`, `/feed.xml`, `/api/status.json`, `/robots.txt`, `/ads.txt`.

Output counts and checks:

- `sitemap.xml`: 864 URLs.
- `video-sitemap.xml`: 186 URLs.
- `feed.xml`: 65 items.
- All 30 required six-locale URLs for the four tools plus atlas were present in the sitemap.
- `api/status.json`: schema version 2, `dataAsOf` 2026-09-17, Early Access Patch 0.11 live state and canonical production links.
- `robots.txt`: allows `/`, advertises the normal and video sitemaps, and uses `https://www.wardogswiki.com` as host.
- `ads.txt`: `google.com, pub-9912575932665397, DIRECT, f08c47fec0942fa0`.
- Representative pages emitted one title, one canonical, index/follow robots, matching `og:url`, and seven language alternates. Tool query state was excluded from canonical URLs.

## Browser Verification

System Chrome executable:

```text
C:\Program Files\Google\Chrome\Application\chrome.exe
```

All Playwright runs used `PLAYWRIGHT_EXECUTABLE_PATH` with the optimized local production server.

Focused interaction command:

```powershell
npx playwright test tests/e2e/site-search.spec.ts tests/e2e/task5-tools.spec.ts tests/e2e/task6-tools.spec.ts tests/e2e/operations-atlas.spec.ts tests/e2e/current-video-grid.spec.ts --reporter=line --timeout=60000
```

- Initial result: 8 passed, 1 failed. The failing homepage test showed that Tab from the search combobox did not reach the first action.
- After repair: 9 passed, 0 failed in 8.5s.
- Coverage includes search arrows/Enter/Escape/Tab/pointer activation, desktop/mobile tool state, invalid SSR/hydration parameter recovery, copy-link behavior, logistics reordering, atlas filter/image/guide behavior, and current-video filter/order behavior.

Additional focused runs:

- `npx playwright test tests/e2e/site-search.spec.ts --reporter=line --timeout=60000`: 2 passed after the focus fix.
- `npx playwright test tests/e2e/accessibility.spec.ts --reporter=line --timeout=60000`: 8 passed against the final production build; no serious or critical violations on the homepage, guide hubs/details, catalogue hubs/categories, AMP-9, or Bobcat.
- `npx vitest run tests/unit/live-beta-banner-layout.test.ts tests/unit/site-search.test.ts tests/unit/homepage-composition.test.ts`: 3 files / 10 tests passed.
- Targeted current-video Controls filter: one card on desktop and mobile; thumbnail decoded at 480 x 360 in both viewports.

The independent browser matrix recorded:

- 23 route/viewport captures with HTTP 200.
- 0 horizontal-overflow failures.
- 0 page exceptions.
- 0 critical or serious axe violations after repair.
- Search Tab focus reached `Run your first match` on desktop and mobile, with `aria-expanded=false` and no stale `aria-activedescendant`.
- Weapon, ammo, progression, and logistics share-state URLs all round-tripped exactly.

The full-page videos view contains many lazy thumbnails outside the viewport. Full-page stitching did not reliably request all of them, so blank-image acceptance was based on the scrolled, filtered visible surface instead. The visible Controls result decoded successfully in real Chrome. GA and AdSense were blocked in the QA harness to avoid external telemetry; no hydration errors occurred.

## Screenshot Artifacts

All artifacts are ignored scratch files under:

```text
E:\游戏海外站\.superpowers\scratch\task-9\screenshots
```

Primary screenshots manually inspected:

- Homepage status/actions/search: `desktop-home-status.png`, `mobile-home-status.png`, `desktop-home-actions.png`, `mobile-home-actions.png`, `desktop-home-search.png`, `mobile-home-search.png`.
- Current and historical evidence: `desktop-item-current.png`, `mobile-item-current.png`, `desktop-item-historical.png`, `mobile-item-historical.png`.
- Tools: desktop/mobile pairs for `weapon-compare`, `ammo-matcher`, `progression`, and `logistics`.
- Atlas: desktop/mobile full pages and `desktop-atlas-first-entry.png`, `mobile-atlas-first-entry.png`.
- Current video filter: `desktop-videos-controls-filter.png`, `mobile-videos-controls-filter.png`.
- Long and non-Latin labels: `mobile-de-long-label.png`, `mobile-ru-long-label.png`, `mobile-ptbr-long-label.png`, `desktop-ja-page.png`, `mobile-zhcn-page.png`.

Manual review found no incoherent overlap, clipped labels, horizontal scroll, collapsed controls, unstable result dimensions, or unlabelled blank local images. `Image not verified` and pending Atlas visuals are intentional evidence states, not failed assets.

## Findings And Fixes

1. **Lint warning**
   - Root cause: `normalizeCatalogueEvidence` remained imported after the item library switched to record-owned normalized evidence.
   - Fix: removed only the unused import.
   - Result: final lint has zero warnings.

2. **Search Tab focus failure**
   - Reproduction: system Chrome focused the search results scroll container, then fell back to `BODY`, instead of reaching the first homepage action.
   - Root cause: current Chrome includes scrollable containers in sequential focus navigation even without an explicit `tabindex`.
   - Fix: set `tabIndex={-1}` on the fixed-height search-results scroller. Listbox options remain controlled through `aria-activedescendant` and pointer activation.
   - Result: both focused search tests and the complete 9-test browser set pass.

3. **Homepage definition-list accessibility**
   - Reproduction: axe reported serious `definition-list` and `dlitem` violations for four nodes.
   - Root cause: icons and nested wrappers separated the live-status `dt`/`dd` pairs from their allowed definition-list grouping.
   - Fix: moved each decorative icon into its `dt` and kept `dt`/`dd` as direct children of the allowed group wrapper.
   - Result: zero critical/serious axe violations on the browser matrix.

4. **Whole-branch whitespace check**
   - Root cause: the program plan and design spec each contained one extra blank line at EOF.
   - Fix: removed the two extra lines.
   - Result: working-tree and full-branch `git diff --check` pass; only checkout line-ending notices are printed.

## Whole-Branch Review

- Read the Task 9 brief, approved design, implementation plan, SDD ledger, all Task 1-8 reports, full 21-commit log, 128-file name/status diff, diff statistics, and all changed runtime/test areas called out by the reports.
- Confirmed no added `.only`/`.skip`, TODO/FIXME, TypeScript suppression, ESLint suppression, or unsafe `_blank` link without `rel`.
- Rechecked evidence gates, locale route generation, sitemap discovery, metadata/canonical behavior, share-state namespacing, current/historical labels, image provenance states, and current-video accepted/rejected ledgers through source review and passing tests.
- No remaining critical or important local-integration finding was found.

## Not Executed

The following Task 9 publication steps remain for the controller after independent whole-branch approval:

- `git push` of `codex/adsense-migration`.
- Vercel publication/deployment.
- Production response, canonical/meta/robots, sitemap/feed/status/ads verification.
- `scripts/submit-indexnow.mjs` for changed canonical URLs.

No production-success claim is made from this local report.

## Concerns

None blocking local integration. External YouTube thumbnail loading required a network-enabled Chrome rerun; the visible current-filter thumbnails decoded successfully. Publication and production-only verification remain intentionally outstanding.

## Final Whole-Branch Review Fix Wave (2026-09-18)

### Review Findings And Repairs

1. **Record-backed catalogue tables and counts**
   - Red tests exposed published guide rows and JSON-LD counts that could not map one-to-one to the 40 evidence records (including unsupported medical/deployment prices and labels).
   - Published category tables are now generated from `catalogueRecords`; each row carries its unique record slug and only record-supported facts. Explorer, table, and JSON-LD counts share the same record source.
   - Cross-layer invariants verify unique record mapping, field-subset fidelity, and count consistency.

2. **Catalogue visual provenance**
   - Red cross-layer and mutation tests showed that category Hero, metadata, and JSON-LD images could bypass the media registry.
   - Category image publication now resolves exclusively through approved contextual registry entries. Contextual banners remain category context and are never promoted to object evidence.
   - Hero, metadata, and structured-data tests all fail closed when registry approval is removed.

3. **Six-locale evidence facts**
   - Red render-matrix tests found raw English change fields, entities, notes, build labels, level labels, and planner roles in translated locales.
   - Season 1 changes now use stable IDs. Presentation-layer dictionaries localize the required evidence vocabulary for `en`, `de`, `ru`, `pt-br`, `ja`, and `zh-cn`; numeric and currency facts remain shared, and source titles remain verbatim.
   - EvidencePanel reuses localized build/date formatting. A final real-browser check caught `Driver`/`Pilot` remnants; the test matrix was strengthened before those role terms were localized.

4. **Atlas visual provenance**
   - Red tests exposed missing public visual provenance fields and the Mortar visual incorrectly inheriting its fact-video source.
   - Atlas records now preserve `sourceUrl`, `sourceLabel`, `retrievedAt`, and `usageNote` for visuals and render localized visual-source and usage-scope blocks separately from factual sources.
   - Mortar's building image has its own visual source and no longer points to the factual video.

5. **Item freshness**
   - Red tests showed Deagle Article `dateModified` and sitemap `lastmod` stopping at the detail date instead of the later official change verification.
   - Both surfaces now use the maximum of `detailUpdatedAt`, `evidence.verifiedAt`, and every `changeHistory.verifiedAt`. Deagle is locked at `2026-09-09` as the representative regression.

### Final Verification

Commands were run from `E:\游戏海外站` on the final source state:

- `npx.cmd vitest run tests/unit/item-catalog-guides.test.ts tests/unit/item-catalog-guide-view.test.tsx tests/unit/item-structured-data.test.ts tests/unit/item-metadata.test.ts tests/unit/catalogue-media-sources.test.ts tests/unit/catalogue-evidence-view.test.tsx tests/unit/evidence-localization-render.test.tsx tests/unit/progression-route.test.ts tests/unit/logistics-planner.test.ts tests/unit/operations-atlas.test.ts tests/unit/visual-coverage.test.ts tests/unit/sitemap.test.ts`: 12 files, 104 tests passed.
- `npm.cmd run content:validate`: 37 files, 127 checks passed.
- `npm.cmd test`: 109 files, 456 tests passed.
- `npm.cmd run typecheck`: passed with exit code 0.
- `npm.cmd run lint`: passed with exit code 0 and zero warnings.
- `npm.cmd run build`: the first attempt reached 655/874 static pages and terminated with Windows worker code `3221226505` because an older `next start` process still held the previous `.next`; after stopping that local process, the exact command completed 874/874 pages with exit code 0.
- `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx.cmd playwright test tests/e2e/operations-atlas.spec.ts tests/e2e/task6-tools.spec.ts tests/e2e/accessibility.spec.ts`: 12 tests passed in system Chrome, without snapshot-update mode.
- `git diff --check`: passed; checkout line-ending notices only.

Local route checks returned HTTP 200 for `/sitemap.xml`, `/feed.xml`, `/api/status.json`, `/robots.txt`, and `/ads.txt`. Parsed output confirmed Deagle Article `dateModified` and sitemap `lastmod` use `2026-09-09`, and the weapons/gear CollectionPage images use approved contextual registry assets rather than direct object images.

### Final Browser Review

The broader ignored real-browser harness produced 38 captures and 34 screenshots with no overflow, broken local image, page exception, serious accessibility, or hydration failures. The final locale evidence screenshots were manually inspected at:

- `E:\游戏海外站\.superpowers\scratch\task-9\screenshots\final-review\ru-progression-evidence.png`
- `E:\游戏海外站\.superpowers\scratch\task-9\screenshots\final-review\ptbr-logistics-evidence.png`

They show localized Russian and Portuguese level/role evidence without the English leakage caught in the preceding red test. Earlier manual inspection also covered desktop/mobile category Heroes and record-backed tables, German/Japanese/Chinese evidence, and Mortar's separate Atlas visual provenance.

### Snapshot And Generated-File Decision

The reviewed runtime changes legitimately changed the homepage, guide, video, catalogue, and detail-page baselines. Representative desktop, mobile, first, middle, and final segment captures were manually inspected; the complete 20-test visual suite then passed without snapshot-update mode. The final full system-Chrome suite passed 76/76, so the regenerated baselines are included as verification artifacts. `next-env.d.ts` remains unchanged apart from local line-ending normalization.

### Remaining External Steps

No push, Vercel deployment, production verification, or IndexNow submission was performed. Those remain controller-owned after independent whole-branch approval.

### Final Concern

Tracked visual baselines intentionally remain unchanged under the controller's explicit instruction; a future separately reviewed baseline refresh may be appropriate. This does not affect the focused system-Chrome interaction/accessibility run or the manually reviewed scratch captures.
