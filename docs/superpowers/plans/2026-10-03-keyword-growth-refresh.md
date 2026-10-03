# Keyword Growth Refresh Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for integration and superpowers:dispatching-parallel-agents for the three independent content groups. Track completion below.

**Goal:** Turn the October 3 keyword research into useful localized answers, accurate search snippets and connected guide-to-tool journeys while preserving existing search topics.

**Architecture:** Extend existing MDX guides and the existing locale-aware SEO, home and task-panel data. Keep URLs, primary keywords and established gameplay facts. Group related queries into the current pages, rather than generating one page per keyword.

**Tech Stack:** Next.js 16.3.6, React 19, next-intl, MDX, Vitest.

**Spec:** Local research files `docs/research/keyword-research-2026-10-03.md`, `docs/research/keyword-opportunities-2026-10-03.json`, and the user's approval to update the project using its already-confirmed page and guide content. Research files containing internal analytics remain local and are excluded from this code push.

## Global Constraints

- Preserve the user's confirmed facts, existing URLs and manifest primary keywords.
- Keep proven Japanese page topics and titles, including friends, towers, weapons, cargo and settings.
- New material must answer the relevant task directly and link to the existing localized guide, catalogue or tool.
- Use the eight existing locales; do not put English-only explanatory copy in other language pages.
- Keep original useful sections and source records; update the content date when the page changes.
- No deployment is part of this implementation turn.
- Preserve unrelated working-tree documents, assets and scripts.

## Review Focus

- A current error query reaches the correct error branch, including WD-L014/018 and WD-L020.
- A localized reader follows internal links to an available route in the intended language.
- Existing high-traffic Japanese topics survive the content update.
- Descriptions end at a complete sentence instead of cutting CJK words.
- Map/mortar, money/budget and loadout/weapon tasks lead to the right existing tool.

## Tasks

### Task 1 Current operations and equipment

**Files:** `content/{locale}/guides/wardogs-{crash-fix,known-issues,patch-notes,server-status,community-servers-guide,controls,equipment-tools-guide}.mdx`.

- [x] Add current error, mode, maintenance, controller, IR/CWIS and relevant equipment answers in all locales, retaining existing core content.
- [x] Verify MDX rendering, internal links and affected content contracts.

### Task 2 Season progression and achievements

**Files:** `content/{locale}/guides/wardogs-{season-2,progression-wipes-guide,money-guide,achievements}.mdx`.

- [x] Strengthen reset/retention, Gold quote, role-versus-Career XP and hidden-achievement navigation.
- [x] Verify MDX, related tools, locale completeness and affected content contracts.

### Task 3 Existing gameplay traffic and tool journeys

**Files:** `content/{locale}/guides/wardogs-{beginner-guide,squad-guide,towers-guide,cargo-guide,best-weapons-loadouts,helicopter-guide,best-settings,mortar-guide,artillery-guide,map,fob-guide,ammo-reload-guide,oil-rig-guide}.mdx`.

- [x] Strengthen concrete questions and steps, keeping high-traffic topics and useful previous modules.
- [x] Align ten beginner tips, flight-action reference and map/FOB routes with current page titles.
- [x] Verify links, MDX and affected content contracts.

### Task 4 Search metadata and discovery

**Files:** `src/lib/metadata.ts`, `src/lib/item-metadata.ts`, focused SEO data files, `src/features/guides/guide-task-data.ts`, `src/features/home/home-data.ts`, relevant unit tests.

- [x] Add locale-native intent keywords with the primary keyword retained and noise excluded.
- [x] Repair sentence truncation with a failing regression test before implementation.
- [x] Connect relevant guide task panels to artillery, map, logistics, ammo, progression and comparison tools.
- [x] Prioritize existing localized traffic and current questions in home discovery.

### Task 5 Integration and verification

- [x] Baseline: 165 test files, 1219 tests passed.
- [x] Review the combined diff and any changes to historical content assertions.
- [x] Run the full unit/content suite, lint, typecheck and production build.
- [x] Check representative localized rendered pages, metadata, FAQ and tool navigation in a browser.
- [x] Record changed content, keyword coverage and validation in an implementation report.

## Progress

2026-10-03: Started from da7212057164e9a485fc69e9e8d3555ca10fcedb in the existing shared checkout. Only pre-existing documentation/scratch files were dirty; application source was clean. User approved implementation from the completed research. Existing page facts are the editorial authority for this update.

2026-10-03: Completed 192 guide files across 24 families and eight locales, with 236 new H3 answers and 16 refreshed descriptions. Added native guide and item keywords, matching tool journeys and home priorities. All 1232 tests, 406 content tests, lint, typecheck and the Webpack production build passed; 1259 pages generated. Default Turbopack encountered a local compiler process port permission error; project build configuration is unchanged. Browser checks covered discovery, rendered answers, metadata, checklist, FAQ and budget calculations. See docs/research/keyword-implementation-2026-10-03.md and its JSON for scope and evidence. No deployment.
