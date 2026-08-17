# WARDOGS Catalogue Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the WARDOGS Wiki navigation, homepage, catalogue, ad stability, and item content while displaying 99 supplied records and adding 34 substantial English model pages without changing existing URLs.

**Architecture:** Keep the existing Next.js App Router and static typed-data approach. Add a catalogue-record layer between category guide tables and editorial item articles, then render that layer through reusable server-first grids with optional client-side filtering. Deliver the work in two releases: the visual catalogue architecture first, followed by 14 weapon and 20 vehicle detail articles.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, next-intl, Tailwind CSS, lucide-react, Vitest, Playwright, static WebP assets.

## Global Constraints

- Preserve `/items` and every existing public URL.
- Display `Catalogue` in navigation and `WARDOGS Catalogue` on the hub.
- Show exactly 99 supplied image-backed catalogue records.
- Add exactly 14 weapon and 20 vehicle model articles in English first.
- Keep the six existing item articles and their current locale behavior.
- Do not create standalone ammo, attachment, or gear pages in this release.
- Do not add a database, CMS, API, authentication, or a new runtime dependency.
- Keep Alpha prices, unlocks, and balance claims visibly labeled as pre-release observations.
- Keep ads off the homepage, catalogue hub, and category pages.
- Preserve unrelated dirty files and untracked user assets; stage only files belonging to each task.
- Complete Release 1 verification before adding Release 2 URLs to the sitemap.

---

## File Structure

### New catalogue units

- `src/features/catalogue/catalogue-types.ts`: record, group, filter, and evidence contracts.
- `src/features/catalogue/catalogue-records.ts`: the 99 image-backed records and lookup functions.
- `src/features/catalogue/catalogue-groups.ts`: category presentation, banner, count, and homepage feature data.
- `src/components/catalogue/catalogue-card.tsx`: one visual record with either a detail link or inline facts.
- `src/components/catalogue/catalogue-explorer.tsx`: client-side search/filter enhancement over server-rendered records.
- `src/components/catalogue/catalogue-home-band.tsx`: homepage category entry band.
- `src/components/catalogue/catalogue-category-view.tsx`: record grid, filters, and links around the existing table guide.

### New navigation units

- `src/features/navigation/navigation-data.ts`: grouped navigation contracts and translated link builder.
- `src/components/layout/desktop-navigation.tsx`: accessible desktop dropdown interactions.
- `src/components/layout/mobile-navigation-groups.tsx`: mobile accordion groups inside the existing menu overlay.

### Release 2 editorial units

- `src/features/items/weapon-items.ts`: 14 manually authored weapon articles.
- `src/features/items/vehicle-items.ts`: 20 manually authored vehicle articles.
- `src/features/items/item-sources.ts`: shared official and creator source constants.

### Asset destinations

```text
public/images/catalogue/weapons/
public/images/catalogue/vehicles/
public/images/catalogue/ammo/
public/images/catalogue/attachments/
public/images/catalogue/gear/
public/images/catalogue/factions/
public/images/catalogue/banners/
```

---

## Release 1: Architecture and Visual Catalogue

### Task 1: Import and Validate Approved Catalogue Assets

**Files:**
- Create: `public/images/catalogue/**`
- Create: `tests/unit/catalogue-assets.test.ts`
- Source: `C:/Users/user/Downloads/untitled folder 2/*.webp`

**Interfaces:**
- Produces: stable image URLs rooted at `/images/catalogue/{category}/{slug}.webp`.
- Produces: one unique 1280px banner per supported composition.

- [ ] **Step 1: Write the failing asset inventory test**

```ts
import {existsSync, readdirSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";

const root = join(process.cwd(), "public", "images", "catalogue");

describe("catalogue assets", () => {
  it("imports the approved image inventory", () => {
    expect(readdirSync(join(root, "weapons"))).toHaveLength(14);
    expect(readdirSync(join(root, "vehicles"))).toHaveLength(20);
    expect(readdirSync(join(root, "ammo"))).toHaveLength(14);
    expect(readdirSync(join(root, "attachments"))).toHaveLength(40);
    expect(readdirSync(join(root, "gear"))).toHaveLength(11);
    expect(readdirSync(join(root, "factions"))).toHaveLength(3);
  });

  it("normalizes the three incorrect source names", () => {
    expect(existsSync(join(root, "ammo", "12-7x55mm.webp"))).toBe(true);
    expect(existsSync(join(root, "ammo", "338-norma-magnum-fmj.webp"))).toBe(true);
    expect(existsSync(join(root, "ammo", "5-45x39mm-fmj.webp"))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/unit/catalogue-assets.test.ts`

Expected: FAIL because `public/images/catalogue` does not exist.

- [ ] **Step 3: Copy assets into category directories**

Use PowerShell `Copy-Item -LiteralPath` for binary assets. Remove the category prefix from destination filenames, lowercase load suffixes, apply the three approved corrections, copy the three faction marks, and copy only the `1280` variant for attachments, loadouts, map, meta, the-game, vehicles, and weapons banners. Do not copy `.DS_Store` or the 780/1600/2098/2112/2114 variants.

Expected inventory:

```text
weapons=14
vehicles=20
ammo=14
attachments=40
gear=11
factions=3
banners=7
```

- [ ] **Step 4: Run the asset test**

Run: `npx vitest run tests/unit/catalogue-assets.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the approved assets**

```bash
git add public/images/catalogue tests/unit/catalogue-assets.test.ts
git commit -m "feat: add approved catalogue artwork"
```

### Task 2: Add the 99-Record Catalogue Model

**Files:**
- Create: `src/features/catalogue/catalogue-types.ts`
- Create: `src/features/catalogue/catalogue-records.ts`
- Create: `src/features/catalogue/catalogue-groups.ts`
- Create: `tests/unit/catalogue-records.test.ts`
- Modify: `src/features/items/item-catalog-guides.ts`

**Interfaces:**
- Produces: `CatalogueRecord`, `CatalogueRecordType`, and `CatalogueFilterOption`.
- Produces: `catalogueRecords`, `getCatalogueRecords(type)`, `getCatalogueRecord(type, slug)`, and `getCatalogueGroup(type)`.
- Consumes: observed prices, roles, unlock gates, calibres, and tiers from `item-catalog-guides.ts`.

- [ ] **Step 1: Write the failing record tests**

```ts
import {describe, expect, it} from "vitest";
import {
  catalogueRecords,
  getCatalogueRecord,
  getCatalogueRecords
} from "../../src/features/catalogue/catalogue-records";

describe("catalogue records", () => {
  it("exposes exactly 99 image-backed records", () => {
    expect(catalogueRecords).toHaveLength(99);
    expect(getCatalogueRecords("weapons")).toHaveLength(14);
    expect(getCatalogueRecords("vehicles")).toHaveLength(20);
    expect(getCatalogueRecords("ammo")).toHaveLength(14);
    expect(getCatalogueRecords("attachments")).toHaveLength(40);
    expect(getCatalogueRecords("gear")).toHaveLength(11);
  });

  it("plans only weapons and vehicles for the new detail rollout", () => {
    const newDetails = catalogueRecords.filter((record) => record.detailStatus === "planned");
    expect(newDetails).toHaveLength(34);
    expect(newDetails.every((record) => record.type === "weapons" || record.type === "vehicles")).toBe(true);
    expect(newDetails.every((record) => record.detailHref === undefined)).toBe(true);
  });

  it("keeps inline records useful without fake routes", () => {
    const ammo = getCatalogueRecord("ammo", "5-56x45mm");
    expect(ammo?.detailStatus).toBe("inline");
    expect(ammo?.detailHref).toBeUndefined();
    expect(ammo?.facts.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run tests/unit/catalogue-records.test.ts`

Expected: FAIL because the catalogue modules do not exist.

- [ ] **Step 3: Define the contracts**

```ts
export type CatalogueRecordType = "weapons" | "vehicles" | "ammo" | "attachments" | "gear";

export type CatalogueRecord = {
  slug: string;
  name: string;
  type: CatalogueRecordType;
  subtype: string;
  image: string;
  imageAlt: string;
  summary: string;
  facts: readonly {label: string; value: string}[];
  filterValues: readonly string[];
  detailStatus: "inline" | "planned" | "published";
  detailHref?: `/items/${"weapons" | "vehicles"}/${string}`;
  evidenceStatus: "official" | "verified-in-game" | "pre-release-build" | "community-report";
  dataAsOf: string;
};
```

- [ ] **Step 4: Author the record arrays**

Create five explicit arrays. Use the normalized image URL for each entry, copy only observed facts from the existing catalogue tables, and use `Not captured` rather than inventing a missing value.

The weapon detail slugs are exactly:

```ts
[
  "a-91", "ak74", "amp-9", "amr-50", "bmr-308", "bushmaster-m17s",
  "compound-bow", "deagle", "fal", "galil", "ggx-17", "ggx-18", "judge", "kh-2002"
]
```

The vehicle detail slugs are exactly:

```ts
[
  "ah-6m-miniguns", "ah-6r-rockets", "bobcat", "dune-buggy", "flakpanzer-gepard",
  "havoc", "humvee-m249", "humvee-minigun", "humvee", "kodiak-m249",
  "kodiak-pickup", "kodiak", "l2a6", "mh-6", "sph-2", "uh-1y-miniguns",
  "uh-1y", "ural-defender-m249", "ural-defender", "ural"
]
```

- [ ] **Step 5: Keep category guide counts independent**

Do not change the existing observed table totals of 33 weapons, 20 vehicles, 14 calibres, 55 attachments, 11 gear records, 13 equipment records, and 3 loadout bands. The image-backed grid count and the complete observed table count are different facts.

- [ ] **Step 6: Run catalogue and existing guide tests**

Run: `npx vitest run tests/unit/catalogue-records.test.ts tests/unit/item-catalog-guides.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit the catalogue model**

```bash
git add src/features/catalogue src/features/items/item-catalog-guides.ts tests/unit/catalogue-records.test.ts
git commit -m "feat: model the visual wardogs catalogue"
```

### Task 3: Replace the Flat Header With Grouped Navigation

**Files:**
- Create: `src/features/navigation/navigation-data.ts`
- Create: `src/components/layout/desktop-navigation.tsx`
- Create: `src/components/layout/mobile-navigation-groups.tsx`
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/components/layout/mobile-nav.tsx`
- Modify: `messages/en.json`
- Modify: `messages/ru.json`
- Modify: `messages/de.json`
- Modify: `messages/pt-br.json`
- Create: `tests/unit/navigation-data.test.ts`
- Modify: `tests/e2e/navigation.spec.ts`

**Interfaces:**
- Produces: `buildNavigation(t): NavigationGroup[]`.
- Produces: `DesktopNavigation({groups, label})` and grouped mobile menu rendering.

- [ ] **Step 1: Write the failing navigation data test**

```ts
import {describe, expect, it} from "vitest";
import {buildNavigation} from "../../src/features/navigation/navigation-data";

describe("grouped navigation", () => {
  it("exposes five primary destinations with catalogue children", () => {
    const groups = buildNavigation((key) => key);
    expect(groups.map((group) => group.id)).toEqual(["game", "guides", "catalogue", "videos", "news"]);
    expect(groups.find((group) => group.id === "catalogue")?.items.map((item) => item.href)).toEqual([
      "/items", "/items/weapons", "/items/vehicles", "/items/ammo",
      "/items/attachments", "/items/gear", "/items/equipment", "/items/loadouts"
    ]);
  });
});
```

- [ ] **Step 2: Run the unit test to verify it fails**

Run: `npx vitest run tests/unit/navigation-data.test.ts`

Expected: FAIL because `navigation-data.ts` does not exist.

- [ ] **Step 3: Implement navigation data and translation keys**

Use the exact groups from the approved design. `Videos` and `News` are direct links represented by groups with `href`; `Game`, `Guides`, and `Catalogue` contain child items.

- [ ] **Step 4: Implement accessible desktop dropdowns**

Use buttons with `aria-expanded`, `aria-controls`, Escape handling, focus return, outside-click close, and stable trigger widths. Use `ChevronDown` from lucide-react. Do not use hover as the only activation path.

- [ ] **Step 5: Implement grouped mobile accordions**

Keep the existing overlay, focus trap, and Escape behavior. Each group button controls one child list; direct links remain direct rows. Close the entire menu after route navigation.

- [ ] **Step 6: Add failing Playwright expectations and run them**

Add assertions that desktop `Catalogue` opens and contains `/en/items/weapons`, that keyboard Escape closes it and returns focus, and that mobile `Catalogue` expands inside the menu.

Run: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/navigation.spec.ts`

Expected before final fixes: FAIL on the new grouped-nav assertions.

- [ ] **Step 7: Complete interaction fixes and rerun tests**

Run: `npx vitest run tests/unit/navigation-data.test.ts tests/unit/messages.test.ts`

Run: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/navigation.spec.ts`

Expected: PASS.

- [ ] **Step 8: Commit navigation**

```bash
git add src/features/navigation src/components/layout messages tests/unit/navigation-data.test.ts tests/e2e/navigation.spec.ts
git commit -m "feat: group the primary site navigation"
```

### Task 4: Add the Homepage Catalogue Band and Reorder Content

**Files:**
- Create: `src/components/catalogue/catalogue-home-band.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/ru.json`
- Modify: `messages/de.json`
- Modify: `messages/pt-br.json`
- Create: `tests/unit/catalogue-home-band.test.tsx`
- Modify: `tests/e2e/routes.spec.ts`
- Modify: `tests/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: `catalogueGroups` and `getCatalogueRecords(type)`.
- Produces: homepage links to the six promoted category routes.

- [ ] **Step 1: Write the failing static-render test**

Render a pure `CatalogueHomeBandView` with English labels and assert that Weapons and Vehicles have image-backed links, Ammo/Attachments/Gear/Loadouts are present, and Equipment is absent from the promoted band.

- [ ] **Step 2: Run the unit test to verify it fails**

Run: `npx vitest run tests/unit/catalogue-home-band.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the band**

Use one wide Weapons feature, one wide Vehicles feature, and four compact entries. Use category imagery as the first visual signal, `next/image`, six crawlable links, accurate visible counts, and no nested cards.

- [ ] **Step 4: Reorder homepage components**

Set the exact order:

```tsx
<HomeHero />
<StartHere />
<PriorityGuides />
<CatalogueHomeBand />
<VideoIntelligence />
<CategoryGrid />
<AboutGame />
<OfficialMedia />
<BeginnerTips />
<HomeFaq />
<FinalCta />
```

- [ ] **Step 5: Add route and responsive assertions**

Verify the `WARDOGS Catalogue` heading occurs before `Video Intelligence`, all six links resolve, every image loads, and widths 390/768/1440/1920 have no horizontal overflow.

- [ ] **Step 6: Run focused tests**

Run: `npx vitest run tests/unit/catalogue-home-band.test.tsx tests/unit/messages.test.ts`

Run: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/routes.spec.ts tests/e2e/responsive.spec.ts`

Expected: PASS.

- [ ] **Step 7: Commit homepage changes**

```bash
git add src/app/[locale]/page.tsx src/components/catalogue/catalogue-home-band.tsx messages tests/unit/catalogue-home-band.test.tsx tests/e2e/routes.spec.ts tests/e2e/responsive.spec.ts
git commit -m "feat: promote the catalogue on the homepage"
```

### Task 5: Upgrade the Catalogue Hub

**Files:**
- Modify: `src/app/[locale]/items/page.tsx`
- Create: `src/components/catalogue/catalogue-category-card.tsx`
- Modify: `src/lib/item-metadata.ts`
- Modify: `src/lib/item-structured-data.ts`
- Modify: `tests/unit/item-metadata.test.ts`
- Modify: `tests/unit/item-structured-data.test.ts`
- Modify: `tests/e2e/routes.spec.ts`

**Interfaces:**
- Consumes: `catalogueGroups`, existing `itemTypes`, and existing featured item articles.
- Produces: the English canonical `WARDOGS Catalogue` hub at `/en/items`.

- [ ] **Step 1: Update tests first**

Assert that hub metadata title begins `WARDOGS Catalogue`, JSON-LD CollectionPage name is `WARDOGS Catalogue`, and the page contains category images, counts, evidence legend, featured Weapons, and featured Vehicles.

- [ ] **Step 2: Run focused tests to verify failure**

Run: `npx vitest run tests/unit/item-metadata.test.ts tests/unit/item-structured-data.test.ts`

Expected: FAIL on the old `WARDOGS Items` names.

- [ ] **Step 3: Implement the hub**

Use a compact banner hero, seven category entries, an evidence legend, two model preview rows, and links to Equipment and Loadouts. Do not repeat the full Alpha tables on this page.

- [ ] **Step 4: Preserve canonical and locale policy**

Keep `/en/items` canonical. Keep non-English hub pages `noindex,follow` and canonicalized to English.

- [ ] **Step 5: Run focused tests**

Run: `npx vitest run tests/unit/item-metadata.test.ts tests/unit/item-structured-data.test.ts`

Run: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/routes.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit the hub**

```bash
git add src/app/[locale]/items/page.tsx src/components/catalogue/catalogue-category-card.tsx src/lib/item-metadata.ts src/lib/item-structured-data.ts tests
git commit -m "feat: upgrade the wardogs catalogue hub"
```

### Task 6: Add Image Grids, Anchors, and Filters to Category Pages

**Files:**
- Create: `src/components/catalogue/catalogue-card.tsx`
- Create: `src/components/catalogue/catalogue-explorer.tsx`
- Create: `src/components/catalogue/catalogue-category-view.tsx`
- Modify: `src/app/[locale]/items/[type]/page.tsx`
- Modify: `src/features/items/item-catalog-guide.tsx`
- Create: `tests/unit/catalogue-explorer.test.tsx`
- Modify: `tests/unit/item-catalog-guide-view.test.tsx`
- Modify: `tests/e2e/routes.spec.ts`
- Modify: `tests/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: `getCatalogueRecords(type)` and catalogue guide sections.
- Produces: stable record ids `record-{type}-{slug}`.
- Produces: `CatalogueExplorer({records, filters, labels})` with non-indexing client state.

- [ ] **Step 1: Write failing component tests**

Assert that an inline Ammo record renders facts without an anchor to a missing detail page, a Weapon record links to `/items/weapons/ak74`, and filters hide unmatched cards without removing records from the server markup.

- [ ] **Step 2: Run tests to verify failure**

Run: `npx vitest run tests/unit/catalogue-explorer.test.tsx tests/unit/item-catalog-guide-view.test.tsx`

Expected: FAIL because the explorer and record links do not exist.

- [ ] **Step 3: Implement server-first cards and client filtering**

Render every record before hydration. Keep filter state in React only; do not update query parameters. Provide a text search plus the approved category filter values. Use stable card dimensions and contained transparent images.

- [ ] **Step 4: Link tables to records safely**

Add an optional `recordSlug` to matched table rows. The first cell links to the detail page only when `detailStatus` is `published` and `detailHref` exists; `planned` and `inline` records link to `#record-{type}-{slug}`. Leave rows without a supplied image as plain table rows.

- [ ] **Step 5: Add category banner heroes**

Use approved category banners for Weapons, Vehicles, Ammo, Attachments, Gear, and Loadouts. Equipment keeps the existing image until approved item art exists.

- [ ] **Step 6: Run unit and browser tests**

Run: `npx vitest run tests/unit/catalogue-explorer.test.tsx tests/unit/item-catalog-guide-view.test.tsx tests/unit/item-catalog-guides.test.ts`

Run: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/routes.spec.ts tests/e2e/responsive.spec.ts`

Expected: PASS with all 99 images loaded and no missing detail links.

- [ ] **Step 7: Commit category exploration**

```bash
git add src/components/catalogue src/app/[locale]/items/[type]/page.tsx src/features/items/item-catalog-guide.tsx tests
git commit -m "feat: add visual catalogue explorers"
```

### Task 7: Stabilize the Native Advertisement Slot

**Files:**
- Modify: `src/components/ads/adsterra-native-banner.tsx`
- Modify: `tests/unit/adsterra-native-banner.test.ts`
- Modify: `tests/e2e/routes.spec.ts`

**Interfaces:**
- Preserves: `AdsterraNativeBanner({label})`.
- Adds: fixed 4:1 shell and internal recommendation fallback after no fill.

- [ ] **Step 1: Change the unit test first**

Assert that the empty timeout changes the slot to `data-state="fallback"` instead of removing it, and that the fallback contains an internal `/items` link while the shell retains `aspect-ratio: 4 / 1` behavior.

- [ ] **Step 2: Run the test to verify failure**

Run: `npx vitest run tests/unit/adsterra-native-banner.test.ts`

Expected: FAIL because the current component returns `null` after no fill.

- [ ] **Step 3: Implement stable fallback behavior**

Keep the Adsterra script lifecycle and cleanup. On script error or eight-second no-fill, remove the empty external container content, set state to fallback, and render an internal catalogue recommendation inside the same bounded shell. When Adsterra fills, set state to filled and hide the fallback.

- [ ] **Step 4: Verify placement policy and layout**

Keep one ad on guide, video, and item detail pages only. Assert zero ad slots on home, guides index, videos index, catalogue hub, and category pages. Compare the slot bounding box before and after the no-fill timeout; height change must be at most one CSS pixel.

- [ ] **Step 5: Run focused tests**

Run: `npx vitest run tests/unit/adsterra-native-banner.test.ts`

Run: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/routes.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit ad stability**

```bash
git add src/components/ads/adsterra-native-banner.tsx tests/unit/adsterra-native-banner.test.ts tests/e2e/routes.spec.ts
git commit -m "fix: keep native ad slots layout-stable"
```

### Task 8: Complete Release 1 SEO, Structured Data, and Verification

**Files:**
- Modify: `src/lib/item-structured-data.ts`
- Modify: `src/lib/item-metadata.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `tests/unit/item-structured-data.test.ts`
- Modify: `tests/unit/sitemap.test.ts`
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/visual.spec.ts`

**Interfaces:**
- Preserves: the Release 1 URL inventory; no new model article URL is indexable yet.
- Produces: CollectionPage and ItemList entries that match visible catalogue records and anchors.

- [ ] **Step 1: Add failing structured-data assertions**

Assert that Weapons ItemList entries use detail URLs only for existing legacy articles and anchors for image-backed records whose model article is not yet generated. Assert that schema image URLs exist.

- [ ] **Step 2: Run tests to verify failure**

Run: `npx vitest run tests/unit/item-structured-data.test.ts tests/unit/sitemap.test.ts`

Expected: FAIL on new visible record expectations while sitemap remains unchanged.

- [ ] **Step 3: Update schema and metadata**

Use catalogue images in hub/category metadata, match visible names and counts, preserve English-only category canonicals, and keep unsupported Product/Offer/Rating fields absent.

- [ ] **Step 4: Run the complete Release 1 gate**

Run: `npm run lint`

Run: `npm run typecheck`

Run: `npm test`

Run: `npm run build`

Run: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/navigation.spec.ts tests/e2e/routes.spec.ts tests/e2e/responsive.spec.ts tests/e2e/accessibility.spec.ts`

Expected: all commands exit 0.

- [ ] **Step 5: Review screenshots and image pixels**

Capture `/en`, `/en/items`, `/en/items/weapons`, and `/en/items/vehicles` at 390x844 and 1440x1200. Verify nonblank imagery, no text overlap, stable headers, no nested cards, and no horizontal overflow.

- [ ] **Step 6: Commit the Release 1 SEO gate**

```bash
git add src/lib src/app/sitemap.ts tests
git commit -m "feat: complete catalogue architecture rollout"
```

---

## Release 2: Weapon and Vehicle Model Articles

### Task 9: Add Item-Specific Detail Imagery and Article Fields

**Files:**
- Modify: `src/features/items/item-library.ts`
- Create: `src/features/items/item-sources.ts`
- Modify: `src/app/[locale]/items/[type]/[slug]/page.tsx`
- Modify: `src/lib/item-metadata.ts`
- Modify: `src/lib/item-structured-data.ts`
- Modify: `tests/unit/item-library.test.ts`
- Modify: `tests/unit/item-metadata.test.ts`
- Modify: `tests/unit/item-structured-data.test.ts`

**Interfaces:**
- Extends: `WardogsItem` with required image fields for new model articles and optional observed price, unlock, ammo/class, confirmation notes, and updated date.
- Preserves: compatibility with the six legacy items.

- [ ] **Step 1: Write failing item-image and metadata tests**

Assert that a model item can expose its exact image, metadata Open Graph uses it, Article JSON-LD uses it, and legacy Mortar continues to use its current image or generic fallback.

- [ ] **Step 2: Run tests to verify failure**

Run: `npx vitest run tests/unit/item-library.test.ts tests/unit/item-metadata.test.ts tests/unit/item-structured-data.test.ts`

Expected: FAIL because item metadata still uses `/images/og-wardogs.jpg`.

- [ ] **Step 3: Add shared sources and detail fields**

Move only reusable source constants into `item-sources.ts`. Keep legacy article bodies in `item-library.ts`; do not rewrite unrelated content.

- [ ] **Step 4: Upgrade the detail template**

Render the exact item image in the header, Quick Facts for price/unlock/ammo or vehicle class, model-specific confirmed/unconfirmed section, and existing strengths, cautions, sources, related guides, related items, and ad slot.

- [ ] **Step 5: Run focused tests**

Run: `npx vitest run tests/unit/item-library.test.ts tests/unit/item-metadata.test.ts tests/unit/item-structured-data.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit the detail foundation**

```bash
git add src/features/items src/app/[locale]/items/[type]/[slug]/page.tsx src/lib/item-metadata.ts src/lib/item-structured-data.ts tests/unit
git commit -m "feat: support image-rich model articles"
```

### Task 10: Author 14 Weapon Articles

**Files:**
- Create: `src/features/items/weapon-items.ts`
- Modify: `src/features/items/item-library.ts`
- Modify: `src/features/catalogue/catalogue-records.ts`
- Modify: `tests/unit/item-library.test.ts`
- Modify: `tests/e2e/routes.spec.ts`

**Interfaces:**
- Produces: `weaponItems: readonly WardogsItem[]` with 14 English-only records.
- Consumes: catalogue facts, exact weapon images, and approved sources.

- [ ] **Step 1: Add failing inventory and quality tests**

```ts
const weaponModels = itemLibrary.filter((item) => item.type === "weapons" && item.slug !== "mortar");
expect(weaponModels).toHaveLength(14);
expect(weaponModels.every((item) => item.indexLocales.length === 1 && item.indexLocales[0] === "en")).toBe(true);
expect(weaponModels.every((item) => item.facts.length >= 4)).toBe(true);
expect(weaponModels.every((item) => item.strengths.length >= 3 && item.cautions.length >= 3)).toBe(true);
expect(new Set(weaponModels.map((item) => item.description)).size).toBe(14);
```

- [ ] **Step 2: Run the tests to verify failure**

Run: `npx vitest run tests/unit/item-library.test.ts`

Expected: FAIL because the 14 model articles do not exist.

- [ ] **Step 3: Manually author all 14 weapon entries**

Use the exact slug inventory from Task 2. Each entry must contain model-specific price, ammunition, fire mode, weight/progression where observed, role, at least four facts, three strengths, three cautions, related ammo/attachments when known, related guides, sources, and `indexLocales: ["en"]`.

Do not derive descriptions from a shared sentence template. Do not call Alpha data final.

After every weapon article exists and passes its quality assertions, change the matching 14 catalogue records from `planned` to `published` and assign each exact English `detailHref`. Never publish a record link before its article exists.

- [ ] **Step 4: Add all 14 routes to Playwright coverage**

For every slug, assert status 200, one nonblank item image, one Quick Answer, one source section, and one native ad slot.

- [ ] **Step 5: Run focused tests**

Run: `npx vitest run tests/unit/item-library.test.ts`

Run: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/routes.spec.ts --grep "weapon model"`

Expected: PASS.

- [ ] **Step 6: Commit weapon articles**

```bash
git add src/features/items/weapon-items.ts src/features/items/item-library.ts src/features/catalogue/catalogue-records.ts tests/unit/item-library.test.ts tests/e2e/routes.spec.ts
git commit -m "feat: publish wardogs weapon model guides"
```

### Task 11: Author 20 Vehicle Articles

**Files:**
- Create: `src/features/items/vehicle-items.ts`
- Modify: `src/features/items/item-library.ts`
- Modify: `src/features/catalogue/catalogue-records.ts`
- Modify: `tests/unit/item-library.test.ts`
- Modify: `tests/e2e/routes.spec.ts`

**Interfaces:**
- Produces: `vehicleItems: readonly WardogsItem[]` with 20 English-only records.
- Consumes: catalogue prices, gates, roles, exact vehicle images, and approved sources.

- [ ] **Step 1: Add failing inventory and quality tests**

```ts
const modelSlugs = new Set([
  "ah-6m-miniguns", "ah-6r-rockets", "bobcat", "dune-buggy", "flakpanzer-gepard",
  "havoc", "humvee-m249", "humvee-minigun", "humvee", "kodiak-m249",
  "kodiak-pickup", "kodiak", "l2a6", "mh-6", "sph-2", "uh-1y-miniguns",
  "uh-1y", "ural-defender-m249", "ural-defender", "ural"
]);
const vehicleModels = itemLibrary.filter((item) => modelSlugs.has(item.slug));
expect(vehicleModels).toHaveLength(20);
expect(vehicleModels.every((item) => item.indexLocales.join() === "en")).toBe(true);
expect(new Set(vehicleModels.map((item) => item.description)).size).toBe(20);
```

- [ ] **Step 2: Run the test to verify failure**

Run: `npx vitest run tests/unit/item-library.test.ts`

Expected: FAIL because the 20 model articles do not exist.

- [ ] **Step 3: Manually author all 20 vehicle entries**

Use exact observed roles, prices, gates, and tracks. Distinguish transport, armed variants, logistics, armor, artillery, and aircraft. Each entry includes at least four facts, three strengths, three cautions, model relationships, generic role-page links where relevant, sources, and `indexLocales: ["en"]`.

After every vehicle article exists and passes its quality assertions, change the matching 20 catalogue records from `planned` to `published` and assign each exact English `detailHref`. Never publish a record link before its article exists.

- [ ] **Step 4: Add all 20 routes to Playwright coverage**

For every slug, assert status 200, image loaded, Quick Answer present, source section present, and no duplicate H1.

- [ ] **Step 5: Run focused tests**

Run: `npx vitest run tests/unit/item-library.test.ts`

Run: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test tests/e2e/routes.spec.ts --grep "vehicle model"`

Expected: PASS.

- [ ] **Step 6: Commit vehicle articles**

```bash
git add src/features/items/vehicle-items.ts src/features/items/item-library.ts src/features/catalogue/catalogue-records.ts tests/unit/item-library.test.ts tests/e2e/routes.spec.ts
git commit -m "feat: publish wardogs vehicle model guides"
```

### Task 12: Add Release 2 Sitemap, Internal Links, and Final Verification

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/lib/item-metadata.ts`
- Modify: `src/lib/item-structured-data.ts`
- Modify: `src/components/catalogue/catalogue-home-band.tsx`
- Modify: `src/app/[locale]/items/page.tsx`
- Modify: `tests/unit/sitemap.test.ts`
- Modify: `tests/unit/item-metadata.test.ts`
- Modify: `tests/unit/item-structured-data.test.ts`
- Modify: `tests/e2e/routes.spec.ts`
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/e2e/visual.spec.ts`

**Interfaces:**
- Produces: 34 new English sitemap URLs and English-only alternates for those model articles.
- Preserves: existing six detail URLs and their locale alternates.

- [ ] **Step 1: Add failing sitemap and link assertions**

Assert that all 34 new English URLs exist, none of their Russian/German/Portuguese copies exist in sitemap, and representative category/home links target the English canonical detail URL.

- [ ] **Step 2: Run tests to verify failure**

Run: `npx vitest run tests/unit/sitemap.test.ts tests/unit/item-metadata.test.ts tests/unit/item-structured-data.test.ts`

Expected: FAIL until all route inventory and alternates agree.

- [ ] **Step 3: Update sitemap and cross-links**

Use each article's actual `updatedAt` as `lastModified`. Keep category pages weekly, model articles weekly, and do not add anchors or filters. Feature a balanced selection of weapons and vehicles on the hub and homepage without removing core guide links.

- [ ] **Step 4: Run complete verification**

Run: `npm run lint`

Run: `npm run typecheck`

Run: `npm test`

Run: `npm run build`

Run: `$env:PLAYWRIGHT_EXECUTABLE_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; npx playwright test`

Expected: all commands exit 0 and all static model paths appear in the production build output.

- [ ] **Step 5: Run live-link and route inventory checks locally**

Start the production server on an unused port. Check home, catalogue hub, five visual categories, all 34 new model routes, the six legacy item routes, robots, and sitemap. Confirm no 404, soft 404, broken image, duplicate canonical, or missing ad placement.

- [ ] **Step 6: Commit Release 2 integration**

```bash
git add src/app src/lib src/components/catalogue tests
git commit -m "feat: complete the wardogs catalogue upgrade"
```

### Task 13: Push, Deploy in Two Releases, and Verify Production

**Files:**
- No new source files unless production verification finds a defect.

**Interfaces:**
- Consumes: verified Release 1 and Release 2 commits.
- Produces: GitHub-triggered Vercel deployments; do not use Vercel CLI.

- [ ] **Step 1: Confirm the staged diff contains no unrelated files**

Run: `git status -sb`

Run: `git diff --check origin/main...HEAD`

Expected: only approved catalogue upgrade commits are ahead; unrelated untracked files remain unstaged.

- [ ] **Step 2: Identify and push Release 1 through GitHub**

Run: `git log --grep="feat: complete catalogue architecture rollout" --format=%H -1`

Push the feature branch, then push that exact Release 1 boundary commit to `main` using the existing GitHub remote. Do not invoke Vercel CLI and do not push the Release 2 commits yet.

- [ ] **Step 3: Verify Release 1 production before Release 2**

Check production status, navigation, homepage, `/en/items`, all category pages, ad placement policy, robots, and sitemap. Confirm Googlebot and OAI-SearchBot user agents receive 200 and complete HTML.

- [ ] **Step 4: Push HEAD and verify Release 2**

After Release 1 production checks pass, push the verified branch HEAD to `main`. Verify representative weapon and vehicle pages, then run an HTTP inventory over all 34 new URLs. Confirm sitemap contains the same 34 English URLs and no untranslated alternates.

- [ ] **Step 5: Record Search Console follow-up**

Resubmit the existing `https://www.wardogswiki.com/sitemap.xml` only after Release 2 is live. Record 7-day, 14-day, and 28-day checks for indexed pages, Core Web Vitals, impressions, and crawl errors.

---

## Plan Completion Criteria

- Every task has a red-green test cycle and a scoped commit.
- Release 1 can deploy without exposing unfinished model URLs.
- Release 2 adds exactly 34 English model URLs.
- The final worktree preserves unrelated user changes.
- The production site remains reachable through all pre-upgrade URLs.
- The native ad remains detail-only and layout-stable.
- Googlebot and OAI-SearchBot receive complete server-rendered catalogue content.
