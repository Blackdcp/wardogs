# WARDOGS catalogue image completion — design

## Goal and scope

Replace the visible “Image not yet verified” cards with correctly identified WARDOGS item media wherever real, attributable material exists. The inventory is the current `getVisualCoverageSummary()` contract: 101 pending catalogue records (4 weapons, 3 vehicles, 14 ammunition, 40 attachments, 11 gear, 5 equipment, 4 medical, 4 supplies, 5 deployables, 4 mechanics, and 7 maps). The seven operations-atlas visuals are audited separately. This project changes image coverage and its evidence model; it does not silently update prices, unlocks, or gameplay statistics.

Success means a record shows an image only when that image depicts its named WARDOGS object or, for an abstract mechanic/map, a clearly labeled relevant in-game view. Every shown image has a local file, meaningful alt text, source type, acquisition date, applicable build, and a record-specific mapping. The English and localized catalogue cards render without broken URLs on desktop and mobile. A final coverage report names every remaining pending record rather than concealing it.

## Evidence and asset policy

There are 65 existing local files for ammunition, attachments, and gear, exactly byte-matching the owner-provided catalogue asset pack imported in August 2026. Audit their appearance and filename-to-record mapping. Treat these as historical, owner-provided item illustrations; do not mislabel the asset pack as an official Team17 URL or a live September game capture. Keep their Alpha-era numerical facts labeled historical. A mismatch stays pending until corrected.

For the other 36 pending records, seek a named item in first-party WARDOGS material, the game's current client where accessible, or source-linked WARDOGS footage that clearly identifies it. Preserve a URL and timestamp/frame reference where available. A real-world weapon photo, unrelated game asset, competitor-hosted image, generic category banner, or AI-generated approximation cannot serve as object evidence. If a record is only a pre-release identifier and its current object cannot be identified, keep the media pending and report the specific source gap. Do not promote an unverified item to an indexable detail page merely by giving it an illustration.

## Data and UI design

Keep `catalogue-records.ts` as the record inventory and `catalogue-media-sources.ts` as the approval manifest. Extend the approval metadata only as necessary to represent an owner-provided asset honestly without inventing an external source URL. Continue deriving `mediaState` and displayed image from an explicit record-specific approval, never from filename existence alone. Keep verified object captures distinct from historical owner-provided illustrations and contextual map/mechanic screenshots. In the card UI, expose a short, localized media provenance/build caption when the image is not a current verified game capture. Retain the present honest pending state for items not proven.

## Work batches

1. Reconcile the 65 owner-provided files by hash and visually inspect item matches; add explicit media approvals and tests for the approved subset.
2. Investigate and source the 7 missing weapon/vehicle identifiers, starting with M12G and AT4. Do not infer availability from a real-world name or another wiki's listing.
3. Source the remaining 29 equipment, medical, supplies, deployables, mechanics, and map visuals from official or clearly identifiable game footage. Use contextual status for abstract concepts rather than asserting object-level identity.
4. Run content, unit, build, and browser checks. Review every category's coverage summary, sample image rendering at phone/desktop widths, and verify production URLs after deployment. Publish the unresolved-item ledger alongside the handoff.

## Testing and acceptance

Test-first changes must catch missing files, duplicate use of object images, wrong record mapping, false provenance, missing alt text, unsupported external-source claims, and a regression to generic banners. An integration/browser check must verify that approved images actually load in the catalogue, not merely that the data object contains a path. The full existing test suite, lint, typecheck, content validation, and production build must pass before a release.

The target is 101 resolved pending records. A record without a trustworthy WARDOGS-specific or honestly contextual asset is an explicit unresolved dependency, not a “completed image.” The release may ship verified batches independently, but completion of this image project is claimed only when the final inventory and rendered site support that claim.
