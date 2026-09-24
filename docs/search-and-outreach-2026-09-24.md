# Search visibility and targeted outreach — 2026-09-24

## `wardogs wiki` diagnosis

The owner's Google result screenshot shows `wardogs.wiki`, Wikipedia, Dexerto and Fandom above the visible fold; `wardogswiki.com` is not visible in that viewport. The same screenshot's Google Search Console card for **this query** reports, for the last seven days, 307 clicks (+121%), 1.76K impressions (+52%), and average position 6.2. Those seven-day aggregates do not reveal today's position, country, device, or which landing page earned each impression. They do rule out the claim that the query has produced no Google visibility over the full seven-day period.

Public search also still retrieves `https://www.wardogswiki.com/en` and individual item pages. Repository inspection confirms `robots.ts` allows all crawlers, `/en` is the intended canonical homepage, and the sitemap includes localized home and guide routes. This is not evidence that Google has chosen the same canonical or that every important URL is indexed; Search Console URL Inspection is the check for those questions.

The current strongest hypothesis is **query-specific competition and result volatility**, not a blanket technical deindex. Several independent near-name wiki domains now target the same query, and Wikipedia, Dexerto and Fandom have stronger established brands. This is a hypothesis, not a confirmed ranking cause. The dense global ad layout is a separate page-experience risk; the owner explicitly asked to leave ads unchanged for several days, so no ad change is included here.

Next GSC check when browser access works: Search results > Web > exact query `wardogs wiki` > compare the latest complete 7 days with the preceding 7 > inspect the Pages, Countries and Devices tabs. Split United States from Japan and Singapore. Check URL Inspection for `/en` and the exact Google-selected canonical, then compare search appearance and the most recent daily position against the seven-day average. Do not infer a penalty from a single personal SERP.

## Linkable asset now prepared

- [`/en/guides/wardogs-artillery-guide`](https://www.wardogswiki.com/en/guides/wardogs-artillery-guide): claim-by-claim Season 1 SPH-2 evidence ledger. Official Career 90 / $500,000 category unlock is separated from unverified repeat vendor cost, Alpha/Beta footage and the current player report.
- [`/en/guides/wardogs-helicopter-guide`](https://www.wardogswiki.com/en/guides/wardogs-helicopter-guide): current Havoc pilot report is labeled as a single player's evidence rather than a verified price list.

These are useful references for specific player questions, not a justification for mass-posting links.

## Outreach targets and boundaries

1. The [r/WarDogs Guides & Tools directory](https://www.reddit.com/r/WarDogs/wiki/guidesandtools/) is explicitly linked from the [community welcome thread](https://www.reddit.com/r/WarDogs/comments/1vtqdtm/welcome_to_rwardogs/). Ask a moderator whether a sourced SPH-2 guide fits; do not edit or imply moderator endorsement. The public wiki page could not be fetched through the research tool, so verify its current submission instructions before contacting anyone.
2. [r/WarDogs self-promotion policy](https://www.reddit.com/r/WarDogs/comments/1v0xa6h/self_promotion_update/) limits self-promotional posts to one per week and expects genuine community participation. Do not create a cross-post campaign or submit more than one promotional link per week.
3. The [current SPH-2 discussion](https://www.reddit.com/r/OfficialWARDOGS/comments/1wj2f29/sph_2/) is a good source for player questions and counter-evidence, but not a place to drop a generic site link. A factual answer should lead with the official-versus-player evidence distinction and disclose site ownership if linking the guide is welcomed.
4. Do not claim a Discord channel allows promotion until its rules are read in the signed-in UI. Browser access currently fails before tab inventory, so no Discord promotion is planned.

Draft for a moderator/resource submission, **not sent**:

> Hi — I maintain an independent WARDOGS guide site. I put together a source-by-source SPH-2 evidence table because the official Season 1 Artillery Tank unlock (Career 90, one-time $500,000) keeps getting confused with the repeat vehicle price. It labels Alpha/Beta captures and the recent player $8k report separately: https://www.wardogswiki.com/en/guides/wardogs-artillery-guide . Would this be useful in your Guides & Tools directory? If not, no worries; I don't want to add unwanted promotion.

No Reddit or Discord message was posted during this task. The signed-in browser connection failed with a request-header-policy error; this is not a missing user login.
