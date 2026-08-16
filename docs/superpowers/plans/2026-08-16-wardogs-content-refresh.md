# WARDOGS Content Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the highest-value WARDOGS guide pages with newly verified Early Access, economy, pricing, creator footage, and console/input context.

**Architecture:** Keep the update inside existing MDX guide pages and one content regression test. Do not add new routes, keywords, or data-catalogue pages until Search Console demand supports them.

**Tech Stack:** Next.js, MDX content files, Vitest content validation.

## Global Constraints

- Do not copy competitor prose or tables; use original guide copy.
- Treat alpha footage and creator impressions as build-sensitive, not final specifications.
- Use official Steam, Team17, BULKHEAD, or clearly attributed devlog/press sources for dates, prices, and release claims.
- Do not change the current 20-keyword matrix.

---

### Task 1: Add Content Regression Coverage

**Files:**
- Modify: `tests/content/seo-priority-pages.test.ts`

**Interfaces:**
- Consumes: `loadGuideDocument(locale, slug)` from `src/content/guides`.
- Produces: a failing test that requires the refreshed pages to contain the new strategic facts.

- [ ] **Step 1: Write the failing test**

```ts
it("keeps refreshed WARDOGS source-driven guide facts visible", async () => {
  const expectations = [
    ["wardogs-gameplay", "one-time starting cash"],
    ["wardogs-early-access", "37 weapons"],
    ["wardogs-price", "$59.99"],
    ["wardogs-first-look", "10 Reasons NOT to Buy"],
    ["wardogs-ps5", "controller support"],
  ] as const;

  for (const [slug, phrase] of expectations) {
    const guide = await loadGuideDocument("en", slug);
    const text = `${guide?.frontmatter.title}\n${guide?.frontmatter.description}\n${guide?.body}`;
    expect(text, `${slug} should include ${phrase}`).toContain(phrase);
  }
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm run content:validate -- tests/content/seo-priority-pages.test.ts`

Expected: FAIL because the new phrases are not all present yet.

### Task 2: Refresh Existing MDX Guides

**Files:**
- Modify: `content/en/guides/wardogs-gameplay.mdx`
- Modify: `content/en/guides/wardogs-early-access.mdx`
- Modify: `content/en/guides/wardogs-price.mdx`
- Modify: `content/en/guides/wardogs-first-look.mdx`
- Modify: `content/en/guides/wardogs-ps5.mdx`

**Interfaces:**
- Consumes: existing frontmatter schema and MDX conventions.
- Produces: original content updates that satisfy the regression test and content validator.

- [ ] **Step 1: Update gameplay**

Add one-time starting cash, persistent wallet, cheap-vs-expensive loadouts, Hot Zone, FOB, artillery, and mortars context.

- [ ] **Step 2: Update early access**

Add the 37 weapons, 21 vehicles, 3 maps with 3 variations claim as developer/devlog-reported context, plus expectation management for content cadence.

- [ ] **Step 3: Update price**

Add the pricing ladder context: $39.99 Early Access, $49.99 Supporter Edition, and developer-stated $59.99 full-release target as a plan rather than a guaranteed future charge.

- [ ] **Step 4: Update first-look**

Add new creator/devlog video references and summarize what each adds without copying transcript text.

- [ ] **Step 5: Update PS5**

Add controller support caveat and keep platform/crossplay claims constrained to currently announced PC Steam scope.

### Task 3: Verify and Ship

**Files:**
- Test: `tests/content/seo-priority-pages.test.ts`
- Test: full content validation and production build.

**Interfaces:**
- Produces: verified content ready to push.

- [ ] **Step 1: Run focused content test**

Run: `npm run content:validate -- tests/content/seo-priority-pages.test.ts`

Expected: PASS.

- [ ] **Step 2: Run full validation**

Run: `npm run content:validate`

Expected: PASS.

- [ ] **Step 3: Run lint and build**

Run: `npm run lint`

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Commit and push**

Run: `git add tests/content/seo-priority-pages.test.ts content/en/guides/wardogs-gameplay.mdx content/en/guides/wardogs-early-access.mdx content/en/guides/wardogs-price.mdx content/en/guides/wardogs-first-look.mdx content/en/guides/wardogs-ps5.mdx docs/superpowers/plans/2026-08-16-wardogs-content-refresh.md`

Run: `git commit -m "feat: refresh wardogs guide content"`

Run: `git push origin feature/wardogs-wiki:main`

Expected: GitHub and Vercel receive the refreshed content.
