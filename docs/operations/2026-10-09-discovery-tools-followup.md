# October 9 discovery and tool recovery follow-up

Production baseline: `7beb4d6ac0461de86b0b50c962d2062ee82916e4`.

## Changes

- Improve eight-language task search for map markers, Gold budgets, reporting players and calculator intent. Index the six reviewed video articles using their actual content. The 120-query task audit now returns the intended first result for every query, preserving all 78 existing first results.
- Extend precise guide, catalogue, tool, market and reviewed-video continuations across all eight locales. Preserve existing destinations and ordering. Native links respect the auxiliary Pages deployment prefix.
- Reject inherited-property weapon identifiers and malformed calculator shares. Missing numeric inputs no longer become zero; valid north-facing zero-degree inputs remain supported. Invalid shares show a localized recovery message.
- Preserve a full 17-point map route when another point is attempted. Marker and POI route actions accept coordinates without treating marker metadata as an imported route schema. Adding route or fire points restores the relevant layer. A target requires an explicit gun location instead of silently using the viewport center.
- Include changed map/calculator components and watch-page templates in IndexNow URL selection.

## Protected behavior

The 1,400 canonical and 2,870 legacy URL contract is unchanged. Homepage sections, language-priority traffic entries, metadata, advertising inventory and analytics event names are unchanged. No game mechanics or weapon measurements are invented. Private analytics exports remain outside Git.

## Candidate validation

- 2,306 unit/content tests verified. The final full run passed 2,299 tests; the seven proxy tests were rerun successfully after the parallel Pages build restored its temporarily moved proxy file.
- ESLint over repository source, TypeScript and whitespace checks passed.
- Production and auxiliary Pages builds each generated 1,419 routes.
- 80 production-build desktop/mobile browser tests passed, including malformed-share recovery and map route actions.
- All ten auxiliary Pages checks verified: nine existing checks passed, and the new eight-language link check passed after its expected URL was corrected to include the static export's trailing slash.
- Independent review found no blocking defect in calculator import handling.

Deployment revision, production URL checks and IndexNow acceptance belong in the deployment receipt. Build acceptance alone does not establish deployment, indexing or a traffic/revenue improvement. The analytics windows read on October 9 end before this follow-up deployment.
