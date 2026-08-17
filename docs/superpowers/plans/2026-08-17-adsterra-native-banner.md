# Adsterra Native Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Load the supplied Adsterra native banner once on each guide, video, and item detail page directly after its Quick Answer block.

**Architecture:** A focused client component owns third-party script injection, timeout/error handling, and cleanup so Next.js client navigation can create a fresh ad. Server page templates render that component in the approved slot, while localized messages supply the visible advertising label and updated privacy disclosure.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, next-intl, Vitest, Playwright

## Global Constraints

- Use Adsterra zone ID `481d6501bcd0c27b98bc3c4776a26f6e`.
- Load `https://pl30888081.effectivecpmnetwork.com/481d6501bcd0c27b98bc3c4776a26f6e/invoke.js` asynchronously with `data-cfasync="false"`.
- Render only on guide, video, and item detail pages after Quick Answer.
- Do not render on home, indexes, news, catalogue categories, or legal pages.
- Preserve unrelated catalogue data and image changes in the dirty worktree.

---

### Task 1: Native Banner Loader

**Files:**
- Create: `src/components/ads/adsterra-native-banner.tsx`
- Test: `tests/unit/adsterra-native-banner.test.ts`

**Interfaces:**
- Produces: `AdsterraNativeBanner({label}: {label: string})`
- Produces: `ADSTERRA_NATIVE_ZONE_ID`, `ADSTERRA_NATIVE_SCRIPT_SRC`, and `configureAdsterraScript(script)` for deterministic testing

- [ ] **Step 1: Write the failing configuration test**

Assert that `configureAdsterraScript` sets `async`, `data-cfasync="false"`, and the exact script source, and that the exported container ID is `container-${ADSTERRA_NATIVE_ZONE_ID}`.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npx vitest run tests/unit/adsterra-native-banner.test.ts`

Expected: FAIL because the component module does not exist.

- [ ] **Step 3: Implement the client component**

Use `useEffect`, a section ref, and a container ref. Create the script with `document.createElement("script")`, configure it before insertion, insert it immediately before the container, observe container mutations, hide on `error` or an eight-second empty timeout, and clean up the observer, timer, script, and injected container children on unmount. Render a visible localized label and reserve a responsive minimum height only while the slot is active.

- [ ] **Step 4: Run the focused test**

Run: `npx vitest run tests/unit/adsterra-native-banner.test.ts`

Expected: PASS.

### Task 2: Detail-Page Placement and Localization

**Files:**
- Modify: `src/app/[locale]/guides/[slug]/page.tsx`
- Modify: `src/app/[locale]/videos/[slug]/page.tsx`
- Modify: `src/app/[locale]/items/[type]/[slug]/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/de.json`
- Modify: `messages/pt-br.json`
- Modify: `messages/ru.json`
- Test: `tests/unit/adsterra-placement.test.ts`

**Interfaces:**
- Consumes: `AdsterraNativeBanner({label})`
- Produces: one `ads.label` translation in every locale

- [ ] **Step 1: Write the failing placement test**

Read the three detail templates and assert each imports and renders `AdsterraNativeBanner` exactly once. Read the home and three index templates and assert none renders it.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npx vitest run tests/unit/adsterra-placement.test.ts`

Expected: FAIL because the templates do not contain the ad component.

- [ ] **Step 3: Add localized labels and render the component**

Add `ads.label` values: `Advertisement`, `Werbung`, `Publicidade`, and `Реклама`. Resolve the translation in each server page and render the component directly after Quick Answer.

- [ ] **Step 4: Run placement and message tests**

Run: `npx vitest run tests/unit/adsterra-placement.test.ts tests/unit/messages.test.ts tests/unit/i18n.test.ts`

Expected: PASS.

### Task 3: Privacy Disclosure and Production Verification

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/de.json`
- Modify: `messages/pt-br.json`
- Modify: `messages/ru.json`

**Interfaces:**
- Updates: existing `privacy.content` text in every locale

- [ ] **Step 1: Extend the placement test with privacy assertions**

Assert every locale's `privacy.content` mentions third-party advertising and technical request data.

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npx vitest run tests/unit/adsterra-placement.test.ts`

Expected: FAIL on the privacy assertions.

- [ ] **Step 3: Update all localized privacy disclosures**

Explain that Adsterra may receive IP address, browser/device information, and use its own cookies or privacy controls when an ad loads. Keep the statement factual and concise.

- [ ] **Step 4: Run full verification**

Run: `npm run lint`

Run: `npm run typecheck`

Run: `npm test`

Run: `npm run build`

Expected: every command exits successfully.

- [ ] **Step 5: Commit and deploy**

Stage only the ad component, three templates, four message files, two ad tests, this plan, and the design spec. Commit with `feat: add native ads to content pages`, then push the production-connected branch.
