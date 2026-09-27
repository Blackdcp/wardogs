# Catalogue Image Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 101 pending catalogue visuals with accurately identified WARDOGS media where source evidence exists, and produce an explicit unresolved-item report for any image that cannot be verified.

**Architecture:** Keep catalogue records as the inventory and the media-source manifest as the sole approval gate. Add an honest owner-provided historical provenance type for the 65 existing item assets, then add new media only with record-specific approvals. Render source/build distinctions in the cards and retain the pending state for unverified identifiers.

**Tech Stack:** Next.js 16.3.6 App Router, React 19, TypeScript 6, Vitest 4, Playwright, local WebP assets.

**Spec:** `docs/superpowers/specs/2026-09-27-catalogue-image-completion-design.md`

## Global Constraints

- No real-world weapon photo, unrelated game asset, competitor-hosted image, generic category banner, or AI-generated approximation as item evidence.
- Each shown image requires a record-specific identity match, local file, meaningful alt, source type, acquisition date, and applicable build.
- Owner-provided August artwork is historical; neither its source nor current-build status may be described as official.
- Image work must not silently alter prices, unlocks, gameplay statistics, or indexability.
- Work in the existing `codex/adsense-migration` checkout, per the owner's explicit preference. Baseline: 128 test files / 563 tests passing.

## File Map

- `src/features/catalogue/catalogue-media-sources.ts`: explicit approvals and provenance metadata.
- `src/features/catalogue/catalogue-records.ts`: image approvals consumed by all catalogue groups.
- `src/features/catalogue/visual-coverage.ts`: asset/provenance validation and coverage reports.
- `src/components/catalogue/catalogue-card.tsx`: image and provenance/build disclosure.
- `public/images/catalogue/`: any newly sourced local object frames.
- `tests/unit/visual-coverage.test.ts`, `tests/unit/catalogue-media-sources.test.ts`, `tests/unit/catalogue-card.test.tsx`: behavioral regression tests.
- `tests/e2e/catalogue-images.spec.ts`: actual rendered image-load checks, written before the first image restoration.
- `docs/research/wardogs-catalogue-image-audit-2026-09-27.md`: source-by-source acceptance and unresolved ledger.

## Review Focus

1. A filename that looks right but depicts another item must remain pending: Task 1 visually reconciles the owner pack and tests the explicit record allowlist.
2. A variant sharing a base item's picture must not be approved as a unique verified object: Tasks 1 and 3 test duplicate and record-key rejection.
3. Very dark WebP artwork can appear empty on dark cards even when it loads: Task 2 checks a legible backdrop, and Task 5 tests loaded dimensions at mobile/desktop widths.
4. A local asset may pass unit checks but fail through Next's image URL in production: Task 5 checks `naturalWidth > 0` for rendered images and rechecks live URLs after release.
5. Owner-provided Alpha artwork must not be mistaken for current game capture: Tasks 1 and 2 test provenance metadata and visible localized disclosure.

---

### Task 1: Approve the 65 owner-provided item assets honestly

**Files:** Modify `src/features/catalogue/catalogue-media-sources.ts`, `src/features/catalogue/catalogue-records.ts`, `src/features/catalogue/visual-coverage.ts`; test `tests/unit/visual-coverage.test.ts` and `tests/unit/catalogue-media-sources.test.ts`; create `tests/e2e/catalogue-images.spec.ts`.

**Interfaces:** Produce `CatalogueMediaSource` with `origin: "external-capture" | "owner-asset-pack"` and optional `sourceUrl` only for `owner-asset-pack`; produce `getCatalogueMediaSource(record)` with 65 additional record-specific approvals. Consume the existing 14 ammo, 40 attachment, and 11 gear files. Preserve all 59 existing weapon/vehicle approvals.

- [ ] **Step 1: Write the failing provenance and coverage tests.** Assert literal counts of `{ammo: 14, attachments: 40, gear: 11}` as non-pending after approval; assert the 65 approvals have `origin: "owner-asset-pack"`, no invented source URL, the matching record key and existing file; assert a false record key and a missing file fail the audit. Add a browser case for one ammo/attachment/gear card with `naturalWidth > 0`.
- [ ] **Step 2: Run** `npx vitest run tests/unit/visual-coverage.test.ts tests/unit/catalogue-media-sources.test.ts` and `npx playwright test tests/e2e/catalogue-images.spec.ts`. **Expected:** fail on the currently pending 65 and missing origin contract; browser test sees the placeholder rather than an image.
- [ ] **Step 3: Reconcile the original owner pack** at `C:/Users/user/Downloads/untitled folder 2` against the 65 local files by SHA-256; inspect object labels against images, record exceptions in the audit. Implement only matching record-specific approvals. Use an owner-pack acquisition date of `2026-08-17`, a historical Alpha build scope, and an honest source label without an external URL.
- [ ] **Step 4: Run the focused tests.** **Expected:** pass with no catalogue visual audit violations and unchanged indexable-detail coverage.
- [ ] **Step 5: Commit** the approval manifest, validators, and tests.

### Task 2: Show historical-image provenance legibly

**Files:** Modify `src/components/catalogue/catalogue-card.tsx`; test `tests/unit/catalogue-card.test.tsx` (create if absent).

**Interfaces:** Call Task 1's `getCatalogueMediaSource(record)` to consume `CatalogueMediaSource.origin`. Produce an image caption for owner-pack artwork in all six existing locales; no caption should claim current Early Access verification.

- [ ] **Step 1: Write failing component tests.** A historical asset card renders its image and a localized historical-source caption; a pending card renders no image; a verified capture retains the existing image display. Include a dark transparent WebP on a visibly contrasting card surface.
- [ ] **Step 2: Run** `npx vitest run tests/unit/catalogue-card.test.tsx`. **Expected:** fail because the owner-pack caption and contrast treatment are absent.
- [ ] **Step 3: Implement the minimal card change** and localized strings; do not rewrite the evidence panel or status logic.
- [ ] **Step 4: Run the focused test and full unit suite.** **Expected:** both pass.
- [ ] **Step 5: Commit** the UI and tests.

### Task 3: Research and source the seven missing weapon/vehicle visuals

**Files:** Add approved assets under `public/images/catalogue/weapons/` or `vehicles/` where obtainable; modify `src/features/catalogue/catalogue-records.ts` and `catalogue-media-sources.ts`; update `docs/research/wardogs-catalogue-image-audit-2026-09-27.md`; test `tests/unit/visual-coverage.test.ts`.

**Interfaces:** Consume Task 1's provenance gate. Candidate identifiers: `weapons/m12g`, `weapons/at4`, `weapons/browning-mg`, `weapons/g60`, and `vehicles/m113-apc-sv-variant-{1,2,3}`. Produce one source record per accepted image (URL, timestamp/frame, build, identity cue) or a reason it remains pending.

- [ ] **Step 1: Research each identifier** in Team17/BULKHEAD media, current-client captures if accessible, and named WARDOGS footage. Do not treat another wiki or a real-world model photo as the image source. Record the evidence outcome for all seven.
- [ ] **Step 2: For each accepted frame, write a failing test** asserting its exact record mapping, unique image, local file, and dated source metadata. **Expected:** focused test fails before the asset approval exists.
- [ ] **Step 3: Add the asset and approval** only after the frame clearly identifies the in-game object. Leave ambiguous variants pending with their audit reasons.
- [ ] **Step 4: Run** `npx vitest run tests/unit/visual-coverage.test.ts tests/unit/catalogue-media-sources.test.ts`. **Expected:** pass; no generic or duplicated variant images.
- [ ] **Step 5: Commit** accepted assets, approvals, tests, and the seven-item evidence ledger.

### Task 4: Research and source the remaining 29 catalogue visuals

**Files:** Add accepted assets under `public/images/catalogue/` by group; modify `catalogue-records.ts`, `catalogue-media-sources.ts`, and the research audit; test `tests/unit/visual-coverage.test.ts`.

**Interfaces:** Consume the Task 1 approval contract. Cover exactly 5 equipment, 4 medical, 4 supplies, 5 deployables, 4 mechanics, and 7 maps. Object entries require an object-specific match; mechanics and maps may use appropriately labeled contextual game views.

- [ ] **Step 1: Inventory and research all 29** using official media first, then identifiable WARDOGS gameplay with timestamps. Record source, build, image identity, and uncertainty in the audit.
- [ ] **Step 2: Write failing tests** for each accepted record: exact identity/mapping, file existence, alt, source/build, and contextual-versus-object state. **Expected:** focused suite fails before each approval.
- [ ] **Step 3: Add locally stored approved images and metadata.** Keep unverified entries pending and document why.
- [ ] **Step 4: Run** `npx vitest run tests/unit/visual-coverage.test.ts tests/unit/catalogue-media-sources.test.ts`. **Expected:** pass with no provenance violations.
- [ ] **Step 5: Commit** the assets, manifest, tests, and completed 29-item audit.

### Task 5: Browser, build, and production verification

**Files:** Extend `tests/e2e/catalogue-images.spec.ts` only if an uncovered browser regression is found; update the research audit with final counts.

**Interfaces:** Consume the complete catalogue media inventory. Produce a per-group before/after table, list every remaining pending item, and test actual image loading on mobile and desktop.

- [ ] **Step 1: Review the browser test introduced in Task 1.** Add any new case only after reproducing a specific uncovered failure, run it red, then fix it; test an approved weapon/vehicle and the documented M12G/AT4 outcome at phone and desktop widths.
- [ ] **Step 2: Run** `npx playwright test tests/e2e/catalogue-images.spec.ts`. **Expected:** pass with every approved sample at `naturalWidth > 0` and pending samples showing no misleading image.
- [ ] **Step 3: Complete the audit report** without changing fact values or hiding unresolved records.
- [ ] **Step 4: Run** `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, and the focused browser test. **Expected:** all pass; report the exact remaining pending count.
- [ ] **Step 5: Commit** the browser test and final audit; deploy only after the review gate, then verify live category pages and several direct image URLs.

## Release rule

Ship a verified batch independently if it passes the complete gate, and state its exact coverage improvement. Do not claim all 101 are complete unless the inventory reaches zero pending and production images load. If specific historical identifiers have no identifiable WARDOGS media, surface them as source blockers for an explicit product decision; neither a generic silhouette nor a borrowed competitor image closes the task.
