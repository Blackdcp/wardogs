# Task 6 Report: Category Image Grids, Anchors, and Filters

## Status

DONE_WITH_CONCERNS

Task 6 is implemented on `feature/wardogs-wiki`. The only concern is one pre-existing ESLint warning in the untouched file `src/lib/item-structured-data.ts`; lint exits successfully with zero errors.

## Implementation

- Added a server-rendered `CatalogueCard` with stable `record-{type}-{slug}` ids, fixed image geometry, contained transparent product art, facts, evidence date, and conditional detail linking.
- Cards link only when `detailStatus === "published"` and `detailHref` exists. All Release 1 weapon and vehicle records remain non-linking planned cards; Ammo, Attachments, and Gear remain non-linking inline cards.
- Added a client `CatalogueExplorer` with accessible text search, an All state, category filters supplied from `catalogueGroups`, a live visible-result count, and React-only state. It renders every supplied record in initial server HTML and toggles the `hidden` attribute after hydration without changing the URL.
- Added a category view that owns the approved hero map rather than reading dirty `heroImage` fields from the guide data.
- Added image explorers only for Weapons, Vehicles, Ammo, Attachments, and Gear with exact record counts of 14/20/14/40/11. Equipment and Loadouts retain heroes and complete tables without explorers.
- Added exact normalized-name row matching. Duplicate or cross-category matches are rejected. Matched planned/inline first cells link to stable record anchors, future published rows link only to an exact supplied `detailHref`, and unmatched rows remain plain text.
- Preserved all existing category tables, snapshot totals, disclaimers, insights, unknowns, sources, standalone guides, metadata, canonical/noindex behavior, routes, and ad-free category pages.
- Added eager loading only when an explorer card reuses the category hero image, preventing Next's duplicate-URL LCP warning for Ammo and Gear.

## Approved Hero Map

| Category | Asset | Fit |
| --- | --- | --- |
| Weapons | `/images/catalogue/banners/weapons-1280.webp` | cover |
| Vehicles | `/images/catalogue/banners/vehicles-1280.webp` | cover |
| Ammo | `/images/catalogue/ammo/556x45mm.webp` | contain |
| Attachments | `/images/catalogue/banners/attachments-1280.webp` | cover |
| Gear | `/images/catalogue/gear/heavy-armor.webp` | contain |
| Equipment | `/images/catalogue/banners/meta-1280.webp` | cover |
| Loadouts | `/images/catalogue/banners/loadouts-1280.webp` | cover |

## Files Changed

- Created `src/components/catalogue/catalogue-card.tsx`
- Created `src/components/catalogue/catalogue-explorer.tsx`
- Created `src/components/catalogue/catalogue-category-view.tsx`
- Modified `src/app/[locale]/items/[type]/page.tsx`
- Modified `src/features/items/item-catalog-guide.tsx`
- Created `tests/unit/catalogue-explorer.test.tsx`
- Modified `tests/unit/item-catalog-guide-view.test.tsx`
- Modified `tests/e2e/routes.spec.ts`
- Modified `tests/e2e/responsive.spec.ts`
- Created `.superpowers/sdd/2026-08-17-wardogs-catalogue-upgrade/task-6-report.md`

Explicitly left untouched and unstaged: `next-env.d.ts`, `package-lock.json`, `src/features/items/item-library.ts`, `src/features/items/item-catalog-guides.ts`, legacy/untracked image directories, and scripts.

## TDD Evidence

### Baseline

`npx vitest run tests/unit/catalogue-records.test.ts tests/unit/item-catalog-guide-view.test.tsx`

- PASS: 2 files, 6 tests.

### RED 1: Task 6 Components

`npx vitest run tests/unit/catalogue-explorer.test.tsx tests/unit/item-catalog-guide-view.test.tsx`

- Expected FAIL: both suites could not import the not-yet-created `catalogue-card` and `catalogue-category-view` modules.

### GREEN 1: Cards, Explorer, and Row Links

`npx vitest run tests/unit/catalogue-explorer.test.tsx tests/unit/item-catalog-guide-view.test.tsx`

- PASS: 2 files, 8 tests.

`npx vitest run tests/unit/catalogue-explorer.test.tsx tests/unit/item-catalog-guide-view.test.tsx tests/unit/item-catalog-guides.test.ts`

- PASS: 3 files, 13 tests.

### RED/GREEN 2: Duplicate Hero Image Loading

`npx vitest run tests/unit/catalogue-explorer.test.tsx`

- Expected FAIL: the hero-reused card still rendered `loading="lazy"` instead of `loading="eager"`.

After the narrow eager-image implementation:

`npx vitest run tests/unit/catalogue-explorer.test.tsx tests/unit/item-catalog-guide-view.test.tsx tests/unit/item-catalog-guides.test.ts`

- PASS: 3 files, 14 tests.

### RED/GREEN 3: Published Record Without URL

`npx vitest run tests/unit/item-catalog-guide-view.test.tsx`

- Expected FAIL: a synthetic published AK74 record without `detailHref` incorrectly fell back to `#record-weapons-ak74`.

After making the table-link branches explicit:

`npx vitest run tests/unit/catalogue-explorer.test.tsx tests/unit/item-catalog-guide-view.test.tsx tests/unit/item-catalog-guides.test.ts`

- PASS: 3 files, 15 tests.

## Test Commands and Results

### Focused Unit Tests

- Required focused command: PASS, 3 files and 15 tests on the final run.
- Existing exact table-total tests remained green.

### Browser Tests

`$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/routes.spec.ts tests/e2e/responsive.spec.ts`

- Initial implementation run: PASS, 15 tests in 58.7 seconds. It exposed duplicate-URL LCP development warnings for Ammo and Gear, which were fixed with a focused RED/GREEN cycle.
- Final post-fix run: PASS, 15 tests in 1.0 minute.
- Covered all 99 explorer images, all seven approved heroes, exact explorer counts, non-linking Release 1 cards, AK74 stable anchors, canonical URL stability during search/filtering, category ad absence, responsive control stability, and horizontal-overflow checks.

### Repository Gates

`npm run typecheck`

- PASS on both the pre-review and final post-review runs.

`npm run lint`

- PASS with zero errors on both runs.
- One pre-existing warning remains at `src/lib/item-structured-data.ts:16`: `_locale` is defined but never used. The file is unrelated and was not modified.

`npx vitest run tests/unit`

- Pre-review run: PASS, 29 files and 68 tests.
- Final post-review run after adding the missing-URL regression: PASS, 29 files and 69 tests.

`git diff --check`

- PASS. Git reports only existing LF-to-CRLF working-copy notices, with no whitespace errors.

### Additional Browser Probe

A headless installed-Chrome probe compared rendered cards, stable table anchors, and card detail links:

| Category | Cards | Table record anchors | Card detail links |
| --- | ---: | ---: | ---: |
| Weapons | 14 | 14 | 0 |
| Vehicles | 20 | 20 | 0 |
| Ammo | 14 | 14 | 0 |
| Attachments | 40 | 40 | 0 |
| Gear | 11 | 11 | 0 |

Fresh Ammo and Gear loads after the eager-image fix produced no LCP image warning.

## Visual QA

Full-page screenshots were generated with installed Chrome after scrolling every visible image into view and confirming non-zero natural dimensions:

- `C:\Users\user\.codex\visualizations\2026\08\12\019ff642-5c76-7523-9b58-a1c7eea08ac7\task6-weapons-390.png`
- `C:\Users\user\.codex\visualizations\2026\08\12\019ff642-5c76-7523-9b58-a1c7eea08ac7\task6-ammo-390.png`
- `C:\Users\user\.codex\visualizations\2026\08\12\019ff642-5c76-7523-9b58-a1c7eea08ac7\task6-attachments-390.png`
- `C:\Users\user\.codex\visualizations\2026\08\12\019ff642-5c76-7523-9b58-a1c7eea08ac7\task6-weapons-1440.png`
- `C:\Users\user\.codex\visualizations\2026\08\12\019ff642-5c76-7523-9b58-a1c7eea08ac7\task6-ammo-1440.png`
- `C:\Users\user\.codex\visualizations\2026\08\12\019ff642-5c76-7523-9b58-a1c7eea08ac7\task6-attachments-1440.png`

Inspection results:

- Weapons: all 14 product images are contained and readable; card dimensions remain stable; hero crop is controlled; filters wrap cleanly at 390px; tables remain within their horizontal regions.
- Ammo: all 14 product images are contained; the hero product remains visible behind readable text; unknown values wrap without collision; the one-column and three-column grids remain coherent.
- Attachments: all 40 images load; long optic and magazine names wrap inside cards; no text or image overlaps occur; table rows retain all original content and anchor styling.
- At both 390px and 1440px there is no page-level horizontal overflow, controls do not resize when filters change, cards stay inside the viewport, and no missing-image or missing-detail link is present.

## Self-Review

- Confirmed all 34 planned weapon/vehicle records still have no `detailHref`; AK74 appears only as `#record-weapons-ak74` in cards/tables and never as a new detail route.
- Confirmed card and table detail linking both require `published` plus an exact `detailHref`.
- Confirmed a published record with a missing URL remains plain in the table.
- Confirmed every supplied visual record renders in initial server markup and filtering is limited to React state and `hidden` attributes.
- Confirmed all 99 supplied record names match exactly one table row; unmatched rows remain plain.
- Confirmed Equipment and Loadouts have no explorer.
- Confirmed every hero comes from the committed brief map, with no reads from dirty guide `heroImage` fields and no use of untracked `/images/items` assets.
- Confirmed category pages contain no ad slot and no Product schema or new detail route was added.
- Confirmed no gradients, decorative orbs, nested cards, or interface-explainer copy were introduced.
- Confirmed canonical/noindex locale logic and existing URLs were not modified.
- Confirmed unrelated dirty files remain out of the Task 6 stage set.

## Concerns

- ESLint has one pre-existing warning in untouched `src/lib/item-structured-data.ts:16` for unused `_locale`; lint exits 0 with no errors.
- The worktree contains unrelated pre-existing dirty and untracked files. They are intentionally preserved and excluded from the Task 6 commit.
