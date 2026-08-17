# Adsterra Native Banner Design

## Goal

Add the supplied Adsterra Native Banner to high-intent content pages without placing ads in the site header, homepage, or catalogue/index pages.

## Placement

Render one native banner after the Quick Answer block and before the main body on:

- Guide detail pages
- Video detail pages
- Item detail pages

Do not render it on home, guide indexes, video indexes, news, legal pages, or catalogue category pages.

## Component Design

Create one reusable client-side ad slot. On mount it inserts the supplied asynchronous script immediately before the required Adsterra container. This allows the script to execute again after a Next.js client-side route change.

The component will:

- Use zone ID `481d6501bcd0c27b98bc3c4776a26f6e`.
- Load `https://pl30888081.effectivecpmnetwork.com/481d6501bcd0c27b98bc3c4776a26f6e/invoke.js`.
- Set `async` and `data-cfasync="false"` before assigning the script URL.
- Reserve a bounded responsive area to reduce layout movement.
- Display a localized advertisement label.
- Hide the slot if the script errors or produces no content within a short timeout.
- Remove injected content and the script element when the slot unmounts.

## Privacy

Update the localized privacy text to disclose that a third-party advertising provider may process technical request data and apply its own privacy controls when ads load.

## Verification

- Unit-test the loader configuration, lifecycle cleanup, and failed-load behavior.
- Verify the ad slot appears in all three detail templates and nowhere else.
- Run lint, type checking, focused tests, and a production build.
- Verify the generated detail-page HTML contains the ad container while homepage and index output do not.

## Deployment

Commit only the ad integration and related documentation/tests, preserving unrelated catalogue and image work already present in the worktree. Push the production-connected branch after verification.
