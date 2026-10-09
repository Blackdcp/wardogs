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
