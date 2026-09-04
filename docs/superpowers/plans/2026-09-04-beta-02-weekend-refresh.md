# WARDOGS Closed Beta 02 Weekend Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish and deploy the complete six-language Closed Beta 02 weekend update, contest and troubleshooting coverage, catalogue truth labels, and technical SEO fixes.

**Architecture:** Add one typed current-event contract consumed by home and guide surfaces, while retaining localized MDX as the searchable long-form source. Extend the existing keyword manifest for new guides and keep all visuals in the source-audited catalogue pipeline.

**Tech Stack:** Next.js 16, TypeScript 6, next-intl, MDX, Vitest, Playwright, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-04-beta-02-weekend-refresh-design.md`

## Global Constraints

- Support exactly `en`, `de`, `ru`, `pt-br`, `ja`, and `zh-cn` without English-body fallback.
- Use September 3 at 18:00 UTC through September 6 at 08:00 UTC for Closed Beta 02.
- Never call Closed Beta 02 an open beta or publish unverified Twitch reward details.
- Label community fixes and pre-release numerical values as build-sensitive.
- Preserve AdSense-only advertising and existing consent behavior.

---

### Task 1: Failing Release Contract

**Files:** Create `tests/content/beta-02-weekend-refresh.test.ts`; modify focused unit tests only where the approved contract changes.

- [ ] Assert the typed event dates, access rules, completed-show status, two new guide slugs, six-language content, current home links, and stale-copy exclusions.
- [ ] Assert the catalogue disclosure, meaningful hero alt text, short metadata fixes, and absence of Adsterra identifiers.
- [ ] Run the focused test and confirm it fails for the missing release.

### Task 2: Current Event And Home

**Files:** Create `src/features/live-ops/current-event.ts`; modify home/news data, home components, guide layout, and six message files.

- [ ] Publish a compact localized live-status band with access, end time, Early Access date, and direct links.
- [ ] Reorder the home journey around Play Now, Download, Controls, Known Issues, Contest, and current catalogue tasks.
- [ ] Replace every upcoming-show or ended-beta headline shown by the home and news interfaces.

### Task 3: Six-Language Contest And Known Issues

**Files:** Modify `keywords.json` and manifest expectations; create twelve localized MDX files.

- [ ] Publish the official contest steps, prize distinction, deadline, announcement timing, unlimited-submission note, and country-restriction warning.
- [ ] Publish official server-browser and VOIP checks plus conservative crash, performance, anti-cheat, and support escalation guidance.
- [ ] Add both pages to discovery, related links, sitemap, and AI citation surfaces.

### Task 4: Core Search Journeys

**Files:** Modify affected localized beta/playtest/download/launch/livestream pages and current English settings, crash, controls, PS5, factions, and Twitch pages.

- [ ] Put the live Beta 02 answer first and preserve old events as history.
- [ ] Convert the livestream page into a recap and contest entry route.
- [ ] Refresh current-build troubleshooting, platform FAQ, faction visuals, and Twitch verification language.

### Task 5: Catalogue, SEO, Analytics, And Advertising

**Files:** Modify catalogue UI/data, home image semantics, legal/item metadata, analytics tests, and advertising strings where needed.

- [ ] Verify every published catalogue record has an existing image, useful alt, source record, and build label.
- [ ] Add a visible current-build warning and faction visual references without claiming Beta 02 values.
- [ ] Lengthen Bing-flagged metadata, remove obsolete sponsored copy, and verify analytics does not emit duplicate page views.

### Task 6: Verification And Release

**Files:** Change only scoped defects exposed by verification.

- [ ] Run focused RED/GREEN tests, `npm run content:validate`, `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- [ ] Inspect representative desktop and mobile pages and verify catalogue images are nonblank and nonoverlapping.
- [ ] Commit, push, deploy, verify production routes/sitemaps/ads.txt/AdSense, and submit changed URLs through IndexNow.
