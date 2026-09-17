# Task 8 Report: Current Video Intelligence

## Status

DONE

## Implementation

- Expanded `currentVideoSources` from 8 to 25 reviewed Season 1 creator-guidance sources, using only the 17 accepted IDs from `task-8-video-research.md`.
- Preserved canonical `https://www.youtube.com/watch?v=<id>` URLs, exact creator titles and channel names, and the existing `CurrentVideoSource` consumer fields. Added `reviewedAt` and `sourceClass: "creator-current"` metadata without changing the existing consumer signature.
- Added task coverage for first match, money and XP, roles and progression, weapons and loadouts, FOB operations, supply and logistics, vehicles, helicopters, building, drones, settings and performance, teamplay, current Season 1 changes, and mortars.
- Added six-locale task labels and version-caution summaries. Every surface identifies the sources as reviewed creator guidance and directs version-sensitive claims back to the current client and official notes.
- Replaced the homepage video band’s historical article cards with newest-first reviewed current sources and task filters. The video hub uses the same filterable source grid, stable `aspect-video` thumbnails, publication/review dates, current-build labels, and related-guide links.
- Kept historical video articles and their sitemap lifecycle intact; no thin video articles or canonical route changes were added.

## TDD Evidence

The first focused run failed as intended before implementation:

- `video-library.test.ts` expected the 25 accepted source IDs but received the previous 8-source library.
- `video-card-lifecycle.test.tsx` expected the homepage current-video watchlist and creator guidance but received historical standalone article cards.
- `contextual-video-evidence.test.tsx` proved that guide embeds needed to use each source record's review date rather than a disconnected global date.

After implementation, the focused regression suite passed.

## Verification

```powershell
npx vitest run tests/unit/video-library.test.ts tests/unit/video-card-lifecycle.test.tsx tests/unit/video-sitemap.test.ts
```

Result: 3 test files passed, 13 tests passed.

```powershell
npx vitest run tests/unit/video-library.test.ts tests/unit/video-card-lifecycle.test.tsx tests/unit/video-sitemap.test.ts tests/unit/contextual-video-evidence.test.tsx tests/unit/homepage-composition.test.ts
```

Result: 5 test files passed, 18 tests passed.

```powershell
npm run typecheck
npm run lint
git diff --check
```

Result: type checking completed successfully and `git diff --check` reported no whitespace errors. Lint completed with one pre-existing warning outside this task: `src/features/items/item-library.ts` imports `normalizeCatalogueEvidence` without using it.

## Concerns

`npm run lint` retains one pre-existing, out-of-scope unused-import warning in `src/features/items/item-library.ts`. Creator guidance is deliberately not promoted into official gameplay facts, and every rejected research ID remains excluded from the current Season 1 source set.
