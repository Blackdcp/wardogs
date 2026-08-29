# WARDOGS Content and Catalogue Expansion

Date: 2026-08-30

## Objective

Close the site's most important search and visual gaps before Early Access without copying competitors or presenting build-sensitive community data as final. The release should make the weapon and vehicle catalogues internally consistent, add missing high-intent guides, and give every new visual an auditable source.

## Competitive Findings

- The live weapons page says "All 33 Weapons" while the visual explorer contains only 14 weapon records. This is a direct trust and SEO defect.
- Current structured records contain 14 weapons, 20 vehicles, 14 ammunition families, 40 attachments, and 11 gear entries. Most facts are still labeled from Alpha 1 on 2026-08-07.
- Current leaders expose 35-40 weapon records and 28 vehicle records. The broadest database exposes 565 total entries, but much of that long tail is low-value for the immediate launch window.
- Competitors win on searchable weapon/vehicle breadth, Beta prices, linked compatibility, loadout planning, and damage/TTK tools. Our stronger position is source labeling, independent localized content, and practical task-oriented guides.
- Search results for weapon lists, best loadouts, vehicles, armor, and TTK currently favor competitor databases. Those queries are the first expansion target.

## Approved Scope

### 1. Weapon and vehicle coverage

- Expand the weapon explorer from 14 visual records to the 38 currently documented Beta/catalogue records.
- Treat the 34 named combat records and four incomplete identifiers as different evidence tiers. Incomplete identifiers must keep unknown price, calibre, and role fields rather than borrowing values from similarly named real-world weapons.
- Expand vehicles from 20 to the 28 currently documented ground, air, tracked, and stationary records.
- Keep Beta list prices separate from older Alpha handling, weight, fire-mode, and progression observations. A record may show both only when each field names its applicable Build.
- Update category titles, descriptions, visible counts, ItemList structured data, and generated routes from the same record source so the page cannot claim more items than it displays.

### 2. Visual source pipeline

- Retain the previously approved local catalogue artwork for existing records.
- Add official Team17/Steam press-kit screenshots for guide and category context.
- Produce missing item visuals only from identifiable frames in source-linked WARDOGS gameplay or catalogue videos already used by the editorial system, including:
  - `9mSvZyAk62E` for the weapon catalogue.
  - `ZFRrDSru7Kg` for the vehicle catalogue.
- Store the source URL, source label, capture timestamp, retrieval date, and usage note in a checked-in media manifest.
- Do not use files copied from competitor sites, remove competitor watermarks, generate fake weapon renders, or label a generic battlefield image as a specific item.
- If an item cannot be identified confidently, show an explicit source-neutral pending state instead of a false image.
- Normalize thumbnails to stable WebP dimensions and verify that all files render, fit cards, and stay within reasonable byte limits.

### 3. High-intent guides

Publish four independent guides in English, German, Russian, Brazilian Portuguese, and Japanese:

1. Best weapons and budget loadouts by role and engagement range.
2. Armor, ammunition, damage, penetration, shots-to-kill, and TTK limits.
3. Medic, revive, defibrillator, medical bag, and support loadouts.
4. Equipment, explosives, mines, tools, supply, and role utility.

Each guide must answer the query immediately, separate observed facts from recommendations, cite at least two relevant sources where possible, link to the catalogue, and avoid permanent tier-list claims before Early Access balance is known.

### 4. Navigation and internal linking

- Prioritize Weapons, Vehicles, Loadouts, and the four new guides in the catalogue and guide discovery surfaces.
- Link item detail pages to the relevant guide and link guide tables back to specific item records.
- Preserve aggressive long-article advertising using the existing Native and 300x250 placements. Do not add new ad formats or duplicate analytics events as part of this content release.

### 5. Localization

- Publish all four guides as full local-language documents for `en`, `de`, `ru`, `pt-br`, and `ja`.
- Localize catalogue labels, evidence states, filters, descriptions, and recommendations while keeping proper item names and numeric values stable.
- Keep all locale routes in hreflang, sitemap, and structured data output.

## Data Sources and Evidence Rules

Priority order:

1. BULKHEAD, Team17, Steam, and the official public press kit.
2. Directly visible pre-release interface footage with a dated Build.
3. Two independent community databases or creator captures that agree on the same field.
4. A single community source only when labeled as unverified and not used for a recommendation that depends on precision.

Conflicts remain visible. Later Beta prices do not silently overwrite older Alpha handling fields; the UI names both Builds or leaves the conflicting value unknown.

## Implementation Shape

- Extend the existing catalogue record model rather than create a second item database.
- Add a media provenance manifest keyed by public asset path.
- Generate record counts and category metadata from catalogue data.
- Keep guides in the current MDX content pipeline and use existing locale routing, source components, related-guide logic, ads, and structured-data helpers.
- Add small, focused helpers only where they remove count drift or centralize evidence labels.

## Testing and Acceptance

- A content contract fails before implementation and passes only when the required record counts, routes, locales, guide slugs, and links exist.
- Tests prove the category title/count matches the rendered record set.
- Every non-placeholder catalogue image exists, has dimensions, and has a media-source manifest entry.
- No media manifest entry points to a competitor domain or a watermark-removal workflow.
- All five locales build without English-body fallback for the four new guides.
- Unit/content tests, lint, and the full production build pass.
- Desktop and mobile screenshots verify catalogue cards, long localized titles, image containment, filters, guide tables, and ad spacing.
- Production URLs return HTTP 200 and the sitemap contains the new guides and item routes before completion is reported.

## Out of Scope

- Reproducing a 535-565 item database in this release.
- Shipping a damage calculator, loadout builder, or 3D model viewer before the underlying formulas and compatibility data are independently verified.
- Copying competitor prose, images, database exports, or site interaction design.
