# Weekend Season 1 Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an accurate, source-labelled Season 1 weekend refresh across the live status layer, homepage, core guides, and YouTube library.

**Architecture:** Keep the existing six-locale MDX and message architecture. Treat `CURRENT_EVENT` as the shared current-state record, let the public status API and widget consume it, and keep build-sensitive creator evidence below first-party facts. Reuse existing guide URLs and video article structures to preserve rankings and internal links.

**Tech Stack:** Next.js 16.3 App Router, TypeScript 6, next-intl, MDX, Vitest, Vercel, IndexNow.

**Spec:** `docs/superpowers/specs/2026-09-17-weekend-season-1-refresh-design.md`

## Global Constraints

- Support `en`, `de`, `ru`, `pt-br`, `ja`, and `zh-cn`.
- Do not turn creator or community observations into official facts.
- Preserve existing canonical guide URLs.
- Use `2026-09-17` only on materially rechecked pages.
- Keep the work on the existing clean `codex/adsense-migration` branch, matching the user's established direct-push workflow.

---

### Task 1: Current-State Contract

**Files:**
- Modify: `tests/content/early-access-handoff.test.ts`
- Modify: `tests/unit/status-route.test.ts`
- Modify: `tests/unit/status-widget-route.test.ts`
- Modify: `src/features/live-ops/current-event.ts`
- Modify: `src/features/live-ops/public-status.ts`
- Modify: `src/app/embed/status/route.ts`

**Interfaces:**
- Produces: `getPublicStatus()` with `dataAsOf: "2026-09-17"` and a passed maintenance window.
- Consumes: existing `CURRENT_EVENT` fields and public status route.

- [ ] **Step 1: Write failing tests** asserting the September 14 window is no longer `scheduled`, the data date is September 17, and the widget no longer advertises an upcoming countdown.
- [ ] **Step 2: Run the three focused test files** and confirm failures mention the old September 13/scheduled state.
- [ ] **Step 3: Update the shared event, API payload, source labels, and widget** with a passed-window state and Patch 0.11 as the latest announced update.
- [ ] **Step 4: Re-run the focused tests** and require zero failures.

### Task 2: Homepage, News, and Sitemap

**Files:**
- Modify: `tests/unit/home-data.test.ts`
- Modify: `tests/unit/sitemap.test.ts`
- Modify: `src/features/home/home-data.ts`
- Modify: `src/features/news/news-data.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `messages/{en,de,ru,pt-br,ja,zh-cn}.json`

**Interfaces:**
- Produces: homepage priorities led by beginner, money, progression, loadouts, community servers, and current issues.
- Produces: September 15 official milestone in the news list and September 17 hub last-modified values.

- [ ] **Step 1: Write failing homepage and sitemap assertions** for the new priority order, 50-guide count, milestone, and hub date.
- [ ] **Step 2: Run the focused tests** and confirm the old launch/preload order fails.
- [ ] **Step 3: Update shared data and all locale messages** without changing the page layout.
- [ ] **Step 4: Re-run focused tests** and require zero failures.

### Task 3: Six-Locale Current Copy

**Files:**
- Modify: current-status and launch-era guides under `content/{locale}/guides/`
- Modify: content consistency tests that encode the prior September 13 snapshot.

**Interfaces:**
- Produces: no localized guide that describes September 14 maintenance as future.

- [ ] **Step 1: Add a failing content test** that scans all six locales for future-tense September 14 maintenance language and expects none.
- [ ] **Step 2: Run the new test** and confirm it fails on the existing stale files.
- [ ] **Step 3: Replace future-tense status blocks and materially refresh the affected page summaries** in all locales.
- [ ] **Step 4: Update date assertions only for changed documents** and rerun content validation.

### Task 4: Core Weekend Guides

**Files:**
- Modify: `content/{locale}/guides/wardogs-beginner-guide.mdx`
- Modify: `content/{locale}/guides/wardogs-money-guide.mdx`
- Modify: `content/{locale}/guides/wardogs-progression-wipes-guide.mdx`
- Modify: `content/{locale}/guides/wardogs-best-weapons-loadouts.mdx`
- Modify: `content/{locale}/guides/wardogs-community-servers-guide.mdx`
- Modify: `content/{locale}/guides/wardogs-map.mdx`
- Modify: related content tests.

**Interfaces:**
- Produces: current Season 1 answers at existing canonical URLs.

- [ ] **Step 1: Write failing content assertions** for six role tracks, official Season 1 XP bands, the three named hosts, the community-server bonus, current-build loadout language, and community-tool evidence labels.
- [ ] **Step 2: Run the focused tests** and confirm each missing/currently wrong fact fails.
- [ ] **Step 3: Refresh English guide bodies and source ledgers**, separating official facts, community observations, and unknowns.
- [ ] **Step 4: Add materially equivalent localized current sections** in the other five locales.
- [ ] **Step 5: Re-run content validation** and require zero failures.

### Task 5: YouTube Library Refresh

**Files:**
- Modify: `tests/unit/video-library.test.ts` or the closest existing video-library test.
- Modify: `src/features/videos/video-library.ts`
- Modify: `src/features/videos/video-localization.ts` if new labels require localization.

**Interfaces:**
- Produces: version-labelled video articles and a current weekend subset.

- [ ] **Step 1: Add failing assertions** that promoted video entries carry a current/Beta/historical build label and a checked date.
- [ ] **Step 2: Run the focused test** and confirm legacy unlabeled entries fail.
- [ ] **Step 3: Reclassify existing promoted videos and add only sourceable recent videos** for the approved high-intent subjects.
- [ ] **Step 4: Re-run video tests and video sitemap tests** and require zero failures.

### Task 6: Verification and Publication

**Files:**
- Modify only files required by verification failures that reflect intended behavior.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: tested commit, pushed branch, Vercel deployment, and IndexNow submission.

- [ ] **Step 1: Run `npm run content:validate`.**
- [ ] **Step 2: Run `npm test`.**
- [ ] **Step 3: Run `npm run typecheck`, `npm run lint`, and `npm run build`.**
- [ ] **Step 4: Inspect `git diff --check` and the final changed-file list.**
- [ ] **Step 5: Commit and push the existing branch.**
- [ ] **Step 6: Verify the production homepage, status API, sitemap, feed, and representative localized guides.**
- [ ] **Step 7: Submit the changed canonical URLs through `scripts/submit-indexnow.mjs`.**
