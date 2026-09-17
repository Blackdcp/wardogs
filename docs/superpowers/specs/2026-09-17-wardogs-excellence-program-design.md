# WARDOGS Excellence Program Design

## Objective

Turn WARDOGS Wiki from a broad launch reference into the most useful, transparent, and task-oriented WARDOGS companion. The standard is not article count. Every important player intent must have a complete answer, current evidence, an appropriate visual treatment, and a direct next action. Where competing sites already have a feature, this site must beat it on clarity, provenance, localization, or workflow quality. Where competitors do not have a feature, it should create a defensible reason to cite and revisit WARDOGS Wiki.

## Completion Standard

A surface is complete only when it meets all applicable requirements:

1. The answer is discoverable from the homepage, navigation, search, or a relevant guide.
2. Version-sensitive facts show their build, verification date, source class, and confidence.
3. Historical Alpha or Beta values are never presented as current Season 1 values.
4. A guide uses visuals where a player must recognize a screen, item, control, route, or state.
5. A tool explains its inputs, evidence limits, result, and next action.
6. The route works in English, German, Russian, Brazilian Portuguese, Japanese, and Simplified Chinese.
7. Metadata, structured data, sitemap entries, internal links, and IndexNow signals remain valid.

## Evidence Model

Every catalogue record and item page gains a normalized evidence object:

- `build`: the build in which the observation was made.
- `verifiedAt`: ISO date of the most recent check.
- `sourceClass`: `official`, `live-client`, `creator-current`, `creator-historical`, or `community-report`.
- `confidence`: `confirmed`, `observed`, `corroborated`, or `unverified`.
- `current`: whether the observation is safe to use for a current decision.
- `previousValue`: optional historical value retained for change history.

Current official Season 1 changes may override only the affected fields. Everything else remains visibly historical until it is rechecked. Generic pages that cannot give a unique answer must either gain unique evidence and guidance or be excluded from indexing until they do.

## Information Architecture

### Homepage

The first screen remains an actual game reference, not a marketing landing page. Immediately below it, players receive:

1. A site-wide search field covering guides, items, videos, and tools.
2. Task shortcuts for first match, money, role progression, weapons, FOB/logistics, vehicles, controls, and PC fixes.
3. A current-build panel showing the latest verified patch and recent material changes.
4. Recently verified content, not merely recently edited content.

Expired Beta promotion leaves the primary homepage path but remains available as history.

### Catalogue

The catalogue remains the canonical data layer. Item cards and detail pages distinguish current and historical facts, show missing evidence honestly, link directly into comparison and matching tools, and expose a readable change history. Category totals must be computed from data rather than hard-coded copy.

### Guides And Visual Evidence

The highest-impression workflows receive direct-answer introductions, a task checklist, contextual official or creator-current video evidence, related tools, and visual steps. Video evidence is embedded only when its build and review date are known. A video never silently upgrades a community observation to an official fact.

### Tools

Four new tools extend the existing system checker and budget planner:

1. Weapon Compare: compare role, calibre, observed cost, progression gate, strengths, cautions, and evidence freshness.
2. Ammo Matcher: select a calibre or weapon and see only relationships explicitly present in the catalogue.
3. Progression Route: choose a role goal and receive a sourced Season 1 route without inventing time-to-unlock estimates.
4. FOB And Logistics Planner: build a reusable task checklist for spawn, construction, supply, transport, defense, and recovery; no unverified costs are inserted.

All tools support shareable URLs, readable empty states, and six-locale interface copy.

## Content Breadth

The database expands only from approved sources or independently captured live-client evidence. New top-level coverage includes medical items, support equipment, deployables/buildables, supplies/materials, role unlocks, maps, modes, and mechanics. The initial release may expose a sourced category hub before every individual record is ready, but it must never pad totals with empty pages.

## Video Intelligence

The current source set expands from eight to at least twenty reviewed videos across beginner play, role XP, money, weapons, vehicles, controls, supplies, FOBs, progression, and current Season 1 changes. Each entry stores publication date, review date, topic, linked guide, and build label. Relevant current videos appear inside their guide; historical videos remain in the archive.

## Visual Standard

- Item pages use a unique item image when one exists; generic banners are not allowed as item evidence.
- High-intent guides use three to eight useful visuals or a deliberately equivalent interactive surface.
- YouTube thumbnails are labelled as video sources, never as first-party screenshots.
- Cards are reserved for repeated items and tools; page sections remain unframed full-width bands.
- Mobile and desktop layouts must not overlap, clip long translated labels, or shift when dynamic results appear.

## Publishing And Safety

- Preserve all existing canonical URLs.
- Do not copy competitor prose, images, mined datasets, or proprietary calculations.
- Prefer official announcements, official media, independently captured client evidence, and reviewed public creator demonstrations.
- Build, content validation, type checking, linting, and focused interaction tests must pass before publication.
- Publish in independently useful commits. Submit changed canonical URLs through the existing IndexNow integration after production verification.
