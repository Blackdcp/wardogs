# WARDOGS Items Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an independent WARDOGS Items system with index, category, detail, sitemap, and navigation support.

**Architecture:** Keep item content separate from the existing 20-guide keyword matrix. Store verified pre-release item facts in typed data, render them through dedicated routes, and label every item with evidence status so pages can expand after beta without pretending final stats are known.

**Tech Stack:** Next.js App Router, TypeScript, next-intl navigation, Vitest, Tailwind utility classes.

## Global Constraints

- Do not copy or modify competitor item images.
- Do not publish final damage, price, unlock, ammo, or balance values unless sourced.
- Item routes must be independent from `keywords.json`.
- Sitemap must include item hubs and detail pages.
- English and Russian get indexable item detail pages first; German and Portuguese get hubs only until stronger demand appears.

---

### Task 1: Item Data Model and Tests

**Files:**
- Create: `src/features/items/item-library.ts`
- Create: `tests/unit/item-library.test.ts`

**Interfaces:**
- Produces: `itemTypes`, `itemLibrary`, `getItemType`, `getItemsByType`, `getItemBySlug`, `getIndexableItemPaths`, `getFeaturedItems`.

- [ ] **Step 1: Write failing tests**

```ts
import {describe, expect, it} from "vitest";
import {getIndexableItemPaths, getItemBySlug, getItemsByType, itemLibrary} from "../../src/features/items/item-library";

describe("item library", () => {
  it("keeps item pages independent from the guide keyword matrix", () => {
    expect(itemLibrary.map((item) => item.slug)).toContain("mortar");
    expect(getItemsByType("weapons").every((item) => item.type === "weapons")).toBe(true);
  });

  it("labels pre-release facts without final stat claims", () => {
    const mortar = getItemBySlug("mortar");
    expect(mortar?.status).toBe("pre-release-build");
    expect(mortar?.facts.some((fact) => fact.label === "Final damage")).toBe(false);
    expect(mortar?.facts.every((fact) => fact.evidence.length > 0)).toBe(true);
  });

  it("indexes English and Russian item details first", () => {
    const paths = getIndexableItemPaths();
    expect(paths).toContainEqual({locale: "en", type: "weapons", slug: "mortar"});
    expect(paths).toContainEqual({locale: "ru", type: "vehicles", slug: "littlebird"});
    expect(paths).not.toContainEqual({locale: "de", type: "weapons", slug: "mortar"});
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/item-library.test.ts`
Expected: FAIL because `item-library.ts` does not exist.

- [ ] **Step 3: Implement item library**

Create typed data for weapons, vehicles, equipment; add six initial items with evidence labels and source links.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/item-library.test.ts`
Expected: PASS.

### Task 2: Item Routes and Metadata

**Files:**
- Create: `src/app/[locale]/items/page.tsx`
- Create: `src/app/[locale]/items/[type]/page.tsx`
- Create: `src/app/[locale]/items/[type]/[slug]/page.tsx`
- Create: `src/lib/item-structured-data.ts`

**Interfaces:**
- Consumes: item library functions from Task 1.
- Produces: localized item hub, type pages, detail pages, and article JSON-LD.

- [ ] **Step 1: Write failing route tests**

Add route expectations to `tests/e2e/routes.spec.ts` for `/en/items`, `/en/items/weapons`, `/en/items/weapons/mortar`, and `/ru/items/vehicles/littlebird`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- tests/e2e/routes.spec.ts`
Expected: FAIL because routes do not exist.

- [ ] **Step 3: Implement pages**

Render index cards, type cards, item facts, evidence labels, source list, related guides, and related items. Use `Article` JSON-LD for details.

- [ ] **Step 4: Run route test**

Run: `npm run test:e2e -- tests/e2e/routes.spec.ts`
Expected: PASS.

### Task 3: Navigation and Sitemap

**Files:**
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/unit/sitemap.test.ts`

**Interfaces:**
- Consumes: `getIndexableItemPaths`, `itemTypes`.

- [ ] **Step 1: Write failing sitemap test**

Assert sitemap includes `/en/items`, `/en/items/weapons`, `/en/items/weapons/mortar`, and `/ru/items/vehicles/littlebird`.

- [ ] **Step 2: Run sitemap test**

Run: `npm test -- tests/unit/sitemap.test.ts`
Expected: FAIL for missing item URLs.

- [ ] **Step 3: Implement sitemap and nav link**

Add item hubs, type pages for all locales, and item detail pages only for indexable locales. Add `Items` in header navigation.

- [ ] **Step 4: Run sitemap test**

Run: `npm test -- tests/unit/sitemap.test.ts`
Expected: PASS.

### Task 4: Final Verification and Deploy

**Files:**
- No new files.

- [ ] **Step 1: Run content tests**

Run: `npm run content:validate`
Expected: PASS.

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit and push**

Run: `git add -A && git commit -m "feat: add wardogs item pages" && git push`
Expected: pushed branch triggers Vercel/GitHub deployment.
