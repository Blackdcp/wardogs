# WARDOGS September Live-Ops Content Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the September 2 live-test update, two high-intent six-language guides, and four current video articles, then deploy and index the verified release.

**Architecture:** Keep guide discovery in `keywords.json`, long-form content in the existing locale MDX matrix, news status in `news-data.ts`, and video evidence in the existing video library/localization pipeline. Add no new content system or advertising path.

**Tech Stack:** Next.js 16, TypeScript 6, next-intl, MDX, Vitest, Playwright, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-01-live-ops-content-refresh-design.md`

## Global Constraints

- Support exactly `en`, `de`, `ru`, `pt-br`, `ja`, and `zh-cn` without English-body fallback.
- Call September 2 a limited Firing Range/backend test, never an open beta.
- Label all creator observations and pre-release values as build-sensitive.
- Preserve the AdSense-only production implementation and existing analytics behavior.

---

### Task 1: Content Contract

**Files:**
- Create: `tests/content/september-live-ops-refresh.test.ts`
- Modify: `tests/content/manifest.test.ts`

**Interfaces:**
- Consumes: `loadGuideDocument`, `guideManifest`, `NEWS_UPDATES`, and `videoArticles`.
- Produces: failing assertions for the six refreshed guides, two new guide slugs, four videos, and September 2 timeline item.

- [ ] Write assertions that every target locale has `updatedAt: 2026-09-01`, the September 2 time, the limited-test distinction, and the official social source.
- [ ] Assert both new guides exist in all six locales with substantial bodies, FAQs, and at least two sources.
- [ ] Assert the four new YouTube IDs and the September 2 news item exist.
- [ ] Run `npx vitest run tests/content/september-live-ops-refresh.test.ts tests/content/manifest.test.ts` and confirm failure for missing content.

### Task 2: Current Event Pages

**Files:**
- Modify: `content/{en,de,ru,pt-br,ja,zh-cn}/guides/{wardogs-beta,wardogs-playtest,wardogs-download,wardogs-preload,wardogs-launch-checklist,wardogs-livestream}.mdx`
- Modify: `src/features/news/news-data.ts`
- Modify: `src/features/home/home-data.ts`

**Interfaces:**
- Consumes: existing guide frontmatter and news/home discovery models.
- Produces: current September 2 status, time conversion table, open-beta correction, and updated discovery entry.

- [ ] Add the official September 2 source and update dates in all 36 documents.
- [ ] Add a localized status block and FAQ answer without deleting historical August beta context.
- [ ] Add the September 2 event to news and make the current home status link to the Playtest guide.
- [ ] Run the focused content contract and correct any locale omission.

### Task 3: Progression and Community-Server Guides

**Files:**
- Modify: `keywords.json`
- Modify: `tests/content/manifest.test.ts`
- Create: `content/{en,de,ru,pt-br,ja,zh-cn}/guides/wardogs-progression-wipes-guide.mdx`
- Create: `content/{en,de,ru,pt-br,ja,zh-cn}/guides/wardogs-community-servers-guide.mdx`
- Modify: `src/features/home/home-data.ts`

**Interfaces:**
- Produces: manifest orders 44 and 45, twelve full local-language documents, and discovery links.

- [ ] Add both keywords after the existing guide list and update the 45-entry manifest expectation.
- [ ] Author the English guides with direct answers, confirmed/unknown sections, practical launch advice, FAQs, and sources.
- [ ] Author complete German, Russian, Brazilian Portuguese, Japanese, and Simplified Chinese versions.
- [ ] Add the two slugs to top-guide discovery and run all content tests.

### Task 4: Current Video Articles

**Files:**
- Modify: `src/features/videos/video-library.ts`
- Modify: `src/features/videos/video-localization.ts` or the existing locale fields in `video-library.ts`

**Interfaces:**
- Produces: localized video pages for YouTube IDs `im60BiRZFow`, `IO7-_TwxpII`, `7O5QJNRzXzQ`, and `JSAu5nlLjJw`.

- [ ] Add four video records using the established article shape and maintained internal guide links.
- [ ] Keep creator conclusions attributed and mark beta mechanics as build-sensitive.
- [ ] Run video unit tests and the focused content contract.

### Task 5: Verification and Release

**Files:**
- Modify only when a verification failure identifies a scoped defect.

**Interfaces:**
- Produces: a deployed production commit, public 200 responses, sitemap entries, and IndexNow submissions.

- [ ] Run `npm run content:validate`, `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- [ ] Start the production build locally and inspect representative English, German, Japanese, and Chinese pages at desktop and mobile widths.
- [ ] Commit the verified change set and push the branch and production ref.
- [ ] Verify the public English and translated guide routes, `sitemap.xml`, `video-sitemap.xml`, `ads.txt`, and AdSense loader.
- [ ] Run `node scripts/submit-indexnow.mjs` for the changed production URLs and record the result.
