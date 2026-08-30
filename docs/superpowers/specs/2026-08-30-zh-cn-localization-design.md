# WARDOGS Simplified Chinese Localization Design

## Goal

Add Simplified Chinese as a sixth first-class locale at `/zh-cn/`. Chinese pages must match the coverage, functionality, evidence standards, and indexability of the existing English, Russian, German, Brazilian Portuguese, and Japanese versions.

## Scope

- Add `zh-cn` to locale configuration, routing, static generation, navigation, language switching, analytics route matching, and route availability manifests.
- Add complete Simplified Chinese UI messages for global layout, home, guides, news, videos, catalogue hubs, catalogue records, item details, legal pages, and editorial policy.
- Publish a substantial Simplified Chinese version of every English guide. All 43 guide slugs must exist in `content/zh-cn/guides`, preserve source links and evidence caveats, and use `/zh-cn/` internal links.
- Localize generated weapon, vehicle, ammunition, attachment, gear, equipment, and loadout content, including labels, summaries, dates, evidence states, and related content.
- Localize video and news discovery content without changing the underlying source identity or inventing facts.
- Add `zh-CN` alternates to metadata, JSON-LD, sitemap entries, and `llms.txt`.
- Continue to describe the product as the global Steam Early Access release with Simplified Chinese interface support. Do not claim a mainland China edition, domestic publishing licence, or China-only server.

## Content Standard

- Chinese copy answers the same player intent as the English source; it is not a thin machine-translated shell.
- Product names, model identifiers, URLs, prices, ammunition names, and uncertain pre-release values remain faithful to the evidence.
- Dates use Simplified Chinese formatting.
- Every localized guide retains headings, FAQs, source attribution, related links, and version caveats.
- Existing approved images are reused with localized alt text. Pending media remains explicitly pending.

## Architecture

The implementation extends the existing locale pattern rather than creating a Chinese-only subsystem:

1. `src/config/site.ts` defines `zh-cn` as a supported `Locale`.
2. Locale-keyed records become compile-time completeness gates for Chinese UI and generated content.
3. `messages/zh-cn.json` supplies shared interface copy.
4. `content/zh-cn/guides/*.mdx` supplies the guide corpus.
5. Metadata and sitemap helpers map `zh-cn` to the standards-compliant language tag `zh-CN`.
6. Existing route generation automatically emits Chinese pages once all data contracts are complete.

## Verification

- Add failing tests first for six-locale configuration, route generation, content completeness, Chinese-language signals, metadata alternates, sitemap coverage, JSON-LD, language switching, and Pages export.
- Run unit and content suites, type checking, linting, the production build, and the GitHub Pages export smoke suite.
- Verify desktop and mobile Chinese pages for overflow, navigation collisions, broken images, untranslated UI, and console errors.
- Push to `main` only after all checks pass, then verify representative Chinese pages and sitemap entries in production.

## Completion Criteria

- All 43 English guide slugs have substantial Chinese counterparts.
- Every existing indexable route family emits a Chinese page.
- All six locales have reciprocal alternates and sitemap entries.
- No test, type, lint, build, Pages crawl, or visual check fails.
- Production deployment and IndexNow notification complete successfully.
