# Weekend Season 1 Refresh Design

## Objective

Bring WARDOGS Wiki from its September 13 launch-week snapshot to an accurate September 17 Season 1 reference before the weekend. Preserve existing URLs, source every current-state claim, and make the most useful player workflows easier to find than historical Beta access content.

## Evidence Boundary

- Official Steam announcements define release state, Patch 0.11, Season 1 progression changes, the September 14 maintenance window, the three approved hosting providers, the 400,000 concurrent-player milestone, and the September 15 two-million-copy milestone.
- Creator videos and community tools may demonstrate workflows or preserve build observations, but must carry a capture date and build label.
- Do not promote disputed weapon rankings, exact payout values, map availability, artillery tables, wipe schedules, or unlock tables as official facts.
- The September 14 maintenance window has passed. In the absence of a separate first-party completion notice, describe it as a passed published window and direct players to the official feed for live availability.

## Information Architecture

The homepage should prioritize current weekend intent in this order:

1. Beginner first-match route.
2. Money and recovery.
3. Season 1 progression and role tracks.
4. Weapons and affordable loadouts.
5. Community-server browser and bonus week.
6. Current issues and server checks.

Preload, Playtest, Alpha, and Beta history remain indexed but leave the primary homepage guide list.

## Content Scope

- Refresh current status, news, API, widget, sitemap hub dates, and homepage copy in all six locales.
- Refresh the existing beginner, money, progression, weapons/loadouts, community-server, and map/artillery content rather than creating overlapping URLs.
- Correct the community-host count from two to three and name QONZER, BisectHosting, and xREALM as listed by the official September 8 announcement.
- Add the two-million-copy milestone without inventing values hidden inside the announcement image.
- Make Patch 0.11 the latest announced update while separating shipped items from stated future work.

## YouTube Policy

Every retained or added video must be classified as one of:

- `Season 1 current`: recorded or rechecked against the live Early Access build.
- `Beta workflow`: still useful for a durable workflow, with current values explicitly unverified.
- `Historical`: useful only as archive context and not promoted as a current guide.

New videos should support high-intent subjects: first match, money, progression, community servers, weapons/loadouts, maps, logistics, or indirect fire. Video claims never override official sources.

## Publishing

Update localized page dates only when the localized body is materially updated. Generate current sitemap last-modified dates from the refreshed content, run the complete verification suite, push the existing `codex/adsense-migration` branch, deploy through the repository's existing Vercel workflow, and submit changed URLs through the existing IndexNow script.
