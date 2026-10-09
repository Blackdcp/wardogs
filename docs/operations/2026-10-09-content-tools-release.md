# October 9 content and tool upgrade

Production baseline: `b5371e49166acaea28322b4a0869c136098a6bec`.

## Scope

- Refresh the existing Season 2, Gold, wipe, controls, armor, helicopter and loadout guides from the developer interview. Keep October 15 and existing retention answers prominent; distinguish plans from released values.
- Close the expired clip contest entry flow while preserving its URL and result-discovery information. Record the conflicting prize counts in the organizer's page and terms without inventing a resolution.
- Rewrite nine guide families in eight languages around player tasks, examples and failure cases; remove internal SEO prose. Refresh Discord, server-provider information and Japanese traffic-bearing task content.
- Add a shared, localized release-impact model to relevant existing guide, market, weapon catalogue, video and tool pages. Interview links include the supporting chapter. No new watch page or guessed VideoObject metadata is introduced.
- Fix the SPH-2 low-arc correction direction by comparing actual old/new solutions. Flight-time and height corrections remain explicitly unverified estimates.
- Use one map calibration for ruler, route, fire mission and calculator handoff. Default full-tile scale is a community-reference estimate; user calibration takes precedence.
- Add 36 attributed community coordinates, categorized private markers, search, route/mission reuse, overview clustering and bounded plan-file import/export. Shared links are snapshots, not synchronized rooms.
- Improve phone task panels. POI and marker buttons do not intercept placement in measurement, route or fire-mission modes.
- Add measured-condition STK/TTK, weight completeness, caliber pairing, user-observed attachment fit, version notes and twelve local loadout saves. Missing data remains unknown. Shared state includes the relevant inputs; analytics receives categorical outcomes only.
- Protect comparison inputs until hydration completes so early edits are not silently overwritten. Fix map-hub ad-slot React keys without changing inventory.

## Protection contract

The existing canonical/legacy route contract, homepage section ordering, language-priority traffic entries and ad configuration are unchanged. New links use deployment-aware paths, including the auxiliary Pages prefix. New UI is supplied for all eight supported locales. Public content does not include private analytics exports.

## Evidence and data limits

POI provenance and MIT attribution are in `public/licenses/apollyon-map-data.txt`; coordinates are normalized to full source tile bounds. No third-party terrain/CDN dataset is copied.

Licensed elevation/obstruction data, a complete measured current-build weapon dataset, hidden-achievement unlock evidence and a realtime room backend remain dependencies. This release does not claim terrain-aware ballistics, an automatic authoritative TTK model, verified hidden-achievement conditions or realtime squad synchronization.

Desktop/mobile browser checks cover calibration agreement, low-arc correction, measured TTK, saved/share restoration, localization and overflow. File E2E verifies a calibrated imported mission, exported data roundtrip and rejection of malformed replacements.

## Candidate validation

- Full Vitest suite: 209 files and 1,991 tests passed.
- Content validation: 65 files and 479 tests passed.
- ESLint, TypeScript and whitespace checks passed.
- Production webpack build generated 1,355 routes successfully.
- Production-build browser suite: 76 tests passed, including eight-language calibration, phone touch placement, file import/export, loadout/comparison sharing, homepage structure, ad delivery/inventory, Clarity boundaries and route metadata.
- Final editorial review clarified the distinct Discord invite and historical Steam verification dates in English and Polish. No route, feature or layout changes followed browser acceptance.

Production revision, full URL contract, IndexNow and auxiliary export results are recorded in the post-deployment receipt. Candidate acceptance alone is not proof of a completed deployment or search indexing.

## Production receipt and follow-up

Content and tools deployed as `6283ab1fe0ca74d65a7988a33c43c4b74fea21fe`; the public revision endpoint confirmed this commit. Production verification passed 4,201 checks: 1,336 canonical pages, 2,862 legacy routes, the known clean 404, revision and sitemap. Existing homepage/ad protection assertions passed.

IndexNow accepted the 1,336 selected URLs. The initial sequential job confirmed 400; the remaining 936 were submitted through the official JSON batch endpoint, returning HTTP 200 at 2026-10-09T04:44:35Z. The original snapshot was archived only after successful receipt. Acceptance does not prove indexing.

The live browser suite passed 41 of 42 tests initially. The remaining assertion incorrectly counted safe `update:true` context commands as repeated initialization. Stronger transport checks then found a separate pre-existing defect: automatic history page views could still include private query values despite sanitized config commands. A follow-up adapter sanitizes the observed Google history dataLayer URL fields before processing, while retaining automatic page views and the actual browser share URL. Exact vendor-transport verification confirmed three genuine navigations produced three page views with clean locations/referrers. This is a tested adapter for observed vendor fields, not a guarantee about all third-party events; the live regression remains necessary.

The auxiliary Pages export passed the build and all nine browser tests after fixing an obsolete assertion that prohibited an existing labelled Smartlink. Its replacement checks a single configured, labelled CTA, safe new-window attributes and user-initiated opening with the destination locally intercepted. No real ad click was sent. No production CNAME was emitted; revision and search API export paths were verified.

Follow-up candidate validation: all 210 unit-test files / 1,997 tests and all 479 content checks passed. The production webpack build generated 1,355 routes with TypeScript validation. ESLint and whitespace checks passed. Pages-test array accesses were made explicit for TypeScript's unchecked-index protection; exact one-slot/one-link assertions remain in place. No additional content or sitemap changes are included in this analytics/test follow-up, so the already-accepted IndexNow URL batch is not repeated.
