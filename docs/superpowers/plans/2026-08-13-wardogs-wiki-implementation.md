# WARDOGS Wiki Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, four-locale WARDOGS guide site with a reference-matched homepage, a 20-topic guide index, and 80 independent MDX article pages.

**Architecture:** Next.js App Router statically generates every locale, index, policy, and article route. `keywords.json` drives one immutable 20-entry manifest; strict Zod validation joins each localized MDX file to that manifest before rendering, while `next-intl` owns locale routing and UI messages. Shared server components render the tactical dark design and localized metadata, with client code limited to the mobile menu, locale menu, FAQ disclosures, and poster-first video activation.

**Tech Stack:** Next.js 16.3, React 19.2, TypeScript 7, next-intl 4.13, next-mdx-remote 6, gray-matter 4, Zod 4, Tailwind CSS 4, Lucide React, local Fontsource Inter/Oswald, Vitest 4, Playwright 1.62, and axe-core Playwright.

## Global Constraints

- Treat `E:\游戏海外站\keywords.json` as the only route-topic source of truth: exactly 20 keywords, 20 English slugs, and no extra guide routes.
- Ship complete `en`, `ru`, `de`, and `pt-br` content: 20 independent MDX files per locale, with no machine translation or English body fallback.
- Keep the official game name `WARDOGS` unchanged in every locale and use the same English slug across locales.
- Public routes are `/`, `/{locale}`, `/{locale}/guides`, `/{locale}/guides/{slug}`, `/{locale}/privacy`, `/{locale}/terms`, `/robots.txt`, and `/sitemap.xml`; `/` permanently redirects to `/en`.
- Follow the approved reference hierarchy and spacing, but do not copy its brand, casino copy, assets, ads, tracking, metadata, or outbound links.
- Use only the approved dark tactical palette: background `#0d0f0e`, surface `#151b18`, card `#1b221f`, text `#f2f5f3`, muted `#a8b4ae`, tactical green `152 45% 38%`, light green `152 48% 50%`, warning `#d9a93a`, and danger `#d45d5d`.
- Use official WARDOGS wordmarks in the header, hero, and footer with an adjacent `Wiki`, `Complete Guide`, or fan-site qualifier; retain the existing custom W favicon at browser-icon sizes.
- Store official media locally in `public/images`; do not hotlink screenshots in rendered pages.
- Never publish a competitor guide URL. Public external links must use HTTPS, pass the link checker, and point to an approved official, creator, or clearly labelled community source.
- Distinguish current official facts, historical test information, and attributed creator observations. Do not invent launch times, access guarantees, platform dates, faction bonuses, or live countdowns.
- Do not add a codes page or codes widget because codes are absent from the validated keyword set.
- Titles must be at most 60 characters, descriptions 140-160 characters, and generated metadata keyword strings at most 100 characters.
- Cards use at most an 8 px radius; controls have 44 x 44 px minimum targets; layouts must not overlap at 390 x 844, 768 x 1024, 1440 x 1200, or wide desktop.
- All completion commands must pass: `npm.cmd run content:validate`, `npm.cmd run links:check`, `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run test:e2e`, and `npm.cmd run build`.

---

## File Structure

```text
E:\游戏海外站\
|-- config/
|   `-- official-links.json                # Public official/community URL registry
|-- content/{en,ru,de,pt-br}/guides/*.mdx  # 80 independent localized articles
|-- messages/{en,ru,de,pt-br}.json         # Localized interface copy
|-- public/
|   |-- icons/*                            # Existing W favicon family
|   |-- images/*                           # Official local logos/screenshots/OG image
|   `-- site.webmanifest
|-- scripts/
|   `-- check-external-links.mjs           # HEAD/GET external URL verifier
|-- src/
|   |-- app/[locale]/                      # Localized layouts/pages/error boundaries
|   |-- components/                        # Shared shell, guide, MDX, and interaction UI
|   |-- config/site.ts                     # Locales, origin, theme, official links
|   |-- content/                           # Manifest, schema, loader, MDX policy
|   |-- features/home/                     # Homepage model and sections
|   |-- i18n/                              # next-intl routing/request/navigation
|   |-- lib/                               # Metadata, JSON-LD, route helpers
|   `-- proxy.ts                           # Locale redirect/routing proxy
|-- tests/
|   |-- content/                           # Manifest/frontmatter/matrix/source tests
|   |-- e2e/                               # Routes, navigation, responsive, visual, axe
|   |-- fixtures/                          # Minimal valid guide fixtures
|   `-- unit/                              # UI models, related guides, metadata, checker
|-- next.config.ts
|-- playwright.config.ts
|-- postcss.config.mjs
|-- tsconfig.json
|-- vitest.config.ts
`-- package.json
```

### Task 1: Project Toolchain and Site Configuration

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `next-env.d.ts`
- Create: `.env.example`
- Create: `config/official-links.json`
- Create: `src/config/site.ts`
- Test: `tests/unit/site-config.test.ts`

**Interfaces:**
- Consumes: existing `keywords.json`, `site.webmanifest`, and `icon/*` assets.
- Produces: `Locale = "en" | "ru" | "de" | "pt-br"`, `siteConfig`, `officialLinks`, npm scripts, and compiler/test configuration used by every later task.

- [ ] **Step 1: Create the package manifest and install the locked toolchain**

```json
{
  "name": "wardogs-wiki",
  "version": "1.0.0",
  "private": true,
  "engines": {"node": ">=20.9.0"},
  "scripts": {
    "dev": "next dev",
    "build": "npm run content:validate && next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "content:validate": "vitest run tests/content",
    "links:check": "node scripts/check-external-links.mjs",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@fontsource/inter": "5.3.0",
    "@fontsource/oswald": "5.3.0",
    "gray-matter": "4.0.3",
    "lucide-react": "1.31.0",
    "next": "16.3.0",
    "next-intl": "4.13.6",
    "next-mdx-remote": "6.0.0",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "unist-util-visit": "5.0.0",
    "zod": "4.4.3"
  },
  "devDependencies": {
    "@axe-core/playwright": "4.13.0",
    "@playwright/test": "1.62.1",
    "@tailwindcss/postcss": "4.3.3",
    "@types/mdast": "^4.0.0",
    "@types/node": "^24.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "10.8.1",
    "eslint-config-next": "16.3.0",
    "tailwindcss": "4.3.3",
    "typescript": "7.0.2",
    "vitest": "4.1.10"
  }
}
```

Run: `npm.cmd install`

Expected: `package-lock.json` is created and `npm.cmd ls --depth=0` exits 0.

- [ ] **Step 2: Write the failing site-configuration test**

```ts
import {describe, expect, it} from "vitest";
import {officialLinks, siteConfig} from "../../src/config/site";

describe("siteConfig", () => {
  it("locks the approved locales, theme, and official identity", () => {
    expect(siteConfig.locales).toEqual(["en", "ru", "de", "pt-br"]);
    expect(siteConfig.defaultLocale).toBe("en");
    expect(siteConfig.gameName).toBe("WARDOGS");
    expect(siteConfig.steamAppId).toBe("1867240");
    expect(siteConfig.theme.background).toBe("#0d0f0e");
    expect(officialLinks.steam).toMatch(/^https:\/\/store\.steampowered\.com\//);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/unit/site-config.test.ts`

Expected: FAIL because `src/config/site.ts` does not exist.

- [ ] **Step 4: Add exact project configuration and site constants**

`config/official-links.json`:

```json
{
  "steam": "https://store.steampowered.com/app/1867240/WARDOGS/",
  "team17": "https://www.team17.com/games/wardogs",
  "trailer": "https://www.youtube.com/watch?v=hVtmnaUCpuQ",
  "discord": "https://discord.com/invite/playwardogs",
  "reddit": "https://www.reddit.com/r/WarDogs/",
  "twitter": "https://x.com/wardogs"
}
```

`src/config/site.ts`:

```ts
import links from "../../config/official-links.json";

export const locales = ["en", "ru", "de", "pt-br"] as const;
export type Locale = (typeof locales)[number];

export const officialLinks = links;
export const siteConfig = {
  gameName: "WARDOGS",
  siteName: "WARDOGS Wiki",
  defaultLocale: "en" as const,
  locales,
  steamAppId: "1867240",
  origin: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  theme: {
    background: "#0d0f0e",
    surface: "#151b18",
    card: "#1b221f",
    text: "#f2f5f3",
    muted: "#a8b4ae",
    navTheme: "152 45% 38%",
    navThemeLight: "152 48% 50%",
    warning: "#d9a93a",
    danger: "#d45d5d"
  }
} as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
```

Use these exact supporting configurations:

```ts
// next.config.ts
import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {formats: ["image/avif", "image/webp"]}
};

export default withNextIntl(nextConfig);
```

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./src/*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.mts", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```js
// postcss.config.mjs
export default {plugins: {"@tailwindcss/postcss": {}}};
```

```js
// eslint.config.mjs
import {defineConfig, globalIgnores} from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([".next/**", "out/**", "coverage/**", "playwright-report/**", "test-results/**"])
]);
```

```ts
// vitest.config.ts
import path from "node:path";
import {defineConfig} from "vitest/config";

export default defineConfig({
  resolve: {alias: {"@": path.resolve(process.cwd(), "src")}},
  test: {environment: "node", include: ["tests/**/*.test.{ts,tsx}"]}
});
```

```ts
// playwright.config.ts
import {defineConfig, devices} from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", {open: "never"}]],
  use: {baseURL: "http://127.0.0.1:3000", trace: "on-first-retry"},
  projects: [{name: "chromium", use: {...devices["Desktop Chrome"]}}],
  webServer: {
    command: "npm.cmd run dev -- --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000/en",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
```

```ts
// next-env.d.ts
/* eslint-disable */
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

`.env.example` contains exactly `NEXT_PUBLIC_SITE_URL=https://example.com`.

- [ ] **Step 5: Run focused verification**

Run: `npm.cmd run test -- tests/unit/site-config.test.ts`

Expected: PASS with 1 test.

Run: `npm.cmd run typecheck`

Expected: PASS with no TypeScript diagnostics.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs vitest.config.ts playwright.config.ts next-env.d.ts .env.example config/official-links.json src/config/site.ts tests/unit/site-config.test.ts
git commit -m "chore: bootstrap WARDOGS wiki toolchain"
```

### Task 2: Keyword Manifest and Frontmatter Contract

**Files:**
- Create: `src/content/manifest.ts`
- Create: `src/content/schema.ts`
- Create: `src/content/source-policy.ts`
- Test: `tests/content/manifest.test.ts`
- Test: `tests/content/frontmatter-schema.test.ts`

**Interfaces:**
- Consumes: `keywords.json`, `Locale`, and the approved source registry.
- Produces: `GuideCategory`, `GuideManifestEntry`, `guideManifest`, `getManifestEntry(slug)`, `GuideFrontmatter`, and `validateGuideFrontmatter(value, entry)`.

- [ ] **Step 1: Write the failing manifest test**

```ts
import {describe, expect, it} from "vitest";
import {guideManifest} from "../../src/content/manifest";

const expected = [
  ["access", "wardogs playtest", "wardogs-playtest"],
  ["access", "wardogs beta", "wardogs-beta"],
  ["access", "wardogs alpha", "wardogs-alpha"],
  ["access", "wardogs alpha key", "wardogs-alpha-key"],
  ["release", "wardogs release date", "wardogs-release-date"],
  ["release", "wardogs early access", "wardogs-early-access"],
  ["store", "wardogs steam", "wardogs-steam"],
  ["store", "wardogs price", "wardogs-price"],
  ["store", "wardogs download", "wardogs-download"],
  ["platform", "wardogs ps5", "wardogs-ps5"],
  ["video", "wardogs trailer", "wardogs-trailer"],
  ["video", "wardogs first look", "wardogs-first-look"],
  ["video", "wardogs livestream", "wardogs-livestream"],
  ["community", "wardogs discord", "wardogs-discord"],
  ["community", "wardogs reddit", "wardogs-reddit"],
  ["community", "wardogs twitter", "wardogs-twitter"],
  ["community", "wardogs discord account verification", "wardogs-discord-account-verification"],
  ["developer", "wardogs game developers", "wardogs-game-developers"],
  ["guide", "wardogs gameplay", "wardogs-gameplay"],
  ["guide", "wardogs factions", "wardogs-factions"]
] as const;

describe("guideManifest", () => {
  it("maps every approved keyword exactly once and in traffic order", () => {
    expect(guideManifest.map(({category, keyword, slug}) => [category, keyword, slug])).toEqual(expected);
    expect(new Set(guideManifest.map(({slug}) => slug)).size).toBe(20);
    expect(guideManifest.map(({order}) => order)).toEqual(Array.from({length: 20}, (_, index) => index + 1));
  });
});
```

- [ ] **Step 2: Write the failing schema and source-policy test**

```ts
import {describe, expect, it} from "vitest";
import {guideManifest} from "../../src/content/manifest";
import {validateGuideFrontmatter} from "../../src/content/schema";

const entry = guideManifest[18];
const valid = {
  title: "WARDOGS Gameplay Explained",
  description: "Learn how WARDOGS matches work, from Control Zone scoring and persistent cash to vehicles, building, team roles, objectives, and match-winning tactics.",
  keyword: "wardogs gameplay",
  category: "guide",
  slug: "wardogs-gameplay",
  order: 19,
  updatedAt: "2026-08-13",
  badges: [{label: "Guide", tone: "accent"}],
  faq: [
    {question: "How many players are in WARDOGS?", answer: "Up to 100 players are split across three teams."},
    {question: "Is WARDOGS a battle royale?", answer: "No. Its main mode is a three-team Control Zone contest."}
  ],
  sources: [{label: "WARDOGS on Steam", url: "https://store.steampowered.com/app/1867240/WARDOGS/", kind: "official", checkedAt: "2026-08-13"}]
};

describe("validateGuideFrontmatter", () => {
  it("accepts a matching record and rejects mismatches or competitor URLs", () => {
    expect(validateGuideFrontmatter(valid, entry).slug).toBe(entry.slug);
    expect(() => validateGuideFrontmatter({...valid, order: 20}, entry)).toThrow(/order/i);
    expect(() => validateGuideFrontmatter({...valid, sources: [{...valid.sources[0], url: "https://wardogshub.gg/"}]}, entry)).toThrow(/source/i);
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm.cmd run test -- tests/content/manifest.test.ts tests/content/frontmatter-schema.test.ts`

Expected: FAIL because the manifest and schema modules do not exist.

- [ ] **Step 4: Implement deterministic manifest derivation**

```ts
import keywords from "../../keywords.json";

export type GuideCategory = "access" | "release" | "store" | "platform" | "video" | "community" | "developer" | "guide";
export type GuideManifestEntry = {category: GuideCategory; keyword: string; slug: string; order: number};

function keywordToSlug(keyword: string): string {
  return keyword.toLowerCase().trim().replace(/\s+/g, "-");
}

export const guideManifest: readonly GuideManifestEntry[] = keywords.categories.flatMap((group) =>
  group.keywords.map((keyword) => ({category: group.category as GuideCategory, keyword, slug: keywordToSlug(keyword)}))
).map((entry, index) => ({...entry, order: index + 1}));

export function getManifestEntry(slug: string): GuideManifestEntry | undefined {
  return guideManifest.find((entry) => entry.slug === slug);
}
```

Add a Zod object matching the specification's complete frontmatter contract. Refine `title`, `description`, ISO dates, two-or-more FAQs, source kind, HTTPS URL, badge tone, and exact `keyword/category/slug/order` equality against the passed manifest entry. `source-policy.ts` must allow only Steam, Steam Community, Team17, BULKHEAD, YouTube, Discord, X, and Reddit hosts and explicitly reject `wardogshub.gg` and `gamblewithyourfriends.net`.

- [ ] **Step 5: Run focused tests**

Run: `npm.cmd run test -- tests/content/manifest.test.ts tests/content/frontmatter-schema.test.ts`

Expected: PASS with all manifest and schema assertions.

- [ ] **Step 6: Commit**

```bash
git add src/content/manifest.ts src/content/schema.ts src/content/source-policy.ts tests/content/manifest.test.ts tests/content/frontmatter-schema.test.ts
git commit -m "feat: validate the WARDOGS keyword manifest"
```

### Task 3: Safe MDX Loader and Content-Matrix Validator

**Files:**
- Create: `src/content/mdx-policy.ts`
- Create: `src/content/guides.ts`
- Create: `tests/fixtures/en/guides/wardogs-gameplay.mdx`
- Test: `tests/content/guide-loader.test.ts`
- Test: `tests/content/mdx-policy.test.ts`

**Interfaces:**
- Consumes: `Locale`, `GuideManifestEntry`, `guideManifest`, and `validateGuideFrontmatter`.
- Produces: `GuideDocument`, `GuideSummary`, `parseGuideSource(source, entry)`, `loadGuideDocument(locale, slug, root?)`, `listGuideSummaries(locale, root?)`, `assertCompleteContentMatrix(locales, root?)`, and `compileGuideBody(body, components)`.

- [ ] **Step 1: Create one complete fixture and failing loader tests**

```mdx
---
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
    answer: "Up to 100 players are split across three teams."
  - question: "Is WARDOGS a battle royale?"
    answer: "No. Its main mode is a three-team Control Zone contest."
sources:
  - label: "WARDOGS on Steam"
    url: "https://store.steampowered.com/app/1867240/WARDOGS/"
    kind: "official"
    checkedAt: "2026-08-13"
---

WARDOGS is a tactical all-out warfare FPS built around a contested Control Zone.

## Match objective

Three teams fight to become the largest force inside the active zone.
```

```ts
import path from "node:path";
import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, loadGuideDocument} from "../../src/content/guides";

const root = path.resolve("tests/fixtures");

describe("guide loader", () => {
  it("loads a matching MDX document", async () => {
    const guide = await loadGuideDocument("en", "wardogs-gameplay", root);
    expect(guide?.frontmatter.order).toBe(19);
    expect(guide?.body).toContain("## Match objective");
  });

  it("reports the exact missing matrix entries", async () => {
    await expect(assertCompleteContentMatrix(["en"], root)).rejects.toThrow(/19 missing/i);
  });
});
```

- [ ] **Step 2: Write the failing MDX policy test**

```ts
import {describe, expect, it} from "vitest";
import {compileGuideBody} from "../../src/content/guides";

describe("MDX policy", () => {
  it.each([
    ["<script>alert(1)</script>", /raw html/i],
    ["<iframe src=\"https://example.com\" />", /component/i],
    ["import X from './x'", /import/i],
    ["![remote](https://example.com/a.jpg)", /remote image/i]
  ])("rejects unsafe source", async (source, message) => {
    await expect(compileGuideBody(source, {})).rejects.toThrow(message);
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm.cmd run test -- tests/content/guide-loader.test.ts tests/content/mdx-policy.test.ts`

Expected: FAIL because `src/content/guides.ts` does not exist.

- [ ] **Step 4: Implement parsing, matrix validation, and AST policy**

```ts
export type GuideDocument = {
  locale: Locale;
  frontmatter: GuideFrontmatter;
  body: string;
};

export type GuideSummary = Pick<GuideFrontmatter,
  "title" | "description" | "keyword" | "category" | "slug" | "order" | "updatedAt" | "badges"
>;

export async function loadGuideDocument(
  locale: Locale,
  slug: string,
  root = path.resolve("content")
): Promise<GuideDocument | null>;

export async function listGuideSummaries(
  locale: Locale,
  root = path.resolve("content")
): Promise<GuideSummary[]>;

export async function assertCompleteContentMatrix(
  requestedLocales: readonly Locale[],
  root = path.resolve("content")
): Promise<void>;
```

Use `gray-matter` to split frontmatter and body, validate against the matching manifest row, and keep lists in manifest order. Implement a unified/MDX remark visitor that rejects `html`, `mdxjsEsm`, remote `image` nodes, and JSX component names outside `FactGrid`, `Notice`, `Steps`, `ComparisonTable`, `OfficialVideo`, and `SourceNote`. Compile with `compileMDX` from `next-mdx-remote/rsc` and pass the caller's component map.

- [ ] **Step 5: Run focused verification**

Run: `npm.cmd run test -- tests/content/guide-loader.test.ts tests/content/mdx-policy.test.ts`

Expected: PASS with safe fixture loading, an exact 19-file deficit, and all four unsafe forms rejected.

- [ ] **Step 6: Commit**

```bash
git add src/content/mdx-policy.ts src/content/guides.ts tests/fixtures/en/guides/wardogs-gameplay.mdx tests/content/guide-loader.test.ts tests/content/mdx-policy.test.ts
git commit -m "feat: add safe localized MDX loading"
```

### Task 4: Four-Locale Routing and Interface Messages

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`
- Create: `src/proxy.ts`
- Create: `messages/en.json`
- Create: `messages/ru.json`
- Create: `messages/de.json`
- Create: `messages/pt-br.json`
- Test: `tests/unit/i18n.test.ts`

**Interfaces:**
- Consumes: `locales`, `defaultLocale`, and Next.js request locale.
- Produces: `routing`, localized `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`, request messages, and locale-prefix proxy behavior.

- [ ] **Step 1: Write the failing locale and message-parity test**

```ts
import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";

const localeNames = ["en", "ru", "de", "pt-br"] as const;
const keys = (value: unknown, prefix = ""): string[] =>
  Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object" && !Array.isArray(child) ? keys(child, path) : [path];
  });

describe("localized messages", () => {
  it("has four complete files with identical key paths", async () => {
    const messages = await Promise.all(localeNames.map(async (locale) =>
      JSON.parse(await readFile(`messages/${locale}.json`, "utf8"))
    ));
    const expected = keys(messages[0]).sort();
    for (const message of messages) {
      expect(keys(message).sort()).toEqual(expected);
      expect(JSON.stringify(message)).not.toContain('""');
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/unit/i18n.test.ts`

Expected: FAIL because the four message files do not exist.

- [ ] **Step 3: Implement next-intl routing**

```ts
// src/i18n/routing.ts
import {defineRouting} from "next-intl/routing";
import {locales, siteConfig} from "@/config/site";

export const routing = defineRouting({
  locales,
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: "always",
  localeDetection: false
});
```

```ts
// src/i18n/navigation.ts
import {createNavigation} from "next-intl/navigation";
import {routing} from "./routing";

export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
```

`request.ts` resolves the requested locale and loads the matching dictionary:

```ts
import {getRequestConfig} from "next-intl/server";
import {isLocale, siteConfig} from "@/config/site";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : siteConfig.defaultLocale;
  return {locale, messages: (await import(`../../messages/${locale}.json`)).default};
});
```

`proxy.ts` gives `/` an explicit permanent English redirect, lets an unsupported first segment reach `[locale]/layout.tsx` and its 404 boundary, and applies next-intl only to a supported locale:

```ts
import createMiddleware from "next-intl/middleware";
import {NextRequest, NextResponse} from "next/server";
import {isLocale} from "@/config/site";
import {routing} from "@/i18n/routing";

const handleI18n = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;
  if (pathname === "/") return NextResponse.redirect(new URL("/en", request.url), 308);
  const firstSegment = pathname.split("/")[1];
  if (firstSegment && !isLocale(firstSegment)) return NextResponse.next();
  return handleI18n(request);
}

export const config = {matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]};
```

- [ ] **Step 4: Author the complete interface dictionaries**

Each JSON file must contain the same leaves under `common`, `nav`, `home`, `guides`, `article`, `categories`, `footer`, `privacy`, `terms`, and `notFound`. Use these exact high-visibility translations; the remaining sentences in each namespace must be complete natural copy in the same language.

| Key | `en` | `ru` | `de` | `pt-br` |
| --- | --- | --- | --- | --- |
| `common.fanMade` | Fan-Made Community Wiki | Фанатская энциклопедия сообщества | Fan-Wiki der Community | Wiki criada pela comunidade |
| `nav.playtest` | Playtest | Плейтест | Playtest | Teste público |
| `nav.release` | Release | Релиз | Release | Lançamento |
| `nav.gameplay` | Gameplay | Геймплей | Gameplay | Jogabilidade |
| `nav.factions` | Factions | Фракции | Fraktionen | Facções |
| `nav.community` | Community | Сообщество | Community | Comunidade |
| `nav.videos` | Videos | Видео | Videos | Vídeos |
| `nav.guides` | Guides | Руководства | Guides | Guias |
| `home.heroTitle` | Complete Guide | Полное руководство | Der komplette Guide | Guia completo |
| `home.primaryCta` | Explore All Guides | Смотреть все руководства | Alle Guides ansehen | Ver todos os guias |
| `home.secondaryCta` | Check Playtest Access | Проверить доступ к плейтесту | Playtest-Zugang prüfen | Ver acesso ao teste |
| `guides.title` | WARDOGS Guides | Руководства WARDOGS | WARDOGS Guides | Guias de WARDOGS |
| `article.sources` | Sources | Источники | Quellen | Fontes |
| `article.related` | Related Guides | Похожие руководства | Verwandte Guides | Guias relacionados |
| `categories.access` | Access | Доступ | Zugang | Acesso |
| `categories.release` | Release | Релиз | Release | Lançamento |
| `categories.store` | Store | Магазин | Shop | Loja |
| `categories.platform` | Platform | Платформа | Plattform | Plataforma |
| `categories.video` | Video | Видео | Video | Vídeo |
| `categories.community` | Community | Сообщество | Community | Comunidade |
| `categories.developer` | Developer | Разработчики | Entwickler | Desenvolvimento |
| `categories.guide` | Guide | Руководство | Guide | Guia |
| `notFound.title` | Page Not Found | Страница не найдена | Seite nicht gefunden | Página não encontrada |

- [ ] **Step 5: Run focused verification**

Run: `npm.cmd run test -- tests/unit/i18n.test.ts`

Expected: PASS with four dictionaries and identical key paths.

Run: `npm.cmd run typecheck`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/proxy.ts messages tests/unit/i18n.test.ts
git commit -m "feat: add complete four-locale routing"
```

### Task 5: Official Assets, Typography, and Design Tokens

**Files:**
- Create: `public/images/wardogs-fullmark-white.png`
- Create: `public/images/wardogs-fullmark-full.png`
- Create: `public/images/wardogs-hero.jpg`
- Create: `public/images/wardogs-helicopter.jpg`
- Create: `public/images/og-wardogs.jpg`
- Create: `public/icons/favicon.ico`
- Create: `public/icons/favicon-16x16.png`
- Create: `public/icons/favicon-32x32.png`
- Create: `public/icons/apple-touch-icon.png`
- Create: `public/icons/android-chrome-192x192.png`
- Create: `public/icons/android-chrome-512x512.png`
- Create: `public/site.webmanifest`
- Create: `src/app/globals.css`
- Create: `src/components/brand/official-wordmark.tsx`
- Create: `src/components/ui/status-badge.tsx`
- Create: `src/components/ui/button-link.tsx`
- Test: `tests/unit/visual-foundation.test.tsx`

**Interfaces:**
- Consumes: official Team17 press-kit logos, official Steam/Team17 screenshots, existing favicon files, and site theme constants.
- Produces: `OfficialWordmark({variant, className, priority, decorative})`, `StatusBadge`, `ButtonLink`, local media paths, font classes, and global visual tokens.

- [ ] **Step 1: Write the failing visual-foundation test**

```tsx
import {readFile, stat} from "node:fs/promises";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {OfficialWordmark} from "../../src/components/brand/official-wordmark";

describe("visual foundation", () => {
  it("ships local official marks and approved CSS tokens", async () => {
    expect((await stat("public/images/wardogs-fullmark-white.png")).size).toBeGreaterThan(20_000);
    expect((await stat("public/images/wardogs-fullmark-full.png")).size).toBeGreaterThan(20_000);
    const css = await readFile("src/app/globals.css", "utf8");
    expect(css).toContain("--background: #0d0f0e");
    expect(css).toContain("--nav-theme: 152 45% 38%");
    expect(renderToStaticMarkup(<OfficialWordmark variant="white" />)).toContain("WARDOGS");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/unit/visual-foundation.test.tsx`

Expected: FAIL because public assets, CSS, and `OfficialWordmark` do not exist.

- [ ] **Step 3: Copy and download the approved assets**

Copy the two already extracted 2468 x 490 official marks from `.superpowers/brainstorm/wardogs-layout-20260813/content/` into `public/images/`. Copy the six browser icons from `icon/` into `public/icons/`. Download these official images and keep them local:

```text
WARDOGS hero:
https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1867240/13fbc7cb084ec25c20ad031c7e888a9459cd8e77/ss_13fbc7cb084ec25c20ad031c7e888a9459cd8e77.1920x1080.jpg

Helicopter media:
https://www.team17.com/hs-fs/hubfs/WD_Screenshot_Helicopter_1_WD1.jpg?length=2000&name=WD_Screenshot_Helicopter_1_WD1.jpg
```

Create `og-wardogs.jpg` as a deterministic 1200 x 630 center crop of the official hero image. Set the manifest theme/background to `#356f51` and `#0d0f0e`, and use `/icons/android-chrome-*.png` paths.

- [ ] **Step 4: Implement tokens and primitive components**

```css
@import "tailwindcss";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/oswald/500.css";
@import "@fontsource/oswald/700.css";

:root {
  --background: #0d0f0e;
  --surface: #151b18;
  --card: #1b221f;
  --text: #f2f5f3;
  --muted: #a8b4ae;
  --nav-theme: 152 45% 38%;
  --nav-theme-light: 152 48% 50%;
  --warning: #d9a93a;
  --danger: #d45d5d;
}
```

`OfficialWordmark` must render the white or full-color local PNG at its intrinsic 2468:490 ratio, provide `alt="WARDOGS"` unless `decorative` is true, and never combine `Wiki` into the image itself. Buttons use green for primary, charcoal for secondary, visible focus rings, stable heights, and no radius above 8 px.

- [ ] **Step 5: Run focused verification**

Run: `npm.cmd run test -- tests/unit/visual-foundation.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add public src/app/globals.css src/components/brand src/components/ui tests/unit/visual-foundation.test.tsx
git commit -m "feat: add official WARDOGS visual foundation"
```

### Task 6: English Guide Library

**Files:**
- Create: `content/en/guides/wardogs-playtest.mdx`
- Create: `content/en/guides/wardogs-beta.mdx`
- Create: `content/en/guides/wardogs-alpha.mdx`
- Create: `content/en/guides/wardogs-alpha-key.mdx`
- Create: `content/en/guides/wardogs-release-date.mdx`
- Create: `content/en/guides/wardogs-early-access.mdx`
- Create: `content/en/guides/wardogs-steam.mdx`
- Create: `content/en/guides/wardogs-price.mdx`
- Create: `content/en/guides/wardogs-download.mdx`
- Create: `content/en/guides/wardogs-ps5.mdx`
- Create: `content/en/guides/wardogs-trailer.mdx`
- Create: `content/en/guides/wardogs-first-look.mdx`
- Create: `content/en/guides/wardogs-livestream.mdx`
- Create: `content/en/guides/wardogs-discord.mdx`
- Create: `content/en/guides/wardogs-reddit.mdx`
- Create: `content/en/guides/wardogs-twitter.mdx`
- Create: `content/en/guides/wardogs-discord-account-verification.mdx`
- Create: `content/en/guides/wardogs-game-developers.mdx`
- Create: `content/en/guides/wardogs-gameplay.mdx`
- Create: `content/en/guides/wardogs-factions.mdx`
- Create: `tests/content/content-matrix.test.ts`

**Interfaces:**
- Consumes: the 20-entry manifest, frontmatter schema, loader, `关键词素材.md.txt`, and the three supplied creator transcripts.
- Produces: 20 validated English `GuideDocument` records and the build-blocking matrix test later extended to all locales.

- [ ] **Step 1: Write the failing English matrix test**

```ts
import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

describe("English guide library", () => {
  it("contains 20 substantial, unique, manifest-matched guides", async () => {
    await expect(assertCompleteContentMatrix(["en"])).resolves.toBeUndefined();
    const summaries = await listGuideSummaries("en");
    expect(summaries).toHaveLength(20);
    expect(new Set(summaries.map(({title}) => title)).size).toBe(20);
    expect(new Set(summaries.map(({description}) => description)).size).toBe(20);
    for (const summary of summaries) {
      const guide = await loadGuideDocument("en", summary.slug);
      expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
      expect(guide?.frontmatter.faq.length).toBeGreaterThanOrEqual(2);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/content/content-matrix.test.ts`

Expected: FAIL and list all 20 missing English slugs.

- [ ] **Step 3: Author the 20 English articles against this exact editorial matrix**

| Slug | Title and required sections | Confirmed content boundary |
| --- | --- | --- |
| `wardogs-playtest` | `WARDOGS Playtest: Dates, Access, and Sign-Up`; Current Status, How Access Works, Closed Beta, Troubleshooting | Steam Request Access is a chance; pre-order guarantees Aug 21-23 closed beta access; no invented start time |
| `wardogs-beta` | `WARDOGS Beta: Dates, Access, and What to Expect`; Dates, Eligibility, Build Expectations, Progress | Aug 21-23 2026; preload, start time, persistence, and server capacity remain unconfirmed unless Steam posts them |
| `wardogs-alpha` | `WARDOGS Alpha: Test History and Current Status`; Test Timeline, What Was Tested, NDA, Current Route | Historical Alpha facts stay separate from the current Steam beta route |
| `wardogs-alpha-key` | `WARDOGS Alpha Key: What Access Is Available Now`; Key Status, Legacy FirstLook Route, Current Access, Scam Safety | Do not promise keys; explain that old FirstLook registration is historical and current access is through Steam |
| `wardogs-release-date` | `WARDOGS Release Date: Early Access Launch Details`; Confirmed Date, Platform, Launch Time, Full Release | Steam Early Access is Sep 10 2026 on Windows; exact unlock time is unconfirmed; full release follows an estimated 1-2 year Early Access period |
| `wardogs-early-access` | `WARDOGS Early Access: Roadmap, Scope, and FAQ`; Why Early Access, Launch Scope, Planned Growth, Pricing | Quote no long passages; paraphrase Steam's 1-2 year estimate and planned maps, weapons, vehicles, progression, seasons, jets, balance, performance |
| `wardogs-steam` | `WARDOGS Steam Guide: Store Page, Access, and Specs`; Official App, Access Controls, Languages, Requirements, Anti-Cheat | App 1867240, Windows, 14 interface languages, English full audio, Easy Anti-Cheat, 50 GB available storage |
| `wardogs-price` | `WARDOGS Price: Editions and Regional Pricing`; Base Edition, Supporter Edition, Regions, Refund Context | Display verified US reference prices only after checking Steam; explain dynamic regional pricing and never convert one region as universal |
| `wardogs-download` | `WARDOGS Download: Steam Install and Storage Guide`; Safe Download, Install Steps, Storage, Preload | Steam-only instructions; 50 GB is available storage, not compressed download size; warn against unauthorized installers |
| `wardogs-ps5` | `Is WARDOGS Coming to PS5? Current Platform Status`; Current Platform, Console Status, What to Watch | Only PC/Steam is announced; no PS5 date or cross-play promise |
| `wardogs-trailer` | `WARDOGS Trailer Guide: Official Videos in Order`; Reveal Trailer, Gameplay Footage, What Is Confirmed, Build Caveats | Embed official Team17 reveal video `hVtmnaUCpuQ`; separate current store facts from visuals in older builds |
| `wardogs-first-look` | `WARDOGS First Look: What Preview Footage Reveals`; Seven Key Ideas, Match Flow, Logistics, Performance, Caveats | Attribute videos `-k6IV0ITLDo`, `eAE9LOV-p3s`, and `83AVH6FtemY`; label impressions and pre-release mechanics as build-sensitive |
| `wardogs-livestream` | `WARDOGS Livestream: Official Streams and VOD Guide`; Official Broadcasts, Creator Streams, What to Verify, VOD Safety | Identify official versus creator channels; do not claim an archived VOD exists without a live URL |
| `wardogs-discord` | `WARDOGS Discord: Official Server and Safety Guide`; Official Invite, Useful Channels, Access Limits, Safety | Use `discord.com/invite/playwardogs`; joining does not guarantee beta access; cross-check announcements against Steam |
| `wardogs-reddit` | `WARDOGS Reddit: Community Guide and Useful Threads`; Community Status, Useful Posts, Reliability, Rules | Use `reddit.com/r/WarDogs/` as community material, not an official fact source; attribute claims and opinions |
| `wardogs-twitter` | `WARDOGS Twitter: Finding Verified Game Updates`; Official Account, Verification, Update Workflow, Impersonators | Link `x.com/wardogs` only alongside Team17/Steam verification; direct release/access facts back to Steam |
| `wardogs-discord-account-verification` | `WARDOGS Discord Account Verification Guide`; Current Need, Legacy Steps, Steam/Discord, Troubleshooting | Explain the legacy FirstLook Discord verification flow as historical; do not imply it is required for current Steam beta access |
| `wardogs-game-developers` | `Who Is Making WARDOGS? Developer and Publisher Guide`; BULKHEAD, Team17, Roles, Official Channels | BULKHEAD is developer, Team17 publisher; avoid unsupported staffing and ownership claims |
| `wardogs-gameplay` | `WARDOGS Gameplay Explained: Modes, Cash, and Roles`; Beginner Guide, Control Zone, Cash, Team Roles, Vehicles, FOBs, Destruction | Up to 100 players, three teams, randomized 2x2 km zone within 256 km² map, first to 100, $10,000 start, persistent cash, local voice; not BR/extraction |
| `wardogs-factions` | `WARDOGS Factions: Valkyra, Lonestar, and Manticore`; Three Factions, Confirmed Lore, Team Identity, Unknown Bonuses | Name Valkyra, Lonestar, Manticore; state that unique bonuses, locked weapons, and balance traits are not officially confirmed |

Every file uses its exact manifest keyword/category/slug/order, `updatedAt: "2026-08-13"`, at least two useful FAQs, a 140-160 character unique description, a direct-answer first paragraph, and source notes with `checkedAt: "2026-08-13"`. Primary sources are the official Steam page, Team17 page, Team17 reveal trailer, Discord invite, WARDOGS X profile, and r/WarDogs; only the first-look article uses the three creator videos as `kind: "creator"`.

- [ ] **Step 4: Run English content validation**

Run: `npm.cmd run test -- tests/content/content-matrix.test.ts`

Expected: PASS with 20 English files, unique titles/descriptions, valid SEO lengths, and bodies at least 1,200 characters.

- [ ] **Step 5: Commit**

```bash
git add content/en tests/content/content-matrix.test.ts
git commit -m "content: add twenty English WARDOGS guides"
```

### Task 7: Russian Guide Library

**Files:**
- Create: `content/ru/guides/*.mdx` for all 20 manifest slugs
- Modify: `tests/content/content-matrix.test.ts`
- Test: `tests/content/russian-content.test.ts`

**Interfaces:**
- Consumes: the English fact/source matrix, Russian interface glossary, and immutable English manifest fields.
- Produces: 20 independent Russian guide documents with localized visible prose and unchanged source URLs.

- [ ] **Step 1: Write the failing Russian content test**

```ts
import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

describe("Russian guide library", () => {
  it("contains localized Cyrillic content for all 20 slugs", async () => {
    await expect(assertCompleteContentMatrix(["en", "ru"])).resolves.toBeUndefined();
    const summaries = await listGuideSummaries("ru");
    expect(summaries).toHaveLength(20);
    for (const summary of summaries) {
      expect(summary.title).toMatch(/[А-Яа-яЁё]/);
      const guide = await loadGuideDocument("ru", summary.slug);
      expect(guide?.body).toMatch(/[А-Яа-яЁё]{4}/);
      expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/content/russian-content.test.ts`

Expected: FAIL because `content/ru/guides` is missing.

- [ ] **Step 3: Manually author all 20 Russian MDX files**

Use natural Russian titles led by `WARDOGS`: `Плейтест: даты, доступ и регистрация`, `Бета-тест: даты и доступ`, `Альфа-тест: история и статус`, `Ключ альфа-теста: доступ сейчас`, `Дата выхода и ранний доступ`, `Ранний доступ: планы и содержание`, `Steam: страница, доступ и требования`, `Цена и издания`, `Скачивание через Steam`, `Версия для PS5`, `Трейлеры по порядку`, `Первый взгляд`, `Трансляции и записи`, `Официальный Discord`, `Сообщество Reddit`, `Официальные обновления в X`, `Проверка аккаунта Discord`, `Разработчик и издатель`, `Геймплей: режим, деньги и роли`, and `Фракции: Valkyra, Lonestar и Manticore`.

Preserve English `keyword`, `category`, `slug`, `order`, ISO dates, and source URLs exactly. Translate title, description, badge labels, FAQ, source labels, body headings, tables, notices, and prose. Retain uncertainty qualifiers and historical/current distinctions from the English matrix; do not translate WARDOGS or faction names.

- [ ] **Step 4: Run Russian and full matrix validation**

Run: `npm.cmd run test -- tests/content/russian-content.test.ts tests/content/content-matrix.test.ts`

Expected: PASS with 40 total documents and no English-body fallback.

- [ ] **Step 5: Commit**

```bash
git add content/ru tests/content/content-matrix.test.ts tests/content/russian-content.test.ts
git commit -m "content: add twenty Russian WARDOGS guides"
```

### Task 8: German Guide Library

**Files:**
- Create: `content/de/guides/*.mdx` for all 20 manifest slugs
- Modify: `tests/content/content-matrix.test.ts`
- Test: `tests/content/german-content.test.ts`

**Interfaces:**
- Consumes: the English fact/source matrix, German interface glossary, and immutable manifest fields.
- Produces: 20 independent German guide documents with translated visible content.

- [ ] **Step 1: Write the failing German content test**

```ts
import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

describe("German guide library", () => {
  it("contains 20 localized guides without copying English bodies", async () => {
    await expect(assertCompleteContentMatrix(["en", "de"])).resolves.toBeUndefined();
    const summaries = await listGuideSummaries("de");
    const english = await listGuideSummaries("en");
    expect(summaries).toHaveLength(20);
    for (const [index, summary] of summaries.entries()) {
      expect(summary.description).not.toBe(english[index].description);
      const deGuide = await loadGuideDocument("de", summary.slug);
      const enGuide = await loadGuideDocument("en", summary.slug);
      expect(deGuide?.body).not.toBe(enGuide?.body);
      expect(deGuide?.body.length).toBeGreaterThanOrEqual(1_200);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/content/german-content.test.ts`

Expected: FAIL because `content/de/guides` is missing.

- [ ] **Step 3: Manually author all 20 German MDX files**

Use these topic titles: `WARDOGS Playtest: Termine und Zugang`, `WARDOGS Beta: Termine und Teilnahme`, `WARDOGS Alpha: Verlauf und aktueller Stand`, `WARDOGS Alpha-Key: Aktuelle Zugangslage`, `WARDOGS Release: Termin und Early Access`, `WARDOGS Early Access: Umfang und Pläne`, `WARDOGS auf Steam: Zugang und Anforderungen`, `WARDOGS Preis: Editionen und Regionen`, `WARDOGS Download: Installation über Steam`, `Kommt WARDOGS für PS5?`, `WARDOGS Trailer in der richtigen Reihenfolge`, `WARDOGS First Look: Erkenntnisse aus Vorschauen`, `WARDOGS Livestreams und Aufzeichnungen`, `WARDOGS Discord: Offizieller Server`, `WARDOGS Reddit: Community-Leitfaden`, `WARDOGS auf X: Verifizierte Updates`, `WARDOGS Discord-Konto verifizieren`, `WARDOGS Entwickler und Publisher`, `WARDOGS Gameplay: Modus, Geld und Rollen`, and `WARDOGS Fraktionen: Valkyra, Lonestar, Manticore`.

Keep immutable manifest and source fields in English, but translate every visible field and MDX body. Use German date prose while preserving ISO frontmatter. Use `Control Zone` once with a German explanation, then use the chosen German term consistently. Preserve every warning about unconfirmed access, times, PS5, cross-play, and faction bonuses.

- [ ] **Step 4: Run German and matrix validation**

Run: `npm.cmd run test -- tests/content/german-content.test.ts tests/content/content-matrix.test.ts`

Expected: PASS with 60 total documents.

- [ ] **Step 5: Commit**

```bash
git add content/de tests/content/content-matrix.test.ts tests/content/german-content.test.ts
git commit -m "content: add twenty German WARDOGS guides"
```

### Task 9: Brazilian Portuguese Guide Library

**Files:**
- Create: `content/pt-br/guides/*.mdx` for all 20 manifest slugs
- Modify: `tests/content/content-matrix.test.ts`
- Test: `tests/content/portuguese-content.test.ts`

**Interfaces:**
- Consumes: the English fact/source matrix, Brazilian Portuguese glossary, and immutable manifest fields.
- Produces: 20 independent Brazilian Portuguese guide documents and the complete 80-file matrix.

- [ ] **Step 1: Write the failing Brazilian Portuguese content test**

```ts
import {describe, expect, it} from "vitest";
import {assertCompleteContentMatrix, listGuideSummaries, loadGuideDocument} from "../../src/content/guides";

describe("Brazilian Portuguese guide library", () => {
  it("completes all 80 localized guide documents", async () => {
    await expect(assertCompleteContentMatrix(["en", "ru", "de", "pt-br"])).resolves.toBeUndefined();
    const summaries = await listGuideSummaries("pt-br");
    expect(summaries).toHaveLength(20);
    for (const summary of summaries) {
      expect(summary.title).toMatch(/WARDOGS/);
      const guide = await loadGuideDocument("pt-br", summary.slug);
      expect(guide?.body).toMatch(/\b(não|acesso|jogo|equipe|guia)\b/i);
      expect(guide?.body.length).toBeGreaterThanOrEqual(1_200);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/content/portuguese-content.test.ts`

Expected: FAIL because `content/pt-br/guides` is missing.

- [ ] **Step 3: Manually author all 20 Brazilian Portuguese MDX files**

Use these topic titles: `WARDOGS Playtest: datas e acesso`, `WARDOGS Beta: datas e participação`, `WARDOGS Alpha: histórico e status`, `WARDOGS Alpha Key: acesso disponível`, `Data de lançamento de WARDOGS`, `WARDOGS Early Access: conteúdo e planos`, `WARDOGS na Steam: acesso e requisitos`, `Preço de WARDOGS: edições e regiões`, `Download de WARDOGS pela Steam`, `WARDOGS terá versão para PS5?`, `Trailers de WARDOGS em ordem`, `WARDOGS First Look: o que os vídeos revelam`, `Lives e gravações de WARDOGS`, `Discord oficial de WARDOGS`, `Reddit de WARDOGS: guia da comunidade`, `WARDOGS no X: atualizações verificadas`, `Como verificar o Discord de WARDOGS`, `Quem desenvolve WARDOGS?`, `Jogabilidade de WARDOGS: modo, dinheiro e funções`, and `Facções de WARDOGS: Valkyra, Lonestar e Manticore`.

Translate all visible copy into Brazilian Portuguese while retaining manifest fields, source URLs, dates, official names, and faction names. Use `Steam` with its official capitalization, explain `Control Zone` on first use, and preserve every distinction between official confirmation, historical tests, and creator impressions.

- [ ] **Step 4: Run complete content verification**

Run: `npm.cmd run content:validate`

Expected: PASS with exactly 80 files, four copies of every slug, unique localized metadata, valid sources, and no schema mismatch.

- [ ] **Step 5: Commit**

```bash
git add content/pt-br tests/content/content-matrix.test.ts tests/content/portuguese-content.test.ts
git commit -m "content: add twenty Portuguese WARDOGS guides"
```

### Task 10: Shared Application Shell and Homepage

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/mobile-nav.tsx`
- Create: `src/components/layout/locale-switcher.tsx`
- Create: `src/components/layout/site-footer.tsx`
- Create: `src/components/home/home-hero.tsx`
- Create: `src/components/home/about-game.tsx`
- Create: `src/components/home/start-here.tsx`
- Create: `src/components/home/category-grid.tsx`
- Create: `src/components/home/official-media.tsx`
- Create: `src/components/home/beginner-tips.tsx`
- Create: `src/components/ui/stats-grid.tsx`
- Create: `src/components/ui/faq-list.tsx`
- Create: `src/features/home/home-data.ts`
- Test: `tests/unit/home-data.test.ts`

**Interfaces:**
- Consumes: routing/messages, official assets, UI primitives, manifest, and official links.
- Produces: the statically generated localized homepage, shared header/footer, `HOME_FACT_KEYS`, `getHomeFacts(translate)`, `START_GUIDES`, and reusable FAQ/stats components.

- [ ] **Step 1: Write the failing homepage-model test**

```ts
import {describe, expect, it} from "vitest";
import {getHomeFacts, START_GUIDES} from "../../src/features/home/home-data";

describe("homepage data", () => {
  it("uses four intuitive facts and four working start routes", () => {
    const copy = {
      earlyAccess: "Early Access Sep 10, 2026",
      players: "Up to 100 Players",
      teams: "3 Teams",
      controlZone: "2 x 2 km Control Zone"
    } as const;
    const facts = getHomeFacts((key) => copy[key]);
    expect(facts).toEqual([
      "Early Access Sep 10, 2026",
      "Up to 100 Players",
      "3 Teams",
      "2 x 2 km Control Zone"
    ]);
    expect(START_GUIDES).toEqual([
      {number: "1", slug: "wardogs-gameplay", anchor: "beginner-guide", titleKey: "beginner"},
      {number: "2", slug: "wardogs-playtest", titleKey: "playtest"},
      {number: "3", slug: "wardogs-gameplay", titleKey: "gameplay"},
      {number: "4", slug: "wardogs-factions", titleKey: "factions"}
    ]);
    expect(facts.every((fact) => typeof fact === "string")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/unit/home-data.test.ts`

Expected: FAIL because the homepage model does not exist.

- [ ] **Step 3: Implement the localized root layout and application shell**

The locale layout must validate `params.locale`, call `setRequestLocale`, generate all four locale params, render `<html lang={locale}>`, load `globals.css`, provide `NextIntlClientProvider`, and include header/footer. Header desktop order is logo + green `Wiki`, Playtest, Release, Steam, Gameplay, Factions, Community, Videos, Guides, locale menu, Steam CTA. Mobile retains logo, Steam icon, locale control, and menu icon; menu/locale controls preserve the current slug and expose keyboard/focus behavior.

- [ ] **Step 4: Implement the approved homepage bands**

Render, in order: full-bleed official-image hero, What is WARDOGS, four Start Here cards, eight category entries, Official Media with the official reveal trailer, confirmed beginner tips, localized FAQ, and final CTA. The hero uses the full-color official wordmark above `Complete Guide`, `Fan-Made Community Wiki`, a status marker, two CTAs, and the four pure-string facts. It must not render a countdown or codes CTA.

```ts
export const HOME_FACT_KEYS = ["earlyAccess", "players", "teams", "controlZone"] as const;
export type HomeFactKey = (typeof HOME_FACT_KEYS)[number];

export function getHomeFacts(translate: (key: HomeFactKey) => string): string[] {
  return HOME_FACT_KEYS.map(translate);
}
```

```tsx
const facts = getHomeFacts((key) => t(`home.stats.${key}`));

<StatsGrid items={facts} />
<OfficialWordmark variant="full" priority decorative />
<h1 className="font-display"><span className="sr-only">WARDOGS </span>{t("home.heroTitle")}</h1>
```

- [ ] **Step 5: Run focused verification**

Run: `npm.cmd run test -- tests/unit/home-data.test.ts`

Expected: PASS.

Run: `npm.cmd run typecheck`

Expected: PASS with the homepage and four static locale params.

- [ ] **Step 6: Commit**

```bash
git add src/app src/components/layout src/components/home src/components/ui/stats-grid.tsx src/components/ui/faq-list.tsx src/features/home tests/unit/home-data.test.ts
git commit -m "feat: build the localized WARDOGS homepage"
```

### Task 11: Twenty-Topic Guide Index

**Files:**
- Create: `src/app/[locale]/guides/page.tsx`
- Create: `src/components/guides/guide-card.tsx`
- Create: `src/components/guides/guide-grid.tsx`
- Create: `src/features/guides/guide-index.ts`
- Test: `tests/unit/guide-index.test.ts`

**Interfaces:**
- Consumes: `listGuideSummaries(locale)`, category translations, and localized `Link`.
- Produces: `buildGuideIndex(locale): Promise<GuideSummary[]>`, stable `GuideCard`, responsive `GuideGrid`, and the localized `/guides` page.

- [ ] **Step 1: Write the failing guide-index test**

```ts
import {describe, expect, it} from "vitest";
import {buildGuideIndex} from "../../src/features/guides/guide-index";

describe("guide index", () => {
  it("returns all 20 cards in manifest order with valid targets", async () => {
    const cards = await buildGuideIndex("en");
    expect(cards).toHaveLength(20);
    expect(cards[0].slug).toBe("wardogs-playtest");
    expect(cards[19].slug).toBe("wardogs-factions");
    expect(cards.every(({title, description, slug}) => Boolean(title && description && slug))).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/unit/guide-index.test.ts`

Expected: FAIL because `buildGuideIndex` does not exist.

- [ ] **Step 3: Implement the guide index and card grid**

The page renders `20 Guide Topics`, localized H1/description, then all cards in manifest order. Each card contains category badge, localized article title, one-sentence description, and text link. Use stable minimum height, 3/2/1 responsive columns, 8 px radius, full server-rendered anchors, and no logo repetition inside cards.

```ts
export async function buildGuideIndex(locale: Locale): Promise<GuideSummary[]> {
  return listGuideSummaries(locale);
}
```

- [ ] **Step 4: Run focused verification**

Run: `npm.cmd run test -- tests/unit/guide-index.test.ts`

Expected: PASS with exactly 20 ordered cards.

Run: `npm.cmd run typecheck`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/guides/page.tsx src/components/guides src/features/guides tests/unit/guide-index.test.ts
git commit -m "feat: add the twenty-topic guide index"
```

### Task 12: Article Renderer, MDX Components, and Related Guides

**Files:**
- Create: `src/app/[locale]/guides/[slug]/page.tsx`
- Create: `src/components/mdx/mdx-components.tsx`
- Create: `src/components/mdx/fact-grid.tsx`
- Create: `src/components/mdx/notice.tsx`
- Create: `src/components/mdx/steps.tsx`
- Create: `src/components/mdx/comparison-table.tsx`
- Create: `src/components/mdx/official-video.tsx`
- Create: `src/components/mdx/source-note.tsx`
- Create: `src/components/guides/source-list.tsx`
- Create: `src/components/guides/related-guides.tsx`
- Create: `src/features/guides/related.ts`
- Test: `tests/unit/related-guides.test.ts`
- Test: `tests/unit/mdx-components.test.tsx`

**Interfaces:**
- Consumes: `loadGuideDocument`, `compileGuideBody`, the manifest, locale params, and localized article labels.
- Produces: 80 generated article routes, `getRelatedGuides(locale, slug, limit = 3)`, and the only permitted MDX component map.

- [ ] **Step 1: Write failing related-guide and MDX-map tests**

```ts
import {describe, expect, it} from "vitest";
import {getRelatedGuides} from "../../src/features/guides/related";
import {mdxComponents} from "../../src/components/mdx/mdx-components";

describe("article helpers", () => {
  it("selects same-category neighbors without returning the current guide", async () => {
    const related = await getRelatedGuides("en", "wardogs-alpha", 3);
    expect(related.map(({slug}) => slug)).toEqual(["wardogs-playtest", "wardogs-beta", "wardogs-alpha-key"]);
  });

  it("exports only the six approved custom MDX components", () => {
    expect(Object.keys(mdxComponents).sort()).toEqual([
      "ComparisonTable", "FactGrid", "Notice", "OfficialVideo", "SourceNote", "Steps"
    ]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm.cmd run test -- tests/unit/related-guides.test.ts tests/unit/mdx-components.test.tsx`

Expected: FAIL because related-guide logic and MDX components do not exist.

- [ ] **Step 3: Implement the six-component MDX surface**

`FactGrid` renders stable fact cells; `Notice` supports `info`, `warning`, and `unavailable`; `Steps` renders an ordered list; `ComparisonTable` wraps an accessible, horizontally scrollable table; `OfficialVideo` accepts only the four approved IDs (`hVtmnaUCpuQ`, `-k6IV0ITLDo`, `eAE9LOV-p3s`, `83AVH6FtemY`) and loads `youtube-nocookie.com` only after activation; `SourceNote` renders a concise attribution block. All components accept text children and preserve server-rendered fallback content.

- [ ] **Step 4: Implement the static article route**

Generate every locale/slug pair. Unknown locale or slug calls `notFound()`. Render breadcrumbs, category/update badges, H1, direct-answer intro and MDX body, source list with type/date, FAQ, deterministic related guides, CTA, and shared footer. Keep content width at `max-w-4xl`; headings use Oswald and body uses Inter.

```ts
export async function generateStaticParams() {
  return locales.flatMap((locale) => guideManifest.map(({slug}) => ({locale, slug})));
}
```

- [ ] **Step 5: Run focused verification**

Run: `npm.cmd run test -- tests/unit/related-guides.test.ts tests/unit/mdx-components.test.tsx`

Expected: PASS.

Run: `npm.cmd run typecheck`

Expected: PASS with all 80 static params.

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/guides/[slug] src/components/mdx src/components/guides/source-list.tsx src/components/guides/related-guides.tsx src/features/guides/related.ts tests/unit/related-guides.test.ts tests/unit/mdx-components.test.tsx
git commit -m "feat: render localized MDX guide articles"
```

### Task 13: Metadata, Structured Data, Policies, Sitemap, and Errors

**Files:**
- Create: `src/lib/metadata.ts`
- Create: `src/lib/structured-data.ts`
- Create: `src/components/seo/json-ld.tsx`
- Create: `src/app/[locale]/privacy/page.tsx`
- Create: `src/app/[locale]/terms/page.tsx`
- Create: `src/app/[locale]/not-found.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/guides/page.tsx`
- Modify: `src/app/[locale]/guides/[slug]/page.tsx`
- Test: `tests/unit/metadata.test.ts`
- Test: `tests/unit/structured-data.test.ts`

**Interfaces:**
- Consumes: locale routing, site origin, messages, manifest, frontmatter FAQ/sources, and local OG image.
- Produces: `buildAlternates(locale, pathname)`, localized page/article metadata, JSON-LD builders, 96 canonical sitemap entries, robots directives, localized policies, and 404 UI.

- [ ] **Step 1: Write failing metadata and sitemap-contract tests**

```ts
import {describe, expect, it} from "vitest";
import {buildAlternates, buildArticleMetadata} from "../../src/lib/metadata";
import {loadGuideDocument} from "../../src/content/guides";

describe("localized metadata", () => {
  it("stays within limits and emits all language alternates", async () => {
    const guide = await loadGuideDocument("en", "wardogs-gameplay");
    const metadata = buildArticleMetadata("en", guide!);
    expect(String(metadata.title).length).toBeLessThanOrEqual(60);
    expect(String(metadata.description).length).toBeGreaterThanOrEqual(140);
    expect(String(metadata.description).length).toBeLessThanOrEqual(160);
    const alternates = buildAlternates("en", "/guides/wardogs-gameplay");
    expect(Object.keys(alternates.languages!)).toEqual(["en", "ru", "de", "pt-BR", "x-default"]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm.cmd run test -- tests/unit/metadata.test.ts tests/unit/structured-data.test.ts`

Expected: FAIL because metadata and JSON-LD builders do not exist.

- [ ] **Step 3: Implement canonical metadata and schema builders**

Require HTTPS `NEXT_PUBLIC_SITE_URL` when `NODE_ENV=production`; use localhost only in development. Emit canonical, `en/ru/de/pt-BR/x-default` alternates, local OG/Twitter image, unique titles/descriptions, and <=100-character keyword strings. Add `Organization`, `WebSite`, `VideoGame`, `FAQPage` on home; `CollectionPage`, `ItemList`, `BreadcrumbList` on index; and `Article`, `BreadcrumbList`, `FAQPage` on articles. The organization description must state that this is an independent fan guide.

- [ ] **Step 4: Implement policy/error routes and discovery files**

Privacy and Terms are fully localized, linked in the footer, and contain no invented business identity. The 404 page offers Home and Guides links. `sitemap.ts` returns 4 home + 4 index + 80 article + 8 policy entries, all with locale alternates. `/` is represented by `/en` as the canonical `x-default`, so the sitemap contains 96 URLs rather than a duplicate redirect entry. `robots.ts` allows `/`, references `${origin}/sitemap.xml`, and blocks no public guide route.

- [ ] **Step 5: Run focused verification**

Run: `npm.cmd run test -- tests/unit/metadata.test.ts tests/unit/structured-data.test.ts`

Expected: PASS with limit, alternate, and schema assertions.

Run: `npm.cmd run typecheck`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib src/components/seo src/app tests/unit/metadata.test.ts tests/unit/structured-data.test.ts
git commit -m "feat: add localized SEO and policy routes"
```

### Task 14: Public External-Link Integrity

**Files:**
- Create: `scripts/check-external-links.mjs`
- Create: `scripts/check-external-links.d.mts`
- Create: `tests/unit/external-link-checker.test.ts`
- Modify: `tests/content/content-matrix.test.ts`

**Interfaces:**
- Consumes: `config/official-links.json`, all MDX frontmatter sources, and global `fetch`.
- Produces: `collectPublicUrls(root)`, `checkUrl(url, fetchImpl)`, and the network-backed `npm.cmd run links:check` release gate.

- [ ] **Step 1: Write the failing checker test**

```ts
import {describe, expect, it, vi} from "vitest";

describe("external link checker", () => {
  it("falls back from rejected HEAD to a successful GET", async () => {
    const {checkUrl} = await import("../../scripts/check-external-links.mjs");
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response(null, {status: 405}))
      .mockResolvedValueOnce(new Response("ok", {status: 200}));
    await expect(checkUrl("https://example.com/page", fetchImpl)).resolves.toMatchObject({status: 200, method: "GET"});
    expect(fetchImpl).toHaveBeenNthCalledWith(1, "https://example.com/page", expect.objectContaining({method: "HEAD"}));
  });

  it("reports a 404 as a hard failure", async () => {
    const {checkUrl} = await import("../../scripts/check-external-links.mjs");
    const fetchImpl = vi.fn().mockResolvedValue(new Response("missing", {status: 404}));
    await expect(checkUrl("https://example.com/missing", fetchImpl)).rejects.toThrow(/404/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/unit/external-link-checker.test.ts`

Expected: FAIL because the checker module does not exist.

- [ ] **Step 3: Implement deterministic URL collection and checking**

Parse every MDX file with `gray-matter`, merge `sources[].url` with `official-links.json`, normalize and deduplicate URLs, reject non-HTTPS and competitor hosts before network access, then check with HEAD. For any non-2xx/3xx HEAD response, retry with GET and `redirect: "follow"`; retry 429 and 5xx responses twice with 500 ms and 1,000 ms delays. Exit nonzero and print each original URL/final status when any URL remains broken.

```js
export async function checkUrl(url, fetchImpl = fetch) {
  const head = await fetchImpl(url, {method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(15_000)});
  if (head.ok || (head.status >= 300 && head.status < 400)) return {url, status: head.status, method: "HEAD"};
  const get = await fetchImpl(url, {method: "GET", redirect: "follow", signal: AbortSignal.timeout(20_000)});
  if (!get.ok) throw new Error(`${url} returned ${get.status}`);
  return {url, status: get.status, method: "GET"};
}
```

Declare the JavaScript module for project typechecking:

```ts
// scripts/check-external-links.d.mts
export type LinkCheckResult = {url: string; status: number; method: "HEAD" | "GET"};
export function collectPublicUrls(root?: string): Promise<string[]>;
export function checkUrl(url: string, fetchImpl?: typeof fetch): Promise<LinkCheckResult>;
```

- [ ] **Step 4: Run unit and live-link verification**

Run: `npm.cmd run test -- tests/unit/external-link-checker.test.ts`

Expected: PASS with HEAD fallback and 404 rejection.

Run: `npm.cmd run links:check`

Expected: PASS; every public source and official/community link resolves without a final 4xx/5xx response.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-external-links.mjs scripts/check-external-links.d.mts tests/unit/external-link-checker.test.ts tests/content/content-matrix.test.ts
git commit -m "test: enforce public external link integrity"
```

### Task 15: Route, Responsive, Visual, and Accessibility Tests

**Files:**
- Create: `tests/e2e/routes.spec.ts`
- Create: `tests/e2e/navigation.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/visual.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/helpers.ts`
- Create: `tests/e2e/visual.spec.ts-snapshots/*`
- Modify: `playwright.config.ts`

**Interfaces:**
- Consumes: the complete statically renderable application and Playwright web server.
- Produces: route crawl, locale-preserving navigation, keyboard behavior, overlap checks, screenshot baselines, image-pixel checks, and axe release gates.

- [ ] **Step 1: Write failing route and locale tests**

```ts
import {expect, test} from "@playwright/test";

test("root redirects and every primary page resolves", async ({page}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  for (const path of ["/en", "/en/guides", "/en/guides/wardogs-gameplay"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
  }
  expect((await page.goto("/en/guides/not-a-topic"))?.status()).toBe(404);
});

test("locale switching preserves the article slug", async ({page}) => {
  await page.goto("/en/guides/wardogs-gameplay");
  await page.getByRole("button", {name: /language/i}).click();
  await page.getByRole("link", {name: /Deutsch/i}).click();
  await expect(page).toHaveURL(/\/de\/guides\/wardogs-gameplay$/);
});
```

- [ ] **Step 2: Run the route test to verify it fails before E2E hardening**

Run: `npm.cmd run test:e2e -- tests/e2e/routes.spec.ts`

Expected: FAIL on at least one missing redirect, localized label, 404 boundary, or server configuration issue.

- [ ] **Step 3: Add complete route and interaction coverage**

Iterate all four home/index routes and all 80 article routes, assert 200, crawl all 20 index links per locale, assert unsupported locale/slug 404, and verify desktop/mobile nav. Test mobile-menu and FAQ `aria-expanded`, Escape closure, focus return, and 44 px targets. Use only role/label/test-id locators that reflect user-visible semantics.

- [ ] **Step 4: Add visual, pixel, overlap, and axe checks**

Capture homepage, guide index, and gameplay article at 390 x 844 and 1440 x 1200; also run layout checks at 768 x 1024 and 1920 x 1200. Assert logo/hero images have `naturalWidth > 0`, hero screenshots contain non-uniform pixels, and bounding boxes for header controls, hero copy, CTAs, grid cards, headings, and footer links do not intersect. Run axe on the three page types in each locale and fail on serious/critical violations.

```ts
const violations = (await new AxeBuilder({page}).analyze()).violations
  .filter(({impact}) => impact === "serious" || impact === "critical");
expect(violations).toEqual([]);
```

- [ ] **Step 5: Generate, inspect, and lock screenshot baselines**

Run: `npm.cmd run test:e2e -- tests/e2e/visual.spec.ts --update-snapshots`

Expected: six baseline PNGs are generated. Inspect each at original resolution and correct any clipping, blank imagery, translated-text overflow, or incoherent overlap before accepting the baseline.

- [ ] **Step 6: Run all E2E tests**

Run: `npm.cmd run test:e2e`

Expected: PASS in Chromium for routes, navigation, keyboard controls, all target viewports, screenshots, image rendering, and axe checks.

- [ ] **Step 7: Commit**

```bash
git add tests/e2e playwright.config.ts
git commit -m "test: cover WARDOGS routes visuals and accessibility"
```

### Task 16: Production Verification and Local Handoff

**Files:**
- Create: `README.md`
- Create: `tests/unit/readme.test.ts`
- Test: all configured unit, content, link, E2E, type, lint, and production-build gates

**Interfaces:**
- Consumes: the complete application and `NEXT_PUBLIC_SITE_URL`.
- Produces: documented local/production commands, a verified production build, and a live local review URL.

- [ ] **Step 1: Write the failing documentation contract test**

```ts
import {readFile} from "node:fs/promises";
import {describe, expect, it} from "vitest";

describe("project handoff", () => {
  it("documents setup, content rules, verification, and deployment origin", async () => {
    const readme = await readFile("README.md", "utf8");
    for (const phrase of [
      "NEXT_PUBLIC_SITE_URL",
      "npm.cmd run content:validate",
      "npm.cmd run links:check",
      "npm.cmd run test:e2e",
      "20 topics x 4 locales",
      "WARDOGS is a fan-made guide"
    ]) expect(readme).toContain(phrase);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm.cmd run test -- tests/unit/readme.test.ts`

Expected: FAIL because `README.md` does not exist. Save the test as `tests/unit/readme.test.ts` before running.

- [ ] **Step 3: Write the operational README**

Document Node >=20.9, `npm.cmd install`, local development, production origin, the exact 20-topic x 4-locale MDX rule, frontmatter/source constraints, official-asset provenance, fan-site disclaimer, all seven completion commands, and build/start commands. State that changing `keywords.json` requires synchronized content and tests rather than automatic route expansion.

- [ ] **Step 4: Run the complete release gate in this order**

```text
npm.cmd run content:validate
npm.cmd run links:check
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run test:e2e
$env:NEXT_PUBLIC_SITE_URL='https://wardogs.example'
npm.cmd run build
```

Expected: every command exits 0; Next reports all localized home/index/policy routes and 80 article routes as statically generated; no source, metadata, accessibility, route, image, or visual test fails.

- [ ] **Step 5: Commit the verified handoff**

```bash
git add README.md tests/unit/readme.test.ts
git commit -m "docs: add WARDOGS wiki operating guide"
```

- [ ] **Step 6: Start the development server and perform the final browser pass**

Run: `npm.cmd run dev -- --hostname 127.0.0.1 --port 3000`

Expected: leave the server running and review `http://127.0.0.1:3000/en`, `http://127.0.0.1:3000/en/guides`, and `http://127.0.0.1:3000/en/guides/wardogs-gameplay`. If port 3000 is occupied, use port 3001 and report that exact URL.
