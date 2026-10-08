# Ad format rollout: format-expansion-v3

Baseline: `8ec6e93d1fa35acae9c4523020493826823b61d4` (`task-aware-v2`).
The release uses existing publisher zones, verified in the Adsterra dashboard on
2026-10-08. Backend `Active` means a zone is available; it does not mean the site
currently serves that format. Record the actual release SHA and UTC time in the
private release receipt.

## Inventory and activation

| Format | Release behavior | Publisher zone |
| --- | --- | --- |
| Native | Preserve one unit per page and useful content before/after it | 30787582 |
| Display | Preserve current inventory; add eligible desktop 468×60 content slots and a 1440–1599px tool rail | Existing six zones |
| Smartlink | One clearly labelled voluntary sponsored CTA per supported page, after useful content; eight localized labels | 30799642 |
| Social Bar | Separate 10% desktop content experiment; activation requires supplier configuration verification | 30799640 |
| Popunder | Separate 5% desktop content experiment; activation requires supplier configuration verification | 30799641 |
| Interstitial | Not a separate ready-to-use dashboard code. Keep outside the initial Social Bar experiment | Social Bar subformat |

Do not duplicate a display code on a page to simulate additional inventory.
Desktop supplemental slots use an otherwise unused size; request accounting
prevents resize from repeatedly requesting a zone on the same page. Mobile keeps
its dismissible banner and gains the voluntary sponsored CTA, without another
overlay competing for the same space. The homepage retains its six sections.

## Behavioral experiment gates

The site gate and the vendor gate are independent. The site restricts eligibility
by content-detail route, desktop device, reading time, depth, and prior content
navigation. Social Bar and Popunder use disjoint browser assignments; tools,
homepages, hubs, policy pages, and mobile visits are excluded. Missing browser
storage fails closed. A loaded behavioral script needs a full document boundary
when navigating away: removing a script element alone does not remove listeners,
timers, or creatives installed by that script.

`ADSTERRA_SOCIAL_BAR_VERIFIED` and `ADSTERRA_POPUNDER_VERIFIED` remain false until
the supplier's real settings have been confirmed and browser behavior checked.
Local cooldowns describe **script-load attempts**, not vendor ad displays. The
requested supplier settings are one exposure per visitor per 24 hours, a small
closable Social Bar creative with interstitials excluded, and a Popunder that
preserves the original page. Do not infer these settings from a successful script
load or from the dashboard's Active label. An eventual interstitial experiment
must have its own recorded scope and exclude other interruptive formats.

Official references:
- [Publisher format overview](https://adsterra.com/ad-formats/)
- [Social Bar configuration](https://adsterra.com/blog/publishers-guide-to-social-bar/)
- [Popunder configuration](https://adsterra.com/blog/popunder-traffic-monetization/)
- [One distinct banner code per placement](https://adsterra.com/blog/how-banner-ads-make-money/)

## Acceptance and rollback

Verify Smartlink's single CTA, translated sponsored/new-tab explanation, correct
destination, `rel="sponsored nofollow noopener noreferrer"`, and view/click
events. Do not click live advertisements to test tracking; use local fixtures.
Check duplicate code prevention, long-guide section boundaries, 390px mobile,
1440px tool rail, and 1920px existing desktop inventory. Search, map controls,
calculator, menus, keyboard focus, and fullscreen remain usable.

Run the full unit/content suite, lint, type checking, production build, desktop
and mobile browser checks, and the production route contract. Record missing
vendor creative delivery separately from fixture/runtime success; a VPN failure
is not a sitewide fill-rate measurement.

Roll back an individual new format with its explicit policy switch. Keep Native,
existing display codes, and the last verified delivery fixes. A broken protected
URL or primary task uses the release runbook's production rollback procedure.

## Measurement

Use Adsterra billed impressions and USD revenue, and complete UTC-aligned GA
sessions, to calculate revenue per 1,000 sessions. Browser `ad_status`,
`ad_exposure`, and `ad_click` diagnose delivery and voluntary interaction; they
are not billed impressions or dollars. Keep page paths free of queries and do
not collect map coordinates, search terms, or share payloads in ad events.
An exposure is deduplicated within a mounted CTA's route observation; filtering
a catalogue can remount its slot. Use unique measured sessions for reach and
click-through analysis, rather than treating raw exposure event totals as visits.

Preserve a baseline export and exact rollout time. Compare complete periods by
country, device, and format; retain total revenue, session RPM, returning usage,
guide continuation, and tool completion. Shared banner zones do not allocate
revenue by page, placement, or experiment arm. The combined placement/Smartlink
release is not a randomized revenue-lift experiment. Do not claim incremental
profit from additional request counts alone.
