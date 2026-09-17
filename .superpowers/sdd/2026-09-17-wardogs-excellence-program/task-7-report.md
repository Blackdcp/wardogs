# Task 7 Report: Catalogue Breadth And Operations Atlas

## Status

DONE, including the independent-review fix round.

## Base And Commits

- Base: `fbbd920`
- Feature commit: `62152fb` (`feat: expand the field reference`)
- Independent-review fix: included in `fix: harden the field reference evidence`

## Implemented Behavior

- Expanded the normalized catalogue with `equipment`, `medical`, `supplies`, `deployables`, `mechanics`, and `maps`, while preserving the established weapon, vehicle, ammo, attachment, gear, and loadout contracts.
- Kept every new breadth record inside category/task views. Task 7 creates no thin detail route; indexability still requires authored content, sufficient evidence, and a unique verified object image with meaningful alt text.
- Added a six-language `/{locale}/maps` operations atlas for battlefield orientation, tower terminals, oil rigs, FOBs, cargo, mortars, and helicopter transport.
- Added task filters, exact maintained-guide destinations, evidence/version/date/source fields, localized metadata, structured data, navigation, homepage search discovery, and six sitemap routes.
- The catalogue homepage now derives its visible `11`-index count from the actual category array and names equipment, medical, supplies, deployables, and mechanics in all six locale descriptions.
- Homepage search now gives `searchType="map"` a map-specific summary and a separate maps count instead of counting maps as tools.

## Independent-Review Fixes

1. Corrected all 12 equipment, medical, and deployable evidence records to the approved catalogue walkthrough at `https://www.youtube.com/watch?v=J5QZXLENLgQ`. They now use `creator-historical` / `observed` provenance, and unsupported prices and internal IDs were removed.
2. Rebuilt catalogue and atlas visual provenance as explicit record-to-asset approvals. Record state is derived from the matching approval, not from a type-wide default or a hand-authored claim.
3. Added deterministic audits for record state, exact record/image provenance, meaningful alt text, on-disk files, generic banners, duplicate object images, and unapproved assets. Mutation tests prove each failure is detected.
4. Added normalized evidence to inline catalogue cards: build, localized checked date, source class, confidence, source URL, and source scope notes remain visible even when no detail route exists.
5. Split Atlas editorial workflow guidance from sourced facts and provenance. Official/confirmed labels occur only inside the sourced-facts section; source scope is displayed beside the exact source link.
6. Localized current/historical evidence boundaries, dates, builds, evidence labels, Atlas fact labels/values, all seven Atlas titles, and map-search copy across English, German, Russian, Brazilian Portuguese, Japanese, and Simplified Chinese.
7. Locked Atlas meta descriptions to 120-160 characters for Latin locales and 60-110 characters for CJK locales.
8. Preserved all Task 1-6 routes, message keys, evidence gates, query-state contracts, and navigation classifications.

## Evidence And Asset Boundaries

- No competitor text or asset was added. New facts come only from the already approved source registry.
- Current official facts are not given the historical pre-Early-Access disclaimer. Historical creator and Beta observations retain their original build, date, source class, confidence, and non-current boundary.
- Object images require explicit per-record provenance. Context images remain separately labelled and cannot satisfy the detail-page evidence gate.
- Unsupported records render a localized `image not yet verified` state instead of a generic banner or borrowed image.
- `getIndexableVisualViolations()` currently returns no violations.

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

Pending counts are intentional evidence gaps. They are visible and tested as pending rather than hidden behind fallback art.

## TDD Evidence

The review tests were written before the fixes. The RED run caught the wrong 12-record source, missing inline provenance, stale seven-index copy, map/tool count mixing, incomplete locale boundaries, missing Atlas provenance audit, and the prior Atlas workflow/source presentation. The final focused review run passed 8 files and 56 tests.

## Verification

- Brief command: 3 files, 26 tests passed.
  - `tests/unit/catalogue-records.test.ts`
  - `tests/unit/operations-atlas.test.ts`
  - `tests/unit/sitemap.test.ts`
- Task 1-6 related regression: 25 files, 170 tests passed.
- Full Vitest: 108 files, 438 tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: zero errors; one pre-existing unused-import warning remains in `src/features/items/item-library.ts`.
- Atlas Playwright with installed Chrome: 2 tests passed.
  - 375 px mobile filtering and horizontal containment.
  - Simplified Chinese desktop labels and exact mortar-guide destination.
  - Verified/contextual images are scrolled into view and must decode with non-zero natural width.
  - Mobile and desktop screenshots were visually inspected.
- `git diff --check`: passed; output contains only the repository's LF-to-CRLF checkout notices.
- `next-env.d.ts`: unchanged from `HEAD` and excluded from this fix.

## Risks

- Thirty-six catalogue records and two Atlas entries still lack approved unique art. This is an explicit evidence gap, not a rendering failure; they remain pending until an object-matching source is approved.
- Four Atlas entries use approved contextual images. They must not be promoted to object-verified evidence without a new per-record asset review.
- Historical creator observations remain build-sensitive. Future refreshes must preserve their build/date boundary unless a new approved source re-verifies the fact.
- Source titles and source-scope notes remain tied to their approved source records; guide renames or source replacements must update the normalized registry and tests together.

## Fix Round 2 (2026-09-17)

### Status

DONE. The second independent-review findings were resolved without expanding Task 7.

### Evidence Corrections

- Downgraded `binoculars`, `rangefinder`, `fuel-can`, `repair-tool`, and `battery` to explicit `unverified` / `identifier-only` records. Their generic equipment-video citation, inferred roles, prices, internal identifiers, and current-behavior claims were removed. Each record now states that a record-specific source segment is pending and exposes no source URL.
- Removed all 65 ammo, attachment, and gear object-image approvals that depended on the general `-k6IV0ITLDo` overview. The files remain in the repository as unpublished candidates, but the records expose no image or alt text and remain `pending` until an object-matching source is approved.
- Added an explicit object-provenance guard that rejects the general overview URL even when a structurally complete registry entry is injected. The visual audit continues to derive state from approved provenance instead of trusting record-authored state.
- Preserved the ammo matcher when ammunition art is pending: relationship evidence remains available, media fields are omitted, and the UI renders a localized `image not verified` state. Category JSON-LD likewise keeps pending records discoverable without emitting an unsupported `image` property.
- Localized evidence dates, source notes, unverified labels, evidence states, and current/historical/mixed category disclaimers across English, German, Russian, Brazilian Portuguese, Japanese, and Simplified Chinese. Current official records no longer inherit a pre-Early-Access disclaimer.
- Made freshness classification independent of translated display strings: verified non-current evidence remains historical, while unverified evidence remains unknown.

### Mutation And Locale Coverage

- Equipment tests fail if any downgraded record regains a generic source, observed status, inferred object fact, unsupported filter, or non-pending media state.
- Media tests fail if any of the 65 records regains an image/alt pair or if the generic overview re-enters the approved provenance registry.
- Visual mutation tests reject wrong state, duplicate object art, generic banners, missing alt text, missing files, unapproved assets, and the explicitly denied overview source.
- Locale-matrix tests cover all six disclaimer states and all five translated locales for every guide date, record source note, and rendered current/historical/unknown evidence label.

### Updated Deterministic Coverage

| Group | Total | Verified | Contextual | Pending |
| --- | ---: | ---: | ---: | ---: |
| weapons | 38 | 34 | 0 | 4 |
| vehicles | 28 | 25 | 0 | 3 |
| ammo | 14 | 0 | 0 | 14 |
| attachments | 40 | 0 | 0 | 40 |
| gear | 11 | 0 | 0 | 11 |
| equipment | 5 | 0 | 0 | 5 |
| medical | 4 | 0 | 0 | 4 |
| supplies | 4 | 0 | 0 | 4 |
| deployables | 5 | 0 | 0 | 5 |
| mechanics | 4 | 0 | 0 | 4 |
| maps | 7 | 0 | 0 | 7 |
| operations-atlas | 7 | 1 | 4 | 2 |

Catalogue total: 59 verified object images and 101 explicit pending states.

### TDD And Verification

- RED: the six focused Round 2 files initially produced 12 intended failures and 33 passes, covering unsupported equipment evidence, generic media provenance, and incomplete locale semantics.
- GREEN focused run: 6 files, 45 tests passed.
- Task 7 coverage regression: 17 files, 135 tests passed.
- Full Vitest regression: 108 files, 445 tests passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed with only the repository's LF-to-CRLF checkout notices.

### Remaining Concerns

- The five equipment labels remain research leads, not observed object facts. They require an approved, locatable source segment before any role, price, identifier, behavior, or image can be restored.
- The 65 local ammo, attachment, and gear image files are intentionally unpublished. They require individual record-to-asset provenance; file presence alone must never promote them.

## Fix Round 3 (2026-09-17)

### Status

DONE. The final scoped review finding was resolved without changing Atlas facts, evidence classifications, visuals, routes, or source titles.

### Atlas Source-Scope Localization

- Added source-scope translations for all seven Operations Atlas records in German, Russian, Brazilian Portuguese, Japanese, and Simplified Chinese; English continues to use the normalized catalogue notes as the canonical source.
- Keyed every translation by the stable Atlas record ID. Rendering does not inspect or branch on an English display string.
- Updated the Atlas component to consume locale-specific records while preserving each record's facts, evidence object, visual state, source URL, and original proprietary source title.
- Preserved the factual boundary in every translation: official current claims remain narrow, historical creator observations remain build-bound, and editorial guidance is not presented as sourced fact.

### TDD And Verification

- RED: the new all-six-locale matrix test initially failed because `getLocalizedOperationsAtlasRecords` did not exist; the original four Atlas tests still passed.
- GREEN: the Atlas test file passed all 5 tests after the stable-ID localization path was implemented.
- Related Atlas, shared-localization, visual-coverage, catalogue-record, and catalogue-evidence regression: 5 files, 36 tests passed.
- TypeScript `--noEmit`: passed.
- `git diff --check`: passed with only the repository's LF-to-CRLF checkout notices.

### Remaining Concern

- A future Atlas record or source-scope rewrite must add or revise the matching locale entries. The record-ID-derived TypeScript matrix prevents a newly added Atlas ID from silently shipping without all five translations, while the locale test prevents non-English rendering from falling back to the English note.
