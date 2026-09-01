# WARDOGS September Live-Ops Content Refresh Design

## Goal

Publish a source-audited September 2 test update, close the progression and community-server search gaps, add current creator-video coverage, and deploy the complete six-language release.

## Current Event Contract

- Describe September 2, 2026 at 17:00 UTC as a limited Firing Range and backend/login-queue test.
- State that the developer may run a handful of servers for the evening but did not promise availability.
- Never describe the event as an open beta.
- Keep September 3 at 18:00 UTC as the confirmed FPS Games Show broadcast and September 10 as the Steam Early Access date.
- Publish local conversions for the six site audiences: 18:00 BST, 19:00 CEST, 20:00 MSK, 14:00 BRT, September 3 at 02:00 JST, and September 3 at 01:00 China Standard Time.

## New Guides

1. `wardogs-progression-wipes-guide` explains the six role tracks, the deliberately compressed Closed Beta progression, tanks moving to the Driver track for Early Access, and the current unknowns around wipes, seasons, and carryover.
2. `wardogs-community-servers-guide` explains the two approved launch hosting providers, the absence of arbitrary self-hosting at launch, planned RCON tooling, day-one map/mode controls, and the warning against unofficial server preorders.

Both guides must clearly separate confirmed statements from unconfirmed launch details, contain at least two source links, answer the primary query immediately, and exist as independent local-language documents for `en`, `de`, `ru`, `pt-br`, `ja`, and `zh-cn`.

## Existing Guide Refresh

Update `wardogs-beta`, `wardogs-playtest`, `wardogs-download`, `wardogs-preload`, `wardogs-launch-checklist`, and `wardogs-livestream` in every locale. Each page receives a current status block, an updated date, the official September 2 social source, and language-appropriate wording that distinguishes the limited test from an open beta.

## Video Coverage

Add maintained video articles for the current release-news overview, Support skill guide, Kamikaze Drone field report, and broad gameplay overview. Creator claims remain build-sensitive and must link readers to maintained internal guides for current facts.

## Discovery and Release

- Add both guide keywords to the existing manifest and six-language sitemap matrix.
- Add a September 2 item to the news timeline and surface the live test in the current-status home data.
- Preserve the current AdSense-only advertising implementation.
- Run focused RED/GREEN content tests, the full test suite, lint, typecheck, production build, and representative desktop/mobile checks.
- Push the verified branch to production, verify public routes and sitemap entries, then send the changed URLs through IndexNow.

## Source Rules

Prefer official WARDOGS, Steam, BULKHEAD, Team17, and directly linked developer posts. Creator and community sources may document observed behavior or preserve a developer transcript, but they cannot turn an unknown launch value into a confirmed fact.
