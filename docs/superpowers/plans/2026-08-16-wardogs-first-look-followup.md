# WARDOGS First-Look Follow-Up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the new WARDOGS first-look gameplay video to existing guide content without creating thin new pages.

**Architecture:** Keep the update inside `wardogs-first-look` and `wardogs-gameplay`, plus one content regression test. The video is treated as creator footage, not an official final mechanics source.

**Tech Stack:** Next.js MDX content, Vitest content tests.

## Global Constraints

- Do not copy raw transcript text.
- Do not add a new keyword or route.
- Do not present alpha footage as final game balance.
- Keep PS5 or console timing speculation out of this update.

---

### Task 1: Add Regression Test

**Files:**
- Modify: `tests/content/seo-priority-pages.test.ts`

**Interfaces:**
- Consumes: `loadGuideDocument("en", slug)`.
- Produces: a failing content test for the new video and sections.

- [ ] Add a test that requires `wardogs-first-look` to include `UKL0hwMRT9s` and `Large Squad Alpha Impressions`.
- [ ] Add a test expectation that requires `wardogs-gameplay` to include `Emergent Squad Play`.
- [ ] Run `npm run content:validate -- tests/content/seo-priority-pages.test.ts` and confirm failure.

### Task 2: Update MDX Content

**Files:**
- Modify: `content/en/guides/wardogs-first-look.mdx`
- Modify: `content/en/guides/wardogs-gameplay.mdx`

**Interfaces:**
- Consumes: approved source policy for YouTube URLs.
- Produces: refreshed guide content and source metadata.

- [ ] Add the YouTube source and embedded video to `wardogs-first-look`.
- [ ] Add a `Large Squad Alpha Impressions` section summarizing large-party joining, 20-hour alpha play, Hot Zone coordination, and caveats.
- [ ] Add the YouTube source and an `Emergent Squad Play` section to `wardogs-gameplay`.
- [ ] Keep all wording original and build-sensitive.

### Task 3: Verify and Ship

**Files:**
- Test: `tests/content/seo-priority-pages.test.ts`
- Test: content validation, lint, build, links check.

- [ ] Run `npm run content:validate -- tests/content/seo-priority-pages.test.ts`.
- [ ] Run `npm run content:validate`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run `npm run links:check`.
- [ ] Commit and push to `origin feature/wardogs-wiki:main`.
