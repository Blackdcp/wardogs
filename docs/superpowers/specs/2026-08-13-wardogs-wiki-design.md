# WARDOGS Wiki Design Specification

## 1. Goal

Build a production-ready WARDOGS game guide site in Next.js that follows the page hierarchy, spacing, content density, and responsive behavior of `gamblewithyourfriends.net`, while using WARDOGS branding, official game imagery, the approved dark tactical palette, and the project's own guide content.

The first release contains:

- A localized homepage at `/{locale}`.
- A localized guide index at `/{locale}/guides`.
- Twenty localized guide detail routes at `/{locale}/guides/{slug}`.
- Four complete locales: English (`en`), Russian (`ru`), German (`de`), and Brazilian Portuguese (`pt-br`).
- Eighty independent MDX article files: 20 topics x 4 locales.

The reference site's layout is the UI reference only. Its name, casino content, assets, tracking code, advertisements, metadata, and outbound links are not copied.

## 2. Confirmed Product Decisions

- The subject is BULKHEAD and Team17's WARDOGS, Steam App `1867240`.
- `keywords.json` is the only source of truth for the 20 independent guide topics.
- Existing research materials support those pages but cannot create additional routes.
- Every locale has a complete, independently maintained MDX article for every topic. There is no runtime machine translation and no English body fallback.
- All locales use the same English slug so locale switching never changes the article identity.
- `/` redirects to `/en`.
- The default and only launch theme is dark. A theme toggle is outside the first-release scope.
- Public pages do not link to competitor guide sites. Competitor URLs remain internal research only.
- No codes page or codes widget is created because codes are not one of the validated WARDOGS keywords.

## 3. Routes and Locales

Supported locale identifiers:

| Priority | Locale | Localized game name |
| --- | --- | --- |
| 1 | `en` | WARDOGS |
| 2 | `ru` | WARDOGS |
| 3 | `de` | WARDOGS |
| 4 | `pt-br` | WARDOGS |

WARDOGS remains the official title in every locale. It is not transliterated or translated.

Public routes:

```text
/
/{locale}
/{locale}/guides
/{locale}/guides/{slug}
/{locale}/privacy
/{locale}/terms
/robots.txt
/sitemap.xml
```

Locale behavior:

- `/` performs a permanent locale redirect to `/en`.
- Unsupported locale segments return the localized 404 boundary rather than silently falling back.
- The locale switcher preserves the current route and slug.
- Every localized page declares canonical and alternate-language URLs.

## 4. Keyword-to-Slug Manifest

The manifest is derived from `keywords.json` and contains exactly these 20 entries:

| Order | Category | Primary keyword | Slug |
| ---: | --- | --- | --- |
| 1 | access | wardogs playtest | `wardogs-playtest` |
| 2 | access | wardogs beta | `wardogs-beta` |
| 3 | access | wardogs alpha | `wardogs-alpha` |
| 4 | access | wardogs alpha key | `wardogs-alpha-key` |
| 5 | release | wardogs release date | `wardogs-release-date` |
| 6 | release | wardogs early access | `wardogs-early-access` |
| 7 | store | wardogs steam | `wardogs-steam` |
| 8 | store | wardogs price | `wardogs-price` |
| 9 | store | wardogs download | `wardogs-download` |
| 10 | platform | wardogs ps5 | `wardogs-ps5` |
| 11 | video | wardogs trailer | `wardogs-trailer` |
| 12 | video | wardogs first look | `wardogs-first-look` |
| 13 | video | wardogs livestream | `wardogs-livestream` |
| 14 | community | wardogs discord | `wardogs-discord` |
| 15 | community | wardogs reddit | `wardogs-reddit` |
| 16 | community | wardogs twitter | `wardogs-twitter` |
| 17 | community | wardogs discord account verification | `wardogs-discord-account-verification` |
| 18 | developer | wardogs game developers | `wardogs-game-developers` |
| 19 | guide | wardogs gameplay | `wardogs-gameplay` |
| 20 | guide | wardogs factions | `wardogs-factions` |

No aliases or extra search phrases become routes. Related phrases may appear naturally inside the relevant article.

## 5. Technical Architecture

### 5.1 Stack

- Next.js App Router with TypeScript and React Server Components.
- `next-intl` for locale routing and interface messages.
- `next-mdx-remote/rsc` for compiling local MDX into server-rendered content.
- `gray-matter` for frontmatter parsing.
- `zod` for strict content validation.
- Tailwind CSS for the shared visual system.
- `lucide-react` for interface icons.
- `@fontsource/inter` and `@fontsource/oswald` so fonts build locally without a Google Fonts network dependency.
- Vitest for manifest, content, and metadata tests.
- Playwright plus `@axe-core/playwright` for route, responsive, interaction, screenshot, and accessibility checks.

### 5.2 Rendering

- Homepage, guide index, policies, and all 80 article routes are statically generated.
- `generateStaticParams` returns every supported locale and every manifest slug.
- The application performs no runtime content API requests.
- Dynamic facts such as dates and prices are stored in MDX with a visible verification date and are updated by editing content, not by client-side fetching.

### 5.3 Content Directories

```text
content/
  en/guides/*.mdx
  ru/guides/*.mdx
  de/guides/*.mdx
  pt-br/guides/*.mdx
messages/
  en.json
  ru.json
  de.json
  pt-br.json
```

Each locale directory contains the same 20 filenames. A filename is always `{slug}.mdx`.

### 5.4 Frontmatter Contract

Every article uses this schema:

```yaml
title: "WARDOGS Gameplay Explained"
description: "Learn how WARDOGS matches work, from Control Zone scoring and persistent cash to vehicles, building, team roles, objectives, and match-winning tactics."
keyword: "wardogs gameplay"
category: "guide"
slug: "wardogs-gameplay"
order: 19
updatedAt: "2026-08-13"
badges:
  - label: "Guide"
    tone: "accent"
faq:
  - question: "How many players are in WARDOGS?"
    answer: "WARDOGS supports up to 100 players across three teams."
sources:
  - label: "WARDOGS on Steam"
    url: "https://store.steampowered.com/app/1867240/WARDOGS/"
    kind: "official"
    checkedAt: "2026-08-13"
```

Validation rules:

- `keyword`, `category`, `slug`, and `order` must exactly match the manifest.
- `title` is at most 60 characters.
- `description` is 140-160 characters for every locale.
- Generated metadata keywords are at most 100 characters.
- `updatedAt` and every `checkedAt` value use ISO `YYYY-MM-DD` format.
- Every article contains at least two useful FAQ entries.
- Every source uses HTTPS and a permitted source type.
- A missing file, duplicate slug, schema error, locale mismatch, or manifest mismatch fails validation and blocks the production build.

## 6. Visual System

### 6.1 Layout Relationship to the Reference

The implementation reproduces the reference site's recognizable structure:

- Sticky 64 px navigation.
- Full-width image-backed homepage hero with centered content.
- Constrained `max-w-7xl` homepage bands.
- Centered guide-index introduction followed by a three-column card grid.
- Constrained `max-w-4xl` article layout with breadcrumbs, badges, section headings, framed content, FAQs, and final CTA.
- Desktop navigation collapses into a mobile menu at the equivalent breakpoint.
- Footer uses the same brand-plus-two-link-columns hierarchy.

It does not reproduce the reference site's casino palette, copy, icons, ads, analytics, or assets.

### 6.2 Palette

The default dark palette is:

```css
--background: #0d0f0e;
--surface: #151b18;
--card: #1b221f;
--text: #f2f5f3;
--muted: #a8b4ae;
--nav-theme: 152 45% 38%;
--nav-theme-light: 152 48% 50%;
--warning: #d9a93a;
--danger: #d45d5d;
```

Usage rules:

- Tactical green is used for the primary CTA, active navigation, links, status indicators, and important facts.
- Amber is reserved for warnings, time-sensitive notices, or qualified information.
- Red is reserved for unavailable, expired, failed, or dangerous states.
- Cards remain low-saturation charcoal-green and use an 8 px maximum radius.
- There are no decorative color blobs, orbs, or one-color gradients.
- Hero readability uses a restrained dark overlay over official game imagery.

### 6.3 Typography

- Inter is used for navigation, body copy, labels, and controls.
- Oswald is used for the hero supporting title and H1-H3 display headings, matching the condensed hierarchy of the reference site.
- Font sizes use fixed responsive breakpoints, not viewport-width interpolation.
- Letter spacing is `0` except for the official logo artwork itself.

### 6.4 Official Game Identity

Official WARDOGS assets come from the Team17 press kit or the official Steam listing and are stored locally in `public/images` rather than hotlinked.

- Header: official white horizontal fullmark followed by a visually separate green `Wiki` suffix.
- Homepage hero: official full-color WARDOGS fullmark above `Complete Guide`.
- Footer: smaller white fullmark plus `Wiki` and the fan-site disclaimer.
- Hero and media areas: optimized official screenshots showing actual WARDOGS gameplay.
- Browser/favicon surfaces: use the existing custom W favicon assets because tiny official wordmarks are not legible at favicon size.
- Repeated guide cards do not contain the logo.
- `Fan-Made Community Wiki` and a clear non-affiliation statement prevent the official artwork from implying an official site.

## 7. Page Specifications

### 7.1 Shared Header

Desktop order:

1. Official WARDOGS fullmark plus `Wiki`.
2. Playtest -> `wardogs-playtest`.
3. Release -> `wardogs-release-date`.
4. Steam -> `wardogs-steam`.
5. Gameplay -> `wardogs-gameplay`.
6. Factions -> `wardogs-factions`.
7. Community -> `wardogs-discord`.
8. Videos -> `wardogs-trailer`.
9. Guides -> guide index.
10. Locale menu.
11. Official Steam CTA.

The mobile header retains the logo, Steam icon button, locale control, and menu button. Opening the menu does not resize the header or shift the page horizontally.

### 7.2 Homepage `/{locale}`

Section order:

1. Header.
2. Full-bleed Hero.
3. `What is WARDOGS?` two-column band.
4. `Start Here` four-card band.
5. `All Guides` category-entry grid.
6. `Official Media` section with an official trailer thumbnail or privacy-enhanced YouTube embed.
7. Beginner tips band based only on confirmed gameplay information.
8. Localized FAQ accordion.
9. Final CTA band.
10. Footer.

Hero contents:

- Eyebrow: `Fan-Made Community Wiki` plus a compact current-status marker.
- Official WARDOGS fullmark.
- Supporting title: `Complete Guide`.
- Two-sentence gameplay description.
- Primary CTA: `Explore All Guides`.
- Secondary CTA: `Check Playtest Access`.
- Four facts: Early Access date, maximum players, team count, and Control Zone size.

The site does not show a live countdown unless an official source publishes an exact start time. A calendar date is not converted into an invented midnight countdown.

`Start Here` cards:

1. Beginner Guide, routed to `wardogs-gameplay` with a beginner-section anchor.
2. Playtest Access, routed to `wardogs-playtest`.
3. Gameplay Explained, routed to `wardogs-gameplay`.
4. Factions, routed to `wardogs-factions`.

### 7.3 Guide Index `/{locale}/guides`

- Centered count badge: `20 Guide Topics` in the active locale.
- Localized H1 and description.
- Twenty cards in manifest order.
- Three columns on large desktop, two on tablet, one on mobile.
- Each card contains title, localized category badge, one useful sentence, and a text link.
- Cards have stable minimum dimensions so translated titles and hover states do not shift surrounding content.
- All cards are server-rendered links. No card is displayed unless the target page exists.

### 7.4 Article `/{locale}/guides/{slug}`

Section order:

1. Header.
2. Breadcrumbs.
3. Category and update-date badges.
4. Localized H1 and direct-answer introduction.
5. MDX body sections.
6. Source list with source type and checked date.
7. FAQ section sourced from frontmatter.
8. Related guide links selected from the same category, excluding the current article.
9. Final CTA.
10. Footer.

MDX supports a deliberately small component set:

- `FactGrid`
- `Notice` with `info`, `warning`, and `unavailable` tones
- `Steps`
- `ComparisonTable`
- `OfficialVideo`
- `SourceNote`

Raw scripts, iframes outside `OfficialVideo`, arbitrary HTML, and remote images are not accepted in MDX.

## 8. Component Boundaries

Shared application components:

- `OfficialWordmark`: renders approved official logo variants with correct dimensions and accessible text.
- `SiteHeader`: owns desktop navigation and header layout.
- `MobileNav`: owns only menu disclosure state and focus handling.
- `LocaleSwitcher`: maps the current pathname to another supported locale.
- `SiteFooter`: renders localized guide and official link groups.
- `GuideCard`: renders one validated manifest/content summary.
- `GuideGrid`: handles stable responsive tracks and list semantics.
- `StatusBadge`: displays neutral, active, warning, or unavailable states.
- `StatsGrid`: renders homepage facts as pure strings and labels.
- `FaqList`: renders localized disclosure controls and FAQ structured-data input.
- `OfficialVideo`: renders an approved official YouTube source with a poster-first loading strategy.
- `MdxComponents`: the only map exposed to the MDX compiler.
- `RelatedGuides`: derives deterministic links from category and manifest order.

Content and route logic remain server-side. Only the mobile menu, locale menu, FAQ disclosures, and optional video activation require client components.

## 9. Source and Editorial Rules

Source priority:

1. Current official Steam store and announcements.
2. Team17 official WARDOGS pages and press kit.
3. BULKHEAD official WARDOGS page.
4. Official WARDOGS Discord and YouTube.
5. Clearly attributed creator footage or community reports for experience-based observations only.

Publication rules:

- Official facts are written directly and carry a verification date.
- Older official information that has been superseded is not used for current instructions.
- Creator or community observations are explicitly attributed and never presented as canonical mechanics.
- Unknown platform dates, launch times, beta preload details, player counts, weapon stats, and faction bonuses are stated as unconfirmed rather than inferred.
- `50 GB` is described as required storage, not an exact compressed download size.
- Steam Request Access is described as a chance, not a guarantee.
- Public source lists exclude competitor domains.
- Source validation rejects HTTP URLs, malformed URLs, and known 4xx responses. HEAD requests fall back to GET when a site does not support HEAD.

## 10. SEO and Structured Data

Every page generates localized metadata from validated content.

- `metadataBase` reads `NEXT_PUBLIC_SITE_URL`; development falls back to `http://localhost:3000`, while production validation requires an HTTPS origin.
- Titles are unique and no longer than 60 characters.
- Descriptions are unique and 140-160 characters.
- Metadata keyword strings are no longer than 100 characters.
- Canonical points to the current locale URL.
- Alternates include all four locales and `x-default` pointing to English.
- Open Graph and Twitter images use a local WARDOGS branded image.
- Sitemap includes the homepage, guide index, policies, and all 80 articles.
- Robots allows public content and references the generated sitemap.

Structured data:

- Homepage: `Organization`, `WebSite`, `VideoGame`, and `FAQPage`.
- Guide index: `CollectionPage`, `ItemList`, and `BreadcrumbList`.
- Article: `Article`, `BreadcrumbList`, and `FAQPage`.

The organization schema identifies the site as an independent fan guide and does not claim to be BULKHEAD, Team17, or the official WARDOGS website.

## 11. Error Handling

- Unsupported locales and unknown slugs call the Next.js `notFound()` boundary.
- Missing translations, MDX files, official assets, or required frontmatter fail content validation before `next build`.
- The locale switcher only emits destinations present in the static manifest.
- Broken internal links fail an automated crawl test.
- Broken public external links fail the explicit link-check command and must be corrected or removed before release.
- Local images define width, height, and responsive sizing to prevent cumulative layout shift.
- If JavaScript is disabled, all text, navigation links, guide cards, and article content remain readable; only disclosure convenience and video activation degrade.

## 12. Accessibility and Responsive Behavior

- Semantic landmarks, heading order, nav labels, breadcrumbs, lists, buttons, and links are required.
- The logo has accessible text; decorative duplicate hero artwork uses an empty alt while the page H1 retains the game name for screen readers.
- Mobile menu and FAQ disclosures expose `aria-expanded`, keyboard operation, focus visibility, and Escape behavior where applicable.
- Interactive controls meet a 44 x 44 px minimum target.
- Text and controls are checked at 390 x 844, 768 x 1024, 1440 x 1200, and a wide desktop viewport.
- German and Russian titles are tested for wrapping without overlap, clipping, or unexpected grid resizing.
- Text contrast meets WCAG AA.

## 13. Verification Strategy

### 13.1 Content Tests

- Assert the manifest contains exactly 20 unique keywords and 20 unique slugs.
- Assert all categories from `keywords.json` are represented and `guide` exists.
- Assert each of four locale directories contains exactly the same 20 slugs.
- Parse and validate all 80 frontmatter records.
- Assert no public article source uses a competitor domain.
- Assert SEO character limits and uniqueness.

### 13.2 Route and Interaction Tests

- `/` redirects to `/en`.
- Every generated homepage, index, and detail route returns 200.
- Unknown locale and unknown slug return 404.
- Every guide-index card reaches its matching article.
- Locale switching preserves page identity across all four locales.
- Desktop and mobile navigation reach the expected routes.
- FAQ disclosure and mobile-menu keyboard behavior work.

### 13.3 Visual and Accessibility Tests

- Playwright screenshots cover homepage, guide index, and gameplay article at desktop and mobile widths.
- Screenshot baselines use the approved official-logo visual direction.
- Automated checks verify that the logo, hero title, CTAs, card grids, and article content do not overlap.
- `@axe-core/playwright` reports no serious or critical violations on all three page types.
- Official images render with non-zero dimensions and do not leave blank media areas.

### 13.4 Completion Commands

The release is complete only when all of these succeed:

```text
npm run content:validate
npm run links:check
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

## 14. Acceptance Criteria

- The site visually follows the approved reference layout while being immediately identifiable as a WARDOGS guide.
- Official WARDOGS branding appears in the header, hero, and footer with an adjacent `Wiki` or fan-site qualifier.
- The approved tactical-green dark palette is used consistently.
- Homepage, guide index, and article routes are complete and responsive.
- All 20 keyword topics exist in all four locales as independent MDX files.
- No public route, card, locale switch, footer link, or navigation item leads to a 404.
- No competitor guide link appears in public output.
- Facts distinguish current official confirmation from historical or community material.
- SEO metadata, canonical URLs, hreflang, sitemap, robots, and structured data validate.
- All completion commands pass and the local development server is left running for final user review.
