# WARDOGS Catalogue and Navigation Upgrade Design

## 1. Goal

Upgrade the existing WARDOGS Wiki into a clearer guide-and-catalogue site without changing its domain, framework, established guide URLs, or existing item URLs.

The upgrade must:

- Replace the crowded flat header with grouped navigation.
- Give the homepage a prominent visual path into the WARDOGS catalogue.
- Show all 99 supplied catalogue images in useful category pages.
- Add 34 substantial, indexable model pages: 14 weapons and 20 vehicles.
- Keep the other 65 image-backed records useful inside category pages without creating thin standalone pages.
- Preserve the current ad placement while improving its layout stability.
- Improve crawl discovery, internal linking, image search eligibility, and AI-search readability.

This is an extension of the current application, not a redesign, domain move, CMS migration, or URL migration.

## 2. Confirmed Product Decisions

- Use rollout option A.
- Preserve `/items` as the public URL namespace.
- Display `Catalogue` in navigation and `WARDOGS Catalogue` as the page name.
- Preserve every current guide, video, legal, news, and item URL.
- Keep the six existing detailed item articles.
- Add 14 weapon model pages and 20 vehicle model pages in English first.
- Show all 99 image-backed catalogue records in their category pages.
- Do not create standalone pages for ammo, attachments, or gear in this release.
- Do not create a database, CMS, API, account system, or client-side data service.
- Continue static generation from typed local data.
- Continue labeling Alpha and pre-release observations as non-final.
- Do not place ads on the homepage, catalogue hub, or category indexes.

## 3. Information Architecture

### 3.1 Primary Navigation

Replace the current ten-link desktop row with five primary destinations and the existing Steam and locale controls:

```text
WARDOGS logo

Game
Guides
Catalogue
Videos
News

Play on Steam
Language
```

The logo remains the homepage link, so a separate `Home` label is unnecessary.

### 3.2 Navigation Groups

`Game` contains:

- Playtest
- Release Date
- Steam and Early Access
- Gameplay
- Factions
- Community

`Guides` contains:

- Beginner Guide
- Gameplay Guide
- FOB and Logistics
- Mortar Guide
- All Guides

`Catalogue` contains:

- Catalogue Home
- Weapons
- Vehicles
- Ammo
- Attachments
- Gear
- Equipment
- Loadouts

`Videos` and `News` remain direct top-level links.

Desktop uses accessible dropdown menus with keyboard and pointer support. Mobile uses grouped accordion sections inside the existing menu panel. Opening one mobile group does not resize or shift the header.

### 3.3 Public Route Hierarchy

```text
/{locale}/items
/{locale}/items/weapons
/{locale}/items/weapons/{slug}
/{locale}/items/vehicles
/{locale}/items/vehicles/{slug}
/{locale}/items/ammo
/{locale}/items/attachments
/{locale}/items/gear
/{locale}/items/equipment
/{locale}/items/loadouts
```

The displayed term changes from `Items` to `Catalogue`; the route does not change.

## 4. Homepage Structure

The upgraded homepage order is:

```text
Hero
Start Here
Top Guides / Recently Updated / Confirmed vs Rumor
Explore the WARDOGS Catalogue
YouTube Field Guides
Guide Categories
About WARDOGS
Official Media
Beginner Tips
FAQ
Final CTA
```

The current About section moves below the action-oriented content so the first viewport sequence prioritizes player tasks.

### 4.1 Catalogue Homepage Band

Add one full-width, unframed section after Priority Guides. It contains visual entries for:

- Weapons
- Vehicles
- Ammo
- Attachments
- Gear
- Loadouts

Weapons and Vehicles receive the strongest visual weight because they lead to standalone model pages. Equipment remains available from the Catalogue hub and navigation but is not promoted with a supplied image in this band.

Each entry includes a relevant image, category name, verified record count, one concise description, and a crawlable link. The section contains no nested cards and no marketing copy explaining how the interface works.

## 5. Asset Plan

The supplied folder contains 124 WebP images:

- 14 weapons
- 20 vehicles
- 14 ammo records
- 40 attachments
- 11 gear records
- 3 faction marks
- 22 responsive banner variants

### 5.1 Imported Assets

Import the 99 catalogue records, the three faction marks, and one appropriate source per unique banner composition. Do not import redundant viewport variants when Next image sizing can generate the required responsive output.

Store assets under stable category paths:

```text
public/images/catalogue/weapons/
public/images/catalogue/vehicles/
public/images/catalogue/ammo/
public/images/catalogue/attachments/
public/images/catalogue/gear/
public/images/catalogue/factions/
public/images/catalogue/banners/
```

Do not import `.DS_Store`.

Normalize filenames before import, including:

- `127x55mm` to `12-7x55mm`
- `338NormanMagnum` to `338-norma-magnum`
- `545mm-FMJ` to `5-45x39mm-fmj`

Image files use descriptive alt text based on the exact in-game record name. Detail pages use the specific item image in Open Graph and Article structured data instead of the generic site image.

## 6. Catalogue Data Model

Separate three concerns that are currently mixed together:

1. Category definitions and navigation.
2. Catalogue records shown in image grids and tables.
3. Editorial detail articles that are eligible for standalone indexing.

Create a typed catalogue record with fields equivalent to:

```ts
type CatalogueRecord = {
  slug: string;
  name: string;
  type: "weapons" | "vehicles" | "ammo" | "attachments" | "gear";
  subtype: string;
  image: string;
  imageAlt: string;
  summary: string;
  facts: Array<{label: string; value: string}>;
  detailPage: boolean;
  detailHref?: string;
  evidenceStatus: "official" | "verified-in-game" | "pre-release-build" | "community-report";
  dataAsOf: string;
};
```

Catalogue category guides remain the source for observed Alpha tables and disclaimers. Detail article data remains editorial and evidence-labeled. Do not generate editorial prose mechanically from a table row.

## 7. Catalogue Hub

Upgrade `/{locale}/items` into the `WARDOGS Catalogue` hub.

It contains:

- A compact hero with catalogue positioning and evidence status.
- A visual category grid using the supplied banners.
- Accurate visible counts.
- A featured Weapons section.
- A featured Vehicles section.
- A compact explanation of `Official`, `Verified in game`, and `Pre-release build` labels.
- Links to Equipment and Loadouts even though they do not use the 99 item-record images.

The hub is a navigation and comparison surface, not a long article and not a duplicate of every category table.

## 8. Category Pages

### 8.1 Shared Layout

Each category page uses:

1. Breadcrumb and category hero image.
2. Category title, short description, record count, and data date.
3. Filter/search controls where they materially reduce scanning cost.
4. Responsive image record grid.
5. Existing detailed Alpha table and editorial insights.
6. Confirmed limitations and source section.
7. Related categories and guides.

The image grid appears before the long table so visitors can identify records visually. The existing table remains server-rendered and crawlable.

### 8.2 Record Behavior

- Weapon and vehicle records with detail articles are crawlable links.
- Ammo, attachment, and gear cards are complete inline records with stable anchors.
- Inline records do not display fake buttons or link to nonexistent pages.
- Table rows link to detail pages only when the target exists; otherwise they link to the matching record anchor.

### 8.3 Filters

Filters operate client-side over server-rendered records. Search and filters must not create query-string URLs intended for indexing.

Initial filters:

- Weapons: subtype and ammunition family.
- Vehicles: ground/air and combat/transport/support role.
- Ammo: calibre/load family.
- Attachments: optic/magazine and weapon family.
- Gear: helmet/armor/backpack and tier.

All records remain present in the initial HTML even when enhancement JavaScript is unavailable.

## 9. Detail Pages

### 9.1 Scope

Add 34 new English detail articles:

- Every supplied weapon image: 14 pages.
- Every supplied vehicle image: 20 pages.

Keep the six existing editorial pages for Mortar, Mobile FOB, Littlebird, Tank, Attack Helicopter, and Armored Transport. Generic role pages and specific model pages cross-link rather than replacing one another.

### 9.2 Required Content

Every new detail page must include:

- Exact item name and item-specific image.
- Quick answer.
- Evidence/build badge and observed-data date.
- Role and best-use summary.
- Observed price and unlock requirement when captured.
- Weapon ammunition or vehicle class relationship.
- At least four useful facts.
- Strengths and cautions that are specific to the model.
- Confirmed vs unconfirmed information.
- Related items and related guides.
- Sources and last-checked dates.

The page must provide a complete answer without requiring the image, JavaScript, or an outbound source.

### 9.3 Index Eligibility

A detail page is generated and added to the sitemap only when:

- Its image exists.
- Its slug is unique.
- It has model-specific facts and editorial copy.
- It has at least one source.
- Its canonical, metadata, and structured data pass validation.

New model pages launch in English. Existing locale behavior remains intact; untranslated copies are not added to the sitemap or presented as alternate-language equivalents.

## 10. Advertising

Continue rendering one Adsterra Native Banner only on guide, video, and item detail pages after the Quick Answer block.

Do not add ads to:

- Homepage
- Catalogue hub
- Category indexes
- Search/filter areas
- Navigation menus

Update the ad component to preserve a stable 4:1 layout. If Adsterra returns no fill, replace the reserved area with a same-height internal WARDOGS recommendation instead of collapsing the slot after paint. This avoids a delayed layout shift while retaining a useful fallback.

The external script remains asynchronous and must not block the item image, H1, Quick Answer, or primary content.

## 11. SEO and AI Discovery

### 11.1 URL and Canonical Safety

- Preserve all existing public URLs.
- Preserve current canonical hosts and locale conventions.
- Do not rename `/items` to `/catalogue`.
- Do not remove the six existing item detail URLs.
- Do not create filter URLs for indexing.

### 11.2 Crawl and Indexing

- Keep static server-rendered HTML for navigation, cards, tables, and article copy.
- Add only eligible English model pages to the sitemap.
- Use accurate per-page `lastModified` values.
- Link new pages from the homepage, Catalogue hub, category page, related item blocks, and relevant guides.
- Keep non-English English-body catalogue copies `noindex,follow` until they are independently localized.
- Preserve `OAI-SearchBot` and Googlebot access through robots and hosting protection.

### 11.3 Structured Data

Retain and refine:

- `CollectionPage` for hub and category pages.
- `ItemList` for visible catalogue records.
- `Article` for model detail pages.
- `BreadcrumbList` for every catalogue level.

Structured data must match visible page content. Do not add unsupported Product offers, AggregateRating, or review data.

### 11.4 Content Quality

- Do not create 65 thin pages for image-only or table-only records.
- Do not duplicate one generic paragraph across model pages.
- Keep Alpha prices and unlocks visibly dated and labeled non-final.
- Use exact item relationships and useful comparisons instead of keyword variations.

## 12. Rollout

### Release 1: Architecture and Visual Catalogue

- Import and normalize assets.
- Replace desktop and mobile navigation.
- Reorder the homepage and add the Catalogue band.
- Upgrade the Catalogue hub.
- Add all 99 visual records to category pages.
- Add filter/search enhancement and stable anchors.
- Improve ad slot stability.
- Update internal links, images, metadata, and category structured data.

Release 1 does not add new standalone model URLs.

### Release 2: Model Articles

- Add 14 weapon detail articles.
- Add 20 vehicle detail articles.
- Add item-specific Open Graph images and Article structured data.
- Add cross-links to generic role pages, guides, categories, ammo, and attachments.
- Update sitemap and homepage/collection featured links.

Deploy Release 2 only after Release 1 has no crawl, layout, navigation, or broken-link regressions.

## 13. Verification

### Data Tests

- Exactly 99 image-backed catalogue records.
- Exactly 14 weapon images and 20 vehicle images.
- Every referenced asset exists.
- Unique type/slug pairs.
- No detail link without a generated page.
- No unsupported locale alternate.

### Route and SEO Tests

- Existing route inventory remains reachable.
- New detail routes return 200 only for eligible pages.
- Canonical and hreflang output match index eligibility.
- Sitemap contains no anchors, filters, noindex pages, or missing routes.
- JSON-LD URLs and images match visible content.
- Robots remains accessible and permits search crawlers.

### Interaction and Visual Tests

- Desktop dropdown keyboard and pointer behavior.
- Mobile accordion focus, Escape, close-on-navigation, and scroll behavior.
- Category search and filters at desktop and mobile widths.
- No text or image overlap.
- No broken or blank item images.
- Stable advertisement area with and without ad fill.
- Screenshots at mobile, tablet, and desktop widths.

### Build Gate

- Lint passes.
- Type checking passes.
- Unit/content tests pass.
- Focused Playwright tests pass using the configured Chrome executable.
- Production build passes.
- Internal route audit reports no broken links.

## 14. Success Criteria

The upgrade is complete when:

- The header exposes the five-group information architecture without crowding.
- The homepage visibly promotes the Catalogue before video and lower-priority sections.
- All 99 supplied catalogue records are visible in the correct categories.
- All 34 new model articles are substantial, image-backed, source-labeled, and indexable in English.
- Existing URLs remain valid.
- Ads remain limited to detail pages and do not introduce avoidable layout shift.
- Googlebot and OAI-SearchBot receive complete server-rendered content.
- Sitemap, canonical, structured data, navigation, and internal links agree on the same route inventory.
