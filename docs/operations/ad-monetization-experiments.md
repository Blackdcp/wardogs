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
