# WARDOGS Excellence Program Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a version-aware catalogue, contextual visual guides, task-first homepage, four new shareable tools, broader sourced coverage, and a current video intelligence layer without weakening factual accuracy.

**Architecture:** Extend the existing catalogue and item-library types with one normalized provenance contract, then consume it in item pages and tools. Keep localized UI copy in typed feature modules, keep current observations separate from historical values, and reuse existing guide and item URLs. Add small focused App Router pages around shared data modules so every tool can be statically generated for all six locales.

**Tech Stack:** Next.js 16.3 App Router, React 19.2, TypeScript 6, next-intl 4.13, MDX, Lucide React, Vitest, Playwright, Vercel, IndexNow.

**Spec:** `docs/superpowers/specs/2026-09-17-wardogs-excellence-program-design.md`

## Global Constraints

- Support `en`, `de`, `ru`, `pt-br`, `ja`, and `zh-cn`.
- Preserve existing canonical routes and source-policy checks.
- Never label Alpha or Beta observations as verified Season 1 facts.
- New current values require an approved source and an ISO verification date.
- Shared data is the source of truth; localized files translate explanations, not numeric facts.
- Do not create thin indexable pages to inflate coverage.
- New controls have fixed responsive dimensions, visible focus states, and non-overlapping translated labels.

---

### Task 1: Versioned Evidence Contract And Quality Gates

**Files:**
- Modify: `src/features/catalogue/catalogue-types.ts`
- Create: `src/features/catalogue/catalogue-evidence.ts`
- Modify: `src/features/catalogue/catalogue-records.ts`
- Modify: `src/features/items/item-library.ts`
- Modify: `src/features/items/weapon-items.ts`
- Modify: `src/features/items/vehicle-items.ts`
- Modify: `tests/unit/catalogue-records.test.ts`
- Modify: `tests/unit/item-library.test.ts`
- Create: `tests/unit/catalogue-evidence.test.ts`

**Interfaces:**
- Produces: `CatalogueEvidence`, `getCatalogueFreshness(record)`, `isCurrentDecisionSafe(record)`, and `getIndexableCatalogueItems()`.
- Produces: item-level `evidence`, `changeHistory`, and `indexable` fields.

- [ ] **Step 1: Write failing evidence tests** for normalized source class, confidence, ISO date, historical-state classification, and non-indexing of identifier-only generic records.
- [ ] **Step 2: Run `npx vitest run tests/unit/catalogue-evidence.test.ts tests/unit/catalogue-records.test.ts tests/unit/item-library.test.ts`** and confirm failures describe the missing contract.
- [ ] **Step 3: Add the evidence types and helpers** with explicit current/historical/unknown outcomes; map all 131 records without changing an Alpha or Beta value.
- [ ] **Step 4: Add official Season 1 change-history entries only for fields explicitly listed in the official Season 1 update**, including FOB vendor, Large Hammer, Artillery Tank, Z20 Lakota, URAL, Dune Buggy, Kodiak Flatbed, Sports Parachute, Large Backpack, Deagle, and AP ammunition unlock changes.
- [ ] **Step 5: Route indexing through `getIndexableCatalogueItems()`** so unique sourced pages remain indexable and identifier-only generic pages do not.
- [ ] **Step 6: Re-run the three test files** and require zero failures.
- [ ] **Step 7: Commit** with `feat: add versioned catalogue evidence`.

### Task 2: Evidence-First Item Pages And Catalogue Actions

**Files:**
- Modify: `src/app/[locale]/items/[type]/[slug]/page.tsx`
- Modify: `src/components/catalogue/catalogue-card.tsx`
- Modify: `src/components/catalogue/catalogue-build-notice.tsx`
- Create: `src/components/catalogue/evidence-panel.tsx`
- Create: `src/components/catalogue/item-change-history.tsx`
- Modify: `src/features/items/item-ui.ts`
- Modify: `src/lib/item-metadata.ts`
- Modify: `tests/unit/item-detail-route.test.ts`
- Modify: `tests/unit/item-metadata.test.ts`
- Create: `tests/unit/catalogue-evidence-view.test.tsx`

**Interfaces:**
- Consumes: Task 1 evidence helpers and item fields.
- Produces: visible current/historical state, source class, checked date, change history, and tool links.

- [ ] **Step 1: Write failing component and route tests** asserting that historical values are labelled, current-safe facts are separated, change history is rendered, generic pages carry `noindex`, and compare/matcher links preserve item context.
- [ ] **Step 2: Run the focused tests** and confirm they fail on the old undifferentiated page.
- [ ] **Step 3: Implement the evidence panel and change-history component** using semantic lists and status badges rather than nested cards.
- [ ] **Step 4: Update item metadata and catalogue cards** to avoid current-season wording on historical records and expose the correct action links.
- [ ] **Step 5: Re-run the focused tests** and require zero failures.
- [ ] **Step 6: Commit** with `feat: make catalogue evidence explicit`.

### Task 3: Contextual Guide Visuals And Direct Answers

**Files:**
- Create: `src/features/guides/guide-task-data.ts`
- Create: `src/components/guides/guide-task-panel.tsx`
- Create: `src/components/guides/contextual-video-evidence.tsx`
- Modify: `src/app/[locale]/guides/[slug]/page.tsx`
- Modify: `src/features/videos/video-library.ts`
- Modify: `src/features/videos/video-localization.ts`
- Modify: `tests/unit/guide-index.test.ts`
- Create: `tests/unit/guide-task-panel.test.tsx`
- Create: `tests/unit/contextual-video-evidence.test.tsx`

**Interfaces:**
- Produces: `getGuideTaskData(slug, locale)` for direct answers, steps, related tool, and current video evidence.
- Consumes: existing guide documents and current video source records.

- [ ] **Step 1: Write failing tests** covering ammo/reload, controls, FOB, cargo, mortar, helicopter, PS5, progression, weapons, vehicles, crash, and equipment guide task data.
- [ ] **Step 2: Run the focused tests** and confirm the task layer does not exist.
- [ ] **Step 3: Implement a localized direct-answer/task panel** with three to eight steps per supported workflow and no unsupported numeric claims.
- [ ] **Step 4: Implement contextual video evidence** that displays source channel, publication date, review date, build label, and a link to the full video page.
- [ ] **Step 5: Integrate both components into the guide route** after the introduction and before long-form MDX, with no output on unrelated guides.
- [ ] **Step 6: Re-run the focused tests** and require zero failures.
- [ ] **Step 7: Commit** with `feat: add task-first guide evidence`.

### Task 4: Task-First Homepage And Search

**Files:**
- Create: `src/features/search/site-search-index.ts`
- Create: `src/components/home/site-search.tsx`
- Modify: `src/features/home/home-data.ts`
- Modify: `src/components/home/home-action-hub.tsx`
- Create: `src/components/home/current-build-changes.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/{en,de,ru,pt-br,ja,zh-cn}.json`
- Modify: `tests/unit/home-data.test.ts`
- Modify: `tests/unit/home-action-hub.test.tsx`
- Create: `tests/unit/site-search.test.ts`

**Interfaces:**
- Produces: `buildSiteSearchIndex(locale)` over guides, item detail routes, videos, and tools.
- Produces: eight task actions and dynamic guide/catalogue totals.

- [ ] **Step 1: Write failing tests** for multi-surface search, eight task actions, dynamic counts, current-build changes, and removal of Beta/contest cards from primary status output.
- [ ] **Step 2: Run the focused tests** and confirm the current four-action, hard-coded-count implementation fails.
- [ ] **Step 3: Build the static search index and accessible client search UI** with keyboard navigation, stable result dimensions, type labels, and localized empty state.
- [ ] **Step 4: Expand the action hub** to first match, money, role progression, weapons, FOB/logistics, vehicles, controls, and PC fixes.
- [ ] **Step 5: Add the current-build change band and computed content totals**, then place search and task actions directly after the live-status surface.
- [ ] **Step 6: Re-run the focused tests** and require zero failures.
- [ ] **Step 7: Commit** with `feat: make the homepage task first`.

### Task 5: Weapon Compare And Ammo Matcher

**Files:**
- Create: `src/features/tools/weapon-compare-data.ts`
- Create: `src/components/tools/weapon-compare.tsx`
- Create: `src/app/[locale]/tools/weapon-compare/page.tsx`
- Create: `src/features/tools/ammo-matcher-data.ts`
- Create: `src/components/tools/ammo-matcher.tsx`
- Create: `src/app/[locale]/tools/ammo-matcher/page.tsx`
- Modify: `src/features/tools/share-state.ts`
- Modify: `src/features/tools/tool-copy.ts`
- Modify: `src/features/navigation/navigation-data.ts`
- Create: `tests/unit/weapon-compare.test.ts`
- Create: `tests/unit/ammo-matcher.test.ts`
- Modify: `tests/unit/share-tools.test.ts`

**Interfaces:**
- Produces: `getComparableWeapons()`, `compareWeapons(left, right)`, `getAmmoMatches(query)`, and share parameters `left`, `right`, `ammo`, and `weapon`.

- [ ] **Step 1: Write failing data tests** proving comparisons preserve evidence state and ammo relationships come only from explicit catalogue facts.
- [ ] **Step 2: Write failing share-state tests** for valid, missing, duplicate, and unknown item parameters.
- [ ] **Step 3: Run the focused tests** and confirm the new modules and routes are missing.
- [ ] **Step 4: Implement the two data modules and client tools** with responsive selectors, visible unknown values, evidence labels, and copyable result URLs.
- [ ] **Step 5: Add six-locale page metadata/copy and navigation entries.**
- [ ] **Step 6: Re-run the focused tests** and require zero failures.
- [ ] **Step 7: Commit** with `feat: add weapon and ammo tools`.

### Task 6: Progression And Logistics Planners

**Files:**
- Create: `src/features/tools/progression-routes.ts`
- Create: `src/components/tools/progression-route.tsx`
- Create: `src/app/[locale]/tools/progression-route/page.tsx`
- Create: `src/features/tools/logistics-plan.ts`
- Create: `src/components/tools/logistics-planner.tsx`
- Create: `src/app/[locale]/tools/logistics-planner/page.tsx`
- Modify: `src/features/tools/share-state.ts`
- Modify: `src/features/tools/tool-copy.ts`
- Modify: `src/features/navigation/navigation-data.ts`
- Create: `tests/unit/progression-route.test.ts`
- Create: `tests/unit/logistics-planner.test.ts`
- Modify: `tests/unit/share-tools.test.ts`

**Interfaces:**
- Produces: six role routes grounded in official Season 1 progression statements.
- Produces: a shareable ordered logistics checklist without inserting unverified prices or travel times.

- [ ] **Step 1: Write failing tests** for all six role routes, source links, unknown-duration language, ordered logistics stages, and share-state validation.
- [ ] **Step 2: Run the focused tests** and confirm the modules do not exist.
- [ ] **Step 3: Implement the progression route data and UI** with goal, role, current level, confirmed unlock changes, and next-action output.
- [ ] **Step 4: Implement the logistics planner data and UI** for spawn, construction, supply, transport, defense, and recovery tasks.
- [ ] **Step 5: Add six-locale metadata/copy and navigation entries.**
- [ ] **Step 6: Re-run the focused tests** and require zero failures.
- [ ] **Step 7: Commit** with `feat: add progression and logistics planners`.

### Task 7: Catalogue Breadth And Operations Atlas

**Files:**
- Modify: `src/features/catalogue/catalogue-types.ts`
- Modify: `src/features/catalogue/catalogue-records.ts`
- Modify: `src/features/catalogue/catalogue-groups.ts`
- Modify: `src/features/items/item-library.ts`
- Create: `src/features/maps/operations-atlas.ts`
- Create: `src/components/maps/operations-atlas.tsx`
- Create: `src/app/[locale]/maps/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/features/navigation/navigation-data.ts`
- Modify: `tests/unit/catalogue-records.test.ts`
- Create: `tests/unit/operations-atlas.test.ts`
- Modify: `tests/unit/sitemap.test.ts`

**Interfaces:**
- Produces: sourced groups for equipment, medical, supplies, deployables, mechanics, and maps without empty item routes.
- Produces: `getOperationsAtlas(locale)` with guide-backed locations/tasks and explicit evidence state.

- [ ] **Step 1: Write failing tests** for the expanded groups, absence of empty indexable records, atlas source links, and sitemap inclusion.
- [ ] **Step 2: Run focused tests** and confirm the groups and atlas are missing.
- [ ] **Step 3: Add only records already supported by approved first-party or reviewed current-build evidence**; represent unsupported breadth as category tasks, not invented items.
- [ ] **Step 4: Build the operations atlas** as a filterable task/location reference using existing tower, oil-rig, FOB, cargo, mortar, helicopter, and map guides.
- [ ] **Step 5: Add navigation, metadata, and sitemap coverage for all locales.**
- [ ] **Step 6: Re-run focused tests** and require zero failures.
- [ ] **Step 7: Commit** with `feat: expand the field reference`.

### Task 8: Current Video Intelligence

**Files:**
- Modify: `src/features/videos/video-library.ts`
- Modify: `src/features/videos/video-localization.ts`
- Modify: `src/components/home/video-intelligence.tsx`
- Modify: `src/app/[locale]/videos/page.tsx`
- Modify: `tests/unit/video-library.test.ts`
- Modify: `tests/unit/video-card-lifecycle.test.tsx`
- Modify: `tests/unit/video-sitemap.test.ts`

**Interfaces:**
- Produces: at least twenty reviewed current sources with build label, checked date, topic, and guide relationship.

- [ ] **Step 1: Verify candidate videos and save their title, channel, publication date, topic, and current-build relevance from public source pages.**
- [ ] **Step 2: Write failing tests** requiring at least twenty unique current sources, every high-intent topic, approved YouTube URLs, review dates, and no duplicate IDs.
- [ ] **Step 3: Run focused tests** and confirm the eight-source library fails the new coverage contract.
- [ ] **Step 4: Add verified entries and topic labels**, keeping Beta-only sources out of current promotion.
- [ ] **Step 5: Update the video hub and homepage intelligence band** to filter by task and show freshness.
- [ ] **Step 6: Re-run video tests** and require zero failures.
- [ ] **Step 7: Commit** with `feat: expand current video intelligence`.

### Task 9: Full Verification, Visual QA, And Publication

**Files:**
- Modify only files required to correct failures in intended behavior.

**Interfaces:**
- Consumes: Tasks 1 through 8.
- Produces: one production deployment and recrawl submission for all changed canonical URLs.

- [ ] **Step 1: Run `npm run content:validate`, `npm test`, `npm run typecheck`, and `npm run lint`.**
- [ ] **Step 2: Run `npm run build` and inspect every generated route for missing pages or metadata collisions.**
- [ ] **Step 3: Run focused Playwright desktop/mobile checks** for homepage search, item evidence, all six tools, the atlas, and one representative long translated label.
- [ ] **Step 4: Inspect screenshots for overlap, clipping, blank imagery, and unstable tool dimensions; fix any defects and rerun affected checks.**
- [ ] **Step 5: Run `git diff --check`, inspect the complete diff, and dispatch a whole-branch review.**
- [ ] **Step 6: Push the existing branch and verify the production homepage, representative item pages, all tool routes, atlas, sitemap, feed, status API, and `ads.txt`.**
- [ ] **Step 7: Submit changed canonical URLs through `scripts/submit-indexnow.mjs` and record the accepted count.**
