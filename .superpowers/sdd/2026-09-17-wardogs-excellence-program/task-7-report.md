# Task 7 Report: Catalogue Breadth And Operations Atlas

## Status

DONE

## Base And Commit

- Base: `fbbd920`
- Feature commit: this report is included in `feat: expand the field reference`.

## Implemented Behavior

- Expanded the normalized catalogue from the existing five groups to include `equipment`, `medical`, `supplies`, `deployables`, `mechanics`, and `maps`.
- Added 29 source-backed category records: 5 equipment, 4 medical, 4 supplies, 5 deployables, 4 mechanics, and 7 maps records. The complete normalized catalogue now contains 160 records.
- Kept every new record inside category/task views. Task 7 creates no thin detail route; a detail remains indexable only when it has authored content, approved provenance, a unique object-matching image, and meaningful alt text.
- Removed generic banner fallback behavior from record cards. A record without an approved unique asset now renders an explicit localized `image not yet verified` state.
- Added a six-language `/{locale}/maps` operations atlas built from the existing battlefield, tower, oil-rig, FOB, cargo, mortar, and helicopter evidence. Each entry exposes its task, context, evidence state, checked date, build/version, source, exact guide destination, and related tools.
- Added deterministic atlas filters for orientation, objective, construction, logistics, fire support, and air operations. The atlas does not publish inferred coordinates, grid references, or invented routes.
- Added localized navigation, metadata, canonicals, structured data, six sitemap URLs, and a homepage-search entry with explicit `searchType: "map"`.
- Preserved all Task 1-6 message keys, routes, query-state contracts, evidence records, and search classifications.

## Evidence And Asset Boundaries

- All new breadth uses the existing approved WARDOGS evidence registry and previously accepted guide/source URLs. No competitor text, competitor asset, unsupported value, or inferred tactical coordinate was added.
- Current claims remain restricted to official evidence. Historical creator/Beta observations retain their historical build and evidence labels.
- Contextual atlas art is explicitly labelled as context rather than object evidence. Records without a reliable approved asset remain visibly pending and cannot acquire indexability through a fallback banner.
- `getIndexableVisualViolations()` deterministically rejects missing/empty alt text, generic banners, duplicate detail images, and images without approved provenance. Its current result is empty.

## Deterministic Visual Coverage

| Group | Total | Verified | Contextual | Pending |
| --- | ---: | ---: | ---: | ---: |
| weapons | 38 | 34 | 0 | 4 |
| vehicles | 28 | 25 | 0 | 3 |
| ammo | 14 | 14 | 0 | 0 |
| attachments | 40 | 40 | 0 | 0 |
| gear | 11 | 11 | 0 | 0 |
| equipment | 5 | 0 | 0 | 5 |
| medical | 4 | 0 | 0 | 4 |
| supplies | 4 | 0 | 0 | 4 |
| deployables | 5 | 0 | 0 | 5 |
| mechanics | 4 | 0 | 0 | 4 |
| maps | 7 | 0 | 0 | 7 |
| operations-atlas | 7 | 1 | 4 | 2 |

The pending counts are intentional evidence gaps, not broken assets. They are rendered and tested as pending instead of being hidden behind generic imagery.

## TDD Evidence

The initial Task 7 focused run failed before implementation for the intended missing behavior:

- the six required catalogue groups and their records did not exist;
- the operations-atlas module, route, filters, metadata, navigation entry, and sitemap URLs did not exist;
- no deterministic visual-coverage helper or indexable-image violation audit existed.

After implementation, the same focused assertions pass. Additional regression assertions cover catalogue evidence, category rendering, media provenance, item-library indexability, structured data, navigation, search, and preserved content contracts.

## Verification

Brief command:

```powershell
npx vitest run tests/unit/catalogue-records.test.ts tests/unit/operations-atlas.test.ts tests/unit/sitemap.test.ts
```

Result: 3 files passed, 24 tests passed.

Related regression command:

```powershell
npx vitest run tests/unit/visual-coverage.test.ts tests/unit/navigation-data.test.ts tests/unit/site-search.test.ts tests/unit/catalogue-evidence.test.ts tests/unit/catalogue-explorer.test.tsx tests/unit/catalogue-media-sources.test.ts tests/unit/item-catalog-guides.test.ts tests/unit/item-library.test.ts tests/unit/item-structured-data.test.ts tests/content/beta-02-weekend-refresh.test.ts
```

Result: 10 files passed, 75 tests passed.

Real-browser atlas command:

```powershell
$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'
npx playwright test tests/e2e/operations-atlas.spec.ts --reporter=line --timeout=60000
```

Result: 2 Chromium tests passed. Coverage includes 375 px horizontal containment, deterministic logistics filtering, verified/contextual/pending media counts, HTTPS sources, absence of coordinate fields, Simplified Chinese navigation, and exact mortar-guide routing. Mobile and desktop screenshots were visually inspected after the run.

- `npm run typecheck`: passed.
- `npm run lint`: passed with zero errors and the one pre-existing unused-import warning in `src/features/items/item-library.ts`.
- Full Vitest run: 108 files and 430 tests passed.
- `npm run build`: passed; 37 content files / 127 content tests passed, production compilation succeeded, all six atlas pages were generated, and 874 static pages were emitted.
- `git diff --check`: passed; Git reported only the repository's existing LF-to-CRLF checkout notices.
- `next-env.d.ts`: matches `HEAD` and is not part of the Task 7 diff.

## Risks

- Thirty-six catalogue records and two atlas entries still lack approved unique art. They are intentionally non-indexable or explicitly marked pending until a licensable, object-matching source is approved.
- Four atlas entries use approved contextual images. Their labels must remain contextual; they must not be promoted to object-verified evidence without a new asset review.
- Historical Beta and creator observations may become stale as WARDOGS changes. Their build labels and checked dates must be preserved during future refreshes.
- Atlas source and destination integrity is tested against the current internal route registry; new guide renames must update the normalized atlas links and tests together.
