# WARDOGS Content and Catalogue Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a source-audited 38-weapon and 28-vehicle catalogue plus four complete five-language player guides, then deploy the verified release.

**Architecture:** Keep `catalogueRecords` as the single source of truth for visual record counts and routes, extend it with explicit evidence and media states, and derive guide metadata/counts from those records. Store source provenance beside catalogue code, keep long-form guides in the existing MDX locale matrix, and use the existing content loader, item routes, sitemap, ads, and structured-data paths.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, next-intl, MDX, Vitest, Playwright, WebP assets.

**Spec:** `docs/superpowers/specs/2026-08-30-wardogs-content-catalogue-expansion-design.md`

## Global Constraints

- Publish exactly 38 documented weapon records and 28 documented vehicle records.
- Never infer missing price, calibre, role, or balance values from real-world names.
- Keep Alpha observations and Beta observations labeled separately by Build.
- Use only existing approved assets, official Team17/Steam press assets, or identifiable source-linked video frames.
- Never use competitor images, competitor database exports, watermark removal, or generated item renders.
- Publish full independent content for `en`, `de`, `ru`, `pt-br`, and `ja`.
- Preserve the existing Native and 300x250 long-article advertising policy; add no new ad formats or analytics events.

---

### Task 1: Catalogue Expansion Contract and Evidence Model

**Files:**
- Modify: `src/features/catalogue/catalogue-types.ts`
- Create: `tests/content/catalogue-expansion-contract.test.ts`
- Modify: `tests/unit/catalogue-records.test.ts`

**Interfaces:**
- Consumes: existing `CatalogueRecord`, `getCatalogueRecords(type)`.
- Produces: `CatalogueEvidenceTier`, `CatalogueMediaState`, and optional record-level `sourceNotes` used by catalogue rendering and provenance tests.

- [ ] **Step 1: Write the failing content contract**

```ts
expect(getCatalogueRecords("weapons")).toHaveLength(38);
expect(getCatalogueRecords("vehicles")).toHaveLength(28);
expect(getCatalogueRecords("weapons").filter((record) => record.evidenceTier === "identifier-only")).toHaveLength(4);
expect(getCatalogueRecords("vehicles").every((record) => record.dataAsOf.length > 0)).toBe(true);
```

- [ ] **Step 2: Run the focused tests and confirm the current 14/20 counts fail**

Run: `npx vitest run tests/content/catalogue-expansion-contract.test.ts tests/unit/catalogue-records.test.ts`

- [ ] **Step 3: Extend the record type without creating a second item database**

```ts
export type CatalogueEvidenceTier = "official" | "build-capture" | "corroborated-community" | "identifier-only";
export type CatalogueMediaState = "verified" | "context-only" | "pending";
```

Add `evidenceTier`, `mediaState`, and `sourceNotes` to `CatalogueRecord`; retain `evidenceStatus` for existing UI compatibility.

- [ ] **Step 4: Run the focused tests and verify type failures now identify missing record fields**

Run: `npm run typecheck`

- [ ] **Step 5: Commit the contract and model**

```bash
git add src/features/catalogue/catalogue-types.ts tests/content/catalogue-expansion-contract.test.ts tests/unit/catalogue-records.test.ts
git commit -m "test: define catalogue expansion contract"
```

### Task 2: Complete Weapon and Vehicle Records and Eliminate Count Drift

**Files:**
- Modify: `src/features/catalogue/catalogue-records.ts`
- Modify: `src/features/catalogue/catalogue-groups.ts`
- Modify: `src/features/catalogue/catalogue-localization.ts`
- Modify: `src/features/items/item-catalog-guides.ts`
- Modify: `tests/unit/item-catalog-guides.test.ts`
- Modify: `tests/unit/item-metadata.test.ts`

**Interfaces:**
- Consumes: evidence/media fields from Task 1.
- Produces: 38 weapon records, 28 vehicle records, and `getCatalogEntryCount(id)` values derived from records for record-backed categories.

- [ ] **Step 1: Add failing assertions for record-backed labels and metadata**

```ts
expect(getCatalogEntryCount("weapons")).toBe(getCatalogueRecords("weapons").length);
expect(getCatalogGuide("weapons")?.title).toContain("38");
expect(getCatalogEntryCount("vehicles")).toBe(28);
```

- [ ] **Step 2: Run the focused tests and confirm the hard-coded 33/20 values fail**

Run: `npx vitest run tests/unit/item-catalog-guides.test.ts tests/unit/item-metadata.test.ts`

- [ ] **Step 3: Add the 24 missing weapon records**

Add M4, T-21, M249 SAW, PKM, SKS, SVD, M1911, M500, MP43, MP5, PP-19 Vityaz, Super-45, MK22, Mosin Nagant, Scout Rifle TD, SV98, 9K333 Verba, MAAWS, MGL-40, RPG-7, M12G, AT4, Browning MG, and G60. The last four use `identifier-only`, unknown facts, and `mediaState: "pending"` unless a specific source frame is verified.

- [ ] **Step 4: Add the eight missing vehicle records**

Add the observed M113 APC SV identifiers plus Loudspeaker, Talon 9K-SAM, L81 Mortar, Vanguard CIWS, and Stingray. Preserve ambiguous duplicate identifiers as identifier-only records with unique source-neutral slugs.

- [ ] **Step 5: Generate weapon/vehicle counts from `getCatalogueRecords`**

```ts
export function getCatalogEntryCount(id: string): number {
  if (id === "weapons" || id === "vehicles") return getCatalogueRecords(id).length;
  const guide = getCatalogGuide(id);
  return guide ? guide.sections.reduce((total, section) => total + section.rows.length, 0) : 0;
}
```

Build the English title and count label from that value so visible cards, metadata, structured data, and routes agree.

- [ ] **Step 6: Expand filter translations and evidence labels for all locales**

Add localized labels for launchers, LMGs, shotguns, stationary systems, identifier-only evidence, image pending, Alpha observations, and Beta observations.

- [ ] **Step 7: Run unit, content-contract, and type checks**

Run: `npx vitest run tests/content/catalogue-expansion-contract.test.ts tests/unit/catalogue-records.test.ts tests/unit/item-catalog-guides.test.ts tests/unit/item-metadata.test.ts`

Run: `npm run typecheck`

- [ ] **Step 8: Commit the record expansion**

```bash
git add src/features/catalogue src/features/items/item-catalog-guides.ts tests/content/catalogue-expansion-contract.test.ts tests/unit
git commit -m "feat: complete weapon and vehicle catalogues"
```

### Task 3: Auditable Catalogue Media

**Files:**
- Create: `src/features/catalogue/catalogue-media-sources.ts`
- Modify: `src/features/catalogue/catalogue-media.ts`
- Modify: `src/features/catalogue/catalogue-records.ts`
- Add: `public/images/catalogue/weapons/*.webp`
- Add: `public/images/catalogue/vehicles/*.webp`
- Add: `public/images/guides/catalogue-expansion/*.webp`
- Modify: `tests/unit/catalogue-assets.test.ts`
- Create: `tests/unit/catalogue-media-sources.test.ts`

**Interfaces:**
- Consumes: public asset paths and `CatalogueMediaState`.
- Produces: `catalogueMediaSources: Record<string, CatalogueMediaSource>` where each entry contains `sourceUrl`, `sourceLabel`, `capturedAt`, `retrievedAt`, and `usageNote`.

- [ ] **Step 1: Write failing provenance and file-integrity tests**

```ts
for (const record of catalogueRecords.filter((item) => item.mediaState !== "pending")) {
  expect(existsSync(join(process.cwd(), "public", record.image))).toBe(true);
  expect(catalogueMediaSources[record.image]).toBeDefined();
}
expect(JSON.stringify(catalogueMediaSources)).not.toMatch(/wardogs(?:hub|zone)|watermark/i);
```

- [ ] **Step 2: Run the media tests and confirm missing manifest entries fail**

Run: `npx vitest run tests/unit/catalogue-assets.test.ts tests/unit/catalogue-media-sources.test.ts`

- [ ] **Step 3: Collect official contextual art and identifiable video frames**

Use Team17/Steam press assets for category/guide art. Capture a specific weapon or vehicle frame only where the item name/model is visible or the source chapter identifies it; record the YouTube URL and timestamp for every capture.

- [ ] **Step 4: Normalize verified assets to WebP**

Keep stable card dimensions, avoid upscaling tiny sources, and target practical catalogue thumbnail sizes under 250 KB where source quality permits.

- [ ] **Step 5: Implement the checked-in media manifest**

```ts
export type CatalogueMediaSource = {
  sourceUrl: string;
  sourceLabel: string;
  capturedAt?: string;
  retrievedAt: "2026-08-30";
  usageNote: string;
};
```

Existing approved art receives an explicit legacy approval/source note; new frames receive exact source timestamps. Unknown identifiers remain visually pending.

- [ ] **Step 6: Run media tests and inspect representative images**

Run: `npx vitest run tests/unit/catalogue-assets.test.ts tests/unit/catalogue-media-sources.test.ts`

Use `view_image` on at least one rifle, launcher, sidearm, helicopter, tracked vehicle, stationary system, and pending card state.

- [ ] **Step 7: Commit the media pipeline and assets**

```bash
git add src/features/catalogue public/images/catalogue public/images/guides/catalogue-expansion tests/unit/catalogue-assets.test.ts tests/unit/catalogue-media-sources.test.ts
git commit -m "feat: add source-audited catalogue media"
```

### Task 4: Four High-Intent Guides in Five Languages

**Files:**
- Create: `content/{en,de,ru,pt-br,ja}/guides/wardogs-best-weapons-loadouts.mdx`
- Create: `content/{en,de,ru,pt-br,ja}/guides/wardogs-armor-damage-ttk-guide.mdx`
- Create: `content/{en,de,ru,pt-br,ja}/guides/wardogs-medic-revive-guide.mdx`
- Create: `content/{en,de,ru,pt-br,ja}/guides/wardogs-equipment-tools-guide.mdx`
- Create: `tests/content/catalogue-player-guides.test.ts`
- Modify: `tests/content/localized-content-completeness.test.ts`

**Interfaces:**
- Consumes: catalogue item routes, current MDX schema, approved source policy.
- Produces: four slugs in all five locales, orders 40-43, source-backed FAQs, catalogue links, and substantial localized body copy.

- [ ] **Step 1: Write a failing five-locale guide contract**

```ts
for (const locale of ["en", "de", "ru", "pt-br", "ja"] as const) {
  for (const slug of requiredSlugs) {
    const guide = await loadGuideDocument(locale, slug);
    expect(guide?.body.length).toBeGreaterThanOrEqual(1_800);
    expect(guide?.frontmatter.sources.length).toBeGreaterThanOrEqual(2);
  }
}
```

- [ ] **Step 2: Run the guide contract and confirm all twenty documents are missing**

Run: `npx vitest run tests/content/catalogue-player-guides.test.ts`

- [ ] **Step 3: Author the four English guides**

Each guide starts with a direct answer, separates observed Build facts from recommendations, includes practical role/loadout tables, names uncertainty, links specific `/items/weapons/*`, `/items/vehicles/*`, and catalogue pages, and ends with source/last-checked and related-guide sections.

- [ ] **Step 4: Author complete German and Russian versions**

Translate meaning and player terminology rather than sentence order. Preserve item names, URLs, Build labels, units, prices, and uncertainty.

- [ ] **Step 5: Author complete Brazilian Portuguese and Japanese versions**

Use local-language headings, FAQs, descriptions, recommendations, and warnings. Do not retain English structural headings in translated bodies.

- [ ] **Step 6: Run all content tests**

Run: `npm run content:validate`

- [ ] **Step 7: Commit the localized guide set**

```bash
git add content tests/content/catalogue-player-guides.test.ts tests/content/localized-content-completeness.test.ts
git commit -m "feat: publish localized combat and support guides"
```

### Task 5: Discovery, Internal Links, and Pending Media UI

**Files:**
- Modify: `src/components/catalogue/catalogue-explorer.tsx`
- Modify: `src/components/catalogue/catalogue-category-view.tsx`
- Modify: `src/features/items/item-catalog-guide.tsx`
- Modify: `src/features/items/item-library.ts`
- Modify: `src/features/home/home-data.ts`
- Modify: `src/components/home/priority-guides.tsx`
- Modify: `src/app/[locale]/items/[type]/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/unit/catalogue-explorer.test.tsx`
- Modify: `tests/unit/item-catalog-guide-view.test.tsx`
- Modify: `tests/unit/sitemap.test.ts`

**Interfaces:**
- Consumes: media states, new guide slugs, record routes.
- Produces: explicit pending-media rendering, guide-to-item links, item-to-guide links, and discoverable sitemap/home/category entries.

- [ ] **Step 1: Add failing rendering and discovery tests**

Assert that pending records render a localized “image verification pending” state without a broken `<img>`, the four guides appear in discovery surfaces, and sitemap alternates include all five locales.

- [ ] **Step 2: Run focused UI and sitemap tests and confirm failure**

Run: `npx vitest run tests/unit/catalogue-explorer.test.tsx tests/unit/item-catalog-guide-view.test.tsx tests/unit/sitemap.test.ts`

- [ ] **Step 3: Implement stable pending-media cards**

Render an aspect-ratio-stable neutral panel with an icon and localized evidence label. Do not use a fake product image.

- [ ] **Step 4: Add guide/item cross-links and discovery priority**

Prioritize Weapons, Vehicles, Best Loadouts, Armor/TTK, Medic/Revive, and Equipment/Tools in the catalogue and guide surfaces while retaining existing navigation behavior.

- [ ] **Step 5: Verify ad and analytics invariants**

Assert the release did not add ad formats or a manual `page_view`; retain existing Native and 300x250 placements in long articles.

- [ ] **Step 6: Run focused UI, sitemap, and accessibility tests**

Run: `npx vitest run tests/unit/catalogue-explorer.test.tsx tests/unit/item-catalog-guide-view.test.tsx tests/unit/sitemap.test.ts`

- [ ] **Step 7: Commit discovery and UI changes**

```bash
git add src tests/unit
git commit -m "feat: connect catalogue and player guides"
```

### Task 6: Release Verification and Production Deployment

**Files:**
- Modify only if verification finds a scoped defect.

**Interfaces:**
- Consumes: the complete release branch.
- Produces: a pushed production commit and verified public URLs.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test`

Run: `npm run lint`

Run: `npm run typecheck`

Run: `npm run build`

- [ ] **Step 2: Start the local production app**

Run: `npm run start -- --hostname 127.0.0.1 --port 3100`

- [ ] **Step 3: Perform desktop and mobile visual QA**

Capture `/en/items/weapons`, `/ja/items/weapons`, one verified detail route, one pending record state, and each new guide at desktop and mobile widths. Check nonblank media, text containment, filter stability, table overflow, ad spacing, and no overlapping controls.

- [ ] **Step 4: Commit any verification-only fixes and rerun affected checks**

Use a scoped `fix:` commit and repeat the failed command plus `npm run build`.

- [ ] **Step 5: Push the release branch and fast-forward production main**

```bash
git push -u origin codex/wardogs-content-expansion
git push origin codex/wardogs-content-expansion:main
```

- [ ] **Step 6: Verify the Vercel production deployment**

Poll the production domain until the deployment commit is live. Confirm HTTP 200 for the four English guide URLs, at least one translated URL per guide family, `/en/items/weapons`, `/en/items/vehicles`, and representative new item routes.

- [ ] **Step 7: Verify production indexing surfaces**

Confirm `sitemap.xml` contains all four guide slugs with locale alternates, item category counts match visible records, and no production image request returns 404.
