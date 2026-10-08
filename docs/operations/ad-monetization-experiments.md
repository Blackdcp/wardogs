# Ad monetization experiment ledger

Keep each configuration version stable for its measurement window. This ledger records deployment scope and interpretation; private GA4 and Adsterra exports belong in the uncommitted traffic baseline directory described in the [release runbook](traffic-protected-release-runbook.md).

## native-first-v1

| Field | Value |
| --- | --- |
| Configuration version | `native-first-v1` |
| Baseline revision | `ac9fcae104cb957e2aafd53e9e3d69bf47ac0b20` — active Adsterra loader migration |
| Intended rollout date | 2026-10-06 |
| Production rollout UTC timestamp | Record from the successful production revision check in the private release receipt |
| Production revision | Record `/api/revision` alongside this configuration in the private release receipt |
| Status | Evaluate only after the production revision and `data-ad-config="native-first-v1"` have been verified |
| Assignment | All eligible production page visits; no random assignment |
| Placement variable | Native precedes the existing 300×250 rectangle inside the same inline block |
| Primary hypothesis | Removing the preceding rectangle from the scroll path increases the share of eligible page visits reaching Native |

The eight affected templates are:

| Template | Route pattern | Existing inventory block |
| --- | --- | --- |
| Home | `/{locale}` | `home`, inside `proven-demand` |
| Guide index | `/{locale}/guides` | `guides` |
| Catalogue index | `/{locale}/items` | `items` |
| Catalogue type index | `/{locale}/items/{type}` | `item-type` |
| Video index | `/{locale}/videos` | `videos` |
| Maps index | `/{locale}/maps` | `maps` |
| Tactical map | `/{locale}/tools/map` | `tools-map` |
| Artillery calculator | `/{locale}/tools/artillery-calculator` | `tools-artillery` |

All eight locales (`en`, `ru`, `de`, `pt-br`, `ja`, `zh-cn`, `zh-tw`, `pl`) use the same template change. Zone IDs, slot counts, feature flags, labels, public URLs, and the surrounding content order stay unchanged. Guide, item, and video detail pages already place Native before the rectangle; their placement stays unchanged. No disabled ad format is enabled.

The rollout also changes runtime delivery measurement, route attribution, and selected English guide links/content. It is a combined release, not a randomized placement experiment. The baseline loader migration has its own short measurement window. A change in total revenue or RPM cannot be attributed causally to Native ordering from this before/after comparison.

## Measurement and interpretation

- Record the deployed revision, exact UTC boundary, production hostname filters, and GA4 custom-dimension registration times. Treat partial rollout days and dimension-processing delays separately from complete observation days.
- Use `ad_status` to diagnose slot eligibility, script delivery, creative presence, and visibility using the definitions in the deployed runtime. These events are not vendor impressions, CPM, or revenue.
- Compare Native delivery and visibility by template, locale, country, and device. Evaluate the rectangle as a guardrail because exchanging order can affect its visibility. Use one consistent eligible-page denominator; report unavailable when it cannot be established reliably.
- Use Adsterra for impressions, CPM, and revenue by the available zone/country/device dimensions over matching complete UTC dates. Reused zone IDs do not establish per-template revenue. Do not assign zone revenue to a template without a valid mapping.
- Preserve the earlier and later export windows, sample sizes, segmentation, configuration version, and source limitations. Check production behavior immediately, then compare complete seven-day windows when available. A short or incomplete window is diagnostic evidence, not a revenue conclusion.
- Validate slot counts and Native-before-rectangle order across the eight templates and locales. Check representative mobile and desktop layouts for overflow, content obstruction, and working primary actions. Record browser evidence alongside runtime delivery checks.

GA4 reports and explorations require event-scoped custom dimensions for custom parameters; verify the exact parameter names emitted by the deployed runtime, including `placement`, `format`, `status`, and `locale`, plus `config_version`, `page_type`, and `ad_unit` for configuration/template/zone segmentation. Google documents a 24–48 hour availability delay after collection and registration. [Event parameter setup](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters) · [Event-scoped custom dimensions](https://support.google.com/analytics/answer/14239696?hl=en).

A rollback of this placement variable restores rectangle-before-Native only in the eight listed blocks. Keep verified delivery fixes and measurement improvements unless separate evidence identifies a problem in them. Record every subsequent configuration revision as a new ledger entry instead of silently changing `native-first-v1`.

## task-aware-v2

| Field | Value |
| --- | --- |
| Configuration version | `task-aware-v2` |
| Baseline revision | `7f97cde6e07aefa8f70356c479d9a68422f2adc6` |
| Intended rollout date | 2026-10-08 (Asia/Shanghai) |
| Assignment | All eligible visits; a new operational baseline, not a randomized A/B test |
| Vendor inventory | Existing approved Native and six display units; same keys and loader URLs |
| External changes | No new advertising code applications, new networks, or format activation |
| Release boundary | Record production revision and exact UTC verification time in private `.tmp` receipt |

The release separates consecutive inline ads with useful content, places tool rectangles alongside sufficiently wide workspaces or directly after narrower workspaces, and preserves homepage sections, routes, translated content and per-page inventory. Mobile inventory remembers dismissal for the browser session and temporarily avoids menus, dialogs, keyboards, fullscreen, and intersecting tool controls. Temporary suppression retains the existing creative; it does not refresh the vendor request.

Deep slots begin their first request within 600px of the viewport while the page is in the foreground. Display scripts retain their serialized global configuration lease. `queued`, `loader_wait` and `loader_stalled` diagnose the loading chain; a timeout never unlocks the queue or counts as no-fill. A confirmed delivery failure or missing creative can show clearly labelled first-party navigation in the reserved inline space. This fallback is outside the vendor observer, generates no ad impression, and yields to late creative evidence.

### Measurement contract

- Primary outcomes: vendor total USD revenue and revenue per 1,000 all measured sessions, aligned to complete UTC days. Missing session denominators remain unavailable; do not substitute GA event counts or only visitors who saw an ad.
- Keep historical `placement` values. `section` (already registered in GA4) adds a stable `page_type:placement` identifier to `ad_status` and `ad_dismiss`. `page_type` distinguishes `map_tool` and `artillery_tool`. No visitor input, coordinates or share queries are collected.
- Shared vendor IDs remain shared. These fields diagnose delivery by page but **do not allocate vendor dollars by page or position**. The user has chosen to keep the existing codes rather than request separate ones.
- GA4's property calendar is UTC+8; the vendor's is UTC. Vendor October 8 is GA local October 8 08:00 through October 9 07:59. Align exports before calculating cross-platform ratios, and document measurement/consent coverage.
- Guardrails: functional search and tools, no obstructed controls, no accidental navigation, continued guide discovery, return visits, and real-user performance. A longer session is not automatically a better session.
- No revenue effect can be attributed to an individual change in this combined release. Keep a stable baseline before testing another commercial variable. Low daily revenue and rounded exports require more than a one-day comparison.

### Operational report

Run `npm run ads:report -- .tmp/private-snapshot.json`. Input is a private JSON object with `domain: "wardogswiki.com"`, `currency: "USD"`, `timezone: "UTC"`, and `daily` rows containing `date`, `impressions`, `revenue`, `completeUtcDay`. It excludes unfinished dates and computes weighted CPM from total revenue and impressions rather than averaging daily CPM.

Optional `sessionsByUtcDate` entries must include `windowStart` and exclusive `windowEnd` as midnight UTC ISO strings, `scope: "all_measured_sessions"`, `hostname: "www.wardogswiki.com"`, and the deduplicated `sessions` count for that exact window. Do not sum overlapping hourly unique-session reports. The report rejects mismatched boundaries and leaves aggregate session RPM null if any included date lacks an aligned denominator. Revenue and reports remain private and are never committed.

### Next controlled comparison using existing codes

After this baseline stabilizes, change one layout variable at a time on a documented page group. Without separate revenue identifiers, an alternating schedule using the same existing zones can provide a weaker site-level comparison: pre-register equal complete UTC windows covering the same weekdays and keep the rest of the configuration stable. Label it observational, account for country/device changes, and do not present GA visibility as a randomized dollar lift. Promote changes only when the total-income signal and task/retention guardrails agree; keep results inconclusive when sample size is inadequate.

## format-expansion-v3

The owner requested an immediate expansion after reviewing `task-aware-v2`; its
short observation period is not evidence that placement optimization succeeded
or failed. This release adds voluntary Smartlink monetization across the eight
locales and eligible desktop inventory using existing distinct display codes.
It does not duplicate a zone to manufacture additional placements.

See [the format rollout contract](ad-format-rollout.md) for placement, behavioral
eligibility, supplier verification gates, and rollback. Social Bar, Popunder,
and interstitials must be reported separately as prepared, eligible, requested,
or verified live. A disabled supplier-verification gate means no script is
requested, even when the experiment implementation's policy switch is enabled.

`ad_exposure` means the voluntary Smartlink CTA is at least half visible in a
foreground page; `ad_click` means a trusted visitor activation. Neither event is
a vendor impression, a successful destination visit, or attributed revenue.
They reuse `section`, `page_type`, `placement`, `ad_unit`, `locale`, and
`config_version`, without recording sponsored URLs or query strings. Record
the activation date of each vendor format separately from the v3 deployment.

The simultaneous layout and Smartlink expansion is a new combined baseline.
Do not report a randomized dollar lift from it. Behavioral cohorts, when
verified and enabled, permit comparison of site engagement outcomes, but shared
display/native revenue IDs do not yield clean per-cohort total revenue.
