# WARDOGS Content Research - 2026-09-16

Coverage window: **2026-09-13 → 2026-09-16** (the two days since the last deployed refresh).

## Baseline Discrepancy (read first)

- GitHub `main` HEAD is `8513815` (2026-09-05): 48 guide slugs, `current-event` = `closed-beta-02`, public status `schemaVersion: 1`, `dataAsOf: 2026-09-05`.
- The live site `https://www.wardogswiki.com/api/status.json` reports `schemaVersion: 2`, `dataAsOf: 2026-09-13`, `currentEvent` = `early-access-patch-0-11`, and the sitemap lists **50** guide slugs per locale, including two that do not exist in `main`:
  - `wardogs-server-status`
  - `wardogs-patch-notes`

Conclusion: roughly one week of work (2026-09-06 → 2026-09-13) exists on the deploying machine but is **not on GitHub**. Any refresh must be applied on top of that newer state, not on top of `main`.

## Method

1. Official Steam store, Steam news, and BULKHEAD/Team17 statements establish dates, patches, and policy.
2. Official X posts establish sales milestones and in-flight design decisions.
3. Press (PC Gamer, GameSpot, RPS, PCGamesN) may carry attributed developer quotes; it is never used as a storefront fact and is **not an approved citation host** for guide frontmatter.
4. Reddit and Discord document observed player problems; always labeled community observation.
5. Competitor pages are used only to find unanswered questions. Their wording is never copied.
6. Every build-sensitive number is labeled as Early Access and tells the reader to verify in the current client.

## Approved-Host Source Candidates

Only these hosts pass `src/content/source-policy.ts`: `store.steampowered.com`, `steamcommunity.com`, `team17.com`, `bulkhead.com`, `youtube.com`, `youtu.be`, `twitch.tv`, `discord.com`, `x.com`, `reddit.com`, `support.microsoft.com`, `pcgamer.com`, `wardogs100k.com`.

| Fact | Source (approved host) | Date |
| --- | --- | --- |
| Scheduled maintenance + Patch 0.11 | `https://store.steampowered.com/news/app/1867240/view/1843481262698449` | 2026-09-14 |
| Launch Stability Hotfix #1 | `https://store.steampowered.com/news/app/1867240/view/701027323413004709` | 2026-09-11 |
| Pre-Load Live + Season 1 changelog | `https://store.steampowered.com/news/app/1867240/view/701027323413004455` | 2026-09-09 |
| Steam news hub (player-count posts) | `https://store.steampowered.com/news/app/1867240` | rolling |
| 2M copies sold | `https://x.com/WARDOGS` | 2026-09-15 |
| Team-switching design fix in progress | `https://x.com/Brammflakes` | 2026-09-13 |
| Community reports (team switching, FOB doors) | `https://www.reddit.com/r/WarDogs/` | 2026-09-13 → 09-15 |
| Store / Early Access baseline | `https://store.steampowered.com/app/1867240/WARDOGS/` | rolling |

Not usable as frontmatter sources (not on the approved list): SteamDB, GameSpot, RPS, PCGamesN, Eurogamer, allkeyshop, 163.com. Their content may inform editorial judgment only.

## Verified Timeline

- **2026-09-10** — Early Access opens on Steam ($39.99, stepped pricing). Login queue collapses: system designed for 100 admissions/second delivered about 10; at one point 45,590 players in-game with ~168,000 waiting. Repeated DDoS attacks reported on day one.
- **2026-09-11** — 1.25M copies sold in 24 hours; peak around 340k concurrent. Launch Stability Hotfix #1 refreshes Steam login tickets at the front of the queue instead of at client start; players admitted in waves of 10,000. Zero-tolerance anti-cheat false-bans legitimate alpha testers, including Shroud and Summit1g (manual moderation error); bans reversed. ~11 streamers were given queue priority — BULKHEAD publicly owned the decision.
- **2026-09-13** — New all-time peak **428,666 concurrent** on Steam (SteamDB; 4th most-played game on the platform). Joe Brammer confirms a design fix for mid-match team switching is being decided.
- **2026-09-14 08:00 UTC, ~1 hour** — Scheduled maintenance ships **Patch 0.11**:
  - Server browser front end split into **Official** and **Community**.
  - Filtering removed from Official; text search added to Community.
  - **Community server IDs now persist** across matches and restarts (longer IDs, for security reasons).
  - `Show Empty/Full` added to the quick bar; Host button points at the correct location.
  - Server names must be alphabetical; no more than one consecutive space.
  - Apology bonus: **+5% End of Match cash on community servers for one week**.
  - Cash exploits fixed, GPU crashes addressed, **Asia server capacity increased**.
  - Economy-abuse policy: cash/XP reset to 0 + timed ban for exploits; **permanent ban** for XP farming and for content that tutorialsises exploits; "we track every server you enter".
  - Still coming: server favoriting, tiered priority queues, MOTD prompt, improved warmup, AFK kick disable during seeding, team-switching controls.
- **2026-09-15** — **2,000,000 copies sold** in five days, confirmed by the official WARDOGS X account. First day 1.25M. Steam review sentiment recovered from Mixed to **Very Positive** (~35,000 reviews, roughly 85% positive per secondary reporting — verify before publishing an exact percentage).

## Standing Facts For This Refresh

- Early Access launched 2026-09-10; expected duration 1–2 years; price is planned to rise as content ships.
- 100 players, 3 teams, 2 x 2 km randomized Control Zone on a large map; first team to 100 points wins.
- $10,000 respawn budget; persistent cash across matches; support actions pay.
- Console: PS5 and Xbox in **2028**, wishlisting open. Treat as announced, not as a dated release.
- No in-game cash sales or monetized camo during Early Access.
- $100K Clip Contest is live (wardogs100k.com).

## Per-Guide Impact (ordered by priority)

| # | Slug | What must change |
| --- | --- | --- |
| 1 | `wardogs-patch-notes` (live only, new in 0.11 cycle) | Add the 0.11 entry with the full change list and the 2026-09-14 08:00 UTC maintenance window; mark the community cash bonus as time-limited (one week from 09-14). |
| 2 | `wardogs-server-status` (live only) | Maintenance is **completed**, not scheduled. Replace the countdown with "last maintenance 2026-09-14, patch 0.11 deployed". Keep WD-L014 and queue symptoms but re-label as historical/live-mitigated. |
| 3 | `wardogs-known-issues` | Still says "Closed Beta 02" and a Sept 3–6 window. Rewrite the access window for Early Access; add: queue/status resolved by Hotfix #1, false bans reversed with no player action, GPU crash work in 0.11, team switching as a known abuse vector pending a design fix. |
| 4 | `wardogs-community-servers-guide` | Highest-value rewrite: Official/Community split, persistent IDs, text search, Show Empty/Full, alphabetical naming rule, one-space rule, +5% cash bonus window, and the anti-XP-farming enforcement warning. |
| 5 | `wardogs-early-access` / `wardogs-release-date` | Add launch outcome: 2M sold, 428,666 peak, 1–2 year EA window, price step planned. |
| 6 | `wardogs-launch-checklist` | Post-launch checklist: maintenance awareness, community-server bonus window, what to do if falsely banned, exploit-reporting rules (report, do not publish tutorials). |
| 7 | `wardogs-steam` / `wardogs-price` | 2M sales milestone, top of Steam global top sellers for the week of 8–15 Sep, current $39.99 with a stated future increase. |
| 8 | `wardogs-money-guide` | Add the 5% community-server bonus and the exploit-enforcement section (cash/XP reset to 0, permanent bans). |
| 9 | `wardogs-fob-guide` | Community etiquette now widely discussed (closed doors/gates); team-switchers can dismantle FOB defenses from inside — frame as a reported behavior pending the official fix. |
| 10 | `wardogs-progression-wipes-guide` | Tie wipes to the new enforcement policy: cash/XP reset to 0 is now an explicit penalty, separate from any seasonal wipe. |
| 11 | `wardogs-100k-clip-contest` | Keep live; avoid publishing exploit footage — tutorialising exploits is a permanent-ban offense. |
| 12 | `wardogs-crash-fix` / `wardogs-best-settings` | 0.11 addresses GPU crashes; note that driver-level advice still applies. |
| 13 | `wardogs-ps5` | Console 2028 is confirmed by BULKHEAD's launch announcement; the "not confirmed" status on the home Confirmed-vs-Rumor block should be revisited. |
| 14 | `wardogs-playtest` / `wardogs-beta` / `wardogs-alpha` | Historical only. Ensure no page still implies an upcoming test. |

## Data Layer Changes

- `src/features/live-ops/current-event.ts`: `id` → `early-access-patch-0-11`, `status` live, `phase` early-access, `launchedOn` 2026-09-10; keep Closed Beta 02 as a historical entry.
- `src/features/live-ops/public-status.ts`: `dataAsOf` → 2026-09-16, `schemaVersion` 2, maintenance **completed**, add patch version, add `sources` for the 0.11 post, the stability hotfix, and the official sales post.
- `src/features/news/news-data.ts`: add 2026-09-11 (stability hotfix), 2026-09-14 (patch 0.11), 2026-09-15 (2M sales); move beta/playtest items into a historical group.
- `src/features/home/home-data.ts`: `CONFIRMED_RUMOR_ITEMS` — beta items are stale; promote Early Access live, patch 0.11, and the 2M milestone.
- `messages/*.json`: headline copy for the live-status band in all six locales.

## Do Not Claim

- An exact current review percentage without checking the Steam store page on the day of publication.
- Any player-count number attributed to this wiki as an official figure; label SteamDB-derived numbers as third-party measurement.
- A Patch 0.12 date, a Season 2 date, or a console release date.
- That team switching is fixed — it is confirmed as a known issue with a design fix "being decided".
