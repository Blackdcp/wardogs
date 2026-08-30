# Simplified Chinese Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Simplified Chinese as a sixth first-class locale across every WARDOGS Wiki route, content family, SEO surface, and deployment artifact.

**Architecture:** Extend the existing locale-keyed contracts with `zh-cn`; TypeScript record completeness and content-matrix tests will expose every missing translation. Keep English as the evidence source while providing native Chinese UI and substantial Chinese MDX pages under the existing route system.

**Tech Stack:** Next.js 16, TypeScript, next-intl, MDX, Vitest, Playwright, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-30-zh-cn-localization-design.md`

## Global Constraints

- The public locale path is exactly `zh-cn`; the language tag is exactly `zh-CN`.
- Simplified Chinese is a sixth first-class locale, not a fallback or canonicalized English copy.
- Do not claim a mainland China edition, domestic publishing licence, or China-only server.
- Preserve source URLs, model identifiers, observed prices, dates, and evidence caveats.
- Every English guide slug must have a substantial Chinese counterpart with Chinese internal links.

---

### Task 1: Locale Contract and SEO Surfaces

**Files:**
- Modify: `src/config/site.ts`
- Modify: `src/lib/metadata.ts`
- Modify: `src/lib/localized-date.ts`
- Modify: `src/app/llms.txt/route.ts`
- Modify: `src/components/layout/locale-switcher.tsx`
- Modify: `src/lib/analytics-events.ts`
- Modify: locale-matrix unit tests under `tests/unit`

**Interfaces:**
- Produces: `Locale` includes `"zh-cn"`; `languageTags["zh-cn"] === "zh-CN"`.
- Produces: every metadata alternate and generated locale route includes `/zh-cn/`.

- [ ] **Step 1: Write failing six-locale tests**

Update configuration, metadata, sitemap, route, date, analytics, and locale-switcher expectations to require `zh-cn` and `zh-CN`.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- tests/unit/site-config.test.ts tests/unit/metadata.test.ts tests/unit/sitemap.test.ts tests/unit/localized-date.test.ts tests/unit/item-route-availability.test.ts`

- [ ] **Step 3: Extend locale contracts**

Add `zh-cn` to the shared locale tuple, map it to `zh-CN`, format dates with `zh-CN`, expose label `简中`, and include it in route matching and `llms.txt` naming.

- [ ] **Step 4: Run focused tests and verify pass**

Run the same focused command and require zero failures.

- [ ] **Step 5: Commit**

Commit message: `feat: add Simplified Chinese locale contract`

### Task 2: Shared UI and Generated Catalogue Content

**Files:**
- Create: `messages/zh-cn.json`
- Modify: locale-keyed modules in `src/features/home`, `src/features/navigation`, `src/features/news`, `src/features/videos`, `src/features/items`, and `src/features/catalogue`
- Modify: `src/app/[locale]/editorial-policy/page.tsx`
- Modify: relevant tests under `tests/unit`

**Interfaces:**
- Produces: all `Record<Locale, ...>` values include a native Chinese branch.
- Produces: generated catalogue/item/video/news content returns Chinese labels and summaries for `zh-cn`.

- [ ] **Step 1: Write failing Chinese UI tests**

Require message-key parity, Chinese script signals, localized item labels, localized evidence states, localized video text, and Chinese editorial/legal copy.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- tests/unit/messages.test.ts tests/unit/i18n.test.ts tests/unit/localized-shared-content.test.ts tests/unit/item-library.test.ts tests/unit/item-metadata.test.ts tests/unit/video-localization.test.ts`

- [ ] **Step 3: Add Chinese shared and generated copy**

Translate every compile-time locale record. Keep weapon and vehicle model names unchanged while translating roles, categories, facts, caveats, evidence labels, dates, and navigation text.

- [ ] **Step 4: Run typecheck and focused tests**

Run: `npm run typecheck`

Run the focused test command from Step 2 and require zero failures.

- [ ] **Step 5: Commit**

Commit message: `feat: localize shared WARDOGS content in Chinese`

### Task 3: Complete Chinese Guide Corpus

**Files:**
- Create: `content/zh-cn/guides/*.mdx` for all 43 English guide slugs
- Modify: content matrix and language-signal tests under `tests/content`

**Interfaces:**
- Consumes: the exact English guide slug and evidence-source set.
- Produces: `listGuideSummaries("zh-cn")` with the same slug set as English; `loadGuideDocument("zh-cn", slug)` returns substantial Chinese content.

- [ ] **Step 1: Write failing Chinese content-matrix tests**

Require exact slug parity with English, Chinese title/description/body signals, localized `/zh-cn/` internal links, preserved source URLs, and no copied English paragraphs.

- [ ] **Step 2: Run content tests and verify failure**

Run: `npm run content:validate`

- [ ] **Step 3: Create all 43 Chinese MDX guides**

Translate titles, descriptions, direct answers, factual sections, practical steps, FAQs, source notes, and related links. Preserve frontmatter schemas and source URLs exactly.

- [ ] **Step 4: Run content tests and verify pass**

Run: `npm run content:validate`

- [ ] **Step 5: Commit**

Commit message: `feat: publish complete Simplified Chinese guides`

### Task 4: Full Verification and Production Deployment

**Files:**
- Modify: locale arrays and expected counts in `tests/e2e`, `tests/pages-e2e`, and remaining unit/content tests
- No product behavior outside the localization scope

**Interfaces:**
- Produces: six-locale static output, reciprocal alternates, and production URLs under `/zh-cn/`.

- [ ] **Step 1: Remove remaining five-locale assumptions**

Search for hard-coded locale arrays and count labels. Update them to require six locales and Chinese route coverage.

- [ ] **Step 2: Run complete verification**

Run: `npm test`

Run: `npm run typecheck`

Run: `npm run lint`

Run: `npm run build`

Run: `npm run test:pages`

- [ ] **Step 3: Perform visual QA**

Check Chinese home, weapon catalogue, M4 detail, guide index, and one long guide at desktop and 390x844 mobile. Require no overflow, broken media, untranslated controls, navigation collisions, or console errors.

- [ ] **Step 4: Commit verification updates**

Commit message: `test: verify six-locale Chinese coverage`

- [ ] **Step 5: Deploy and verify production**

Push the feature branch, fast-forward `main`, wait for build/deploy/IndexNow jobs, then confirm HTTP 200, Chinese titles, 38 weapon records, sitemap `zh-CN` alternates, and representative guide/detail pages.
